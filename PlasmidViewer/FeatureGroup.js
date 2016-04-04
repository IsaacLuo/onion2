import React from 'react';

import { LA } from './../LA';
import { Feature } from './Feature';
const $ = require('jquery');

// this is a feature builder
export class FeatureGroup extends React.Component {
  static propTypes = {
    selectedFeature: React.PropTypes.number,
    angleSpan: React.PropTypes.array,
    seqLength: React.PropTypes.number,
    features: React.PropTypes.array,
    radius: React.PropTypes.number,
    globalRotateAngle: React.PropTypes.number,
    theme: React.PropTypes.string,
    onSelect: React.PropTypes.func,
  };

  static defaultProps = {
    angleSpan: [0, 360],
    features: [],
  };

  constructor(props) {
    super(props);
    this.state = { selectedFeature: props.selectedFeature };
    this.initCallBack();
  }

  initCallBack() {
    const _this = this;
    this.onClick = (e) => {
      const id = $(e.target).closest('.featureArrowG').data('featureid');
      //console.log('id',id);
      _this.setState({selectedFeature: id});
      if(_this.props.onSelect) {
        const feature = _this.props.features[id];
        _this.props.onSelect(feature.end, feature.start);
      }
    }
  }

  calcFeaturePos() {
    const { angleSpan, features } = this.props;
    const featureArrows = [];
   // console.log(features);
    this.la = new LA(this.props.seqLength, angleSpan[0], angleSpan[1]);
    for (let i in features) {
      const feature = features[i];
      const arrow = Object.assign({}, feature);
      arrow.arrowStartAngle = this.la.a(arrow.start);
      arrow.arcLen = this.la.a(arrow.end) - arrow.arrowStartAngle;

      featureArrows.push(arrow);
    }

    return featureArrows;
  }

  buildFeatureArrows(featureArrows) {
    const doms = [];
    for (let i = 0; i < featureArrows.length; i++) {
      const feature = featureArrows[i];
      doms.push(
        <Feature
          arrowStartAngle={feature.arrowStartAngle}
          arcLen={feature.arcLen}
          color={feature.color}
          radius = {this.props.radius}
          text = {feature.text}
          key={i}
          featureID = {i}
          strand = {feature.strand}
          highLight = {i === this.state.selectedFeature}
          globalRotateAngle = {this.props.globalRotateAngle}
          theme = {this.props.theme}
        />
      );
    }

    return doms;
  }

  render() {
    const featureArrows = this.calcFeaturePos();
    const doms = this.buildFeatureArrows(featureArrows);
    return (
      <g
        onClick={this.onClick}
      >
      {doms}
    </g>
    );
  }

}
module.exports = FeatureGroup;
