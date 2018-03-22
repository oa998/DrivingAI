const getMousePos = (evt) => {
  var rect = can.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

can.addEventListener("mousemove", (evt)=>{
  lastMouse = getMousePos(evt);
})
