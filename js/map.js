/**
 * The Terrain - Interactive Map Engine
 * Powered by Leaflet.js with custom styled vector/raster basemaps, SVG markers, and animated clustering.
 */

class TerrainMap {
  constructor(containerId) {
    this.containerId = containerId;
    this.map = null;
    this.clusterGroup = null;
    this.markerMap = new Map(); // id -> L.marker
    this.activeParkId = null;
    this.activePulseCircle = null;
    this.listeners = [];

    this.basemaps = {};
    this.currentBasemapName = "terrain";

    this.initMap();
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  notify(event, data) {
    this.listeners.forEach(fn => fn(event, data));
  }

  initMap() {
    // Initial view centered on North America
    this.map = L.map(this.containerId, {
      center: [44.5, -99.0],
      zoom: 4,
      minZoom: 3,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    // Custom positioned zoom control
    L.control.zoom({ position: "bottomright" }).addTo(this.map);

    // Attribution control
    L.control.attribution({ position: "bottomleft" })
      .addAttribution('&copy; <a href="https://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors | Esri | CartoDB')
      .addTo(this.map);

    // Setup basemap layers
    this.basemaps = {
      terrain: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 18,
        attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
      }),
      voyager: L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 19,
        attribution: "&copy; CartoDB"
      }),
      satellite: L.layerGroup([
        L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
          maxZoom: 18
        }),
        L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
          maxZoom: 18
        })
      ]),
      dark: L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 19,
        attribution: "&copy; CartoDB"
      })
    };

    // Load user basemap preference
    const savedBasemap = (window.storage && window.storage.getBasemap()) || "terrain";
    this.setBasemap(savedBasemap);

    // Setup marker cluster group
    this.clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 42,
      spiderfyOnMaxZoom: true,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        let sizeClass = "cluster-small";
        if (count > 20) sizeClass = "cluster-large";
        else if (count > 8) sizeClass = "cluster-medium";

        return L.divIcon({
          html: `<div class="terrain-cluster ${sizeClass}"><span>${count}</span></div>`,
          className: "terrain-cluster-wrapper",
          iconSize: L.point(42, 42)
        });
      }
    });

    this.map.addLayer(this.clusterGroup);

    // Map click outside of pins
    this.map.on("click", (e) => {
      if (e.originalEvent.target.id === this.containerId || e.originalEvent.target.classList.contains("leaflet-container")) {
        this.clearActivePark();
      }
    });
  }

  setBasemap(name) {
    if (!this.basemaps[name]) name = "terrain";
    
    Object.values(this.basemaps).forEach(layer => {
      if (this.map.hasLayer(layer)) {
        this.map.removeLayer(layer);
      }
    });

    this.basemaps[name].addTo(this.map);
    this.currentBasemapName = name;

    if (window.storage) {
      window.storage.setBasemap(name);
    }
  }

  // Generate SVG custom DivIcon with Visited Stamp indicator
  createParkIcon(park, isSelected = false) {
    const isNational = park.type === "national";
    const isVisited = window.storage ? window.storage.isVisited(park.id) : false;
    const typeClass = isNational ? "type-national" : "type-state";
    const activeClass = isSelected ? "is-selected" : "";
    const visitedClass = isVisited ? "is-visited" : "";

    const iconSvg = isNational
      ? `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2L4 14h4l-3 6h14l-3-6h4L12 2zm-1 18h2v3h-2v-3z"/></svg>`
      : `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/></svg>`;

    const visitedBadge = isVisited
      ? `<div class="marker-visited-stamp" title="Visited & Stamped!">✓</div>`
      : "";

    const html = `
      <div class="park-marker-pin ${typeClass} ${activeClass} ${visitedClass}" data-park-id="${park.id}">
        <div class="marker-pulse"></div>
        <div class="marker-badge">
          ${iconSvg}
          ${visitedBadge}
        </div>
        <div class="marker-tip"></div>
      </div>
    `;

    return L.divIcon({
      html: html,
      className: "park-div-icon",
      iconSize: [34, 42],
      iconAnchor: [17, 40],
      popupAnchor: [0, -36]
    });
  }

  // Update map with filtered parks
  updateParks(parks) {
    this.clusterGroup.clearLayers();
    this.markerMap.clear();

    parks.forEach(park => {
      const isSelected = park.id === this.activeParkId;
      const marker = L.marker(park.coordinates, {
        icon: this.createParkIcon(park, isSelected),
        title: park.name
      });

      const flag = park.country === "US" ? "🇺🇸" : "🇨🇦";
      const typeLabel = park.type === "national" ? "National Park" : "State / Provincial Park";
      const isVisited = window.storage ? window.storage.isVisited(park.id) : false;
      const visitDetails = isVisited ? window.storage.getVisitDetails(park.id) : null;

      const visitedStatusHtml = isVisited
        ? `<div class="map-tooltip-visited">★ Stamped in Passport: ${visitDetails?.date || "Visited"}</div>`
        : "";

      const tooltipContent = `
        <div class="map-tooltip-content">
          <div class="map-tooltip-img" style="background-image: url('${park.heroImage}')"></div>
          <div class="map-tooltip-body">
            <span class="map-tooltip-badge ${park.type}">${flag} ${typeLabel}</span>
            <h4 class="map-tooltip-title">${park.name}</h4>
            <p class="map-tooltip-loc">📍 ${park.stateProvince}</p>
            ${visitedStatusHtml}
          </div>
        </div>
      `;

      marker.bindTooltip(tooltipContent, {
        direction: "top",
        offset: [0, -36],
        className: "custom-park-tooltip",
        opacity: 1
      });

      marker.on("click", () => {
        this.selectPark(park.id, true);
      });

      this.markerMap.set(park.id, marker);
      this.clusterGroup.addLayer(marker);
    });

    if (this.activeParkId && this.markerMap.has(this.activeParkId)) {
      this.highlightMarker(this.activeParkId);
    }
  }

  selectPark(parkId, notifyListeners = true) {
    const park = (window.PARKS_DATA || []).find(p => p.id === parkId);
    if (!park) return;

    this.activeParkId = parkId;
    this.highlightMarker(parkId);

    const targetZoom = Math.max(this.map.getZoom(), 8);
    this.map.flyTo(park.coordinates, targetZoom, {
      duration: 1.2,
      easeLinearity: 0.25
    });

    this.addPulseCircle(park.coordinates);

    if (notifyListeners) {
      this.notify("park_selected", park);
    }
  }

  highlightMarker(parkId) {
    this.markerMap.forEach((marker, id) => {
      const park = (window.PARKS_DATA || []).find(p => p.id === id);
      if (park) {
        marker.setIcon(this.createParkIcon(park, id === parkId));
      }
    });
  }

  addPulseCircle(coords) {
    if (this.activePulseCircle) {
      this.map.removeLayer(this.activePulseCircle);
    }

    this.activePulseCircle = L.circleMarker(coords, {
      radius: 24,
      className: "active-park-pulse-layer",
      color: "#22c55e",
      weight: 3,
      fillColor: "#22c55e",
      fillOpacity: 0.2
    }).addTo(this.map);

    setTimeout(() => {
      if (this.activePulseCircle) {
        this.map.removeLayer(this.activePulseCircle);
        this.activePulseCircle = null;
      }
    }, 3000);
  }

  clearActivePark() {
    this.activeParkId = null;
    this.markerMap.forEach((marker, id) => {
      const park = (window.PARKS_DATA || []).find(p => p.id === id);
      if (park) {
        marker.setIcon(this.createParkIcon(park, false));
      }
    });

    if (this.activePulseCircle) {
      this.map.removeLayer(this.activePulseCircle);
      this.activePulseCircle = null;
    }

    this.notify("park_deselected", null);
  }

  fitBoundsToVisible() {
    if (this.clusterGroup && this.clusterGroup.getLayers().length > 0) {
      const bounds = this.clusterGroup.getBounds();
      if (bounds.isValid()) {
        this.map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 12,
          animate: true,
          duration: 1
        });
      }
    }
  }

  recenter() {
    this.map.flyTo([44.5, -99.0], 4, {
      duration: 1
    });
  }
}

if (typeof window !== "undefined") {
  window.TerrainMap = TerrainMap;
}
