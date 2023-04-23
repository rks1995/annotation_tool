import { KeyboardEvent, MouseEvent, useEffect, useRef, useState } from 'react';
import invoice from '../assets/invoice.jpg';
import { _RAP_TOOL_SPATIAL_REGION_MOVE_DELTA } from '../constants';
import { cregIsInside, drawRectRegion } from '../lib';

// CONSTANTS

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
  const [boundingBoxes, setBoundingBoxes] = useState<
    {
      x: number;
      y: number;
      width: number;
      height: number;
    }[]
  >([]);
  const [selectedRegions, setSelectedRegions] = useState<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas && canvas.getContext('2d');
    if (ctx && canvas) {
      const img = new Image();
      img.src = invoice;

      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        if (startX !== deltaX && startY !== deltaY) {
          ctx.strokeStyle = 'red';
          ctx.lineWidth = 2;
          ctx.strokeRect(startX, startY, deltaX, deltaY);
        }
        boundingBoxes.forEach((box, index) => {
          if (selectedRegions.includes(index)) {
            drawRectRegion({
              ctx,
              h: box.height,
              isSelected: true,
              w: box.width,
              x: box.x,
              y: box.y,
            });
          } else {
            drawRectRegion({
              ctx,
              h: box.height,
              isSelected: false,
              w: box.width,
              x: box.x,
              y: box.y,
            });
          }
        });
      };
    }
  }, [isDragging, deltaX, deltaY, boundingBoxes, selectedRegions]);

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

  function selectRegion(event: MouseEvent<HTMLCanvasElement>) {
    event.preventDefault();
    event.stopPropagation();

    const mouseX = event.nativeEvent.offsetX;
    const mouseY = event.nativeEvent.offsetY;

    let boxIndex = -1;

    boundingBoxes.forEach((box, index) => {
      const x1 = Math.min(box.x, box.x + box.width);
      const x2 = Math.max(box.x, box.x + box.width);
      const y1 = Math.min(box.y, box.y + box.height);
      const y2 = Math.max(box.y, box.y + box.height);

      if (x1 <= mouseX && mouseX <= x2 && y1 <= mouseY && mouseY <= y2) {
        if (boxIndex !== -1) {
          const prevBox = boundingBoxes[boxIndex];

          if (
            prevBox.x < box.x &&
            prevBox.x + prevBox.width > box.x + box.width &&
            prevBox.y < box.y &&
            prevBox.y + prevBox.height > box.y + box.height
          ) {
            boxIndex = index;
          }
        } else {
          boxIndex = index;
        }
      }
    });

    const unselectRegion = selectedRegions.find(
      (regionIdx) => regionIdx === boxIndex
    );

    if (event.shiftKey) {
      if (!unselectRegion) {
        setSelectedRegions([...selectedRegions, boxIndex]);
      } else {
        setSelectedRegions(
          selectedRegions.filter((regionIdx) => regionIdx !== boxIndex)
        );
      }
    } else {
      if (unselectRegion === undefined) {
        setSelectedRegions([boxIndex]);
      } else {
        setSelectedRegions([]);
      }
    }

    // reset all the coordinates to 0 when region is selected
    resetOnGoingDraw();
  }

  function handleMouseDown(event: MouseEvent<HTMLCanvasElement>) {
    if (!disableDocMovement) {
      setIsDragging(true);
    } else {
      const x = event.nativeEvent.offsetX;
      const y = event.nativeEvent.offsetY;
      setIsDrawing(true);
      setStartX(x);
      setStartY(y);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLCanvasElement>) {
    event.preventDefault();
    // event.stopPropagation();
    if (
      event.key === 'ArrowLeft' ||
      event.key === 'ArrowRight' ||
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown'
    ) {
      if (selectedRegions.length) {
        // move selected region
        var cdx = 0;
        var cdy = 0;
        switch (event.key) {
          case 'ArrowLeft':
            cdx = -1;
            break;
          case 'ArrowRight':
            cdx = +1;
            break;
          case 'ArrowUp':
            cdy = -1;
            break;
          case 'ArrowDown':
            cdy = +1;
            break;
        }
        if (event.shiftKey) {
          cdx = cdx * _RAP_TOOL_SPATIAL_REGION_MOVE_DELTA;
          cdy = cdy * _RAP_TOOL_SPATIAL_REGION_MOVE_DELTA;
        }
        return setBoundingBoxes((prevState) =>
          prevState.map((box, idx) => {
            if (selectedRegions.includes(idx)) {
              return {
                ...box,
                x: box.x + cdx,
                y: box.y + cdy,
              };
            } else {
              return box;
            }
          })
        );
      }
    }
    if (event.key === 'Delete' || event.key === 'Backspace') {
      if (selectedRegions.length) {
        const newBoxes = boundingBoxes.filter(
          (_, index) => !selectedRegions.includes(index)
        );
        setBoundingBoxes(newBoxes);
      }
    }

    if (event.key === 'Escape') {
      if (selectedRegions) {
        setSelectedRegions([]);
        resetOnGoingDraw();
      } else {
        resetOnGoingDraw();
      }
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
        setSelectedRegions([]);
        setDeltaX(currentX - startX);
        setDeltaY(currentY - startY);
      }
    }
  }

  function handleMouseUp(event: any) {
    const currentX = event.nativeEvent.offsetX;
    const currentY = event.nativeEvent.offsetY;

    if (isDrawing && startX !== currentX && startY !== currentY) {
      let boxObject = {
        x: startX,
        y: startY,
        width: deltaX,
        height: deltaY,
      };
      setSelectedRegions([]);
      setBoundingBoxes([...boundingBoxes, boxObject]);
    }
    setIsDragging(false);
    setIsDrawing(false);
  }

  function handleDrawBoundingBox() {
    setDisableDocMovement(!disableDocMovement);
  }

  function resetOnGoingDraw() {
    // reset all the coordinates to 0 when region is selected
    setStartX(0);
    setStartY(0);
    setDeltaX(0);
    setDeltaY(0);
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          transform: `scale(${scale}) translate(${offset.x}px, ${offset.y}px)`,
          transformOrigin: 'top left',
          marginLeft: '10rem',
        }}
        tabIndex={-1}
        width={900}
        height={800}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={selectRegion}
        onKeyDown={handleKeyDown}
        onResize={(e) => console.log(e)}
      />
      <div
        style={{
          position: 'absolute',
          float: 'right',
          background: 'teal',
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
