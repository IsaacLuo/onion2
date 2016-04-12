/**
 * Created by Isaac on 20/01/2016.
 */
import React from 'react';
import { compareProps } from './../reactHelper';
import { DNASeq } from './../Bio/DNASeq';

let translateIndexF = 0;
let translateIndexR = 0;

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

  static translateDictF = ' empty block ';
  static translateDictR = ' no sequence ';

  beginTranslateBps() {
    translateIndex = 0;
  }

  translateNextXF(x) {
    if (x === 'X') {
      const re = StrainText.translateDictF[translateIndexF];
      translateIndexF = (translateIndexF + 1) % 13;
      return re;
    }

    return x;
  }
  translateNextXR(x) {
    if (x === 'X') {
      const re = StrainText.translateDictR[translateIndexR];
      translateIndexR = (translateIndexR + 1) % 13;
      return re;
    }

    return x;
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
    let psRender = '';
    let rsRender = '';
    if (spanDef && spanDef.length > 0) {
      const compSequence = new DNASeq(sequence).complement().toString();

      //replace full string

      for (const x of sequence) {
        psRender += this.translateNextXF(x);
      }

      for (const x of compSequence) {
        rsRender += this.translateNextXR(x);
      }

      const psRender2 = [];
      for (const span of spanDef) {
        psRender2.push(
          <tspan style={{ ...seqMainStyle, ...span.style }} key={span.start}>
            {psRender.substr(span.start, span.length)}
          </tspan>
        );
      }
      psRender = psRender2;
    } else {
      psRender = sequence;
      rsRender = (new DNASeq(sequence)).complement().toString();
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
