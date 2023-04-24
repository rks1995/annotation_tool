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

// switch (shape_id) {
//     case _VIA_RSHAPE.RECTANGLE:
//     case _VIA_RSHAPE.CIRCLE:
//     case _VIA_RSHAPE.ELLIPSE:
//         switch (cp_index) {
//             case 1: // top center
//             case 3: // bottom center
//                 this.input.style.cursor = 'row-resize';
//                 break;
//             case 2: // right center
//             case 4: // left center
//                 this.input.style.cursor = 'col-resize';
//                 break;
//             case 5: // corner top-right
//             case 7: // corner bottom-left
//                 this.input.style.cursor = 'nesw-resize';
//                 break;
//             case 6: // corner bottom-right
//             case 8: // corner top-left
//                 this.input.style.cursor = 'nwse-resize';
//                 break;
//         }
//         break;
//     case _VIA_RSHAPE.EXTREME_RECTANGLE:
//     case _VIA_RSHAPE.EXTREME_CIRCLE:
//     case _VIA_RSHAPE.POINT:
//     case _VIA_RSHAPE.LINE:
//     case _VIA_RSHAPE.POLYGON:
//     case _VIA_RSHAPE.POLYLINE:
//         this.input.style.cursor = 'crosshair';
//     // fall through and show message if it is polygon or polyline
//     case _VIA_RSHAPE.POLYGON:
//     case _VIA_RSHAPE.POLYLINE:
//         _via_util_msg_show(
//             'To move vertex, simply drag the vertex. To add vertex, press [Ctrl] key and click on the edge. To delete vertex, press [Ctrl] (or [Command]) key and click on vertex.'
//         );
//         break;
// }
