import React from 'react';
import { SequenceRow } from './SequenceEditor/SequenceRow';
import 'jquery';
import { DNASeq } from './Bio/DNASeq';
import { compareProps } from './reactHelper';

//one of main components of onion, sequence editor
export class SequenceEditor extends React.Component {
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
    onSelecting: React.PropTypes.func,
    onRowCalculatedHeight: React.PropTypes.func,
    showSelection: React.PropTypes.bool,

  };
  static defaultProps = {
    sequence: 'NO SEQUENCE', //debug sequence, it should be repalced by inputing
    theme: 'normal',
    showBlockBar: true, //show block bars in genome-designer
    style: {},
  };

  constructor(props) {
    super(props);
    this.textRows = [];

    // style of sequence
    this.myCSS = {
      seqFontFamily: 'Cousine,Monospace',
      seqFontSize: '12pt',
      seqFontUnitWidth: 10, //9.609375,
    };
    //Maybe I need to render a letter first, then calculate its size, it's necessary because
    // the letter width is little difference on different browser.
    //this.seqMainStyleStr = `display:inline-block;font-family:${this.myCSS.seqFontFamily};
    // font-size:${this.myCSS.seqFontSize};color:'#2C3543';
    // letterSpacing:0;position:absolute;left:0px;top:-100px`;
    //jQuery("body").append(`<div id="bp1" style="${this.seqMainStyleStr}">A</div>`);
    //var width = document.getElementById('bp1').getBoundingClientRect().width;
    this.seqMainStyle = {
      //	display: "inline-block",
      fontFamily: this.myCSS.seqFontFamily,
      fontSize: this.myCSS.seqFontSize,
      fill: '#2C3543',
      //letterSpacing: (10 - 9.609375),
      letterSpacing: 0.2,
      alignmentBaseline: 'before-edge',
      WebkitUserSelect: 'none',
    };
    this.seqCompStyle = Object.assign({ fill: '#B7BBC2' }, this.seqMainStyle);
    this.unitWidth = this.myCSS.seqFontUnitWidth;

    this.sequence = new DNASeq(this.props.sequence);
    this.enzymeSites = this.sequence.calcEnzymeSites(this.props.enzymeList);

    this.aas = this.calcAAs(this.props.sequence, this.props.features);

    this.state = {
      cursorPos: 0,
      selectStartPos: 0,
      showCursor: false,
      showSelection: false,
    };

    //initial operations
    this.initialRowPos(this.props.sequence, this.props.width);
    this.initCallBack();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sequence !== this.props.sequence || nextProps.width !== this.props.width) {
      this.initialRowPos(nextProps.sequence, nextProps.width);
    }

    if (this.props.cursorPos !== nextProps.cursorPos
      || this.props.selectStartPos !== nextProps.selectStartPos) {
      this.setState({
        selectStartPos: nextProps.selectStartPos,
        cursorPos: nextProps.cursorPos,
        showCursor: true,
        showSelection: (nextProps.selectStartPos !== nextProps.cursorPos),
      });
    }
  }

  shouldComponentUpdate(np, ns) {
    const update = !compareProps(this.props, np) || !compareProps(this.state, ns);
    return update;
  }

  initCallBack() {
    const _this = this;

    this.onScroll = (e) => {
      const scrollPos = e.target.scrollTop;
      for (let i = 0; i < this.rowY.length; i++) {
        if (scrollPos <= this.rowY[i] + this.rowHeight[i]) {
          const block = this.splitBlocks[i];
          if (block.length > 0) this.props.onBlockChanged(block);
          break;
        }
      }
    };

    this.onSetCursor = (cursorPos, rowNumber) => {
      this.setState({
        cursorPos,
        showCursor: true,
        selectStartPos: cursorPos,
        showSelection: false,
      });
      if (this.props.onSetCursor) {
        this.props.onSetCursor(cursorPos);
      }

      if (this.props.onBlockChanged) {
        const row = Math.floor(cursorPos / this.colNum);
        const x = cursorPos % this.colNum;
        const blocks = this.splitBlocks[row];
        for (let i = 0; i < blocks.length; i++) {
          if (x >= blocks[i].start) {
            this.props.onBlockChanged([blocks[i]]);
          }
        }
      }
    };

    this.onSelecting = (cursorPos, rowNumber, cursorPosStart, rowNumberStart) => {
      if (cursorPosStart) {
        this.setState({
          cursorPos,
          showCursor: true,
          showSelection: true,
          selectStartPos: cursorPosStart,
        });
      } else {
        this.setState({
          cursorPos,
          showCursor: true,
          showSelection: true,
        });
      }

      if (this.props.onSelecting) {
        if (cursorPosStart) {
          console.log('full start', cursorPosStart, cursorPos);
          this.props.onSelecting(cursorPos, cursorPosStart);
        } else {
          this.props.onSelecting(cursorPos, this.state.selectStartPos);
        }
      }
    };

    this.onSetHighLight = (highLightStart, rowNumber, highLightEnd, rowNumberStart) => {
      if (highLightStart === highLightEnd) {
        this.setState({ highLightStart, highLightEnd, showHighLight: false });
      } else {
        this.setState({ highLightStart, highLightEnd, showHighLight: true });
      }
    };

    this.onRowCalculatedHeight = (row, height) => {
      this.rowHeight[row] = height;
      if (row > 0) {
        this.rowY[row] = this.rowY[row - 1] + height;
      } else {
        this.rowY[0] = 0;
      }
    };

  }

  isOverlap(a1, b1, a2, b2) {
    const a3 = Math.max(a1, a2);
    const b3 = Math.min(b1, b2);
    //console.log(a1,a2,b1,b2);
    if (a3 < b3) {
      return { start: a3, end: b3 };
    }

    return undefined;
  }

  calcAAs(sequence, features) {
    if (!sequence || !features) {
      return [];
    }

    const s = new DNASeq(sequence);
    const re = [];
    for (let i = 0; i < features.length; i++) {
      if (features[i].type === 'CDS') {
        const f = features[i];
        const lOri = f.end - f.start;
        const l = Math.floor(lOri / 3) * 3;
        if (f.strand === '-') {
          const realStart = f.start + lOri - l;
          const aa = s.substr(realStart, l).reverseComplement().toAASeq();
          re.push({ seq: aa, start: f.start, len: l, strand: f.strand });
        } else {
          const aa = s.substr(f.start, l).toAASeq();
          re.push({ seq: aa, start: f.start, len: l, strand: f.strand });
        }
      }
    }

    return re;
  }

  findFeaturesInRow(start, len) {
    //console.log("sss",start,len,this.props.features);
    const re = [];
    for (let i = 0; i < this.props.features.length; i++) {
      const f = this.props.features[i];
      const overlap = this.isOverlap(start, start + len, f.start, f.end);
      if (overlap) {
        re.push({
          start: overlap.start,
          len: overlap.end - overlap.start,
          color: f.color,
          text: f.text,
          textColor: f.textColor,
          type: f.type,
          row: 0,
        });
      }
    }
    //console.log(re);
    return re;
  }

  splitFeatures(colNum) {

  }

  initialRowPos(sequence, width) {
    const colNum = Math.floor(width / this.unitWidth) - 10;
    const totalRows = Math.ceil(sequence.length / colNum);
    this.rowHeight = Array(totalRows);
    this.rowY = Array(totalRows);
  }

  splitAAs(colNum) {
    //console.log("splitAAS",this.aas);
    const aas = this.aas;
    const re = new Array(Math.ceil(this.props.sequence.length / colNum));
    for (let i = 0; i < re.length; i++) {
      re[i] = [];
    }
    //console.log("aas",aas);
    if (!aas) return re;

    for (let i = 0; i < aas.length; i++) {
      const aa = aas[i];
      const aaSeq = aa.strand === '-' ? aa.seq.reverse() : aa.seq;
      const startRow = Math.floor(aa.start / colNum);
      let startIdx = aa.start % colNum;
      const endRow = Math.ceil((aa.start + aa.len) / colNum);
      //			console.log("startRow",startRow,endRow,aa.start,aa.len,colNum);
      let leftStyle = 'full';
      let rightStyle = 'full';
      const endIdx = colNum;
      let startOffset = 0;
      const leftStyles = ['full', 'right1', 'right2'];
      const rightStyles = ['full', 'left1', 'left2'];
      let aaOffset = 0;
      let repeatAA = 0;
      let rightStyleIdx;
      let nextStartOffset;
      for (let row = startRow; row < endRow; row++) {
        const leftStyleIdx = (startIdx + 3 - startOffset) % 3;
        //console.log("startOffset",startOffset);
        if (row === startRow) {
          leftStyle = 'left3';
        } else {
          leftStyle = leftStyles[leftStyleIdx];
          repeatAA = startOffset > 0 ? -1 : 0;
        }

        if (row === endRow - 1) {
          rightStyle = 'right3';
        } else {
          rightStyleIdx = (colNum + startOffset - startIdx) % 3;
          rightStyle = rightStyles[rightStyleIdx];
          nextStartOffset = (rightStyleIdx);
        }

        //let seq = calcAASeq(row,aaOffset,(endIdx-startIdx),aa);
        aaOffset += repeatAA;
        const bpLen = endIdx - startIdx;
        const bpLenOld = -leftStyleIdx * repeatAA;
        const bpLenNew = bpLen - bpLenOld;
        const aaSubLen = Math.ceil(bpLenNew / 3) + Math.ceil(bpLenOld / 3);
        const seq = aaSeq.substr(aaOffset, aaSubLen).toString();
        //console.log("aaSeq",seq);

        const newAARow = {
          start: startIdx,
          end: endIdx,
          leftStyle,
          rightStyle,
          row,
          seq,
          startOffset,
          seqLen: seq.length,
          aaOffset,
          repeatAA,
          strand: aa.strand,
        };
        //console.log("newAARow",newAARow);
        if (re[row]) {
          re[row].push(newAARow);
        }

        aaOffset += aaSubLen;
        startIdx = 0;
        leftStyle = 'full';
        rightStyle = 'full';
        //repeatAA = nextRepeatAA;
        startOffset = nextStartOffset;
      }
    }
    //console.log("re",re);
    return re;
  }

  splitEnzymes(colNum) {
    const re = new Array(Math.ceil(this.props.sequence.length / colNum));
    for (let i = 0; i < re.length; i++) {
      re[i] = { rs: [], cs: [] };
    }

    if (!this.props.showEnzymes) return re;

    if (!this.enzymeSites || !this.enzymeSites.length) {
      console.warn('no enzymes');
      return re;
    }

    for (let i = 0; i < this.enzymeSites.length; i++) {
      const es = this.enzymeSites[i];

      const enzyme = es.enzyme;
      const row = Math.floor(es.anchor / colNum);
      const row2 = Math.floor((es.anchor + enzyme.rs.length) / colNum);
      const col = es.anchor % colNum;
      if (row === row2) {
        re[row].rs.push({ rs: [col, col + enzyme.rs.length], name: enzyme.name, id: i });
      } else {
        re[row].rs.push({ rs: [col, colNum], name: enzyme.name, id: i });
        re[row2].rs.push({ rs: [0, col + enzyme.rs.length - colNum], name: enzyme.name, id: i });
      }

      for (let j = 0; j < enzyme.csNumber; j++) {
        let csU;
        let csD;
        const cs = es.getCuttingSite(j);
        if (es.strand === '-') {
          csU = cs[1];
          csD = cs[0];
        } else {
          csU = cs[0];
          csD = cs[1];
        }

        const rowU = Math.floor(csU / colNum);
        const colU = csU % colNum;

        const rowD = Math.floor(csD / colNum);
        const colD = csD % colNum;

        if (rowU === rowD) { // upper site and lower site are in same row
          if (re[rowU]) {
            re[rowU].cs.push({ style: 'N', pos: [colU, colD], id: i });		//normal │, ┌┘,└┐
          }
        } else if (rowU < rowD) {
          if (re[rowU] && re[rowD]) {
            re[rowU].cs.push({ style: 'UR', pos: [colU, colNum], id: i });	//up right  └
            re[rowD].cs.push({ style: 'DL', pos: [0, colD], id: i });	//down left ┐
          }
        } else {
          if (re[rowU] && re[rowD]) {
            re[rowU].cs.push({ style: 'UL', pos: [0, colU], id: i });	//up left  ┘
            re[rowD].cs.push({ style: 'DR', pos: [colD, colNum], id: i });//down right ┌
          }
        }
      }
    }

    return re;
  }

  splitRows(colNum) {
    let { showSelection, showCursor } = this.state;
    const { sequence } = this.props;
    const {
      cursorPos,

      selectStartPos,
      showHighLight,
      highLightStart,
      highLightEnd,
      } = this.state;
    const {
      showEnzymes,
      showLadder,
      showRS,
      showFeatures,
      showRuler,
      showBlockBar,
      blocks,
      showAA,
      } = this.props;

    this.textRows = [];
    let j = 0;
    if (showSelection) {
      if (cursorPos === selectStartPos) {
        showCursor = true;
        showSelection = false;
      } else {
        showCursor = false;
      }
    }

    this.splitBlocks = [];
    const splitBlocks = this.splitBlocks;
    for (let j = 0; j < sequence.length; j += colNum) {
      splitBlocks.push([]);
    }

    if (blocks) {
      for (let i = 0; i < blocks.length; i++) {
        const start = blocks[i].start;
        const len = blocks[i].length;
        const blockEnd = start + len;
        const blockRowIdx = Math.floor(start / colNum);

        for (let j = blockRowIdx; j < Math.ceil((start + len) / colNum); j++) {
          const start = Math.max(blocks[i].start - j * colNum, 0);
          const end = Math.min(blockEnd - j * colNum, colNum);
          if (splitBlocks[j]) {
            splitBlocks[j].push({
              color: blocks[i].color,
              name: blocks[i].name,
              start,
              len: end - start,
            });
          }
        }
      }
    }

    for (let i = 0, rowCount = 0; i < sequence.length; i += colNum, rowCount++) {
      const featureFrags = this.findFeaturesInRow(i, colNum);
      //let aaFrags = this.findAAInRow(i,colNum);

      const aaFrags = this.aaRows[rowCount];
      const enzymeFrags = this.enzymeRows[rowCount];

      let rowCursorPos;

      rowCursorPos = 0;

      const rowShowStartPos = false;
      let rowShowCursor = false;
      let rowShowSelection = false;

      let rowSelectLeftPos = 0;
      let rowSelectRightPos = colNum;
      let rowShowLeftCursor = false;
      let rowShowRightCursor = false;
      let rowHighLightLeftPos = 0;
      let rowHighLightRightPos = colNum;
      let rowShowHighLight = false;

      if (showCursor && cursorPos >= i && cursorPos <= i + colNum) {
        rowCursorPos = cursorPos - i;
        rowShowCursor = true;
        rowShowSelection = false;
      }

      if (showSelection) {
        const selectLeftPos = Math.min(selectStartPos, cursorPos);
        const selectRightPos = Math.max(selectStartPos, cursorPos);
        rowShowCursor = false;
        if (selectLeftPos >= i && selectLeftPos <= i + colNum) {
          rowSelectLeftPos = selectLeftPos - i;
          rowShowLeftCursor = true;
          rowShowSelection = true;
        }

        if (selectRightPos > i && selectRightPos <= i + colNum) {
          rowSelectRightPos = selectRightPos - i;
          rowShowRightCursor = true;
          rowShowSelection = true;
        }

        if (i + colNum <= selectRightPos && i >= selectLeftPos) {
          //console.log(i);
          rowShowSelection = true;
        }
      }

      if (showHighLight) {
        const highLightLeftPos = Math.min(highLightStart, highLightEnd);
        const highLightRightPos = Math.max(highLightStart, highLightEnd);

        if (highLightLeftPos >= i && highLightLeftPos <= i + colNum) {
          rowHighLightLeftPos = highLightLeftPos - i;
          rowShowHighLight = true;
        }

        if (highLightRightPos > i && highLightRightPos <= i + colNum) {
          rowHighLightRightPos = highLightRightPos - i;
          rowShowHighLight = true;
        }
      }

      const subSequence = sequence.substr(i, colNum);

      this.textRows.push(
        <SequenceRow
          sequence={subSequence}
          idxStart={i}
          key={`row${rowCount}`}
          rowNumber={rowCount}
          features={featureFrags}
          unitWidth={this.unitWidth}
          onSetCursor={this.onSetCursor}
          onSetCursorMoving={this.onSelecting}
          onSetHighLight={this.onSetHighLight}
          cursorPos={rowCursorPos}
          showCursor={rowShowCursor}
          selectLeftPos={rowSelectLeftPos}
          selectRightPos={rowSelectRightPos}
          showLeftCursor={rowShowLeftCursor}
          showRightCursor={rowShowRightCursor}
          showSelection={rowShowSelection}
          showStartPos={rowShowStartPos}
          seqMainStyle={this.seqMainStyle}
          seqCompStyle={this.seqCompStyle}
          showEnzymes={showEnzymes}
          showLadder={showLadder}
          showRS={showRS}
          showFeatures={showFeatures}
          showRuler={showRuler}
          showAA={showAA}
          showHighLight={rowShowHighLight}
          highLightLeftPos={rowHighLightLeftPos}
          highLightRightPos={rowHighLightRightPos}
          theme={this.props.theme}
          showBlockBar={showBlockBar}
          blocks={splitBlocks[rowCount]}
          aas={aaFrags}
          enzymes={enzymeFrags}
          onCalculatedHeight={this.onRowCalculatedHeight}
        />);

      j++;
    }
  }

  render() {
    const { width, height, sequence, features } = this.props;
    this.colNum = Math.floor(width / this.unitWidth) - 10;

    this.sequence = new DNASeq(this.props.sequence);

    if (this.props.showEnzymes) {
      this.enzymeSites = this.sequence.calcEnzymeSites(this.props.enzymeList);
    }
    //console.log(this.enzymeSites);
    if (this.props.showAA) {
      this.aas = this.calcAAs(sequence, features);
    }

    if (this.colNum < 20) this.colNum = 20;
    if (this.props.showAA) {
      this.calcAAs(this.sequence.toString(), this.props.features);
      this.aaRows = this.splitAAs(this.colNum);
    }

    if (this.props.showEnzymes) {
      this.enzymeRows = this.splitEnzymes(this.colNum);
    }

    this.splitRows(this.colNum);
    return (
      <div
        style={Object.assign(...this.props.style, {
          width,
          height,
          overflowY: 'scroll',
        })}
        onScroll={this.onScroll}
      >
        {this.textRows}
      </div>
    );
  }

}
