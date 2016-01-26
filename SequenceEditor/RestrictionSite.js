/**
 * Created by Isaac on 25/01/2016.
 */
import React from 'react';

//Emzyme label is a text showing enzyme restriction site and cutting site on a strand, a part of PlasmidViewer
export class RestrictionSite extends React.Component
{
    constructor(props){
        super(props)
    }

    render(){
        let {x,y,w,h,className} = this.props;
        return <rect
            x={x}
            y={y}
            width={w}
            height={h}
            fill="rgba(127,127,127,0.2)"
            className={className}
            style={{display:"none"}}
        ></rect>
    }

}