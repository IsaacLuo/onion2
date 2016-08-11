/**
 * Created by Isaac on 21/01/2016.
 */
import React from 'react';
import { InfoBar } from './../InfoBar/InfoBar';
import { loadEnzymeList } from './../Bio/Enzyme';
import { MenuBar } from './../MenuBar';
import { PositionCalculator } from './../SequenceEditor/PositionCalculator';
import { SequenceEditorFilter } from './../SequenceEditorFilter/SequenceEditorFilter';
import { themeColor } from './defaultValues';

const $ = require('jquery');
window.$ = $;
global.jQuery = $;
import './../css/GoogleFonts.css';

/**
 * OnionGD assembles MenuBar, SequenceEditor and InfoBar together,
 * designed for genetic constructor
 */
export class OnionGD extends React.Component {


  static propTypes = {
    //an array of {color,length,listName,start...}
    blocks: React.PropTypes.array,

    //sequence is just a string
    sequence: React.PropTypes.string,

    //the window dimensions
    width: React.PropTypes.number,
    height: React.PropTypes.number,

    menuTitle: React.PropTypes.string,

    //color in "#xxxxxx" format
    titleColor: React.PropTypes.string,

    //an array of {start,end,color,text...}
    features: React.PropTypes.array,

    //callback, call it when onion needs new blocks from backend.
    onQueryNewBlocks: React.PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      cursorPos: 0,           //current cursor position from 0 to sequence.length
      startCursorPos: 0,      //mouse down cursor position in selecting

      //layers switch
      showEnzymes: true,
      showLadder: false,
      showRS: false,
      showFeatures: true,
      showRuler: true,
      showBlockBar: true,
      showAA: true,

      blocks: props.blocks,   //blocks data, an array of {name,color,start,length}

      menuTitle: '',
      sequence: props.sequence, //DNA sequence, in ACGT
      features: props.features,
      titleColor: props.titleColor ? props.titleColor : themeColor.defaultTitleColor,

      focus: true,
    };

    // the enzymeList is not in use right now, but I'll keep it for a while
    this.enzymeList = loadEnzymeList('caiLab');
    this.positionCalculator = new PositionCalculator(this.state.blocks);

    this.initCallBack();

  }

  initCallBack() {
    /**
     * set the cursor pos
     * @param _pos
     */
    this.onSetCursor = (_pos) => {
      if (this.state.focus && this.state.sequence) {
        let pos = _pos;
        const sequenceLen = this.state.sequence.length;
        if (pos < 0) pos = 0;
        else if (pos > sequenceLen) pos = sequenceLen;

        this.setState({
          cursorPos: pos,
          startCursorPos: pos,
        });
      }
    }

    /**
     * call it when a hot hey is pressed
     * @param e
     */
    this.onHotKey = (e) => {
      this.onInfoBarChange = this.onInfoBarChange.bind(this);
      this.menuCommand = this.menuCommand.bind(this);

      //ctrl Key, move the focus to the onionClipboard, if C pressed then, copy
      if (e.keyCode === 17 || e.keyCode === 91) {//&& e.keyCode===67) {
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

    /**
     * set a selection zone
     * @param cursorPos: the current cursor position
     * @param startCursorPos: the "mouse down" cursor position
     */
    this.onSelect = (cursorPos, startCursorPos) => {
      if (this.state.focus) {
        if (cursorPos >= 0 && startCursorPos >= 0) {
          this.setState({
            cursorPos,
            startCursorPos,
          });
        } else {
          console.error(cursorPos, startCursorPos);
        }
      }
    }

    /**
     * while user changes the value of start and end numeric control on info bar
     * @param startPos
     * @param endPos
     */
    this.onInfoBarChange = (startPos, endPos) => {
      this.setState({
        cursorPos: endPos,
        startCursorPos: startPos,
        lastAction: 'infoBarChanged',
      });
    }

    /**
     * while user fires a menu command
     * @param command : command type to show or hide a layer.
     * @param value : true or false
     */
    this.menuCommand = (command, value) => {
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
    };
  }

  componentWillMount() {
    //set some divs which contains only one visible letter,
    //to measure the letter width real time to prevent the size
    //of letter vary in different browser
    const rulerString = ' !"#$^&\'()*+,-./0123456789:;<=>?@' +
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
    $('body').append('<div class="textRuler"></div>');

    for (const letter of rulerString) {
      $('.textRuler').append(
          `<div
              class="rulerLetter"
              data-id="${letter}"
              style="font-family: Helvetica, Arial, sans-serif;
              font-size: 12px; display: inline-block"
          >
            ${letter}
          </div>`);
    }
  }

  componentWillUnmount() {
    //remove the ruler divs when unmount
    $('.textRuler').remove();
  }


  componentDidMount() {
    // globally mousedown event responding, to set the onion Panel is focused or not.
    $(document).mousedown((e) => {
      if ($(e.target).closest('.onionPanel').length === 0) {
        if (this.state.focus !== false) this.setState({ focus: false, lastAction: 'loseFocus' });
      } else {
        if (this.state.focus !== true) this.setState({ focus: true, lastAction: 'gainFocus' });
      }
    });
    $('.onionClipboard').focus(() => {
      $('.onionClipboard').select();
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sequence !== this.props.sequence) {
      //reset state sequence
      this.state.sequence = nextProps.sequence;
    }

    this.state.blocks = nextProps.blocks;
    this.positionCalculator.blocks = this.state.blocks;
    this.state.features = nextProps.features;

    if (nextProps.menuTitle !== this.props.menuTitle) {
      this.setState({
        cursorPos: 0,
        startCursorPos: 0,
      });
    }
  }


  componentDidMount() {
    //new Clipboard('.onionCopyButton');
  }

  render() {
    //console.log("render ogd", this.props, this.state);
    //set a minimum size;
    const width = Math.max(this.props.width, 300);
    const height = Math.max(this.props.height, 100);

    const { showEnzymes, showRS, showFeatures, showRuler, showBlockBar, showAA } = this.state;
    const { titleColor } = this.props;
    let sequence;
    let features;
    let blocks = this.state.blocks;

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
    // let selectionStartReal = 0;
    // let selectionLengthReal = 0;
    // let selectedSeq = '';

    if (sequence) {
      selectionStart = Math.min(this.state.cursorPos, this.state.startCursorPos);
      selectionLength = Math.abs(this.state.cursorPos - this.state.startCursorPos);
      // if(selectionLength>0) {
      //   selectedSeq = sequence.substr(selectionStart, selectionLength);
      // } else {
      //   selectedSeq = sequence;
      //}
      // selectionStartReal = Math.min(this.state.cursorPosReal, this.state.startCursorPosReal);
      // selectionLengthReal = Math.abs(this.state.cursorPosReal - this.state.startCursorPosReal);
    }
    const menuTitle = this.props.menuTitle;

    let enableFeatures = false;
    if (features && features.length > 0) {
      enableFeatures = true;
    }

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
          tabIndex="-1"
          className = "onionClipboard"
          id = "onionClipboard"
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

        <SequenceEditorFilter
          sequence={sequence}
          showComplement
          features={features}
          onSetCursor={this.onSetCursor}
          onSelect={this.onSelect}
          enzymeList={this.enzymeList}
          width={width}
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
          focus={this.state.focus}
          onQueryNewBlocks = {this.props.onQueryNewBlocks}
        />

        <InfoBar
          width={width}
          height={30}
          startPos={selectionLength > 0 ? selectionStart : -1}
          endPos={selectionLength > 0 ? selectionStart + selectionLength : -1}
          seq={sequence}
          blocks={blocks}
          showTM={false}
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
