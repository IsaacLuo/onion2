import d3 from "d3"
export class LAO
{
	constructor(l,d=false){
		this.l = l
		this.d = d
	}
	setL(l){
		this.l = l
	}
	l(a){
		if(this.d)
			return a*this.l/360;
		else
			return a*this.l/PI/2;
	}
	a(l){
		if(this.d)
			return l*360/this.l;
		else
			return l*Math.PI*2/this.l;
	}
};

export class LA
{
	constructor(l,e0,e1){
		this.l = l
		this.e0 = e0;
		this.e1 = e1;
		this.l2a = d3.scale.linear().domain([0,l]).range([e0,e1]);
		this.a2l = d3.scale.linear().domain([e0,e1]).range([0,l]);
	}
	setL(l){
		this.l = l
	}
	l(a){
		return this.a2l(a);
	}
	a(l){
		return this.l2a(l);
	}
};