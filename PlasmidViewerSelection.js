import React, { PropTypes } from 'react';
import {LA} from "./LA";

export class PlasmidViewerSelection extends React.Component {
	static propTypes = {
		//angle: React.PropTypes.number.required,
		theme:React.PropTypes.string
		};
	static defaultProps = 
    {
        angle: 0,
        angleSelected:0,
        radius:250
    };
    constructor(props){
      super(props);
    }
}

export class PlasmidViewerSelectionGeneral extends PlasmidViewerSelection {
    render(){
        let angle = this.props.angle;
        let angle2 = this.props.angleSelected-90;
        if(this.props.angleSelected>=360)
            angle2-=0.00001;
        let angle2R = angle2*Math.PI/180;
       

        let r = this.props.radius;

        let a1 = this.props.watchLeftAngle;
        let a2 = this.props.watchRightAngle;
        
        if(angle+a1<0) a1=-angle;
        if(angle+a2>324) a2=324-angle;
        let a1R = (a1-90)*Math.PI/180;
        let a2R = (a2-90)*Math.PI/180;

        const h = 20;
        let ptE = {x:(r+h)*Math.cos(angle2R), y:(r+h)*Math.sin(angle2R)}
        let ptEI = {x:(r-h)*Math.cos(angle2R), y:(r-h)*Math.sin(angle2R)}
        let longFlag = 0;
        if(this.props.angleSelected>180){
            longFlag = 1;
        }
        let d = `M 0 ${-r-h} A ${r+h} ${r+h} 0 ${longFlag} 1 ${ptE.x} ${ptE.y} L ${ptEI.x} ${ptEI.y} A ${r-h} ${r-h} 0 ${longFlag} 0 0 ${-r+h} `
      
        return( 
            <g
                transform={`rotate(${angle})`}
            >

            {<path
                d = {d}
                fill="rgba(0,255,255,0.3)"
                strokeWidth={0}
                stroke="red"
            ></path>}

        </g>
        )
    }
}