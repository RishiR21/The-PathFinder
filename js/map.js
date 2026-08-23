/**
 * The Terrain - Leaflet Map Engine
 * Manages basemaps, custom park markers, clustering, smooth pans, and hover tooltips.
 */

class TerrainMap {
  constructor(containerId = "map") {
    this.containerId = containerId;
    this.map = null;
    this.clusterGroup = null;
    this.markerMap = new Map();
    this.activeParkId = null;
    this.listeners = [];

    // Basemap tile layers
    this.basemaps = {
      terrain: L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
        maxZoom: 17,
        attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
      }),
      voyager: L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
      }),
      satellite: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
      }),
      dark: L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>'
      })
    };

    this.currentBasemapName = "terrain";
    this.initMap();
  }

  initMap() {
    // Initial center on North America (US / Canada)
    this.map = L.map(this.containerId, {
      center: [48.0, -100.0],
      zoom: 4,
      minZoom: 3,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    // Add Zoom Control to bottom-right
    L.control.zoom({ position: "bottomright" }).addTo(this.map);

    // Set initial basemap
    const savedBasemap = (window.storage && window.storage.getBasemap()) || "terrain";
    this.setBasemap(savedBasemap);

    // Initialize Marker Clustering with custom nature styling
    this.clusterGroup = L.markerClusterGroup({
      showCoverageOnHover: false,
      maxClusterRadius: 42,
      spiderfyOnMaxZoom: true,
      zoomToBoundsOnClick: true,
      iconCreateFunction: (cluster) => {
        const count = cluster.getChildCount();
        let sizeClass = "cluster-small";
        if (count > 15) sizeClass = "cluster-large";
        else if (count > 6) sizeClass = "cluster-medium";

        return L.divIcon({
          html: `<div class="terrain-cluster ${sizeClass}"><span>${count}</span></div>`,
          className: "terrain-cluster-wrapper",
          iconSize: L.point(40, 40)
        });
      }
    });

    this.map.addLayer(this.clusterGroup);

    // Click outside to deselect
    this.map.on("click", (e) => {
      if (e.originalEvent.target.id === this.containerId || e.originalEvent.target.classList.contains("leaflet-container")) {
        this.deselectPark();
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

  // Generate SVG custom DivIcon with Visited indicator
  createParkIcon(park, isSelected = false) {
    const isNational = park.type === "national";
    const isVisited = window.storage ? window.storage.isVisited(park.id) : false;
    const typeClass = isNational ? "type-national" : "type-state";
    const activeClass = isSelected ? "is-selected" : "";
    const visitedClass = isVisited ? "is-visited" : "";

    const iconSvg = isNational
      ? `<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M12 2L4 14h4l-3 6h14l-3-6h4L12 2zm-1 18h2v3h-2v-3z"/></svg>`
      : `<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66l.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/></svg>`;

    const visitedBadge = isVisited
      ? `<div class="marker-visited-stamp" title="Visited">✓</div>`
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
      iconSize: [32, 38],
      iconAnchor: [16, 36],
      popupAnchor: [0, -34]
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
      const typeLabel = park.type === "national" ? "National Park" : "State / Provincial";
      const isVisited = window.storage ? window.storage.isVisited(park.id) : false;
      const visitDetails = isVisited ? window.storage.getVisitDetails(park.id) : null;

      const visitedStatusHtml = isVisited
        ? `<div class="map-tooltip-visited">✓ Visited ${visitDetails?.date ? `(${visitDetails.date})` : ''}</div>`
        : "";

      // Generous tooltip width with clean wrapping so park names never get cut off
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
        offset: [0, -32],
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

    // Pan smoothly to marker
    this.map.flyTo(park.coordinates, Math.max(this.map.getZoom(), 7), {
      duration: 1.2,
      easeLinearity: 0.25
    });

    if (notifyListeners) {
      this.notify("park_selected", park);
    }
  }

  deselectPark() {
    if (!this.activeParkId) return;
    const oldId = this.activeParkId;
    this.activeParkId = null;
    this.highlightMarker(null);
    this.notify("park_deselected", oldId);
  }

  highlightMarker(parkId) {
    this.markerMap.forEach((marker, id) => {
      const park = (window.PARKS_DATA || []).find(p => p.id === id);
      if (park) {
        const isSelected = id === parkId;
        marker.setIcon(this.createParkIcon(park, isSelected));
        if (isSelected) {
          marker.setZIndexOffset(1000);
        } else {
          marker.setZIndexOffset(0);
        }
      }
    });
  }

  fitBoundsToVisible() {
    if (this.markerMap.size === 0) return;
    const latLngs = [];
    this.markerMap.forEach(marker => {
      latLngs.push(marker.getLatLng());
    });
    if (latLngs.length > 0) {
      const bounds = L.latLngBounds(latLngs);
      this.map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
    }
  }

  recenter() {
    this.map.flyTo([48.0, -100.0], 4, { duration: 1 });
  }

  subscribe(callback) {
    if (typeof callback === "function") {
      this.listeners.push(callback);
    }
  }

  notify(event, data) {
    this.listeners.forEach(cb => {
      try {
        cb(event, data);
      } catch (e) {
        console.error("Map listener error:", e);
      }
    });
  }
}

if (typeof window !== "undefined") {
  window.TerrainMap = TerrainMap;
}
