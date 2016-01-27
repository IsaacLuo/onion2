/**
 * Created by luoyi on 1/12/2016.
 */
import React, { PropTypes } from 'react';
global.jQuery = require('jquery');
require('bootstrap');
import {Navbar,Nav, NavDropdown, ButtonGroup, DropdownButton, MenuItem, Button, Input} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/Onion.css'

 //SequenceEditor Menu
export class MenuBar extends React.Component
{
    static defaultProps = {
        title:"Block"
    };
    constructor(props){
        super(props)
    }
    render() {
        let {title, showEnzymes, showRS, showFeatures, showRuler,showBlockBar,onSelect,showAA} = this.props;
        let layerMenuItem = (text,cmd,value)=>{
            return <li>
                <a
                    className={"btn btn-link"}
                    color={value?"#4c505f":"#b3b3b3"}
                    onClick={onSelect.bind(this,cmd,!value)}
                >
                    {text}
                </a>
            </li>
        };
        let showAll = showEnzymes && showRS && showFeatures && showRuler && showBlockBar && showAA;
        return(
        <Navbar style={{border:"none"}}>
            <Navbar.Header>
                <Navbar.Brand>
                    <a href="#">{title}</a>
                </Navbar.Brand>
            </Navbar.Header>
            <Nav pullRight>
                {layerMenuItem(<EyeIcon stroke={showAll?"#4c505f":"#b3b3b3"}></EyeIcon>,"showAll",showAll)}
                {layerMenuItem("enzyme","showEnzymes",showEnzymes)}
                {layerMenuItem("complement","showRS",showRS)}
                {layerMenuItem("block","showBlockBar",showBlockBar)}
                {layerMenuItem("amino acid","showAA",showAA)}
                {layerMenuItem("feature","showFeatures",showFeatures)}
                {layerMenuItem("ruler","showRuler",showRuler)}
            </Nav>
        </Navbar>
        )
    }
}

export class EyeIcon extends React.Component
{
    static defaultProps = {
        width:17,
        height:17,
        stroke:"#4c505f",
    };

    constructor(props){
        super(props)
    }
    render() {
        let {width,height,stroke} = this.props;
        return (
            <svg width={width} height={height}>
                <g id="Welcome" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="Desktop" transform="translate(-153.000000, -124.000000)">
                        <path id="Path-121" stroke={stroke} d=""></path>
                        <path
                            d="M161.5,128 C167,128 169,132.290784 169,132.290784 C169,132.290784 167,137.5 161.5,137.5 C156,137.5 154,132.290784 154,132.290784 C154,132.290784 156,128 161.5,128 Z"
                            id="Path-122" stroke={stroke} ></path>
                        <ellipse id="Oval-16" stroke={stroke} cx="161.5" cy="132.875891"
                                 rx="2.8125" ry="2.92553475"></ellipse>
                    </g>
                </g>
            </svg>
        )
    }
}