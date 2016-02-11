/**
 * Created by Isaac on 21/01/2016.
 */
import React from 'react';
import {SequenceEditor} from './SequenceEditor';
import {onionFile} from './OnionFile';
import {PlasmidViewer} from './PlasmidViewer/PlasmidViewer';
import {InfoBar} from './InfoBar';
import {Enzyme, loadEnzymeList} from './Bio/Enzyme';
import {MenuBar} from './MenuBar';

var $ = require('jquery');
window.$ = $;
global.jQuery = $;
import './css/GoogleFonts.css';

// OnionForGenomeDesigner assembles MenuBar, SequenceEditor and InfoBar together, designed for genome-designer
export class OnionForGenomeDesigner extends React.Component {
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

      menuTitle: "unknown",
      sequence: props.sequence, //DNA sequence, in ACGT
    };

    this.enzymeList = loadEnzymeList("caiLab");
  }

  componentWillMount() {
    console.warn("onion mount");
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sequence != this.props.sequence) {
      //reset state sequence
      this.state.sequence = nextProps.sequence;
      if (nextProps.blocks[0])
        this.state.menuTitle = nextProps.blocks[0].name;
    }

    this.state.blocks = nextProps.blocks;
  }

  componentWillUpdate() {

  }

  render() {
    let { width, height } = this.props;
    //set a minimum size;
    width = Math.max(width, 100);
    height = Math.max(height, 100);

    let { showEnzymes, showRS, showFeatures, showRuler, showBlockBar, showAA } = this.state;
    let sequence;
    let features;
    let blocks = this.state.blocks;

    //test load a demo file if sequence and features doesn't exist
    if (this.state && this.state.sequence) {
      sequence = this.state.sequence ? this.state.sequence : onionFile.seq;
    }

    if (this.state && this.state.features) {
      features = this.state.features ? this.state.features : onionFile.features;
      ;
    }

    if (!blocks) {
      blocks = onionFile.blocks;
    }

    //blocks = this.convertBlocks(this.state.block);
    if (!sequence) {
      sequence = onionFile.seq;
      features = onionFile.features;
    }

    //if sequence has been changed, cursor should be reset
    if (this.state && this.state.sequence
      && (this.state.cursorPos > this.state.sequence.length || this.state.startCursorPos > this.state.sequence.length)) {
      this.state.cursorPos = 0;
      this.state.startCursorPos = 0;
    }

    let selectionStart = Math.min(this.state.cursorPos, this.state.startCursorPos);
    let selectionLength = Math.abs(this.state.cursorPos - this.state.startCursorPos);
    let selectedSeq = sequence.substr(selectionStart, selectionLength);

    let menuTitle = this.state.menuTitle;

    return (
      <div
        style={{
          width:"100%",
          position:"relative",
          height:height,
          marginTop:0,
          display:"flex",
          flexDirection:"column",
        }}
      >
        <MenuBar
          title={menuTitle}
          showEnzymes={showEnzymes}
          showRS={showRS}
          showFeatures={showFeatures}
          showRuler={showRuler}
          showBlockBar={showBlockBar}
          showAA={showAA}
          onSelect={this.menuCommand.bind(this)}
        />


        <SequenceEditor
          sequence={sequence}
          showComplement={true}
          features={features}
          onSetCursor={this.onSetCursor.bind(this)}
          onSelecting={this.onSelecting.bind(this)}
          enzymeList={this.enzymeList}
          width={width}
          height={height - 30 - 86}
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
          onBlockChanged={
            (block, e)=> { this.setState({ menuTitle:block[0].name }); }
          }
        />

        <InfoBar
          width={width}
          height={30}
          startPos={selectionStart}
          endPos={selectionStart + selectionLength}
          seq={selectedSeq}
          style={{
            textAlign:"right",
            width:width,
            height:30,
            background:"#eaebf1",
            marginBottom:0,
          }}

          onChange={this.onInfoBarChange.bind(this)}
        />
      </div>
    );
  }

  //====================event response=====================

  //while user move cursor by clicking
  onSetCursor(pos) {
    this.setState({ cursorPos: pos, startCursorPos: pos });
  }

  //while user drags on editor
  onSelecting(pos1, pos2) {
    this.setState({ cursorPos: pos1, startCursorPos: pos2 });
  }

  //while user fires a menu command
  menuCommand(command, value) {
    console.log("menuCommand", command, value);
    let dict = {};
    switch (command) {
      case "showAll":
        dict.showRS = value;
        dict.showEnzymes = value;
        dict.showFeatures = value;
        dict.showRuler = value;
        dict.showAA = value;
        this.setState(dict);
        break;

      default:
        dict[command] = value;
        this.setState(dict);
        break;
    }

  }

  //while user changes the value of start and end numeric control on info bar
  onInfoBarChange(startPos, endPos) {
    this.setState({ cursorPos: endPos, startCursorPos: startPos });
  }

}
