import React, { PropTypes } from 'react';
import {LA} from "./LA";

export class PlasmidViewerVisibleArea extends React.Component {
	static propTypes = {
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

    render(){
        let angle = this.props.angle;
        let angle2 = this.props.angleSelected;
        let pointerAngle = (angle2-90)*Math.PI/180;
        let r = this.props.radius;

        let ptE = {x:r*Math.cos(pointerAngle), y:r*Math.sin(pointerAngle)}

        let longFlag = 1;
        if(angle2>180)
            longFlag = 0;
      
        //let viewD = `M 0 0 L 0 ${-r} A ${r} ${r} 0 ${longFlag} 1 ${ptE.x} ${ptE.y} `;
        let viewD = `M 0 0 L 0 ${-r} A ${r} ${r} 0 ${longFlag} 0 ${ptE.x} ${ptE.y} `;

        return( 
            <g
                transform={`rotate(${angle})`}
            >
            <circle
                cx="0"
                cy="0"
                r={r}
                fill="url(#grad1)"
            ></circle>
            <path
                d={viewD}
                fill="#ffffff"
                strokeWidth={0}
                stroke="green"
            ></path>
        </g>
        )
    }
}