import React from 'react';
import ol from 'openlayers';
import LayerStore from '../stores/LayerStore.js';
import LayerListItem from './LayerListItem.jsx';
import UI from 'pui-react-buttons';
import Icon from 'pui-react-iconography';
import {defineMessages, injectIntl, intlShape} from 'react-intl';
import pureRender from 'pure-render-decorator';
import './LayerList.css';


const messages = defineMessages({
  layertitle: {
    id: 'layerlist.layertitle',
    description: 'List of layers',
    defaultMessage: 'Layers'
  }
});

/**
 * A list of layers in the map. Allows setting visibility and opacity.
 */
@pureRender
class LayerList extends React.Component {
  constructor(props) {
    super(props);
    LayerStore.bindMap(this.props.map);
  }
  componentWillMount() {
    this._onChangeCb = this._onChange.bind(this);
    LayerStore.addChangeListener(this._onChangeCb);
    this._onChange();
  }
  componentWillUnmount() {
    LayerStore.removeChangeListener(this._onChangeCb);
  }
  _onChange() {
    this.setState(LayerStore.getState());
  }
  renderLayerGroup(group) {
    return this.renderLayers(group.getLayers().getArray().slice(0).reverse());
  }
  renderLayers(layers) {
    var me = this;
    var layerNodes = layers.map(function(lyr) {
      return me.getLayerNode(lyr);
    });
    return (
        <ul>
        {layerNodes}
        </ul>
    );
  }
  _showPanel() {
    this.setState({visible: true});
  }
  _hidePanel() {
    if (this._modalOpen !== true) {
      this.setState({visible: false});
    }
  }
  _togglePanel() {
    var newVisible = !this.state.visible;
    if (newVisible || this._modalOpen !== true) {
      this.setState({visible: newVisible});
    }
  }
  _onModalOpen() {
    this._modalOpen = true;
  }
  _onModalClose() {
    this._modalOpen = false;
  }
  getLayerNode(lyr) {
    if (lyr.get('title') !== null) {
      if (lyr instanceof ol.layer.Group) {
        var children = this.props.showGroupContent ? this.renderLayerGroup(lyr) : undefined;
        return (
          <LayerListItem {...this.props} onModalClose={this._onModalClose.bind(this)} onModalOpen={this._onModalOpen.bind(this)} key={lyr.get('title')} layer={lyr} children={children} title={lyr.get('title')} />
        );
      } else {
        return (
          <LayerListItem {...this.props} onModalClose={this._onModalClose.bind(this)} onModalOpen={this._onModalOpen.bind(this)} key={lyr.get('title')} layer={lyr} title={lyr.get('title')} />
        );
      }
    }
  }
  render() {
    const {formatMessage} = this.props.intl;
    var layers = this.state.layers.slice(0).reverse();
    var className = 'layer-switcher';
    var heading;
    var tipLabel = this.props.tipLabel || formatMessage(messages.layertitle);
    if (this.state.layers[this.state.layers.length - 1].get('type') !== 'base-group') {
      heading = <ul><h4><strong>{tipLabel}</strong></h4></ul>;
    }
    if (this.state.visible) {
      className += ' shown';
    }
    var onMouseOut = this.props.expandOnHover ? this._hidePanel.bind(this) : undefined;
    var onMouseOver = this.props.expandOnHover ? this._showPanel.bind(this) : undefined;
    var onClick = !this.props.expandOnHover ? this._togglePanel.bind(this) : undefined;
    return (
      <div onMouseOut={onMouseOut} onMouseOver={onMouseOver} className={className}>
        <UI.DefaultButton className='layerlistbutton' onClick={onClick} title="Layers"><Icon.Icon name="map" /></UI.DefaultButton>
        <div className="layer-tree-panel">
          {heading}
          {this.renderLayers(layers)}
        </div>
      </div>
    );
  }
}

LayerList.propTypes = {
  /**
   * The map whose layers should show up in this layer list.
   */
  map: React.PropTypes.instanceOf(ol.Map).isRequired,
  /**
   * Should we show a button that allows the user to zoom to the layer's extent?
   */
  showZoomTo: React.PropTypes.bool,
  /**
   * Should we allow for reordering of layers?
   */
  allowReordering: React.PropTypes.bool,
  /**
   * Should we allow for filtering of features in a layer?
   */
  allowFiltering: React.PropTypes.bool,
  /**
   * Should we allow for labeling of features in a layer?
   */
  allowLabeling: React.PropTypes.bool,
  /**
   * Should we show the contents of layer groups?
   */
  showGroupContent: React.PropTypes.bool,
  /**
   * Should we show a download button for layers?
   */
  showDownload: React.PropTypes.bool,
  /**
   * Should we show an opacity slider for layers?
   */
  showOpacity: React.PropTypes.bool,
  /**
   * Text to show on top of layers.
   */
  tipLabel: React.PropTypes.string,
  /**
   * Should we expand when hovering over the layers button?
   */
  expandOnHover: React.PropTypes.bool,
  /**
  * i18n message strings. Provided through the application through context.
  */
  intl: intlShape.isRequired
};

LayerList.defaultProps = {
  showZoomTo: false,
  allowReordering: false,
  allowFiltering: false,
  allowLabeling: false,
  showGroupContent: true,
  showDownload: false,
  showOpacity: false,
  expandOnHover: true
};

export default injectIntl(LayerList);
