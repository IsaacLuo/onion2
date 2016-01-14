import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {SequenceRow} from './SequenceRow'
import jQuery from 'jquery';
import {DNASeq} from './Bio/DNASeq'


//one of main components of onion, sequence editor
export class SequenceEditor extends React.Component
{
	static propTypes = {
		sequence:React.PropTypes.string,
		theme:React.PropTypes.string,
		width:React.PropTypes.number,
		height:React.PropTypes.number,
		font:React.PropTypes.string,
		fontSize:React.PropTypes.number
		};
	static defaultProps = {
        sequence:"NOTHING",
		theme:"nowrap1",
		showBlockBar:true,
    };

    constructor(props){
    	super(props)
    	this.textRows = [];
		this.mycss = {
			seqFontFamily : 'Cousine,Monospace',
			seqFontSize : 16,
			seqFontUnitWidth:10,//9.609375,
		}
		this.seqMainStyleStr = `display:inline-block;font-family:${this.mycss.seqFontFamily};font-size:${this.mycss.seqFontSize};color:'#2C3543';letterSpacing:0;position:absolute;left:0px;top:-100px`;
		this.seqMainStyle = {
		//	display: "inline-block",
			fontFamily: this.mycss.seqFontFamily,
			fontSize: this.mycss.seqFontSize,
			fill: '#2C3543',
			letterSpacing:(10-9.609375),
			alignmentBaseline:"before-edge",
			WebkitUserSelect:"none"
		}
		this.seqCompStyle = {
		//	display: "inline-block",
			fontFamily: this.mycss.seqFontFamily,
			fontSize: this.mycss.seqFontSize,
			fill: '#B7BBC2',
			letterSpacing:(10-9.609375),
			alignmentBaseline:"before-edge",
			WebkitUserSelect:"none"
		}

	    //jQuery("body").append(`<div id="bp1" style="${this.seqMainStyleStr}">AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA</div>`);
		jQuery("body").append(`<div id="bp1" style="${this.seqMainStyleStr}">A</div>`);

		//jQuery("body").append(<div id="bp1" style={this.seqMainStyle}>A</div>);
	    var width = document.getElementById('bp1').getBoundingClientRect().width;
	    //console.log("bp1Size,",jQuery("#bp1").width());
		console.log("unitWidth",width);
	    this.unitWidth = this.mycss.seqFontUnitWidth;
		this.state={
			cursorPos:0,
			selectStartPos:0,
			showCursor:false,
			showSelection:false,
		}

		this.sequence = new DNASeq(this.props.sequence);
		this.enzymeSites = this.sequence.calcEnzymeSites(this.props.enzymeList);
		//console.log(this.enzymeSites)


	}

	isOverlap(a1,b1,a2,b2){
		let a3 = Math.max(a1,a2);
		let b3 = Math.min(b1,b2);
		//console.log(a1,a2,b1,b2);
		if(a3<b3){
			return {start:a3,end:b3}
		}
		else {
			return undefined;
		}
	}

	componentWillMount(){

	}

	componentWillReceiveProps(nextProps){
		if(nextProps.sequence != this.props.sequence){
			//calculate all enzymeSites
			this.sequence = new DNASeq(this.props.sequence);
			this.enzymeSites = this.sequence.calcEnzymeSites(this.props.enzymeList);

		}
	}


	findFeaturesInRow(start,len){
		//console.log("sss",start,len,this.props.features);
		let re = [];
		for(let i in this.props.features){
			let f = this.props.features[i];
			let overlap = this.isOverlap(start,start+len,f.start,f.end)
			if(overlap){
				re.push({start:overlap.start,len:overlap.end-overlap.start,color:f.color,text:f.text,textColor:f.textColor});
			}
		}
		//console.log(re);
		return re;
	}

	onSetCursor(cursorPos,rowNumber){
		//console.log(cursorPos,rowNumber);
		this.setState({cursorPos:cursorPos,showCursor:true,selectStartPos:cursorPos,showSelection:false});
		if(this.props.onSetCursor){
			this.props.onSetCursor(cursorPos);
		}
	}
	onSelecting(cursorPos,rowNumber){
		//console.log(cursorPos,rowNumber);
		this.setState({cursorPos:cursorPos,showCursor:true,showSelection:true});
		if(this.props.onSelecting){
			this.props.onSelecting(cursorPos,this.state.selectStartPos);
		}
	}


	splitRows(colNum){
    	let sequence = this.sequence.toString();
		let {cursorPos,showCursor,selectStartPos,showSelection} = this.state;
		let {showEnzymes, showLadder, showRS, showFeatures, showRuler,showBlockBar,blocks} = this.props;

		this.textRows =[];
		let j=0;
		if(showSelection){
			if(cursorPos == selectStartPos){
				showCursor = true;
				showSelection = false;
			}
			else {
				showCursor = false;
			}
		}

		let splittedBlocks = [];
		for(let j=0;j<sequence.length;j+=colNum){
			splittedBlocks.push([]);
		}
		if(blocks) {
			for (let i = 0; i < blocks.length; i++) {
				let start = blocks[i].start;
				let len = blocks[i].len;
				let blockRowIdx = Math.floor(start / colNum);
				for (let j = blockRowIdx; j < Math.ceil((start + len) / colNum); j++) {
					let start = Math.max(blocks[i].start - j * colNum, 0);
					splittedBlocks.push({
						color: blocks[i].color,
						name: blocks[i].name,
						start: start,
						len: Math.min(blocks[i].start + blocks[i].len - j * colNum, colNum) - start,
					})
				}
			}
		}

    	for(let i=0,rowCount=0;i<sequence.length;i+=colNum,rowCount++){

			let featureFrags = this.findFeaturesInRow(i,colNum);
			let rowCursorPos,rowSelectStartPos;
			if(cursorPos>selectStartPos) {
				rowCursorPos = colNum;
				rowSelectStartPos = 0;
			}
			else{
				rowCursorPos = 0;
				rowSelectStartPos = colNum;
			}
			let rowShowStartPos = false;
			let rowShowCursor = false;
			let rowShowSelection = false;

			let rowSelectLeftPos = 0;
			let rowSelectRightPos = colNum;
			let rowShowLeftCursor = false;
			let rowShowRightCursor = false;

			let showEnzyme = true;

			if(showCursor && cursorPos>=i && cursorPos<=i+colNum) {
				rowCursorPos = cursorPos - i;
				rowShowCursor =true;
				rowShowSelection = false;
			}
			if(showSelection){
				let selectLeftPos = Math.min(selectStartPos,cursorPos);
				let selectRightPos = Math.max(selectStartPos,cursorPos);
				rowShowCursor = false;
				if(selectLeftPos>=i && selectLeftPos<=i+colNum){
					rowSelectLeftPos = selectLeftPos -i;
					rowShowLeftCursor = true;
					rowShowSelection = true;
				}
				if(selectRightPos>i && selectRightPos<=i+colNum){
					rowSelectRightPos = selectRightPos -i;
					rowShowRightCursor = true;
					rowShowSelection = true;
				}
				if(i+colNum<=selectRightPos && i>=selectLeftPos){
					console.log(i);
					rowShowSelection = true;
				}
			}

			let subSequence = sequence.substr(i,colNum);

			let rowBlocks = [];
			if(showBlockBar && blocks && blocks[0]){
					rowBlocks = [{color:blocks[0].color,name:blocks[0].name,start:0,len:subSequence.length}]
				}

			this.textRows.push(
					<SequenceRow
						sequence={subSequence}
						idxStart={i}
						key={`sequenceRow_${j}`}
						rowNumber={j}
						features={featureFrags}
						unitWidth={this.unitWidth}
						onSetCursor={this.onSetCursor.bind(this)}
						onSetCursorMoving={this.onSelecting.bind(this)}
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
						theme={this.props.theme}

						showBlockBar={true}
						blocks = {rowBlocks}
					>
					</SequenceRow>);

			j++;
    	}
    }

	render(){
		let {theme} = this.props;
		let {width} = this.props;
		this.colNum = Math.floor(width / this.unitWidth) - 10;
		console.log(this.colNum, width, this.unitWidth);
		if (this.colNum < 20)
			this.colNum = 20;
		this.splitRows(this.colNum);
		//this.splitRows(this.sequence.length());


    	return (
    		<div>
				{this.textRows}
    		</div>
    		)
    }
}