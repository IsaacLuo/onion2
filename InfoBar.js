/**
 * Created by luoyi on 07/01/2016.
 */
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {DNASeq} from './Bio/DNASeq';
import {NumericControl} from './InfoBar/NumericControl';

//The Inforbar shows the selection start site, end site, GC content and TM value
export class InfoBar extends React.Component {
  static propTypes = {};
  static defaultProps = {
    showPos: true,
    showLength: true,
    showGC: true,
    showTM: true,
    seq: "",

  };

  constructor(props) {
    super(props);
  }

  render() {
    let { showPos,
      showLength,
      showGC,
      showTM,
      width,
      height,
      startPos,
      endPos,
      seq,
      onChange,
      } = this.props;
    let itemStyle = {
      display: "inline-block",
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
      marginBottom: 10,
      color: "A5A6A2",
      verticalAlign: "middle",
      width: 90,

    };

    let length = endPos - startPos;
    let dna = new DNASeq(seq);
    let gc = dna.getGCPercentage();
    let tm = 0;
    if (length=>10 && length <= 50) {
      tm = dna.getTM();
    }

    return (
      <div
        style={this.props.style}
      >
        {showPos &&
        <div
          style={itemStyle}
        >
          <span className="noselect"> start:</span>
          <NumericControl
            value={startPos + 1}
            style={{ marginLeft:10 }}
            onChange={(o, v, e)=> {
              if (this.props.onChange) {
                let vv = parseInt(v) - 1;
                if (startPos == endPos) {		//cursorMode
                  this.props.onChange(vv, vv);
                }                else {
                  this.props.onChange(vv, Math.max(endPos, vv));
                }
              }

              return false;
            }}
          ></NumericControl>
        </div>
        }
        {showPos &&
        <div
          style={itemStyle}
        >
          <span className="noselect"> end:</span>
          <NumericControl
            ref={(obj)=> {
              this.numericEnd = obj;
            }}

            value={endPos}
            style={{ marginLeft:10, color:startPos < endPos ? "black" : "rgba(127,127,127,0)" }}
            onChange={(o, v, e)=> {
              if (this.props.onChange) {
                let vv = parseInt(v);
                if (startPos == endPos && vv < startPos) {		//cursorMode
                  this.props.onChange(vv, vv);
                }                else {
                  this.props.onChange(Math.min(startPos, vv), vv);
                }
              }
            }}
          ></NumericControl>
        </div>
        }
        {showLength &&
        <div
          style={itemStyle}
        >
          length:                       {length}bp
        </div>
        }
        {showGC &&
        <div
          style={itemStyle}
        >
          GC:                       {(gc * 100).toFixed(1)}%
        </div>
        }
        {showTM &&
        <div
          style={itemStyle}
        >
          TM:                       {length >= 10 && length <= 50 ? tm.toFixed(1) + "°C" : "-"}
        </div>
        }

      </div>
    );
  }
}
