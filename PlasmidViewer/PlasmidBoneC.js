/**
 * Created by luoyi on 12/02/2016.
 */
import React from 'react';

export class PlasmidBoneC extends React.Component {
  static propTypes = {
    radius: React.PropTypes.number,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { radius } = this.props;
    return (
      <g>
        <circle
          x="0"
          y="1"
          r={radius}
          fill="none"
          stroke="black"
          strokeWith={3}
        >
        </circle>
      </g>
    );
  }
}
