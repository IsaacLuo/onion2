import React, { PropTypes } from 'react';
import {PlasmidBone,PlasmidBoneC,PlasmidBoneNAL} from './PlasmidBone';
import FeatureGroup from './FeatureGroup';

import EnzymeLabelContainer from './EnzymeLabelContainer'
import {LA} from "./LA";
import {PlasmidViewerCursorMeter,PlasmidViewerCursorGeneral} from './PlasmidViewerCursor'
import {PlasmidViewerSelectionGeneral} from './PlasmidViewerSelection'
import {PlasmidViewerVisibleArea} from './PlasmidViewerVisibleArea'



//the PlasmidViewer component of onion
export class PlasmidViewer extends React.Component {
	
	static defaultProps = {
		width:500,
		height:500,
		seqLength:1000,
		rotateAngle:0,
		theme:"SG",
		cursorPos:0,
		selectionStart:0,
		selectionLength:0
	}

	constructor(props){
		super(props);
		this.state = {
		};
	}

	

	calcEnzymeRoot(enzymes,r){
		let {rotateAngle,seqLength} = this.props;
		let plasmidR = r;
		let la = new LA(seqLength,0,360);
		let xy = (a)=>{return{x:plasmidR*Math.cos((90-a)*Math.PI/180),y:-plasmidR*Math.sin((90-a)*Math.PI/180)};};
		for(let i in enzymes){
			enzymes[i].rootPos = xy(la.a(enzymes[i].pos[0])+rotateAngle);
		}
		return enzymes;
	}

	componentWillReceiveProps(nextProps){

		
	}



	render() {
		var {width,height,mode} = this.props;
		var {name,features,seqLength,rotateAngle,plasmidR,theme,selectedFeature,cursorPos,selectionStart,selectionLength,showViewAngle} = this.props;

		var enzymes = this.props.enzymes;
		let enzymeRootR = plasmidR;
		if(theme == "C")
			enzymeRootR = plasmidR + 10;

		enzymes = this.calcEnzymeRoot(enzymes,enzymeRootR);
		
		var altKey =false;
		var viewBox = [];


		if(plasmidR*2<width && plasmidR*2<height){
			viewBox = [-width/2,-height/2,width,height];
		}
		else{
			viewBox = [-width/2,-plasmidR-height/2,width,height];
		}

		let onWheel = (e)=>{
			this.props.onWheel(e);
			e.preventDefault();
		};

		var plasmid = (<div></div>)

		let defs = (<defs>
    <radialGradient  id="grad1" cx="50%" cy="50%" r="90%" fx="50%" fy="50%">
   	  <stop offset="0%" stopColor='#00ffff' stopOpacity="0.5"/>
      <stop offset="100%" stopColor='#ffffff' stopOpacity="0" />
      
    </radialGradient >
    <linearGradient  id="grad2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor='#ffffff' stopOpacity="0" />
      <stop offset="100%" stopColor='#00ffff' stopOpacity="0.5"/>
    </linearGradient >
  </defs>);

		if(theme == "B"){
			plasmid = (
				<div>
					<svg
						width={width}
						height={height}
						viewBox={viewBox}
						onWheel={onWheel}
					>
						<g className="plasmid"
							transform={`rotate (${rotateAngle})`}
						>
							<PlasmidBone
								radius={plasmidR}
								seqLength={seqLength}
							>
							</PlasmidBone>
							<FeatureGroup
								radius = {plasmidR-40}
								features = {features}
								seqLength = {seqLength}
								selectedFeature = {selectedFeature}
								globalRotateAngle = {rotateAngle}
								theme = {"B"}
							>
							</FeatureGroup>
						</g>
						<g className="title">
							<text
								x={0}
								y={0}
								fontSize={16}
								style={{dominantBaseline:"text-after-edge",textAnchor:"middle",WebkitUserSelect:"none",}}
							>
							{name}
							</text>
							<text
								x={0}
								y={0}
								fontSize={10}
								style={{dominantBaseline:"text-before-edge",textAnchor:"middle",WebkitUserSelect:"none",}}
							>
								{seqLength+" bp"}
							</text>
						</g>
						<g className="enzyme">
							{mode == "normal" && <EnzymeLabelContainer
								enzymeR={plasmidR+50}
								plasmidR={plasmidR}
								enzymes={enzymes}
							>
							</EnzymeLabelContainer>}
						</g>
					</svg>
				</div>
			);
		}
		else if(theme == "C"){
			plasmid = (
				<div>
					<svg
						width={width}
						height={height}
						viewBox={viewBox}
						onWheel={onWheel}
					>
						<g className="plasmid"
							transform={`rotate (${rotateAngle})`}
						>
							<PlasmidBoneC
								radius={plasmidR}
								seqLength={seqLength}
							>
							</PlasmidBoneC>
							<FeatureGroup
								radius = {plasmidR}
								features = {features}
								seqLength = {seqLength}
								selectedFeature = {selectedFeature}
								globalRotateAngle = {rotateAngle}
								theme = {"B"}
							>
							</FeatureGroup>
						</g>
						<g className="enzyme">
							{mode == "normal" && <EnzymeLabelContainer
								enzymeR={plasmidR+50}
								plasmidR={plasmidR}
								enzymes={enzymes}
							>
							</EnzymeLabelContainer>}
						</g>
					</svg>
				</div>
			);
	  	}
	  	else if(theme =="NA"){
	  		plasmid = (
				<div>
					<svg
						width={width}
						height={height}
						viewBox={viewBox}
						onWheel={onWheel}
					>
						<g className="plasmid"
							transform={`rotate (${rotateAngle})`}
						>
							<PlasmidBoneC
								radius={plasmidR}
								seqLength={seqLength}
							>
							</PlasmidBoneC>
							<FeatureGroup
								radius = {plasmidR}
								features = {features}
								seqLength = {seqLength}
								selectedFeature = {selectedFeature}
								globalRotateAngle = {rotateAngle}
								theme = {"NA"}
							>
							</FeatureGroup>
						</g>
						<g className="enzyme">
							{mode == "normal" && <EnzymeLabelContainer
								enzymeR={plasmidR+50}
								plasmidR={plasmidR}
								enzymes={enzymes}
							>
							</EnzymeLabelContainer>}
						</g>
					</svg>
				</div>
			);
	  	}
	  	else if(theme =="NAL"){
	  		if(rotateAngle!=198 && rotateAngle!=18){
	  			rotateAngle = 198
	  		}
	  		plasmid = (
				<div>
					<svg
						width={width}
						height={height}
						viewBox={viewBox}
						onWheel={onWheel}
					>
						{defs}
						<g className="plasmid"
							transform={`rotate (${rotateAngle})`}
						>
							<PlasmidBoneNAL
								radius={plasmidR}
								seqLength={seqLength}
							>
							</PlasmidBoneNAL>
							{<FeatureGroup
								radius = {plasmidR}
								features = {features}
								seqLength = {seqLength}
								selectedFeature = {selectedFeature}
								globalRotateAngle = {rotateAngle}
								theme = {"NA"}
								angleSpan = {[0,360-36]}
							>
							</FeatureGroup>}

							{showViewAngle && <PlasmidViewerVisibleArea
								angle={0}
								angleSelected={120}
								radius={plasmidR-20}
							></PlasmidViewerVisibleArea>
							}
							<g className="cursor">
							<PlasmidViewerCursorMeter
								angle={cursorPos*324/seqLength}
								radius = {plasmidR-20}
							></PlasmidViewerCursorMeter>

							</g>
							<g className="selection">
								{<PlasmidViewerSelectionGeneral
								angle={selectionStart*324/seqLength}
								angleSelected={selectionLength*324/seqLength}
								radius = {plasmidR}
							></PlasmidViewerSelectionGeneral>}
							</g>

						</g>
						<g className="enzyme">
							{false &&mode == "normal" && <EnzymeLabelContainer
								enzymeR={plasmidR+50}
								plasmidR={plasmidR}
								enzymes={enzymes}
							>
							</EnzymeLabelContainer>}
						</g>
						<g>
							<text
				    			textAnchor="middle"
				    			x="0"
				    			y={plasmidR*0.618}
				    			fill="black"
								style={{
								WebkitUserSelect:"none"
								}}
				    		>
				    			{Math.round(cursorPos)}
				    		</text>
						</g>
						
					</svg>
				</div>
			);
	  	}
	  	else{
			plasmid = (
				<div>
					<svg
						width={width}
						height={height}
						viewBox={viewBox}
						onWheel={onWheel}
					>
						<g className="plasmid"
							transform={`rotate (${rotateAngle})`}
						>
							<PlasmidBone
								radius={plasmidR}
								seqLength={seqLength}
							>
							</PlasmidBone>
							<FeatureGroup
								radius = {plasmidR-40}
								features = {features}
								seqLength = {this.props.seqLength}
								selectedFeature = {selectedFeature}
								globalRotateAngle = {rotateAngle}
								theme = {theme}
							>
							</FeatureGroup>
							<g className="cursor">
							<PlasmidViewerCursorGeneral
								angle={cursorPos*360/seqLength}
								radius = {plasmidR}
							></PlasmidViewerCursorGeneral>
							</g>
							<g className="selection">
							<PlasmidViewerSelectionGeneral
								angle={selectionStart*360/seqLength}
								angleSelected={selectionLength*360/seqLength}
								radius = {plasmidR}
							></PlasmidViewerSelectionGeneral>
							</g>

						</g>
						<g className="title">
							<text
								x={0}
								y={0}
								fontSize={16}
								style={{dominantBaseline:"text-after-edge",textAnchor:"middle"}}
							>
							{name}
							</text>
							<text
								x={0}
								y={0}
								fontSize={10}
								style={{dominantBaseline:"text-before-edge",textAnchor:"middle"}}
							>
								{seqLength+" bp"}
							</text>
						</g>
						<g className="enzyme">
							{mode == "normal" && <EnzymeLabelContainer
								enzymeR={plasmidR+50}
								plasmidR={plasmidR}
								enzymes={enzymes}
							>
							</EnzymeLabelContainer>}
						</g>

					</svg>
				</div>
			);
	  }


	  return plasmid;
		
	}
}

//module.exports = PlasmidViewer;

