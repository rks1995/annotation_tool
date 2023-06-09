// constants

export const AT_RSHAPE = {
  POINT: 1,
  RECTANGLE: 2,
  CIRCLE: 3,
  ELLIPSE: 4,
  LINE: 5,
  POLYLINE: 6,
  POLYGON: 7,
  EXTREME_RECTANGLE: 8,
  EXTREME_CIRCLE: 9,
};

export const AT_ATTRIBUTE_TYPE = {
  TEXT: 1,
  CHECKBOX: 2,
  RADIO: 3,
  SELECT: 4,
  IMAGE: 5,
};

export const AT_FILE_SELECT_TYPE = {
  JSON: 2,
  CSV: 4,
  TEXT: 8,
  IMAGE: 16,
};

export const CONFIG = {
  CONTROL_POINT_RADIUS: 2,
  CONTROL_POINT_COLOR: 'red',
  CONTROL_POINT_CLICK_TOL: 3,
  REGION_BOUNDARY_COLOR: 'yellow',
  REGION_LINE_WIDTH: 2,
  SEL_REGION_BOUNDARY_COLOR: 'black',
  SEL_REGION_FILL_COLOR: '#808080',
  SEL_REGION_FILL_OPACITY: 0.1,
  SEL_REGION_LINE_WIDTH: 2,
  REGION_POINT_RADIUS: 3,
  FIRST_VERTEX_CLICK_TOL: 3,
  FIRST_VERTEX_BOUNDARY_WIDTH: 1,
  FIRST_VERTEX_BOUNDARY_COLOR: 'black',
  FIRST_VERTEX_FILL_COLOR: 'white',
  REGION_SMETADATA_MARGIN: 4, // in pixel
  FILE_METADATA_MARGIN: 4, // in pixel
  CROSSHAIR_COLOR1: '#1a1a1a',
  CROSSHAIR_COLOR2: '#e6e6e6',
  SPATIAL_REGION_TIME_TOL: 0.02, // in sec
};

export const AT_ZOOM_MODE = { FITHEIGHT: 1, FITWIDTH: 2, SCALE: 3 };
export const AT_DEFAULT_ZOOM_MODE = AT_ZOOM_MODE.FITHEIGHT;
export const AT_ZOOM_SCALE_VALUE_LIST = [
  0.01, 0.1, 0.2, 0.5, 0.8, 1.0, 2.0, 4.0, 8.0, 10.0,
];
export const AT_ZOOM_SCALE_DEFAULT_INDEX = 5;
export const _RAP_TOOL_SPATIAL_REGION_MOVE_DELTA = 10; // in pixels
