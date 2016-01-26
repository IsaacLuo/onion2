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
    constructor(props){
        super(props)
    }
    render() {
        let {showEnzymes, showLadder, showRS, showFeatures, showRuler,showBlockBar,onSelect,showAA} = this.props;
        let cb = (v)=>{return v?"menuItemChecked":"menuItemUnchecked"};
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
            </Nav>
            <Nav pullRight>
                <li>
                    <a
                        className={"btn btn-link "+cb(showEnzymes)}
                        onClick={onSelect.bind(this,"enzyme",!showEnzymes)}
                    >
                        Left
                    </a>
                </li>
            </Nav>
        </Navbar>
        )
    }
}

