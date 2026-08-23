/**
 * The Terrain - Adventure Passport & Gamification Engine
 * Calculates Explorer Level, XP, achievements, travel statistics, and generates vintage digital cancellation stamps.
 */

const RANKS = [
  { level: 1, title: "Trail Scout", minXp: 0, maxXp: 299, icon: "🏕️" },
  { level: 2, title: "Pathfinder", minXp: 300, maxXp: 699, icon: "🧭" },
  { level: 3, title: "Forest Wanderer", minXp: 700, maxXp: 1199, icon: "🌲" },
  { level: 4, title: "Backcountry Trekker", minXp: 1200, maxXp: 1799, icon: "🥾" },
  { level: 5, title: "Park Ranger", minXp: 1800, maxXp: 2499, icon: "🛡️" },
  { level: 6, title: "Canyon Explorer", minXp: 2500, maxXp: 3299, icon: "🏜️" },
  { level: 7, title: "Ridge Runner", minXp: 3300, maxXp: 4199, icon: "⛰️" },
  { level: 8, title: "Alpine Mountaineer", minXp: 4200, maxXp: 5199, icon: "🏔️" },
  { level: 9, title: "Wilderness Master", minXp: 5200, maxXp: 6299, icon: "🦅" },
  { level: 10, title: "Summit Legend", minXp: 6300, maxXp: Infinity, icon: "👑" }
];

const ACHIEVEMENTS_DEF = [
  {
    id: "first_step",
    title: "First Footprint",
    desc: "Log your first park visit in your Adventure Passport.",
    icon: "👣",
    xp: 200,
    check: (visitedParks) => visitedParks.length >= 1,
    progress: (visitedParks) => ({ current: Math.min(visitedParks.length, 1), target: 1 })
  },
  {
    id: "alpine_monarch",
    title: "Alpine Monarch",
    desc: "Visit 3 mountain parks.",
    icon: "🏔️",
    xp: 300,
    check: (visitedParks) => visitedParks.filter(p => (p.tags || []).some(t => t.toLowerCase().includes("mountain"))).length >= 3,
    progress: (visitedParks) => {
      const count = visitedParks.filter(p => (p.tags || []).some(t => t.toLowerCase().includes("mountain"))).length;
      return { current: Math.min(count, 3), target: 3 };
    }
  },
  {
    id: "ring_of_fire",
    title: "Ring of Fire",
    desc: "Visit 2 active or dormant volcanic parks.",
    icon: "🌋",
    xp: 300,
    check: (visitedParks) => visitedParks.filter(p => (p.tags || []).some(t => t.toLowerCase().includes("volcan"))).length >= 2,
    progress: (visitedParks) => {
      const count = visitedParks.filter(p => (p.tags || []).some(t => t.toLowerCase().includes("volcan"))).length;
      return { current: Math.min(count, 2), target: 2 };
    }
  },
  {
    id: "canyon_nomad",
    title: "Canyon Nomad",
    desc: "Visit 2 canyon or gorge parks.",
    icon: "🏜️",
    xp: 300,
    check: (visitedParks) => visitedParks.filter(p => (p.tags || []).some(t => t.toLowerCase().includes("canyon") || t.toLowerCase().includes("gorge"))).length >= 2,
    progress: (visitedParks) => {
      const count = visitedParks.filter(p => (p.tags || []).some(t => t.toLowerCase().includes("canyon") || t.toLowerCase().includes("gorge"))).length;
      return { current: Math.min(count, 2), target: 2 };
    }
  },
  {
    id: "glacier_pioneer",
    title: "Glacial Pioneer",
    desc: "Visit 2 glaciated wilderness parks.",
    icon: "❄️",
    xp: 300,
    check: (visitedParks) => visitedParks.filter(p => (p.tags || []).some(t => t.toLowerCase().includes("glacier"))).length >= 2,
    progress: (visitedParks) => {
      const count = visitedParks.filter(p => (p.tags || []).some(t => t.toLowerCase().includes("glacier"))).length;
      return { current: Math.min(count, 2), target: 2 };
    }
  },
  {
    id: "ancient_giants",
    title: "Old Growth Guardian",
    desc: "Visit Redwood or Sequoia National Parks.",
    icon: "🌲",
    xp: 350,
    check: (visitedParks) => visitedParks.some(p => p.id === "us-np-redwood" || p.id === "us-np-sequoia" || p.id === "us-np-kings-canyon"),
    progress: (visitedParks) => {
      const found = visitedParks.some(p => p.id === "us-np-redwood" || p.id === "us-np-sequoia" || p.id === "us-np-kings-canyon");
      return { current: found ? 1 : 0, target: 1 };
    }
  },
  {
    id: "true_north",
    title: "True North Explorer",
    desc: "Visit 3 Canadian National or Provincial parks.",
    icon: "🇨🇦",
    xp: 300,
    check: (visitedParks) => visitedParks.filter(p => p.country === "CA").length >= 3,
    progress: (visitedParks) => {
      const count = visitedParks.filter(p => p.country === "CA").length;
      return { current: Math.min(count, 3), target: 3 };
    }
  },
  {
    id: "stars_align",
    title: "Midnight Stargazer",
    desc: "Visit 2 designated Dark Sky parks.",
    icon: "🌌",
    xp: 300,
    check: (visitedParks) => visitedParks.filter(p => (p.tags || []).some(t => t.toLowerCase().includes("dark sky") || t.toLowerCase().includes("stargazing"))).length >= 2,
    progress: (visitedParks) => {
      const count = visitedParks.filter(p => (p.tags || []).some(t => t.toLowerCase().includes("dark sky") || t.toLowerCase().includes("stargazing"))).length;
      return { current: Math.min(count, 2), target: 2 };
    }
  },
  {
    id: "bison_trail",
    title: "Bison Trail",
    desc: "Visit 2 parks with free-roaming bison herds.",
    icon: "🦬",
    xp: 300,
    check: (visitedParks) => visitedParks.filter(p => (p.tags || []).some(t => t.toLowerCase().includes("bison"))).length >= 2,
    progress: (visitedParks) => {
      const count = visitedParks.filter(p => (p.tags || []).some(t => t.toLowerCase().includes("bison"))).length;
      return { current: Math.min(count, 2), target: 2 };
    }
  },
  {
    id: "deep_earth",
    title: "Subterranean Master",
    desc: "Visit a cave or cavern national park.",
    icon: "🕳️",
    xp: 250,
    check: (visitedParks) => visitedParks.some(p => (p.tags || []).some(t => t.toLowerCase().includes("cave"))),
    progress: (visitedParks) => {
      const count = visitedParks.filter(p => (p.tags || []).some(t => t.toLowerCase().includes("cave"))).length;
      return { current: Math.min(count, 1), target: 1 };
    }
  },
  {
    id: "coastal_cruiser",
    title: "Coastline Cruiser",
    desc: "Visit 3 coastal or ocean shoreline parks.",
    icon: "🌊",
    xp: 300,
    check: (visitedParks) => visitedParks.filter(p => (p.tags || []).some(t => t.toLowerCase().includes("coast") || t.toLowerCase().includes("beach"))).length >= 3,
    progress: (visitedParks) => {
      const count = visitedParks.filter(p => (p.tags || []).some(t => t.toLowerCase().includes("coast") || t.toLowerCase().includes("beach"))).length;
      return { current: Math.min(count, 3), target: 3 };
    }
  },
  {
    id: "master_explorer",
    title: "Master of the Terrain",
    desc: "Log 10 total parks in your Passport.",
    icon: "⭐",
    xp: 600,
    check: (visitedParks) => visitedParks.length >= 10,
    progress: (visitedParks) => ({ current: Math.min(visitedParks.length, 10), target: 10 })
  }
];

class PassportEngine {
  constructor(storageInstance) {
    this.storage = storageInstance;
  }

  // Retrieve visited park objects for active profile
  getVisitedParkObjects() {
    const visitedMap = this.storage.getVisitedMap();
    const allParks = window.PARKS_DATA || [];
    return allParks
      .filter(p => Boolean(visitedMap[p.id]))
      .map(p => ({
        ...p,
        visitData: visitedMap[p.id]
      }));
  }

  // Calculate XP & Level for the profile
  getProfileProgress(profile) {
    const activeProf = profile || this.storage.getActiveProfile();
    if (!activeProf) return { xp: 0, level: 1, rank: RANKS[0], nextRank: RANKS[1], progressPercent: 0 };

    const visitedMap = activeProf.visited || {};
    const visitedIds = Object.keys(visitedMap);
    const allParks = window.PARKS_DATA || [];
    const visitedParks = allParks.filter(p => visitedIds.includes(p.id));

    let totalXp = 0;

    // 1. Visit XP
    visitedIds.forEach(id => {
      const entry = visitedMap[id] || {};
      totalXp += 150; // Base visit XP
      if (entry.notes && entry.notes.length > 5) totalXp += 50; // Notes bonus
      if (entry.rating) totalXp += 25; // Rating bonus
    });

    // 2. Wishlist XP
    totalXp += (activeProf.favorites || []).length * 15;

    // 3. Achievements XP
    const unlockedAchievements = this.getUnlockedAchievements(visitedParks);
    unlockedAchievements.forEach(ach => {
      totalXp += ach.xp;
    });

    // Determine Rank
    let currentRank = RANKS[0];
    let nextRank = RANKS[1];

    for (let i = 0; i < RANKS.length; i++) {
      if (totalXp >= RANKS[i].minXp && (RANKS[i].maxXp === Infinity || totalXp <= RANKS[i].maxXp)) {
        currentRank = RANKS[i];
        nextRank = RANKS[i + 1] || null;
        break;
      }
    }

    // Percentage to next rank
    let progressPercent = 100;
    if (nextRank) {
      const xpInCurrentRank = totalXp - currentRank.minXp;
      const rankSpan = nextRank.minXp - currentRank.minXp;
      progressPercent = Math.min(100, Math.max(0, Math.round((xpInCurrentRank / rankSpan) * 100)));
    }

    return {
      xp: totalXp,
      level: currentRank.level,
      rank: currentRank,
      nextRank,
      progressPercent,
      unlockedAchievementsCount: unlockedAchievements.length
    };
  }

  // Retrieve list of unlocked achievements
  getUnlockedAchievements(visitedParks) {
    const parks = visitedParks || this.getVisitedParkObjects();
    return ACHIEVEMENTS_DEF.filter(ach => ach.check(parks));
  }

  // Retrieve all achievements with status and progress
  getAllAchievementsStatus() {
    const visitedParks = this.getVisitedParkObjects();
    return ACHIEVEMENTS_DEF.map(ach => {
      const isUnlocked = ach.check(visitedParks);
      const prog = ach.progress(visitedParks);
      return {
        ...ach,
        isUnlocked,
        progress: prog
      };
    });
  }

  // Calculate detailed travel statistics
  getTravelStats() {
    const visitedParks = this.getVisitedParkObjects();
    const allParks = window.PARKS_DATA || [];

    const totalVisited = visitedParks.length;
    const totalParks = allParks.length;
    const completionPercent = totalParks > 0 ? ((totalVisited / totalParks) * 100).toFixed(1) : 0;

    // Preserved Acreage Explored
    const totalAcreage = visitedParks.reduce((sum, p) => sum + (p.areaAcres || 0), 0);

    // States and Provinces Breakdown
    const visitedUSStates = new Set();
    const visitedCAProvinces = new Set();

    visitedParks.forEach(p => {
      if (p.country === "US") {
        p.stateProvince.split("/").forEach(s => visitedUSStates.add(s.trim()));
      } else if (p.country === "CA") {
        p.stateProvince.split("/").forEach(s => visitedCAProvinces.add(s.trim()));
      }
    });

    const usNationalVisited = visitedParks.filter(p => p.country === "US" && p.type === "national").length;
    const caNationalVisited = visitedParks.filter(p => p.country === "CA" && p.type === "national").length;
    const stateParksVisited = visitedParks.filter(p => p.type === "state").length;

    return {
      totalVisited,
      totalParks,
      completionPercent,
      totalAcreage,
      visitedUSStatesCount: visitedUSStates.size,
      visitedUSStatesList: Array.from(visitedUSStates).sort(),
      visitedCAProvincesCount: visitedCAProvinces.size,
      visitedCAProvincesList: Array.from(visitedCAProvinces).sort(),
      usNationalVisited,
      caNationalVisited,
      stateParksVisited
    };
  }

  // Generate SVG Vintage Circular Cancellation Stamp
  generateStampSvg(park, visitEntry) {
    const dateStr = visitEntry?.date ? new Date(visitEntry.date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase() : "VISITED";
    const locStr = `${park.stateProvince.toUpperCase()}, ${park.country}`;
    const parkNameClean = park.name.replace(/National Park|Provincial Park|State Park|Reserve/gi, "").trim().toUpperCase();
    const isNational = park.type === "national";
    const inkColor = isNational ? "#047857" : "#b45309";

    return `
      <div class="passport-stamp-wrap" title="${park.name} - Stamped on ${dateStr}">
        <svg viewBox="0 0 160 160" width="130" height="130" class="vintage-cancellation-stamp">
          <circle cx="80" cy="80" r="74" fill="none" stroke="${inkColor}" stroke-width="2.5" stroke-dasharray="3, 1" />
          <circle cx="80" cy="80" r="68" fill="none" stroke="${inkColor}" stroke-width="1.5" />
          <circle cx="80" cy="80" r="54" fill="none" stroke="${inkColor}" stroke-width="0.8" stroke-dasharray="2, 2" />

          <!-- Circular Arc Paths -->
          <path id="stamp-top-arc-${park.id}" d="M 28,80 A 52,52 0 0,1 132,80" fill="none" />
          <path id="stamp-bot-arc-${park.id}" d="M 132,80 A 52,52 0 0,1 28,80" fill="none" />

          <!-- Top Arc Text -->
          <text font-size="7.5" font-weight="bold" fill="${inkColor}" letter-spacing="1">
            <textPath href="#stamp-top-arc-${park.id}" startOffset="50%" text-anchor="middle">
              ${isNational ? "NATIONAL PARK SERVICE" : "STATE & PROV PARKS"}
            </textPath>
          </text>

          <!-- Middle Center: Date & Park Name -->
          <g transform="translate(80, 72)" text-anchor="middle">
            <text y="-2" font-size="8.5" font-weight="900" fill="${inkColor}" letter-spacing="0.5">${parkNameClean}</text>
            <line x1="-34" y1="4" x2="34" y2="4" stroke="${inkColor}" stroke-width="1" />
            <text y="14" font-size="8" font-weight="800" fill="${inkColor}" letter-spacing="0.8">${dateStr}</text>
            <line x1="-34" y1="18" x2="34" y2="18" stroke="${inkColor}" stroke-width="1" />
          </g>

          <!-- Bottom Arc Text -->
          <text font-size="7" font-weight="bold" fill="${inkColor}" letter-spacing="1">
            <textPath href="#stamp-bot-arc-${park.id}" startOffset="50%" text-anchor="middle">
              ★ ${locStr} ★
            </textPath>
          </text>
        </svg>
      </div>
    `;
  }
}

window.passport = new PassportEngine(window.storage);
