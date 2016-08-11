import React from 'react';
import { SequenceRow } from './SequenceRow';
import 'jquery';
import { DNASeq } from '../Bio/DNASeq';
import { compareProps } from '../reactHelper';
import { PositionCalculator } from './PositionCalculator';
import { StrainText } from './StrainText';
import clipboard from 'clipboard-js';

/**
 * one of main components of onion, sequence editor
 *
 * structure
 *
 * <SequenceEditor>
 *  <SequenceRow>
 *    <RestrictionSite/>
 *    <CuttingSite/>
 *    <StrainText/>
 *    <FeatureArrow/>
 *    <CDSBar>
 *      <AminoAcidMarker/>
 *    </CDSBar>
 *    <Ruler/>
 *  </SequenceRow>
 * </SeqeunceEditor>
 */
export class SequenceEditor extends React.Component {
  static propTypes = {
    sequence: React.PropTypes.string, //dna sequence, in ACGT
    //the 'nowrap' has bug in chrome, keeping it for the future
    theme: React.PropTypes.oneOf(['normal', 'nowrap']),
    //dimensions
    width: React.PropTypes.number,
    height: React.PropTypes.number,

    // the enzyme type should be dispay in onion, currently, they are hided.
    enzymeList: React.PropTypes.array,

    // an array of {start,end,color,text...}
    features: React.PropTypes.array,

    // current cursor pos, from 0 to sequence.length
    cursorPos: React.PropTypes.number,

    // selection start cursor pos, it's the position of the mousedown
    selectStartPos: React.PropTypes.number,

    // showing layout switches
    showEnzymes: React.PropTypes.bool,
    showAA: React.PropTypes.bool,
    showLadder: React.PropTypes.bool,
    showRS: React.PropTypes.bool,
    showFeatures: React.PropTypes.bool,
    showRuler: React.PropTypes.bool,
    showBlockBar: React.PropTypes.bool,
    showCursor: React.PropTypes.bool,
    showSelection: React.PropTypes.bool,

    //show the blue selection or gray selection
    focus: React.PropTypes.bool,

    //switch, usually false, but true if in the SequenceEditorFilter
    disableScroll: React.PropTypes.bool,

    //if SequenceEditorFilter is applied, there are topRow and bottomRow
    topRow: React.PropTypes.number,
    bottomRow: React.PropTypes.number,

    // an array of {color,length,listName,start...}
    blocks: React.PropTypes.array,

    // css
    style: React.PropTypes.object,

    //call it when cursor moves to another block
    onBlockChanged: React.PropTypes.func,

    //call it when new cursor position is set
    onSetCursor: React.PropTypes.func,

    //call it when selection span is made
    onSelect: React.PropTypes.func,

    //call it when dimensions are changed.
    onRowCalculatedHeight: React.PropTypes.func,

    //call it when new block data is required (e.g. scrolling scrolling down)
    onQueryNewBlocks: React.PropTypes.func,

    //call it when scrolling the editor, however, it won't scroll if SequenceEditorFilter applied,
    //Scroll filter will take over the virtual scrolling function
    onScroll: React.PropTypes.func,

    //onSetTopRow is applied when using SequenceEditorFilter, instead onScroll
    onSetTopRow: React.PropTypes.func,
  };

  static defaultProps = {
    sequence: '',
    theme: 'normal',
    showBlockBar: true, //show block bars in genome-designer
    style: {},
    focus: true,
  };

  constructor(props) {
    super(props);
    this.textRows = [];

    // style of sequence
    this.myCSS = {
      seqFontFamily: 'Cousine,Monospace',
      seqFontSize: 12,
      seqFontUnitWidth: 7.1943, //9.609375,
    };
    //Maybe I need to render a letter first, then calculate its size, it's necessary because
    // the letter width is little difference on different browser.
    this.seqMainStyle = {
      //	display: "inline-block",
      fontFamily: this.myCSS.seqFontFamily,
      fontSize: this.myCSS.seqFontSize,
      fill: '#2C3543',
      alignmentBaseline: 'before-edge',
      WebkitUserSelect: 'none',
    };
    this.seqCompStyle = Object.assign({ ...this.seqMainStyle }, { fill: '#B7BBC2' });
    this.unitWidth = this.myCSS.seqFontUnitWidth;

    this.sequence = new DNASeq(props.sequence);
    if (props.enzymeList) {
      this.enzymeSites = this.sequence.calcEnzymeSites(props.enzymeList);
    }

    this.aas = this.calcAAs(props.sequence, props.features);

    this.state = {
      cursorPos: 0,
      selectStartPos: 0,
      showCursor: true,
      showSelection: false,
    };

    this.positionCalculator = new PositionCalculator(props.blocks);


    //initial operations
    this.initialRowPos(props.sequence, props.width);
    this.initCallBack();
    $('body').mouseup((e) => {$('body').css('-webkit-user-select', 'text')});

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sequence) {
      if (nextProps.sequence !== this.props.sequence || nextProps.width !== this.props.width) {
        this.sequence = new DNASeq(nextProps.sequence);
        this.initialRowPos(nextProps.sequence, nextProps.width);
      }
    }

    if (this.props.cursorPos !== nextProps.cursorPos
      || this.props.selectStartPos !== nextProps.selectStartPos) {
      this.setState({
        selectStartPos: nextProps.selectStartPos,
        cursorPos: nextProps.cursorPos,
        showCursor: true,
        showSelection: (nextProps.selectStartPos !== nextProps.cursorPos),
        lastEvent: 'newProp',
      });
    }

    this.positionCalculator.blocks = nextProps.blocks;
  }

  shouldComponentUpdate(np, ns) {
    const update = !compareProps(this.props, np) || !compareProps(this.state, ns);
    //return true;
    return update;
  }


  initCallBack() {
    const _this = this;

    /**
     * when the editor scrolling, but it won't work if SequenceEditorFilter is applied
     * @param e : event
     */
    this.onScroll = (e) => {
      if (this.props.onScroll) {
        this.props.onScroll(e);
      }
      if (this.props.disableScroll) {
        e.preventDefault();
      }
    };

    /**
     * when key pressed, if it's arrow key, move the cursor
     * @param e : event
     */
    this.onHotKey = (e) => {
      const { cursorPos } = this.state;
      let newPos = cursorPos;
      const currentRow = Math.floor(newPos / this.colNum);

      if (e.keyCode >= 37 && e.keyCode <= 40) {
        let offset = 0;
        switch (e.keyCode) {
          case 38: //up
            if (cursorPos > this.colNum)offset = -this.colNum;
            break;
          case 40: //down
            if (cursorPos < this.props.sequence.length - this.colNum)offset = this.colNum;
            break;
          case 37: //left
            if (cursorPos > 0) offset = -1;
            break;
          case 39: //right
            if (cursorPos < this.props.sequence.length) offset = 1;
            break;
          default:
            break;
        }
        newPos += offset;

        this.setState({ cursorPos: newPos });

        //check if it has to scroll
        const newRow = Math.floor(newPos / this.colNum);
        if (this.props.onSetTopRow && this.props.topRow != undefined) {
          const rowMove = newRow - currentRow;
          if (rowMove !== 0 && this.props.topRow + rowMove >= 0) {
            console.log(rowMove);
            this.props.onSetTopRow(this.props.topRow + rowMove);
          }
        }

      }

    }

    this.onSetCursor = (cursorPos, rowNumber) => {
      if (_this.props.focus) {
        if (_this.props.blocks) {
          //shift if in emptyBlock
          const currentBlock = this.positionCalculator.findBlockByIndex(cursorPos);
          if (currentBlock && currentBlock.realLength === 0) {
            _this.onSelect(currentBlock.start + currentBlock.length, rowNumber, currentBlock.start);
            if (_this.props.onBlockChanged) {
              _this.props.onBlockChanged([currentBlock]);
            }
            return; //prevent default
          }
        }

        this.setState({
          cursorPos,
          showCursor: true,
          selectStartPos: cursorPos,
          showSelection: false,
          lastEvent: 'setCursor',
        });
        if (_this.props.onSetCursor) {
          _this.props.onSetCursor(cursorPos);
        }

        if (_this.props.onBlockChanged) {
          const row = Math.floor(cursorPos / _this.colNum);
          const x = cursorPos % _this.colNum;
          const blocks = _this.splitBlocks[row];
          for (let i = 0; i < blocks.length; i++) {
            if (x >= blocks[i].start) {
              _this.props.onBlockChanged([blocks[i]]);
            }
          }
        }
      }
    };

    this.onSelect = (cursorPos, cursorPosStart) => {

      if (_this.props.focus) {
        if (_this.props.blocks) {
          const currentBlock = _this.findBlockByIndex(cursorPos);
          if (currentBlock && currentBlock.realLength === 0) {
            if(cursorPosStart >= 0) {
              if (cursorPosStart < cursorPos) {
                if(cursorPos > currentBlock.start + currentBlock.length / 2) {
                  cursorPos = currentBlock.start + currentBlock.length;
                } else {
                  cursorPos = currentBlock.start;
                }
              }
              else cursorPos = currentBlock.start;
            } else if (_this.state.selectStartPos < 0) {
              cursorPos = currentBlock.start + currentBlock.length;
              cursorPosStart = currentBlock.start;
            } else {
              if(cursorPos > currentBlock.start + currentBlock.length / 2) {
                cursorPos = currentBlock.start + currentBlock.length;
              } else {
                cursorPos = currentBlock.start;
              }
            }
          }
        }

        if (cursorPosStart>=0) {
          _this.setState({
            cursorPos,
            showCursor: true,
            showSelection: true,
            selectStartPos: cursorPosStart,
            lastEvent: 'onSelectWithStart',
          });
        } else {
          _this.setState({
            cursorPos,
            showCursor: true,
            showSelection: true,
            lastEvent: 'onSelectNoStart',
          });
        }

        if (_this.props.onSelect) {
          if (cursorPosStart>=0) {
            //console.log('full start', cursorPosStart, cursorPos);
            _this.props.onSelect(cursorPos, cursorPosStart, this.uiPosToRealPos(cursorPos), this.uiPosToRealPos(cursorPosStart));
          } else {
            _this.props.onSelect(cursorPos, _this.state.selectStartPos, this.uiPosToRealPos(cursorPos), this.uiPosToRealPos(cursorPosStart));
          }
        }
      }
    };

    this.onSetHighLight = (highLightStart, rowNumber, highLightEnd, rowNumberStart) => {
      if (highLightStart === highLightEnd) {
        this.setState({
          highLightStart,
          highLightEnd,
          showHighLight: false,
          lastEvent: 'onSetHighLight',
        });
      } else {
        this.setState({
          highLightStart,
          highLightEnd,
          showHighLight: true,
          lastEvent: 'onSetHighLight',
        });
      }
    };

    this.onRowCalculatedHeight = (row, height) => {
      _this.rowHeight[row] = height;
      if (row > 0) {
        _this.rowY[row] = _this.rowY[row - 1] + height;
      } else {
        _this.rowY[0] = 0;
      }

      //test if it in window, if yes, updateSequence


    };

    this.onDoubleClickBlock = (block,start,length) => {
      this.onSelect(start+length,null,start);
    }

    this.uiPosToRealPos = this.positionCalculator.uiPosToRealPos.bind(this.positionCalculator);

    this.realPosTouiPos = this.positionCalculator.realPosTouiPos(this.positionCalculator);

    this.onCopyForward = () => {
      const {cursorPos, selectStartPos} = this.state;
      const left = Math.min(cursorPos, selectStartPos);
      const right = Math.max(cursorPos, selectStartPos);
      const sub = this.props.sequence.substring(left,right)
      clipboard.copy(sub);
      console.log('copied:',sub);
    }

    this.onCopyReverse = () => {
      const {cursorPos, selectStartPos} = this.state;
      const left = Math.min(cursorPos, selectStartPos);
      const right = Math.max(cursorPos, selectStartPos);
      const sub = new DNASeq(this.props.sequence.substring(left,right)).reverseComplement().toString();
      clipboard.copy(sub);
      console.log('copied:',sub);
    }

  }

  findBlockByIndex(index) {
    const { blocks } = this.props;
    for (const block of blocks) {
      if (index >= block.start && index < block.start + block.length) {
        return block;
      }
    }
    return null;
  }
  findBlockByIndexReal(index) {
    const { blocks } = this.props;
    for (const block of blocks) {
      if (index >= block.realStart && index < block.realStart + block.realLength) {
        return block;
      }
    }
    return null;
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
    if (!this.props.features) {
      return [];
    }
    //console.log("sss",start,len,this.props.features);
    const re = [];
    for (let i = 0; i < this.props.features.length; i++) {
      const f = this.props.features[i];
      const overlap = this.isOverlap(start, start + len, f.start, f.end);
      let arrowStyle = 'none';
      if (overlap) {
        if(f.strand === '+' && f.end === overlap.end){
          arrowStyle = 'end';
        } else if (f.strand === '-' && f.start === overlap.start) {
          arrowStyle = 'end';
        } else if (f.strand === '+' || f.strand === '-') {
          arrowStyle = 'ext';
        }
        re.push({
          start: overlap.start,
          len: overlap.end - overlap.start,
          color: f.color,
          text: f.text,
          textColor: f.textColor,
          type: f.type,
          row: 0,
          strand: f.strand,
          arrowStyle,
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
      //console.warn('no enzymes');
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
      focus,
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

    StrainText.beginTranslateBps();

    if (blocks) {
      for (let i = 0; i < blocks.length; i++) {
        const start = blocks[i].start;
        const len = blocks[i].length;
        const blockEnd = start + len;
        const blockRowIdx = Math.floor(start / colNum);
        const realStart = blocks[i].realStart;
        const realLength = blocks[i].realLength;

        for (let j = blockRowIdx; j < Math.ceil((start + len) / colNum); j++) {
          const start = Math.max(blocks[i].start - j * colNum, 0);
          const end = Math.min(blockEnd - j * colNum, colNum);
          const realStart = blocks[i].realStart ? Math.max(blocks[i].realStart - j * colNum, 0) : start;
          const {realLength, isConnector, listName, isLowFocus} = blocks[i];

          if (splitBlocks[j]) {
            splitBlocks[j].push({
              color: blocks[i].color,
              name: blocks[i].name,
              start,
              len: end - start,
              realStart,
              realLength,
              originalBlock: blocks[i],
              isConnector,
              listName,
              isLowFocus,
            });
          }
        }
      }
    }

    let { topRow, bottomRow } = this.props;
    if (!topRow) topRow = 0;
    if (!bottomRow || bottomRow> Math.ceil(sequence.length/colNum)) bottomRow = Math.ceil(sequence.length/colNum);

    for (let i = topRow*colNum, rowCount = topRow; rowCount<bottomRow; i += colNum, rowCount++) {
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
      let selectLeftPos;
      let selectRightPos;
      if (showSelection) {
        selectLeftPos = Math.min(selectStartPos, cursorPos);
        selectRightPos = Math.max(selectStartPos, cursorPos);
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

      let selectionStyle;
      let cursorStyle;
      if (!focus) {
        selectionStyle = { fill: '#F2F2F2' };
        cursorStyle = { stroke: '#777777', fill: '#777777', strokeWidth: 2, pointerEvents:'none' };
      } else {
        selectionStyle = { fill: '#EDF2F8' };
        cursorStyle = { stroke: '#4E77BA', fill: '#4E77BA', strokeWidth: 2, pointerEvents:'none' };
      }

      const selectSpanNumbers = [this.uiPosToRealPos(selectLeftPos), this.uiPosToRealPos(selectRightPos)];
      if (selectSpanNumbers[0] >= selectSpanNumbers[1]) selectSpanNumbers[0] = selectSpanNumbers[1]-1;

      this.textRows.push(
        <SequenceRow
          sequence={subSequence}
          idxStart={i}
          key={`row${rowCount}`}
          rowNumber={rowCount}
          features={featureFrags}
          unitWidth={this.unitWidth}
          onSetCursor={this.onSetCursor}
          onSetCursorMoving={this.onSelect}
          onSetHighLight={this.onSetHighLight}
          cursorPos={rowCursorPos}
          showCursor={rowShowCursor}
          cursorStyle={cursorStyle}
          selectLeftPos={rowSelectLeftPos}
          selectRightPos={rowSelectRightPos}
          selectSpanNumbers={selectSpanNumbers}
          uiPosToRealPos = {this.uiPosToRealPos}
          showLeftCursor={rowShowLeftCursor}
          showRightCursor={rowShowRightCursor}
          showSelection={rowShowSelection}
          selectionStyle={selectionStyle}
          showStartPos={rowShowStartPos}
          seqMainStyle={this.seqMainStyle}
          seqCompStyle={this.seqCompStyle}
          showEnzymes={false && showEnzymes}
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
          onDoubleClickBlock={this.onDoubleClickBlock}
          onRendered={this.onRowRendered}
          onCopyForward={this.onCopyForward}
          onCopyReverse={this.onCopyReverse}
        />);

      j++;
    }
  }


  updateSequenceInWindow(){
    let { topRow, bottomRow, sequence } = this.props;

    if (!topRow) topRow = 0;
    if (!bottomRow || bottomRow> Math.ceil(sequence.length/this.colNum)) bottomRow = Math.ceil(sequence.length/this.colNum);

    let updateSet = new Set();
    for(let i = topRow; i<bottomRow; i++){
      for( let j = 0; j< this.splitBlocks[i].length; j++)
      updateSet.add(this.splitBlocks[i][j].originalBlock);
    }

    let count = updateSet.size;
    //console.log('updateSet ',count)

    const updateList = [];
    for(const block of updateSet){

      updateList.push(block);
    }
    this.props.onQueryNewBlocks(updateList);

  }

  render() {
    const { width, height, sequence, features, style } = this.props;
    // console.log('render editor', this.state);
    if (!sequence) {
      return (<div
        style={Object.assign({
          width,
          height,
          overflowY: 'hidden',
          overflowX: 'hidden',
        }, style)}
        onWheel={this.onScroll}
        className="SequenceEditor"
      >
      </div>);
    }
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
    this.updateSequenceInWindow();
    const overflowY = this.props.disableScroll ? 'hidden' : 'hidden';
    return (
      <div
        style={Object.assign({
          width,
          height,
          overflowY: {overflowY},
          overflowX: 'hidden',
          outlineWidth: 0
        },style)}
        tabIndex="0"

        onScroll={this.onScroll}
        onClick={this.onClick}
        onKeyDown={this.onHotKey}
        className="SequenceEditor"
      >
        {this.textRows}
      </div>
    );
  }

}
