/**
 * The Terrain - Personal Journey & Travel Tracker
 * Calculates personal travel statistics and formats visited park entries.
 */

class PersonalJourney {
  constructor() {
    this.allParks = window.PARKS_DATA || [];
  }

  getTravelStats() {
    const visitedMap = window.storage ? window.storage.getVisitedMap() : {};
    const visitedIds = Object.keys(visitedMap);
    const visitedParks = this.allParks.filter(p => visitedIds.includes(p.id));

    let totalAcreage = 0;
    const statesSet = new Set();
    let nationalCount = 0;
    let stateCount = 0;
    let usCount = 0;
    let caCount = 0;

    visitedParks.forEach(p => {
      totalAcreage += p.areaAcres || 0;
      if (p.stateProvince) statesSet.add(p.stateProvince);
      if (p.type === "national") nationalCount++;
      else stateCount++;
      if (p.country === "US") usCount++;
      else caCount++;
    });

    return {
      totalVisited: visitedParks.length,
      totalAcreage,
      statesCount: statesSet.size,
      nationalCount,
      stateCount,
      usCount,
      caCount,
      visitedParks: visitedParks.map(p => ({
        ...p,
        visitData: visitedMap[p.id]
      }))
    };
  }
}

window.passport = new PersonalJourney();
