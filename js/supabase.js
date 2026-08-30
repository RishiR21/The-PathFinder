/**
 * PathFinder - Supabase Client & Cloud Sync Service
 * Manages passwordless Email OTP verification, profile persistence, and real-time cloud sync.
 */

class SupabaseService {
  constructor() {
    this.client = null;
    this.currentUser = null;
    this.currentProfile = null;
    this.listeners = [];
    this.syncListeners = [];
    this.isSyncing = false;
    this.lastSyncTime = null;

    // Default Project Configuration (gankykqrasfcsifagfjv)
    const DEFAULT_URL = "https://gankykqrasfcsifagfjv.supabase.co";

    // Load credentials from localStorage or defaults
    this.url = localStorage.getItem("pathfinder_supabase_url") || DEFAULT_URL;
    this.anonKey = localStorage.getItem("pathfinder_supabase_key") || "";

    this.init();
  }

  init() {
    if (this.url && this.anonKey && window.supabase) {
      try {
        this.client = window.supabase.createClient(this.url, this.anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });

        // Listen to auth state changes
        this.client.auth.onAuthStateChange(async (event, session) => {
          this.currentUser = session?.user || null;
          if (this.currentUser) {
            await this.loadProfile();
            await this.syncWithCloud();
          } else {
            this.currentProfile = null;
          }
          this.notifyAuthListeners(event, session);
        });

        // Check active session on load
        this.checkInitialSession();
      } catch (err) {
        console.warn("PathFinder: Supabase initialization error:", err);
      }
    }
  }

  async checkInitialSession() {
    if (!this.client) return;
    try {
      const { data: { session }, error } = await this.client.auth.getSession();
      if (session?.user) {
        this.currentUser = session.user;
        await this.loadProfile();
        await this.syncWithCloud();
        this.notifyAuthListeners("SIGNED_IN", session);
      }
    } catch (e) {
      console.warn("PathFinder: Error fetching initial session:", e);
    }
  }

  isConfigured() {
    return !!(this.client && this.url && this.anonKey);
  }

  configure(url, anonKey) {
    this.url = (url || "").trim();
    this.anonKey = (anonKey || "").trim();

    // Check if user accidentally pasted service_role secret key
    try {
      const parts = this.anonKey.split(".");
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]));
        if (payload.role === "service_role") {
          throw new Error("You pasted the 'service_role' (secret) key. Please copy the 'anon' (public) key from your Supabase API Settings instead.");
        }
      }
    } catch (err) {
      if (err.message.includes("service_role")) {
        throw err;
      }
    }

    localStorage.setItem("pathfinder_supabase_url", this.url);
    localStorage.setItem("pathfinder_supabase_key", this.anonKey);
    this.init();
    return this.isConfigured();
  }

  clearConfiguration() {
    this.url = "";
    this.anonKey = "";
    this.client = null;
    this.currentUser = null;
    this.currentProfile = null;
    localStorage.removeItem("pathfinder_supabase_url");
    localStorage.removeItem("pathfinder_supabase_key");
    this.notifyAuthListeners("SIGNED_OUT", null);
  }

  // --- Passwordless Email OTP Flow ---

  /**
   * Step 1: Send a 6-digit OTP code to the user's email
   */
  async sendEmailOtp(email) {
    if (!this.client) {
      throw new Error("Supabase is not configured yet. Please provide your Project URL and Anon Key.");
    }
    const cleanEmail = (email || "").trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      throw new Error("Please provide a valid email address.");
    }

    const redirectUrl = window.location.origin + window.location.pathname;

    const { data, error } = await this.client.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectUrl
      }
    });

    if (error) {
      throw error;
    }
    return data;
  }

  /**
   * Step 2: Verify the 6-digit OTP code entered by the user
   */
  async verifyEmailOtp(email, token) {
    if (!this.client) {
      throw new Error("Supabase is not configured yet.");
    }
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanToken = (token || "").trim().replace(/\s+/g, "");

    // Attempt verification with 'email' (Magic Link/OTP) type
    let { data, error } = await this.client.auth.verifyOtp({
      email: cleanEmail,
      token: cleanToken,
      type: "email"
    });

    // If 'email' type fails, retry with 'signup' in case it's a new unconfirmed user
    if (error && error.message && error.message.toLowerCase().includes("invalid")) {
      const signupAttempt = await this.client.auth.verifyOtp({
        email: cleanEmail,
        token: cleanToken,
        type: "signup"
      });
      if (!signupAttempt.error) {
        data = signupAttempt.data;
        error = null;
      }
    }

    if (error) {
      throw error;
    }

    if (data?.user) {
      this.currentUser = data.user;
      await this.loadProfile();
      await this.syncWithCloud();
    }

    return data;
  }

  /**
   * Sign out the active user
   */
  async signOut() {
    if (this.client) {
      await this.client.auth.signOut();
    }
    this.currentUser = null;
    this.currentProfile = null;
    this.notifyAuthListeners("SIGNED_OUT", null);
  }

  // --- Profile & Data Persistence ---

  async loadProfile() {
    if (!this.client || !this.currentUser) return null;
    try {
      const { data, error } = await this.client
        .from("profiles")
        .select("*")
        .eq("id", this.currentUser.id)
        .single();

      if (data) {
        this.currentProfile = data;
        return data;
      }
    } catch (e) {
      console.warn("Could not load profile:", e);
    }
    return null;
  }

  async updateProfile(updates) {
    if (!this.client || !this.currentUser) return null;
    try {
      const payload = {
        ...updates,
        updated_at: new Date().toISOString()
      };
      const { data, error } = await this.client
        .from("profiles")
        .update(payload)
        .eq("id", this.currentUser.id)
        .select()
        .single();

      if (error) throw error;
      this.currentProfile = data;
      return data;
    } catch (e) {
      console.error("Error updating profile:", e);
      throw e;
    }
  }

  // --- Two-Way Cloud Synchronization ---

  /**
   * Pulls cloud saved data and merges with local changes
   */
  async syncWithCloud() {
    if (!this.client || !this.currentUser || this.isSyncing) return;
    this.isSyncing = true;
    this.notifySyncListeners("syncing");

    try {
      // 1. Fetch cloud records
      const { data, error } = await this.client
        .from("user_saved_data")
        .select("favorites, visited")
        .eq("user_id", this.currentUser.id)
        .single();

      const localFavs = window.storage ? window.storage.getFavorites() : [];
      const localVisited = window.storage ? window.storage.getVisited() : {};

      let cloudFavs = data?.favorites || [];
      let cloudVisited = data?.visited || {};

      // 2. Merge local + cloud (Union)
      const mergedFavs = Array.from(new Set([...cloudFavs, ...localFavs]));
      const mergedVisited = { ...cloudVisited, ...localVisited };

      // 3. Save merged data locally
      if (window.storage) {
        window.storage.setFavorites(mergedFavs);
        window.storage.setVisited(mergedVisited);
      }

      // 4. Push merged data back to Supabase
      await this.client
        .from("user_saved_data")
        .upsert({
          user_id: this.currentUser.id,
          favorites: mergedFavs,
          visited: mergedVisited,
          updated_at: new Date().toISOString()
        });

      this.lastSyncTime = new Date();
      this.notifySyncListeners("synced");
    } catch (e) {
      console.error("Error during cloud sync:", e);
      this.notifySyncListeners("error");
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Push specific local changes to Supabase
   */
  async pushLocalChanges() {
    if (!this.client || !this.currentUser || this.isSyncing) return;
    this.isSyncing = true;
    this.notifySyncListeners("syncing");

    try {
      const favorites = window.storage ? window.storage.getFavorites() : [];
      const visited = window.storage ? window.storage.getVisited() : {};

      await this.client
        .from("user_saved_data")
        .upsert({
          user_id: this.currentUser.id,
          favorites: favorites,
          visited: visited,
          updated_at: new Date().toISOString()
        });

      this.lastSyncTime = new Date();
      this.notifySyncListeners("synced");
    } catch (e) {
      console.error("Error pushing local changes to cloud:", e);
      this.notifySyncListeners("error");
    } finally {
      this.isSyncing = false;
    }
  }

  // --- Event Listeners ---

  onAuthStateChange(cb) {
    if (typeof cb === "function") this.listeners.push(cb);
  }

  notifyAuthListeners(event, session) {
    this.listeners.forEach(cb => {
      try {
        cb(event, session, this.currentUser, this.currentProfile);
      } catch (e) {
        console.error(e);
      }
    });
  }

  onSyncStatusChange(cb) {
    if (typeof cb === "function") this.syncListeners.push(cb);
  }

  notifySyncListeners(status) {
    this.syncListeners.forEach(cb => {
      try {
        cb(status, this.lastSyncTime);
      } catch (e) {
        console.error(e);
      }
    });
  }
}

// Global Singleton Instance
if (typeof window !== "undefined") {
  window.supabaseService = new SupabaseService();
}
