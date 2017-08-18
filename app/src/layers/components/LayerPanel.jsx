import PropTypes from 'prop-types';
import React, { Component } from 'react';
import LayerItem from 'layers/containers/LayerItem';
import LayerListStyles from 'styles/components/map/layer-list.scss';

class LayerPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { currentBlendingOptionsShown: -1 };
  }

  onLayerBlendingToggled(layerIndex) {
    let currentBlendingOptionsShown = layerIndex;
    if (currentBlendingOptionsShown === this.state.currentBlendingOptionsShown) {
      currentBlendingOptionsShown = -1;
    }
    this.setState({ currentBlendingOptionsShown });
  }

  render() {
    const layers = [];
    if (this.props.layers) {
      for (let i = 0, length = this.props.layers.length; i < length; i++) {
        if (this.props.layers[i].added === false) {
          continue;
        }
        layers.push(
          <LayerItem
            key={i}
            layerIndex={i}
            layer={this.props.layers[i]}
            onLayerBlendingToggled={layerIndex => this.onLayerBlendingToggled(layerIndex)}
            showBlending={this.state.currentBlendingOptionsShown === i}
          />
        );
      }
    }

    return (
      <div className={LayerListStyles.layerListContainer}>
        <div className={LayerListStyles.title}>
          Map Layers
        </div>
        <ul className={LayerListStyles.layerList}>
          {layers}
        </ul>
      </div>
    );
  }
}

LayerPanel.propTypes = {
  layers: PropTypes.array,
  currentlyReportedLayerId: PropTypes.string,
  toggleLayerVisibility: PropTypes.func,
  setLayerInfoModal: PropTypes.func,
  setLayerOpacity: PropTypes.func,
  setLayerHue: PropTypes.func,
  userPermissions: PropTypes.array
};


export default LayerPanel;
