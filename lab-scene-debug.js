// Add this debug code to lab-scene-extended.js at the beginning of onPointerDown function
// Replace the existing onPointerDown function with this debug version:

function onPointerDown(event) {
  console.log("=== onPointerDown called ===");
  console.log("isAnimating:", isAnimating, "container:", !!container);
  
  if (isAnimating || !container) {
    console.log("Early return: isAnimating or no container");
    return;
  }
  
  const rect = container.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  console.log("Mouse coordinates:", mouse.x, mouse.y);
  
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(scene.children, true);
  console.log("Raycaster hits:", hits.length);
  
  if (!hits.length) {
    console.log("No hits from raycaster");
    return;
  }

  const id = getIntersectId(hits[0].object);
  console.log("Intersected ID:", id);
  
  if (!id) {
    console.log("No ID found");
    return;
  }
  
  const obj = interactables.get(id);
  console.log("Object from interactables:", !!obj);
  console.log("Object userData:", obj?.userData);
  
  if (!obj) {
    console.log("Object not in interactables");
    return;
  }

  console.log("sceneMode:", sceneMode);
  console.log("obj.userData.type:", obj.userData.type);
  
  // Hallway mode: handle door clicks
  if (sceneMode === "hallway" && obj.userData.type === "door") {
    console.log("=== DOOR CLICK DETECTED ===");
    console.log("Door ID:", id);
    console.log("onDoorClick callback exists:", !!sceneState.onDoorClick);
    if (sceneState.onDoorClick) {
      console.log("Calling onDoorClick with ID:", id);
      sceneState.onDoorClick(id);
    }
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
