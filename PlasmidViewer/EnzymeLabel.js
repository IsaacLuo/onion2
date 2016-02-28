import React from 'react';

//Emzyme label is a text showing enzyme restriction site and cutting site on a strand,
// a part of PlasmidViewer
export class EnzymeLabel extends React.Component {
  static propTypes = {
    rootPos: React.PropTypes.object,
    textPos: React.PropTypes.object,
    l: React.PropTypes.number,
    text: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  calcAllPosition(unitHeight = 15) {
    const offset = 50;
    let key = 5210000;
    for (let y = 0; y < this.er; y += unitHeight) {
      const x = Math.sqrt(this.er * this.er - y * y);
      this.textPath.push(this.genTextPath(x, y, offset, key++));
      this.textPath.push(this.genTextPath(x, -y, offset, key++));
      this.textPath.push(this.genTextPath(-x, y, -offset, key++));
      this.textPath.push(this.genTextPath(-x, -y, -offset, key++));
    }
  }

  render() {
    const { rootPos, textPos, text } = this.props;
    let { l } = this.props;
    let anchor = 'begin';
    if (textPos.x < 0) {
      l = -l;
      anchor = 'end';
    } else {
      anchor = 'begin';
    }

    return (
      <g>
        <path
          d={`M ${rootPos.x} ${rootPos.y} L ${textPos.x} ${textPos.y} \
          L ${textPos.x + l}  ${textPos.y}`}
          strokeWidth={1}
          stroke={"black"}
          fill="none"
        />
        <text
          x={textPos.x}
          y={textPos.y}
          textAnchor={anchor}

        >
          {text}
        </text>
      </g>
    );
  }
}
module.exports = EnzymeLabel;
