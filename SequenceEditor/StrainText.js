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
    spanDef: React.PropTypes.array,
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
      spanDef,
      } = this.props;
    const rs = new DNASeq(sequence);
    let psRender = sequence.replace(/XXXXXXXXXXXXX/, ' empty block ');
    const rsRender = rs.complement().toString().replace(/XXXXXXXXXXXXX/, ' no sequence ');

    if (spanDef) {
      const psRender2 = [];
      for (const span of spanDef) {
        psRender2.push(
          <tspan style={{ ...seqMainStyle, ...span.style }} key={span.start}>
            {psRender.substr(span.start, span.length)}
          </tspan>
        );
      }

      psRender = psRender2;
    }

    return (
      <g>
        <text
          style={seqMainStyle}
          x="0"
          y={ep.seqY}
          xmlSpace="preserve"
        >
          {psRender}
        </text>
        {showRS && <text
          style={seqCompStyle}
          x="0"
          y={ep.compY}
          xmlSpace="preserve"
        >
          {rsRender}
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
