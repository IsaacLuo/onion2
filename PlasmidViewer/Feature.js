import React from 'react';

// Feature is an arrow to show the site of annotations on the PlasmidViewer
export class Feature extends React.Component {
  static propTypes = {
    arrowStartAngle: React.PropTypes.number,
    arcLen: React.PropTypes.number,
    color: React.PropTypes.string,
    radius: React.PropTypes.number,
    strand: React.PropTypes.string,
    text: React.PropTypes.string,
    globalRotateAngle: React.PropTypes.number,
    theme: React.PropTypes.string,
    highLight: React.PropTypes.bool,
    featureID: React.PropTypes.string,
  };

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
    const { arcLen, radius, strand } = this.props;
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
    const { arcLen, radius } = this.props;
    const rO = radius + 10;
    const rI = radius - 10;

    let longThan50 = 0;
    if (arcLen > 180) longThan50 = 1;
    let arrowD = '';

    arrowD += `M 0 ${-rO}`;

    const arcEnd = this.angle2XY(rO, arcLen * Math.PI / 180);
    arrowD += `A ${rO} ${rO} 0 ${longThan50} 1 ${arcEnd.x} ${arcEnd.y}`;
    const arcEndI = this.angle2XY(rI, arcLen * Math.PI / 180);
    arrowD += `L ${arcEndI.x} ${arcEndI.y}`;

    arrowD += `A ${rI} ${rI} 0 ${longThan50} 0 0 ${-rI}`;
    arrowD += `L 0 ${-rO}`;

    return arrowD;
  }

  calcArrowPathSG() {
    const { arcLen, radius, strand } = this.props;
    const rO = radius + 10;
    const rI = radius - 10;
    const rOO = rO + 3;
    const rII = rI - 3;
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
      const ae = this.angle2XY(rOO, arrowNeck1 * Math.PI / 180);
      const an = this.angle2XY(rO, arrowNeck1 * Math.PI / 180);
      arrowD += `L ${ae.x} ${ae.y}`;
      arrowD += `L ${an.x} ${an.y}`;
    } else {
      arrowD += `M 0 ${-rO}`;
    }

    if (strand === '+' || strand === '=') {
      const arcEnd = this.angle2XY(rO, arrowNeck2 * Math.PI / 180);
      arrowD += `A ${rO} ${rO} 0 ${longThan50} 1 ${arcEnd.x} ${arcEnd.y}`;
      const ae = this.angle2XY(rOO, arrowNeck2 * Math.PI / 180);
      arrowD += `L ${ae.x} ${ae.y}`;
      const arrowEnd = this.angle2XY(rM, arcLen * Math.PI / 180);
      arrowD += `L ${arrowEnd.x} ${arrowEnd.y}`;
      const ae2 = this.angle2XY(rII, arrowNeck2 * Math.PI / 180);
      arrowD += `L ${ae2.x} ${ae2.y}`;
      const arcEndI = this.angle2XY(rI, arrowNeck2 * Math.PI / 180);
      arrowD += `L ${arcEndI.x} ${arcEndI.y}`;
    } else {
      const arcEnd = this.angle2XY(rO, arcLen * Math.PI / 180);
      arrowD += `A ${rO} ${rO} 0 ${longThan50} 1 ${arcEnd.x} ${arcEnd.y}`;
      const arcEndI = this.angle2XY(rI, arcLen * Math.PI / 180);
      arrowD += `L ${arcEndI.x} ${arcEndI.y}`;
    }

    if (strand === '-' || strand === '=') {
      const ae = this.angle2XY(rII, arrowNeck1 * Math.PI / 180);
      const an = this.angle2XY(rI, arrowNeck1 * Math.PI / 180);
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
    const { arcLen, radius, strand } = this.props;
    let longThan50 = 0;
    if (arcLen > 180) longThan50 = 1;
    let d = '';
    let beginSpace = 1;
    let endSpace = 1;
    const neckLength = 1200 / radius;
    if (strand === '-' || strand === '=') beginSpace = neckLength;
    if (strand === '+' || strand === '=') endSpace = neckLength;

    if (!inside) {
      const r = radius;
      const arcStart = this.angle2XY(r, (beginSpace) * Math.PI / 180);
      d += `M ${arcStart.x} ${arcStart.y}`;
      const arcEnd = this.angle2XY(r, (arcLen - endSpace) * Math.PI / 180);
      d += `A ${r} ${r} 0 ${longThan50} 1 ${arcEnd.x} ${arcEnd.y}`;
    } else {
      const r = radius;
      const arcStart = this.angle2XY(r, (beginSpace) * Math.PI / 180);
      const arcEnd = this.angle2XY(r, (arcLen - endSpace) * Math.PI / 180);
      d += `M ${arcEnd.x} ${arcEnd.y}`;
      d += `A ${r} ${r} 0 ${longThan50} 0 ${arcStart.x} ${arcStart.y}`;
    }

    return d;
  }

  calcAnchor() {
    const { arcLen, radius, text } = this.props;
    const textLen = text.length;
    const arcLenPx = arcLen * Math.PI / 180 * radius;
    const anchor = (arcLenPx > textLen * 8) ? 'middle' : 'start';
    return anchor;
  }

  splitColor(color){
    if(color[0]=='#') {
      const r = color.slice(1, 3);
      const g = color.slice(3, 5);
      const b = color.slice(5, 7);
      //console.log('rgb',r,g,b);
      return [parseInt(r,16), parseInt(g,16), parseInt(b,16)];
    } else if (color.slice(0,4) == 'rgb(') {
      return  color.slice(3).split(/\s/);
    }
  }

  narrowColor(color) {
    let rgb = this.splitColor(color);
    let [r,g,b] = rgb;
    let t = 230;
    if(r>t) r=t;
    if(g>t) g=t;
    if(b>t) b=t;
    let re = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;
    return re;
  }

  render() {
    const { globalRotateAngle, arrowStartAngle, arcLen, theme } = this.props;
    const arrowD = this.calcArrowPath(theme);
    let inside = false;
    const angleMid = (globalRotateAngle + arrowStartAngle + arcLen / 2) % 360;
    if ((angleMid) > 90 && (angleMid) < 270) inside = true;
    const textD = this.calcTextPath(inside);
    const anchor = this.calcAnchor();
    if (this.refs.featureTextPath && anchor === 'middle') {
      this.refs.featureTextPath.setAttribute('startOffset', '50%');
    } else if (this.refs.featureTextPath) {
      this.refs.featureTextPath.setAttribute('startOffset', '0%');
    }

    const strokeColor = (this.props.highLight) ? 'red' : 'black';
    const strokeWidth =
      this.props.highLight ? 1:0;

    let fill = this.narrowColor(this.props.color);

    return (
      <g
        transform ={`rotate(${1 * arrowStartAngle})`}
        data-featureid = {this.props.featureID}
        className="featureArrowG"
      >
        <path
          d={arrowD}
          strokeWidth={strokeWidth}
          stroke={strokeColor}
          fill={fill}
        >
        </path>
        <path
          d={textD}
          fill="none"
          strokeWidth={strokeWidth}
          stroke={"none"}
          id={`feature_text_path_${this.props.featureID}`}
        >
        </path>
        <text
          fill={strokeColor}
          textAnchor = {anchor}
          style={{
            dominantBaseline: 'central',
            cursor: 'default',
            WebkitUserSelect: 'none',
          }}
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
