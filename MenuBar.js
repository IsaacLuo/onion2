/**
 * Created by luoyi on 1/12/2016.
 */
import React, { PropTypes } from 'react';
global.jQuery = require('jquery');
require('bootstrap');
import {Navbar,Nav, NavDropdown, ButtonGroup, DropdownButton, MenuItem, Button, Input} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

 //SequenceEditor Menu
export class MenuBar extends React.Component
{
    constructor(props){
        super(props)
    }
    render() {
        let {showEnzymes, showLadder, showRS, showFeatures, showRuler,showBlockBar,onSelect,showAA} = this.props;
        let cb = (v)=>{return v?<input type="checkbox" checked/>:<input type="checkbox"/>};
        let generalMenuItem = (key,cmd)=>{return <MenuItem key={key} eventKey={[{cmd}]} onSelect = {onSelect}>{cmd}</MenuItem>}
        return(
        <Navbar style={{border:"none"}}>
            <Nav>
                <NavDropdown title="FILE" noCaret>
                    {generalMenuItem(1,"Save As...")}
                    {generalMenuItem(2,"Save Selected Part As...")}
                    {generalMenuItem(3,"Reset")}
                </NavDropdown>
                <NavDropdown title="EDIT" noCaret>
                    {generalMenuItem(1,"Insert")}
                    {generalMenuItem(2,"Delete")}
                    {generalMenuItem(3,"Create Primers")}
                    {generalMenuItem(4,"Attach Primers")}
                    {generalMenuItem(5,"Attach Sanger Sequencing")}
                    {generalMenuItem(6,"Find")}
                    {generalMenuItem(7,"To Upper Case")}
                    {generalMenuItem(8,"To Lower Case")}
                    {generalMenuItem(9,"Translate")}
                </NavDropdown>
                <NavDropdown title="VIEW" id="basic-nav-dropdown" noCaret>
                    <MenuItem key="1" eventKey={["showEnzymes",!showEnzymes]} onSelect = {onSelect}>{cb(showEnzymes)}Enzymes</MenuItem>
                    <MenuItem key="2" eventKey={["showLadder",!showLadder]} onSelect = {onSelect}>{cb(showLadder)}Ladder</MenuItem>
                    <MenuItem key="3" eventKey={["showRS",!showRS]} onSelect = {onSelect}>{cb(showRS)}Reverse Strand</MenuItem>
                    <MenuItem key="6" eventKey={["showBlockBar",!showBlockBar]} onSelect = {onSelect}>{cb(showBlockBar)}Blocks</MenuItem>
                    <MenuItem key="7" eventKey={["showAA",!showAA]} onSelect = {onSelect}>{cb(showAA)}Amino Acids</MenuItem>
                    <MenuItem key="4" eventKey={["showFeatures",!showFeatures]} onSelect = {onSelect}>{cb(showFeatures)}Features</MenuItem>
                    <MenuItem key="5" eventKey={["showRuler",!showRuler]} onSelect = {onSelect}>{cb(showRuler)}Ruler</MenuItem>
                </NavDropdown>

            </Nav>
        </Navbar>
        )
    }
}

