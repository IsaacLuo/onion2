import React, { PropTypes } from 'react';
import {SequenceFeatureArrow} from './SequenceFeature'
import {SequenceFeatureSVG} from './SequenceFeature'
import {RulerLocation} from './RulerLocation'
var complementDict = {A:'T',T:'A',C:'G',G:'C',a:'t',t:'a',c:'g',g:'c'};

export class SequenceRow extends React.Component
{
	static propTypes = {

		};
	static defaultProps = {
        sequence:"NOTHING",
        features:[],
        enzymes:[],
        fontFamily:'Cousine,Monospace',
		fontSize:16,
        showComplement:true,
        showFeatures:true,
        showEnzymes:true,
		showRuler:true,
		showRuler2:true,
		cursorColor:"#4E77BA",
		selectionColor:"#EDF2F8",
		featureHeight:18,
		ruler2d:10,
		translateX:10,
    };

    constructor(props){
    	super(props);
		this.state = {
			sequenceRowWidth:0,
		};

    }

    complement(dna){
    	let out = [];
    	for(let n of dna){
    		out.push(complementDict[n]);
    	}
    	return out.join("");
    }

	generateFeatures(y0){
		let {features,unitWidth,idxStart} = this.props;
		let re = [];
		for(let i in features){
			let feature = features[i];
			re.push(
				<SequenceFeatureArrow
					start = {feature.start-idxStart}
					unitWidth={unitWidth}
					len = {feature.len}
					strand = {feature.strand}
					color = {feature.color}
					text = {feature.text}
					textColor = {feature.textColor}
				    key={i}
					y={y0}
				>
				</SequenceFeatureArrow>
			);
		}
		return re;
	}

	calcCursorPos(e){
		let thisDOM = this.refs.SequenceRow;
		let clickedPos = (e.pageX - thisDOM.getBoundingClientRect().left+document.documentElement.scrollLeft);
		clickedPos-=this.props.translateX;
		let cursorPos = Math.round(clickedPos / this.props.unitWidth);
		let seqLen = this.props.sequence.length;
		if(cursorPos>=seqLen){
			cursorPos = seqLen;
		}
		return cursorPos;
	}

	onMouseDown(e) {
		let cursorPos = this.calcCursorPos(e);
		//console.log(cursorPos);
		//this.setState(cursorPos)
		this.props.onSetCursor(cursorPos + this.props.idxStart, this.props.rowNumber);
	}
	onMouseMove(e){
		//if(this.mouseDownFlag){
		if(e.buttons==1) {
			let cursorPos = this.calcCursorPos(e);
			this.props.onSetCursorMoving(cursorPos + this.props.idxStart, this.props.rowNumber);
		}
		//}
	}

	onSelect(e){
		//console.log(this,e);
	}

	shouldComponentUpdate(np,nextState){
		let a = JSON.stringify(this.props);
		let b = JSON.stringify(np)
		return a!=b;
	}
	generateRuler(x,y,w,h,unitWidth){
		let my = y+h/2;
		let re = `M ${x} ${my} L ${x+w} ${my}`;
		for(let xx=x+unitWidth/2;xx<x+w;xx+=unitWidth) {
			re += `M ${xx} ${y+4} L ${xx} ${y+h-4}`;
		}
		return re;
	}

	calcFeatureHeight(){
		let {
			features,
			showFeatures,
			} = this.props;
		if(!showFeatures){
			return 0;
		}
		if(features.length>0) {
			return this.props.featureHeight;
		}
		return 0;
	}


    render(){
    	let {sequence,
			showComplement,
			unitWidth,
			showCursor,
			cursorPos,
			idxStart,
			showSelection,
			selectStartPos,
			showStartPos,
			seqMainStyle,
			seqCompStyle,
			showRuler,
			showRuler2,
			cursorColor,
			selectLeftPos,
			selectRightPos,
			showLeftCursor,
			showRightCursor,
			ruler2d,
			enzymes,
			} = this.props;

		//console.log("enzyme count", enzymes.length);

		let textRows = 1;
		let cols = sequence.length;
		let sequenceRowWidth = sequence.length*unitWidth;
			textRows = 2;

		let unitHeight = 13.5;
		let height = textRows*16+15+15;

		let cursorX =  cursorPos*unitWidth;
		let cursor0 = selectStartPos*unitWidth;

		let cursorLeft = selectLeftPos*unitWidth;
		let cursorRight = selectRightPos*unitWidth;

		let showRightCursorText = true;
		if(selectRightPos-selectLeftPos<4){
			showRightCursorText = false;
		}

		let elementPoses = ()=>{
			let re = {};
			let y = 0;
			re.selectionY = y;
			y+=5;
			re.seqY = 5;
			y+=unitHeight;
			re.seqH = unitHeight;
			re.rulerY = y;
			y+=15;
			re.rulerH = 15;
			re.compY = y;
			y+=unitHeight;
			re.compH = unitHeight;
			y+=5;
			re.featureY = y;
			re.featureH = this.calcFeatureHeight();
			y+=re.featureH;
			y+=10;
			re.selectionH = y;

			re.ruler2Y = y;
			re.ruler2H = 10;
			y+=10;


			y+=20;
			re.totalH = y;
			return re;
		}();

		let ep = elementPoses;

		height = ep.totalH;

    	return(
    	<div
    		style={{
    			marginLeft:15,
    			marginBottom:15
    		}}
			ref="SequenceRow"
    	>
    	<svg
			width={sequenceRowWidth+50}
			height={height}
			style={{
				display:"block"
				}}
			onMouseDown={this.onMouseDown.bind(this)}
			onMouseMove={this.onMouseMove.bind(this)}
    	>
			<g
				id="mainArea"
				transform="translate(10,0)"
			>
			{showSelection &&
			<rect
				x={cursorLeft}
				y={0}
				width={cursorRight-cursorLeft}
				height={ep.selectionH}
				fill={this.props.selectionColor}
			>
			</rect>
			}

	    	<text
	    		style={
	    			Object.assign(seqMainStyle,{

	    		})}
				x="0"
				y={ep.seqY}
				onSelect={this.onSelect.bind(this)}
			>
	    		{sequence}
	    	</text>
	    	{showComplement && <text
	    		style={
	    			Object.assign(seqCompStyle,{
	    		})}
				x="0"
				y={ep.compY}
	    	>
	    		{this.complement(sequence)}
	    	</text>}

			{showRuler && <path
				d={this.generateRuler(0,ep.rulerY,sequenceRowWidth,ep.rulerH,unitWidth)}
				strokeWidth="1"
				stroke="#E6E7E8"
			>
			</path>
			}

			{this.generateFeatures(ep.featureY)}

			{showCursor && cursorX<=sequenceRowWidth &&
				<g>
				<path
					d={`M ${cursorX} 5 L ${cursorX-1} 0 L ${cursorX+1} 0 L ${cursorX} 5 L ${cursorX} ${ep.selectionH}`}
					stroke={this.props.cursorColor}
					strokeWidth="2"
					fill={this.props.cursorColor}
				>
				</path>
				</g>
			}
			{showLeftCursor  &&
			<g>
				<path
					d={`M ${cursorLeft} 5 L ${cursorLeft-1} 0 L ${cursorLeft+1} 0 L ${cursorLeft} 5 L ${cursorLeft} ${ep.selectionH}`}
					stroke={this.props.cursorColor}
					strokeWidth="2"
					fill={this.props.cursorColor}
				>
				</path>
				<text
					x={cursorLeft+unitWidth/2}
					y={ep.selectionH}
					fill={this.props.cursorColor}
					style={{
						WebkitUserSelect:"none",
						fontSize:13,
						alignmentBaseline:"before-edge",
						textAnchor:"middle",
					}}
				>
					{selectLeftPos + idxStart + 1}
				</text>
			</g>
			}
			{showRightCursor &&
			<g>
				<path
					d={`M ${cursorRight} 5 L ${cursorRight-1} 0 L ${cursorRight+1} 0 L ${cursorRight} 5 L ${cursorRight} ${ep.selectionH}`}
					stroke={this.props.cursorColor}
					strokeWidth="2"
					fill={this.props.cursorColor}
				>
				</path>
				{showRightCursorText &&
				<text
					x={cursorRight-unitWidth/2}
					y={ep.selectionH}

					fill={this.props.cursorColor}
					style={{
						WebkitUserSelect:"none",
						fontSize:13,
						alignmentBaseline:"before-edge",
						textAnchor:"middle",

					}}
				>
					{selectRightPos + idxStart}
				</text>
				}
			</g>
			}
			{showRuler2 &&
				<RulerLocation
					x={0}
					y = {ep.ruler2Y}
					width = {sequenceRowWidth}
					height = {ep.ruler2H}
					d = {ruler2d}
					unitWidth={unitWidth}
					texts = {(()=>{
						let re = [];
						for(let i=idxStart;i<idxStart+sequence.length;i+=ruler2d){
							re.push(i);
						}
						return re;
						}
					())}
				>
				</RulerLocation>
			}
		</g>


    	</svg>
    	</div>

    	)
    }
}