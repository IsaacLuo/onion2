import React, { PropTypes } from 'react';

export class EnzymeLabel extends React.Component
{
	constructor(props){
		super(props)
	}

	calcAllPosition(unitHeight=15){
		const offset = 50;
		let key = 5210000;
		for(let y=0;y<this.er;y+=unitHeight){
			let x= Math.sqrt(this.er*this.er - y*y);
			this.textPath.push(this.genTextPath(x,y,offset,key++));
			this.textPath.push(this.genTextPath(x,-y,offset,key++));
			this.textPath.push(this.genTextPath(-x,y,-offset,key++));
			this.textPath.push(this.genTextPath(-x,-y,-offset,key++));
		}
	}

	render(){
		let {rootPos, textPos, l, text,key} = this.props;
		let anchor = "begin";
		if(textPos.x<0){
			l = -l;
			anchor = "end";
		}
		else{
			anchor="begin";
		}
		return (
				<g>
					<path 
						d={`M ${rootPos.x} ${rootPos.y} L ${textPos.x} ${textPos.y} L ${textPos.x+l}  ${textPos.y}`}
						strokeWidth={1}
						stroke={"black"}
						fill="none"
					></path>
					<text
						x={textPos.x}
						y={textPos.y}
						textAnchor={anchor}
					>
					{text}
					</text>
				</g>
			)
	}
}
module.exports = EnzymeLabel;