/**
 * Created by luoyi on 07/01/2016.
 */
/**
 * Created by luoyi on 06/01/2016.
 */
import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {DNA} from './Bio'

export class InfoBar extends React.Component
{
	static propTypes = {

	};
	static defaultProps = {
		showPos:true,
		showLength:true,
		showGC:true,
		showTM:true,
		seq:"",

	};

	constructor(props){
		super(props);
	}

	render(){
		let {showPos,
			showLength,
			showGC,
			showTM,
			width,
			startPos,
			endPos,
			seq,
			} = this.props;
		let itemStyle = {
			display:"inline-block",
			marginLeft:10,
			marginRight:10,
			color:"A5A6A2",
		};

		let length = endPos-startPos;

		let dna = new DNA(seq);
		let gc = dna.getGCPercentage();
		let tm = dna.getTM();




		return (
			<div
				style={{
					textAlign:"right",
					width:width,
				}}
			>
				{showPos &&
					<div
						style={itemStyle}
					>
						start: {startPos + 1}
					</div>
				}
				{showPos &&
					<div
						style={itemStyle}
					>
						end: {endPos}
					</div>
				}
				{showLength &&
					<div
						style={itemStyle}
					>
					length: {endPos-startPos}bp
					</div>
				}
				{showGC &&
				<div
					style={itemStyle}
				>
					GC: {(gc*100).toFixed(1)}%
				</div>
				}
				{showTM &&
				<div
					style={itemStyle}
				>
					TM: {tm.toFixed(1)}°C
				</div>
				}
			</div>
		)
	}
}