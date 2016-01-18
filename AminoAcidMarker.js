/**
 * Created by luoyi on 18/01/2016.
 */
import React, { PropTypes } from 'react';

export class AminoAcidMarker extends React.Component
{
	static propTypes = {

	};
	static defaultProps = {
		h:18,
	};

	static colorDict = {
		F:"#F3DACA",
		L:"#D3D34F",
		I:"#F1E8BB",
		M:"#F1EBAA",
		A:"#C3E6F0",
		Y:"#CAC9C9",
		H:"#D8D9D8",
		Q:"#EFD79A",
		C:"#9CCFD2",
		W:"#A5A8BA",
		R:"#DEEBC8",
		S:"#8BACAB",
		V:"#C5DEAE",
		S:"#D2E19E",
		P:"#DDE7EB",
		T:"#ABDAE1",
		N:"#D9BA9B",
		K:"#CCE8E7",
		D:"#B1DDE7",
		E:"#BADAA9",
		G:"#DBDBDB",
		X:"#777777",
	};

	constructor(props){
		super(props);
	}
	render(){
		let {x,y,w,h,aa} = this.props;

		let pts=[
			{x:-0.1*w,y:0},
			{x:w*0.9,y:0},
			{x:w*1.2,y:9},
			{x:w*0.9,y:18},
			{x:-0.1*w,y:18},
			{x:w*0.2,y:9},
		]
		let genPath = (pts) => {
			let re = `M ${pts[0].x} ${pts[0].y}`;
			for(let i=1;i<pts.length;i++) {
				re+= `L ${pts[i].x} ${pts[i].y}`;
			}
			re+="Z";
			return re;
		};
		return (
			<g
				transform={`translate(${x},${y})`}
			>
				<path
					d={genPath(pts)}
					fill={AminoAcidMarker.colorDict[aa]}
				></path>
				<text
					x={w/2}
					y={h/2}
					style={{
						textAnchor:"middle",
						alignmentBaseline:"central",
						WebkitUserSelect:"none"
					}}
				>{aa}</text>
			</g>
		);
	}

}