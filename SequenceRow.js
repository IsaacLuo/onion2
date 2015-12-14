import React, { PropTypes } from 'react';
import {SequenceFeatureArrow} from './SequenceFeature'
import {SequenceFeatureSVG} from './SequenceFeature'
var complementDict = {A:'T',T:'A',C:'G',G:'C',a:'t',t:'a',c:'g',g:'c'};

export class SequenceRow extends React.Component
{
	static propTypes = {

		};
	static defaultProps = {
        sequence:"NOTHING",
        features:[],
        enzymes:[],
        fontFamily:'Lucida Console, Monaco, monospace',
        showComplement:true,
        showFeatures:true,
        showEnzymes:true,
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

	generateFeatures(){
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
				>
				</SequenceFeatureArrow>
			);
		}
		return re;
	}

	calcCursorPos(e){
		let thisDOM = this.refs.SequenceRow;
		let clickedPos = (e.pageX - thisDOM.getBoundingClientRect().left+document.documentElement.scrollLeft);
		let cursorPos = Math.round(clickedPos / this.props.unitWidth);
		return cursorPos;
	}

	onMouseDown(e) {
		let cursorPos = this.calcCursorPos(e);
		console.log(cursorPos);
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
		console.log(this,e);
	}

	shouldComponentUpdate(np,nextState){
		let a = JSON.stringify(this.props);
		let b = JSON.stringify(np)
		return a!=b;
	}

    render(){
    	let {sequence,fontFamily,showComplement,unitWidth,showCursor,cursorPos,idxStart,showSelection,selectStartPos,showStartPos} = this.props;


		let textRows = 1;
		let cols = sequence.length;
		let sequenceRowWidth = sequence.length*unitWidth;
			textRows = 2;

		let height = textRows*16+10;

		let cursorX =  cursorPos*unitWidth;
		let cursor0 = selectStartPos*unitWidth;

		let cursorLeft = Math.min(cursorX,cursor0);
		let cursorRight = Math.max(cursorX,cursor0);

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
	    	<text
	    		style={{
	    			fontFamily:fontFamily,
	    			fontSize:15,
	    			letterSpacing:0,
	    			fill:"black",
	    			alignmentBaseline:"before-edge",
	    			WebkitUserSelect:"none"
	    		}}
				x="0"
				y="5"
				onSelect={this.onSelect.bind(this)}
			>
	    		{sequence}
	    	</text>
	    	{showComplement && <text
	    		style={{fontFamily:fontFamily,
	    			fontSize:15,
	    			fill:"grey",
	    			alignmentBaseline:"before-edge",
	    			WebkitUserSelect:"none"
	    		}}
				y="20"
	    	>
	    		{this.complement(sequence)}
	    	</text>}

			{showCursor && cursorX<=sequenceRowWidth &&
				<g>
				<path
					d={`M ${cursorX} 5 L ${cursorX-5} 0 L ${cursorX+5} 0 L ${cursorX} 5 L ${cursorX} ${height}`}
					stroke="red"
					strokeWidth="1"
					fill="red"
				>
				</path>
				<text
					x={cursorX+3}
					y={height}
					fontSize="10"
					fill="red"
					style={{
						WebkitUserSelect:"none"
					}}
				>
					{cursorPos+idxStart}
				</text>
				</g>
			}
			{showStartPos && cursor0<=sequenceRowWidth &&
			<g>
				<path
					d={`M ${cursor0} 5 L ${cursor0-5} 0 L ${cursor0+5} 0 L ${cursor0} 5 L ${cursor0} ${height}`}
					stroke="red"
					strokeWidth="1"
					fill="#cc0000"
				>
				</path>
				<text
					x={cursor0+3}
					y={height}
					fontSize="10"
					fill="#cc0000"
					style={{
						WebkitUserSelect:"none"
					}}
				>
					{selectStartPos+idxStart}
				</text>
			</g>
			}
			{showSelection &&
				<rect
					x={cursorLeft}
					y={0}
					width={cursorRight-cursorLeft}
					height={height}
					fill="rgba(0,255,255,0.2)"
				>

				</rect>
			}
    	</svg>
		    <svg
			    width={sequenceRowWidth}
		        height={30}
		    >
    	        {this.generateFeatures()}
			    </svg>
    	</div>

    	)
    }
}