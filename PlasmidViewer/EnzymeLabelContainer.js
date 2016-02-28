import React from 'react';
import EnzymeLabel from './EnzymeLabel';

//Enzyme label container is used to find the available location to put the enzyme lables
export class EnzymeLabelContainer extends React.Component
{
  static propTypes = {
    plasmidR: React.PropTypes.number.isRequired,
    enzymeR: React.PropTypes.number.isRequired,
    enzymes: React.PropTypes.array.isRequired,
  };

  constructor(props) {
    super(props);
    this.resetR(props.plasmidR, props.enzymeR);
    this.textPath = [];
    this.enzymePoses = [];
  }

  resetR(plasmidR, enzymeR) {
    this.pr = plasmidR;
    this.er = enzymeR;
  }

  clearContainer() {

  }

  genTextPath2(x, y, l, key) {
    return (<path
      d={`M ${x} ${y} L ${x + l}  ${y}`}
      strokeWidth={1}
      stroke={"black"}
      key={key}
    />);
  }

  genTextPath(rx, ry, x, y, l, key, text) {
    return (
      <EnzymeLabel
        rootPos = {{ x: rx, y: ry }}
        textPos = {{ x, y }}
        text = {text}
        key = {key}
        l={50}
      />
    );
  }

  calcAllPosition(unitHeight = 15) {
    this.enzymePoses = [];
    for (let y = 0; y < this.er; y += unitHeight) {
      const x = Math.sqrt(this.er * this.er - y * y);
      this.enzymePoses.push({ x, y, items: [] });
      this.enzymePoses.push({ x, y: -y, items: [] });
      this.enzymePoses.push({ x: -x, y, items: [] });
      this.enzymePoses.push({ x: -x, y: -y, items: [] });
    }
  }

  findNearestPos(rootPos) {
    let maxD2 = 9999999;
    let nearestEnzymePos = this.enzymePoses[0];
    for (let i = 0; i < this.enzymePoses.length; i++) {
      const e = this.enzymePoses[i];
      const dx = e.x - rootPos.x;
      const dy = e.y - rootPos.y;
      const d2 = dx * dx + dy * dy;
      if (d2 < maxD2) {
        maxD2 = d2;
        nearestEnzymePos = e;
      }
    }

    return nearestEnzymePos;
  }

  fillEnzymes(enzymes) {
    this.textPath = [];

    for (let i = 0; i < enzymes.length; i++) {
      const enzyme = enzymes[i];
      const rootPos = enzyme.rootPos;
      //find nearestPos
      const ePos = this.findNearestPos(rootPos);
      ePos.items.push({ name: enzyme.enzyme.name, rootPos: enzyme.rootPos });
    }

    for (let i in this.enzymePoses) {
      if (this.enzymePoses.hasOwnProperty(i)) {
        const enzymePos = this.enzymePoses[i];
        if (enzymePos.items.length > 0) {
          let names = '';
          for (let j = 0; j < enzymePos.items.length; j++) {
            names += ` ${enzymePos.items[j].name}`;
          }
          //console.log(enzymePos.items[0].rootPos)
          this.textPath.push(this.genTextPath(
            enzymePos.items[0].rootPos.x,
            enzymePos.items[0].rootPos.y,
            enzymePos.x,
            enzymePos.y,
            100,
            Math.random() + i,
            names));
        }
      }
    }
  }

  render() {
    this.resetR(this.props.plasmidR, this.props.enzymeR);
    this.calcAllPosition();
    this.fillEnzymes(this.props.enzymes);

    return (
      <g>
        {this.textPath}
      </g>
    );
  }
}
module.exports = EnzymeLabelContainer;
