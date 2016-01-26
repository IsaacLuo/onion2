import React, {PropTypes} from 'react';
import {SequenceEditor} from './SequenceEditor'
//import { propTypes } from './react-props-decorators.js'; //tnrtodo: update this once the actual npm module updates its dependencies
var Combokeys = require("combokeys");
var combokeys;

import {onionFile} from './OnionFile';

//import PlasmidViewer from './PlasmidViewer';
var PlasmidViewer = require('./PlasmidViewer/PlasmidViewer');


//for unit testing
export class OnionCommander extends React.Component {

    static defaultProps = {        
    }

    constructor(props){
        super(props);
        this.state = {
            mode:"normal", 
            theme:"default",
            rotateAngle:0,
            plasmidR:250,
            cursorPos:0,
            selectedFeature:-1,
            seqLength:onionFile.seq.length,
            features:onionFile.features,
            enzymes:onionFile.enzymes,
            plasmidName:onionFile.name
        };
    }
    componentDidMount() {
        var self = this;
        //console.log("se mount");
        //combokeys = new Combokeys(document.documentElement);
        combokeys = new Combokeys(document);
        //console.log(combokeys);
        //bindGlobalPlugin(combokeys);

        combokeys.bind(['r','ctrl+r'],(event)=>{
            if(this.state.mode=="normal"){
                console.log('r');
                this.setState({mode: "rotate"});
            }
            else if(this.state.mode=="rotate"){
                this.setState({mode: "normal"});
            }
        });
        combokeys.bind(['z','ctrl+z'],(event)=>{
            if(this.state.mode=="normal"){
                console.log('z');
                this.setState({mode: "zoom"});
            }
            else if(this.state.mode=="zoom"){
                this.setState({mode: "normal"});
            }
        });
        combokeys.bind(['f','ctrl+f'],(event)=>{
            if(this.state.mode=="normal"){
            console.log('f');
                this.setState({mode: "selectFeature"});
            }
            else if(this.state.mode=="selectFeature"){
                this.setState({mode: "normal"});
            }
        });
        combokeys.bind(['t','ctrl+t'],(event)=>{
            if(this.state.mode=="normal"){
            console.log('t');
                this.setState({mode: "changeTheme"});
            }
            else if(this.state.mode=="changeTheme"){
                this.setState({mode: "normal"});
            }
        });
        combokeys.bind(['s','ctrl+s'],(event)=>{
            if(this.state.mode=="normal"){
            console.log('s');
                this.setState({mode: "seek"});
            }
            else if(this.state.mode=="seek"){
                this.setState({mode: "normal"});
            }
        });
        combokeys.bind(['d','ctrl+d'],(event)=>{
            if(this.state.mode=="normal"){
            console.log('d');
                this.setState({mode: "select",selectionStart:this.state.cursorPos,selectionLength:0,selectionAnchorPos:this.state.cursorPos});
            }
            else if(this.state.mode=="select"){
                this.setState({mode: "normal"});
            }
        });
        combokeys.bind(['left','up'],(event)=>{
            this.onPVWheel({deltaY:-10});
            event.preventDefault();
        });
        combokeys.bind(['right','down'],(event)=>{
            this.onPVWheel({deltaY:10});
             event.preventDefault();
        });
        combokeys.bind('esc',(event)=>{
            console.log('esc');
            this.setState({mode: "normal"});
        });

    }

    readNextPlasmidViewerCmd(){
        let re = this.state.plasmidViewerCmd;
        this.state.plasmidViewerCmd = "";
        return re;
    }

    componentWillUnmount() {

        // Remove any Mousetrap bindings before unmounting.detach()
        combokeys.detach()
    }
    changeTheme(){
        let themes = ["B","C","NA","NAL","SG"];
        if(this.state.theme=="SG")
            this.setState({theme:themes[0]});
        else{
            let idx = themes.indexOf(this.state.theme);
            if(idx>=0)
                this.setState({theme:themes[idx+1]});
            else
                this.setState({theme:themes[0]});
        }
    }
    selectNextFeature(delta){
        if(this.state.selectedFeature<0){
            console.log("select feature 0");
            this.setState({selectedFeature:0});
        }
        else{
            if(delta>0){
                let nextFeature = this.state.selectedFeature+1;
            }
            else{
                let nextFeature = this.state.selectedFeature-1;
            }

            if(nextFeature>onionFile.features.length || nextFeature<0){
                nextFeature = 0;
            }
            console.log("select feature "+nextFeature);
            this.setState({selectedFeature:nextFeature});
        }
        
    }
    onPVWheel(e){
        let delta = e.deltaY;
        let {mode,seqLength} = this.state;
        switch(mode){
                case "rotate":
                    if(this.state.theme =="NAL"){
                        let newAngle = 18;
                        if(this.state.rotateAngle == 18)
                            newAngle = 198;
                        else
                            newAngle = 18;
                        console.log(newAngle);
                        this.setState({
                            rotateAngle: newAngle
                        });
                    }
                    else{
                        this.setState({
                            rotateAngle: this.state.rotateAngle + delta / 10
                        });
                    }
                    break;
                case "zoom":
                    console.log(this.state.plasmidR)
                    if (delta > 0) {
                        if (this.state.plasmidR) {
                            this.setState({
                                plasmidR: this.state.plasmidR + 10
                            });
                        }
                    } else if (delta < 0) {
                        if (this.state.plasmidR > 200) {
                            this.setState({
                                plasmidR: this.state.plasmidR - 10
                            });
                        }
                    }
            
                    break;
                case "seek":
                    let cursorPos = this.state.cursorPos;
                    cursorPos+=Math.sign(delta)*100;
                    if(cursorPos<0) cursorPos = 0;
                    //if(cursorPos>324) cursorPos = 324;
                    if(cursorPos>=seqLength) cursorPos = seqLength-1;
                    this.setState({cursorPos : cursorPos});
                
                    break;
                case "selectFeature":
                    this.selectNextFeature(delta);
                    e.preventDefault();
                    break;
                case "changeTheme":
                    this.changeTheme();
                    console.log(this.state.theme);
                    break;
                case "select":
                    {
                        let cursorPos = this.state.cursorPos;
                        cursorPos+=Math.sign(delta)*100;
                        if(cursorPos<0) cursorPos = 0;
                        if(cursorPos>=seqLength) cursorPos = seqLength-1;
                        if(cursorPos>this.state.selectionAnchorPos){
                            this.setState({cursorPos : cursorPos, selectionLength: (cursorPos - this.state.selectionStart)});
                        }
                        else{
                            this.setState({cursorPos : cursorPos, selectionStart: cursorPos, selectionLength :(this.state.selectionAnchorPos - cursorPos)});
                        }
                    }
                   
            }
    }

    render() {
        var {
            selectedSequenceString,
            displayCircular,
            displayRow,
        } = this.props;

        let readNextPlasmidViewerCmd = this.readNextPlasmidViewerCmd;

        return (
            <div>
                    <div>{this.state.mode}</div>
                      <div style={{display: 'flex', overflow: 'auto'}}>
                    
                    {false & <PlasmidViewer
                        mode={this.state.mode}
                        width={1024}
                        height={768}
                        theme={this.state.theme}
                        rotateAngle={this.state.rotateAngle}
                        plasmidR={this.state.plasmidR}
                        cursorPos={this.state.cursorPos}
                        selectedFeature={this.state.selectedFeature}
                        selectionStart={this.state.selectionStart}
                        selectionLength={this.state.selectionLength}
                        features={this.state.features}
                        seqLength={this.state.seqLength}
                        enzymes={this.state.enzymes}
                        name={this.state.plasmidName}


                        onWheel={this.onPVWheel.bind(this)}
                     ></PlasmidViewer>}
                     </div>
                     {true && <SequenceEditor
                        sequence={onionFile.seq}
                        showComplement={true}
                        features={onionFile.features}
                     >
                     </SequenceEditor>}

            </div>
            )
        ;
    }
}



module.exports = OnionCommander;
