/**
 * PathFinder - Leaflet Map Engine
 * Manages high-definition ArcGIS Topo Terrain basemaps, custom park markers, clustering, smooth pans, hover tooltips, and interactive detail popups.
 */

function getFlagSvg(country) {
  if (country === "US") {
    return `<svg class="country-flag-svg" viewBox="0 0 640 480" width="15" height="11" aria-label="USA" style="display:inline-block; border-radius:2px; vertical-align:middle; margin-right:4px; box-shadow:0 1px 3px rgba(0,0,0,0.3);"><g fill-rule="evenodd"><path fill="#bd3d44" d="M0 0h640v480H0z"/><path stroke="#fff" stroke-width="37" d="M0 55.5h640M0 129h640M0 203h640M0 277h640M0 351h640M0 424.5h640"/><path fill="#192f5d" d="M0 0h296v259H0z"/></g></svg>`;
  } else {
    return `<svg class="country-flag-svg" viewBox="0 0 640 480" width="15" height="11" aria-label="Canada" style="display:inline-block; border-radius:2px; vertical-align:middle; margin-right:4px; box-shadow:0 1px 3px rgba(0,0,0,0.3);"><g fill-rule="evenodd"><path fill="#f00" d="M0 0h640v480H0z"/><path fill="#fff" d="M160 0h320v480H160z"/><path fill="#f00" d="m320 80 18 54 50-20-16 48 54 8-36 38 40 38-54 8 10 50-48-26-18 62-18-62-48 26 10-50-54-8 40-38-36-38 54-8-16-48 50 20z"/></g></svg>`;
  }
}

class TerrainMap {
  constructor(containerId = "map") {
    this.containerId = containerId;
    this.map = null;
    this.clusterGroup = null;
    this.markerMap = new Map();
    this.activeParkId = null;
    this.activePulseCircle = null;
    this.justClickedMarker = false;
    this.listeners = [];

    // High-Definition Basemap tile layers
    this.basemaps = {
      terrain: L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 18,
        attribution: "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, METI, TomTom"
      }),
      voyager: L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        subdomains: "abcd",
        maxZoom: 19,
        attribution: "&copy; CartoDB"
      }),
      satellite: L.layerGroup([
        L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
          maxZoom: 18,
          attribution: "&copy; Esri"
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

    this.currentBasemapName = "terrain";
    this.initMap();
  }

  initMap() {
    // Initial center on North America (US / Canada)
    this.map = L.map(this.containerId, {
      center: [44.5, -99.0],
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
        if (count > 20) sizeClass = "cluster-large";
        else if (count > 8) sizeClass = "cluster-medium";

        return L.divIcon({
          html: `<div class="terrain-cluster ${sizeClass}"><span>${count}</span></div>`,
          className: "terrain-cluster-wrapper",
          iconSize: L.point(40, 40)
        });
      }
    });

    this.map.addLayer(this.clusterGroup);

    // Map click on background only to deselect
    this.map.on("click", (e) => {
      if (this.justClickedMarker) return;
      if (e.originalEvent && (e.originalEvent.target.id === this.containerId || e.originalEvent.target.classList.contains("leaflet-container"))) {
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

      const flag = getFlagSvg(park.country);
      const typeLabel = park.type === "national" ? "National Park" : "State / Provincial";
      const isVisited = window.storage ? window.storage.isVisited(park.id) : false;
      const visitDetails = isVisited ? window.storage.getVisitDetails(park.id) : null;

      const visitedStatusHtml = isVisited
        ? `<div class="map-tooltip-visited">✓ Visited ${visitDetails?.date ? `(${visitDetails.date})` : ''}</div>`
        : "";

      // Generous tooltip on hover with clean wrapping
      const tooltipContent = `
        <div class="map-tooltip-content">
          <div class="map-tooltip-img" style="background-image: url('${park.heroImage}')"></div>
          <div class="map-tooltip-body">
            <span class="map-tooltip-badge ${park.type}">${flag}<span>${typeLabel}</span></span>
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

      // Interactive Popup on Click
      const popupContent = `
        <div class="map-popup-card" data-popup-park-id="${park.id}">
          <div class="map-popup-img" style="background-image: url('${park.heroImage}')"></div>
          <div class="map-popup-body">
            <span class="map-popup-badge ${park.type}">${flag}<span>${typeLabel}</span></span>
            <h4 class="map-popup-title">${park.name}</h4>
            <p class="map-popup-loc">📍 ${park.stateProvince}, ${park.country === "US" ? "USA" : "Canada"}</p>
            <p class="map-popup-desc">${park.description ? park.description.slice(0, 110) + '...' : ''}</p>
            <div class="map-popup-actions">
              <button class="map-popup-view-btn" onclick="window.terrainUI && window.terrainUI.openDrawer(window.PARKS_DATA.find(p => p.id === '${park.id}'))">
                Explore Full Details ➔
              </button>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        offset: [0, -30],
        className: "custom-park-popup",
        maxWidth: 280,
        autoPan: true,
        autoPanPadding: [50, 50]
      });

      // Marker Click Event: Prevents bubbling, highlights, flies, and opens drawer
      marker.on("click", (e) => {
        if (e && e.originalEvent) {
          L.DomEvent.stopPropagation(e.originalEvent);
        }
        this.justClickedMarker = true;
        setTimeout(() => { this.justClickedMarker = false; }, 350);
        this.selectPark(park.id, true);
        if (window.terrainUI) {
          window.terrainUI.openDrawer(park);
          window.terrainUI.highlightActiveCard(park.id);
        }
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
    const targetZoom = Math.max(this.map.getZoom(), 8);
    this.map.flyTo(park.coordinates, targetZoom, {
      duration: 1.2,
      easeLinearity: 0.25
    });

    // Add animated ripple pulse circle
    this.addPulseCircle(park.coordinates);

    // Open marker popup
    const marker = this.markerMap.get(parkId);
    if (marker && !marker.isPopupOpen()) {
      marker.openPopup();
    }

    if (notifyListeners) {
      this.notify("park_selected", park);
    }
  }

  addPulseCircle(coords) {
    if (this.activePulseCircle) {
      this.map.removeLayer(this.activePulseCircle);
    }

    this.activePulseCircle = L.circleMarker(coords, {
      radius: 26,
      className: "active-park-pulse-layer",
      color: "#22c55e",
      weight: 3,
      fillColor: "#22c55e",
      fillOpacity: 0.25
    }).addTo(this.map);

    // Fade out after 3 seconds
    setTimeout(() => {
      if (this.activePulseCircle) {
        this.map.removeLayer(this.activePulseCircle);
        this.activePulseCircle = null;
      }
    }, 3000);
  }

  deselectPark() {
    if (!this.activeParkId) return;
    const oldId = this.activeParkId;
    this.activeParkId = null;
    this.highlightMarker(null);

    if (this.activePulseCircle) {
      this.map.removeLayer(this.activePulseCircle);
      this.activePulseCircle = null;
    }

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
    this.map.flyTo([44.5, -99.0], 4, { duration: 1 });
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
