/**
 * PathFinder - UI Controller
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
      authModalBtn: document.getElementById("auth-modal-btn"),
      authBtnIcon: document.getElementById("auth-btn-icon"),
      authBtnLabel: document.getElementById("auth-btn-label"),
      authSyncDot: document.getElementById("auth-sync-dot"),
      journeyModalBtn: document.getElementById("journey-modal-btn"),
      journeyBadgeCount: document.getElementById("journey-badge-count"),
      wishlistToggleBtn: document.getElementById("wishlist-toggle-btn"),
      wishlistBadgeCount: document.getElementById("wishlist-badge-count"),
      surpriseBtn: document.getElementById("surprise-me-btn"),
      aboutModalBtn: document.getElementById("about-modal-btn"),

      // Auth Modal Elements
      authModal: document.getElementById("auth-modal"),
      authModalCloseBtn: document.getElementById("auth-modal-close-btn"),
      authModalBackdrop: document.getElementById("auth-modal-backdrop"),
      authStepEmail: document.getElementById("auth-step-email"),
      authStepCode: document.getElementById("auth-step-code"),
      authStepSuccess: document.getElementById("auth-step-success"),
      authEmailForm: document.getElementById("auth-email-form"),
      authEmailInput: document.getElementById("auth-email-input"),
      authSendCodeBtn: document.getElementById("auth-send-code-btn"),
      authEmailError: document.getElementById("auth-email-error"),
      authCodeForm: document.getElementById("auth-code-form"),
      authOtpInput: document.getElementById("auth-otp-input"),
      authVerifyBtn: document.getElementById("auth-verify-btn"),
      authCodeError: document.getElementById("auth-code-error"),
      authCodeSentEmail: document.getElementById("auth-code-sent-email"),
      authResendBtn: document.getElementById("auth-resend-btn"),
      authResendTimerText: document.getElementById("auth-resend-timer-text"),
      authCountdown: document.getElementById("auth-countdown"),
      authChangeEmailBtn: document.getElementById("auth-change-email-btn"),
      authSuccessDoneBtn: document.getElementById("auth-success-done-btn"),
      authConfigToggleBtn: document.getElementById("auth-config-toggle-btn"),
      authConfigPanel: document.getElementById("auth-config-panel"),
      supabaseUrlInput: document.getElementById("supabase-url-input"),
      supabaseKeyInput: document.getElementById("supabase-key-input"),
      supabaseSaveConfigBtn: document.getElementById("supabase-save-config-btn"),

      // Profile Modal Elements
      profileModal: document.getElementById("profile-modal"),
      profileModalCloseBtn: document.getElementById("profile-modal-close-btn"),
      profileModalBackdrop: document.getElementById("profile-modal-backdrop"),
      profileAvatarDisplay: document.getElementById("profile-avatar-display"),
      profileName: document.getElementById("profile-modal-title"),
      profileEmailDisplay: document.getElementById("profile-email-display"),
      profileSyncBadge: document.getElementById("profile-sync-badge"),
      profileStatVisited: document.getElementById("profile-stat-visited"),
      profileStatWishlist: document.getElementById("profile-stat-wishlist"),
      profileStatNationalPct: document.getElementById("profile-stat-national-pct"),
      profileStatStatePct: document.getElementById("profile-stat-state-pct"),
      profileSyncNowBtn: document.getElementById("profile-sync-now-btn"),
      profileSignoutBtn: document.getElementById("profile-signout-btn"),
      profileEmojiBtns: document.querySelectorAll(".profile-emoji-btn"),

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

      // Mobile Navigation & View Controls
      mobileBtnMap: document.getElementById("mobile-btn-map"),
      mobileBtnList: document.getElementById("mobile-btn-list"),
      mobileListCount: document.getElementById("mobile-list-count"),
      mobileNavMapBtn: document.getElementById("mobile-nav-map-btn"),
      mobileNavJourneyBtn: document.getElementById("mobile-nav-journey-btn"),
      mobileNavWishlistBtn: document.getElementById("mobile-nav-wishlist-btn"),
      mobileNavSurpriseBtn: document.getElementById("mobile-nav-surprise-btn"),
      mobileNavAboutBtn: document.getElementById("mobile-nav-about-btn"),
      mobileJourneyBadge: document.getElementById("mobile-journey-badge"),
      mobileWishlistBadge: document.getElementById("mobile-wishlist-badge"),

      // Toast container
      toastContainer: document.getElementById("toast-container")
    };

    this.mobileView = "map";

    this.initEventListeners();
    this.renderTagPills();
    this.updateRegionDropdown();
    this.updateWishlistCount();
    this.updateJourneyCount();
    this.updateResetButtonState();
    this.initSupabaseIntegration();

    window.addEventListener("resize", () => this.updatePillScrollButtons());
  }

  initEventListeners() {
    // Brand Logo Click - Smooth recenter and reset without tab navigation
    if (this.dom.navBrandLogo) {
      this.dom.navBrandLogo.addEventListener("click", (e) => {
        e.preventDefault();
        this.resetUIFilters();
        this.map.recenter();
        this.setMobileView("map");
      });
    }

    // Mode Switcher Buttons
    this.dom.modeToggles.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
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

    // Share Deep Link & Coordinates
    if (this.dom.drawerShareBtn) {
      this.dom.drawerShareBtn.addEventListener("click", () => {
        if (!this.activePark) return;
        this.sharePark(this.activePark);
      });
    }

    // Handle browser back/forward history navigation for park deep links
    window.addEventListener("popstate", () => {
      const urlParams = new URLSearchParams(window.location.search);
      const parkId = urlParams.get("park") || urlParams.get("p");
      if (parkId) {
        const park = (window.PARKS_DATA || []).find(p => p.id === parkId);
        if (park) {
          this.map.selectPark(park.id);
          this.openDrawer(park);
        }
      } else {
        this.closeDrawer();
      }
    });

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
        a.download = "pathfinder_journey_backup.json";
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

    // Auth Modal & Profile Modal Handlers
    if (this.dom.authModalBtn) {
      this.dom.authModalBtn.addEventListener("click", () => this.openAuthOrProfileModal());
    }
    if (this.dom.authModalCloseBtn) {
      this.dom.authModalCloseBtn.addEventListener("click", () => this.closeAuthModal());
    }
    if (this.dom.authModalBackdrop) {
      this.dom.authModalBackdrop.addEventListener("click", () => this.closeAuthModal());
    }
    if (this.dom.authOtpInput) {
      this.dom.authOtpInput.addEventListener("input", (e) => {
        const val = (e.target.value || "").replace(/\D/g, "");
        e.target.value = val;
        if (val.length === 6) {
          this.handleVerifyEmailOtp();
        }
      });
    }
    if (this.dom.authEmailForm) {
      this.dom.authEmailForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSendEmailOtp();
      });
    }
    if (this.dom.authCodeForm) {
      this.dom.authCodeForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleVerifyEmailOtp();
      });
    }
    if (this.dom.authResendBtn) {
      this.dom.authResendBtn.addEventListener("click", () => this.handleSendEmailOtp());
    }
    if (this.dom.authChangeEmailBtn) {
      this.dom.authChangeEmailBtn.addEventListener("click", () => this.showAuthEmailStep());
    }
    if (this.dom.authSuccessDoneBtn) {
      this.dom.authSuccessDoneBtn.addEventListener("click", () => this.closeAuthModal());
    }
    if (this.dom.authConfigToggleBtn) {
      this.dom.authConfigToggleBtn.addEventListener("click", () => this.toggleAuthConfigPanel());
    }
    if (this.dom.supabaseSaveConfigBtn) {
      this.dom.supabaseSaveConfigBtn.addEventListener("click", () => this.handleSaveSupabaseConfig());
    }

    // Global ESC Key Listener to dismiss any active modal, lightbox, or drawer
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" || e.keyCode === 27) {
        this.closeAllModalsAndDrawers();
      }
    });

    // Profile Modal Handlers
    if (this.dom.profileModalCloseBtn) {
      this.dom.profileModalCloseBtn.addEventListener("click", () => this.closeProfileModal());
    }
    if (this.dom.profileModalBackdrop) {
      this.dom.profileModalBackdrop.addEventListener("click", () => this.closeProfileModal());
    }
    if (this.dom.profileSignoutBtn) {
      this.dom.profileSignoutBtn.addEventListener("click", () => this.handleSignOut());
    }
    if (this.dom.profileSyncNowBtn) {
      this.dom.profileSyncNowBtn.addEventListener("click", () => this.handleSyncNow());
    }
    if (this.dom.profileEmojiBtns) {
      this.dom.profileEmojiBtns.forEach(btn => {
        btn.addEventListener("click", () => {
          const emoji = btn.getAttribute("data-emoji");
          this.handleSelectAvatar(emoji);
        });
      });
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

    // Mobile View Toggle (Map ↔ List)
    if (this.dom.mobileBtnMap) {
      this.dom.mobileBtnMap.addEventListener("click", () => this.setMobileView("map"));
    }
    if (this.dom.mobileBtnList) {
      this.dom.mobileBtnList.addEventListener("click", () => this.setMobileView("list"));
    }

    // Mobile Bottom Navigation Dock
    if (this.dom.mobileNavMapBtn) {
      this.dom.mobileNavMapBtn.addEventListener("click", () => this.setMobileView(this.mobileView === "map" ? "list" : "map"));
    }
    if (this.dom.mobileNavJourneyBtn) {
      this.dom.mobileNavJourneyBtn.addEventListener("click", () => this.openJourneyModal());
    }
    if (this.dom.mobileNavWishlistBtn) {
      this.dom.mobileNavWishlistBtn.addEventListener("click", () => this.openWishlist());
    }
    if (this.dom.mobileNavSurpriseBtn) {
      this.dom.mobileNavSurpriseBtn.addEventListener("click", () => this.triggerSurpriseMe());
    }
    if (this.dom.mobileNavAboutBtn) {
      this.dom.mobileNavAboutBtn.addEventListener("click", () => this.openAboutModal());
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
      this.updateResetButtonState();
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
    if (this.dom.mobileWishlistBadge) {
      this.dom.mobileWishlistBadge.textContent = count;
      this.dom.mobileWishlistBadge.style.display = count > 0 ? "inline-block" : "none";
    }
  }

  updateJourneyCount() {
    const count = window.storage ? window.storage.getVisitedList().length : 0;
    if (this.dom.journeyBadgeCount) {
      this.dom.journeyBadgeCount.textContent = count;
      this.dom.journeyBadgeCount.style.display = count > 0 ? "inline-block" : "none";
    }
    if (this.dom.mobileJourneyBadge) {
      this.dom.mobileJourneyBadge.textContent = count;
      this.dom.mobileJourneyBadge.style.display = count > 0 ? "inline-block" : "none";
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
          <img src="${park.heroImage}" alt="${park.name}" loading="lazy" class="park-card-img" onload="this.classList.add('is-loaded')" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'; this.classList.add('is-loaded');" />
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
        this.openDrawer(park);
        this.highlightActiveCard(park.id);
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
      this.dom.drawerHeroImg.classList.remove("is-loaded");
      this.dom.drawerHeroImg.onload = () => {
        this.dom.drawerHeroImg.classList.add("is-loaded");
      };
      this.dom.drawerHeroImg.onerror = () => {
        this.dom.drawerHeroImg.src = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80";
        this.dom.drawerHeroImg.classList.add("is-loaded");
      };
      this.dom.drawerHeroImg.src = park.heroImage;
      if (this.dom.drawerHeroImg.complete) {
        this.dom.drawerHeroImg.classList.add("is-loaded");
      }
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

    if (this.dom.drawerOfficialLink) {
      if (park.officialUrl && park.officialUrl !== "#") {
        this.dom.drawerOfficialLink.href = park.officialUrl;
        this.dom.drawerOfficialLink.style.display = "inline-flex";
      } else {
        this.dom.drawerOfficialLink.removeAttribute("href");
        this.dom.drawerOfficialLink.style.display = "none";
      }
    }
    if (this.dom.drawerDirectionsLink) {
      this.dom.drawerDirectionsLink.href = `https://www.google.com/maps/dir/?api=1&destination=${park.coordinates[0]},${park.coordinates[1]}`;
    }

    this.updateDrawerFavState(window.storage.isFavorite(park.id));
    this.updateDrawerVisitedBanner(park.id);

    // Sync deep-link query parameter in browser address bar
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("park", park.id);
      window.history.replaceState({ parkId: park.id }, "", url.toString());
    } catch (e) {}

    this.dom.detailDrawer?.classList.add("is-open");
    this.dom.drawerOverlay?.classList.add("is-open");
  }

  closeDrawer() {
    this.activePark = null;
    this.dom.detailDrawer?.classList.remove("is-open");
    this.dom.drawerOverlay?.classList.remove("is-open");

    // Clean up query parameter when drawer is closed
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete("park");
      url.searchParams.delete("p");
      window.history.replaceState({}, "", url.pathname + (url.search ? url.search : ""));
    } catch (e) {}
  }

  sharePark(park) {
    const origin = window.location.origin && window.location.origin !== "null" ? window.location.origin : "https://the-path-finder.vercel.app";
    const pathname = window.location.pathname && window.location.pathname !== "blank" ? window.location.pathname : "/";
    const shareUrl = `${origin}${pathname}?park=${encodeURIComponent(park.id)}`;

    if (navigator.share) {
      navigator.share({
        title: `${park.name} | PathFinder`,
        text: `Explore ${park.name} (${park.stateProvince}) on PathFinder!`,
        url: shareUrl
      })
      .then(() => this.showToast("Park shared successfully!", "success"))
      .catch((err) => {
        if (err && err.name !== "AbortError") {
          this.copyShareUrl(park, shareUrl);
        }
      });
    } else {
      this.copyShareUrl(park, shareUrl);
    }
  }

  copyShareUrl(park, shareUrl) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl)
        .then(() => this.showToast(`PathFinder link for ${park.name} copied to clipboard!`, "success"))
        .catch(() => {
          prompt(`Share link for ${park.name}:`, shareUrl);
        });
    } else {
      prompt(`Share link for ${park.name}:`, shareUrl);
    }
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
    if (this.dom.mobileListCount) {
      this.dom.mobileListCount.textContent = count;
    }
  }

  setMobileView(view) {
    this.mobileView = view;
    if (view === "list") {
      document.body.classList.add("mobile-view-list");
    } else {
      document.body.classList.remove("mobile-view-list");
    }

    if (this.dom.mobileBtnMap) {
      this.dom.mobileBtnMap.classList.toggle("is-active", view === "map");
    }
    if (this.dom.mobileBtnList) {
      this.dom.mobileBtnList.classList.toggle("is-active", view === "list");
    }

    // Trigger map canvas resize recalculation
    setTimeout(() => {
      if (this.map && this.map.map) {
        this.map.map.invalidateSize();
      }
    }, 150);
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
    this.updateResetButtonState();
    this.showToast("All filters reset", "info");
  }

  updateResetButtonState() {
    if (!this.dom.resetFiltersBtn) return;
    const hasActive = this.filter.hasActiveFilters();
    this.dom.resetFiltersBtn.classList.toggle("has-active-filters", hasActive);
    if (hasActive) {
      this.dom.resetFiltersBtn.setAttribute("title", "Filters active — Click to reset all");
    } else {
      this.dom.resetFiltersBtn.setAttribute("title", "Clear all active filters");
    }
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

        this.dom.journeyParksList.querySelectorAll(".journey-item-card").forEach(card => {
          card.addEventListener("click", (e) => {
            const id = card.getAttribute("data-park-id");
            const park = (window.PARKS_DATA || []).find(p => p.id === id);
            if (park) {
              this.closeJourneyModal();
              this.openDrawer(park);
              this.map.selectPark(id);
            }
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

    this.dom.wishlistList.querySelectorAll(".wishlist-item").forEach(item => {
      item.addEventListener("click", (e) => {
        if (e.target.closest("[data-action='delete']")) return;
        const id = item.getAttribute("data-wishlist-id");
        const park = (window.PARKS_DATA || []).find(p => p.id === id);
        if (park) {
          this.closeWishlist();
          this.openDrawer(park);
          this.map.selectPark(id);
        }
      });
    });

    this.dom.wishlistList.querySelectorAll("[data-action='delete']").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
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
    navigator.clipboard.writeText(`--- PATHFINDER: PARK WISHLIST ---\n\n${text}`)
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

  // --- Supabase Authentication & Profile Controller ---

  initSupabaseIntegration() {
    if (!window.supabaseService) return;

    // Listen to Auth State changes
    window.supabaseService.onAuthStateChange((event, session, user, profile) => {
      this.updateAuthUI(user, profile);
      this.updateWishlistCount();
      this.updateJourneyCount();
      this.renderWishlist();
      this.renderParksList(this.filter.getFilteredData());
    });

    // Listen to Cloud Sync changes
    window.supabaseService.onSyncStatusChange((status, lastTime) => {
      this.updateSyncStatusUI(status, lastTime);
    });

    // Initial populate of Supabase settings inputs if stored
    if (this.dom.supabaseUrlInput) {
      this.dom.supabaseUrlInput.value = window.supabaseService.url || "";
    }
    if (this.dom.supabaseKeyInput) {
      this.dom.supabaseKeyInput.value = window.supabaseService.anonKey || "";
    }
  }

  openAuthOrProfileModal() {
    if (window.supabaseService && window.supabaseService.currentUser) {
      this.openProfileModal();
    } else {
      this.openAuthModal();
    }
  }

  openAuthModal() {
    this.showAuthEmailStep();
    if (this.dom.authModal) {
      this.dom.authModal.style.display = "flex";
      setTimeout(() => this.dom.authModal.classList.add("is-open"), 10);
    }
    if (this.dom.authEmailInput) {
      setTimeout(() => this.dom.authEmailInput.focus(), 100);
    }
  }

  closeAllModalsAndDrawers() {
    this.closeAuthModal();
    this.closeProfileModal();
    this.closeJourneyModal();
    this.closeWishlist();
    this.closeVisitModal();
    this.closeAboutModal();
    this.closePhotoLightbox();
    this.closeDrawer();
  }

  closeAuthModal() {
    if (this.dom.authModal) {
      this.dom.authModal.classList.remove("is-open");
      setTimeout(() => {
        this.dom.authModal.style.display = "none";
        this.clearAuthErrors();
      }, 200);
    }
    clearInterval(this.resendInterval);
  }

  showAuthEmailStep() {
    if (this.dom.authStepEmail) this.dom.authStepEmail.style.display = "block";
    if (this.dom.authStepCode) this.dom.authStepCode.style.display = "none";
    if (this.dom.authStepSuccess) this.dom.authStepSuccess.style.display = "none";
    this.clearAuthErrors();
    clearInterval(this.resendInterval);
  }

  showAuthCodeStep(email) {
    if (this.dom.authStepEmail) this.dom.authStepEmail.style.display = "none";
    if (this.dom.authStepCode) this.dom.authStepCode.style.display = "block";
    if (this.dom.authStepSuccess) this.dom.authStepSuccess.style.display = "none";
    if (this.dom.authCodeSentEmail) this.dom.authCodeSentEmail.textContent = email;
    if (this.dom.authOtpInput) {
      this.dom.authOtpInput.value = "";
      setTimeout(() => this.dom.authOtpInput.focus(), 100);
    }
    this.clearAuthErrors();
    this.startResendCountdown(45);
  }

  showAuthSuccessStep() {
    if (this.dom.authStepEmail) this.dom.authStepEmail.style.display = "none";
    if (this.dom.authStepCode) this.dom.authStepCode.style.display = "none";
    if (this.dom.authStepSuccess) this.dom.authStepSuccess.style.display = "block";
    clearInterval(this.resendInterval);
  }

  clearAuthErrors() {
    if (this.dom.authEmailError) {
      this.dom.authEmailError.textContent = "";
      this.dom.authEmailError.style.display = "none";
    }
    if (this.dom.authCodeError) {
      this.dom.authCodeError.textContent = "";
      this.dom.authCodeError.style.display = "none";
    }
  }

  startResendCountdown(seconds = 45) {
    clearInterval(this.resendInterval);
    let remaining = seconds;
    if (this.dom.authCountdown) this.dom.authCountdown.textContent = remaining;
    if (this.dom.authResendTimerText) this.dom.authResendTimerText.style.display = "inline";
    if (this.dom.authResendBtn) this.dom.authResendBtn.style.display = "none";

    this.resendInterval = setInterval(() => {
      remaining--;
      if (this.dom.authCountdown) this.dom.authCountdown.textContent = remaining;
      if (remaining <= 0) {
        clearInterval(this.resendInterval);
        if (this.dom.authResendTimerText) this.dom.authResendTimerText.style.display = "none";
        if (this.dom.authResendBtn) this.dom.authResendBtn.style.display = "inline-block";
      }
    }, 1000);
  }

  async handleSendEmailOtp() {
    const email = (this.dom.authEmailInput?.value || "").trim();
    if (!email || !email.includes("@")) {
      this.showAuthError("email", "Please enter a valid email address.");
      return;
    }

    if (!window.supabaseService || !window.supabaseService.isConfigured()) {
      this.showAuthError("email", "Please configure your Supabase Project URL & Key below first.");
      this.toggleAuthConfigPanel(true);
      return;
    }

    try {
      this.setAuthButtonLoading(this.dom.authSendCodeBtn, true, "Sending Code...");
      await window.supabaseService.sendEmailOtp(email);
      this.showAuthCodeStep(email);
      this.showToast(`Verification code sent to ${email}`, "success");
    } catch (err) {
      console.error(err);
      this.showAuthError("email", err.message || "Could not send verification code. Please check your Supabase credentials.");
    } finally {
      this.setAuthButtonLoading(this.dom.authSendCodeBtn, false, "Send Verification Code →");
    }
  }

  async handleVerifyEmailOtp() {
    const email = (this.dom.authEmailInput?.value || "").trim();
    const token = (this.dom.authOtpInput?.value || "").trim();

    if (!token || token.length < 6) {
      this.showAuthError("code", "Please enter the complete 6-digit code.");
      return;
    }

    try {
      this.setAuthButtonLoading(this.dom.authVerifyBtn, true, "Verifying...");
      await window.supabaseService.verifyEmailOtp(email, token);
      this.showAuthSuccessStep();
      this.showToast("Signed in successfully! Cloud sync active.", "success");
    } catch (err) {
      console.error(err);
      this.showAuthError("code", err.message || "Invalid or expired verification code. Please try again.");
    } finally {
      this.setAuthButtonLoading(this.dom.authVerifyBtn, false, "Verify & Sign In ✓");
    }
  }

  showAuthError(type, msg) {
    const el = type === "email" ? this.dom.authEmailError : this.dom.authCodeError;
    if (el) {
      el.textContent = msg;
      el.style.display = "block";
    }
  }

  setAuthButtonLoading(btn, isLoading, text) {
    if (!btn) return;
    btn.disabled = isLoading;
    btn.innerHTML = isLoading ? `<span class="auth-spinner"></span> <span>${text}</span>` : `<span>${text}</span>`;
  }

  toggleAuthConfigPanel(forceOpen = false) {
    if (!this.dom.authConfigPanel) return;
    const isShown = forceOpen || this.dom.authConfigPanel.style.display !== "block";
    this.dom.authConfigPanel.style.display = isShown ? "block" : "none";
  }

  handleSaveSupabaseConfig() {
    const url = (this.dom.supabaseUrlInput?.value || "").trim();
    const key = (this.dom.supabaseKeyInput?.value || "").trim();

    if (!url || !key) {
      this.showToast("Please enter both Supabase URL and Anon Key", "warning");
      return;
    }

    if (window.supabaseService) {
      try {
        const ok = window.supabaseService.configure(url, key);
        if (ok) {
          this.showToast("Supabase configuration saved & connected!", "success");
          this.toggleAuthConfigPanel(false);
          this.clearAuthErrors();
        } else {
          this.showToast("Failed to initialize Supabase client. Check URL/Key format.", "error");
        }
      } catch (err) {
        this.showToast(err.message || "Invalid Supabase key", "error");
        this.showAuthError("email", err.message);
      }
    }
  }

  // --- Profile Modal Controller ---

  openProfileModal() {
    const user = window.supabaseService?.currentUser;
    const profile = window.supabaseService?.currentProfile;
    if (!user) {
      this.openAuthModal();
      return;
    }

    const email = user.email || "explorer@example.com";
    const name = profile?.full_name || email.split("@")[0];
    const avatar = profile?.avatar_emoji || "🌲";

    if (this.dom.profileName) this.dom.profileName.textContent = name;
    if (this.dom.profileEmailDisplay) this.dom.profileEmailDisplay.textContent = email;
    if (this.dom.profileAvatarDisplay) this.dom.profileAvatarDisplay.textContent = avatar;

    // Update Travel Stats
    const stats = window.passport ? window.passport.calculateStats() : { visitedCount: 0 };
    const favCount = window.storage ? window.storage.getFavorites().length : 0;
    const allParks = window.PARKS_DATA || [];
    const nationalTotal = allParks.filter(p => p.type === "national").length || 85;
    const stateTotal = allParks.filter(p => p.type === "state").length || 85;

    const visitedNational = (stats.visitedParks || []).filter(p => p.type === "national").length;
    const visitedState = (stats.visitedParks || []).filter(p => p.type === "state").length;

    if (this.dom.profileStatVisited) this.dom.profileStatVisited.textContent = stats.visitedCount || 0;
    if (this.dom.profileStatWishlist) this.dom.profileStatWishlist.textContent = favCount;
    if (this.dom.profileStatNationalPct) this.dom.profileStatNationalPct.textContent = `${Math.round((visitedNational / nationalTotal) * 100)}%`;
    if (this.dom.profileStatStatePct) this.dom.profileStatStatePct.textContent = `${Math.round((visitedState / stateTotal) * 100)}%`;

    if (this.dom.profileModal) {
      this.dom.profileModal.style.display = "flex";
      setTimeout(() => this.dom.profileModal.classList.add("is-open"), 10);
    }
  }

  closeProfileModal() {
    if (this.dom.profileModal) {
      this.dom.profileModal.classList.remove("is-open");
      setTimeout(() => {
        this.dom.profileModal.style.display = "none";
      }, 200);
    }
  }

  async handleSelectAvatar(emoji) {
    if (!emoji || !window.supabaseService) return;
    if (this.dom.profileAvatarDisplay) this.dom.profileAvatarDisplay.textContent = emoji;
    if (this.dom.authBtnIcon) this.dom.authBtnIcon.textContent = emoji;

    try {
      await window.supabaseService.updateProfile({ avatar_emoji: emoji });
      this.showToast(`Avatar updated to ${emoji}`, "success");
    } catch (e) {
      console.warn("Could not save avatar to cloud:", e);
    }
  }

  async handleSyncNow() {
    if (!window.supabaseService) return;
    try {
      this.showToast("Synchronizing with Supabase cloud...", "info");
      await window.supabaseService.syncWithCloud();
      this.updateWishlistCount();
      this.updateJourneyCount();
      this.renderWishlist();
      this.renderParksList(this.filter.getFilteredData());
      this.showToast("Cloud sync complete! All changes up to date.", "success");
    } catch (e) {
      this.showToast("Cloud sync failed. Check connection.", "warning");
    }
  }

  async handleSignOut() {
    if (window.supabaseService) {
      await window.supabaseService.signOut();
    }
    this.closeProfileModal();
    this.showToast("Signed out of PathFinder.", "info");
  }

  updateAuthUI(user, profile) {
    if (user) {
      const avatar = profile?.avatar_emoji || "🌲";
      const name = profile?.full_name || (user.email ? user.email.split("@")[0] : "Explorer");
      if (this.dom.authBtnIcon) this.dom.authBtnIcon.textContent = avatar;
      if (this.dom.authBtnLabel) this.dom.authBtnLabel.textContent = name;
      if (this.dom.authSyncDot) this.dom.authSyncDot.style.display = "inline-block";
    } else {
      if (this.dom.authBtnIcon) this.dom.authBtnIcon.textContent = "👤";
      if (this.dom.authBtnLabel) this.dom.authBtnLabel.textContent = "Sign In";
      if (this.dom.authSyncDot) this.dom.authSyncDot.style.display = "none";
    }
  }

  updateSyncStatusUI(status, lastTime) {
    if (this.dom.profileSyncBadge) {
      if (status === "syncing") {
        this.dom.profileSyncBadge.textContent = "🔄 Syncing with Cloud...";
        this.dom.profileSyncBadge.className = "profile-sync-status-badge is-syncing";
      } else if (status === "synced") {
        this.dom.profileSyncBadge.textContent = "☁️ Cloud Synced";
        this.dom.profileSyncBadge.className = "profile-sync-status-badge is-synced";
      } else if (status === "error") {
        this.dom.profileSyncBadge.textContent = "⚠ Sync Offline";
        this.dom.profileSyncBadge.className = "profile-sync-status-badge is-error";
      }
    }
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
