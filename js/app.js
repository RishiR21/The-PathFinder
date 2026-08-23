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

  console.log("✨ PathFinder ready for exploration!");
});
