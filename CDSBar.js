import React, { PropTypes } from 'react';
import {AminoAcidMarker} from './AminoAcidMarker'

export class CDSBar extends React.Component
{
	static propTypes = {};
	static defaultProps = {
	};
	generateBar(){
		let {sequence,unitWidth,height} = this.props;
		let re = [];
		for(let i=0;i<sequence.length;i++){
			re.push(<AminoAcidMarker
				aa={sequence[i]}
				x={i*unitWidth}
				y="0"
				w={unitWidth}
				h={height}
				key={i}
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