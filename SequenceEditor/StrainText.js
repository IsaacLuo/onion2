/**
 * Created by Isaac on 20/01/2016.
 */
import React from 'react';
import { compareProps } from './../reactHelper';
import { DNASeq } from './../Bio/DNASeq';

export class StrainText extends React.Component {
  static propTypes = {
    showRS: React.PropTypes.bool,
    showLadder: React.PropTypes.bool,
    ep: React.PropTypes.object,
    sequenceRowWidth: React.PropTypes.number,
    seqMainStyle: React.PropTypes.object,
    seqCompStyle: React.PropTypes.object,
    sequence: React.PropTypes.string,
    unitWidth: React.PropTypes.number,
  };

  shouldComponentUpdate(nextProps) {
    const update = !compareProps(this.props, nextProps, Object.keys(this.props));

    return update;
  }

  generateRuler(x, y, w, h, unitWidth) {
    const my = y + h / 2;
    let re = `M ${x} ${my} L ${x + w} ${my}`;
    for (let xx = x + unitWidth / 2; xx < x + w; xx += unitWidth) {
      re += `M ${xx} ${y + 4} L ${xx} ${y + h - 4}`;
    }

    return re;
  }

  render() {
    const {
      showRS,
      showLadder,
      ep,
      sequenceRowWidth,
      seqMainStyle,
      seqCompStyle,
      sequence,
      unitWidth,
      } = this.props;
    const rs = new DNASeq(sequence);
    return (
      <g>
        <text
          style={seqMainStyle}
          x="0"
          y={ep.seqY}
        >
          {sequence}
        </text>
        {showRS && <text
          style={seqCompStyle}
          x="0"
          y={ep.compY}
        >
          {rs.complement().toString()}
        </text>
        }
        {showLadder && <path
          d={this.generateRuler(0, ep.rulerY, sequenceRowWidth, ep.rulerH, unitWidth)}
          strokeWidth="1"
          stroke="#E6E7E8"
        >
        </path>
        }
      </g>
    );
  }
}
