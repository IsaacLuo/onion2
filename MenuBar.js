/**
 * Created by luoyi on 1/12/2016.
 */
import React, { PropTypes } from 'react';
global.jQuery = require('jquery');
require('bootstrap');
var bt = require('bootstrap');
console.log(bt);
import { ButtonGroup, DropdownButton, MenuItem, Button, Input} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';


// SequenceEditor Menu
export class MenuBar extends React.Component
{
    constructor(props){
        super(props)
    }
    render() {
        let {showEnzymes, showLadder, showRS, showFeatures, showRuler,onSelect} = this.props;
        let cb = (v)=>{return v?<input type="checkbox" checked/>:<input type="checkbox"/>};
        return(
        <ButtonGroup>
            <DropdownButton bsStyle="default" title="Layer">
                <MenuItem key="1" eventKey={["showEnzymes",!showEnzymes]} onSelect = {onSelect}>{cb(showEnzymes)}Enzymes</MenuItem>
                <MenuItem key="2" eventKey={["showLadder",!showLadder]} onSelect = {onSelect}>{cb(showLadder)}Ladder</MenuItem>
                <MenuItem key="3" eventKey={["showRS",!showRS]} onSelect = {onSelect}>{cb(showRS)}Reverse Strand</MenuItem>
                <MenuItem key="4" eventKey={["showFeatures",!showFeatures]} onSelect = {onSelect}>{cb(showFeatures)}Features</MenuItem>
                <MenuItem key="5" eventKey={["showRuler",!showRuler]} onSelect = {onSelect}>{cb(showRuler)}Ruler</MenuItem>
            </DropdownButton>
        </ButtonGroup>
        )
    }
}