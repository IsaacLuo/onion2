/**
 * Created by luoyi on 07/01/2016.
 */
import React from 'react';
//import ReactDOM from 'react-dom';
import { DNASeq } from './Bio/DNASeq';
import { NumericControl } from './InfoBar/NumericControl';
import { NumericControlGD } from './InfoBar/NumericControlGD';

//The Inforbar shows the selection start site, end site, GC content and TM value
export class InfoBar extends React.Component {
  static propTypes = {
    showPos: React.PropTypes.bool,
    showLength: React.PropTypes.bool,
    showGC: React.PropTypes.bool,
    showTM: React.PropTypes.bool,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    startPos: React.PropTypes.number,
    endPos: React.PropTypes.number,
    seq: React.PropTypes.string,
    onChange: React.PropTypes.func,
    style: React.PropTypes.object,
    blocks: React.PropTypes.array,
  };
  static defaultProps = {
    showPos: true,
    showLength: true,
    showGC: true,
    showTM: true,
    seq: '',

  };

  constructor(props) {
    super(props);
    this.initCallBack();
  }

  initCallBack() {
    this.onChangeStart = (o, v, e) => {
      this.showStartValue = true;
      if (this.props.onChange) {
        const { startPos, endPos } = this.props;
        const vv = v;
        if (startPos === endPos) {		//cursorMode
          this.props.onChange(vv, vv);
        } else {
          this.props.onChange(vv, Math.max(endPos, vv));
        }
      }

      return false;
    };

    this.onChangeEnd = (o, v, e) => {
      if (this.props.onChange) {
        const { startPos, endPos } = this.props;
        const vv = v;
        if (startPos === endPos && vv < startPos) {		//cursorMode
          this.props.onChange(vv, vv);
        } else {
          this.props.onChange(Math.min(startPos, vv), vv);
        }
      }
    };
  }

  render() {
    const {
      showPos,
      showLength,
      showGC,
      showTM,
      startPos,
      endPos,
      seq,
      blocks,
      } = this.props;
    const itemStyle = {
      display: 'inline-block',
      marginTop: 9,
      marginLeft: 10,
      marginRight: 10,
      color: '#757884',
      verticalAlign: 'top',
      minWidth: 90,
      whiteSpace: 'nowrap',
      fontFamily: 'Helvetica, Arial, sans-serif',
      fontSize: 12,
    };

    const itemStyleWithNumeric = Object.assign({ ...itemStyle }, { marginTop: 5 });

    const length = seq.length;


    let gcText;
    let tmText;
      const dna = new DNASeq(seq);
      const gc = dna.getGCPercentage();
      const tm = (length >= 10 && length <= 50) ? dna.getTM() : 0;
      gcText = `${(gc * 100).toFixed(1)}%`;
      tmText = `${length >= 10 && length <= 50 ? `${tm.toFixed(1)}°C` : '-'}`;


    let NC = blocks ? NumericControlGD : NumericControl;

    return (
      <div
        style={Object.assign({ ...this.props.style },
          { whiteSpace: 'nowrap', overflow: 'hidden' })}
      >
        {showPos &&
        <div
          style={itemStyleWithNumeric}
        >
          <div
            style={{ display: 'inline-block', marginTop: 4, marginRight: 0 }}
          >
          Start:
          </div>

          <NC
            value={startPos}
            style={{ marginLeft: 8 }}
            valueBoxStyle={{ height: 20 }}
            showValue={startPos >= 0}
            onChange={this.onChangeStart}
            blocks={blocks}
            offset={1}
          />

        </div>
        }
        {showPos &&
        <div
          style={itemStyleWithNumeric}
        >
          <div
            style={{ display: 'inline-block', marginTop: 4, marginRight: 0 }}
          >
            End:
          </div>

          <NC
            value={endPos}
            showValue={startPos < endPos}
            minValue={startPos}
            style={{ marginLeft: 8 }}
            valueBoxStyle={{ height: 20 }}
            onChange={this.onChangeEnd}
            blocks={blocks}
            offset={0}
          />

        </div>
        }
        {showLength &&
        <div
          style={itemStyle}
        >
          Length: {length} BP
        </div>
        }
        {showGC &&
        <div
          style={itemStyle}
        >
          GC: {gcText}
        </div>
        }
        {showTM &&
        <div
          style={itemStyle}
        >
          Melting Temp: {tmText}
        </div>
        }

      </div>
    );
  }
}
