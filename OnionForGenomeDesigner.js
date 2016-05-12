/**
 * Created by Isaac on 21/01/2016.
 */
import React from 'react';
import { SequenceEditor } from './SequenceEditor';
import { onionFile } from './OnionFile';
import { InfoBar } from './InfoBar';
import { loadEnzymeList } from './Bio/Enzyme';
import { MenuBar } from './MenuBar';
import {PositionCalculator} from './SequenceEditor/PositionCalculator';

const $ = require('jquery');
window.$ = $;
global.jQuery = $;
import './css/GoogleFonts.css';

// OnionForGenomeDesigner assembles MenuBar, SequenceEditor and InfoBar together,
// designed for genome-designer
export class OnionForGenomeDesigner extends React.Component {
  static propTypes = {
    blocks: React.PropTypes.array,
    sequence: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
  };
  constructor(props) {
    super(props);
    this.state = {
      cursorPos: 0,           //current cursor position from 0 to sequence.length
      startCursorPos: 0,      //mouse down cursor position in selecting

      //layers switch
      showEnzymes: true,
      showLadder: true,
      showRS: true,
      showFeatures: true,
      showRuler: true,
      showBlockBar: true,
      showAA: true,

      blocks: props.blocks,   //blocks data, an array of {name,color,start,length}

      menuTitle: '',
      sequence: props.sequence, //DNA sequence, in ACGT
      features: props.features,
      titleColor: '#000000',

      focus: true,
    };


    this.enzymeList = loadEnzymeList('caiLab');
    this.positionCalculator = new PositionCalculator(this.state.blocks);

    this.onSetCursor = this.onSetCursor.bind(this);
    this.onInfoBarChange = this.onInfoBarChange.bind(this);
    this.onBlockChanged = this.onBlockChanged.bind(this);
    this.menuCommand = this.menuCommand.bind(this);
    this.initCallBack();

  }

  initCallBack() {
    this.onHotKey = (e) => {
      if(e.keyCode===17 || e.keyCode === 91) {//&& e.keyCode===67) {
        // console.log('hotkey', e);
        const pos1 = this.state.cursorPos;
        const pos2 = this.state.startCursorPos;
        // console.log(pos1,pos2);
        if (pos1 !== pos2 && pos1 >= 0 && pos2 >= 0) {
          let selectedStr = this.state.sequence.substring(pos1, pos2);
          $('.onionClipboard').val(selectedStr.replace(/X/g, ''));
          $('.onionClipboard').focus();
        }
      }
    };

    this.onHotKeyClipboard = (e) => {
      if(e.ctrlKey && e.keyCode===67) {
        // console.log('copy',e.target.value);
      }
    };

    this.onSelect = (pos1, pos2) => {
      if (this.state.focus) {
        if (pos1 >= 0 && pos2 >= 0) {
          this.setState({
            cursorPos: pos1,
            startCursorPos: pos2,
          });
        } else {
          console.error(pos1, pos2);
        }
      }
    }
  }

  componentDidMount() {
    // console.log('OnionForGenomeDesigner mount');
    $(document).click((e) => {
      if ($(e.target).closest('.onionPanel').length === 0) {
        if (this.state.focus !== false) this.setState({ focus: false, lastAction: 'loseFocus' });
      } else {
        if (this.state.focus !== true) this.setState({ focus: true, lastAction: 'gainFocus' });
      }
    });
    $('.onionClipboard').focus(()=>{

      $('.onionClipboard').select();
    });
    //$(document).keypress(this.onHotKey);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sequence !== this.props.sequence) {
      //reset state sequence
      this.state.sequence = nextProps.sequence;
      if (nextProps.blocks && nextProps.blocks[0]) this.state.menuTitle = nextProps.blocks[0].name;
      else if (this.state.sequence) this.state.menuTitle = 'unknown';
      else this.state.menuTitle = ' ';
      this.state.features = [];
    }

    this.state.blocks = nextProps.blocks;
    this.positionCalculator.blocks = this.state.blocks;
    this.state.features = nextProps.features;

    let block = this.positionCalculator.findBlockByIndex(0);
    let titleColor = block ? block.color : "#000000";

    this.setState({
      cursorPos: 0,
      startCursorPos: 0,
      titleColor,
    });
  }

  //====================event response=====================

  //while user move cursor by clicking
  onSetCursor(_pos) {
    if (this.state.focus && this.state.sequence) {
      let pos = _pos;
      const sequenceLen = this.state.sequence.length;
      if (pos < 0) pos = 0;
      else if (pos > sequenceLen) pos = sequenceLen;

      //get new block Color
      let block = this.positionCalculator.findBlockByIndex(pos);
      let titleColor = block ? block.color : "#000000";


      this.setState({
        cursorPos: pos,
        startCursorPos: pos,
        titleColor,
      });
    }
  }

  //while user drags on editor


  //while user changes the value of start and end numeric control on info bar
  onInfoBarChange(startPos, endPos) {
    //const cursorPos = this.positionCalculator.realPosTouiPos(endPos);
    //const startCursorPos = this.positionCalculator.realPosTouiPos(startPos);
    let block = this.positionCalculator.findBlockByIndex(startPos);
    let titleColor = block ? block.color : "#000000";
    this.setState({
      cursorPos : endPos,
      startCursorPos : startPos,
      lastAction: 'infoBarChanged',
      titleColor,
    });
  }

  onBlockChanged(block, e) {
    this.setState({ menuTitle: block[0].name, lastAction: 'blockChanged' });
  }

  //while user fires a menu command
  menuCommand(command, value) {
    // console.log('menuCommand', command, value);
    const dict = {};
    switch (command) {
      case 'showAll':
        dict.showRS = value;
        dict.showEnzymes = value;
        dict.showFeatures = value;
        dict.showRuler = value;
        dict.showAA = value;
        dict.lastAction = 'showAll';
        this.setState(dict);
        break;

      default:
        dict[command] = value;
        dict.lastAction = command;
        this.setState(dict);
        break;
    }
  }

  render() {
    // console.log("render ogd");
    //set a minimum size;
    const width = Math.max(this.props.width, 300);
    const height = Math.max(this.props.height, 100);

    const { showEnzymes, showRS, showFeatures, showRuler, showBlockBar, showAA, titleColor } = this.state;
    let sequence;
    let features;
    let blocks = this.state.blocks;

    // //test load a demo file if sequence and features doesn't exist
    // if (this.state && this.state.sequence) {
    //   sequence = this.state.sequence ? this.state.sequence : onionFile.seq;
    // }
    //
    // if (this.state && this.state.features) {
    //   features = this.state.features ? this.state.features : onionFile.features;
    // }
    //
    // if (!blocks) {
    //   blocks = onionFile.blocks;
    // }
    //
    // //blocks = this.convertBlocks(this.state.block);
    // if (!sequence) {
    //   sequence = onionFile.seq;
    //   features = onionFile.features;
    // }

    sequence = this.state.sequence;
    features = this.state.features;

    //if sequence has been changed, cursor should be reset
    if (this.state && this.state.sequence
      && (this.state.cursorPos > this.state.sequence.length
      || this.state.startCursorPos > this.state.sequence.length)) {
      this.state.cursorPos = 0;
      this.state.startCursorPos = 0;
    }

    let selectionStart = 0;
    let selectionLength = 0;
    let selectionStartReal = 0;
    let selectionLengthReal = 0;
    let selectedSeq = '';

    if (sequence) {
      selectionStart = Math.min(this.state.cursorPos, this.state.startCursorPos);
      selectionLength = Math.abs(this.state.cursorPos - this.state.startCursorPos);
      selectedSeq = sequence.substr(selectionStart, selectionLength);
      selectionStartReal = Math.min(this.state.cursorPosReal, this.state.startCursorPosReal);
      selectionLengthReal = Math.abs(this.state.cursorPosReal - this.state.startCursorPosReal);

    }

    const menuTitle = this.state.menuTitle;

    let enableFeatures = false;
    if (features && features.length > 0)
      enableFeatures = true;

    //console.log(this.state);

    return (
      <div
        style={{
          width,
          position: 'relative',
          height,
          marginTop: 0,
        }}
        className="noselect onionPanel"
        id="onionPanel"
        tabIndex="0"
        onKeyDown={this.onHotKey}
      >
        <input
          style={{
            position: 'absolute',
            left: '-1000',
            top: '-1000',
          }}
          className = 'onionClipboard'
          onKeyDown={this.onHotKeyClipboard}
        />
        
        <MenuBar
          title={menuTitle}
          showEnzymes={showEnzymes}
          showRS={showRS}
          showFeatures={enableFeatures && showFeatures}
          showRuler={showRuler}
          showBlockBar={showBlockBar}
          showAA={enableFeatures && showAA}
          enableFeatures={enableFeatures}
          onSelect={this.menuCommand}
          titleColor={titleColor}
        />


        <SequenceEditor
          sequence={sequence}
          showComplement
          features={features}
          onSetCursor={this.onSetCursor}
          onSelect={this.onSelect}
          enzymeList={this.enzymeList}
          width={width}
          //height={height - 30 - 86}
          height={height - 30 - 64}
          showEnzymes={showEnzymes}
          showLadder={showRuler || !showRuler && showRS}
          showRS={showRS}
          showFeatures={showFeatures}
          showRuler={showRuler}
          showBlockBar={showBlockBar}
          showAA={showAA}
          blocks={blocks}
          cursorPos={this.state.cursorPos}
          selectStartPos={this.state.startCursorPos}
          onBlockChanged={this.onBlockChanged}
          focus={this.state.focus}
        />

        <InfoBar
          width={width}
          height={30}
          startPos={selectionLength > 0 ? selectionStart : -1}
          endPos={selectionLength > 0 ? selectionStart + selectionLength : -1}
          seq={selectedSeq}
          blocks={blocks}
          style={{
            textAlign: 'right',
            width,
            height: 30,
            background: '#eaebf1',
            fontSize: 12,
            fontFamily: 'Helvetica, Arial, sans-serif',
            marginBottom: 0,
            lineHeight: '12px',
            verticalAlign: 'top',
          }}

          onChange={this.onInfoBarChange}
        />
      </div>
    );
  }
}
