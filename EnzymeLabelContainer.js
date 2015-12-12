import React, { PropTypes } from 'react';
import EnzymeLabel from './EnzymeLabel'

export class EnzymeLabelContainer extends React.Component
{
	constructor(props){
		super(props)
		this.resetR(this.props.plasmidR, this.props.enzymeR)
		this.textPath = [];
		this.enzymePoses = [];
	}

	resetR(plasmidR, enzymeR){
		this.pr = plasmidR;
		this.er = enzymeR;
	}
	clearContainer(){

	}

	genTextPath2(x,y,l,key){
		return (<path 
				d={`M ${x} ${y} L ${x+l}  ${y}`}
				strokeWidth={1}
				stroke={"black"}
				key={key}
				></path>);
	}

	genTextPath(rx,ry,x,y,l,key,text){
		return (
			<EnzymeLabel
				rootPos = {{x:rx,y:ry}}
				textPos = {{x,y}}
				text = {text}
				key = {key}
				l={50}
			>
			</EnzymeLabel>
			);
	}



	calcAllPosition(unitHeight=15){
		const offset = 50;
		let key = 5210000;
		this.enzymePoses = [];
		for(let y=0;y<this.er;y+=unitHeight){
			let x= Math.sqrt(this.er*this.er - y*y);
			this.enzymePoses.push({x:x,y:y,items:[]});
			this.enzymePoses.push({x:x,y:-y,items:[]});
			this.enzymePoses.push({x:-x,y:y,items:[]});
			this.enzymePoses.push({x:-x,y:-y,items:[]});
		}
	}
	findNearestPos(rootPos){
		let maxD2 = 9999999;
		let nearestEnzymePos = this.enzymePoses[0];
		for(let i in this.enzymePoses){
			let e = this.enzymePoses[i];
			let dx = e.x-rootPos.x;
			let dy = e.y-rootPos.y;
			let d2 = dx*dx+dy*dy;
			if(d2<maxD2){
				maxD2 = d2;
				nearestEnzymePos = e;
			}
		}
		return nearestEnzymePos;
	}

	fillEnzymes(enzymes){
		for(let i in enzymes){
			let enzyme = enzymes[i];
			let rootPos = enzyme.rootPos;
			//find nearestPos
			let ePos = this.findNearestPos(rootPos);
			ePos.items.push({name:enzyme.name,rootPos:enzyme.rootPos});	
		}
		for(let i in this.enzymePoses){
			let enzymePos = this.enzymePoses[i];
			if(enzymePos.items.length>0){
				let names = "";
				for(let j in enzymePos.items){
					names+=` ${enzymePos.items[j].name}`
				}
				console.log(enzymePos.items[0].rootPos)
				this.textPath.push(this.genTextPath(enzymePos.items[0].rootPos.x, enzymePos.items[0].rootPos.y, enzymePos.x, enzymePos.y,100,Math.random()+i,names));
			}
		}
	}

	render(){
		this.calcAllPosition();
		this.fillEnzymes(this.props.enzymes);
		
		return (
				<g>
					{this.textPath}
				</g>
			)
	}
}
module.exports = EnzymeLabelContainer;