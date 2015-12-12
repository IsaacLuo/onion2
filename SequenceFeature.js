import React from 'react';

export class SequenceFeatureSVG extends React.Component
{
	render(){
		let {width,height}=this.props;
		return(
			<svg
				width={width}
			    height={height}
				style={{
			        pointerEvents:"none"
			    }}
			>
				{this.props.children}
			</svg>
		);
	}
}

export class SequenceFeatureArrow extends React.Component
{
	static propTypes = {
        theme:React.PropTypes.string,
		start:React.PropTypes.number,
        len:React.PropTypes.number,
		unitWidth:React.PropTypes.number,
        height:React.PropTypes.number
	};
	static defaultProps = {
        height:20,
        width:0
    };

    constructor(props){
    	super(props);
    }
	onmousedown(){
		alert("123")
	}

    render(){
    	let {unitWidth,height,len,start,color} = this.props;
		let width = unitWidth*len;
    	return(
			<rect
				x={unitWidth*start}
                y={0}
				width={width}
				height={height}
				stroke="black"
                strokeWidth="1"
                fill={color}
				onMouseDown={this.onmousedown}

			></rect>
    	)
    }
}