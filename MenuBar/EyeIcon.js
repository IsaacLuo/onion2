/**
 * Created by luoyi on 12/02/2016.
 */
import React from 'react';
import './css/Onion.css';

export class EyeIcon extends React.Component {
  static propTypes = {
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    stroke: React.PropTypes.string,
  };
  static defaultProps = {
    width: 17,
    height: 17,
    stroke: '#4c505f',
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { width, height, stroke } = this.props;
    return (
      <svg width={width} height={height}>
        <g id="Welcome" stroke="none" strokeWidth="1" fill="none">
          <g id="Desktop" transform="translate(-153.000000, -124.000000)">
            <path id="Path-121" stroke={stroke} d=""/>
            <path
              d={'M161.5,128 C167,128 169,132.290784 169,132.290784 C169,132.290784 167,'
              + ' 137.5 161.5,137.5 C156,137.5 154,132.290784 154,132.290784 C154,'
              + '132.290784 156, 128 161.5,128 Z'}
              id="Path-122" stroke={stroke}
            />
            <ellipse
              id="Oval-16"
              stroke={stroke}
              cx="161.5"
              cy="132.875891"
              rx="2.8125"
              ry="2.92553475"
            />
          </g>
        </g>
      </svg>
    );
  }
}
