import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {SequenceRow} from './SequenceRow'
import jQuery from 'jquery';


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
        sequence:"NOTHING"
    };

    constructor(props){
    	super(props)
    	this.textRows = [];
	    jQuery("body").append(`<div id="bp1" style="display:inline-block" font="fontFamily:'Lucida Console, Monaco, monospace'" font-size="15">A</div>`);
	    var width = document.getElementById('bp1').offsetWidth;
	    //console.log("bp1Size,",width);
	    this.unitWidth = width;
		this.state={
			cursorPos:0,
			selectStartPos:0,
			showCursor:false,
			showSelection:false
		}

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
		console.log(cursorPos,rowNumber);
		this.setState({cursorPos:cursorPos,showCursor:true,selectStartPos:cursorPos,showSelection:false});
	}
	onSelecting(cursorPos,rowNumber){
		console.log(cursorPos,rowNumber);
		this.setState({cursorPos:cursorPos,showCursor:true,showSelection:true});
	}


	splitRows(colNum=50){
    	let {sequence} = this.props;
		let {cursorPos,showCursor,selectStartPos,showSelection} = this.state;
    	this.textRows =[];
		let j=0;
    	for(let i=0;i<sequence.length;i+=colNum){
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
			if(showCursor && cursorPos>i && cursorPos<=i+colNum) {
				rowCursorPos = cursorPos - i;
				rowShowCursor =true;
				rowShowSelection = showSelection;
			}
			if(showSelection){
				if(selectStartPos>i && selectStartPos<=i+colNum){
					rowSelectStartPos = selectStartPos -i;
					rowShowStartPos = true;
					rowShowSelection = true;
				}
				if(i+colNum<=Math.max(selectStartPos,cursorPos) && i>=Math.min(selectStartPos,cursorPos)){
					rowShowSelection = true;
				}
			}
				this.textRows.push(
					<SequenceRow
						sequence={sequence.substr(i,colNum)}
						idxStart={i}
						key={`sequenceRow_${j}`}
						rowNumber={j}
						features={featureFrags}
						unitWidth={this.unitWidth}
						onSetCursor={this.onSetCursor.bind(this)}
						onSetCursorMoving={this.onSelecting.bind(this)}
						cursorPos={rowCursorPos}
						showCursor={rowShowCursor}
						selectStartPos={rowSelectStartPos}
						showSelection={rowShowSelection}
						showStartPos={rowShowStartPos}
					>
					</SequenceRow>);

			j++;
    	}
    }

	render(){
    	this.splitRows(50);
    	return (
    		<div>
				{this.textRows}
    		</div>
    		)
    }
}