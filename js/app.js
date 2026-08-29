/**
 * PathFinder - Application Bootstrap
 * Initializes storage, filter engine, map canvas, and UI controller.
 */

document.addEventListener("DOMContentLoaded", () => {
  console.log("🌲 PathFinder — US & Canada Parks Explorer Initializing...");

  // Validate dataset
  const data = window.PARKS_DATA || [];
  console.log(`Loaded ${data.length} parks.`);

  // Initialize Filtering Engine
  const filterEngine = new window.FilterEngine(data);

  // Initialize Map
  const terrainMap = new window.TerrainMap("map");

  // Initialize UI Controller
  const terrainUI = new window.TerrainUI(terrainMap, filterEngine);

  // Initial trigger to render map markers and card list
  filterEngine.notify();

  // Handle incoming deep link (?park=id or ?p=id or #park=id)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const deepParkId = urlParams.get("park") || urlParams.get("p") || (window.location.hash.startsWith("#park=") ? window.location.hash.replace("#park=", "") : null);

    if (deepParkId) {
      const targetPark = data.find(p => p.id === deepParkId || p.id.toLowerCase() === deepParkId.toLowerCase());
      if (targetPark) {
        setTimeout(() => {
          terrainMap.selectPark(targetPark.id);
          terrainUI.openDrawer(targetPark);
          terrainUI.showToast(`Exploring ${targetPark.name}`, "info");
        }, 400);
      }
    }
  } catch (err) {
    console.error("Deep link parse error:", err);
  }

  console.log("✨ PathFinder ready for exploration!");
});
