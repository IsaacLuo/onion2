import React from 'react';
import { StrainText } from './StrainText';
import { FeatureArrow } from './FeatureArrow';
import { Ruler } from './Ruler';
import { CDSBar } from './CDSBar';
import { CuttingSite } from './CuttingSite';
import { RestrictionSite } from './RestrictionSite';
import { compareProps } from './../reactHelper';

import jQuery from 'jquery';

const $ = jQuery;

import '../css/Onion.css';

//rows of sequence Editor
export class SequenceRow extends React.Component {
  static propTypes = {
    idxStart: React.PropTypes.number,
    rowNumber: React.PropTypes.number,
    onSetCursor: React.PropTypes.func,
    onSetCursorMoving: React.PropTypes.func,
    features: React.PropTypes.array,
    unitWidth: React.PropTypes.number,
    featureHeight: React.PropTypes.number,
    aas: React.PropTypes.array,
    sequence: React.PropTypes.string,
    onSetHighLight: React.PropTypes.func,
    blocks: React.PropTypes.array,
    enzymes: React.PropTypes.object,
    translateX: React.PropTypes.number,
    showCursor: React.PropTypes.bool,
    cursorPos: React.PropTypes.number,
    showSelection: React.PropTypes.bool,
    selectStartPos: React.PropTypes.number,
    showBlockBar: React.PropTypes.bool,
    seqMainStyle: React.PropTypes.object,
    seqCompStyle: React.PropTypes.object,
    selectLeftPos: React.PropTypes.number,
    selectRightPos: React.PropTypes.number,
    showLeftCursor: React.PropTypes.bool,
    showRightCursor: React.PropTypes.bool,
    showAA: React.PropTypes.bool,
    ruler2d: React.PropTypes.number,
    showHighLight: React.PropTypes.bool,
    highLightLeftPos: React.PropTypes.number,
    highLightRightPos: React.PropTypes.number,
    showEnzymes: React.PropTypes.bool,
    showLadder: React.PropTypes.bool,
    showRS: React.PropTypes.bool,
    showFeatures: React.PropTypes.bool,
    showRuler: React.PropTypes.bool,
    onCalculatedHeight: React.PropTypes.func,
    selectionStyle: React.PropTypes.object,
    theme: React.PropTypes.string,
    cursorStyle: React.PropTypes.object,
    uiPosToRealPos: React.PropTypes.func,

    onDoubleClickBlock: React.PropTypes.func,

  };
  static defaultProps = {
    sequence: 'NOTHING',
    features: [],
    enzymes: [],
    fontFamily: 'Cousine,Monospace',
    fontSize: 16,
    showComplement: true,
    showFeatures: true,
    showEnzymes: true,
    showRuler: true,
    showRuler2: true,
    showBlockBar: true,
    showAA: true,
    cursorStyle: { fill: '#4E77BA', stoke: '#4E77BA', strokeWidth: 2, pointerEvents:'none' },
    selectionStyle: { fill: '#EDF2F8' },
    featureHeight: 18,
    ruler2d: 10,
    translateX: 10,
  };

  constructor(props) {
    super(props);
    this.state = {
      sequenceRowWidth: 0,
    };
    this.onCDSBarSelectAA = this.onCDSBarSelectAA.bind(this);
    this.onCDSBarMouseOverAA = this.onCDSBarMouseOverAA.bind(this);
    this.onCDSBarMouseOutAA = this.onCDSBarMouseOutAA.bind(this);
    this.showEnzyme = this.showEnzyme.bind(this);
    this.hideEnzyme = this.hideEnzyme.bind(this);

    this.initCallBack();

  }

  initCallBack() {
    this.onDoubleClickBlock = (e,id) => {
      if(id != undefined && this.props.blocks && this.props.blocks[id]) {
        //console.log(id, this.props.blocks[id]);
        const block = this.props.blocks[id].originalBlock;
        this.props.onDoubleClickBlock(block,block.start,block.length);
      }
    }

    this.onMouseEnterCopyButton = (e) => {
      if (e.buttons === 0) {
        $('.onionFloatCopyButton').css('opacity', 1);
      }
    }

    this.onMouseLeaveCopyButton = () => {
      $('.onionFloatCopyButton').css('opacity', 0);
    }

    this.onClickCopyForward = (e) => {
      if(this.props.onCopyForward)
        this.props.onCopyForward();

      $('.onionFloatCopyButton').css('opacity', 0);
      e.stopPropagation();
      e.preventDefault();
    }

    this.onClickCopyReverse = (e) => {
      if(this.props.onCopyReverse)
        this.props.onCopyReverse();

      $('.onionFloatCopyButton').css('opacity', 0);
      e.stopPropagation();
      e.preventDefault();
    }


    this.onMouseDown = (e) => {
      const cursorPos = this.calcCursorPos(e);
      if(e.shiftKey) {
        this.props.onSetCursorMoving(cursorPos + this.props.idxStart, this.props.rowNumber);
      } else {
        this.props.onSetCursor(cursorPos + this.props.idxStart, this.props.rowNumber);
      }
      this.selectMode=true;
      $('body').css('-webkit-user-select', 'none');
    }

    this.onMouseMove = (e) => {
      if (e.buttons === 1 && this.selectMode) {
        const cursorPos = this.calcCursorPos(e);
        this.props.onSetCursorMoving(cursorPos + this.props.idxStart, this.props.rowNumber);
      } else {
        this.selectMode = false;
      }
    }


  }

  shouldComponentUpdate(np, nextState) {
    const update = !compareProps(this.props, np);
    return update;
  }




  onCDSBarSelectAA(obj, x, e) {
    const{ col1, row1, col0, row0 } = this.findRowCol(x);
    this.props.onSetCursorMoving(col1, row1, col0, row0);
  }

  onCDSBarMouseOverAA(obj, x, e) {
    const{ col1, row1, col0, row0 } = this.findRowCol(x);
    this.props.onSetHighLight(col1, row1, col0, row0);
  }

  onCDSBarMouseOutAA() {
    this.props.onSetHighLight(0, 0, 0, 0);
  }

  isOverlap(a1, b1, a2, b2) {
    const a3 = Math.max(a1, a2);
    const b3 = Math.min(b1, b2);
    if (a3 < b3) {
      return { start: a3, end: b3 };
    }

    return undefined;
  }

  generateFeatures(y0) {
    const { features, unitWidth, idxStart, featureHeight } = this.props;
    const re = [];
    for (let i = 0; i < features.length; i++) {
      const feature = features[i];
      re.push(
        <FeatureArrow
          start={feature.start - idxStart}
          unitWidth={unitWidth}
          len={feature.len}
          strand={feature.strand}
          color={feature.color}
          text={feature.text}
          textColor={feature.textColor}
          key={`features${i}`}
          y={y0 + this.featureRow[i] * (featureHeight + 5)}
          height={featureHeight}
          arrowStyle={feature.arrowStyle}
        />
      );
    }

    return re;
  }

  findRowCol(x) {
    const cursorPos = Math.floor(x / this.props.unitWidth);
    const col0 = cursorPos + this.props.idxStart;
    const row0 = this.props.rowNumber;
    //this.props.onSetCursor(col0,row0);
    const col1 = col0 + 3;
    let row1 = row0;
    if (col1 > this.props.sequence.length) {
      row1++;
    }

    return { row0, col0, row1, col1 };
  }

  generateAABars(y0, h0) {
    const { aas, unitWidth } = this.props;
    const re = [];

    for (let i = 0; i < aas.length; i++) {
      const aa = aas[i];
      //console.log(aa);
      let offsetX = 0;
      if (aa.leftStyle === 'right1') {
        offsetX = -unitWidth * 2;
      } else if (aa.leftStyle === 'right2') {
        offsetX = -unitWidth;
      }

      const x = (aa.start) * unitWidth + offsetX;
      re.push(
        <CDSBar
          x={x}
          y={y0}
          sequence={aa.seq}
          unitWidth={unitWidth * 3}
          height={h0}
          leftStyle={aa.leftStyle}
          rightStyle={aa.rightStyle}
          key={`AABar${i}`}
          strand={aa.strand}
          onSelectAA={this.onCDSBarSelectAA}
          onMouseOverAA={this.onCDSBarMouseOverAA}
          onMouseOutAA={this.onCDSBarMouseOutAA}
        />
      );
    }

    return re;
  }

  generateBlockBars(y0) {
    const { blocks, unitWidth } = this.props;
    const re = [];

    for (let i = 0; i < blocks.length; i++) {
      const b = blocks[i];
      const connectorOffset = b.isConnector ? 18 : 0;
      re.push(
        <FeatureArrow
          start={b.start}
          len={b.len}
          unitWidth={unitWidth}
          height={18}
          y={y0 + connectorOffset}
          color={b.isConnector ? "#C5C4C1" : b.color}
          text={b.name}
          key={i}
          blockID={i}
          onDoubleClick={this.onDoubleClickBlock}
          listName = {b.listName}
        />
      )
    }

    return re;
  }

  showEnzyme(e) {
    const id = $(e.target).data('rsid');
    $(`.enzymeSite${id}`).show();
  }

  hideEnzyme(e) {
    const id = $(e.target).data('rsid');
    $(`.enzymeSite${id}`).hide();
  }

  generateEnzymeLabels(y, h, seqY, seqH) {
    const { enzymes, unitWidth, showEnzymes } = this.props;
    if (!showEnzymes || !this.enzymeRow) return [];

    const { cs, rs } = enzymes;
    const re = [];
    for (let i = 0; i < cs.length; i++) {
      re.push(
        <CuttingSite
          y={seqY}
          h={seqH}
          s={cs[i].style}
          u={cs[i].pos[0] * unitWidth}
          d={cs[i].pos[1] * unitWidth}
          key={`cs${i}`}
          className={`enzymeSite${cs[i].id}`}
        />
      );
    }

    for (let i = 0; i < rs.length; i++) {
      re.push(
        <RestrictionSite
          x={rs[i].rs[0] * unitWidth}
          y={seqY}
          w={(rs[i].rs[1] - rs[i].rs[0]) * unitWidth}
          h={seqH}
          key={`rs${i}`}
          className={`enzymeSite${rs[i].id}`}

        />
      );
      re.push(
        <text
          x={rs[i].rs[0] * unitWidth}
          y={y - this.enzymeRow[i] * 15}
          w={(rs[i].rs[1] - rs[i].rs[0]) * unitWidth}
          h={h}
          key={`rst${i}`}
          className={`enzymeText_${rs[i].id} noselect`}
          style={{ cursor: 'default' }}
          data-rsid={rs[i].id}
          onMouseOver={this.showEnzyme}
          onMouseOut={this.hideEnzyme}
        >
          {rs[i].name}
        </text>
      );
      {//if(this.enzymeRow[i]>0){
        const xx = rs[i].rs[0] * unitWidth + unitWidth / 2;
        re.push(
          <path
            d={`M ${xx} ${y - this.enzymeRow[i] * 15} L ${xx} ${seqY} `}
            stroke="rgba(0,0,0,0.1)"
            strokeWidth={0.5}
            key={`rsb${i}`}
          />
        );
      }
    }

    return re;
  }

  generateSpanDef() {
    const { blocks } = this.props;
    const re = [];
    for (const block of blocks) {
      re.push({
        start: block.start,
        length: block.len,
        style: {
          fill: block.realLength === 0 || block.isLowFocus ? '#B7BBC2' : '#2C3543',
        },
      });
    }
    return re;
  }

  calcCursorPos(e) {
    const thisDOM = this.refs.SequenceRow;
    let clickedPos = (
      e.pageX - thisDOM.getBoundingClientRect().left
      + document.documentElement.scrollLeft);
    clickedPos -= this.props.translateX;
    let cursorPos = Math.round(clickedPos / this.props.unitWidth);
    const seqLen = this.props.sequence.length;
    if (cursorPos >= seqLen) {
      cursorPos = seqLen;
    }

    return cursorPos;
  }

  calcFeatureHeight() {
    const { features, showFeatures } = this.props;
    if (!showFeatures) {
      return 0;
    }

    if (features && features.length > 0) {
      this.sortFeatures();
      return this.featureRowCount * (this.props.featureHeight + 5);
    }

    return 0;
  }

  sortFeatures() {
    //check overlay
    const { features, showFeatures } = this.props;
    if (showFeatures && features) {
      this.featureRow = Array(features.length);
      for (let i = 0; i < features.length; i++) {
        this.featureRow[i] = 0;
      }

      this.featureRowCount = 1;
      for (let i = 0; i < features.length; i++) {
        for (let j = i + 1; j < features.length; j++) {
          if (this.isOverlap(features[i].start, features[i].start + features[i].len,
              features[j].start, features[j].start + features[j].len)) {
            this.featureRow[j] = this.featureRow[i] + 1;
            this.featureRowCount = Math.max(this.featureRowCount, this.featureRow[j] + 1);
          }
        }
      }
    }
  }

  calcEnzymeHeight() {
    const { enzymes, showEnzymes } = this.props;
    if (!showEnzymes) {
      return 0;
    }

    if (enzymes && enzymes.cs && enzymes.cs.length > 0) {
      this.sortEnzymes();
      return this.enzymeRowCount * (15);
    }

    return 0;
  }

  sortEnzymes() {
    //check overlay
    const { enzymes, showEnzymes } = this.props;
    if (showEnzymes && enzymes && enzymes.rs) {
      const rs = enzymes.rs;
      this.enzymeRow = new Array(rs.length);
      for (let i = 0; i < rs.length; i++) {
        this.enzymeRow[i] = 0;
      }

      this.enzymeRowCount = 1;
      for (let i = 0; i < rs.length; i++) {
        for (let j = i + 1; j < rs.length; j++) {
          const posi = rs[i].rs[0];
          const posj = rs[j].rs[0];
          if (this.isOverlap(
              posi, posi + rs[i].name.length + 2, posj, posj + rs[j].name.length + 2)) {
            this.enzymeRow[j] = this.enzymeRow[i] + 1;
            this.enzymeRowCount = Math.max(this.enzymeRowCount, this.enzymeRow[j] + 1);
          }
        }
      }
    }
  }

  calcBlockSpace() {
    const {blocks, showBlockBar} = this.props;
    if(!showBlockBar) {
      return 0;
    } else {
      for (const block of blocks) {
        if (block.isConnector) {
          return 18*2;
        }
      }
      return 18;
    }

  }

  render() {
    const {
      sequence,
      unitWidth,
      showCursor,
      cursorPos,
      idxStart,
      showSelection,
      showBlockBar,
      seqMainStyle,
      seqCompStyle,
      selectLeftPos,
      selectRightPos,
      showLeftCursor,
      showRightCursor,
      showAA,
      ruler2d,
      showHighLight,
      highLightLeftPos,
      highLightRightPos,
      showEnzymes,
      showLadder,
      showRS,
      showFeatures,
      showRuler,
      cursorStyle,
      selectSpanNumbers,
      } = this.props;

    const sequenceRowWidth = sequence.length * unitWidth;

    const unitHeight = 13.5;

    const cursorX = cursorPos * unitWidth;

    const cursorLeft = selectLeftPos * unitWidth;
    const cursorRight = selectRightPos * unitWidth;

    let showRightCursorText = true;
    if (selectRightPos - selectLeftPos < 4) {
      showRightCursorText = false;
    }

    //calculate element Y poses
    const calcElementY = () => {
      const re = {};
      let y = 0;
      const { blocks } = this.props;

      if (showEnzymes) {
        re.enzymeH = this.calcEnzymeHeight();
        y += re.enzymeH;
        re.enzymeY = y;
      }

      y += 5;
      re.selectionY = y;
      y += 5;
      re.seqY = y;
      re.seqBlockY = y;
      y += unitHeight;
      re.seqH = unitHeight;
      if (showLadder) {
        re.rulerY = y;
        y += 15;
        re.rulerH = 15;
      }

      if (showRS) {
        re.compY = y;
        y += unitHeight;
        re.compH = unitHeight;
      }

      re.seqBlockH = y - re.seqBlockY + 2;
      y += 5;
      if (showBlockBar) {
        re.blockBarY = y;
        y += this.calcBlockSpace();
        re.blockBarH = y;
        y += 5;
      }

      if (showAA && this.props.aas && this.props.aas.length > 0) {
        re.aaY = y;
        re.aaH = 18;
        y += 23;
      }

      if (showFeatures) {
        re.featureY = y;
        re.featureH = this.calcFeatureHeight();
        y += re.featureH;
        y += 10;
      }

      re.selectionYB = y;
      re.selectionH = y - re.selectionY;
      if (showRuler) {
        re.ruler2Y = y;
        re.ruler2H = 10;
        y += 15;
        y += 15;
      }

      re.totalH = y;
      this.props.onCalculatedHeight(this.props.rowNumber, re.totalH);
      return re;
    };

    const ep = calcElementY();

    const divStyle = this.props.theme === 'nowrap' ? {
      display: 'inline-block',
      whiteSpace: 'nowrap',
    } : {
      marginLeft: 15,
      marginBottom: 5,
    };

    //console.log("CDSrender",showAA,this.props.aas);
    return (
      <div
        style={divStyle}
        ref="SequenceRow"
      >

        <svg
          width={sequenceRowWidth + 50}
          height={ep.totalH}
          style={{
      //display:"block",
          }}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onMouseMove}
        >
          <g
            id="mainArea"
            transform="translate(10,0)"
          >
            {showSelection &&
            <rect
              x={cursorLeft}
              y={ep.selectionY}
              width={cursorRight - cursorLeft}
              height={ep.selectionH}
              style={this.props.selectionStyle}
              key="rectSelection"
            />
            }

            {showHighLight &&
            <rect
              x={highLightLeftPos * unitWidth}
              y={ep.seqBlockY}
              width={(highLightRightPos - highLightLeftPos) * unitWidth}
              height={ep.seqBlockH}
              fill="#EDF2F8"
              key="rectHighLight"
            />
            }

            <StrainText
              showRS={showRS}
              showLadder={showLadder}
              ep={ep}
              sequenceRowWidth={sequenceRowWidth}
              seqMainStyle={seqMainStyle}
              seqCompStyle={seqCompStyle}
              sequence={sequence}
              unitWidth={unitWidth}
              spanDef={this.generateSpanDef()}
            />

            {showAA &&
            this.generateAABars(ep.aaY, ep.aaH)
            }

            {showFeatures &&
            this.generateFeatures(ep.featureY)
            }

            {showBlockBar &&
            this.generateBlockBars(ep.blockBarY)
            }
            {showEnzymes &&
            this.generateEnzymeLabels(ep.enzymeY, ep.enzymeH, ep.seqBlockY, ep.seqBlockH)
            }


            {showCursor && cursorX <= sequenceRowWidth &&
            <g>
              <path
                d={`M ${cursorX} ${ep.selectionY} L ${cursorX} ${ep.selectionYB}`}
                style={cursorStyle}
              >
              </path>
            </g>
            }
            {showLeftCursor &&
            <g>
              <path
                d={`M ${cursorLeft} ${ep.selectionY} L ${cursorLeft} ${ep.selectionYB}`}
                style={cursorStyle}
              >
              </path>
              <text
                x={cursorLeft + unitWidth / 2}
                y={ep.selectionYB}
                style={{
                  WebkitUserSelect: 'none',
                  fontSize: 13,
                  alignmentBaseline: 'before-edge',
                  textAnchor: 'middle',
                  fill: cursorStyle.fill,
                }}
              >

                {selectSpanNumbers[0] + 1}
              </text>
            </g>
            }
            {showRightCursor &&
            <g>
              <path
                d={`M ${cursorRight} ${ep.selectionY} L ${cursorRight} ${ep.selectionYB}`}
                style={cursorStyle}
              >
              </path>
              {showRightCursorText &&
              <text
                x={cursorRight - unitWidth / 2}
                y={ep.selectionYB}
                style={{
                  WebkitUserSelect: 'none',
                  fontSize: 13,
                  alignmentBaseline: 'before-edge',
                  textAnchor: 'middle',
                  fill: cursorStyle.fill,
                }}
              >
                {selectSpanNumbers[1]}
              </text>
              }

              <g style={{opacity:0}}
                 onMouseEnter={this.onMouseEnterCopyButton}
                 onMouseLeave = {this.onMouseLeaveCopyButton}
                 className="onionFloatCopyButton"
              >
                <g transform={`translate(${cursorRight + 5}, ${ep.selectionYB-30-29})`}
                  onMouseDown={this.onClickCopyForward}
                   style={{cursor:"pointer"}}
                >
                  <rect x="-2" y="-2" width="27" height="27" fill="white" stroke="black" strokeWidth="1"/>
                  <g transform="scale(0.05)">
                    <path d="M314.3,85.4h-227c-21.3,0-38.6,17.3-38.6,38.6v325.7c0,21.3,17.3,38.6,38.6,38.6h227c21.3,0,38.6-17.3,38.6-38.6V124
			C352.8,102.7,335.5,85.4,314.3,85.4z M325.8,449.6c0,6.4-5.2,11.6-11.6,11.6h-227c-6.4,0-11.6-5.2-11.6-11.6V124
			c0-6.4,5.2-11.6,11.6-11.6h227c6.4,0,11.6,5.2,11.6,11.6V449.6z"/>
                    <path d="M401,0H174c-21.3,0-38.6,17.3-38.6,38.6c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5c0-6.4,5.2-11.6,11.6-11.6h227
			c6.4,0,11.6,5.2,11.6,11.6v325.7c0,6.4-5.2,11.6-11.6,11.6c-7.5,0-13.5,6-13.5,13.5s6,13.5,13.5,13.5c21.3,0,38.6-17.3,38.6-38.6
			V38.6C439.6,17.3,422.4,0,401,0z"/>
                    <line x1="118" y1="201.5" x2="264.7" y2="201.5" stroke="black" strokeWidth="20"/>
                    <polygon points="224.9,235.4 258.8,201.5 224.9,167.5 253.6,167.5 287.5,201.5 253.6,235.4 			"/>
                  </g>
                </g>

                <g transform={`translate(${cursorRight + 5}, ${ep.selectionYB-30})`}
                   onMouseDown={this.onClickCopyReverse}
                   style={{cursor:"pointer"}}
                >
                  <rect x="-2" y="-2" width="27" height="27" fill="white" stroke="black" strokeWidth="1"/>
                  <g transform="scale(0.05)">
                    <path d="M314.3,85.4h-227c-21.3,0-38.6,17.3-38.6,38.6v325.7c0,21.3,17.3,38.6,38.6,38.6h227c21.3,0,38.6-17.3,38.6-38.6V124
			C352.8,102.7,335.5,85.4,314.3,85.4z M325.8,449.6c0,6.4-5.2,11.6-11.6,11.6h-227c-6.4,0-11.6-5.2-11.6-11.6V124
			c0-6.4,5.2-11.6,11.6-11.6h227c6.4,0,11.6,5.2,11.6,11.6V449.6z"/>
                    <path d="M401,0H174c-21.3,0-38.6,17.3-38.6,38.6c0,7.5,6,13.5,13.5,13.5s13.5-6,13.5-13.5c0-6.4,5.2-11.6,11.6-11.6h227
			c6.4,0,11.6,5.2,11.6,11.6v325.7c0,6.4-5.2,11.6-11.6,11.6c-7.5,0-13.5,6-13.5,13.5s6,13.5,13.5,13.5c21.3,0,38.6-17.3,38.6-38.6
			V38.6C439.6,17.3,422.4,0,401,0z"/>
                    <line x1="288.5" y1="340.5" x2="141.9" y2="340.5" stroke="black" strokeWidth="20"/>
                    <polygon points="181.7,306.5 147.8,340.5 181.7,374.4 152.9,374.4 119,340.5 152.9,306.5 			"/>
                  </g>
                </g>
              </g>

            </g>

            }

            {showRuler &&
            <Ruler
              x={0}
              y={ep.ruler2Y}
              width={sequenceRowWidth}
              height={ep.ruler2H}
              d={ruler2d}
              unitWidth={unitWidth}
              texts={(() => {
                const re = [];
                for (let i = idxStart; i < idxStart + sequence.length; i += ruler2d) {
                  re.push(this.props.uiPosToRealPos(i));
                }

                return re;
              }
              )()}
            />
            }


          </g>

        </svg>

      </div>

    );
  }
}
