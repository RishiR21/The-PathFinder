/**
 * The Terrain - UI Controller
 * Manages map views, sidebar cards, park detail drawer, wishlist, personal travel journey, and toasts.
 */

class TerrainUI {
  constructor(mapInstance, filterInstance) {
    this.map = mapInstance;
    this.filter = filterInstance;
    this.activePark = null;
    window.terrainUI = this;

    this.dom = {
      // Containers & Views
      parksListContainer: document.getElementById("parks-list-container"),
      resultsCounter: document.getElementById("results-counter"),
      emptyState: document.getElementById("empty-state"),
      navBrandLogo: document.getElementById("nav-brand-logo"),

      // Header Buttons
      journeyModalBtn: document.getElementById("journey-modal-btn"),
      journeyBadgeCount: document.getElementById("journey-badge-count"),
      wishlistToggleBtn: document.getElementById("wishlist-toggle-btn"),
      wishlistBadgeCount: document.getElementById("wishlist-badge-count"),
      surpriseBtn: document.getElementById("surprise-me-btn"),
      aboutModalBtn: document.getElementById("about-modal-btn"),

      // Detail Drawer
      detailDrawer: document.getElementById("detail-drawer"),
      drawerOverlay: document.getElementById("drawer-overlay"),
      drawerCloseBtn: document.getElementById("drawer-close-btn"),
      drawerHeroImg: document.getElementById("drawer-hero-img"),
      drawerTitle: document.getElementById("drawer-title"),
      drawerCountryBadge: document.getElementById("drawer-country-badge"),
      drawerTypeBadge: document.getElementById("drawer-type-badge"),
      drawerLocation: document.getElementById("drawer-location"),
      drawerStatEst: document.getElementById("drawer-stat-est"),
      drawerStatArea: document.getElementById("drawer-stat-area"),
      drawerStatVisitors: document.getElementById("drawer-stat-visitors"),
      drawerStatCoords: document.getElementById("drawer-stat-coords"),
      drawerDesc: document.getElementById("drawer-desc"),
      drawerHighlights: document.getElementById("drawer-highlights"),
      drawerTags: document.getElementById("drawer-tags"),
      drawerBestSeason: document.getElementById("drawer-best-season"),
      drawerClimate: document.getElementById("drawer-climate"),
      drawerOfficialLink: document.getElementById("drawer-official-link"),
      drawerDirectionsLink: document.getElementById("drawer-directions-link"),
      drawerFavBtn: document.getElementById("drawer-fav-btn"),
      drawerLogVisitBtn: document.getElementById("drawer-log-visit-btn"),
      drawerVisitedBanner: document.getElementById("drawer-visited-stamp-banner"),
      drawerStampDate: document.getElementById("drawer-stamp-date"),
      drawerStampNotes: document.getElementById("drawer-stamp-notes"),
      drawerEditVisitBtn: document.getElementById("drawer-edit-visit-btn"),
      drawerShareBtn: document.getElementById("drawer-share-btn"),

      // Wishlist Drawer
      wishlistDrawer: document.getElementById("wishlist-drawer"),
      wishlistList: document.getElementById("wishlist-items-list"),
      wishlistCloseBtn: document.getElementById("wishlist-close-btn"),
      wishlistClearBtn: document.getElementById("wishlist-clear-btn"),
      wishlistExportBtn: document.getElementById("wishlist-export-btn"),
      wishlistFilterMapBtn: document.getElementById("wishlist-filter-map-btn"),

      // My Journey Modal
      journeyModal: document.getElementById("journey-modal"),
      journeyModalCloseBtn: document.getElementById("journey-modal-close-btn"),
      journeyTotalCount: document.getElementById("journey-total-count"),
      journeyTotalAcres: document.getElementById("journey-total-acres"),
      journeyTotalStates: document.getElementById("journey-total-states"),
      journeyParksList: document.getElementById("journey-parks-list"),
      journeyCopySyncBtn: document.getElementById("journey-copy-sync-btn"),
      journeyDownloadBackupBtn: document.getElementById("journey-download-backup-btn"),

      // Log Visit Modal
      visitModal: document.getElementById("visit-modal"),
      visitModalCloseBtn: document.getElementById("visit-modal-close-btn"),
      visitModalParkName: document.getElementById("visit-modal-park-name"),
      visitDateInput: document.getElementById("visit-date-input"),
      visitNotesInput: document.getElementById("visit-notes-input"),
      submitVisitBtn: document.getElementById("submit-visit-btn"),

      // About Modal
      aboutModal: document.getElementById("about-modal"),
      aboutModalCloseBtn: document.getElementById("about-modal-close-btn"),
      creatorAvatarBtn: document.getElementById("creator-avatar-btn"),

      // Photo Lightbox Modal
      photoLightboxModal: document.getElementById("photo-lightbox-modal"),
      photoLightboxCloseBtn: document.getElementById("photo-lightbox-close-btn"),
      photoLightboxBackdrop: document.getElementById("photo-lightbox-backdrop"),

      // Toolbar Controls
      modeToggles: document.querySelectorAll("[data-mode-toggle]"),
      countryToggles: document.querySelectorAll("[data-country-toggle]"),
      regionSelect: document.getElementById("region-select"),
      sortSelect: document.getElementById("sort-select"),
      searchInput: document.getElementById("search-input"),
      searchClearBtn: document.getElementById("search-clear-btn"),
      tagPillsContainer: document.getElementById("tag-pills-container"),
      tagPillsScrollLeft: document.getElementById("tag-pills-scroll-left"),
      tagPillsScrollRight: document.getElementById("tag-pills-scroll-right"),
      resetFiltersBtn: document.getElementById("reset-filters-btn"),
      fitBoundsBtn: document.getElementById("fit-bounds-btn"),
      recenterBtn: document.getElementById("recenter-btn"),
      filterVisitedToggleBtn: document.getElementById("filter-visited-toggle-btn"),
      filterVisitedCount: document.getElementById("filter-visited-count"),
      basemapSelect: document.getElementById("basemap-select"),

      // Toast container
      toastContainer: document.getElementById("toast-container")
    };

    this.initEventListeners();
    this.renderTagPills();
    this.updateRegionDropdown();
    this.updateWishlistCount();
    this.updateJourneyCount();

    window.addEventListener("resize", () => this.updatePillScrollButtons());
  }

  initEventListeners() {
    // Mode Switcher Buttons
    this.dom.modeToggles.forEach(btn => {
      btn.addEventListener("click", () => {
        const mode = btn.getAttribute("data-mode-toggle");
        this.filter.setMode(mode);
        this.dom.modeToggles.forEach(b => b.classList.toggle("is-active", b === btn));
      });
    });

    // Country Switcher Buttons
    this.dom.countryToggles.forEach(btn => {
      btn.addEventListener("click", () => {
        const country = btn.getAttribute("data-country-toggle");
        this.filter.setCountry(country);
        this.dom.countryToggles.forEach(b => b.classList.toggle("is-active", b === btn));
      });
    });

    // Region Select
    if (this.dom.regionSelect) {
      this.dom.regionSelect.addEventListener("change", (e) => {
        this.filter.setStateProvince(e.target.value);
      });
    }

    // Sort Select
    if (this.dom.sortSelect) {
      this.dom.sortSelect.addEventListener("change", (e) => {
        this.filter.setSortBy(e.target.value);
      });
    }

    // Visited-Only Filter Toggle
    if (this.dom.filterVisitedToggleBtn) {
      this.dom.filterVisitedToggleBtn.addEventListener("click", () => {
        const isVisitedOnly = !this.filter.state.visitedOnly;
        this.filter.setVisitedOnly(isVisitedOnly);
        this.dom.filterVisitedToggleBtn.classList.toggle("is-active", isVisitedOnly);
        this.showToast(isVisitedOnly ? "Showing only visited parks" : "Showing all parks", "info");
      });
    }

    // Search Input
    if (this.dom.searchInput) {
      let debounceTimer = null;
      this.dom.searchInput.addEventListener("input", (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value;
        if (this.dom.searchClearBtn) {
          this.dom.searchClearBtn.style.display = query ? "block" : "none";
        }
        debounceTimer = setTimeout(() => {
          this.filter.setSearchQuery(query);
        }, 150);
      });
    }

    // Search Clear
    if (this.dom.searchClearBtn) {
      this.dom.searchClearBtn.addEventListener("click", () => {
        this.dom.searchInput.value = "";
        this.dom.searchClearBtn.style.display = "none";
        this.filter.setSearchQuery("");
      });
    }

    // Tag Pills Scroll Buttons & Wheel Navigation
    if (this.dom.tagPillsScrollLeft) {
      this.dom.tagPillsScrollLeft.addEventListener("click", () => {
        if (this.dom.tagPillsContainer) {
          this.dom.tagPillsContainer.scrollBy({ left: -220, behavior: "smooth" });
        }
      });
    }
    if (this.dom.tagPillsScrollRight) {
      this.dom.tagPillsScrollRight.addEventListener("click", () => {
        if (this.dom.tagPillsContainer) {
          this.dom.tagPillsContainer.scrollBy({ left: 220, behavior: "smooth" });
        }
      });
    }
    if (this.dom.tagPillsContainer) {
      this.dom.tagPillsContainer.addEventListener("scroll", () => {
        this.updatePillScrollButtons();
      }, { passive: true });
      this.dom.tagPillsContainer.addEventListener("wheel", (e) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          this.dom.tagPillsContainer.scrollLeft += e.deltaY;
          this.updatePillScrollButtons();
        }
      }, { passive: false });
    }

    // Reset Filters
    if (this.dom.resetFiltersBtn) {
      this.dom.resetFiltersBtn.addEventListener("click", () => this.resetUIFilters());
    }

    // Surprise Me
    if (this.dom.surpriseBtn) {
      this.dom.surpriseBtn.addEventListener("click", () => this.triggerSurpriseMe());
    }

    // Fit Bounds & Recenter
    if (this.dom.fitBoundsBtn) {
      this.dom.fitBoundsBtn.addEventListener("click", () => this.map.fitBoundsToVisible());
    }
    if (this.dom.recenterBtn) {
      this.dom.recenterBtn.addEventListener("click", () => this.map.recenter());
    }

    // Basemap Select
    if (this.dom.basemapSelect) {
      this.dom.basemapSelect.value = (window.storage && window.storage.getBasemap()) || "terrain";
      this.dom.basemapSelect.addEventListener("change", (e) => {
        this.map.setBasemap(e.target.value);
        this.showToast(`Basemap switched to ${e.target.options[e.target.selectedIndex].text}`, "info");
      });
    }

    // Drawer Close
    if (this.dom.drawerCloseBtn) {
      this.dom.drawerCloseBtn.addEventListener("click", () => this.closeDrawer());
    }
    if (this.dom.drawerOverlay) {
      this.dom.drawerOverlay.addEventListener("click", () => {
        this.closeDrawer();
        this.closeWishlist();
        this.closeJourneyModal();
        this.closeVisitModal();
        this.closeAboutModal();
      });
    }

    // Drawer Bookmark Action
    if (this.dom.drawerFavBtn) {
      this.dom.drawerFavBtn.addEventListener("click", () => {
        if (!this.activePark) return;
        const isFav = window.storage.toggleFavorite(this.activePark.id);
        this.updateDrawerFavState(isFav);
        this.updateWishlistCount();
        this.renderWishlist();
        this.renderParksList(this.filter.getFilteredData());
        this.showToast(
          isFav ? `Added ${this.activePark.name} to Wishlist!` : `Removed ${this.activePark.name} from Wishlist.`,
          isFav ? "success" : "info"
        );
      });
    }

    // Drawer Log Visit Action
    if (this.dom.drawerLogVisitBtn) {
      this.dom.drawerLogVisitBtn.addEventListener("click", () => {
        if (!this.activePark) return;
        this.openVisitModal(this.activePark);
      });
    }
    if (this.dom.drawerEditVisitBtn) {
      this.dom.drawerEditVisitBtn.addEventListener("click", () => {
        if (!this.activePark) return;
        this.openVisitModal(this.activePark);
      });
    }

    // Share & Copy Coords
    if (this.dom.drawerShareBtn) {
      this.dom.drawerShareBtn.addEventListener("click", () => {
        if (!this.activePark) return;
        const coords = `${this.activePark.coordinates[0].toFixed(4)}, ${this.activePark.coordinates[1].toFixed(4)}`;
        navigator.clipboard.writeText(`${this.activePark.name} - ${coords}\n${this.activePark.officialUrl}`)
          .then(() => this.showToast("Park details & coordinates copied!", "success"))
          .catch(() => this.showToast(`Coordinates: ${coords}`, "info"));
      });
    }

    // Wishlist Drawer Toggles
    if (this.dom.wishlistToggleBtn) {
      this.dom.wishlistToggleBtn.addEventListener("click", () => this.openWishlist());
    }
    if (this.dom.wishlistCloseBtn) {
      this.dom.wishlistCloseBtn.addEventListener("click", () => this.closeWishlist());
    }
    if (this.dom.wishlistClearBtn) {
      this.dom.wishlistClearBtn.addEventListener("click", () => {
        if (confirm("Clear your saved park wishlist?")) {
          window.storage.clearFavorites();
          this.updateWishlistCount();
          this.renderWishlist();
          this.renderParksList(this.filter.getFilteredData());
          this.showToast("Wishlist cleared.", "info");
        }
      });
    }
    if (this.dom.wishlistFilterMapBtn) {
      this.dom.wishlistFilterMapBtn.addEventListener("click", () => {
        const isFavOnly = !this.filter.state.favoritesOnly;
        this.filter.setFavoritesOnly(isFavOnly);
        this.closeWishlist();
        this.showToast(isFavOnly ? "Showing only Wishlist parks on map" : "Showing all parks", "info");
      });
    }
    if (this.dom.wishlistExportBtn) {
      this.dom.wishlistExportBtn.addEventListener("click", () => this.exportWishlist());
    }

    // My Journey Modal
    if (this.dom.journeyModalBtn) {
      this.dom.journeyModalBtn.addEventListener("click", () => this.openJourneyModal());
    }
    if (this.dom.journeyModalCloseBtn) {
      this.dom.journeyModalCloseBtn.addEventListener("click", () => this.closeJourneyModal());
    }
    if (this.dom.journeyCopySyncBtn) {
      this.dom.journeyCopySyncBtn.addEventListener("click", () => {
        const code = window.storage.exportSyncCode();
        if (code) {
          navigator.clipboard.writeText(code)
            .then(() => this.showToast("Sync code copied to clipboard!", "success"))
            .catch(() => prompt("Your Sync Code:", code));
        }
      });
    }
    if (this.dom.journeyDownloadBackupBtn) {
      this.dom.journeyDownloadBackupBtn.addEventListener("click", () => {
        const json = window.storage.exportBackupJson();
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "the_terrain_backup.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        this.showToast("Backup file downloaded!", "success");
      });
    }

    // Visit Modal
    if (this.dom.visitModalCloseBtn) {
      this.dom.visitModalCloseBtn.addEventListener("click", () => this.closeVisitModal());
    }
    if (this.dom.submitVisitBtn) {
      this.dom.submitVisitBtn.addEventListener("click", () => this.submitVisitLog());
    }

    // About Modal
    if (this.dom.aboutModalBtn) {
      this.dom.aboutModalBtn.addEventListener("click", () => this.openAboutModal());
    }
    if (this.dom.aboutModalCloseBtn) {
      this.dom.aboutModalCloseBtn.addEventListener("click", () => this.closeAboutModal());
    }

    // Photo Lightbox Modal
    if (this.dom.creatorAvatarBtn) {
      this.dom.creatorAvatarBtn.addEventListener("click", () => this.openPhotoLightbox());
    }
    if (this.dom.photoLightboxCloseBtn) {
      this.dom.photoLightboxCloseBtn.addEventListener("click", () => this.closePhotoLightbox());
    }
    if (this.dom.photoLightboxBackdrop) {
      this.dom.photoLightboxBackdrop.addEventListener("click", () => this.closePhotoLightbox());
    }

    // Global Keybindings
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeDrawer();
        this.closeWishlist();
        this.closeJourneyModal();
        this.closeVisitModal();
        this.closeAboutModal();
        this.closePhotoLightbox();
      }
      if (e.key === "/" && document.activeElement !== this.dom.searchInput && !document.activeElement.matches("input, textarea")) {
        e.preventDefault();
        this.dom.searchInput?.focus();
      }
    });

    // Map Event Subscriptions
    this.map.subscribe((event, data) => {
      if (event === "park_selected") {
        this.openDrawer(data);
        this.highlightActiveCard(data.id);
      } else if (event === "park_deselected") {
        this.closeDrawer();
        this.highlightActiveCard(null);
      }
    });

    // Filter Event Subscriptions
    this.filter.subscribe((filteredParks) => {
      this.map.updateParks(filteredParks);
      this.renderParksList(filteredParks);
      this.updateCounter(filteredParks.length);
    });

    // Storage Event Subscriptions
    window.storage.subscribe((event) => {
      this.updateWishlistCount();
      this.updateJourneyCount();
      if (event === "visit_logged" || event === "visit_removed" || event === "backup_restored") {
        this.map.updateParks(this.filter.getFilteredData());
        this.renderParksList(this.filter.getFilteredData());
        if (this.activePark) {
          this.updateDrawerVisitedBanner(this.activePark.id);
        }
      }
    });
  }

  updateWishlistCount() {
    const count = window.storage ? window.storage.getFavorites().length : 0;
    if (this.dom.wishlistBadgeCount) {
      this.dom.wishlistBadgeCount.textContent = count;
      this.dom.wishlistBadgeCount.style.display = count > 0 ? "inline-block" : "none";
    }
  }

  updateJourneyCount() {
    const count = window.storage ? window.storage.getVisitedList().length : 0;
    if (this.dom.journeyBadgeCount) {
      this.dom.journeyBadgeCount.textContent = count;
      this.dom.journeyBadgeCount.style.display = count > 0 ? "inline-block" : "none";
    }
    if (this.dom.filterVisitedCount) {
      this.dom.filterVisitedCount.textContent = count;
    }
  }

  renderParksList(parks) {
    if (!this.dom.parksListContainer) return;
    this.dom.parksListContainer.innerHTML = "";

    if (parks.length === 0) {
      if (this.dom.emptyState) this.dom.emptyState.style.display = "flex";
      return;
    }

    if (this.dom.emptyState) this.dom.emptyState.style.display = "none";

function getFlagSvg(country) {
  if (country === "US") {
    return `<svg class="country-flag-svg" viewBox="0 0 640 480" width="14" height="10" aria-label="USA" style="display:inline-block; border-radius:2px; vertical-align:middle; margin-right:4px; box-shadow:0 1px 3px rgba(0,0,0,0.3);"><g fill-rule="evenodd"><path fill="#bd3d44" d="M0 0h640v480H0z"/><path stroke="#fff" stroke-width="37" d="M0 55.5h640M0 129h640M0 203h640M0 277h640M0 351h640M0 424.5h640"/><path fill="#192f5d" d="M0 0h296v259H0z"/></g></svg>`;
  } else {
    return `<svg class="country-flag-svg" viewBox="0 0 640 480" width="14" height="10" aria-label="Canada" style="display:inline-block; border-radius:2px; vertical-align:middle; margin-right:4px; box-shadow:0 1px 3px rgba(0,0,0,0.3);"><g fill-rule="evenodd"><path fill="#f00" d="M0 0h640v480H0z"/><path fill="#fff" d="M160 0h320v480H160z"/><path fill="#f00" d="m320 80 18 54 50-20-16 48 54 8-36 38 40 38-54 8 10 50-48-26-18 62-18-62-48 26 10-50-54-8 40-38-36-38 54-8-16-48 50 20z"/></g></svg>`;
  }
}

    parks.forEach(park => {
      const card = document.createElement("div");
      card.className = `park-card ${park.id === (this.activePark?.id) ? "is-active" : ""}`;
      card.setAttribute("data-park-id", park.id);

      const isFav = window.storage.isFavorite(park.id);
      const isVisited = window.storage.isVisited(park.id);
      const visitData = isVisited ? window.storage.getVisitDetails(park.id) : null;
      const flag = getFlagSvg(park.country);
      const typeLabel = park.type === "national" ? "National Park" : "State / Provincial";
      const badgeClass = park.type === "national" ? "badge-national" : "badge-state";

      card.innerHTML = `
        <div class="park-card-media">
          <img src="${park.heroImage}" alt="${park.name}" loading="lazy" class="park-card-img" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';" />
          <button class="park-card-bookmark-btn ${isFav ? "is-active" : ""}" title="Save to Bucket List" data-fav-id="${park.id}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="${isFav ? "#f59e0b" : "none"}" stroke="currentColor" stroke-width="2">
              <path d="M19 21l-7-5l-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
          ${isVisited ? `<span class="park-visited-badge" title="Visited: ${visitData?.date || ''}">✓ Visited</span>` : ""}
        </div>
        <div class="park-card-content">
          <div class="park-card-header">
            <span class="park-type-badge ${badgeClass}">${flag}<span>${typeLabel}</span></span>
            <span class="park-rating">★ ${park.rating || "4.9"}</span>
          </div>
          <h3 class="park-card-title">${park.name}</h3>
          <p class="park-card-location">📍 ${park.stateProvince}</p>
          <div class="park-card-tags">
            ${(park.tags || []).slice(0, 3).map(tag => `<span class="park-mini-tag">${tag}</span>`).join("")}
          </div>
        </div>
      `;

      card.addEventListener("click", (e) => {
        if (e.target.closest(".park-card-bookmark-btn")) return;
        this.map.selectPark(park.id);
      });

      const bookmarkBtn = card.querySelector(".park-card-bookmark-btn");
      bookmarkBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const fav = window.storage.toggleFavorite(park.id);
        bookmarkBtn.classList.toggle("is-active", fav);
        bookmarkBtn.querySelector("svg").setAttribute("fill", fav ? "#f59e0b" : "none");
        this.updateWishlistCount();
        this.renderWishlist();
        if (this.activePark && this.activePark.id === park.id) {
          this.updateDrawerFavState(fav);
        }
        this.showToast(fav ? `Added ${park.name} to Wishlist!` : `Removed ${park.name} from Wishlist.`, fav ? "success" : "info");
      });

      this.dom.parksListContainer.appendChild(card);
    });
  }

  openDrawer(park) {
    this.activePark = park;
    const flag = getFlagSvg(park.country);
    const countryName = park.country === "US" ? "United States" : "Canada";
    const typeLabel = park.type === "national" ? "National Park" : "State / Provincial Park";

    if (this.dom.drawerHeroImg) {
      this.dom.drawerHeroImg.onerror = () => {
        this.dom.drawerHeroImg.src = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";
      };
      this.dom.drawerHeroImg.src = park.heroImage;
    }
    if (this.dom.drawerTitle) this.dom.drawerTitle.textContent = park.name;
    if (this.dom.drawerCountryBadge) this.dom.drawerCountryBadge.innerHTML = `${flag} <span>${countryName}</span>`;
    if (this.dom.drawerTypeBadge) {
      this.dom.drawerTypeBadge.textContent = typeLabel;
      this.dom.drawerTypeBadge.className = `drawer-badge ${park.type === "national" ? "badge-national" : "badge-state"}`;
    }
    if (this.dom.drawerLocation) this.dom.drawerLocation.textContent = `📍 ${park.stateProvince} (${park.country})`;

    if (this.dom.drawerStatEst) this.dom.drawerStatEst.textContent = park.establishedYear;
    if (this.dom.drawerStatArea) this.dom.drawerStatArea.textContent = `${(park.areaAcres || 0).toLocaleString()} acres (${(park.areaSqKm || 0).toLocaleString()} km²)`;
    if (this.dom.drawerStatVisitors) this.dom.drawerStatVisitors.textContent = park.annualVisitors || "N/A";
    if (this.dom.drawerStatCoords) this.dom.drawerStatCoords.textContent = `${park.coordinates[0].toFixed(2)}°N, ${Math.abs(park.coordinates[1]).toFixed(2)}°W`;

    if (this.dom.drawerDesc) this.dom.drawerDesc.textContent = park.description;
    
    if (this.dom.drawerHighlights) {
      this.dom.drawerHighlights.innerHTML = (park.highlights || [])
        .map(h => `<li class="highlight-item"><span class="highlight-bullet">✦</span> ${h}</li>`)
        .join("");
    }

    if (this.dom.drawerTags) {
      this.dom.drawerTags.innerHTML = (park.tags || [])
        .map(t => `<span class="drawer-tag-pill">${t}</span>`)
        .join("");
    }

    if (this.dom.drawerBestSeason) this.dom.drawerBestSeason.textContent = park.bestSeason || "Year-round";
    if (this.dom.drawerClimate) this.dom.drawerClimate.textContent = park.climate || "Varies by season";

    if (this.dom.drawerOfficialLink) this.dom.drawerOfficialLink.href = park.officialUrl || "#";
    if (this.dom.drawerDirectionsLink) {
      this.dom.drawerDirectionsLink.href = `https://www.google.com/maps/dir/?api=1&destination=${park.coordinates[0]},${park.coordinates[1]}`;
    }

    this.updateDrawerFavState(window.storage.isFavorite(park.id));
    this.updateDrawerVisitedBanner(park.id);

    this.dom.detailDrawer?.classList.add("is-open");
    this.dom.drawerOverlay?.classList.add("is-open");
  }

  closeDrawer() {
    this.activePark = null;
    this.dom.detailDrawer?.classList.remove("is-open");
    this.dom.drawerOverlay?.classList.remove("is-open");
  }

  updateDrawerFavState(isFav) {
    if (!this.dom.drawerFavBtn) return;
    this.dom.drawerFavBtn.classList.toggle("is-active", isFav);
    this.dom.drawerFavBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="${isFav ? "#f59e0b" : "none"}" stroke="currentColor" stroke-width="2">
        <path d="M19 21l-7-5l-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
      <span>${isFav ? "In Wishlist" : "Wishlist"}</span>
    `;
  }

  updateDrawerVisitedBanner(parkId) {
    const isVisited = window.storage.isVisited(parkId);
    const visitData = window.storage.getVisitDetails(parkId);

    if (this.dom.drawerVisitedBanner) {
      this.dom.drawerVisitedBanner.style.display = isVisited ? "flex" : "none";
    }

    if (this.dom.drawerLogVisitBtn) {
      this.dom.drawerLogVisitBtn.innerHTML = isVisited
        ? `<span>✓ Visited</span>`
        : `<span>🌲 Mark as Visited</span>`;
      this.dom.drawerLogVisitBtn.classList.toggle("primary", !isVisited);
    }

    if (isVisited && visitData) {
      if (this.dom.drawerStampDate) {
        this.dom.drawerStampDate.textContent = `Visited on ${visitData.date}`;
      }
      if (this.dom.drawerStampNotes) {
        this.dom.drawerStampNotes.textContent = visitData.notes ? `"${visitData.notes}"` : "No trip notes added.";
      }
    }
  }

  highlightActiveCard(parkId) {
    const cards = this.dom.parksListContainer?.querySelectorAll(".park-card") || [];
    cards.forEach(c => {
      const isMatch = c.getAttribute("data-park-id") === parkId;
      c.classList.toggle("is-active", isMatch);
      if (isMatch) {
        c.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  renderTagPills() {
    if (!this.dom.tagPillsContainer) return;
    this.dom.tagPillsContainer.innerHTML = "";

    const tags = this.filter.getAllTags();

    tags.forEach(({ tag, count }) => {
      const pill = document.createElement("button");
      pill.className = `filter-tag-pill ${this.filter.state.selectedTags.has(tag) ? "is-active" : ""}`;
      pill.setAttribute("data-tag", tag);
      pill.innerHTML = `<span>${tag}</span><span class="tag-count">${count}</span>`;

      pill.addEventListener("click", () => {
        this.filter.toggleTag(tag);
        pill.classList.toggle("is-active", this.filter.state.selectedTags.has(tag));
      });

      this.dom.tagPillsContainer.appendChild(pill);
    });

    // Schedule scroll button check after DOM paint
    setTimeout(() => this.updatePillScrollButtons(), 50);
  }

  updatePillScrollButtons() {
    if (!this.dom.tagPillsContainer) return;
    const el = this.dom.tagPillsContainer;
    const maxScroll = el.scrollWidth - el.clientWidth;

    if (this.dom.tagPillsScrollLeft) {
      this.dom.tagPillsScrollLeft.classList.toggle("is-hidden", el.scrollLeft <= 4);
    }
    if (this.dom.tagPillsScrollRight) {
      this.dom.tagPillsScrollRight.classList.toggle("is-hidden", el.scrollLeft >= maxScroll - 4 || maxScroll <= 0);
    }
  }

  updateRegionDropdown() {
    if (!this.dom.regionSelect) return;
    const regions = this.filter.getAvailableRegions();
    
    const currentValue = this.dom.regionSelect.value;
    this.dom.regionSelect.innerHTML = `<option value="all">📍 All States &amp; Provinces (${this.filter.allData.length} parks)</option>`;

    regions.forEach(r => {
      const opt = document.createElement("option");
      opt.value = r.name;
      const flag = r.country === "US" ? "🇺🇸" : "🇨🇦";
      opt.textContent = `${flag} ${r.name} (${r.count})`;
      this.dom.regionSelect.appendChild(opt);
    });

    if (regions.some(r => r.name === currentValue)) {
      this.dom.regionSelect.value = currentValue;
    }
  }

  updateCounter(count) {
    if (this.dom.resultsCounter) {
      const mode = this.filter.state.mode;
      const modeLabel = mode === "national" ? "National Parks" : mode === "state" ? "State/Provincial Parks" : "Parks";
      this.dom.resultsCounter.innerHTML = `Showing <strong>${count}</strong> ${modeLabel}`;
    }
  }

  triggerSurpriseMe() {
    const data = this.filter.getFilteredData();
    const pool = data.length > 0 ? data : this.filter.allData;
    if (pool.length === 0) return;

    const randomPark = pool[Math.floor(Math.random() * pool.length)];
    this.map.selectPark(randomPark.id);
    this.showToast(`🎲 Discovered: ${randomPark.name}!`, "success");
  }

  resetUIFilters() {
    this.filter.resetAll();
    this.dom.modeToggles.forEach(b => b.classList.toggle("is-active", b.getAttribute("data-mode-toggle") === "all"));
    this.dom.countryToggles.forEach(b => b.classList.toggle("is-active", b.getAttribute("data-country-toggle") === "all"));
    if (this.dom.filterVisitedToggleBtn) this.dom.filterVisitedToggleBtn.classList.remove("is-active");
    if (this.dom.regionSelect) this.dom.regionSelect.value = "all";
    if (this.dom.sortSelect) this.dom.sortSelect.value = "featured";
    if (this.dom.searchInput) {
      this.dom.searchInput.value = "";
      if (this.dom.searchClearBtn) this.dom.searchClearBtn.style.display = "none";
    }
    const pills = this.dom.tagPillsContainer?.querySelectorAll(".filter-tag-pill") || [];
    pills.forEach(p => p.classList.remove("is-active"));
    this.showToast("All filters reset", "info");
  }

  // --- Log Park Visit Dialog ---
  openVisitModal(park) {
    this.activePark = park;
    const existing = window.storage.getVisitDetails(park.id);

    if (this.dom.visitModalParkName) this.dom.visitModalParkName.textContent = park.name;
    if (this.dom.visitDateInput) {
      this.dom.visitDateInput.value = existing?.date || new Date().toISOString().split("T")[0];
    }
    if (this.dom.visitNotesInput) {
      this.dom.visitNotesInput.value = existing?.notes || "";
    }

    this.dom.visitModal?.classList.add("is-open");
    this.dom.drawerOverlay?.classList.add("is-open");
  }

  closeVisitModal() {
    this.dom.visitModal?.classList.remove("is-open");
    if (!this.dom.detailDrawer?.classList.contains("is-open") &&
        !this.dom.wishlistDrawer?.classList.contains("is-open") &&
        !this.dom.journeyModal?.classList.contains("is-open") &&
        !this.dom.aboutModal?.classList.contains("is-open")) {
      this.dom.drawerOverlay?.classList.remove("is-open");
    }
  }

  submitVisitLog() {
    if (!this.activePark) return;

    const date = this.dom.visitDateInput.value;
    const notes = this.dom.visitNotesInput.value;

    window.storage.logVisit(this.activePark.id, { date, notes });
    this.closeVisitModal();

    this.updateJourneyCount();
    this.updateDrawerVisitedBanner(this.activePark.id);
    this.renderParksList(this.filter.getFilteredData());
    this.map.updateParks(this.filter.getFilteredData());

    this.showToast(`Saved ${this.activePark.name} to My Journey!`, "success");
  }

  // --- My Journey Modal ---
  openJourneyModal() {
    this.renderJourneyContent();
    this.dom.journeyModal?.classList.add("is-open");
    this.dom.drawerOverlay?.classList.add("is-open");
  }

  closeJourneyModal() {
    this.dom.journeyModal?.classList.remove("is-open");
    this.dom.drawerOverlay?.classList.remove("is-open");
  }

  renderJourneyContent() {
    const stats = window.passport.getTravelStats();

    if (this.dom.journeyTotalCount) this.dom.journeyTotalCount.textContent = stats.totalVisited;
    if (this.dom.journeyTotalAcres) this.dom.journeyTotalAcres.textContent = `${(stats.totalAcreage / 1000000).toFixed(1)}M`;
    if (this.dom.journeyTotalStates) this.dom.journeyTotalStates.textContent = stats.statesCount;

    if (this.dom.journeyParksList) {
      if (stats.visitedParks.length === 0) {
        this.dom.journeyParksList.innerHTML = `
          <div class="wishlist-empty">
            <div class="wishlist-empty-icon">🌲</div>
            <h4>No Visited Parks Logged Yet</h4>
            <p>Click "Mark as Visited" on any park card or detail view to log your travels and personal notes.</p>
          </div>
        `;
      } else {
        this.dom.journeyParksList.innerHTML = stats.visitedParks.map(park => `
          <div class="journey-item-card" data-park-id="${park.id}">
            <img src="${park.heroImage}" alt="${park.name}" class="journey-item-img" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';" />
            <div class="journey-item-info">
              <div class="journey-item-top">
                <h4 class="journey-item-title">${park.name}</h4>
                <span class="journey-item-date">${park.visitData?.date || ''}</span>
              </div>
              <p class="journey-item-loc">📍 ${park.stateProvince}, ${getFlagSvg(park.country)} ${park.country === 'US' ? 'USA' : 'Canada'} &bull; ${park.type === 'national' ? 'National Park' : 'State Park'}</p>
              ${park.visitData?.notes ? `<p class="journey-item-notes">"${park.visitData.notes}"</p>` : ''}
            </div>
            <button class="wishlist-item-view-btn" data-action="view" data-id="${park.id}" title="View on Map">🗺️</button>
          </div>
        `).join("");

        this.dom.journeyParksList.querySelectorAll("[data-action='view']").forEach(btn => {
          btn.addEventListener("click", () => {
            const id = btn.getAttribute("data-id");
            this.closeJourneyModal();
            this.map.selectPark(id);
          });
        });
      }
    }
  }

  // --- Wishlist ---
  openWishlist() {
    this.renderWishlist();
    this.dom.wishlistDrawer?.classList.add("is-open");
    this.dom.drawerOverlay?.classList.add("is-open");
  }

  closeWishlist() {
    this.dom.wishlistDrawer?.classList.remove("is-open");
    this.dom.drawerOverlay?.classList.remove("is-open");
  }

  renderWishlist() {
    if (!this.dom.wishlistList) return;
    const favIds = window.storage.getFavorites();
    const favParks = (window.PARKS_DATA || []).filter(p => favIds.includes(p.id));

    if (favParks.length === 0) {
      this.dom.wishlistList.innerHTML = `
        <div class="wishlist-empty">
          <div class="wishlist-empty-icon">⭐</div>
          <h4>Your Bucket List is Empty</h4>
          <p>Click the bookmark icon on any park card to save it for your next adventure.</p>
        </div>
      `;
      return;
    }

    this.dom.wishlistList.innerHTML = favParks.map(park => `
      <div class="wishlist-item" data-wishlist-id="${park.id}">
        <img src="${park.heroImage}" alt="${park.name}" class="wishlist-item-img" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';" />
        <div class="wishlist-item-info">
          <h4 class="wishlist-item-title">${park.name}</h4>
          <p class="wishlist-item-sub">${getFlagSvg(park.country)} ${park.stateProvince} &bull; ${park.type === "national" ? "National" : "State"}</p>
        </div>
        <div class="wishlist-item-actions">
          <button class="wishlist-item-view-btn" title="View on Map" data-action="view" data-id="${park.id}">🗺️</button>
          <button class="wishlist-item-del-btn" title="Remove" data-action="delete" data-id="${park.id}">✕</button>
        </div>
      </div>
    `).join("");

    this.dom.wishlistList.querySelectorAll("[data-action='view']").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        this.closeWishlist();
        this.map.selectPark(id);
      });
    });

    this.dom.wishlistList.querySelectorAll("[data-action='delete']").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        window.storage.toggleFavorite(id);
        this.updateWishlistCount();
        this.renderWishlist();
        this.renderParksList(this.filter.getFilteredData());
      });
    });
  }

  exportWishlist() {
    const favIds = window.storage.getFavorites();
    const favParks = (window.PARKS_DATA || []).filter(p => favIds.includes(p.id));
    if (favParks.length === 0) {
      this.showToast("No saved parks to export!", "info");
      return;
    }

    const text = favParks.map((p, i) => `${i + 1}. ${p.name} (${p.stateProvince}, ${p.country}) - ${p.officialUrl}`).join("\n");
    navigator.clipboard.writeText(`--- THE TERRAIN: PARK WISHLIST ---\n\n${text}`)
      .then(() => this.showToast("Wishlist copied to clipboard!", "success"))
      .catch(() => this.showToast("Export ready.", "info"));
  }

  // --- About & Chief Architect Modal ---
  openAboutModal() {
    this.dom.aboutModal?.classList.add("is-open");
    this.dom.drawerOverlay?.classList.add("is-open");
  }

  closeAboutModal() {
    this.dom.aboutModal?.classList.remove("is-open");
    this.dom.drawerOverlay?.classList.remove("is-open");
  }

  // --- Photo Lightbox Modal ---
  openPhotoLightbox() {
    this.dom.photoLightboxModal?.classList.add("is-open");
  }

  closePhotoLightbox() {
    this.dom.photoLightboxModal?.classList.remove("is-open");
  }

  // Toast Notification System
  showToast(message, type = "info") {
    if (!this.dom.toastContainer) return;
    const toast = document.createElement("div");
    toast.className = `terrain-toast toast-${type}`;
    
    const icon = type === "success" ? "✓" : type === "warning" ? "⚠" : "ℹ";
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span class="toast-msg">${message}</span>`;

    this.dom.toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add("is-visible"), 10);

    setTimeout(() => {
      toast.classList.remove("is-visible");
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

if (typeof window !== "undefined") {
  window.TerrainUI = TerrainUI;
}
