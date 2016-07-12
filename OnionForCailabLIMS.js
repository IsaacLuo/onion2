/**
 * Created by Isaac on 21/01/2016.
 */
import React from 'react';
import { SequenceEditor } from './SequenceEditor';
import { onionFile } from './OnionFile';
import { InfoBar } from './InfoBar';
import { loadEnzymeList } from './Bio/Enzyme';
import { MenuBar } from './MenuBar';
import { PlasmidViewer } from './PlasmidViewer';

import { DNASeq } from './Bio/DNASeq';

const $ = require('jquery');
window.$ = $;
global.jQuery = $;
import './css/GoogleFonts.css';

// OnionForCailabLIMS assembles MenuBar, SequenceEditor and InfoBar together,
// designed for genome-designer
export class OnionForCailabLIMS extends React.Component {
  static propTypes = {
    blocks: React.PropTypes.array,
    sequence: React.PropTypes.string,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    title: React.PropTypes.string,
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
      showBlockBar: false,
      showAA: true,

      blocks: props.blocks,   //blocks data, an array of {name,color,start,length}

      menuTitle: 'unknown',
      sequence: props.sequence, //DNA sequence, in ACGT
      features: props.features,
    };

    this.enzymeList = loadEnzymeList('caiLab');

    this.onSetCursor = this.onSetCursor.bind(this);
    this.onSelecting = this.onSelecting.bind(this);
    this.onInfoBarChange = this.onInfoBarChange.bind(this);
    this.onBlockChanged = this.onBlockChanged.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.sequence !== this.props.sequence) {
      //reset state sequence
      this.state.sequence = nextProps.sequence;
      if (nextProps.blocks[0]) this.state.menuTitle = nextProps.blocks[0].name;
    }

    this.state.blocks = nextProps.blocks;
  }

  //====================event response=====================

  //while user move cursor by clicking
  onSetCursor(pos) {
    if (!pos) {
      console.error(pos);
      debugger;
    }

    this.setState({ cursorPos: pos, startCursorPos: pos });
  }

  //while user drags on editor
  onSelecting(pos1, pos2) {
    if (!pos1 || !pos2) {
      console.error(pos1, pos2);
      debugger;
    }

    this.setState({ cursorPos: pos1, startCursorPos: pos2 });
  }

  //while user changes the value of start and end numeric control on info bar
  onInfoBarChange(startPos, endPos) {
    this.setState({ cursorPos: endPos, startCursorPos: startPos });
  }

  onBlockChanged(block, e) {
    this.setState({ menuTitle: block[0].name });
  }

  //while user fires a menu command
  menuCommand(command, value) {
    //console.log('menuCommand', command, value);
    const dict = {};
    switch (command) {
      case 'showAll':
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

  render() {
    //set a minimum size;
    const width = Math.max(this.props.width, 100);
    const height = Math.max(this.props.height, 100);

    const { title }  = this.props;
    const { showEnzymes, showRS, showFeatures, showRuler, showBlockBar, showAA } = this.state;
    let sequence;
    let features;
    let blocks = this.state.blocks;

    //test load a demo file if sequence and features doesn't exist
    if (this.state && this.state.sequence) {
      sequence = this.state.sequence ? this.state.sequence : onionFile.seq;
    }

    if (this.state && this.state.features) {
      features = this.state.features ? this.state.features : onionFile.features;
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
      && (this.state.cursorPos > this.state.sequence.length
      || this.state.startCursorPos > this.state.sequence.length)) {
      this.state.cursorPos = 0;
      this.state.startCursorPos = 0;
    }

    const selectionStart = Math.min(this.state.cursorPos, this.state.startCursorPos);
    const selectionLength = Math.abs(this.state.cursorPos - this.state.startCursorPos);
    const selectedSeq = sequence.substr(selectionStart, selectionLength);

    const menuTitle = this.state.menuTitle;

    const editorHeight = height-42;

    let sequenceEditorWidth;
    let plasmidViewerWidth;
    if(width>=1024){
      sequenceEditorWidth = width*0.618;
      plasmidViewerWidth = width-sequenceEditorWidth;
    } else {
      sequenceEditorWidth = width;
      plasmidViewerWidth = width;

    }



    let seqObj = new DNASeq(sequence)
    let enzymes = seqObj.calcEnzymeSites(this.enzymeList);

    const plasmidR = Math.min(plasmidViewerWidth/2-100,editorHeight/2-100);
    const enzymeR = plasmidR+20;

    return (
      <div className="onionPanel">
      <div
        style={{
          width,
          height,
          marginTop: 0,
        }}
      >
        <div
          style={{
            verticalAlign: "top",
          }}
        >
        <div
          style={{
            width: sequenceEditorWidth,
            verticalAlign: "top",
            display: 'inline-block',
          }}
        >

        </div>
        {(plasmidViewerWidth > 0) &&
        <div
          style={{
            width: plasmidViewerWidth,
            verticalAlign: "top",
            display: 'inline-block',
          }}>
        <PlasmidViewer
          mode="normal"
          name = { title }
          theme="default"
          seqLength={sequence.length}
          features={features}
          plasmidR={plasmidR}
          enzymeR={enzymeR}
          enzymes={enzymes}
          showViewAngle={false}
          selectedFeature={-1}
          onWheel={()=>{}}
          width={plasmidViewerWidth}
          height={editorHeight}
          cursorPos={this.state.cursorPos}
          selectionStart={selectionStart}
          selectionLength={selectionLength}
        />
          </div>
        }
          </div>
        <InfoBar
          startPos={selectionStart}
          endPos={selectionStart + selectionLength}
          seq={selectedSeq}
          style={{
            textAlign: 'right',
            width,
            height: 42,
            background: '#eaebf1',
            marginBottom: 0,
          }}
          onChange={this.onInfoBarChange}
        />

        </div>
      </div>
    );
  }
}
//<MenuBar
//  title={title}
//  showEnzymes={showEnzymes}
//  showRS={showRS}
//  showFeatures={showFeatures}
//  showRuler={showRuler}
//  showBlockBar={false}
//  showAA={showAA}
//  onSelect={this.menuCommand}
///>
//<SequenceEditor
//  sequence={sequence}
//  showComplement
//  features={features}
//  onSetCursor={this.onSetCursor}
//  onSelecting={this.onSelecting}
//  enzymeList={this.enzymeList}
//  width={sequenceEditorWidth}
//  height={editorHeight}
//  showEnzymes={showEnzymes}
//  showLadder={showRuler || !showRuler && showRS}
//  showRS={showRS}
//  showFeatures={showFeatures}
//  showRuler={showRuler}
//  showBlockBar={showBlockBar}
//  showAA={showAA}
//  blocks={blocks}
//  cursorPos={this.state.cursorPos}
//  selectStartPos={this.state.startCursorPos}
//  onBlockChanged={this.onBlockChanged}
///>