/**
 * Created by luoyi on 1/12/2016.
 */
import React, { PropTypes } from 'react';
global.jQuery = require('jquery');

import './css/Onion.css';

//SequenceEditor Menu
export class MenuBar extends React.Component {
  static defaultProps = {
    title: "Block",
  };

  constructor(props) {
    super(props);
  }

  render() {
    let { title, showEnzymes, showRS, showFeatures, showRuler, showBlockBar, onSelect, showAA } = this.props;
    let layerMenuItem = (text, cmd, value, padding = "10px 10px")=> {
      //console.log(cmd,value,padding)
      return (
        <div
          style={{
            display:"inline-block",
            padding:padding,
          }}
        >
          <a
            style={{
              color:value ? "#4c505f" : "#b3b3b3",
              cursor:"pointer",
            }}
            onClick={onSelect.bind(this, cmd, !value)}
          >
            {text}
          </a>
        </div>
);
    };

    let showAll = showEnzymes && showRS && showFeatures && showRuler && showBlockBar && showAA;
    return (
      <div>
        <div
          style={{
            height:43,
            fontSize:16,
          }}
        >
          <div
            style={{
              display:"inline-block",
              width:"100%",
              height:"100%",
              borderStyle:"none none solid none",
              borderWidth:"1",
              textAlign:"right",
              verticalAlign:"top",
            }}
          >
            <div
              style={{
                display:"inline-block",
                width:20,
                height:"calc(100% + 1px)",
                verticalAlign:"top",
                borderStyle:"none none solid none",
                borderWidth:1,
                borderColor:"white",
              }}
            ></div>
            {layerMenuItem(<EyeIcon stroke={showAll ? "#4c505f" : "#b3b3b3"}></EyeIcon>, "showAll", showAll, "10px 0px 10px 10px")}
            {layerMenuItem("Features", "showFeatures", showFeatures)}
            {layerMenuItem("Reverse Strand", "showRS", showRS)}
            {layerMenuItem("Enzymes", "showEnzymes", showEnzymes)}
            {layerMenuItem("Amino Acids", "showAA", showAA)}
            {layerMenuItem("Ruler", "showRuler", showRuler)}
          </div>
        </div>
        <div
          style={{
            paddingTop:8,
            paddingLeft:8,
            paddingBottom:8,
            color:"#8EC78D",
            fontSize:20,
          }}
        >
          {title}
        </div>
      </div>
    );

  }
}

export class EyeIcon extends React.Component {
  static defaultProps = {
    width: 17,
    height: 17,
    stroke: "#4c505f",
  };

  constructor(props) {
    super(props);
  }

  render() {
    let { width, height, stroke } = this.props;
    return (
      <svg width={width} height={height}>
        <g id="Welcome" stroke="none" strokeWidth="1" fill="none">
          <g id="Desktop" transform="translate(-153.000000, -124.000000)">
            <path id="Path-121" stroke={stroke} d=""></path>
            <path
              d="M161.5,128 C167,128 169,132.290784 169,132.290784 C169,132.290784 167,137.5 161.5,137.5 C156,137.5 154,132.290784 154,132.290784 C154,132.290784 156,128 161.5,128 Z"
              id="Path-122" stroke={stroke}></path>
            <ellipse id="Oval-16" stroke={stroke} cx="161.5" cy="132.875891"
                     rx="2.8125" ry="2.92553475"></ellipse>
          </g>
        </g>
      </svg>
    );
  }
}
