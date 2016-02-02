/**
 * Created by Isaac on 21/01/2016.
 */
import React from 'react';
import { render as reactRender } from 'react-dom';

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


/* create simple component */

export class OnionForGenomeDesigner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pvCursorPos: 0,
            pvStartCursorPos: 0,
            showEnzymes: true,
            showLadder: true,
            showRS: true,
            showFeatures: true,
            showRuler: true,
            showBlockBar: true,
            showAA: true,
            blocks: props.blocks,
            menuTitle: "unknown",
            sequence: props.sequence,
        };

        this.enzymeList = loadEnzymeList("cailab");
        //this.enzymeList = loadEnzymeList("New England Biolabs");

    }

    onSetCursor(pos) {
        this.setState({pvCursorPos: pos, pvStartCursorPos: pos});
    }

    onSelecting(pos1, pos2) {
        this.setState({pvCursorPos: pos1, pvStartCursorPos: pos2});
    }

    menuCommand(command, value) {
        console.log("menuCommand", command, value);
        let dict = {};
        switch (command) {
            case "showAll":
                dict.showRS = value;
                dict.showEnzymes = value;
                dict.showFeatures = value;
                dict.showBlockBar = value;
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

    onInfoBarChange(startPos,endPos){
        this.setState({pvCursorPos: endPos, pvStartCursorPos: startPos});
    }

    componentWillMount() {
        console.warn("onion mount")
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.sequence != this.props.sequence) {
            //reset state sequence
            this.state.sequence = nextProps.sequence;
            if(nextProps.blocks[0])
                this.state.menuTitle = nextProps.blocks[0].name;
        }
        this.state.blocks = nextProps.blocks;
    }

    componentWillUpdate() {

    }


    render() {
        let {showEnzymes, showRS, showFeatures, showRuler,showBlockBar,showAA} = this.state;
        let sequence;
        let features;
        let blocks = this.state.blocks;
        if (this.state && this.state.sequence) {
            sequence = this.state.sequence ? this.state.sequence : onionFile.seq;
        }
        if (this.state && this.state.features) {
            features = this.state.features ? this.state.features : onionFile.features;
            ;
        }

        if(!blocks){
            blocks = onionFile.blocks;
        }


        //blocks = this.convertBlocks(this.state.block);
        if (!sequence) {
            sequence = onionFile.seq;
            features = onionFile.features;
        }

        //if sequence has been changed, cursor should be reset
        if (this.state && this.state.sequence && (this.state.pvCursorPos > this.state.sequence.length || this.state.pvStartCursorPos > this.state.sequence.length)) {
            this.state.pvCursorPos = 0;
            this.state.pvStartCursorPos = 0;
        }

        let selectionStart = Math.min(this.state.pvCursorPos, this.state.pvStartCursorPos);
        let selectionLength = Math.abs(this.state.pvCursorPos - this.state.pvStartCursorPos);
        let selectedSeq = sequence.substr(selectionStart, selectionLength);


        let width = this.props.width;
        let height = this.props.height;

        let menuTitle = this.state.menuTitle;

        return (
            <div
                style={{
                	width:"100%",
                	position:"relative",
                	height:height,
                	marginTop:0,
                	display:"flex",
                	flexDirection:"column"
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
                ></MenuBar>


                <SequenceEditor
                    sequence={sequence}
                    showComplement={true}
                    features={features}
                    onSetCursor={this.onSetCursor.bind(this)}
                    onSelecting={this.onSelecting.bind(this)}
                    enzymeList={this.enzymeList}
                    width={width}
                    height={height-30-86}
                    showEnzymes={showEnzymes}
                    showLadder={showRuler || !showRuler && showRS}
                    showRS={showRS}
                    showFeatures={showFeatures}
                    showRuler={showRuler}
                    showBlockBar={showBlockBar}
                    showAA={showAA}
                    blocks={blocks}
                    cursorPos={this.state.pvCursorPos}
                    selectStartPos={this.state.pvStartCursorPos}
                    onBlockChanged={(block,e)=>{
                        this.setState({menuTitle:block[0].name});
                    }}
					style={{
						flex:1,
					}}
                ></SequenceEditor>

                <InfoBar
                    width={width}
                    height={30}
                    startPos={selectionStart}
                    endPos={selectionStart+selectionLength}
                    seq={selectedSeq}
					style={{
						textAlign:"right",
						width:width,
						height:30,
						background:"#eaebf1",
						marginBottom:0,
					}}

                    onChange = {this.onInfoBarChange.bind(this)}
                ></InfoBar>
            </div>
        );

        /*
         {false &&<div style={{
         width:400,
         height:divHeight-30,
         overflow:"hidden",
         border:"1px solid black",
         display:"inline-block",
         }}>
         <PlasmidViewer
         mode={"normal"}
         plasmidR={128}
         width={400}
         height={400}
         theme={"NAL"}
         rotateAngle={0}
         cursorPos={this.state.pvCursorPos}
         selectedFeature={-1}
         selectionStart={selectionStart}
         selectionLength={selectionLength}
         features={features}
         seqLength={sequence.length}
         enzymes={onionFile.enzymes}
         name={onionFile.name}
         showViewAngle={false}
         onWheel={()=> {}}/>


         </div>
         }
         */
    }
}
