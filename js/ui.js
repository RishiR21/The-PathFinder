/**
 * The Terrain - UI Controller
 * Manages map views, community profiles page, sidebar cards, detail drawer, wishlist, adventure passport, sync engine, and toasts.
 */

class TerrainUI {
  constructor(mapInstance, filterInstance) {
    this.map = mapInstance;
    this.filter = filterInstance;
    this.activePark = null;
    this.selectedVisitRating = 5;
    this.selectedCommAvatar = "🌲";
    this.currentView = "map";

    this.dom = {
      // Containers & Views
      mapPageView: document.getElementById("map-page-view"),
      communityPageView: document.getElementById("community-page-view"),
      terrainMapToolbar: document.getElementById("terrain-map-toolbar"),
      headerMapControls: document.getElementById("header-map-controls"),
      parksListContainer: document.getElementById("parks-list-container"),
      resultsCounter: document.getElementById("results-counter"),
      emptyState: document.getElementById("empty-state"),
      
      // View Switcher Buttons
      viewTabMap: document.getElementById("view-tab-map"),
      viewTabCommunity: document.getElementById("view-tab-community"),
      navBrandLogo: document.getElementById("nav-brand-logo"),
      communityBackToMapBtn: document.getElementById("community-back-to-map-btn"),

      // Header Profile Pill
      headerProfileBtn: document.getElementById("passport-modal-btn"),
      headerAvatar: document.getElementById("header-avatar"),
      headerProfileName: document.getElementById("header-profile-name"),
      headerLevelBadge: document.getElementById("header-level-badge"),
      headerXpBar: document.getElementById("header-xp-bar"),

      // Community & Profiles Page
      commAddProfileForm: document.getElementById("community-add-profile-form"),
      commInputName: document.getElementById("comm-input-name"),
      commInputTitle: document.getElementById("comm-input-title"),
      commInputHome: document.getElementById("comm-input-home"),
      commInputFavoritePark: document.getElementById("comm-input-favorite-park"),
      commInputX: document.getElementById("comm-input-x"),
      commInputLinkedIn: document.getElementById("comm-input-linkedin"),
      commInputBio: document.getElementById("comm-input-bio"),
      commAvatarPicker: document.getElementById("comm-avatar-picker"),
      communityExplorersGrid: document.getElementById("community-explorers-grid"),

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
      wishlistBtn: document.getElementById("wishlist-toggle-btn"),
      wishlistBadgeCount: document.getElementById("wishlist-badge-count"),
      wishlistList: document.getElementById("wishlist-items-list"),
      wishlistCloseBtn: document.getElementById("wishlist-close-btn"),
      wishlistClearBtn: document.getElementById("wishlist-clear-btn"),
      wishlistExportBtn: document.getElementById("wishlist-export-btn"),
      wishlistFilterMapBtn: document.getElementById("wishlist-filter-map-btn"),

      // Passport Modal
      passportModal: document.getElementById("passport-modal"),
      passportModalCloseBtn: document.getElementById("passport-modal-close-btn"),
      passportTabBtns: document.querySelectorAll(".passport-tab-btn"),
      passportTabPanels: document.querySelectorAll(".passport-tab-panel"),
      
      // Passport Stamps Tab
      stampsCountTotal: document.getElementById("stamps-count-total"),
      stampsAcresTotal: document.getElementById("stamps-acres-total"),
      stampsXpTotal: document.getElementById("stamps-xp-total"),
      passportStampsGrid: document.getElementById("passport-stamps-grid"),

      // Passport Achievements Tab
      achievementsGrid: document.getElementById("achievements-grid"),

      // Passport Profile & Sync Tab
      profileAvatarDisplay: document.getElementById("profile-avatar-display"),
      profileNameInput: document.getElementById("profile-name-input"),
      profileRankDisplay: document.getElementById("profile-rank-display"),
      avatarOptBtns: document.querySelectorAll(".avatar-opt-btn"),
      personaSelectDropdown: document.getElementById("persona-select-dropdown"),
      copySyncCodeBtn: document.getElementById("copy-sync-code-btn"),
      downloadPassportBtn: document.getElementById("download-passport-btn"),
      importSyncCodeInput: document.getElementById("import-sync-code-input"),
      importSyncCodeBtn: document.getElementById("import-sync-code-btn"),

      // Log Visit Modal
      visitModal: document.getElementById("visit-modal"),
      visitModalCloseBtn: document.getElementById("visit-modal-close-btn"),
      visitModalParkName: document.getElementById("visit-modal-park-name"),
      visitDateInput: document.getElementById("visit-date-input"),
      visitStarPicker: document.getElementById("visit-star-picker"),
      visitNotesInput: document.getElementById("visit-notes-input"),
      submitVisitBtn: document.getElementById("submit-visit-btn"),

      // Toolbar Controls
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
      filterVisitedToggleBtn: document.getElementById("filter-visited-toggle-btn"),
      filterVisitedCount: document.getElementById("filter-visited-count"),
      basemapSelect: document.getElementById("basemap-select"),

      // Insights Modal
      statsModal: document.getElementById("stats-modal"),
      statsModalBtn: document.getElementById("stats-modal-btn"),
      statsModalCloseBtn: document.getElementById("stats-modal-close-btn"),

      // Toast container
      toastContainer: document.getElementById("toast-container")
    };

    this.initEventListeners();
    this.renderTagPills();
    this.updateRegionDropdown();
    this.populateCommunityParkSelect();
    this.renderCommunityRoster();
    this.updateWishlistCount();
    this.updateHeaderProfile();
    this.updateVisitedCounter();
  }

  initEventListeners() {
    // Main View Switching (Map vs Community)
    if (this.dom.viewTabMap) {
      this.dom.viewTabMap.addEventListener("click", () => this.switchView("map"));
    }
    if (this.dom.viewTabCommunity) {
      this.dom.viewTabCommunity.addEventListener("click", () => this.switchView("community"));
    }
    if (this.dom.navBrandLogo) {
      this.dom.navBrandLogo.addEventListener("click", (e) => {
        e.preventDefault();
        this.switchView("map");
      });
    }
    if (this.dom.communityBackToMapBtn) {
      this.dom.communityBackToMapBtn.addEventListener("click", () => this.switchView("map"));
    }

    // Community Avatar Selector
    if (this.dom.commAvatarPicker) {
      const avatarBtns = this.dom.commAvatarPicker.querySelectorAll(".comm-avatar-btn");
      avatarBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          avatarBtns.forEach(b => b.classList.remove("is-active"));
          btn.classList.add("is-active");
          this.selectedCommAvatar = btn.getAttribute("data-avatar");
        });
      });
    }

    // Add Community Profile Form Submit
    if (this.dom.commAddProfileForm) {
      this.dom.commAddProfileForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.submitCommunityProfile();
      });
    }

    // Mode toggles
    this.dom.modeToggles.forEach(btn => {
      btn.addEventListener("click", () => {
        this.dom.modeToggles.forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        this.filter.setMode(btn.getAttribute("data-mode-toggle"));
      });
    });

    // Country toggles
    this.dom.countryToggles.forEach(btn => {
      btn.addEventListener("click", () => {
        this.dom.countryToggles.forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        this.filter.setCountry(btn.getAttribute("data-country-toggle"));
        this.updateRegionDropdown();
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
        this.showToast(isVisitedOnly ? "Showing only visited & stamped parks" : "Showing all parks", "info");
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
        this.closePassportModal();
        this.closeVisitModal();
        this.closeStatsModal();
      });
    }

    // Drawer Bookmark Action
    if (this.dom.drawerFavBtn) {
      this.dom.drawerFavBtn.addEventListener("click", () => {
        if (!this.activePark) return;
        const isFav = window.storage.toggleFavorite(this.activePark.id);
        this.updateDrawerFavState(isFav);
        this.updateWishlistCount();
        this.updateHeaderProfile();
        this.renderWishlist();
        this.renderParksList(this.filter.getFilteredData());
        this.showToast(
          isFav ? `Added ${this.activePark.name} to your Wishlist!` : `Removed ${this.activePark.name} from Wishlist.`,
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
        if (confirm("Clear your saved park wishlist?")) {
          window.storage.clearFavorites();
          this.updateWishlistCount();
          this.updateHeaderProfile();
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
        this.switchView("map");
        this.showToast(isFavOnly ? "Showing only Wishlist parks on map" : "Showing all parks", "info");
      });
    }
    if (this.dom.wishlistExportBtn) {
      this.dom.wishlistExportBtn.addEventListener("click", () => this.exportWishlist());
    }

    // Passport & Profile Modal Toggles
    if (this.dom.headerProfileBtn) {
      this.dom.headerProfileBtn.addEventListener("click", () => this.openPassportModal());
    }
    if (this.dom.passportModalCloseBtn) {
      this.dom.passportModalCloseBtn.addEventListener("click", () => this.closePassportModal());
    }

    // Passport Tabs Switching
    this.dom.passportTabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const tab = btn.getAttribute("data-tab");
        this.switchPassportTab(tab);
      });
    });

    // Profile Settings Event Handlers
    if (this.dom.profileNameInput) {
      this.dom.profileNameInput.addEventListener("change", (e) => {
        window.storage.updateActiveProfile({ name: e.target.value });
        this.updateHeaderProfile();
        this.renderCommunityRoster();
        this.showToast("Profile name updated!", "success");
      });
    }

    this.dom.avatarOptBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const av = btn.getAttribute("data-avatar");
        window.storage.updateActiveProfile({ avatar: av });
        if (this.dom.profileAvatarDisplay) this.dom.profileAvatarDisplay.textContent = av;
        this.updateHeaderProfile();
        this.renderCommunityRoster();
        this.showToast(`Avatar changed to ${av}!`, "success");
      });
    });

    // Persona Selector Dropdown
    if (this.dom.personaSelectDropdown) {
      this.dom.personaSelectDropdown.addEventListener("change", (e) => {
        const selectedId = e.target.value;
        if (selectedId === "__new__") {
          const name = prompt("Enter name for new Explorer Persona:", "Trail Blazer");
          if (name && name.trim()) {
            const newProf = window.storage.createProfile(name.trim());
            this.updateHeaderProfile();
            this.renderPassportModalContent();
            this.renderCommunityRoster();
            this.renderParksList(this.filter.getFilteredData());
            this.map.updateParks(this.filter.getFilteredData());
            this.showToast(`Created persona: ${newProf.name}!`, "success");
          } else {
            this.renderPersonaDropdown();
          }
        } else {
          window.storage.setActiveProfile(selectedId);
          this.updateHeaderProfile();
          this.renderPassportModalContent();
          this.renderCommunityRoster();
          this.renderParksList(this.filter.getFilteredData());
          this.map.updateParks(this.filter.getFilteredData());
          this.showToast(`Switched to: ${window.storage.getActiveProfile().name}`, "info");
        }
      });
    }

    // Cloud Sync: Copy Sync Code
    if (this.dom.copySyncCodeBtn) {
      this.dom.copySyncCodeBtn.addEventListener("click", () => {
        const code = window.storage.exportSyncCode();
        if (!code) return;
        navigator.clipboard.writeText(code)
          .then(() => this.showToast("Sync Code copied! Paste on any device to restore.", "success"))
          .catch(() => prompt("Your Portable Sync Code:", code));
      });
    }

    // Cloud Sync: Download Passport Backup File
    if (this.dom.downloadPassportBtn) {
      this.dom.downloadPassportBtn.addEventListener("click", () => {
        window.storage.downloadPassportBackup();
        this.showToast("Passport backup file downloaded!", "success");
      });
    }

    // Cloud Sync: Restore / Import Sync Code
    if (this.dom.importSyncCodeBtn) {
      this.dom.importSyncCodeBtn.addEventListener("click", () => {
        const input = this.dom.importSyncCodeInput?.value;
        if (!input || !input.trim()) {
          this.showToast("Please paste a Sync Code or JSON backup first.", "warning");
          return;
        }

        const res = window.storage.importProfileData(input);
        if (res.success) {
          if (this.dom.importSyncCodeInput) this.dom.importSyncCodeInput.value = "";
          this.updateHeaderProfile();
          this.renderPassportModalContent();
          this.renderCommunityRoster();
          this.renderParksList(this.filter.getFilteredData());
          this.map.updateParks(this.filter.getFilteredData());
          this.showToast(`🎉 Restored profile: ${res.profile.name}! All stamps & progress loaded.`, "success");
        } else {
          this.showToast(`Import failed: ${res.error || 'Invalid code'}`, "warning");
        }
      });
    }

    // Visit Modal Event Handlers
    if (this.dom.visitModalCloseBtn) {
      this.dom.visitModalCloseBtn.addEventListener("click", () => this.closeVisitModal());
    }

    if (this.dom.visitStarPicker) {
      const starBtns = this.dom.visitStarPicker.querySelectorAll(".star-btn");
      starBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          const rating = parseInt(btn.getAttribute("data-rating"), 10);
          this.selectedVisitRating = rating;
          starBtns.forEach(b => {
            const r = parseInt(b.getAttribute("data-rating"), 10);
            b.classList.toggle("is-active", r <= rating);
          });
        });
      });
    }

    if (this.dom.submitVisitBtn) {
      this.dom.submitVisitBtn.addEventListener("click", () => {
        this.submitVisitLog();
      });
    }

    // Stats / Insights Modal
    if (this.dom.statsModalBtn) {
      this.dom.statsModalBtn.addEventListener("click", () => this.openStatsModal());
    }
    if (this.dom.statsModalCloseBtn) {
      this.dom.statsModalCloseBtn.addEventListener("click", () => this.closeStatsModal());
    }

    // Global Keybindings
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeDrawer();
        this.closeWishlist();
        this.closePassportModal();
        this.closeVisitModal();
        this.closeStatsModal();
      }
      if (e.key === "/" && document.activeElement !== this.dom.searchInput && !document.activeElement.matches("input, textarea")) {
        e.preventDefault();
        this.switchView("map");
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
    window.storage.subscribe((event, data) => {
      this.updateHeaderProfile();
      this.updateVisitedCounter();
      this.renderCommunityRoster();
      if (event === "visit_logged" || event === "visit_removed" || event === "profile_changed" || event === "profile_imported") {
        this.map.updateParks(this.filter.getFilteredData());
        this.renderParksList(this.filter.getFilteredData());
        if (this.activePark) {
          this.updateDrawerVisitedBanner(this.activePark.id);
        }
      }
    });
  }

  // View Switcher (Map vs Community)
  switchView(viewName) {
    this.currentView = viewName;

    if (viewName === "map") {
      this.dom.viewTabMap?.classList.add("is-active");
      this.dom.viewTabCommunity?.classList.remove("is-active");
      if (this.dom.mapPageView) this.dom.mapPageView.style.display = "flex";
      if (this.dom.communityPageView) this.dom.communityPageView.style.display = "none";
      if (this.dom.terrainMapToolbar) this.dom.terrainMapToolbar.style.display = "flex";
      if (this.dom.headerMapControls) this.dom.headerMapControls.style.display = "flex";
      
      setTimeout(() => {
        if (this.map && this.map.map) {
          this.map.map.invalidateSize();
        }
      }, 50);
    } else {
      this.dom.viewTabMap?.classList.remove("is-active");
      this.dom.viewTabCommunity?.classList.add("is-active");
      if (this.dom.mapPageView) this.dom.mapPageView.style.display = "none";
      if (this.dom.communityPageView) this.dom.communityPageView.style.display = "block";
      if (this.dom.terrainMapToolbar) this.dom.terrainMapToolbar.style.display = "none";
      if (this.dom.headerMapControls) this.dom.headerMapControls.style.display = "none";

      this.renderCommunityRoster();
    }
  }

  populateCommunityParkSelect() {
    if (!this.dom.commInputFavoritePark) return;
    const parks = window.PARKS_DATA || [];
    this.dom.commInputFavoritePark.innerHTML = parks.map(p => {
      const flag = p.country === "US" ? "🇺🇸" : "🇨🇦";
      return `<option value="${p.id}">${flag} ${p.name} (${p.stateProvince})</option>`;
    }).join("");
  }

  submitCommunityProfile() {
    const name = this.dom.commInputName.value.trim();
    if (!name) return;

    const title = this.dom.commInputTitle.value.trim() || "Trail Explorer";
    const avatar = this.selectedCommAvatar || "🌲";
    const homeBase = this.dom.commInputHome.value.trim() || "North America";
    const favoritePark = this.dom.commInputFavoritePark.value || "us-np-yellowstone";
    const socialX = this.dom.commInputX.value.trim() || "https://x.com/1RishiR";
    const socialLinkedIn = this.dom.commInputLinkedIn.value.trim() || "https://www.linkedin.com/in/rishi-ramchandani-73a74916b/";
    const bio = this.dom.commInputBio.value.trim() || "Passionate adventurer exploring North America's wildest parks.";

    const newProf = window.storage.createProfile(name, avatar, {
      title,
      homeBase,
      favoritePark,
      socialX,
      socialLinkedIn,
      bio
    });

    this.dom.commInputName.value = "";
    this.dom.commInputBio.value = "";
    this.updateHeaderProfile();
    this.renderCommunityRoster();
    this.renderPassportModalContent();

    this.showToast(`🎉 Explorer profile "${newProf.name}" registered successfully! (+200 XP)`, "success");
  }

  renderCommunityRoster() {
    if (!this.dom.communityExplorersGrid) return;
    const profiles = window.storage.getCommunityProfiles();
    const allParks = window.PARKS_DATA || [];

    this.dom.communityExplorersGrid.innerHTML = profiles.map(p => {
      const parkObj = allParks.find(pk => pk.id === p.favoritePark);
      const favParkName = parkObj ? parkObj.name : (p.favoriteParkName || "Yellowstone National Park");
      const xLink = p.socialX || "https://x.com/1RishiR";
      const linkedInLink = p.socialLinkedIn || "https://www.linkedin.com/in/rishi-ramchandani-73a74916b/";

      return `
        <div class="community-explorer-card">
          <div class="comm-card-top">
            <div class="comm-card-avatar">${p.avatar || "🌲"}</div>
            <div class="comm-card-meta">
              <h4 class="comm-card-name">${p.name}</h4>
              <p class="comm-card-title">${p.title || "Trail Explorer"}</p>
              <span class="comm-card-rank-badge">${p.rankTitle || "Trail Scout"} (Lvl ${p.level || 1})</span>
            </div>
          </div>

          <p class="comm-card-bio">${p.bio || "Exploring the wild natural heritage of North America."}</p>

          <div class="comm-card-fav">
            <span>Favorite: </span><strong>${favParkName}</strong>
          </div>

          <div class="comm-card-socials">
            <a href="${xLink}" target="_blank" rel="noopener noreferrer" class="comm-social-icon-btn" title="X Profile">
              <span>𝕏 / Twitter</span>
            </a>
            <a href="${linkedInLink}" target="_blank" rel="noopener noreferrer" class="comm-social-icon-btn" title="LinkedIn Profile">
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      `;
    }).join("");
  }

  updateHeaderProfile() {
    const profile = window.storage.getActiveProfile();
    if (!profile || !window.passport) return;

    const progress = window.passport.getProfileProgress(profile);

    if (this.dom.headerAvatar) this.dom.headerAvatar.textContent = profile.avatar || "🌲";
    if (this.dom.headerProfileName) this.dom.headerProfileName.textContent = profile.name || "Explorer";
    if (this.dom.headerLevelBadge) this.dom.headerLevelBadge.textContent = `Lvl ${progress.level}`;
    if (this.dom.headerXpBar) this.dom.headerXpBar.style.width = `${progress.progressPercent}%`;
  }

  updateVisitedCounter() {
    const visitedCount = window.storage.getVisitedList().length;
    if (this.dom.filterVisitedCount) {
      this.dom.filterVisitedCount.textContent = visitedCount;
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

    parks.forEach(park => {
      const card = document.createElement("div");
      card.className = `park-card ${park.id === (this.activePark?.id) ? "is-active" : ""}`;
      card.setAttribute("data-park-id", park.id);

      const isFav = window.storage.isFavorite(park.id);
      const isVisited = window.storage.isVisited(park.id);
      const visitData = isVisited ? window.storage.getVisitDetails(park.id) : null;
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
          ${isVisited ? `<span class="park-visited-badge" title="Stamped in Passport: ${visitData?.date || 'Visited'}">★ Stamped</span>` : ""}
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
        this.updateHeaderProfile();
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
        ? `<span>✓ Stamped in Passport</span>`
        : `<span>🌲 Stamp in Passport</span>`;
      this.dom.drawerLogVisitBtn.classList.toggle("primary", !isVisited);
    }

    if (isVisited && visitData) {
      if (this.dom.drawerStampDate) {
        this.dom.drawerStampDate.textContent = `★ Stamped on ${visitData.date} (${"★".repeat(visitData.rating || 5)})`;
      }
      if (this.dom.drawerStampNotes) {
        this.dom.drawerStampNotes.textContent = visitData.notes ? `"${visitData.notes}"` : "No journal notes added.";
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

    const tags = this.filter.getAllTags().slice(0, 14);

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

  updateCounter(count) {
    if (this.dom.resultsCounter) {
      const mode = this.filter.state.mode;
      const modeLabel = mode === "national" ? "National Parks" : mode === "state" ? "State/Provincial Parks" : "Parks";
      this.dom.resultsCounter.innerHTML = `Showing <strong>${count}</strong> ${modeLabel}`;
    }
  }

  triggerSurpriseMe() {
    this.switchView("map");
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

  // ==========================================
  // --- Log Park Visit Dialog ---
  // ==========================================
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

    const rating = existing?.rating || 5;
    this.selectedVisitRating = rating;
    if (this.dom.visitStarPicker) {
      const starBtns = this.dom.visitStarPicker.querySelectorAll(".star-btn");
      starBtns.forEach(b => {
        const r = parseInt(b.getAttribute("data-rating"), 10);
        b.classList.toggle("is-active", r <= rating);
      });
    }

    this.dom.visitModal?.classList.add("is-open");
    this.dom.drawerOverlay?.classList.add("is-open");
  }

  closeVisitModal() {
    this.dom.visitModal?.classList.remove("is-open");
    if (!this.dom.detailDrawer?.classList.contains("is-open") &&
        !this.dom.wishlistDrawer?.classList.contains("is-open") &&
        !this.dom.passportModal?.classList.contains("is-open") &&
        !this.dom.statsModal?.classList.contains("is-open")) {
      this.dom.drawerOverlay?.classList.remove("is-open");
    }
  }

  submitVisitLog() {
    if (!this.activePark) return;

    const date = this.dom.visitDateInput.value;
    const rating = this.selectedVisitRating;
    const notes = this.dom.visitNotesInput.value;

    const entry = window.storage.logVisit(this.activePark.id, { date, rating, notes });
    this.closeVisitModal();

    this.updateHeaderProfile();
    this.updateVisitedCounter();
    this.updateDrawerVisitedBanner(this.activePark.id);
    this.renderParksList(this.filter.getFilteredData());
    this.map.updateParks(this.filter.getFilteredData());

    this.showToast(`🎉 Stamped ${this.activePark.name} in your Adventure Passport! (+150 XP)`, "success");
  }

  // ==========================================
  // --- Clean Passport & Profiles Modal ---
  // ==========================================
  openPassportModal() {
    this.renderPassportModalContent();
    this.dom.passportModal?.classList.add("is-open");
    this.dom.drawerOverlay?.classList.add("is-open");
  }

  closePassportModal() {
    this.dom.passportModal?.classList.remove("is-open");
    this.dom.drawerOverlay?.classList.remove("is-open");
  }

  switchPassportTab(tabName) {
    this.dom.passportTabBtns.forEach(btn => {
      btn.classList.toggle("is-active", btn.getAttribute("data-tab") === tabName);
    });

    this.dom.passportTabPanels.forEach(panel => {
      panel.classList.toggle("is-active", panel.id === `passport-tab-${tabName}`);
    });
  }

  renderPassportModalContent() {
    if (!window.passport) return;

    const profile = window.storage.getActiveProfile();
    const progress = window.passport.getProfileProgress(profile);
    const visitedParks = window.passport.getVisitedParkObjects();
    const stats = window.passport.getTravelStats();

    // Tab 1: Stamps Overview Chips
    if (this.dom.stampsCountTotal) this.dom.stampsCountTotal.textContent = stats.totalVisited;
    if (this.dom.stampsAcresTotal) this.dom.stampsAcresTotal.textContent = `${(stats.totalAcreage / 1000000).toFixed(1)}M`;
    if (this.dom.stampsXpTotal) this.dom.stampsXpTotal.textContent = `${progress.xp.toLocaleString()} XP`;

    // Render Clean Stamps Grid
    if (this.dom.passportStampsGrid) {
      if (visitedParks.length === 0) {
        this.dom.passportStampsGrid.innerHTML = `
          <div class="wishlist-empty" style="grid-column: 1 / -1; padding: 24px;">
            <div class="wishlist-empty-icon">📔</div>
            <h4>No Passport Stamps Yet</h4>
            <p>Click "Stamp in Passport" on any park to collect vintage cancellation stamps and level up your explorer rank!</p>
          </div>
        `;
      } else {
        this.dom.passportStampsGrid.innerHTML = visitedParks.map(park => {
          const stampSvg = window.passport.generateStampSvg(park, park.visitData);
          const stars = "★".repeat(park.visitData?.rating || 5);
          return `
            <div class="passport-stamp-card" data-stamp-id="${park.id}">
              ${stampSvg}
              <div class="stamp-card-stars">${stars}</div>
              ${park.visitData?.notes ? `<p class="stamp-card-notes">"${park.visitData.notes}"</p>` : ""}
            </div>
          `;
        }).join("");

        this.dom.passportStampsGrid.querySelectorAll(".passport-stamp-card").forEach(card => {
          card.addEventListener("click", () => {
            const id = card.getAttribute("data-stamp-id");
            this.closePassportModal();
            this.switchView("map");
            this.map.selectPark(id);
          });
        });
      }
    }

    // Tab 2: 6 Core Achievements
    const achievements = window.passport.getAllAchievementsStatus();
    if (this.dom.achievementsGrid) {
      this.dom.achievementsGrid.innerHTML = achievements.map(ach => `
        <div class="achievement-card ${ach.isUnlocked ? "is-unlocked" : ""}">
          <div class="ach-header">
            <span class="ach-icon">${ach.icon}</span>
            <span class="ach-xp-badge">+${ach.xp} XP</span>
          </div>
          <h4 class="ach-title">${ach.title} ${ach.isUnlocked ? "✓" : ""}</h4>
          <p class="ach-desc">${ach.desc}</p>
          <div class="ach-progress-bar-wrap">
            <div class="ach-progress-bar-fill" style="width: ${(ach.progress.current / ach.progress.target) * 100}%;"></div>
          </div>
        </div>
      `).join("");
    }

    // Tab 3: Profile Editor & Sync
    if (this.dom.profileAvatarDisplay) this.dom.profileAvatarDisplay.textContent = profile.avatar || "🌲";
    if (this.dom.profileNameInput) this.dom.profileNameInput.value = profile.name || "Trail Explorer";
    if (this.dom.profileRankDisplay) this.dom.profileRankDisplay.textContent = `${progress.rank.title} (Lvl ${progress.level})`;

    this.renderPersonaDropdown();
  }

  renderPersonaDropdown() {
    if (!this.dom.personaSelectDropdown) return;
    const profiles = window.storage.getProfiles();
    const activeProf = window.storage.getActiveProfile();

    this.dom.personaSelectDropdown.innerHTML = `
      ${profiles.map(p => `<option value="${p.id}" ${p.id === activeProf.id ? "selected" : ""}>${p.avatar || "🌲"} ${p.name}</option>`).join("")}
      <option value="__new__">➕ Create New Persona...</option>
    `;
  }

  // Wishlist
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

    this.dom.wishlistList.querySelectorAll("[data-action='view']").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        this.closeWishlist();
        this.switchView("map");
        this.map.selectPark(id);
      });
    });

    this.dom.wishlistList.querySelectorAll("[data-action='delete']").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        window.storage.toggleFavorite(id);
        this.updateWishlistCount();
        this.updateHeaderProfile();
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
    }, 3400);
  }
}

if (typeof window !== "undefined") {
  window.TerrainUI = TerrainUI;
}
