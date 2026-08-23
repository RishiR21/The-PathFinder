/**
 * The Terrain - Enhanced Storage & Sync Manager
 * Supports multi-profile management, export/import portable sync codes, cross-instance JSON backups, and local persistence.
 */

const STORAGE_KEYS = {
  PROFILES: "terrain_explorer_profiles",
  ACTIVE_PROFILE_ID: "terrain_active_profile_id",
  COMMUNITY_PROFILES: "terrain_community_profiles",
  BASEMAP: "terrain_active_basemap"
};

const DEFAULT_PROFILE = {
  id: "profile_default",
  name: "Trail Explorer",
  avatar: "🌲",
  title: "Novice Trekker",
  bio: "Passionate adventurer exploring North America's wildest parks.",
  homeBase: "California, USA",
  favoritePark: "us-np-yosemite",
  socialX: "https://x.com/1RishiR",
  socialLinkedIn: "https://www.linkedin.com/in/rishi-ramchandani-73a74916b/",
  createdAt: new Date().toISOString(),
  favorites: [],
  visited: {}
};

const DEFAULT_COMMUNITY_PROFILES = [
  {
    id: "creator_rishi",
    name: "Rishi Ramchandani",
    avatar: "👑",
    title: "Creator & Lead Explorer",
    isCreator: true,
    bio: "Creator of The Terrain. Building interactive tools to celebrate conservation and help people discover the majestic wilderness of the United States and Canada.",
    homeBase: "Texas, USA",
    favoritePark: "us-np-yellowstone",
    favoriteParkName: "Yellowstone National Park",
    socialX: "https://x.com/1RishiR",
    socialLinkedIn: "https://www.linkedin.com/in/rishi-ramchandani-73a74916b/",
    level: 10,
    rankTitle: "Summit Legend",
    parksStampedCount: 42,
    statesCount: 18,
    joinedDate: "August 2026",
    badges: ["Founder", "Summit Legend", "Conservationist", "Alpine Master"]
  },
  {
    id: "explorer_maya",
    name: "Maya Chen",
    avatar: "🏔️",
    title: "Alpine Mountaineer",
    isCreator: false,
    bio: "Backcountry thru-hiker and mountain photographer chasing sunrises in the Rockies and Pacific Northwest.",
    homeBase: "Vancouver, BC",
    favoritePark: "ca-np-banff",
    favoriteParkName: "Banff National Park",
    socialX: "https://x.com/1RishiR",
    socialLinkedIn: "https://www.linkedin.com/in/rishi-ramchandani-73a74916b/",
    level: 8,
    rankTitle: "Alpine Mountaineer",
    parksStampedCount: 26,
    statesCount: 11,
    joinedDate: "August 2026",
    badges: ["Glacial Pioneer", "Alpine Monarch", "True North"]
  },
  {
    id: "explorer_liam",
    name: "Liam & Sarah",
    avatar: "🦬",
    title: "National Park Roadtrippers",
    isCreator: false,
    bio: "Vanlife family on a mission to stamp our passports at every single one of the 63 US National Parks!",
    homeBase: "Colorado, USA",
    favoritePark: "us-np-grand-teton",
    favoriteParkName: "Grand Teton National Park",
    socialX: "https://x.com/1RishiR",
    socialLinkedIn: "https://www.linkedin.com/in/rishi-ramchandani-73a74916b/",
    level: 6,
    rankTitle: "Canyon Explorer",
    parksStampedCount: 19,
    statesCount: 9,
    joinedDate: "August 2026",
    badges: ["Bison Trail", "Canyon Nomad", "First Footprint"]
  }
];

class StorageManager {
  constructor() {
    this.profiles = this.load(STORAGE_KEYS.PROFILES, [DEFAULT_PROFILE]);
    this.activeProfileId = this.load(STORAGE_KEYS.ACTIVE_PROFILE_ID, "profile_default");
    this.communityProfiles = this.load(STORAGE_KEYS.COMMUNITY_PROFILES, DEFAULT_COMMUNITY_PROFILES);
    this.basemap = this.load(STORAGE_KEYS.BASEMAP, "terrain");
    this.listeners = [];

    // Check if imported from URL hash
    this.checkUrlImport();

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

  // Active Profile Management
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

  createProfile(name, avatar = "🌲", socialLinks = {}) {
    const newProfile = {
      id: "profile_" + Date.now(),
      name: (name || "New Explorer").trim(),
      avatar: avatar || "🌲",
      title: socialLinks.title || "Trail Scout",
      bio: socialLinks.bio || "Passionate adventurer exploring North America's wildest parks.",
      homeBase: socialLinks.homeBase || "North America",
      favoritePark: socialLinks.favoritePark || "us-np-yellowstone",
      socialX: socialLinks.socialX || "https://x.com/1RishiR",
      socialLinkedIn: socialLinks.socialLinkedIn || "https://www.linkedin.com/in/rishi-ramchandani-73a74916b/",
      createdAt: new Date().toISOString(),
      favorites: [],
      visited: {}
    };

    this.profiles.push(newProfile);
    this.save(STORAGE_KEYS.PROFILES, this.profiles);
    this.setActiveProfile(newProfile.id);

    this.addCommunityProfile({
      id: newProfile.id,
      name: newProfile.name,
      avatar: newProfile.avatar,
      title: newProfile.title,
      bio: newProfile.bio,
      homeBase: newProfile.homeBase,
      favoritePark: newProfile.favoritePark,
      socialX: newProfile.socialX,
      socialLinkedIn: newProfile.socialLinkedIn,
      level: 1,
      rankTitle: "Trail Scout",
      parksStampedCount: 0,
      statesCount: 0,
      joinedDate: "Today",
      badges: ["First Footprint"]
    });

    this.notify("profile_created", newProfile);
    return newProfile;
  }

  updateActiveProfile(updates) {
    const profile = this.getActiveProfile();
    if (!profile) return;

    if (updates.name !== undefined) profile.name = updates.name.trim();
    if (updates.avatar !== undefined) profile.avatar = updates.avatar;
    if (updates.title !== undefined) profile.title = updates.title;
    if (updates.bio !== undefined) profile.bio = updates.bio;
    if (updates.homeBase !== undefined) profile.homeBase = updates.homeBase;
    if (updates.favoritePark !== undefined) profile.favoritePark = updates.favoritePark;
    if (updates.socialX !== undefined) profile.socialX = updates.socialX;
    if (updates.socialLinkedIn !== undefined) profile.socialLinkedIn = updates.socialLinkedIn;

    this.save(STORAGE_KEYS.PROFILES, this.profiles);

    const commIndex = this.communityProfiles.findIndex(c => c.id === profile.id);
    if (commIndex >= 0) {
      this.communityProfiles[commIndex] = {
        ...this.communityProfiles[commIndex],
        name: profile.name,
        avatar: profile.avatar,
        title: profile.title,
        bio: profile.bio,
        homeBase: profile.homeBase,
        favoritePark: profile.favoritePark,
        socialX: profile.socialX,
        socialLinkedIn: profile.socialLinkedIn
      };
      this.save(STORAGE_KEYS.COMMUNITY_PROFILES, this.communityProfiles);
    }

    this.notify("profile_updated", profile);
  }

  deleteProfile(profileId) {
    if (this.profiles.length <= 1) return false;

    this.profiles = this.profiles.filter(p => p.id !== profileId);
    this.save(STORAGE_KEYS.PROFILES, this.profiles);

    if (this.activeProfileId === profileId) {
      this.setActiveProfile(this.profiles[0].id);
    } else {
      this.notify("profile_deleted", profileId);
    }
    return true;
  }

  // =========================================================================
  // --- Cross-Instance Portable Sync, Export & Import ---
  // =========================================================================
  exportProfileJson() {
    const profile = this.getActiveProfile();
    if (!profile) return null;

    const payload = {
      app: "TheTerrain",
      version: "2.0",
      exportedAt: new Date().toISOString(),
      profile: {
        id: profile.id,
        name: profile.name,
        avatar: profile.avatar,
        title: profile.title,
        bio: profile.bio,
        homeBase: profile.homeBase,
        favoritePark: profile.favoritePark,
        socialX: profile.socialX,
        socialLinkedIn: profile.socialLinkedIn,
        favorites: profile.favorites || [],
        visited: profile.visited || {}
      }
    };

    return JSON.stringify(payload, null, 2);
  }

  exportSyncCode() {
    const json = this.exportProfileJson();
    if (!json) return "";
    try {
      return btoa(unescape(encodeURIComponent(json)));
    } catch (e) {
      return btoa(json);
    }
  }

  importProfileData(inputString) {
    try {
      let parsed = null;
      const cleanInput = inputString.trim();

      if (cleanInput.startsWith("{")) {
        parsed = JSON.parse(cleanInput);
      } else {
        // Base64 sync code
        try {
          const decoded = decodeURIComponent(escape(atob(cleanInput)));
          parsed = JSON.parse(decoded);
        } catch (e) {
          parsed = JSON.parse(atob(cleanInput));
        }
      }

      if (!parsed || (!parsed.profile && !parsed.name)) {
        throw new Error("Invalid passport data format");
      }

      const importedProf = parsed.profile || parsed;
      const finalProfile = {
        id: importedProf.id || ("profile_" + Date.now()),
        name: (importedProf.name || "Restored Explorer").trim(),
        avatar: importedProf.avatar || "🌲",
        title: importedProf.title || "Restored Explorer",
        bio: importedProf.bio || "Passionate adventurer exploring North America.",
        homeBase: importedProf.homeBase || "North America",
        favoritePark: importedProf.favoritePark || "us-np-yellowstone",
        socialX: importedProf.socialX || "https://x.com/1RishiR",
        socialLinkedIn: importedProf.socialLinkedIn || "https://www.linkedin.com/in/rishi-ramchandani-73a74916b/",
        createdAt: importedProf.createdAt || new Date().toISOString(),
        favorites: Array.isArray(importedProf.favorites) ? importedProf.favorites : [],
        visited: importedProf.visited && typeof importedProf.visited === "object" ? importedProf.visited : {}
      };

      const existingIndex = this.profiles.findIndex(p => p.id === finalProfile.id);
      if (existingIndex >= 0) {
        this.profiles[existingIndex] = finalProfile;
      } else {
        this.profiles.push(finalProfile);
      }

      this.save(STORAGE_KEYS.PROFILES, this.profiles);
      this.setActiveProfile(finalProfile.id);
      this.notify("profile_imported", finalProfile);
      return { success: true, profile: finalProfile };
    } catch (err) {
      console.error("Import failed:", err);
      return { success: false, error: err.message };
    }
  }

  downloadPassportBackup() {
    const json = this.exportProfileJson();
    if (!json) return;

    const profile = this.getActiveProfile();
    const fileName = `terrain_passport_${(profile.name || 'explorer').replace(/\s+/g, '_').toLowerCase()}.json`;
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  checkUrlImport() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const syncParam = urlParams.get("sync");
      if (syncParam) {
        this.importProfileData(syncParam);
      }
    } catch (e) {
      // Ignore URL parsing errors
    }
  }

  // Community Profiles Registry
  getCommunityProfiles() {
    return [...this.communityProfiles];
  }

  addCommunityProfile(profileData) {
    const existingIdx = this.communityProfiles.findIndex(p => p.id === profileData.id);
    if (existingIdx >= 0) {
      this.communityProfiles[existingIdx] = { ...this.communityProfiles[existingIdx], ...profileData };
    } else {
      this.communityProfiles.push(profileData);
    }
    this.save(STORAGE_KEYS.COMMUNITY_PROFILES, this.communityProfiles);
    this.notify("community_updated", this.communityProfiles);
  }

  // Favorites
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

  // Visited Log
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
