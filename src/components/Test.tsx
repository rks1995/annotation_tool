import React, { useEffect, useRef } from 'react';

export function Canvas1() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const requestIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas?.getContext('2d');
    if (!ctx) return;
    ctxRef.current = ctx;

    if (!canvas || !ctx) return;

    canvas.width = 600;
    canvas.height = 400;

    // Draw a rectangle
    let rectX = 50;
    let rectY = 50;
    let rectWidth = 100;
    let rectHeight = 100;
    ctx.fillStyle = 'red';
    ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

    let isResizing = false;
    let resizeEdge: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw' | null;

    const getCursorForEdge = (edge: string) => {
      switch (edge) {
        case 'n':
        case 's':
          return 'ns-resize';
        case 'e':
        case 'w':
          return 'ew-resize';
        case 'ne':
        case 'sw':
          return 'nesw-resize';
        case 'nw':
        case 'se':
          return 'nwse-resize';
        default:
          return 'auto';
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas?.getBoundingClientRect();
      const mouseX = e.clientX - rect!.left;
      const mouseY = e.clientY - rect!.top;

      if (!isResizing) {
        // Check if the mouse is inside any edge of the rectangle
        if (mouseX >= rectX - 5 && mouseX <= rectX + 5) {
          // West edge
          canvas!.style.cursor = getCursorForEdge('w');
          resizeEdge = 'w';
        } else if (
          mouseX >= rectX + rectWidth - 5 &&
          mouseX <= rectX + rectWidth + 5
        ) {
          // East edge
          canvas!.style.cursor = getCursorForEdge('e');
          resizeEdge = 'e';
        } else if (mouseY >= rectY - 5 && mouseY <= rectY + 5) {
          // North edge
          canvas!.style.cursor = getCursorForEdge('n');
          resizeEdge = 'n';
        } else if (
          mouseY >= rectY + rectHeight - 5 &&
          mouseY <= rectY + rectHeight + 5
        ) {
          // South edge
          canvas!.style.cursor = getCursorForEdge('s');
          resizeEdge = 's';
        } else if (
          mouseX >= rectX + rectWidth - 5 &&
          mouseX <= rectX + rectWidth + 5 &&
          mouseY >= rectY - 5 &&
          mouseY <= rectY + 5
        ) {
          // Northeast corner
          canvas!.style.cursor = getCursorForEdge('ne');
          resizeEdge = 'ne';
        } else if (
          mouseX >= rectX + rectWidth - 5 &&
          mouseX <= rectX + rectWidth + 5 &&
          mouseY >= rectY + rectHeight - 5 &&
          mouseY <= rectY + rectHeight + 5
        ) {
          // Southeast corner
          canvas!.style.cursor = getCursorForEdge('se');
          resizeEdge = 'se';
        } else if (
          mouseX >= rectX - 5 &&
          mouseX <= rectX + 5 &&
          mouseY >= rectY + rectHeight - 5 &&
          mouseY <= rectY + rectHeight + 5
        ) {
          // Southwest corner
          canvas!.style.cursor = getCursorForEdge('sw');
          resizeEdge = 'sw';
        } else {
          // Mouse is not inside any edge
          canvas!.style.cursor = 'auto';
          resizeEdge = null;
        }
      } else {
        // Resize the rectangle based on the resizeEdge and mouse position
        switch (resizeEdge) {
          case 'n':
            rectY = Math.min(mouseY, rectY + rectHeight - 10);
            rectHeight = Math.max(rectY + rectHeight - mouseY, 10);
            break;
          case 's':
            rectHeight = Math.max(mouseY - rectY, 10);
            break;
          case 'e':
            rectWidth = Math.max(mouseX - rectX, 10);
            break;
          case 'w':
            rectX = Math.min(mouseX, rectX + rectWidth - 10);
            rectWidth = Math.max(rectX + rectWidth - mouseX, 10);
            break;
          case 'ne':
            rectY = Math.min(mouseY, rectY + rectHeight - 10);
            rectHeight = Math.max(rectY + rectHeight - mouseY, 10);
            rectWidth = Math.max(mouseX - rectX, 10);
            break;
          case 'nw':
            rectX = Math.min(mouseX, rectX + rectWidth - 10);
            rectY = Math.min(mouseY, rectY + rectHeight - 10);
            rectHeight = Math.max(rectY + rectHeight - mouseY, 10);
            rectWidth = Math.max(rectX + rectWidth - mouseX, 10);
            break;
          case 'se':
            rectHeight = Math.max(mouseY - rectY, 10);
            rectWidth = Math.max(mouseX - rectX, 10);
            break;
          case 'sw':
            rectX = Math.min(mouseX, rectX + rectWidth - 10);
            rectHeight = Math.max(mouseY - rectY, 10);
            rectWidth = Math.max(rectX + rectWidth - mouseX, 10);
            break;
          default:
            break;
        }

        // Clear the canvas and redraw the rectangle
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'red';
        ctx.fillRect(rectX, rectY, rectWidth, rectHeight);
      }
    };

    const handleMouseDown = () => {
      isResizing = true;
    };

    const handleMouseUp = () => {
      isResizing = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return <canvas ref={canvasRef} />;
}
