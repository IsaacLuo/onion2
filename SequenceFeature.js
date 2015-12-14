import React from 'react';

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
		this.state = {showTitle:false};
	}

	onMouseEnter(){
        this.setState({hovering:true,showTitle:true});
	}
    onMouseLeave(){
        this.setState({hovering:false,showTitle:false});
    }

	render(){
		let {unitWidth,height,len,start,color,text,textColor} = this.props;
		let width = unitWidth*len;
        let fontFamily = 'Lucida Console, Monaco, monospace';
        let titleOpacity,textAnchor;
        if( len>text.length){
            titleOpacity = 1;
            textAnchor = "middle"
            this.textOverflow = false;
        }
        else{
             titleOpacity = (this.state.showTitle==true ? 1 : 0);
            textAnchor = "start"
            this.textOverflow = true;
        }
        let stroke = this.state.hovering? "red":"black";
        let finalTextColor = this.state.hovering?"red":textColor;

		return(
			<g
                onMouseEnter={this.onMouseEnter.bind(this)}
                onMouseLeave={this.onMouseLeave.bind(this)}
            >
				<rect
					x={unitWidth*start}
					y={0}
					width={width}
					height={height}
					stroke={stroke}
					strokeWidth="1"
					fill={color}
				></rect>
                {<text
                    style={{
                    fontFamily:fontFamily,
                    fontSize:15,
                    fill:finalTextColor,
                    alignmentBaseline:"middle",
                    WebkitUserSelect:"none",
                    textAnchor:textAnchor,
                    opacity:titleOpacity
                    }}
                    x={unitWidth*start+width/2}
                    y={height/2}
                >
                    {text}
                </text>}

			</g>
		)
	}
}