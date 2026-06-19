// This patch replaces the launch handler in app.js
// Find this section (lines 2311-2334):
/*
  if (action === "launch") {
    const lab = getLab(target.dataset.lab);
    const game = getGamePlan(lab);
    const previous = state.progress[lab.id] || {};
    const shouldResume = previous.status === "In Progress" && (previous.currentStep || 0) > 0 && (previous.currentStep || 0) < game.steps.length;
    state.selectedLabId = lab.id;
    state.selectedLabItem = null;
    state.simSeconds = lab.duration * 60;
    state.reagentVolume = 10;
    state.reagentConcentration = 100;
    state.progress[lab.id] = shouldResume
      ? { ...previous, status: "In Progress", gameLog: previous.gameLog || [], mistakes: previous.mistakes || 0, modalSeen: false }
      : {
          ...previous,
          status: "In Progress",
          currentStep: 0,
          completedAt: null,
          minutes: 0,
          mistakes: 0,
          gameLog: [],
          modalSeen: false,
        };
    persist();
    return setPage("simulation");
  }
*/

// Replace with:
/*
  if (action === "launch") {
    state.selectedLabId = target.dataset.lab || "pcr";
    return setPage("hallway");
  }
*/
