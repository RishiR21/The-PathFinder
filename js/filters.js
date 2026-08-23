/**
 * The Terrain - Filters Engine
 * Manages active filter state and executes multi-criteria filtering and sorting over the parks dataset.
 */

class FilterEngine {
  constructor(data) {
    this.allData = data || [];
    this.state = {
      mode: "all", // "all", "national", "state"
      country: "all", // "all", "US", "CA"
      stateProvince: "all",
      searchQuery: "",
      selectedTags: new Set(),
      sortBy: "featured",
      favoritesOnly: false
    };
    this.listeners = [];
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  notify() {
    const filtered = this.getFilteredData();
    this.listeners.forEach(fn => fn(filtered, this.state));
  }

  setMode(mode) {
    if (this.state.mode !== mode) {
      this.state.mode = mode;
      this.notify();
    }
  }

  setCountry(country) {
    if (this.state.country !== country) {
      this.state.country = country;
      // Reset state/province if not matching current country
      this.state.stateProvince = "all";
      this.notify();
    }
  }

  setStateProvince(stateProvince) {
    if (this.state.stateProvince !== stateProvince) {
      this.state.stateProvince = stateProvince;
      this.notify();
    }
  }

  setSearchQuery(query) {
    this.state.searchQuery = (query || "").trim().toLowerCase();
    this.notify();
  }

  toggleTag(tag) {
    if (this.state.selectedTags.has(tag)) {
      this.state.selectedTags.delete(tag);
    } else {
      this.state.selectedTags.add(tag);
    }
    this.notify();
  }

  clearTags() {
    this.state.selectedTags.clear();
    this.notify();
  }

  setSortBy(sortBy) {
    if (this.state.sortBy !== sortBy) {
      this.state.sortBy = sortBy;
      this.notify();
    }
  }

  setFavoritesOnly(favOnly) {
    if (this.state.favoritesOnly !== favOnly) {
      this.state.favoritesOnly = favOnly;
      this.notify();
    }
  }

  resetAll() {
    this.state = {
      mode: "all",
      country: "all",
      stateProvince: "all",
      searchQuery: "",
      selectedTags: new Set(),
      sortBy: "featured",
      favoritesOnly: false
    };
    this.notify();
  }

  // Retrieve unique states/provinces based on current country filter
  getAvailableRegions() {
    let pool = this.allData;
    if (this.state.country !== "all") {
      pool = pool.filter(p => p.country === this.state.country);
    }

    const regions = new Map();
    pool.forEach(p => {
      // Handles multi-state codes like "NC/TN" or "WY/MT/ID"
      const regionsList = p.stateProvince.split("/").map(s => s.trim());
      regionsList.forEach(r => {
        if (!regions.has(r)) {
          regions.set(r, { name: r, country: p.country, count: 0 });
        }
        regions.get(r).count++;
      });
    });

    return Array.from(regions.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  // Retrieve all unique tags with usage count
  getAllTags() {
    const tagCounts = new Map();
    this.allData.forEach(p => {
      (p.tags || []).forEach(t => {
        tagCounts.set(t, (tagCounts.get(t) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }

  // Execute filtering pipeline
  getFilteredData() {
    const { mode, country, stateProvince, searchQuery, selectedTags, sortBy, favoritesOnly } = this.state;
    const favorites = window.storage ? window.storage.getFavorites() : [];

    let results = this.allData.filter(park => {
      // 1. Favorites-only filter
      if (favoritesOnly && !favorites.includes(park.id)) {
        return false;
      }

      // 2. Mode filter (National vs State/Provincial)
      if (mode === "national" && park.type !== "national") {
        return false;
      }
      if (mode === "state" && park.type !== "state") {
        return false;
      }

      // 3. Country filter
      if (country !== "all" && park.country !== country) {
        return false;
      }

      // 4. State / Province filter
      if (stateProvince !== "all") {
        const matchesState = park.stateProvince.toLowerCase().includes(stateProvince.toLowerCase()) ||
                             (park.stateCode && park.stateCode.toLowerCase().includes(stateProvince.toLowerCase()));
        if (!matchesState) return false;
      }

      // 5. Selected Activity / Landscape Tags (AND match: park must contain all selected tags)
      if (selectedTags.size > 0) {
        const parkTags = park.tags || [];
        for (const tag of selectedTags) {
          if (!parkTags.includes(tag)) {
            return false;
          }
        }
      }

      // 6. Search Query (Matches name, state/province, description, highlights, tags)
      if (searchQuery) {
        const target = [
          park.name,
          park.stateProvince,
          park.country === "US" ? "United States USA" : "Canada",
          park.description,
          ...(park.highlights || []),
          ...(park.tags || [])
        ].join(" ").toLowerCase();

        // Check each word in query
        const queryTerms = searchQuery.split(/\s+/).filter(Boolean);
        const matchesAllTerms = queryTerms.every(term => target.includes(term));
        if (!matchesAllTerms) return false;
      }

      return true;
    });

    // Sort results
    return this.sortResults(results, sortBy);
  }

  sortResults(parks, sortBy) {
    const copy = [...parks];
    switch (sortBy) {
      case "name-asc":
        return copy.sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return copy.sort((a, b) => b.name.localeCompare(a.name));
      case "established-asc": // Oldest first
        return copy.sort((a, b) => a.establishedYear - b.establishedYear);
      case "established-desc": // Newest first
        return copy.sort((a, b) => b.establishedYear - a.establishedYear);
      case "area-desc": // Largest first
        return copy.sort((a, b) => (b.areaAcres || 0) - (a.areaAcres || 0));
      case "rating-desc": // Highest rated
        return copy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case "featured":
      default:
        // Prioritize National Parks, then by rating and acreage
        return copy.sort((a, b) => {
          if (a.type === "national" && b.type !== "national") return -1;
          if (b.type === "national" && a.type !== "national") return 1;
          return (b.rating || 0) - (a.rating || 0);
        });
    }
  }
}

if (typeof window !== "undefined") {
  window.FilterEngine = FilterEngine;
}
