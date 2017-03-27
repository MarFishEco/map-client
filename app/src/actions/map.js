import {
  INIT_GOOGLE_MAPS,
  SET_ZOOM,
  SET_CENTER,
  SHARE_MODAL_OPEN,
  DELETE_WORKSPACE_ID,
  SET_SHARE_MODAL_ERROR,
  SET_LAYER_INFO_MODAL,
  SET_BASEMAP,
  SET_SUPPORT_MODAL_VISIBILITY,
  SET_LAYER_MANAGEMENT_MODAL_VISIBILITY,
  SET_RECENT_VESSELS_VISIBILITY,
  SET_CENTER_TILE
} from 'actions';
import { clearVesselInfo } from 'actions/vesselInfo';
import { trackCenterTile } from 'actions/analytics';
import { ANALYTICS_TILE_COORDS_SCALE, ANALYTICS_TRACK_DRAG_FROM_ZOOM } from 'constants';

// store the original google maps in the app state.
// this is needed in the heatmap actions/reducers, to avoid constantly passing
// this object around
export function initGoogleMaps(googleMaps) {
  return {
    type: INIT_GOOGLE_MAPS,
    payload: googleMaps
  };
}

export function setBasemap(basemap) {
  return {
    type: SET_BASEMAP,
    payload: basemap
  };
}

export function setZoom(zoom) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_ZOOM,
      payload: zoom
    });
    if (getState().vesselInfo && getState().vesselInfo.details &&
      (getState().vesselInfo.details.isEmpty === true || getState().vesselInfo.details.isCluster === true)) {
      dispatch(clearVesselInfo());
    }
  };
}
export function setCenter(center, centerWorld) {
  return (dispatch, getState) => {
    dispatch({
      type: SET_CENTER,
      payload: center
    });


    if (centerWorld !== undefined && getState().map.zoom >= ANALYTICS_TRACK_DRAG_FROM_ZOOM) {
      const x = Math.floor(centerWorld.x * (ANALYTICS_TILE_COORDS_SCALE / 256));
      const y = Math.floor(centerWorld.y * (ANALYTICS_TILE_COORDS_SCALE / 256));

      const prevCenterTile = getState().map.centerTile;

      if (prevCenterTile.x !== x && prevCenterTile.x !== y) {
        dispatch({
          type: SET_CENTER_TILE,
          payload: { x, y }
        });
        dispatch(trackCenterTile(x, y));
      }
    }
  };
}

/**
 * Open or close the share modal
 *
 * @export openShareModal
 * @param {boolean} open - true to open, false to close
 * @returns {object}
 */
export function openShareModal(open) {
  return {
    type: SHARE_MODAL_OPEN,
    payload: open
  };
}

/**
 * Set the error to display within the share modal
 *
 * @export setShareModalError
 * @param {string} error - message to display
 * @returns {object}
 */
export function setShareModalError(error) {
  return {
    type: SET_SHARE_MODAL_ERROR,
    payload: error
  };
}

/**
 * Delete the workspace id from the store
 *
 * @export deleteWorkspace
 * @returns {object}
 */
export function deleteWorkspace() {
  return {
    type: DELETE_WORKSPACE_ID
  };
}

export function setLayerInfoModal(modalParams) {
  return {
    type: SET_LAYER_INFO_MODAL,
    payload: modalParams
  };
}

export function zoomIntoVesselCenter() {
  return (dispatch, getState) => {
    dispatch(setZoom(getState().map.zoom + 3));
    dispatch(setCenter(getState().map.vesselClusterCenter));
  };
}

export function setSupportModalVisibility(visibility) {
  return {
    type: SET_SUPPORT_MODAL_VISIBILITY,
    payload: visibility
  };
}

export function setLayerManagementModalVisibility(visibility) {
  return {
    type: SET_LAYER_MANAGEMENT_MODAL_VISIBILITY,
    payload: visibility
  };
}

export function setRecentVesselsModalVisibility(visibility) {
  return {
    type: SET_RECENT_VESSELS_VISIBILITY,
    payload: visibility
  };
}
