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
    const {width,height,style} = this.props;
    return (
      <div
        style={style}
      >
        <svg
          width={width}
          height={height}
        >
          <rect
            x={width-10}
            y={0}
            width={10}
            height={height}
            fill="#b3b3b3"
          />
          <rect
            fill="#edf2f8"
          />
        </svg>
      </div>
    )
  }

}