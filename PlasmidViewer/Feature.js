import React from 'react';

// Feature is an arrow to show the site of annotations on the PlasmidViewer
export class Feature extends React.Component {
  static propTypes = {
    arrowStartAngle: React.PropTypes.number,
    arcLen: React.PropTypes.number,
    color: React.PropTypes.string,
    radius: React.PropTypes.number,
    strand: React.PropTypes.string,
  }

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const anchor = this.calcAnchor();
    if (anchor === 'middle') this.refs.featureTextPath.setAttribute('startOffset', '50%');
  }

  angle2XY(r, a) {
    const d = Math.PI / 2;
    const y = r * Math.sin(a - d);
    const x = r * Math.cos(a - d);
    return { x, y };
  }

  calcArrowPath(style = 'B') {
    if (style === 'B') {
      return this.calcArrowPathB();
    }

    if (style === 'NA') {
      return this.calcArrowPathNoArrow();
    }

    return this.calcArrowPathSG();
  }

  calcArrowPathB() {
    const { arrowStartAngle, arcLen, color, radius, strand } = this.props;
    const rO = radius + 10;
    const rI = radius - 10;
    const rM = (rO + rI) / 2;

    let longThan50 = 0;
    if (arcLen > 180) longThan50 = 1;
    let arrowD = '';
    const neckLength = 1200 / rO;
    let arrowNeck1 = neckLength;
    if (arrowNeck1 > arcLen - 6) {
      arrowNeck1 = arcLen * 0.4;
    }

    let arrowNeck2 = arcLen - neckLength;
    if (arrowNeck2 < 6) {
      arrowNeck2 = arcLen * 0.6;
    }

    if (strand === '-' || strand === '=') {
      arrowD += `M 0 ${-rM}`;
      const an = this.angle2XY(rO, arrowNeck1 * Math.PI / 180);
      arrowD += `L ${an.x} ${an.y}`;
    } else {
      arrowD += `M 0 ${-rO}`;
    }

    if (strand === '+' || strand === '=') {
      const arcEnd = this.angle2XY(rO, arrowNeck2 * Math.PI / 180);
      arrowD += `A ${rO} ${rO} 0 ${longThan50} 1 ${arcEnd.x} ${arcEnd.y}`;
      const arrowEnd = this.angle2XY(rM, arcLen * Math.PI / 180);
      arrowD += `L ${arrowEnd.x} ${arrowEnd.y}`;
      const arcEndI = this.angle2XY(rI, arrowNeck2 * Math.PI / 180);
      arrowD += `L ${arcEndI.x} ${arcEndI.y}`;
    } else {
      const arcEnd = this.angle2XY(rO, arcLen * Math.PI / 180);
      arrowD += `A ${rO} ${rO} 0 ${longThan50} 1 ${arcEnd.x} ${arcEnd.y}`;
      const arcEndI = this.angle2XY(rI, arcLen * Math.PI / 180);
      arrowD += `L ${arcEndI.x} ${arcEndI.y}`;
    }

    if (strand === '-' || strand === '=') {
      const an = this.angle2XY(rI, arrowNeck1 * Math.PI / 180);
      arrowD += `A ${rI} ${rI} 0 ${longThan50} 0 ${an.x} ${an.y}`;
      arrowD += `L 0 ${-rM}`;
    } else {
      arrowD += `A ${rI} ${rI} 0 ${longThan50} 0 0 ${-rI}`;
      arrowD += `L 0 ${-rO}`;
    }

    return arrowD;
  }

  calcArrowPathNoArrow() {
    let { arrowStartAngle, arcLen, color, radius, strand } = this.props;
    let rO = radius + 10;
    let rI = radius - 10;
    let rM = (rO + rI) / 2;

    let longThan50 = 0;
    if (arcLen > 180) longThan50 = 1;
    let arrowD = '';

    arrowD += `M 0 ${-rO}`;

    let arcEnd = this.angle2XY(rO, arcLen * Math.PI / 180);
    arrowD += `A ${rO} ${rO} 0 ${longThan50} 1 ${arcEnd.x} ${arcEnd.y}`;
    let arcEndI = this.angle2XY(rI, arcLen * Math.PI / 180);
    arrowD += `L ${arcEndI.x} ${arcEndI.y}`;

    arrowD += `A ${rI} ${rI} 0 ${longThan50} 0 0 ${-rI}`;
    arrowD += `L 0 ${-rO}`;

    return arrowD;
  }

  calcArrowPathSG()
  {
    let { arrowStartAngle, arcLen, color, radius, strand } = this.props;
    //let arrowD = "M 0 0 L 100 100 L 200 0 Z";
    let rO = radius + 10;
    let rI = radius - 10;
    let rOO = rO + 3;
    let rII = rI - 3;
    let rM = (rO + rI) / 2;

    let longThan50 = 0;
    if (arcLen > 180) longThan50 = 1;
    let arrowD = '';
    let neckLength = 1200 / rO;
    let arrowNeck1 = neckLength;
    if (arrowNeck1 > arcLen - 6) {
      arrowNeck1 = arcLen * 0.4;
    }

    let arrowNeck2 = arcLen - neckLength;
    if (arrowNeck2 < 6) {
      arrowNeck2 = arcLen * 0.6;
    }

    if (strand === '-' || strand === '=') {
      arrowD += `M 0 ${-rM}`;
      let ae = this.angle2XY(rOO, arrowNeck1 * Math.PI / 180);
      let an = this.angle2XY(rO, arrowNeck1 * Math.PI / 180);
      arrowD += `L ${ae.x} ${ae.y}`;
      arrowD += `L ${an.x} ${an.y}`;
    } else {
      arrowD += `M 0 ${-rO}`;
    }

    if (strand === '+' || strand === '=') {
      let arcEnd = this.angle2XY(rO, arrowNeck2 * Math.PI / 180);
      arrowD += `A ${rO} ${rO} 0 ${longThan50} 1 ${arcEnd.x} ${arcEnd.y}`;
      let ae = this.angle2XY(rOO, arrowNeck2 * Math.PI / 180);
      arrowD += `L ${ae.x} ${ae.y}`;
      let arrowEnd = this.angle2XY(rM, arcLen * Math.PI / 180);
      arrowD += `L ${arrowEnd.x} ${arrowEnd.y}`;
      let ae2 = this.angle2XY(rII, arrowNeck2 * Math.PI / 180);
      arrowD += `L ${ae2.x} ${ae2.y}`;
      let arcEndI = this.angle2XY(rI, arrowNeck2 * Math.PI / 180);
      arrowD += `L ${arcEndI.x} ${arcEndI.y}`;
    } else {
      let arcEnd = this.angle2XY(rO, arcLen * Math.PI / 180);
      arrowD += `A ${rO} ${rO} 0 ${longThan50} 1 ${arcEnd.x} ${arcEnd.y}`;
      let arcEndI = this.angle2XY(rI, arcLen * Math.PI / 180);
      arrowD += `L ${arcEndI.x} ${arcEndI.y}`;
    }

    if (strand === '-' || strand === '=') {
      let ae = this.angle2XY(rII, arrowNeck1 * Math.PI / 180);
      let an = this.angle2XY(rI, arrowNeck1 * Math.PI / 180);
      arrowD += `A ${rI} ${rI} 0 ${longThan50} 0 ${an.x} ${an.y}`;
      arrowD += `L ${ae.x} ${ae.y}`;
      arrowD += `L 0 ${-rM}`;
    } else {
      arrowD += `A ${rI} ${rI} 0 ${longThan50} 0 0 ${-rI}`;
      arrowD += `L 0 ${-rO}`;
    }

    return arrowD;
  }

  calcTextPath(inside = false) {
    let { arrowStartAngle, arcLen, radius, strand, text } = this.props;
    let textLen = text.length;
    let longThan50 = 0;
    if (arcLen > 180) longThan50 = 1;
    let d = '';
    let arcLenPx = arcLen * Math.PI / 180 * radius;

    let beginSpace = 1;
    let endSpace = 1;
    let neckLength = 1200 / radius;
    if (strand === '-' || strand === '=')
      beginSpace = neckLength;
    if (strand === '+' || strand === '=')
      endSpace = neckLength;

    if (!inside) {
      let r = radius;
      let arcStart = this.angle2XY(r, (beginSpace) * Math.PI / 180);
      d += `M ${arcStart.x} ${arcStart.y}`;
      let arcEnd = this.angle2XY(r, (arcLen - endSpace) * Math.PI / 180);
      d += `A ${r} ${r} 0 ${longThan50} 1 ${arcEnd.x} ${arcEnd.y}`;
    } else {
      let r = radius;
      let arcStart = this.angle2XY(r, (beginSpace) * Math.PI / 180);
      let arcEnd = this.angle2XY(r, (arcLen - endSpace) * Math.PI / 180);
      d += `M ${arcEnd.x} ${arcEnd.y}`;
      d += `A ${r} ${r} 0 ${longThan50} 0 ${arcStart.x} ${arcStart.y}`;
    }

    return d;
  }

  calcAnchor() {
    let { arrowStartAngle, arcLen, radius, strand, text } = this.props;
    let textLen = text.length;
    let arcLenPx = arcLen * Math.PI / 180 * radius;
    if (arcLenPx > textLen * 8) {
      var anchor = 'middle';
    } else {
      var anchor = 'start';
    }

    return anchor;
  }

  render() {
    let { globalRotateAngle, arrowStartAngle, arcLen, color, radius, strand, theme } = this.props;
    let arrowD = this.calcArrowPath(theme);
    let inside = false;
    let angleMid = (globalRotateAngle + arrowStartAngle + arcLen / 2) % 360;
    if ((angleMid) > 90 && (angleMid) < 270)
      inside = true;
    let textD = this.calcTextPath(inside);
    let anchor = this.calcAnchor();
    if (this.refs.featureTextPath && anchor === 'middle')
      this.refs.featureTextPath.setAttribute('startOffset', '50%');
    else if (this.refs.featureTextPath)
      this.refs.featureTextPath.setAttribute('startOffset', '0%');

    let strokeColor = (this.props.highLight) ? 'red' : 'black';
    return (
      <g
        transform ={`rotate(${1 * arrowStartAngle})`}
        data-featureid = {this.props.featureID}
        className="featureArrowG"
      >
        <path
          d={arrowD}
          strokeWidth={0}
          stroke={strokeColor}
          fill={this.props.color}
        >
        </path>
        <path
          d={textD}
          fill="none"
          strokeWidth={0}
          stroke={"none"}
          id={`feature_text_path_${this.props.featureID}`}
        >
        </path>
        <text
          fill={strokeColor}
          textAnchor = {anchor}
          style={{ dominantBaseline:'central', cursor:'default', WebkitUserSelect:'none', }}
        >
          <textPath
            featureID = {this.props.featureID}
            ref="featureTextPath"
            xlinkHref={`#feature_text_path_${this.props.featureID}`}
            fontFamily='"Lucida Console", Monaco, monospace'
            fontSize="9pt"
          >
            {this.props.text}
          </textPath>

        </text>
      </g>
    );
  }

}
module.exports = Feature;
