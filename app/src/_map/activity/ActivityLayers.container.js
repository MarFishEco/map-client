import { connect } from 'react-redux';
import { exportNativeViewport } from '../glmap/viewport.actions';
import ActivityLayers from './ActivityLayers.jsx';
import { queryHeatmapVessels } from '../heatmap/heatmapTiles.actions';

const mapStateToProps = state => ({
  // TODO MAP MODULE
  timelineInnerExtentIndexes: state.filters.timelineInnerExtentIndexes,
  // TODO MAP MODULE
  timelineOverExtentIndexes: state.filters.timelineOverExtentIndexes,
  highlightedVessels: state.map.heatmap.highlightedVessels,
  highlightedClickedVessel: state.map.heatmap.highlightedClickedVessel,
  viewport: state.map.viewport.viewport,
  zoom: state.map.viewport.viewport.zoom,
  leftWorldScaled: state.map.viewport.leftWorldScaled,
  rightWorldScaled: state.map.viewport.rightWorldScaled,
  // TODO MAP MODULE - use dummy value for now
  // layerFilters: state.filterGroups.layerFilters,
  layerFilters: {},
  // TODO MAP MODULE
  // highlightedTrack: state.vesselInfo.highlightedTrack
});

const mapDispatchToProps = dispatch => ({
  queryHeatmapVessels: (coords) => {
    dispatch(queryHeatmapVessels(coords));
  },
  exportNativeViewport: (viewport) => {
    dispatch(exportNativeViewport(viewport));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivityLayers);
