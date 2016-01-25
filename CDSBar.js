import React, { PropTypes } from 'react';
import {AminoAcidMarker} from './AminoAcidMarker'
import {compareProps} from './reactHelper'

export class CDSBar extends React.Component
{
	static propTypes = {
		//style can be one of ["left1","left2","left3","right1","right2","right3","full"]
		leftStyle: React.PropTypes.string,
		rightStyle: React.PropTypes.string,
		//the unitWidth should be 3 times of unitwidth of DNA bps
		unitWidth: React.PropTypes.number.isRequired,
		//arrow height
		height: React.PropTypes.number.isRequired,
		//sequence, must valid AA letters
		sequence: React.PropTypes.string.isRequired,
		x: React.PropTypes.number,
		y: React.PropTypes.number,
		//direction: React.PropTypes.string.isRequired,
	};
	static defaultProps = {
		leftStyle:"left3",
		rightStyle:"right3",
		x:0,
		y:0,
		strand:"+",
	};
	generateBar(){
		let {sequence,unitWidth,height,leftStyle,rightStyle,strand} = this.props;
		let re = [];
		let i=0;
		//draw leftHead
		if(sequence.length>=1) {
			re.push(<AminoAcidMarker
				aa={sequence[i]}
				x={i*unitWidth}
				y="0"
				w={unitWidth}
				h={height}
				key={i}
				style={leftStyle}
				direction={strand}
			></AminoAcidMarker>)
		}
		//draw middle
		for(i=1;i<sequence.length-1;i++){
			re.push(<AminoAcidMarker
				aa={sequence[i]}
				x={i*unitWidth}
				y="0"
				w={unitWidth}
				h={height}
				key={i}
				direction={strand}
			></AminoAcidMarker>)
		}
		//draw tail
		if(sequence.length>=2) {
			re.push(<AminoAcidMarker
				aa={sequence[i]}
				x={i*unitWidth}
				y="0"
				w={unitWidth}
				h={height}
				key={i}
				style={rightStyle}
				direction={strand}
			></AminoAcidMarker>)
		}
		return re;
	}
	shouldComponentUpdate(nextProps, nextState){
		let update = !compareProps(this.props,nextProps);
		//console.log("CDSUP",update)
		//if(update){			console.log("CDS update",this);		}
		return update;
	}
	render(){
		let {x,y} = this.props;
		return (
			<g
				transform={`translate(${x},${y})`}
			>
				{this.generateBar()}
			</g>
		)
	}
}