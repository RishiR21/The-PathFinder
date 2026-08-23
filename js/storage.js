/**
 * The Terrain - Enhanced Storage Manager
 * Supports multi-profile management, visited park logs (date, rating, notes), favorites, and user preferences.
 */

const STORAGE_KEYS = {
  PROFILES: "terrain_explorer_profiles",
  ACTIVE_PROFILE_ID: "terrain_active_profile_id",
  BASEMAP: "terrain_active_basemap"
};

const DEFAULT_PROFILE = {
  id: "profile_default",
  name: "Trail Explorer",
  avatar: "🌲",
  title: "Novice Trekker",
  createdAt: new Date().toISOString(),
  favorites: [],
  visited: {} // parkId -> { date: "YYYY-MM-DD", rating: 5, notes: "...", photos: [] }
};

class StorageManager {
  constructor() {
    this.profiles = this.load(STORAGE_KEYS.PROFILES, [DEFAULT_PROFILE]);
    this.activeProfileId = this.load(STORAGE_KEYS.ACTIVE_PROFILE_ID, "profile_default");
    this.basemap = this.load(STORAGE_KEYS.BASEMAP, "terrain");
    this.listeners = [];

    // Ensure active profile exists
    if (!this.getActiveProfile()) {
      this.activeProfileId = this.profiles[0]?.id || "profile_default";
      this.save(STORAGE_KEYS.ACTIVE_PROFILE_ID, this.activeProfileId);
    }
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

  // Profile Management
  getProfiles() {
    return [...this.profiles];
  }

  getActiveProfile() {
    return this.profiles.find(p => p.id === this.activeProfileId) || this.profiles[0];
  }

  setActiveProfile(profileId) {
    if (this.profiles.some(p => p.id === profileId)) {
      this.activeProfileId = profileId;
      this.save(STORAGE_KEYS.ACTIVE_PROFILE_ID, profileId);
      this.notify("profile_changed", this.getActiveProfile());
      return true;
    }
    return false;
  }

  createProfile(name, avatar = "🌲") {
    const newProfile = {
      id: "profile_" + Date.now(),
      name: (name || "New Explorer").trim(),
      avatar: avatar || "🌲",
      title: "Trail Scout",
      createdAt: new Date().toISOString(),
      favorites: [],
      visited: {}
    };

    this.profiles.push(newProfile);
    this.save(STORAGE_KEYS.PROFILES, this.profiles);
    this.setActiveProfile(newProfile.id);
    this.notify("profile_created", newProfile);
    return newProfile;
  }

  updateActiveProfile(updates) {
    const profile = this.getActiveProfile();
    if (!profile) return;

    if (updates.name) profile.name = updates.name.trim();
    if (updates.avatar) profile.avatar = updates.avatar;
    if (updates.title) profile.title = updates.title;

    this.save(STORAGE_KEYS.PROFILES, this.profiles);
    this.notify("profile_updated", profile);
  }

  deleteProfile(profileId) {
    if (this.profiles.length <= 1) return false; // Prevent deleting last profile

    this.profiles = this.profiles.filter(p => p.id !== profileId);
    this.save(STORAGE_KEYS.PROFILES, this.profiles);

    if (this.activeProfileId === profileId) {
      this.setActiveProfile(this.profiles[0].id);
    } else {
      this.notify("profile_deleted", profileId);
    }
    return true;
  }

  // Favorites / Bucket List (Scoped to active profile)
  getFavorites() {
    const profile = this.getActiveProfile();
    return profile ? [...(profile.favorites || [])] : [];
  }

  isFavorite(parkId) {
    const profile = this.getActiveProfile();
    return profile ? (profile.favorites || []).includes(parkId) : false;
  }

  toggleFavorite(parkId) {
    const profile = this.getActiveProfile();
    if (!profile) return false;

    if (!profile.favorites) profile.favorites = [];

    const isFav = profile.favorites.includes(parkId);
    if (isFav) {
      profile.favorites = profile.favorites.filter(id => id !== parkId);
    } else {
      profile.favorites.push(parkId);
    }

    this.save(STORAGE_KEYS.PROFILES, this.profiles);
    this.notify(isFav ? "favorite_removed" : "favorite_added", parkId);
    return !isFav;
  }

  clearFavorites() {
    const profile = this.getActiveProfile();
    if (!profile) return;
    profile.favorites = [];
    this.save(STORAGE_KEYS.PROFILES, this.profiles);
    this.notify("favorites_cleared", null);
  }

  // Visited Log (Scoped to active profile)
  getVisitedMap() {
    const profile = this.getActiveProfile();
    return profile ? { ...(profile.visited || {}) } : {};
  }

  getVisitedList() {
    const visitedMap = this.getVisitedMap();
    return Object.keys(visitedMap);
  }

  isVisited(parkId) {
    const visitedMap = this.getVisitedMap();
    return Boolean(visitedMap[parkId]);
  }

  getVisitDetails(parkId) {
    const visitedMap = this.getVisitedMap();
    return visitedMap[parkId] || null;
  }

  logVisit(parkId, { date, rating, notes } = {}) {
    const profile = this.getActiveProfile();
    if (!profile) return null;

    if (!profile.visited) profile.visited = {};

    const visitEntry = {
      date: date || new Date().toISOString().split("T")[0],
      rating: parseInt(rating, 10) || 5,
      notes: (notes || "").trim(),
      loggedAt: new Date().toISOString()
    };

    profile.visited[parkId] = visitEntry;
    this.save(STORAGE_KEYS.PROFILES, this.profiles);
    this.notify("visit_logged", { parkId, entry: visitEntry, profile });
    return visitEntry;
  }

  removeVisit(parkId) {
    const profile = this.getActiveProfile();
    if (!profile || !profile.visited) return false;

    if (profile.visited[parkId]) {
      delete profile.visited[parkId];
      this.save(STORAGE_KEYS.PROFILES, this.profiles);
      this.notify("visit_removed", { parkId, profile });
      return true;
    }
    return false;
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
