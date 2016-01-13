/**
 * Created by luoyi on 06/01/2016.
 */
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';


// the ruler on the bottom of each SequenceRow
export class RulerLocation extends React.Component
{
	static propTypes = {
		x:React.PropTypes.number,
		y:React.PropTypes.number,
		width:React.PropTypes.number,
		height:React.PropTypes.number,
		d:React.PropTypes.number,
	};
	static defaultProps = {
		unitWidth:7,
		x:0,
		y:0,
		width:100,
		height:5,
		textY:5,
		texts:[],
		stroke:"#D8D9D8"
	};

	constructor(props){
		super(props);
	}

	generatePath(x,y,w,h,d,u){

		let re = `M ${x} ${y} L ${x+w} ${y}`;
		for(let xx=x+d*u-u/2;xx<(x+w);xx+=d*u){

			re+= `M ${xx} ${y} L ${xx} ${(y+h)}`;
		}
		return <path
			d = {re}
			stroke="#D8D9D8"
			strokeWidth="1"
		></path>
	}
	generateTexts(x,y,w,h,d,u){
		let {texts} = this.props;

		let re = [];
		let i = 0;
		for(let xx=x+d*u-u/2;xx<(x+w);xx+=d*u){
			i++;
			re.push(<text
				x={xx}
				y={y+h}
				style={{
					alignmentBaseline:"before-edge",
					textAnchor:"middle",
					fill:"#D8D9D8",
					fontFamily:"Helvetica",
					fontSize:"13",
					WebkitUserSelect:"none",
				}}
			>
				{texts[i]}
			</text>);
		}
		return re;
	}

	render(){
		let {x,y,width,height,d,unitWidth} = this.props;
		return (
			<g>
				{this.generatePath(x,y,width,height,d,unitWidth)}
				{this.generateTexts(x,y,width,height,d,unitWidth)}
			</g>
		)
	}
}