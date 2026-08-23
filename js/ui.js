/**
 * The Terrain - UI Controller
 * Manages rendering of sidebar cards, detail drawers, wishlist modal, insights dashboard, and toast notifications.
 */

class TerrainUI {
  constructor(mapInstance, filterInstance) {
    this.map = mapInstance;
    this.filter = filterInstance;
    this.activePark = null;

    this.dom = {
      // Containers
      parksListContainer: document.getElementById("parks-list-container"),
      resultsCounter: document.getElementById("results-counter"),
      emptyState: document.getElementById("empty-state"),
      
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
      drawerVisitedBtn: document.getElementById("drawer-visited-btn"),
      drawerShareBtn: document.getElementById("drawer-share-btn"),

      // Wishlist Drawer
      wishlistDrawer: document.getElementById("wishlist-drawer"),
      wishlistBtn: document.getElementById("wishlist-toggle-btn"),
      wishlistBadgeCount: document.getElementById("wishlist-badge-count"),
      wishlistList: document.getElementById("wishlist-items-list"),
      wishlistCloseBtn: document.getElementById("wishlist-close-btn"),
      wishlistClearBtn: document.getElementById("wishlist-clear-btn"),
      wishlistExportBtn: document.getElementById("wishlist-export-btn"),
      wishlistFilterMapBtn: document.getElementById("wishlist-filter-map-btn"),

      // Insights / Stats Modal
      statsModal: document.getElementById("stats-modal"),
      statsModalBtn: document.getElementById("stats-modal-btn"),
      statsModalCloseBtn: document.getElementById("stats-modal-close-btn"),

      // Top Filter controls
      modeToggles: document.querySelectorAll("[data-mode-toggle]"),
      countryToggles: document.querySelectorAll("[data-country-toggle]"),
      regionSelect: document.getElementById("region-select"),
      sortSelect: document.getElementById("sort-select"),
      searchInput: document.getElementById("search-input"),
      searchClearBtn: document.getElementById("search-clear-btn"),
      tagPillsContainer: document.getElementById("tag-pills-container"),
      surpriseBtn: document.getElementById("surprise-me-btn"),
      resetFiltersBtn: document.getElementById("reset-filters-btn"),
      fitBoundsBtn: document.getElementById("fit-bounds-btn"),
      recenterBtn: document.getElementById("recenter-btn"),

      // Basemap Dropdown
      basemapSelect: document.getElementById("basemap-select"),

      // Toast container
      toastContainer: document.getElementById("toast-container")
    };

    this.initEventListeners();
    this.renderTagPills();
    this.updateRegionDropdown();
    this.updateWishlistCount();
  }

  initEventListeners() {
    // Mode toggles (All / National / State)
    this.dom.modeToggles.forEach(btn => {
      btn.addEventListener("click", () => {
        this.dom.modeToggles.forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const mode = btn.getAttribute("data-mode-toggle");
        this.filter.setMode(mode);
      });
    });

    // Country toggles (All / US / CA)
    this.dom.countryToggles.forEach(btn => {
      btn.addEventListener("click", () => {
        this.dom.countryToggles.forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const country = btn.getAttribute("data-country-toggle");
        this.filter.setCountry(country);
        this.updateRegionDropdown();
      });
    });

    // Region Select Dropdown
    if (this.dom.regionSelect) {
      this.dom.regionSelect.addEventListener("change", (e) => {
        this.filter.setStateProvince(e.target.value);
      });
    }

    // Sort Select Dropdown
    if (this.dom.sortSelect) {
      this.dom.sortSelect.addEventListener("change", (e) => {
        this.filter.setSortBy(e.target.value);
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

    // Search Clear Button
    if (this.dom.searchClearBtn) {
      this.dom.searchClearBtn.addEventListener("click", () => {
        this.dom.searchInput.value = "";
        this.dom.searchClearBtn.style.display = "none";
        this.filter.setSearchQuery("");
      });
    }

    // Reset Filters Button
    if (this.dom.resetFiltersBtn) {
      this.dom.resetFiltersBtn.addEventListener("click", () => {
        this.resetUIFilters();
      });
    }

    // Surprise Me Button
    if (this.dom.surpriseBtn) {
      this.dom.surpriseBtn.addEventListener("click", () => {
        this.triggerSurpriseMe();
      });
    }

    // Fit Bounds & Recenter
    if (this.dom.fitBoundsBtn) {
      this.dom.fitBoundsBtn.addEventListener("click", () => {
        this.map.fitBoundsToVisible();
      });
    }
    if (this.dom.recenterBtn) {
      this.dom.recenterBtn.addEventListener("click", () => {
        this.map.recenter();
      });
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
        this.closeStatsModal();
      });
    }

    // Detail Drawer Actions
    if (this.dom.drawerFavBtn) {
      this.dom.drawerFavBtn.addEventListener("click", () => {
        if (!this.activePark) return;
        const isFav = window.storage.toggleFavorite(this.activePark.id);
        this.updateDrawerFavState(isFav);
        this.updateWishlistCount();
        this.renderWishlist();
        this.renderParksList(this.filter.getFilteredData());
        this.showToast(
          isFav ? `Added ${this.activePark.name} to your Wishlist!` : `Removed ${this.activePark.name} from Wishlist.`,
          isFav ? "success" : "info"
        );
      });
    }

    if (this.dom.drawerVisitedBtn) {
      this.dom.drawerVisitedBtn.addEventListener("click", () => {
        if (!this.activePark) return;
        const isVisited = window.storage.toggleVisited(this.activePark.id);
        this.updateDrawerVisitedState(isVisited);
        this.showToast(
          isVisited ? `Marked ${this.activePark.name} as visited! 🎉` : `Unmarked ${this.activePark.name}.`,
          "success"
        );
      });
    }

    if (this.dom.drawerShareBtn) {
      this.dom.drawerShareBtn.addEventListener("click", () => {
        if (!this.activePark) return;
        const coords = `${this.activePark.coordinates[0].toFixed(4)}, ${this.activePark.coordinates[1].toFixed(4)}`;
        navigator.clipboard.writeText(`${this.activePark.name} - ${coords}\n${this.activePark.officialUrl}`)
          .then(() => this.showToast("Park details & coordinates copied to clipboard!", "success"))
          .catch(() => this.showToast(`Coordinates: ${coords}`, "info"));
      });
    }

    // Wishlist Drawer Toggles
    if (this.dom.wishlistBtn) {
      this.dom.wishlistBtn.addEventListener("click", () => this.openWishlist());
    }
    if (this.dom.wishlistCloseBtn) {
      this.dom.wishlistCloseBtn.addEventListener("click", () => this.closeWishlist());
    }
    if (this.dom.wishlistClearBtn) {
      this.dom.wishlistClearBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to clear your saved park wishlist?")) {
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
        this.showToast(isFavOnly ? "Showing only saved Wishlist parks on map" : "Showing all parks", "info");
      });
    }
    if (this.dom.wishlistExportBtn) {
      this.dom.wishlistExportBtn.addEventListener("click", () => this.exportWishlist());
    }

    // Stats / Insights Modal
    if (this.dom.statsModalBtn) {
      this.dom.statsModalBtn.addEventListener("click", () => this.openStatsModal());
    }
    if (this.dom.statsModalCloseBtn) {
      this.dom.statsModalCloseBtn.addEventListener("click", () => this.closeStatsModal());
    }

    // Keyboard navigation (Escape to close modals/drawers, '/' to focus search)
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeDrawer();
        this.closeWishlist();
        this.closeStatsModal();
      }
      if (e.key === "/" && document.activeElement !== this.dom.searchInput) {
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
    this.filter.subscribe((filteredParks, filterState) => {
      this.map.updateParks(filteredParks);
      this.renderParksList(filteredParks);
      this.updateCounter(filteredParks.length);
    });
  }

  // Render list of parks in sidebar
  renderParksList(parks) {
    if (!this.dom.parksListContainer) return;
    this.dom.parksListContainer.innerHTML = "";

    if (parks.length === 0) {
      if (this.dom.emptyState) this.dom.emptyState.style.display = "flex";
      return;
    }

    if (this.dom.emptyState) this.dom.emptyState.style.display = "none";

    parks.forEach(park => {
      const card = document.createElement("div");
      card.className = `park-card ${park.id === (this.activePark?.id) ? "is-active" : ""}`;
      card.setAttribute("data-park-id", park.id);

      const isFav = window.storage.isFavorite(park.id);
      const isVisited = window.storage.isVisited(park.id);
      const flag = park.country === "US" ? "🇺🇸" : "🇨🇦";
      const typeLabel = park.type === "national" ? "National Park" : "State / Provincial";
      const badgeClass = park.type === "national" ? "badge-national" : "badge-state";

      card.innerHTML = `
        <div class="park-card-media">
          <img src="${park.heroImage}" alt="${park.name}" loading="lazy" class="park-card-img" />
          <button class="park-card-bookmark-btn ${isFav ? "is-active" : ""}" title="Save to Bucket List" data-fav-id="${park.id}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="${isFav ? "#f59e0b" : "none"}" stroke="currentColor" stroke-width="2">
              <path d="M19 21l-7-5l-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
          ${isVisited ? `<span class="park-visited-badge" title="Visited">✓ Visited</span>` : ""}
        </div>
        <div class="park-card-content">
          <div class="park-card-header">
            <span class="park-type-badge ${badgeClass}">${flag} ${typeLabel}</span>
            <span class="park-rating">★ ${park.rating || "4.9"}</span>
          </div>
          <h3 class="park-card-title">${park.name}</h3>
          <p class="park-card-location">📍 ${park.stateProvince}</p>
          <div class="park-card-tags">
            ${(park.tags || []).slice(0, 3).map(tag => `<span class="park-mini-tag">${tag}</span>`).join("")}
          </div>
        </div>
      `;

      // Card click
      card.addEventListener("click", (e) => {
        // Ignore bookmark button click
        if (e.target.closest(".park-card-bookmark-btn")) return;
        this.map.selectPark(park.id);
      });

      // Bookmark button click inside card
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

  // Open Park Detail Drawer
  openDrawer(park) {
    this.activePark = park;
    const flag = park.country === "US" ? "🇺🇸 United States" : "🇨🇦 Canada";
    const typeLabel = park.type === "national" ? "National Park" : "State / Provincial Park";

    if (this.dom.drawerHeroImg) this.dom.drawerHeroImg.src = park.heroImage;
    if (this.dom.drawerTitle) this.dom.drawerTitle.textContent = park.name;
    if (this.dom.drawerCountryBadge) this.dom.drawerCountryBadge.textContent = flag;
    if (this.dom.drawerTypeBadge) {
      this.dom.drawerTypeBadge.textContent = typeLabel;
      this.dom.drawerTypeBadge.className = `drawer-badge ${park.type === "national" ? "badge-national" : "badge-state"}`;
    }
    if (this.dom.drawerLocation) this.dom.drawerLocation.textContent = `📍 ${park.stateProvince} (${park.country})`;

    // Stats
    if (this.dom.drawerStatEst) this.dom.drawerStatEst.textContent = park.establishedYear;
    if (this.dom.drawerStatArea) this.dom.drawerStatArea.textContent = `${(park.areaAcres || 0).toLocaleString()} acres (${(park.areaSqKm || 0).toLocaleString()} km²)`;
    if (this.dom.drawerStatVisitors) this.dom.drawerStatVisitors.textContent = park.annualVisitors || "N/A";
    if (this.dom.drawerStatCoords) this.dom.drawerStatCoords.textContent = `${park.coordinates[0].toFixed(2)}°N, ${Math.abs(park.coordinates[1]).toFixed(2)}°W`;

    // Content
    if (this.dom.drawerDesc) this.dom.drawerDesc.textContent = park.description;
    
    // Highlights
    if (this.dom.drawerHighlights) {
      this.dom.drawerHighlights.innerHTML = (park.highlights || [])
        .map(h => `<li class="highlight-item"><span class="highlight-bullet">✦</span> ${h}</li>`)
        .join("");
    }

    // Tags
    if (this.dom.drawerTags) {
      this.dom.drawerTags.innerHTML = (park.tags || [])
        .map(t => `<span class="drawer-tag-pill">${t}</span>`)
        .join("");
    }

    // Climate & Season
    if (this.dom.drawerBestSeason) this.dom.drawerBestSeason.textContent = park.bestSeason || "Year-round";
    if (this.dom.drawerClimate) this.dom.drawerClimate.textContent = park.climate || "Varies by season";

    // Links
    if (this.dom.drawerOfficialLink) {
      this.dom.drawerOfficialLink.href = park.officialUrl || "#";
    }
    if (this.dom.drawerDirectionsLink) {
      this.dom.drawerDirectionsLink.href = `https://www.google.com/maps/dir/?api=1&destination=${park.coordinates[0]},${park.coordinates[1]}`;
    }

    // Favorite & Visited button states
    this.updateDrawerFavState(window.storage.isFavorite(park.id));
    this.updateDrawerVisitedState(window.storage.isVisited(park.id));

    // Show Drawer
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
      <svg viewBox="0 0 24 24" width="18" height="18" fill="${isFav ? "#f59e0b" : "none"}" stroke="currentColor" stroke-width="2">
        <path d="M19 21l-7-5l-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
      <span>${isFav ? "Saved to Wishlist" : "Add to Wishlist"}</span>
    `;
  }

  updateDrawerVisitedState(isVisited) {
    if (!this.dom.drawerVisitedBtn) return;
    this.dom.drawerVisitedBtn.classList.toggle("is-active", isVisited);
    this.dom.drawerVisitedBtn.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 6L9 17l-5-5"></path>
      </svg>
      <span>${isVisited ? "Visited ✓" : "Mark Visited"}</span>
    `;
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

  // Tag pills toolbar
  renderTagPills() {
    if (!this.dom.tagPillsContainer) return;
    this.dom.tagPillsContainer.innerHTML = "";

    const tags = this.filter.getAllTags().slice(0, 14); // Top 14 popular tags

    tags.forEach(({ tag, count }) => {
      const pill = document.createElement("button");
      pill.className = "filter-tag-pill";
      pill.setAttribute("data-tag", tag);
      pill.innerHTML = `<span>${tag}</span><span class="tag-count">${count}</span>`;

      pill.addEventListener("click", () => {
        this.filter.toggleTag(tag);
        pill.classList.toggle("is-active", this.filter.state.selectedTags.has(tag));
      });

      this.dom.tagPillsContainer.appendChild(pill);
    });
  }

  // Update Region (State/Province) Dropdown
  updateRegionDropdown() {
    if (!this.dom.regionSelect) return;
    const regions = this.filter.getAvailableRegions();
    
    const currentValue = this.dom.regionSelect.value;
    this.dom.regionSelect.innerHTML = `<option value="all">📍 All States & Provinces (${this.filter.allData.length} parks)</option>`;

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

  // Update result count banner
  updateCounter(count) {
    if (this.dom.resultsCounter) {
      const mode = this.filter.state.mode;
      const modeLabel = mode === "national" ? "National Parks" : mode === "state" ? "State/Provincial Parks" : "Parks";
      this.dom.resultsCounter.innerHTML = `Showing <strong>${count}</strong> ${modeLabel}`;
    }
  }

  // Surprise Me / Random Park Discovery
  triggerSurpriseMe() {
    const data = this.filter.getFilteredData();
    const pool = data.length > 0 ? data : this.filter.allData;
    if (pool.length === 0) return;

    const randomPark = pool[Math.floor(Math.random() * pool.length)];
    this.map.selectPark(randomPark.id);
    this.showToast(`🎲 Discovered: ${randomPark.name}!`, "success");
  }

  // Reset Filters
  resetUIFilters() {
    this.filter.resetAll();
    this.dom.modeToggles.forEach(b => b.classList.toggle("is-active", b.getAttribute("data-mode-toggle") === "all"));
    this.dom.countryToggles.forEach(b => b.classList.toggle("is-active", b.getAttribute("data-country-toggle") === "all"));
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

  // Wishlist / Bucket List Drawer
  openWishlist() {
    this.renderWishlist();
    this.dom.wishlistDrawer?.classList.add("is-open");
    this.dom.drawerOverlay?.classList.add("is-open");
  }

  closeWishlist() {
    this.dom.wishlistDrawer?.classList.remove("is-open");
    this.dom.drawerOverlay?.classList.remove("is-open");
  }

  updateWishlistCount() {
    const count = window.storage ? window.storage.getFavorites().length : 0;
    if (this.dom.wishlistBadgeCount) {
      this.dom.wishlistBadgeCount.textContent = count;
      this.dom.wishlistBadgeCount.style.display = count > 0 ? "inline-block" : "none";
    }
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
          <p>Click the bookmark icon on any park card or detail page to save it for your next adventure.</p>
        </div>
      `;
      return;
    }

    this.dom.wishlistList.innerHTML = favParks.map(park => `
      <div class="wishlist-item" data-wishlist-id="${park.id}">
        <img src="${park.heroImage}" alt="${park.name}" class="wishlist-item-img" />
        <div class="wishlist-item-info">
          <h4 class="wishlist-item-title">${park.name}</h4>
          <p class="wishlist-item-sub">${park.country === "US" ? "🇺🇸" : "🇨🇦"} ${park.stateProvince} &bull; ${park.type === "national" ? "National" : "State"}</p>
        </div>
        <div class="wishlist-item-actions">
          <button class="wishlist-item-view-btn" title="View on Map" data-action="view" data-id="${park.id}">🗺️</button>
          <button class="wishlist-item-del-btn" title="Remove" data-action="delete" data-id="${park.id}">✕</button>
        </div>
      </div>
    `).join("");

    // Bind item actions
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
    navigator.clipboard.writeText(`--- MY TERRAIN PARK BUCKET LIST ---\n\n${text}`)
      .then(() => this.showToast("Bucket list copied to clipboard!", "success"))
      .catch(() => this.showToast("Export ready.", "info"));
  }

  // Stats / Insights Modal
  openStatsModal() {
    this.dom.statsModal?.classList.add("is-open");
    this.dom.drawerOverlay?.classList.add("is-open");
  }

  closeStatsModal() {
    this.dom.statsModal?.classList.remove("is-open");
    this.dom.drawerOverlay?.classList.remove("is-open");
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
