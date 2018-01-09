import { toggleLayerVisibility, setLayerOpacity } from 'layers/layersActions';
import { clearHighlightedVessels } from 'actions/heatmap';
import { FLAGS } from 'app/src/constants';

export const ADD_REPORT_POLYGON = 'ADD_REPORT_POLYGON';
export const HIDE_POLYGON_MODAL = 'HIDE_POLYGON_MODAL';
export const DELETE_REPORT_POLYGON = 'DELETE_REPORT_POLYGON';
export const DISCARD_REPORT = 'DISCARD_REPORT';
export const SET_SUBSCRIPTION_STATUS_SENT = 'SET_SUBSCRIPTION_STATUS_SENT';
export const SET_SUBSCRIPTION_STATUS_ERROR = 'SET_SUBSCRIPTION_STATUS_ERROR';
export const SHOW_POLYGON = 'SHOW_POLYGON';
export const START_REPORT = 'START_REPORT';
export const TOGGLE_REPORT_MODAL_VISIBILITY = 'TOGGLE_REPORT_MODAL_VISIBILITY';
export const TOGGLE_SUBSCRIPTION_MODAL_VISIBILITY = 'TOGGLE_SUBSCRIPTION_MODAL_VISIBILITY';
export const UPDATE_SUBSCRIPTION_FREQUENCY = 'UPDATE_SUBSCRIPTION_FREQUENCY';

export function showPolygon(polygonData, latLng) {
  return {
    type: SHOW_POLYGON,
    payload: {
      polygonData,
      latLng
    }
  };
}

export function hidePolygonModal() {
  return {
    type: HIDE_POLYGON_MODAL
  };
}

export function addCurrentPolygon() {
  return {
    type: ADD_REPORT_POLYGON
  };
}

export function deletePolygon(polygonIndex) {
  return {
    type: DELETE_REPORT_POLYGON,
    payload: {
      polygonIndex
    }
  };
}

export function updateSubscriptionFrequency(frequency) {
  return {
    type: UPDATE_SUBSCRIPTION_FREQUENCY,
    payload: { frequency }
  };
}

export function toggleSubscriptionModalVisibility(forceMode = null) {
  return {
    type: TOGGLE_SUBSCRIPTION_MODAL_VISIBILITY,
    payload: { forceMode }
  };
}

export function toggleReportPanelVisibility(forceMode = null) {
  return {
    type: TOGGLE_REPORT_MODAL_VISIBILITY,
    payload: { forceMode }
  };
}

export function toggleReportPolygon(polygonId) {
  return (dispatch, getState) => {
    const polygonIndex = getState()
      .report
      .polygons
      .findIndex(polygon => polygon.id === polygonId);
    if (polygonIndex === -1) {
      dispatch(addCurrentPolygon());
    } else {
      dispatch(deletePolygon(polygonIndex));
    }
  };
}

function startReport(layerId) {
  return (dispatch, getState) => {
    dispatch(toggleLayerVisibility(layerId, true));
    dispatch(toggleReportPanelVisibility());
    dispatch(setLayerOpacity(1, layerId));
    dispatch(hidePolygonModal());
    dispatch(clearHighlightedVessels());

    const workspaceLayer = getState()
      .layers
      .workspaceLayers
      .find(layer => layer.id === layerId);
    dispatch({
      type: START_REPORT,
      payload: {
        layerId,
        layerTitle: workspaceLayer.title,
        reportId: workspaceLayer.reportId
      }
    });
  };
}

export function discardReport() {
  return (dispatch) => {
    dispatch(toggleReportPanelVisibility(false));
    dispatch({
      type: DISCARD_REPORT
    });
  };
}

export function toggleReport(layerId) {
  return (dispatch, getState) => {
    if (getState().report.layerId === layerId) {
      dispatch(discardReport());
    } else {
      dispatch(startReport(layerId));
    }
  };
}

/**
 + Get current countries name from the filters only if they exist
 * @param {object} state
 * @returns {array} flags ['AD', 'ES', ...]
 */
function getCurrentFlags(state) {
  return state.filterGroups.filterGroups.filter(filter =>
    filter.filterValues !== undefined &&
    filter.filterValues.flag !== undefined)
    .map(filter => filter.filterValues.flag)
    .map(flags => flags.map(flag => FLAGS[flag]))
    .reduce((a1, a2) => a1.concat(a2), []);
}

export function sendSubscription() {
  return (dispatch, getState) => {
    const state = getState();

    if (!state.user.token) {
      console.warn('user is not authenticated');
      return;
    }

    const payload = {
      from: state.filters.timelineInnerExtent[0].toISOString(),
      to: state.filters.timelineInnerExtent[1].toISOString()
    };

    payload.filters = {
      flags: getCurrentFlags(state)
    };

    payload.regions = [];
    state.report.polygons.forEach((polygon) => {
      payload.regions.push({
        layer: state.layers.workspaceLayers.find(layer => layer.reportId === state.report.reportId).label,
        id: polygon.reportingId.toString(),
        name: polygon.name.toString()
      });
    });

    let url;
    if (state.report.subscriptionFrequency === 'single') {
      url = `${state.map.tilesetUrl}/reports`;
    } else {
      payload.recurrency = state.report.subscriptionFrequency;
      url = `${state.map.tilesetUrl}/reports/subscriptions`;
    }

    const body = JSON.stringify(payload);
    const options = {
      method: 'POST',
      body
    };
    options.headers = {
      Authorization: `Bearer ${state.user.token}`,
      'Content-Type': 'application/json'
    };
    fetch(url, options)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error sending report ${res.status} - ${res.statusText}`);
        }
        return res;
      })
      .then(res => res.json())
      .then((data) => {
        dispatch({
          type: HIDE_POLYGON_MODAL
        });
        dispatch({
          type: SET_SUBSCRIPTION_STATUS_SENT,
          payload: data.message
        });
      })
      .catch((err) => {
        dispatch({
          type: SET_SUBSCRIPTION_STATUS_ERROR,
          payload: err.message
        });
      });
  };
}
