import React, { PropTypes } from 'react';
import {AminoAcidMarker} from './AminoAcidMarker'

export class CDSBar extends React.Component
{
	static propTypes = {};
	static defaultProps = {
		leftStyle:"left3",
		rightStyle:"right3",
	};
	generateBar(){
		let {sequence,unitWidth,height,leftStyle,rightStyle} = this.props;
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
			></AminoAcidMarker>)
		}
		return re;
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