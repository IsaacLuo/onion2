import React, { PropTypes } from 'react';

import {LA} from "./../LA";
import Feature from "./Feature";
var $ = require('jquery');


// this is a feature builder
export class FeatureGroup extends React.Component {
    constructor(props){
        super(props);
        this.state = {selectedFeature:this.props.selectedFeature}
    }

	static defaultProps = {
		angleSpan : [0,360]
	};

    calcFeaturePos(){
		let {angleSpan} = this.props;
    	var featureArrows = [];
    	let seqLength = this.props.seqLength;
        this.la = new LA(this.props.seqLength,angleSpan[0],angleSpan[1]);
    	for(let i in this.props.features){
    		let feature = this.props.features[i];
    		let arrow = Object.assign({},feature);
    		arrow.arrowStartAngle = this.la.a(arrow.start);
    		arrow.arcLen = this.la.a(arrow.end)-arrow.arrowStartAngle;

    		featureArrows.push(arrow);
    	}
    	return featureArrows;
    }
    buildFeatureArrows(featureArrows){
        let {theme} = this.props;
    	let doms = [];
    	for(let i in featureArrows){
    		let feature = featureArrows[i];
	    	doms.push(
	    		<Feature
	    			arrowStartAngle={feature.arrowStartAngle}
	    			arcLen={feature.arcLen}
	    			color={feature.color}
	    			radius = {this.props.radius}
	    			text = {feature.text}
	    			key={i}
	    			featureID = {parseInt(i)}
	    			strand = {feature.strand}
	    			highLight = {parseInt(i)==this.state.selectedFeature}
	    			globalRotateAngle = {this.props.globalRotateAngle}
                    theme = {this.props.theme}
	    		>
	    		</Feature>
	    	);
	    }
	    return doms;

    }

    render(){

    	let featureArrows = this.calcFeaturePos();
    	let doms = this.buildFeatureArrows(featureArrows);
        return (<g
				onClick={(e)=>{
        			let id = $(e.target).closest(".featureArrowG").data("featureid");
        			this.setState({selectedFeature:id});
        		}}
        		>
        		{doms}
        		</g>)
        ;
    }

};
module.exports = FeatureGroup;
