
export class Seq
{
	constructor(o = ""){
		this.seq = this.removeInvalidLetter(o);
	}
	removeInvalidLetter(src){
		return src;
	}

	toString(){
		return this.seq;
	}

	length(){
		return this.seq.length;
	}
}

export class DNA extends Seq
{

	static complementDict = {A:'T',T:'A',C:'G',G:'C',a:'t',t:'a',c:'g',g:'c'};

	constructor(o){
		super(o)
	}

	removeInvalidLetter(src){
		return src.replace(/[^A|^G|^T|^C]/gi, "");
	}

	reverseComplement(){
		let out = [];
		for(let n of this.seq){
			out.push(DNA.complementDict[n]);
		}
		return out.reverse().join("");
	}

	complement(){
		let out = [];
		for(let n of this.seq){
			out.push(DNA.complementDict[n]);
		}
		return out.join("");
	}

	getGCCount(){
		return (this.seq.match(/[G|C]/gi)||[]).length;
	}
	getATCount(){
		return this.length()-this.getGCCount();
	}
	getGCPercentage(){
		if(this.seq.length>0)
			return this.getGCCount()/this.length();
		else
			return 0;
	}

	getTM(){
		let gc = this.getGCCount();
		let at = this.getATCount();
		if(this.length()<14) {
			return gc * 4 + at * 2;
		}
		else{
			return 64.9+41*(gc-16.4)/(at+gc);
		}
	}



}