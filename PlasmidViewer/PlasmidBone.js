import React from 'react';
import { LA } from './../LA';

// the plasmid circle component
export class PlasmidBone extends React.Component {
  static propTypes = {
    radius: React.PropTypes.number,
    seqLength: React.PropTypes.number,
  };
  constructor(props) {
    super(props);
  }

  render() {
    const { radius, seqLength } = this.props;
    const rOutSide = radius;
    const rInSide = radius - 3;
    const r = rInSide;
    const markPos = [];
    const markLines = [];
    let markD = 1000;
    const la = new LA(seqLength, 0, 360);
    if (seqLength < 1000) {
      markD = 100;
    } else {
      markD = 1000;
    }

    for (let i = 0; i < seqLength; i += markD) {
      markPos.push(i);
    }

    for (let i = 0; i < markPos.length; i++) {
      const p = markPos[i];
      const angle = la.a(p);
      markLines.push(
        <g
          transform={`rotate(${angle},0,0)`}
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
            style={{ alignmentBaseline: 'text-before-edge' }}
          >
            <textPath
              xlinkHref="#markTextPath"
            >
              {p}
            </textPath>
          </text>
        </g>
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
        />
        <circle
          x="0"
          y="1"
          r={r}
          id="insideCircle"
          fill="none"
          stroke="black"
        />
        <path
          d={`M 0 ${-r + 10} A ${r - 10} ${r - 10} 0 1 1 -0.1 ${-r + 10}`}
          stroke="red"
          strokeWidth="0"
          fill="none"
          id="markTextPath"
        />
        {markLines}
      </g>
    );
  }
}
