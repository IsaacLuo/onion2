import React from 'react';
import {SequenceEditor} from '../SequenceEditor';
import {BlockScrollBar} from './BlockScrollBar';
import 'jquery';

//one of main components of onion, sequence editor
export class SequenceEditorFilter extends React.Component {
  static propTypes = {
    sequence: React.PropTypes.string, //dna sequence, in ACGT
    theme: React.PropTypes.oneOf(['normal', 'nowrap']),
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    enzymeList: React.PropTypes.array,
    features: React.PropTypes.array,
    cursorPos: React.PropTypes.number,
    selectStartPos: React.PropTypes.number,
    showEnzymes: React.PropTypes.bool,
    showAA: React.PropTypes.bool,
    showLadder: React.PropTypes.bool,
    showRS: React.PropTypes.bool,
    showFeatures: React.PropTypes.bool,
    showRuler: React.PropTypes.bool,
    showBlockBar: React.PropTypes.bool,
    showCursor: React.PropTypes.bool,
    blocks: React.PropTypes.array,
    style: React.PropTypes.object,
    onBlockChanged: React.PropTypes.func,
    onSetCursor: React.PropTypes.func,
    onSelect: React.PropTypes.func,
    onRowCalculatedHeight: React.PropTypes.func,
    showSelection: React.PropTypes.bool,
    focus: React.PropTypes.bool,
    onQueryNewBlocks: React.PropTypes.func,

  };
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.unitWidth = 7.1943;
    this.seqLen = props.sequence.length;
    this.colNum = Math.floor(props.width / this.unitWidth) - 10;

    this.state = {
      topRow: 0,
      totalRows: Math.ceil(props.sequence.length / this.colNum),
    };
    this.initCallBack();

  }

  componentWillReceiveProps(nextProps) {
    try {

      this.seqLen = nextProps.sequence.length;
      this.colNum = Math.floor(nextProps.width / this.unitWidth) - 10;
      this.state.totalRows = Math.ceil(nextProps.sequence.length / this.colNum);
      if (this.state.topRow > this.state.totalRows) this.state.topRow = this.state.totalRows - 1;

    } catch (err) {
      console.error(err);
    }
  }

  shouldComponentUpdate(np) {
    return true;
  }


  initCallBack() {
    this.deltaY = 0;

    this.onWheel = (e) => {
      let {topRow, totalRows} = this.state;
      if (!e || !e.deltaY) {
      } else {
        
        this.deltaY += e.deltaY;

        if (this.deltaY>=100) {
          topRow++;
          if (topRow >= totalRows) {
            topRow = totalRows - 1;
          }
          if (topRow < 0) {
            topRow = 0
          }
          this.deltaY = 0;
          this.setState({topRow});
        } else if(this.deltaY<-100) {
          topRow--;
          if (topRow < 0) {
            topRow = 0
          }
          this.deltaY = 0;
          this.setState({topRow});
        }
      }
      e.preventDefault();
    }

  }

  render() {
    const {sequence, width, height, showLadder, showReverse, showRuler } =  this.props;
    const {topRow} = this.state;

    let rowHeight = 61.5;
    if (showRuler){
      rowHeight+=25;
    }
    if (showReverse) {
      rowHeight+=14;
    }
    if (showRuler || showReverse)
    {
      rowHeight+=7;
    }

    const rowsToShow = Math.ceil(height/rowHeight);

    let newProp = {
      ...this.props,
      startRow: topRow,
      endRow: topRow + rowsToShow,
      disableScroll: true,

    };
    return (
      <div
        onWheel={this.onWheel}
      >
          <SequenceEditor
            {...newProp}
          />
      </div>
    );
  }

}
