function HallwayPage() {
  return Shell(`
    <main class="simulation-shell">
      <section class="sim-topbar">
        <div>
          <span class="eyebrow"><span class="live-dot"></span> 3D University Hub</span>
          <h1>BioCad Laboratory Hallway</h1>
        </div>
        <div class="toolbar">
          <button class="btn btn-secondary" data-action="go" data-page="home">Exit Hallway</button>
        </div>
      </section>
      <div class="hallway-scene-wrap">
        <div id="hallway-scene-root" class="lab-scene-root" aria-label="3D hallway with lab doors"></div>
        <div class="hallway-overlay">
          <div class="hallway-hud">
            <span class="muted">University Hub</span>
            <p class="step-narrative">Walk through the hallway and click on any lab door to enter. Use WASD or arrow keys to move around.</p>
          </div>
        </div>
      </div>
    </main>
  `);
}
