import React, { PropTypes } from 'react';
import {StrainText} from './StrainText'
import {SequenceFeatureArrow} from './SequenceFeature'
import {SequenceFeatureSVG} from './SequenceFeature'
import {RulerLocation} from './RulerLocation'
import {CDSBar} from './CDSBar'
import {compareProps,comparePropsDebug} from './reactHelper'

let isOverlap = function(a1,b1,a2,b2){
	let a3 = Math.max(a1,a2);
	let b3 = Math.min(b1,b2);
	if(a3<b3){
		return {start:a3,end:b3}
	}
	else {
		return undefined;
	}
}

//rows of sequence Editor
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
		showBlockBar:true,
		showAA:true,
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

	generateFeatures(y0){
		let {features,unitWidth,idxStart,featureHeight} = this.props;
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
					y={y0+this.featureRow[i]*(featureHeight+5)}
					height={featureHeight}
				>
				</SequenceFeatureArrow>
			);
		}
		return re;
	}
	generateAABars(y0,h0){
		let {aas,unitWidth,idxStart} = this.props;
		let re = [];

		for(let i in aas){
			let aa = aas[i];
			//console.log(aa);
			let offsetX = 0;
			if(aa.leftStyle=="right1"){
				offsetX = -unitWidth*2;
			}
			else if(aa.leftStyle=="right2"){
				offsetX = -unitWidth;
			}
				re.push(
					<CDSBar
						x={(aa.start)*unitWidth+offsetX}
						y={y0}
						sequence={aa.seq}
						unitWidth={unitWidth*3}
						height={h0}
						leftStyle={aa.leftStyle}
						rightStyle={aa.rightStyle}
						key={`AABar${i}`}
					></CDSBar>
				);

		}

		return re;
	}

	generateBlockBars(y0){
		let {blocks,unitWidth} = this.props;
		let re = [];

		for(let i in blocks){
			let b = blocks[i];
			re.push(
				<rect
					x={b.start*unitWidth}
					y={y0}
					width={b.len*unitWidth}
					height={9}
					fill={b.color}
					key={i}
				></rect>
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

	shouldComponentUpdate(np,nextState){
		let update =  !compareProps(this.props,np);
		return update
	}


	calcFeatureHeight(){
		let {
			features,
			showFeatures,
			} = this.props;
		if(!showFeatures){
			return 0;
		}
		if(features && features.length>0) {
			this.sortFeatures();
			return this.featureRowCount*(this.props.featureHeight+5);
		}
		return 0;
	}

	sortFeatures(){
		//check overlay
		let {
			features,
			showFeatures,
			} = this.props;
		if(showFeatures && features) {
			this.featureRow = Array(features.length)
			for (let i in features) {
				this.featureRow[i] = 0;
			}

			this.featureRowCount = 1;
			for (let i = 0; i < features.length; i++) {
				for (let j = i + 1; j < features.length; j++) {
					if (isOverlap(features[i].start,features[i].start+features[i].len, features[j].start, features[j].start+features[j].len)) {
						this.featureRow[j] = this.featureRow[i]+ 1;
						this.featureRowCount=this.featureRow[j]+1;
					}
				}
			}
		}
	}



    render(){
    	let {sequence,
			unitWidth,
			showCursor,
			cursorPos,
			idxStart,
			showSelection,
			selectStartPos,
			showBlockBar,
			seqMainStyle,
			seqCompStyle,
			cursorColor,
			selectLeftPos,
			selectRightPos,
			showLeftCursor,
			showRightCursor,
			showAA,
			ruler2d,
			enzymes,
			} = this.props;
		let {showEnzymes, showLadder, showRS, showFeatures, showRuler,onSelect} = this.props;

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

		//calculate element Y poses
		let elementPoses = ()=> {
			let re = {};
			let y = 0;

			re.selectionY = y;
			if (showEnzymes) {
				y += 5;
				re.seqY = 5;
			}
			y+=unitHeight;
			re.seqH = unitHeight;
			if(showLadder) {
				re.rulerY = y;
				y += 15;
				re.rulerH = 15;
			}
			if(showRS) {
				re.compY = y;
				y += unitHeight;
				re.compH = unitHeight;
			}
			y+=5;
			if(showBlockBar){
				re.blockBarY = y;
				y+=9;
				y+=5;
			}
			if(showAA && this.props.aas && this.props.aas.length>0){
				re.aaY = y;
				re.aaH = 18;
				y+=23;
			}
			if(showFeatures) {
				re.featureY = y;
				re.featureH = this.calcFeatureHeight();
				y += re.featureH;
				y += 10;
			}
			re.selectionH = y;
			if(showRuler) {
				re.ruler2Y = y;
				re.ruler2H = 10;
				y+=10;
				y+=20;
			}

			re.totalH = y;
			return re;
		}();

		let ep = elementPoses;

		height = ep.totalH;

		let divStyle = this.props.theme=="nowrap"?{display:"inline-block",whiteSpace:"nowrap"}:{marginLeft:15,marginBottom:5};

		//console.log("CDSrender",showAA,this.props.aas);
    	return(
    	<div
    		style={divStyle}
			ref="SequenceRow"
    	>

    	<svg
			width={sequenceRowWidth+50}
			height={ep.totalH}
			style={{
				//display:"block",
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

			<StrainText
				showRS={showRS}
				showLadder={showLadder}
				ep={ep}
				sequenceRowWidth = {sequenceRowWidth}
				seqMainStyle = {seqMainStyle}
				seqCompStyle = {seqCompStyle}
				sequence = {sequence}
				unitWidth={unitWidth}
			></StrainText>

			{showAA &&
				this.generateAABars(ep.aaY,ep.aaH)
			}

			{showFeatures &&
				this.generateFeatures(ep.featureY)
			}

			{showBlockBar &&
				this.generateBlockBars(ep.blockBarY)
			}

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

			{showRuler &&
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