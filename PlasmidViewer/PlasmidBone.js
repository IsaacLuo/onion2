import React, { PropTypes } from 'react';
import { LA } from './../LA';

// the plasmid circle component
export class PlasmidBone extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var { radius, seqLength } = this.props;
    var rOutSide = radius;
    var rInSide = radius - 3;
    var r = rInSide;
    var markPos = [];
    var markPosAngle = [];
    var markLines = [];
    var markD = 1000;
    var la = new LA(seqLength, 0, 360);
    if (seqLength < 1000) {
      markD = 100;
    } else {
      markD = 1000;
    }

    for (let i = 0; i < seqLength; i += markD) {
      markPos.push(i);
    }

    for (let i in markPos) {
      var p = markPos[i];
      var angle = la.a(p);
      markLines.push(
        <PosOnPlasmid
          angle={angle}
          key={i}
        >
          <line
            x1="0"
            x2="0"
            y1={-r + 20}
            y2={-r}
            stroke="black"
            strokeWidth="1"
          >
          </line>
          <text

            fontSize="12"
            textAnchor="start"
            style={{ alignmentBaseline:'text-before-edge' }}
          >
            <textPath
              xlinkHref="#markTextPath"
            >
              {p}
            </textPath>
          </text>
        </PosOnPlasmid>
      );
    }

    return (
      <g>
        <circle
          x="0"
          y="1"
          r={rOutSide}
          fill="none"
          stroke="black"
          onClick={(e, a, c) => {
            console.log([e, a, c]);
          }}
        >
        </circle>
        <circle
          x="0"
          y="1"
          r={r}
          id="insideCircle"
          fill="none"
          stroke="black"
        >
        </circle>
        <path
          d={`M 0 ${-r + 10} A ${r - 10} ${r - 10} 0 1 1 -0.1 ${-r + 10}`}
          stroke="red"
          strokeWidth="0"
          fill="none"
          id="markTextPath"
        >
        </path>
        {markLines}
      </g>
    );
  }
}

var PosOnPlasmid = function ({ children, angle = 0 }) {
  var transform;
  transform = `rotate(${angle},0,0)`;
  return (
    <g transform={ transform }>
      { children }
    </g>
  );
};

var PositionAnnotationOnCircle = function ({ children, height = 0, sAngle = 0, eAngle = 0, forward = true }) {
  const sAngleDegs = sAngle * 360 / Math.PI / 2;
  const eAngleDegs = eAngle * 360 / Math.PI / 2;
  var transform;
  if (forward) {
    transform = `translate(0,${-height}) rotate(${sAngleDegs},0,${height})`;
  } else {
    transform = `scale(-1,1) translate(0,${-height}) rotate(${-eAngleDegs},0,${height}) `;
  }

  return (
    <g transform={ transform }>
      { children }
    </g>
  );
};

export class PlasmidBoneC extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var { radius, seqLength } = this.props;
    return (
      <g>
        <circle
          x="0"
          y="1"
          r={radius}
          fill="none"
          stroke="black"
          strokeWith={3}
          onClick={(e, a, c) => {
            console.log([e, a, c]);
          }}
        >
        </circle>
      </g>
    );
  }
}

export class PlasmidBoneNAL extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var { radius, seqLength } = this.props;
    let la = new LA(360, 0, Math.PI * 2);
    let d = '';
    let seqL = seqLength * 1.1;

    let radiusO = radius + 10;
    let radiusI = radius - 10;

    let startA = -la.a(36) - Math.PI / 2;
    let endA = -la.a(0) - Math.PI / 2;
    d += `M ${radius * Math.cos(startA)} ${radius * Math.sin(startA)}`;
    d += `A ${radius} ${radius} 0 1 0 ${radius * Math.cos(endA)} ${radius * Math.sin(endA)}`;
    d += `M ${radiusO * Math.cos(startA)} ${radiusO * Math.sin(startA)}`;
    d += `L ${radiusI * Math.cos(startA)} ${radiusI * Math.sin(startA)}`;
    d += `M ${radiusO * Math.cos(endA)} ${radiusO * Math.sin(endA)}`;
    d += `L ${radiusI * Math.cos(endA)} ${radiusI * Math.sin(endA)}`;
    return (
      <g>
        <path
          d={d}
          fill="none"
          stroke="black"
          strokeWith={3}
          onClick={(e, a, c) => {
            console.log([e, a, c]);
          }}
        >
        </path>
      </g>
    );
  }
}
