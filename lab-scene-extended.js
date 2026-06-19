/* global THREE */
"use strict";

(function () {
  let container = null;
  let scene = null;
  let camera = null;
  let renderer = null;
  let character = null;
  let heldObject = null;
  let raycaster = null;
  let mouse = null;
  let animationId = null;
  let clock = null;
  let interactables = new Map();
  let highlightRings = new Map();
  let isAnimating = false;
  let keysDown = {};
  let keyHandlerDown = null;
  let keyHandlerUp = null;
  let systemGuide = null;
  let sceneMode = "lab"; // "lab" or "hallway"
  let sceneState = {
    labColor: "#00f5d4",
    selectedItem: null,
    currentStep: 0,
    game: null,
    onSelectItem: null,
    onAttemptInteraction: null,
    onDoorClick: null,
    sceneMode: "lab",
  };

  const BENCH_Y = 0.85;
  const FLOOR_Y = 0;

  function hex(color) {
    return new THREE.Color(color || "#00f5d4");
  }

  // ============================================
  // HALLWAY SCENE CREATION
  // ============================================

  function createHallwayRoom() {
    const group = new THREE.Group();
    
    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 30),
      new THREE.MeshStandardMaterial({ color: 0x1a1f2e, roughness: 0.85, metalness: 0.1 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = FLOOR_Y;
    floor.receiveShadow = true;
    group.add(floor);

    // Grid
    const grid = new THREE.GridHelper(20, 40, 0x2a3548, 0x1e2838);
    grid.position.y = 0.01;
    group.add(grid);

    // Walls
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x151b28, roughness: 0.9 });
    
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 4), wallMat);
    backWall.position.set(0, 2, -15);
    group.add(backWall);

    const frontWall = new THREE.Mesh(new THREE.PlaneGeometry(20, 4), wallMat);
    frontWall.position.set(0, 2, 15);
    group.add(frontWall);

    const sideWallL = new THREE.Mesh(new THREE.PlaneGeometry(30, 4), wallMat);
    sideWallL.rotation.y = Math.PI / 2;
    sideWallL.position.set(-10, 2, 0);
    group.add(sideWallL);

    const sideWallR = new THREE.Mesh(new THREE.PlaneGeometry(30, 4), wallMat);
    sideWallR.rotation.y = -Math.PI / 2;
    sideWallR.position.set(10, 2, 0);
    group.add(sideWallR);

    // Ceiling
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(20, 30),
      new THREE.MeshStandardMaterial({ color: 0x0f1419, roughness: 0.95 })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 4;
    group.add(ceiling);

    return group;
  }

  function createLabDoor(id, title, x, z, color) {
    const group = new THREE.Group();
    
    // Door frame
    const frame = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 2.2, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x4a5568, roughness: 0.6 })
    );
    frame.position.set(x, 1.1, z);
    frame.castShadow = true;
    group.add(frame);

    // Door panel
    const door = new THREE.Mesh(
      new THREE.BoxGeometry(1.0, 2.0, 0.08),
      new THREE.MeshStandardMaterial({
        color: hex(color),
        roughness: 0.4,
        metalness: 0.2,
        emissive: hex(color),
        emissiveIntensity: 0.1,
      })
    );
    door.position.set(x, 1.1, z + 0.06);
    door.castShadow = true;
    door.userData = { id, type: "door", label: title, doorId: id };
    group.add(door);

    // Door label
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(10,14,24,0.9)";
    ctx.fillRect(0, 0, 256, 128);
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(4, 4, 248, 120);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px DM Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const lines = title.length > 20 ? [title.slice(0, 20), title.slice(20)] : [title];
    if (lines.length === 1) ctx.fillText(lines[0], 128, 64);
    else {
      ctx.fillText(lines[0], 128, 48);
      ctx.fillText(lines[1], 128, 80);
    }
    const tex = new THREE.CanvasTexture(canvas);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
    sprite.scale.set(2, 1, 1);
    sprite.position.set(x, 1.5, z + 0.2);
    group.add(sprite);

    return { group, door };
  }

  function createSystemGuide() {
    const group = new THREE.Group();
    
    // Body (sphere)
    const body = new THREE.Mesh(
      new THREE.SphereGeometry(0.15, 16, 16),
      new THREE.MeshStandardMaterial({
        color: 0x00f5d4,
        emissive: 0x00f5d4,
        emissiveIntensity: 0.4,
        metalness: 0.3,
      })
    );
    body.castShadow = true;
    group.add(body);

    // Eyes
    const eyeL = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xfbbf24 })
    );
    eyeL.position.set(-0.05, 0.05, 0.13);
    group.add(eyeL);

    const eyeR = eyeL.clone();
    eyeR.position.x = 0.05;
    group.add(eyeR);

    // Antenna
    const antenna = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.3, 8),
      new THREE.MeshStandardMaterial({ color: 0x00f5d4, emissive: 0x00f5d4, emissiveIntensity: 0.3 })
    );
    antenna.position.y = 0.2;
    group.add(antenna);

    return group;
  }

  // ============================================
  // LAB SCENE CREATION (existing code)
  // ============================================

  function createLabRoom(labColor) {
    const group = new THREE.Group();
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 10),
      new THREE.MeshStandardMaterial({ color: 0x1a1f2e, roughness: 0.85, metalness: 0.1 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = FLOOR_Y;
    floor.receiveShadow = true;
    group.add(floor);

    const grid = new THREE.GridHelper(14, 28, 0x2a3548, 0x1e2838);
    grid.position.y = 0.01;
    group.add(grid);

    const bench = new THREE.Mesh(
      new THREE.BoxGeometry(5.2, BENCH_Y, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x2d3748, roughness: 0.6, metalness: 0.2 })
    );
    bench.position.set(0, BENCH_Y / 2, 0);
    bench.castShadow = true;
    bench.receiveShadow = true;
    group.add(bench);

    const benchTop = new THREE.Mesh(
      new THREE.BoxGeometry(5.3, 0.06, 2.3),
      new THREE.MeshStandardMaterial({
        color: hex(labColor),
        roughness: 0.35,
        metalness: 0.15,
        emissive: hex(labColor),
        emissiveIntensity: 0.08,
      })
    );
    benchTop.position.set(0, BENCH_Y + 0.03, 0);
    group.add(benchTop);

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x151b28, roughness: 0.9 });
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(14, 4), wallMat);
    backWall.position.set(0, 2, -5);
    group.add(backWall);

    const sideWallL = new THREE.Mesh(new THREE.PlaneGeometry(10, 4), wallMat);
    sideWallL.rotation.y = Math.PI / 2;
    sideWallL.position.set(-7, 2, 0);
    group.add(sideWallL);

    const sideWallR = new THREE.Mesh(new THREE.PlaneGeometry(10, 4), wallMat);
    sideWallR.rotation.y = -Math.PI / 2;
    sideWallR.position.set(7, 2, 0);
    group.add(sideWallR);

    const lightPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(3, 0.4),
      new THREE.MeshBasicMaterial({ color: hex(labColor), transparent: true, opacity: 0.35 })
    );
    lightPanel.position.set(0, 3.6, -4.95);
    group.add(lightPanel);

    return group;
  }

  function createLights() {
    const ambient = new THREE.AmbientLight(0xb8c5e0, 0.55);
    const main = new THREE.DirectionalLight(0xffffff, 1.1);
    main.position.set(4, 8, 6);
    main.castShadow = true;
    main.shadow.mapSize.set(1024, 1024);
    main.shadow.camera.near = 0.5;
    main.shadow.camera.far = 20;
    main.shadow.camera.left = -8;
    main.shadow.camera.right = 8;
    main.shadow.camera.top = 8;
    main.shadow.camera.bottom = -8;

    const fill = new THREE.PointLight(0x00f5d4, 0.4, 12);
    fill.position.set(-3, 3, 2);

    const rim = new THREE.PointLight(0xa78bfa, 0.25, 10);
    rim.position.set(3, 2.5, -3);

    return [ambient, main, fill, rim];
  }

  function createCharacter() {
    const group = new THREE.Group();
    group.name = "scientist";

    const skin = new THREE.MeshStandardMaterial({ color: 0xf5c9a8, roughness: 0.7 });
    const coat = new THREE.MeshStandardMaterial({ color: 0xf0f4ff, roughness: 0.55 });
    const pants = new THREE.MeshStandardMaterial({ color: 0x2d3a52, roughness: 0.8 });
    const accent = new THREE.MeshStandardMaterial({ color: 0x00f5d4, emissive: 0x00f5d4, emissiveIntensity: 0.15 });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.55, 0.28), coat);
    torso.position.y = 1.15;
    torso.castShadow = true;
    group.add(torso);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), skin);
    head.position.y = 1.58;
    head.castShadow = true;
    group.add(head);

    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.19, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x3d2b1f }));
    hair.position.y = 1.62;
    group.add(hair);

    const goggles = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 8, 16), accent);
    goggles.position.set(0, 1.6, 0.14);
    goggles.rotation.x = Math.PI / 2;
    group.add(goggles);

    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.5, 0.16), pants);
    legL.position.set(-0.1, 0.62, 0);
    legL.castShadow = true;
    group.add(legL);

    const legR = legL.clone();
    legR.position.x = 0.1;
    group.add(legR);

    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.42, 0.12), coat);
    armL.position.set(-0.3, 1.15, 0);
    armL.name = "armL";
    group.add(armL);

    const armR = armL.clone();
    armR.position.x = 0.3;
    armR.name = "armR";
    group.add(armR);

    const handR = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), skin);
    handR.position.set(0.3, 0.92, 0);
    handR.name = "handR";
    group.add(handR);

    group.position.set(0, 0, 2.8);
    group.userData.baseY = 0;
    return group;
  }

  function makeLabel(text, color) {
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgba(10,14,24,0.85)";
    ctx.roundRect(4, 4, 248, 56, 12);
    ctx.fill();
    ctx.strokeStyle = color || "#00f5d4";
    ctx.lineWidth = 3;
    ctx.roundRect(4, 4, 248, 56, 12);
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px DM Sans, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const lines = text.length > 22 ? [text.slice(0, 22), text.slice(22)] : [text];
    if (lines.length === 1) ctx.fillText(lines[0], 128, 32);
    else {
      ctx.fillText(lines[0], 128, 24);
      ctx.fillText(lines[1], 128, 44);
    }
    const tex = new THREE.CanvasTexture(canvas);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
    sprite.scale.set(1.4, 0.35, 1);
    sprite.position.y = 0.55;
    return sprite;
  }

  function createTubeMesh(color, scale = 1) {
    const group = new THREE.Group();
    const body = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06 * scale, 0.07 * scale, 0.28 * scale, 16),
      new THREE.MeshStandardMaterial({ color: hex(color), roughness: 0.3, metalness: 0.1, transparent: true, opacity: 0.85 })
    );
    body.position.y = 0.14 * scale;
    body.castShadow = true;
    group.add(body);
    const cap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065 * scale, 0.065 * scale, 0.04 * scale, 16),
      new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.5, roughness: 0.3 })
    );
    cap.position.y = 0.3 * scale;
    group.add(cap);
    const liquid = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045 * scale, 0.055 * scale, 0.12 * scale, 16),
      new THREE.MeshStandardMaterial({ color: hex(color), emissive: hex(color), emissiveIntensity: 0.3 })
    );
    liquid.position.y = 0.1 * scale;
    liquid.name = "liquid";
    group.add(liquid);
    return group;
  }

  function createInstrumentMesh(kind, color) {
    const group = new THREE.Group();
    const c = hex(color);

    if (kind === "centrifuge") {
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.38, 0.2, 24), new THREE.MeshStandardMaterial({ color: 0x4a5568 }));
      base.position.y = 0.1;
      group.add(base);
      const rotor = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.08, 6), new THREE.MeshStandardMaterial({ color: c, metalness: 0.4 }));
      rotor.position.y = 0.28;
      rotor.name = "rotor";
      group.add(rotor);
      const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.04, 24), new THREE.MeshStandardMaterial({ color: 0x718096 }));
      lid.position.y = 0.36;
      group.add(lid);
    } else if (kind === "thermal") {
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.35, 0.55), new THREE.MeshStandardMaterial({ color: 0x2d3748 }));
      body.position.y = 0.2;
      group.add(body);
      const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.15), new THREE.MeshBasicMaterial({ color: c }));
      screen.position.set(0, 0.28, 0.28);
      screen.name = "screen";
      group.add(screen);
      const block = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.08, 0.35), new THREE.MeshStandardMaterial({ color: 0x1a202c }));
      block.position.y = 0.42;
      group.add(block);
    } else if (kind === "gel" || kind === "lane") {
      const tank = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.5), new THREE.MeshStandardMaterial({ color: 0x2d3748, transparent: true, opacity: 0.9 }));
      tank.position.y = 0.15;
      group.add(tank);
      const gel = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.08, 0.38), new THREE.MeshStandardMaterial({ color: c, transparent: true, opacity: 0.7, emissive: c, emissiveIntensity: 0.15 }));
      gel.position.y = 0.28;
      gel.name = "gel";
      group.add(gel);
    } else if (kind === "scope") {
      const base = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.35), new THREE.MeshStandardMaterial({ color: 0x4a5568 }));
      base.position.y = 0.06;
      group.add(base);
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 0.45, 12), new THREE.MeshStandardMaterial({ color: 0x718096 }));
      tube.rotation.x = Math.PI / 4;
      tube.position.set(0.1, 0.35, 0);
      group.add(tube);
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.4 }));
      eye.position.set(-0.15, 0.45, 0);
      group.add(eye);
    } else if (kind === "hood") {
      const frame = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.9, 0.6), new THREE.MeshStandardMaterial({ color: 0x4a5568, transparent: true, opacity: 0.35 }));
      frame.position.y = 0.55;
      group.add(frame);
      const sash = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.5), new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.2 }));
      sash.position.set(0, 0.55, 0.31);
      group.add(sash);
      const work = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.05, 0.45), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.1 }));
      work.position.y = 0.12;
      group.add(work);
    } else if (kind === "plate") {
      const plate = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.06, 0.38), new THREE.MeshStandardMaterial({ color: 0xe2e8f0 }));
      plate.position.y = 0.05;
      group.add(plate);
      for (let r = 0; r < 3; r++) {
        for (let col = 0; col < 4; col++) {
          const well = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.04, 8), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.2 }));
          well.position.set(-0.15 + col * 0.1, 0.1, -0.1 + r * 0.1);
          group.add(well);
        }
      }
    } else if (kind === "flask") {
      const flask = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), new THREE.MeshStandardMaterial({ color: c, transparent: true, opacity: 0.6 }));
      flask.position.y = 0.22;
      group.add(flask);
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.07, 0.2, 12), new THREE.MeshStandardMaterial({ color: c, transparent: true, opacity: 0.5 }));
      neck.position.y = 0.42;
      group.add(neck);
    } else if (kind === "bottle") {
      const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.35, 12), new THREE.MeshStandardMaterial({ color: hex(color), transparent: true, opacity: 0.8 }));
      bottle.position.y = 0.2;
      group.add(bottle);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.06, 12), new THREE.MeshStandardMaterial({ color: 0x94a3b8 }));
      cap.position.y = 0.4;
      group.add(cap);
    } else if (kind === "vial") {
      return createTubeMesh(color, 0.8);
    } else if (kind === "washer") {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.5), new THREE.MeshStandardMaterial({ color: 0x4a5568 }));
      box.position.y = 0.28;
      group.add(box);
      const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.2, 8), new THREE.MeshStandardMaterial({ color: c }));
      nozzle.position.set(0, 0.55, 0.15);
      group.add(nozzle);
    } else if (kind === "lead") {
      const plug = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.1, 0.08), new THREE.MeshStandardMaterial({ color: 0x1a202c }));
      plug.position.y = 0.06;
      group.add(plug);
      const cable = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 8, 16), new THREE.MeshStandardMaterial({ color: c }));
      cable.rotation.x = Math.PI / 2;
      cable.position.y = 0.08;
      group.add(cable);
    } else if (kind === "columns") {
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.7, 16), new THREE.MeshStandardMaterial({ color: c, transparent: true, opacity: 0.7 }));
      col.position.y = 0.38;
      group.add(col);
      const resin = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.5, 16), new THREE.MeshStandardMaterial({ color: 0xf472b6, emissive: 0xf472b6, emissiveIntensity: 0.2 }));
      resin.position.y = 0.3;
      group.add(resin);
      const stand = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.08, 0.25), new THREE.MeshStandardMaterial({ color: 0x4a5568 }));
      stand.position.y = 0.04;
      group.add(stand);
    } else if (kind === "slide") {
      const slide = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.02, 0.15), new THREE.MeshStandardMaterial({ color: 0xe2e8f0 }));
      slide.position.y = 0.02;
      group.add(slide);
      const sample = new THREE.Mesh(new THREE.CircleGeometry(0.04, 12), new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.3 }));
      sample.rotation.x = -Math.PI / 2;
      sample.position.y = 0.035;
      group.add(sample);
    } else {
      return createTubeMesh(color);
    }
    return group;
  }

  // ============================================
  // HALLWAY SPECIFIC FUNCTIONS
  // ============================================

  function createHallwayScene(labsData) {
    // Create 12 lab doors
    const doors = [];
    const doorPositions = [
      { x: -7, z: -8, title: "PCR Amplification", id: "pcr", color: "#00f5d4" },
      { x: -3, z: -8, title: "Gel Electrophoresis", id: "gel-electrophoresis", color: "#38bdf8" },
      { x: 1, z: -8, title: "CRISPR-Cas9", id: "crispr", color: "#a78bfa" },
      { x: 5, z: -8, title: "Western Blot", id: "western-blot", color: "#b5ff3a" },
      { x: -7, z: -3, title: "ELISA Assay", id: "elisa", color: "#fbbf24" },
      { x: -3, z: -3, title: "Cell Culture", id: "cell-culture", color: "#fb7185" },
      { x: 1, z: -3, title: "Plant DNA", id: "plant-dna", color: "#22c55e" },
      { x: 5, z: -3, title: "Transformation", id: "transformation", color: "#2dd4bf" },
      { x: -7, z: 2, title: "Microscopy", id: "microscopy", color: "#60a5fa" },
      { x: -3, z: 2, title: "Protein Purification", id: "chromatography", color: "#f472b6" },
      { x: 1, z: 2, title: "Flow Cytometry", id: "flow-cytometry", color: "#818cf8" },
      { x: 5, z: 2, title: "BLAST Alignment", id: "blast", color: "#06b6d4" },
    ];

    doorPositions.forEach((pos) => {
      const { group, door } = createLabDoor(pos.id, pos.title, pos.x, pos.z, pos.color);
      scene.add(group);
      door.userData.doorId = pos.id;
      interactables.set(pos.id, door);
      doors.push({ id: pos.id, door, group });
    });

    // Create system guide
    systemGuide = createSystemGuide();
    systemGuide.position.set(0, 2, 0);
    scene.add(systemGuide);
  }

  function animateSystemGuide() {
    if (!systemGuide) return;
    const t = clock.getElapsedTime();
    systemGuide.position.y = 2 + Math.sin(t * 1.5) * 0.3;
    systemGuide.rotation.y = t * 0.5;
  }

  // ============================================
  // LAB SCENE FUNCTIONS (existing)
  // ============================================

  function getLayoutPosition(entry, index, total, slot) {
    if (slot === "bench") {
      const spread = Math.min(total, 5);
      const x = -1.8 + (index % spread) * (3.6 / Math.max(spread - 1, 1));
      const z = -0.3 + Math.floor(index / spread) * 0.5;
      return new THREE.Vector3(x, BENCH_Y + 0.05, z);
    }
    const spread = Math.min(total, 4);
    const x = -2.4 + (index % spread) * (4.8 / Math.max(spread - 1, 1));
    const z = -3.2 - Math.floor(index / spread) * 1.1;
    return new THREE.Vector3(x, BENCH_Y + 0.05, z);
  }

  function clearInteractables() {
    interactables.forEach((obj) => {
      if (obj.parent) scene.remove(obj.parent);
      else scene.remove(obj);
    });
    interactables.clear();
    highlightRings.forEach((ring) => scene.remove(ring));
    highlightRings.clear();
    heldObject = null;
  }

  function addHighlightRing(id, position, color, active) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(0.22, 0.28, 32),
      new THREE.MeshBasicMaterial({ color: hex(color), transparent: true, opacity: active ? 0.9 : 0.35, side: THREE.DoubleSide })
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(position);
    ring.position.y = BENCH_Y + 0.02;
    ring.name = `ring-${id}`;
    if (active) ring.userData.pulse = true;
    scene.add(ring);
    highlightRings.set(id, ring);
  }

  function layoutGameObjects(game) {
    clearInteractables();
    if (!game) return;

    const benchTargets = game.targets.filter((t) => t.slot === "bench");
    const instrumentTargets = game.targets.filter((t) => t.slot !== "bench");

    game.items.forEach((item, index) => {
      const mesh = createInstrumentMesh(item.kind, item.color);
      const pos = getLayoutPosition(item, index, game.items.length, "material");
      pos.x = -3.8 + (index % 4) * 0.55;
      pos.z = 1.2 + Math.floor(index / 4) * 0.55;
      pos.y = BENCH_Y + 0.05;
      mesh.position.copy(pos);
      mesh.userData = { id: item.id, type: "item", label: item.label, kind: item.kind };
      mesh.traverse((child) => {
        if (child.isMesh) {
          child.userData.parentId = item.id;
          child.userData.type = "item";
        }
      });
      const label = makeLabel(item.label, item.color);
      mesh.add(label);
      scene.add(mesh);
      interactables.set(item.id, mesh);
    });

    benchTargets.forEach((target, index) => {
      const mesh = createInstrumentMesh(target.kind, target.color);
      const pos = getLayoutPosition(target, index, benchTargets.length, "bench");
      mesh.position.copy(pos);
      mesh.userData = { id: target.id, type: "target", label: target.label, kind: target.kind, slot: "bench" };
      mesh.traverse((child) => {
        if (child.isMesh) {
          child.userData.parentId = target.id;
          child.userData.type = "target";
        }
      });
      const label = makeLabel(target.label, target.color);
      mesh.add(label);
      scene.add(mesh);
      interactables.set(target.id, mesh);
    });

    instrumentTargets.forEach((target, index) => {
      const mesh = createInstrumentMesh(target.kind, target.color);
      const pos = getLayoutPosition(target, index, instrumentTargets.length, "instrument");
      mesh.position.copy(pos);
      mesh.userData = { id: target.id, type: "target", label: target.label, kind: target.kind, slot: "instrument" };
      mesh.traverse((child) => {
        if (child.isMesh) {
          child.userData.parentId = target.id;
          child.userData.type = "target";
        }
      });
      const label = makeLabel(target.label, target.color);
      mesh.add(label);
      scene.add(mesh);
      interactables.set(target.id, mesh);
    });
  }

  function updateHighlights() {
    highlightRings.forEach((ring) => scene.remove(ring));
    highlightRings.clear();

    const { game, currentStep, selectedItem } = sceneState;
    if (!game) return;
    const activeStep = game.steps[currentStep];
    if (!activeStep) return;

    interactables.forEach((mesh, id) => {
      const isActiveItem = activeStep.item === id;
      const isActiveTarget = activeStep.target === id;
      const isSelected = selectedItem === id;
      if (isActiveItem || isActiveTarget || isSelected) {
        addHighlightRing(id, mesh.position, isActiveTarget ? "#00f5d4" : mesh.userData.type === "item" ? "#fbbf24" : "#a78bfa", isActiveTarget || isActiveItem);
      }
      mesh.traverse((child) => {
        if (child.isMesh && child.material?.emissive) {
          child.material.emissiveIntensity = isActiveTarget ? 0.5 : isActiveItem ? 0.35 : 0.1;
        }
      });
    });
  }

  function lerpCharacterTo(targetPos, duration, onComplete) {
    const start = character.position.clone();
    const end = new THREE.Vector3(targetPos.x, 0, targetPos.z + 0.6);
    const startTime = clock.getElapsedTime();

    function step() {
      const t = Math.min((clock.getElapsedTime() - startTime) / duration, 1);
      const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      character.position.lerpVectors(start, end, ease);
      character.lookAt(targetPos.x, 1, targetPos.z);
      const walk = Math.sin(clock.getElapsedTime() * 12) * 0.04;
      character.children.forEach((child) => {
        if (child.name === "legL") child.rotation.x = walk;
        if (child.name === "legR") child.rotation.x = -walk;
      });
      if (t < 1) requestAnimationFrame(step);
      else if (onComplete) onComplete();
    }
    step();
  }

  function animateArms(pouring) {
    const armR = character.getObjectByName("armR");
    const handR = character.getObjectByName("handR");
    if (!armR || !handR) return;
    const start = clock.getElapsedTime();
    function tick() {
      const t = (clock.getElapsedTime() - start) / (pouring ? 1.2 : 0.8);
      if (t >= 1) {
        armR.rotation.x = 0;
        handR.position.set(0.3, 0.92, 0);
        return;
      }
      armR.rotation.x = pouring ? -Math.sin(t * Math.PI) * 1.2 : -Math.sin(t * Math.PI) * 0.5;
      handR.position.y = 0.92 + Math.sin(t * Math.PI) * 0.15;
      requestAnimationFrame(tick);
    }
    tick();
  }

  function spinInstrument(targetMesh, kind) {
    const rotor = targetMesh.getObjectByName("rotor");
    const screen = targetMesh.getObjectByName("screen");
    const gel = targetMesh.getObjectByName("gel");
    const start = clock.getElapsedTime();
    function tick() {
      const t = clock.getElapsedTime() - start;
      if (rotor) rotor.rotation.y = t * 8;
      if (screen) screen.material.color.setHSL((t * 0.2) % 1, 0.8, 0.5);
      if (gel) gel.material.emissiveIntensity = 0.15 + Math.sin(t * 4) * 0.15;
      if (t < 2) requestAnimationFrame(tick);
    }
    tick();
  }

  function playStepAnimation(step, onComplete) {
    if (isAnimating) return;
    isAnimating = true;

    const itemMesh = interactables.get(step.item);
    const targetMesh = interactables.get(step.target);
    if (!itemMesh || !targetMesh) {
      isAnimating = false;
      if (onComplete) onComplete();
      return;
    }

    const action = step.action || inferAction(step);
    const itemPos = itemMesh.position.clone();
    const targetPos = targetMesh.position.clone();

    lerpCharacterTo(itemPos, 0.9, () => {
      animateArms(action === "pour" || action === "pipette");
      setTimeout(() => {
        lerpCharacterTo(targetPos, 0.9, () => {
          animateArms(action === "operate");
          if (targetMesh) spinInstrument(targetMesh, targetMesh.userData.kind);

          const liquid = targetMesh.getObjectByName("liquid");
          if (liquid) liquid.scale.y = Math.min(liquid.scale.y + 0.3, 1.5);

          setTimeout(() => {
            isAnimating = false;
            if (onComplete) onComplete();
          }, action === "operate" ? 1800 : 1000);
        });
      }, 900);
    });
  }

  function inferAction(step) {
    const target = interactables.get(step.target);
    const kind = target?.userData?.kind || "";
    if (kind === "centrifuge" || kind === "thermal" || kind === "scope") return "operate";
    if (step.title.toLowerCase().includes("add") || step.title.toLowerCase().includes("load")) return "pipette";
    return "place";
  }

  function getIntersectId(object) {
    let current = object;
    while (current) {
      if (current.userData?.parentId) return current.userData.parentId;
      if (current.userData?.id) return current.userData.id;
      if (current.userData?.doorId) return current.userData.doorId;
      current = current.parent;
    }
    return null;
  }

  function onPointerDown(event) {
    console.log("=== onPointerDown called ===");
    console.log("sceneMode:", sceneMode);
    if (isAnimating || !container) return;
    const rect = container.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const hits = raycaster.intersectObjects(scene.children, true);
    console.log("Raycaster hits:", hits.length);
    if (!hits.length) return;

    const id = getIntersectId(hits[0].object);
    console.log("Intersected ID:", id);
    if (!id) return;
    const obj = interactables.get(id);
    console.log("Object found:", !!obj, "userData:", obj?.userData);
    if (!obj) return;

    // Hallway mode: handle door clicks
    if (sceneMode === "hallway" && obj.userData.type === "door") {
      console.log("DOOR CLICK - calling onDoorClick with ID:", id);
      if (sceneState.onDoorClick) sceneState.onDoorClick(id);
      return;
    }

    // Lab mode: handle item/target clicks
    if (obj.userData.type === "item") {
      sceneState.selectedItem = id;
      if (sceneState.onSelectItem) sceneState.onSelectItem(id);
      updateHighlights();
      return;
    }

    if (obj.userData.type === "target" && sceneState.onAttemptInteraction) {
      sceneState.onAttemptInteraction(sceneState.selectedItem, id);
    }
  }

  function onResize() {
    if (!container || !camera || !renderer) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }

  function handleKeyDown(event) {
    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(event.key.toLowerCase())) {
      keysDown[event.key.toLowerCase()] = true;
    }
  }

  function handleKeyUp(event) {
    keysDown[event.key.toLowerCase()] = false;
  }

  function updateMovement(delta) {
    if (!character || isAnimating) return;
    const speed = 2.2 * delta;
    const move = new THREE.Vector3();
    if (keysDown.w || keysDown.arrowup) move.z -= speed;
    if (keysDown.s || keysDown.arrowdown) move.z += speed;
    if (keysDown.a || keysDown.arrowleft) move.x -= speed;
    if (keysDown.d || keysDown.arrowright) move.x += speed;
    if (move.lengthSq() > 0) {
      character.position.add(move);
      if (sceneMode === "hallway") {
        character.position.x = THREE.MathUtils.clamp(character.position.x, -8, 8);
        character.position.z = THREE.MathUtils.clamp(character.position.z, -10, 10);
      } else {
        character.position.x = THREE.MathUtils.clamp(character.position.x, -5.5, 5.5);
        character.position.z = THREE.MathUtils.clamp(character.position.z, -4, 3.5);
      }
      character.lookAt(character.position.x + move.x, 1, character.position.z + move.z);
    }
  }

  function animate() {
    animationId = requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const t = clock.getElapsedTime();
    updateMovement(delta);
    highlightRings.forEach((ring) => {
      if (ring.userData.pulse) {
        ring.scale.setScalar(1 + Math.sin(t * 4) * 0.08);
        ring.material.opacity = 0.5 + Math.sin(t * 4) * 0.3;
      }
    });
    if (character && !isAnimating) character.position.y = Math.sin(t * 1.5) * 0.01;
    if (sceneMode === "hallway") animateSystemGuide();
    if (character && camera) {
      camera.position.x += (character.position.x * 0.35 - camera.position.x) * 0.04;
      camera.position.z += (character.position.z + 5.2 - camera.position.z) * 0.04;
      camera.lookAt(character.position.x * 0.5, BENCH_Y + 0.5, character.position.z - 1);
    }
    renderer.render(scene, camera);
  }

  window.LabScene3D = {
    mount(el, options = {}) {
      this.unmount();
      container = el;
      sceneMode = options.sceneMode || "lab";
      sceneState = { ...sceneState, ...options, sceneMode };

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x0a0e18);
      scene.fog = new THREE.Fog(0x0a0e18, 8, 18);

      const w = container.clientWidth || 800;
      const h = container.clientHeight || 500;
      camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 50);
      camera.position.set(0, 3.2, 5.5);
      camera.lookAt(0, BENCH_Y, -0.5);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(renderer.domElement);
      renderer.domElement.className = "lab-scene-canvas";

      clock = new THREE.Clock();
      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2();

      createLights().forEach((light) => scene.add(light));

      if (sceneMode === "hallway") {
        scene.add(createHallwayRoom());
        createHallwayScene(options.labsData || []);
      } else {
        scene.add(createLabRoom(options.labColor || "#00f5d4"));
        layoutGameObjects(options.game);
        updateHighlights();
      }

      character = createCharacter();
      scene.add(character);

      renderer.domElement.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("resize", onResize);
      keyHandlerDown = handleKeyDown;
      keyHandlerUp = handleKeyUp;
      window.addEventListener("keydown", keyHandlerDown);
      window.addEventListener("keyup", keyHandlerUp);
      animate();
    },

    unmount() {
      if (animationId) cancelAnimationFrame(animationId);
      animationId = null;
      window.removeEventListener("resize", onResize);
      if (keyHandlerDown) window.removeEventListener("keydown", keyHandlerDown);
      if (keyHandlerUp) window.removeEventListener("keyup", keyHandlerUp);
      keysDown = {};
      if (renderer?.domElement) {
        renderer.domElement.removeEventListener("pointerdown", onPointerDown);
        renderer.domElement.remove();
      }
      clearInteractables();
      scene = null;
      camera = null;
      renderer = null;
      character = null;
      systemGuide = null;
      container = null;
      isAnimating = false;
    },

    update(options = {}) {
      sceneState = { ...sceneState, ...options };
      if (options.game && options.game !== sceneState.game) {
        layoutGameObjects(options.game);
      }
      updateHighlights();
    },

    playStepAnimation(step, onComplete) {
      playStepAnimation(step, onComplete);
    },

    setSelectedItem(id) {
      sceneState.selectedItem = id;
      updateHighlights();
    },

    isAnimating() {
      return isAnimating;
    },
  };
})();
