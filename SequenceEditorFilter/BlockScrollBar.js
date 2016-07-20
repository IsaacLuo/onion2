import React from 'react';

import 'jquery';

export class BlockScrollBar extends React.Component {
  static propTypes = {
    topRow: React.PropTypes.number,
    rows: React.PropTypes.number,
    totalRows: React.PropTypes.number,
    blocks: React.PropTypes.array,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    style: React.PropTypes.object,
  }

  constructor(props){
    super(props)

  }

  render(){
    const {
      topRow,
      rows,
      totalRows,
      blocks,
      width,
      height,
      style,
    } = this.props;

    let rects = [];

    if(blocks && Array.isArray(blocks) && blocks.length>=1) {
      let totalLength = blocks[blocks.length - 1].start + blocks[blocks.length - 1].length;

      let key = 0;
      for (const b of blocks) {
        let y = height * b.start / totalLength;
        let h = height * b.length / totalLength;
        let color = b.color ? b.color : '#A5A6A2';
        rects.push(<rect
          x={5}
          y={y}
          width={width-5}
          height={h}
          fill={color}
          key={key++}
        />);
        y += h;
      }
    }


    let pointerY = height*topRow/totalRows;
    let viewPointer = <path
      d={`M 0 ${pointerY} L 5 ${pointerY+5} L 0 ${pointerY+10} Z`}
      fill="#4E77BA"
    />;
    // viewPointer = <rect
    //   x={0}
    //   y={pointerY}
    //   width={width}
    //   height={10}
    //   fill="rgba(78,119,186,0.5)"
    // />;

    return (
      <div
        style={style}
      >
        <svg
          width={width}
          height={height}
        >

          <rect
            x={5}
            y={0}
            width={width-5}
            height={height}
            fill="#b3b3b3"
          />
          {rects}
          {viewPointer}
        </svg>
      </div>
    )
  }

}