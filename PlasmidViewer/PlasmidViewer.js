import React from 'react';
import { PlasmidBone } from './PlasmidBone';
import { PlasmidBoneC } from './PlasmidBoneC';
import { PlasmidBoneNAL } from './PlasmidBoneNAL';
import FeatureGroup from './FeatureGroup';

import EnzymeLabelContainer from './EnzymeLabelContainer';
import { LA } from './../LA';
import { PlasmidViewerCursorMeter, PlasmidViewerCursorGeneral } from './PlasmidViewerCursor';
import { PlasmidViewerSelectionGeneral } from './PlasmidViewerSelection';
import { PlasmidViewerVisibleArea } from './PlasmidViewerVisibleArea';

//the PlasmidViewer component of onion
export class PlasmidViewer extends React.Component {
  static propTypes = {
    rotateAngle: React.PropTypes.number,
    seqLength: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    mode: React.PropTypes.string,
    name: React.PropTypes.string,
    features: React.PropTypes.array,
    plasmidR: React.PropTypes.number,
    theme: React.PropTypes.string,
    enzymes: React.PropTypes.array,
    selectedFeature: React.PropTypes.array,
    cursorPos: React.PropTypes.number,
    selectionStart: React.PropTypes.number,
    selectionLength: React.PropTypes.number,
    showViewAngle: React.PropTypes.bool,
    onWheel: React.PropTypes.func,
  };

  static defaultProps = {
    width: 500,
    height: 500,
    seqLength: 1000,
    rotateAngle: 0,
    theme: 'SG',
    cursorPos: 0,
    selectionStart: 0,
    selectionLength: 0,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.onWheel = this.onWheel.bind(this);
  }

  onWheel(e) {
    this.props.onWheel(e);
    e.preventDefault();
  }

  calcEnzymeRoot(_enzymes, r) {
    const { rotateAngle, seqLength } = this.props;
    const plasmidR = r;
    const la = new LA(seqLength, 0, 360);
    const xy = (a) => {
      const re = {
        x: (plasmidR * Math.cos((90 - a) * Math.PI / 180)),
        y: (-plasmidR * Math.sin((90 - a) * Math.PI / 180)),
      };
      return re;
    };

    const enzymes = _enzymes;
    for (let i = 0; i < enzymes.length; i++) {
      enzymes[i].rootPos = xy(la.a(enzymes[i].pos[0]) + rotateAngle);
    }

    return enzymes;
  }

  render() {
    const { width, height, mode } = this.props;
    const {
      name,
      features,
      seqLength,
      plasmidR,
      theme,
      selectedFeature,
      cursorPos,
      selectionStart,
      selectionLength,
      showViewAngle,
      } = this.props;
    let { rotateAngle } = this.props;

    let enzymes = this.props.enzymes;
    let enzymeRootR = plasmidR;
    if (theme === 'C') enzymeRootR = plasmidR + 10;

    enzymes = this.calcEnzymeRoot(enzymes, enzymeRootR);

    let viewBox = [];

    if (plasmidR * 2 < width && plasmidR * 2 < height) {
      viewBox = [-width / 2, -height / 2, width, height];
    } else {
      viewBox = [-width / 2, -plasmidR - height / 2, width, height];
    }

    let plasmid = (<div></div>);

    const defs = (<defs>
      <radialGradient id="grad1" cx="50%" cy="50%" r="90%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#00ffff" stopOpacity="0.5"/>
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
      </radialGradient >
      <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0"/>
        <stop offset="100%" stopColor="#00ffff" stopOpacity="0.5"/>
      </linearGradient >
    </defs>);

    if (theme === 'B') {
      plasmid = (
        <div>
          <svg
            width={width}
            height={height}
            viewBox={viewBox}
            onWheel={this.onWheel}
          >
            <g
              className="plasmid"
              transform={`rotate (${rotateAngle})`}
            >
              <PlasmidBone
                radius={plasmidR}
                seqLength={seqLength}
              />
              <FeatureGroup
                radius={plasmidR - 40}
                features={features}
                seqLength={seqLength}
                selectedFeature={selectedFeature}
                globalRotateAngle={rotateAngle}
                theme={"B"}
              />
            </g>
            <g className="title">
              <text
                x={0}
                y={0}
                fontSize={16}
                style={{
                  dominantBaseline: 'text-after-edge',
                  textAnchor: 'middle',
                  WebkitUserSelect: 'none',
                }}
              >
                {name}
              </text>
              <text
                x={0}
                y={0}
                fontSize={10}
                style={{
                  dominantBaseline: 'text-before-edge',
                  textAnchor: 'middle',
                  WebkitUserSelect: 'none',
                }}
              >
                {`${seqLength} bp`}
              </text>
            </g>
            <g className="enzyme">
              {mode === 'normal' && <EnzymeLabelContainer
                enzymeR={plasmidR + 50}
                plasmidR={plasmidR}
                enzymes={enzymes}
              />}
            </g>
          </svg>
        </div>
      );
    } else if (theme === 'C') {
      plasmid = (
        <div>
          <svg
            width={width}
            height={height}
            viewBox={viewBox}
            onWheel={this.onWheel}
          >
            <g
              className="plasmid"
              transform={`rotate (${rotateAngle})`}
            >
              <PlasmidBoneC
                radius={plasmidR}
                seqLength={seqLength}
              />
              <FeatureGroup
                radius={plasmidR}
                features={features}
                seqLength={seqLength}
                selectedFeature={selectedFeature}
                globalRotateAngle={rotateAngle}
                theme={"B"}
              />
            </g>
            <g className="enzyme">
              {mode === 'normal' && <EnzymeLabelContainer
                enzymeR={plasmidR + 50}
                plasmidR={plasmidR}
                enzymes={enzymes}
              />}
            </g>
          </svg>
        </div>
      );
    } else if (theme === 'NA') {
      plasmid = (
        <div>
          <svg
            width={width}
            height={height}
            viewBox={viewBox}
            onWheel={this.onWheel}
          >
            <g
              className="plasmid"
              transform={`rotate (${rotateAngle})`}
            >
              <PlasmidBoneC
                radius={plasmidR}
                seqLength={seqLength}
              />
              <FeatureGroup
                radius={plasmidR}
                features={features}
                seqLength={seqLength}
                selectedFeature={selectedFeature}
                globalRotateAngle={rotateAngle}
                theme={"NA"}
              />
            </g>
            <g className="enzyme">
              {mode === 'normal' && <EnzymeLabelContainer
                enzymeR={plasmidR + 50}
                plasmidR={plasmidR}
                enzymes={enzymes}
              />}
            </g>
          </svg>
        </div>
      );
    } else if (theme === 'NAL') {
      if (rotateAngle !== 198 && rotateAngle !== 18) {
        rotateAngle = 198;
      }

      plasmid = (
        <div>
          <svg
            width={width}
            height={height}
            viewBox={viewBox}
            onWheel={this.onWheel}
          >
            {defs}
            <g
              className="plasmid"
              transform={`rotate (${rotateAngle})`}
            >
              <PlasmidBoneNAL
                radius={plasmidR}
                seqLength={seqLength}
              />
              {<FeatureGroup
                radius={plasmidR}
                features={features}
                seqLength={seqLength}
                selectedFeature={selectedFeature}
                globalRotateAngle={rotateAngle}
                theme={"NA"}
                angleSpan={[0, 360 - 36]}
              />}

              {showViewAngle && <PlasmidViewerVisibleArea
                angle={0}
                angleSelected={120}
                radius={plasmidR - 20}
              />
              }
              <g className="cursor">
                <PlasmidViewerCursorMeter
                  angle={cursorPos * 324 / seqLength}
                  radius={plasmidR - 20}
                />

              </g>
              <g className="selection">
                {<PlasmidViewerSelectionGeneral
                  angle={selectionStart * 324 / seqLength}
                  angleSelected={selectionLength * 324 / seqLength}
                  radius={plasmidR}
                />}
              </g>

            </g>
            <g className="enzyme">
              {false && mode === 'normal' && <EnzymeLabelContainer
                enzymeR={plasmidR + 50}
                plasmidR={plasmidR}
                enzymes={enzymes}
              />}
            </g>
            <g>
              <text
                textAnchor="middle"
                x="0"
                y={plasmidR * 0.618}
                fill="black"
                style={{
                  WebkitUserSelect: 'none',
                }}
              >
                {Math.round(cursorPos)}
              </text>
            </g>

          </svg>
        </div>
      );
    } else {
      plasmid = (
        <div>
          <svg
            width={width}
            height={height}
            viewBox={viewBox}
            onWheel={this.onWheel}
          >
            <g
              className="plasmid"
              transform={`rotate (${rotateAngle})`}
            >
              <PlasmidBone
                radius={plasmidR}
                seqLength={seqLength}
              />
              <FeatureGroup
                radius={plasmidR - 40}
                features={features}
                seqLength={this.props.seqLength}
                selectedFeature={selectedFeature}
                globalRotateAngle={rotateAngle}
                theme={theme}
              />
              <g className="cursor">
                <PlasmidViewerCursorGeneral
                  angle={cursorPos * 360 / seqLength}
                  radius={plasmidR}
                />
              </g>
              <g className="selection">
                <PlasmidViewerSelectionGeneral
                  angle={selectionStart * 360 / seqLength}
                  angleSelected={selectionLength * 360 / seqLength}
                  radius={plasmidR}
                />
              </g>

            </g>
            <g className="title">
              <text
                x={0}
                y={0}
                fontSize={16}
                style={{ dominantBaseline: 'text-after-edge', textAnchor: 'middle' }}
              >
                {name}
              </text>
              <text
                x={0}
                y={0}
                fontSize={10}
                style={{ dominantBaseline: 'text-before-edge', textAnchor: 'middle' }}
              >
                {`${seqLength} bp`}
              </text>
            </g>
            <g className="enzyme">
              {mode === 'normal' && <EnzymeLabelContainer
                enzymeR={plasmidR + 50}
                plasmidR={plasmidR}
                enzymes={enzymes}
              />}
            </g>

          </svg>
        </div>
      );
    }

    return plasmid;
  }
}
