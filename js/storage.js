/**
 * The Terrain - Storage Manager
 * Simple, privacy-first local storage for personal park wishlist and visited journal.
 */

const STORAGE_KEYS = {
  FAVORITES: "the_terrain_favorites_v2",
  VISITED: "the_terrain_visited_v2",
  BASEMAP: "the_terrain_basemap_v2"
};

class StorageManager {
  constructor() {
    this.favorites = this.load(STORAGE_KEYS.FAVORITES, []);
    this.visited = this.load(STORAGE_KEYS.VISITED, {});
    this.basemap = this.load(STORAGE_KEYS.BASEMAP, "terrain");
    this.listeners = [];
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn(`Failed to read ${key} from localStorage:`, e);
      return fallback;
    }
  }

  save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Failed to save ${key} to localStorage:`, e);
    }
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
        console.error("Storage listener error:", e);
      }
    });
  }

  // --- Wishlist / Favorites ---
  getFavorites() {
    return [...this.favorites];
  }

  setFavorites(list) {
    if (Array.isArray(list)) {
      this.favorites = [...list];
      this.save(STORAGE_KEYS.FAVORITES, this.favorites);
      this.notify("favorites_changed", { list: this.favorites });
    }
  }

  isFavorite(parkId) {
    return this.favorites.includes(parkId);
  }

  toggleFavorite(parkId) {
    const idx = this.favorites.indexOf(parkId);
    let isFav = false;
    if (idx >= 0) {
      this.favorites.splice(idx, 1);
      isFav = false;
    } else {
      this.favorites.push(parkId);
      isFav = true;
    }
    this.save(STORAGE_KEYS.FAVORITES, this.favorites);
    this.notify("favorites_changed", { parkId, isFavorite: isFav, list: this.favorites });
    if (window.supabaseService && window.supabaseService.currentUser) {
      window.supabaseService.pushLocalChanges();
    }
    return isFav;
  }

  clearFavorites() {
    this.favorites = [];
    this.save(STORAGE_KEYS.FAVORITES, this.favorites);
    this.notify("favorites_cleared", []);
    if (window.supabaseService && window.supabaseService.currentUser) {
      window.supabaseService.pushLocalChanges();
    }
  }

  // --- Visited / Personal Journey Log ---
  getVisited() {
    return { ...this.visited };
  }

  getVisitedMap() {
    return { ...this.visited };
  }

  setVisited(map) {
    if (map && typeof map === "object") {
      this.visited = { ...map };
      this.save(STORAGE_KEYS.VISITED, this.visited);
      this.notify("visited_changed", { visited: this.visited });
    }
  }

  getVisitedList() {
    return Object.keys(this.visited);
  }

  isVisited(parkId) {
    return Boolean(this.visited[parkId]);
  }

  getVisitDetails(parkId) {
    return this.visited[parkId] || null;
  }

  logVisit(parkId, { date, notes } = {}) {
    const entry = {
      date: date || new Date().toISOString().split("T")[0],
      notes: (notes || "").trim(),
      loggedAt: new Date().toISOString()
    };
    this.visited[parkId] = entry;
    this.save(STORAGE_KEYS.VISITED, this.visited);
    this.notify("visit_logged", { parkId, entry });
    if (window.supabaseService && window.supabaseService.currentUser) {
      window.supabaseService.pushLocalChanges();
    }
    return entry;
  }

  removeVisit(parkId) {
    if (this.visited[parkId]) {
      delete this.visited[parkId];
      this.save(STORAGE_KEYS.VISITED, this.visited);
      this.notify("visit_removed", { parkId });
      if (window.supabaseService && window.supabaseService.currentUser) {
        window.supabaseService.pushLocalChanges();
      }
      return true;
    }
    return false;
  }

  clearVisited() {
    this.visited = {};
    this.save(STORAGE_KEYS.VISITED, this.visited);
    this.notify("visited_cleared", {});
    if (window.supabaseService && window.supabaseService.currentUser) {
      window.supabaseService.pushLocalChanges();
    }
  }

  // --- Basemap Preference ---
  getBasemap() {
    return this.basemap;
  }

  setBasemap(name) {
    this.basemap = name;
    this.save(STORAGE_KEYS.BASEMAP, name);
  }

  // --- 1-Click Backup & Restore ---
  exportBackupJson() {
    const payload = {
      app: "TheTerrain",
      version: "2.0",
      exportedAt: new Date().toISOString(),
      favorites: this.favorites,
      visited: this.visited
    };
    return JSON.stringify(payload, null, 2);
  }

  exportSyncCode() {
    try {
      const json = this.exportBackupJson();
      return btoa(unescape(encodeURIComponent(json)));
    } catch (e) {
      return "";
    }
  }

  importBackup(inputString) {
    try {
      let parsed = null;
      const clean = inputString.trim();
      if (clean.startsWith("{")) {
        parsed = JSON.parse(clean);
      } else {
        const decoded = decodeURIComponent(escape(atob(clean)));
        parsed = JSON.parse(decoded);
      }

      if (parsed) {
        if (Array.isArray(parsed.favorites)) {
          this.favorites = parsed.favorites;
          this.save(STORAGE_KEYS.FAVORITES, this.favorites);
        }
        if (parsed.visited && typeof parsed.visited === "object") {
          this.visited = parsed.visited;
          this.save(STORAGE_KEYS.VISITED, this.visited);
        }
        this.notify("backup_restored", { favorites: this.favorites, visited: this.visited });
        return { success: true };
      }
      return { success: false, error: "Invalid format" };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

window.storage = new StorageManager();
