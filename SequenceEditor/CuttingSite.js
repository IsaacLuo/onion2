/**
 * Created by Isaac on 25/01/2016.
 */
import React from 'react';


//Emzyme label is a text showing enzyme restriction site and cutting site on a strand, a part of PlasmidViewer
export class CuttingSite extends React.Component
{
    constructor(props){
        super(props)
    }

    render(){
        let {u,d,s,y,h,className} = this.props;
        switch(s){
            case "N":
                return (
                    <path
                        d={`M ${u} ${y} L ${u} ${y+h/2} L ${d}  ${y+h/2} ${d} ${y+h}`}
                        strokeWidth={1}
                        stroke={"black"}
                        fill="none"
                        className={className}
                        style={{display:"none"}}
                    ></path>
                );
            case "UL":
            case "UR":
                return (
                    <path
                        d={`M ${u} ${y} L ${u} ${y+h/2} L ${d+5}  ${y+h/2}`}
                        strokeWidth={1}
                        stroke={"black"}
                        fill="none"
                        className={className}
                        style={{display:"none"}}
                    ></path>
                );

            case "DL":
            case "DR":
                return (
                    <path
                        d={`M ${u-5} ${y+h/2} L ${d}  ${y+h/2} ${d} ${y+h}`}
                        strokeWidth={1}
                        stroke={"black"}
                        fill="none"
                        className={className}
                        style={{display:"none"}}
                    ></path>
                );
        }

    }
}