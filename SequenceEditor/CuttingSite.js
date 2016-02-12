/**
 * Created by Isaac on 25/01/2016.
 */
import React from 'react';

// Emzyme label is a text showing enzyme restriction site and cutting site on a strand,
// a part of PlasmidViewer
export class CuttingSite extends React.Component {
  static propTypes = {
    u: React.PropTypes.number.isRequired,
    d: React.PropTypes.number.isRequired,
    s: React.PropTypes.string.isRequired,
    y: React.PropTypes.number.isRequired,
    h: React.PropTypes.number.isRequired,
    className: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { u, d, s, y, h, className } = this.props;
    switch (s) {
      case 'N':
        return (
          <path
            d={`M ${u} ${y} L ${u} ${y + h / 2} L ${d}  ${y + h / 2} ${d} ${y + h}`}
            strokeWidth={1}
            stroke={"black"}
            fill="none"
            className={className}
            style={{ display: 'none' }}
          />
        );
      case 'UL':
      case 'UR':
        return (
          <path
            d={`M ${u} ${y} L ${u} ${y + h / 2} L ${d + 5}  ${y + h / 2}`}
            strokeWidth={1}
            stroke={"black"}
            fill="none"
            className={className}
            style={{ display: 'none' }}
          />
        );

      case 'DL':
      case 'DR':
        return (
          <path
            d={`M ${u - 5} ${y + h / 2} L ${d}  ${y + h / 2} ${d} ${y + h}`}
            strokeWidth={1}
            stroke={"black"}
            fill="none"
            className={className}
            style={{ display: 'none' }}
          />
      );
      default:
        return <g></g>;
    }
  }
}
