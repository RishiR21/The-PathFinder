# PathFinder — Interactive US & Canada Parks Explorer

**PathFinder** is a modern, responsive, and intuitive web application for exploring State and National Parks across the United States and Canada.

Live interactive map featuring toggleable park modes, multi-criteria filtering, high-resolution photo profiles, GPS navigation, and personalized bucket lists.

---

## 🌟 Key Features

- **Toggle Modes**: Switch effortlessly between **All Parks (🌟)**, **National Parks (🌲)** (US National Parks & Parks Canada), and **State & Provincial Parks (🍂)**.
- **Multi-Country & Regional Filtering**: Filter by Country (🇺🇸 United States / 🇨🇦 Canada), dynamic State/Province dropdown, landscape/activity tags (*Mountains*, *Glaciers*, *Canyons*, *Caves*, *Dunes*, *Lakes*, *Dark Sky*, *UNESCO*), and instant typeahead search.
- **Interactive Multi-layer Map**: Powered by Leaflet.js with Topographic Terrain, Satellite Hybrid, Clean Explorer, and Dark Night Sky basemaps.
- **Custom SVG Pins & Clusters**: Color-coded badges with custom SVG icons (spruce tree for National, oak/maple leaf for State/Provincial) and frosted-glass clustering.
- **Rich Park Detail Drawer**: Displays high-definition photography, historical background, key trail highlights, acreage, annual visitors, climate & best visiting seasons, driving directions, and official park service links.
- **Trip Wishlist / Bucket List**: Save and organize favorite parks with browser `localStorage` persistence, one-click map isolation, and clipboard export.
- **Conservation Insights & "Surprise Me"**: Explore historical conservation milestones and preserved acreage stats, or click **🎲 Surprise Me** to discover a random park.

---

## 🚀 Live Deployment on Vercel

This repository is ready for instant deployment on **Vercel** with zero configuration.

### Deploying via Vercel Dashboard:
1. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Select your GitHub repository **`RishiR21/The-PathFinder`**.
3. Leave Framework Preset as **Other / None** (standard static site).
4. Click **Deploy**! 🚀

---

## 💻 Running Locally

You can run the project locally without any dependencies:

```powershell
# Using Python built-in HTTP server:
py -m http.server 8080
```
Then visit `http://localhost:8080` in your web browser.

Or simply open `index.html` directly in any web browser!

---

## 🗂️ Project Structure

```
├── index.html         # Main application layout with semantic HTML5
├── styles.css         # Modern nature-themed design system & responsive layout
├── vercel.json        # Vercel deployment routing configuration
├── .gitignore         # Git ignore rules
├── js/
│   ├── data.js        # Comprehensive dataset (112+ curated US & CA parks)
│   ├── storage.js     # LocalStorage manager for Wishlist & preferences
│   ├── filters.js     # Multi-criteria filtering & sorting engine
│   ├── map.js         # Leaflet map engine, tile layers, and SVG markers
│   ├── ui.js          # UI controller, drawers, modals, and toasts
│   └── app.js         # Application bootstrap & lifecycle orchestrator
└── README.md          # Project documentation
```
