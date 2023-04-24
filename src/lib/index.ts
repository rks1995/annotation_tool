import { AT_RSHAPE, CONFIG } from '../constants';

export const drawRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) => {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.closePath();
};

export const drawRectRegion = ({
  ctx,
  isSelected,
  h,
  w,
  x,
  y,
}: {
  isSelected: boolean;
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  w: number;
  h: number;
}) => {
  if (isSelected) {
    ctx.strokeStyle = CONFIG.SEL_REGION_BOUNDARY_COLOR;
    ctx.lineWidth = CONFIG.SEL_REGION_LINE_WIDTH;
    drawRect(ctx, x, y, w, h);
    ctx.stroke();

    ctx.fillStyle = CONFIG.SEL_REGION_FILL_COLOR;
    ctx.globalAlpha = CONFIG.SEL_REGION_FILL_OPACITY;
    ctx.fill();
    ctx.globalAlpha = 1.0;
  } else {
    ctx.strokeStyle = CONFIG.REGION_BOUNDARY_COLOR;
    ctx.lineWidth = CONFIG.REGION_LINE_WIDTH;
    drawRect(ctx, x, y, w, h);
    ctx.stroke();
  }
};

const drawCircle = ({
  ctx,
  cx,
  cy,
  r,
}: {
  ctx: CanvasRenderingContext2D;
  cx: number;
  cy: number;
  r: number;
}) => {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, 2 * Math.PI, false);
  ctx.closePath();
};

export const drawCircleRegion = ({
  ctx,
  cx,
  cy,
  isSelected,
  r,
}: {
  ctx: CanvasRenderingContext2D;
  cx: number;
  cy: number;
  r: number;
  isSelected: boolean;
}) => {
  if (isSelected) {
    ctx.strokeStyle = CONFIG.SEL_REGION_BOUNDARY_COLOR;
    ctx.lineWidth = CONFIG.SEL_REGION_LINE_WIDTH;
    drawCircle({ ctx, cx, cy, r });
    ctx.stroke();

    ctx.fillStyle = CONFIG.SEL_REGION_FILL_COLOR;
    ctx.globalAlpha = CONFIG.SEL_REGION_FILL_OPACITY;
    ctx.fill();
    ctx.globalAlpha = 1.0;
  } else {
    ctx.strokeStyle = CONFIG.REGION_BOUNDARY_COLOR;
    ctx.lineWidth = CONFIG.REGION_LINE_WIDTH;
    drawCircle({ ctx, cx, cy, r });
    ctx.stroke();
  }
};

// to check whether new region is inside the current selected region
export const cregIsInside = ({
  cx,
  cy,
  xy,
}: {
  // shape, x-co-ordinate, y-co-ordinate, width, height
  xy: number[];
  cx: number;
  cy: number;
  tolerance?: number;
}) => {
  const shapeId = xy[0];
  var isInside = false;
  switch (shapeId) {
    case AT_RSHAPE.RECTANGLE:
      if (cx > xy[1] && cx < xy[1] + xy[3]) {
        if (cy > xy[2] && cy < xy[2] + xy[4]) {
          isInside = true;
        }
      }
      break;
    default:
      console.warn(
        'rap_file_annotator._draw() : shape_id=' + shapeId + ' not implemented'
      );
  }

  return isInside;
};

export const onResizeDrag = ({
  mouseX,
  mouseY,
  resizeDirection,
  selectedRegion,
}: {
  selectedRegion: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  mouseX: number;
  mouseY: number;
  resizeDirection: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
}) => {
  const oldX = selectedRegion.x;
  const oldY = selectedRegion.y;
  // 0  1  2
  // 3     4
  // 5  6  7
  switch (resizeDirection) {
    case 0:
      selectedRegion.x = mouseX;
      selectedRegion.y = mouseY;
      selectedRegion.width += oldX - mouseX;
      selectedRegion.height += oldY - mouseY;
      break;
    case 1:
      selectedRegion.y = mouseY;
      selectedRegion.height += oldY - mouseY;
      break;
    case 2:
      selectedRegion.y = mouseY;
      selectedRegion.width = mouseX - oldX;
      selectedRegion.height += oldY - mouseY;
      break;
    case 3:
      selectedRegion.x = mouseX;
      selectedRegion.width += oldX - mouseX;
      break;
    case 4:
      selectedRegion.width = mouseX - oldX;
      break;
    case 5:
      selectedRegion.x = mouseX;
      selectedRegion.width += oldX - mouseX;
      selectedRegion.height = mouseY - oldY;
      break;
    case 6:
      selectedRegion.height = mouseY - oldY;
      break;
    case 7:
      selectedRegion.width = mouseX - oldX;
      selectedRegion.height = mouseY - oldY;
      break;
  }
};

export const getSelection = () => {};
