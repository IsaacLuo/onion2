import React from 'react';
import { compareProps } from './../reactHelper';

//the arrow on PlasmidViewer
export class SequenceFeatureArrow extends React.Component {
  static propTypes = {
    theme: React.PropTypes.string,
    start: React.PropTypes.number,
    len: React.PropTypes.number,
    unitWidth: React.PropTypes.number,
    height: React.PropTypes.number,
    y: React.PropTypes.number,
    color: React.PropTypes.string,
    text: React.PropTypes.string,
    strand: React.PropTypes.string,
    arrowStyle: React.PropTypes.string,
  };
  static defaultProps = {
    height: 20,
    width: 0,
    y: 0,
    color: '#A5A6A2',
    strand: 'none',
    arrowStyle: 'none'
  };

  constructor(props) {
    super(props);
    this.state = { showTitle: false };
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !compareProps(this.props, nextProps, Object.keys(this.props));
  }

  onMouseOver() {
    this.setState({ hovering: true, showTitle: true });
  }

  onMouseOut() {
    this.setState({ hovering: false, showTitle: false });
  }

  render() {
    const { unitWidth, height, len, start, color, text, strand, arrowStyle } = this.props;
    const width = unitWidth * len;
    const fontFamily = 'Helvetica, Arial, sans-serif';
    const fontSize = 12;
    let titleOpacity;
    let textAnchor;
    if (len > text.length) {
      titleOpacity = 1;
      textAnchor = 'middle';
      this.textOverflow = false;
    } else {
      titleOpacity = (this.state.showTitle === true ? 1 : 0);
      textAnchor = 'start';
      this.textOverflow = true;
    }

    const stroke = this.state.hovering ? 'red' : 'black';
    //const finalTextColor = this.state.hovering ? 'red' : textColor;

    const fillColor = color ? color : '#A5A6A2';

    let arrow;

    if(arrowStyle === 'none' || strand === '.'){
      arrow = <rect
          x={unitWidth * start}
          y={0}
          width={width}
          height={height}
          stroke={stroke}
          strokeWidth="0"
          fill={fillColor}
      />;
    } else if (arrowStyle === 'ext' && strand === '+') {

      const rx = unitWidth * start + width + 2;
      const rxm = rx+unitWidth + 2;

      arrow = <g>
        <rect
            x={unitWidth * start}
            y={0}
            width={width}
            height={height}
            stroke={stroke}
            strokeWidth="0"
            fill={fillColor}
        />
        <path
          d={`M ${rx} 0 L ${rxm} ${height/2} L ${rx} ${height}`}
          stroke="#A5A6A2"
          fill="none"
          strokeWidth="1"
        />
      </g>
    } else if (arrowStyle === 'ext' && strand === '-') {
      const rx = -2;
      const rxm = -unitWidth - 2;
      arrow = <g>
        <rect
            x={unitWidth * start}
            y={0}
            width={width}
            height={height}
            stroke={stroke}
            strokeWidth="0"
            fill={fillColor}
        />
        <path
            d={`M ${rx} 0 L ${rxm} ${height/2} L ${rx} ${height}`}
            stroke="#A5A6A2"
            fill="none"
            strokeWidth="1"
        />
      </g>
    } else if (arrowStyle === 'end' && strand === '+') {
      const lx = unitWidth * start;
      const rx = lx + width - unitWidth;
      const rxm = rx + unitWidth;
      arrow =
        <path
            d={`M ${lx} 0 L ${rx} 0 L ${rxm} ${height/2} L ${rx} ${height} L ${lx} ${height} Z`}
            stroke={stroke}
            strokeWidth="0"
            fill={fillColor}
        />
    } else if (arrowStyle === 'end' && strand === '-') {
      const lxm = unitWidth * start;
      const lx = lxm + unitWidth;
      const rx = lxm + width;
      arrow =
          <path
              d={`M ${lx} 0 L ${rx} 0 L ${rx} ${height} L ${lx} ${height} L ${lxm} ${height/2} Z`}
              stroke={stroke}
              strokeWidth="0"
              fill={fillColor}
          />
    }




    return (
      <g
        onMouseOver={this.onMouseOver}
        onMouseOut={this.onMouseOut}
        transform={`translate(0,${this.props.y})`}
      >
        {arrow}
        {<text
          style={{
            fontFamily,
            fontSize,
            fill: 'black',
            alignmentBaseline: 'central',
            WebkitUserSelect: 'none',
            textAnchor,
            opacity: titleOpacity,
          }}
          x={unitWidth * start + width / 2}
          y={height / 2}
        >
          {text}
        </text>}
      </g>
);
  }
}
