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
		//console.log("unitWidth",width);
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

		this.aas = this.calcAAs(this.props.sequence,this.props.features);

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

	}

	calcAAs(sequence,features){
		let s = new DNASeq(sequence);
		let re = [];
		for(let i in features){
			if(features[i].type=="CDS"){
				let f = features[i];
				let l = f.end-f.start;
				let aa = s.substr(f.start,l).toAASeq();
				re.push({seq:aa,start:f.start,len:l});
			}
		}
		return re;
	}

	findFeaturesInRow(start,len){
		//console.log("sss",start,len,this.props.features);
		let re = [];
		for(let i in this.props.features){
			let f = this.props.features[i];
			let overlap = this.isOverlap(start,start+len,f.start,f.end)
			if(overlap){
				re.push({
					start:overlap.start,
					len:overlap.end-overlap.start,
					color:f.color,
					text:f.text,
					textColor:f.textColor,
					type:f.type,
					row:0
				});
			}
		}
		//console.log(re);
		return re;
	}
	findAAInRow(start,len){
		let re = [];

		for(let i in this.aas){
			let aa = this.aas[i];
			let overlap = this.isOverlap(start,start+len,aa.start,aa.start+aa.len)
			//console.log("aas",this.aas,overlap);
			if(overlap){
				let len=overlap.end-overlap.start;
				if(len%3==0)
				len=Math.ceil(len/3);
				re.push({start:overlap.start,len:overlap.end-overlap.start,sequence:aa.seq.substr(overlap.start,overlap.end-overlap.start)});
			}
		}
		return re;
	}

	splitFeatures(colNum){

	}


	splitAAs(colNum){
		//console.log("splitAAS",this.aas);
		let aas = this.aas;
		let re = new Array(Math.ceil(this.props.sequence.length/colNum));
		for(let i=0;i<re.length;i++){
			re[i] = [];
		}
		//console.log("aas",aas);
		if(!aas) return re;

		for(let i=0;i<aas.length;i++){
			let aa = aas[i];
			let startRow = Math.floor(aa.start/colNum);
			let startIdx = aa.start%colNum;
			let endRow = Math.ceil((aa.start+aa.len)/colNum);
//			console.log("startRow",startRow,endRow,aa.start,aa.len,colNum);
			let leftStyle = "full";
			let rightStyle= "full";
			let endIdx = colNum;
			let startOffset = 0;
			let leftStyles = ["full","right1","right2"];
			let rightStyles = ["full","left1","left2"];
			let aaOffset = 0;
			let repeatAA = 0;
			let rightStyleIdx;
			let nextStartOffset;
			for(let row = startRow;row<endRow;row++){

				let leftStyleIdx = (startIdx+3-startOffset)%3;
				//console.log("startOffset",startOffset);
				if(row==startRow){
					leftStyle="left3";
				}
				else{
					leftStyle = leftStyles[leftStyleIdx];
					repeatAA = startOffset>0?-1:0;
				}
				if(row==endRow-1){
					rightStyle="right3";
				}
				else{
					rightStyleIdx = (colNum+startOffset-startIdx)%3;
					rightStyle = rightStyles[rightStyleIdx];
					nextStartOffset = (rightStyleIdx);
				}

				//let seq = calcAASeq(row,aaOffset,(endIdx-startIdx),aa);
				aaOffset+=repeatAA;
				let bpLen = endIdx-startIdx;
				let bpLenOld = -leftStyleIdx*repeatAA;
				let bpLenNew = bpLen-bpLenOld;
				let aaSubLen = Math.ceil(bpLenNew/3)+Math.ceil(bpLenOld/3);
				let seq = aa.seq.substr(aaOffset,aaSubLen).toString();
				//console.log("aaSeq",seq);

				let newAARow = {
					start:startIdx,
					end:endIdx,
					leftStyle:leftStyle,
					rightStyle:rightStyle,
					row:row,
					seq:seq,
					startOffset:startOffset,
					seqLen:seq.length,
					aaOffset:aaOffset,
					repeatAA:repeatAA,
					t_startIdx:startIdx,
					t_endIdx:endIdx,
				};
				//console.log("newAARow",newAARow);
				if(re[row]) {
					re[row].push(newAARow);
				}
				aaOffset+=aaSubLen;
				startIdx=0;
				leftStyle="full";
				rightStyle="full";
				//repeatAA = nextRepeatAA;
				startOffset = nextStartOffset;

			}
		}
		//console.log("re",re);
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
    	let sequence = this.props.sequence;
		let {cursorPos,showCursor,selectStartPos,showSelection} = this.state;
		let {showEnzymes, showLadder, showRS, showFeatures, showRuler,showBlockBar,blocks,showAA} = this.props;

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

		let splitBlocks = [];
		for(let j=0;j<sequence.length;j+=colNum){
			splitBlocks.push([]);
		}

		if(blocks) {
			for (let i = 0; i < blocks.length; i++) {
				let start = blocks[i].start;
				let len = blocks[i].length;
				let blockEnd = start+len;
				let blockRowIdx = Math.floor(start / colNum);

				for (let j = blockRowIdx; j < Math.ceil((start + len) / colNum); j++) {
					let start = Math.max(blocks[i].start - j * colNum, 0);
					let end = Math.min(blockEnd - j*colNum,colNum);
					if(splitBlocks[j]){
						splitBlocks[j].push({
						color: blocks[i].color,
						name: blocks[i].name,
						start: start,
						len: end-start,
					})

					}
				}
			}
		}


    	for(let i=0,rowCount=0;i<sequence.length;i+=colNum,rowCount++){

			let featureFrags = this.findFeaturesInRow(i,colNum);
			//let aaFrags = this.findAAInRow(i,colNum);

			let aaFrags = this.aaRows[rowCount];
			let rowCursorPos,rowSelectStartPos;
			//if(cursorPos>selectStartPos) {
				rowCursorPos = 0;
			//	rowSelectStartPos = 0;
			//}
			//else{
			//	rowCursorPos = 0;
			//	rowSelectStartPos = colNum;
			//}
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
					//console.log(i);
					rowShowSelection = true;
				}
			}

			let subSequence = sequence.substr(i,colNum);




			this.textRows.push(
					<SequenceRow
						sequence={subSequence}
						idxStart={i}
						key={`sequenceRow_${rowCount}`}
						rowNumber={rowCount}
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
						showAA={showAA}
						theme={this.props.theme}
						showBlockBar={showBlockBar}
						blocks = {splitBlocks[rowCount]}
						aas={aaFrags}
					>
					</SequenceRow>);

			j++;
    	}
    }

	componentWillMount(){

	}
	componentWillUpdate(){

	}


	render(){
		let {width,sequence,features} = this.props;
		this.colNum = Math.floor(width / this.unitWidth) - 10;

		this.sequence = new DNASeq(this.props.sequence);
		this.enzymeSites = this.sequence.calcEnzymeSites(this.props.enzymeList);
		this.aas = this.calcAAs(sequence,features);



		if (this.colNum < 20)
			this.colNum = 20;
		this.calcAAs(this.sequence.toString(),this.props.features);
		this.aaRows = this.splitAAs(this.colNum);
		this.splitRows(this.colNum);
    	return (
    		<div>
				{this.textRows}
    		</div>
    		)
    }
}