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
				    key={i}
				>
				</SequenceFeatureArrow>
			);
		}
		return re;
	}

    render(){
    	let {sequence,fontFamily,showComplement,unitWidth} = this.props;


		let textRows = 1;
		let sequenceRowWidth = sequence.length*unitWidth;
			textRows = 2;
    	return(
    	<div
    		style={{
    			marginLeft:15,
    			marginBottom:15
    		}}
    	>
    	<svg
			width={sequenceRowWidth+10}
			height={textRows*16}
			style={{
				display:"block"
				}}
    	>
	    	<text
	    		style={{
	    			fontFamily:fontFamily,
	    			fontSize:15,
	    			letterSpacing:0,
	    			fill:"black",
	    			alignmentBaseline:"before-edge"
	    		}}
				x="0"
				y="0"
				ref="ccc"
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
				y="15"
	    	>
	    		{this.complement(sequence)}
	    	</text>}
    	</svg>
		    <SequenceFeatureSVG
			    width={sequenceRowWidth}
		        height={30}
		    >
    	        {this.generateFeatures()}
			    </SequenceFeatureSVG>
    	</div>

    	)
    }
}