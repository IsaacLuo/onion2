/**
 * Created by luoyi on 12/02/2016.
 */
import React from 'react';
import { LA } from './../LA';

export class PlasmidBoneNAL extends React.Component {
  static propTypes = {
    radius: React.PropTypes.number,
    seqLength: React.PropTypes.number,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { radius } = this.props;
    const la = new LA(360, 0, Math.PI * 2);
    let d = '';

    const radiusO = radius + 10;
    const radiusI = radius - 10;

    const startA = -la.a(36) - Math.PI / 2;
    const endA = -la.a(0) - Math.PI / 2;
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
        />
      </g>
    );
  }
}
