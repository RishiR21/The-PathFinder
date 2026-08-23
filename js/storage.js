/**
 * The Terrain - Storage Manager
 * Handles local persistence of favorites/wishlist, visited parks, and user preferences.
 */

const STORAGE_KEYS = {
  FAVORITES: "terrain_saved_parks",
  VISITED: "terrain_visited_parks",
  BASEMAP: "terrain_active_basemap",
  PREFS: "terrain_user_preferences"
};

class StorageManager {
  constructor() {
    this.favorites = this.load(STORAGE_KEYS.FAVORITES, []);
    this.visited = this.load(STORAGE_KEYS.VISITED, []);
    this.basemap = this.load(STORAGE_KEYS.BASEMAP, "terrain");
    this.listeners = [];
  }

  load(key, defaultValue) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.warn("Error reading from localStorage:", e);
      return defaultValue;
    }
  }

  save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn("Error writing to localStorage:", e);
    }
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  notify(event, data) {
    this.listeners.forEach(fn => fn(event, data));
  }

  // Favorites / Bucket List
  isFavorite(parkId) {
    return this.favorites.includes(parkId);
  }

  toggleFavorite(parkId) {
    if (this.isFavorite(parkId)) {
      this.favorites = this.favorites.filter(id => id !== parkId);
      this.save(STORAGE_KEYS.FAVORITES, this.favorites);
      this.notify("favorite_removed", parkId);
      return false;
    } else {
      this.favorites.push(parkId);
      this.save(STORAGE_KEYS.FAVORITES, this.favorites);
      this.notify("favorite_added", parkId);
      return true;
    }
  }

  getFavorites() {
    return [...this.favorites];
  }

  clearFavorites() {
    this.favorites = [];
    this.save(STORAGE_KEYS.FAVORITES, this.favorites);
    this.notify("favorites_cleared", null);
  }

  // Visited
  isVisited(parkId) {
    return this.visited.includes(parkId);
  }

  toggleVisited(parkId) {
    if (this.isVisited(parkId)) {
      this.visited = this.visited.filter(id => id !== parkId);
      this.save(STORAGE_KEYS.VISITED, this.visited);
      this.notify("visited_toggled", { parkId, visited: false });
      return false;
    } else {
      this.visited.push(parkId);
      this.save(STORAGE_KEYS.VISITED, this.visited);
      this.notify("visited_toggled", { parkId, visited: true });
      return true;
    }
  }

  // Basemap preference
  getBasemap() {
    return this.basemap;
  }

  setBasemap(name) {
    this.basemap = name;
    this.save(STORAGE_KEYS.BASEMAP, name);
  }
}

window.storage = new StorageManager();
