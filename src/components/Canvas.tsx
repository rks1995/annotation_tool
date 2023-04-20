import { useState, useEffect, useRef } from "react";
import invoice from "../assets/invoice.jpg";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [disableDocMovement, setDisableDocMovement] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startX, setStartX] = useState<any>(null);
  const [startY, setStartY] = useState<any>(null);
  const [deltaX, setDeltaX] = useState<any>(null);
  const [deltaY, setDeltaY] = useState<any>(null);
  const [xDistance, setXDistance] = useState<any>(null);
  const [yDistance, setYDistance] = useState<any>(null);
  const [touchStart, setTouchStart] = useState<any>(null);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [boundingBoxes, setBoundingBoxes] = useState<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas && canvas.getContext("2d");
    if (ctx && canvas) {
      const img = new Image();
      img.src = invoice;

      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        if (startX !== deltaX && startY !== deltaY) {
          ctx.strokeStyle = "red";
          ctx.lineWidth = 2;
          ctx.strokeRect(startX, startY, deltaX, deltaY);
        }
        boundingBoxes.forEach((box, index) => {
          ctx.strokeStyle = "green";
          ctx.strokeRect(box.x, box.y, box.width, box.height);
        });
      };
    }
  }, [isDragging, deltaX, deltaY, boundingBoxes]);

  function handleZoomIn() {
    setScale(scale * 1.2);
  }

  function handleZoomOut() {
    setScale(scale / 1.2);
  }

  function defaultSize() {
    setScale(1);
    setOffset({
      x: 0,
      y: 0,
    });
  }

  function handleMouseDown(event: any) {
    if (!disableDocMovement) {
      setIsDragging(true);
    } else {
      setIsDrawing(true);
      setStartX(event.nativeEvent.offsetX);
      setStartY(event.nativeEvent.offsetY);
    }
  }

  function handleMouseMove(event: any) {
    if (isDragging) {
      setOffset({
        x: offset.x + event.movementX,
        y: offset.y + event.movementY,
      });
    }
    if (isDrawing) {
      const currentX = event.nativeEvent.offsetX;
      const currentY = event.nativeEvent.offsetY;
      if (currentX !== startX && currentY !== deltaY) {
        setDeltaX(currentX - startX);
        setDeltaY(currentY - startY);
      }
    }
  }

  console.log(boundingBoxes);

  function handleMouseUp(event: any) {
    console.log("mouse up");
    const currentX = event.nativeEvent.offsetX;
    const currentY = event.nativeEvent.offsetY;
    if (isDrawing && startX !== currentX && startY !== currentY) {
      let boxObject = {
        x: startX,
        y: startY,
        width: deltaX,
        height: deltaY,
      };
      setBoundingBoxes([...boundingBoxes, boxObject]);
    }
    setIsDragging(false);
    setIsDrawing(false);
  }

  function handleDrawBoundingBox() {
    setDisableDocMovement(!disableDocMovement);
  }

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <canvas
        ref={canvasRef}
        style={{
          transform: `scale(${scale}) translate(${offset.x}px, ${offset.y}px)`,
          transformOrigin: "top left",
          top: 0,
          left: 0,
        }}
        width={900}
        height={800}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
      <div
        style={{
          position: "absolute",
          float: "right",
          background: "teal",
        }}
      >
        <div>
          <button onClick={defaultSize}>[]</button>
        </div>
        <div>
          <button onClick={handleZoomIn}>+</button>
        </div>
        <div>
          <button onClick={handleZoomOut}>-</button>
        </div>
        <div>
          <button onClick={handleDrawBoundingBox}>0</button>
        </div>
      </div>
    </div>
  );
};
export default Canvas;
