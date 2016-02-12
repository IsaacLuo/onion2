import React from 'react';

export class PlasmidViewerVisibleArea extends React.Component {
  static propTypes = {
    angle: React.PropTypes.number,
    angleSelected: React.PropTypes.number,
    radius: React.PropTypes.number,
  };
  static defaultProps = {
    angle: 0,
    angleSelected: 0,
    radius: 250,
  };
  constructor(props) {
    super(props);
  }

  render() {
    const angle = this.props.angle;
    const angle2 = this.props.angleSelected;
    const pointerAngle = (angle2 - 90) * Math.PI / 180;
    const r = this.props.radius;

    const ptE = { x: r * Math.cos(pointerAngle), y: r * Math.sin(pointerAngle) };

    let longFlag = 1;
    if (angle2 > 180) longFlag = 0;

    const viewD = `M 0 0 L 0 ${-r} A ${r} ${r} 0 ${longFlag} 0 ${ptE.x} ${ptE.y} `;

    return (
      <g
        transform={`rotate(${angle})`}
      >
        <circle
          cx="0"
          cy="0"
          r={r}
          fill="url(#grad1)"
        />
        <path
          d={viewD}
          fill="#ffffff"
          strokeWidth={0}
          stroke="green"
        />
      </g>
    );
  }
}
