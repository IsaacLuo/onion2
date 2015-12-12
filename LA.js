export class LA
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