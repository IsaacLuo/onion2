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
  };
  static defaultProps = {
    height: 20,
    width: 0,
    y: 0,
  };

  constructor(props) {
    super(props);
    this.state = { showTitle: false };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !compareProps(this.props, nextProps, Object.keys(this.props));
  }

  onMouseEnter() {
    this.setState({ hovering: true, showTitle: true });
  }

  onMouseLeave() {
    this.setState({ hovering: false, showTitle: false });
  }

  render() {
    const { unitWidth, height, len, start, color, text } = this.props;
    const width = unitWidth * len;
    const fontFamily = 'Cousine';
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

    return (
      <g
        onMouseEnter={this.onMouseEnter.bind(this)}
        onMouseLeave={this.onMouseLeave.bind(this)}
        transform={`translate(0,${this.props.y})`}
      >
        <rect
          x={unitWidth * start}
          y={0}
          width={width}
          height={height}
          stroke={stroke}
          strokeWidth="0"
          fill={color}
        />
        {<text
          style={{
            fontFamily: fontFamily,
            fontSize: fontSize,
            fill: 'black',
            alignmentBaseline: 'middle',
            WebkitUserSelect: 'none',
            textAnchor: textAnchor,
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
