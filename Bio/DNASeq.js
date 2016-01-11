import {Seq} from "./Seq"
import {EnzymeSite} from "./Enzyme"

export class DNASeq extends Seq
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
			out.push(DNASeq.complementDict[n]);
		}
		return new DNASeq(out.reverse().join(""));
	}

	complement(){
		let out = [];
		for(let n of this.seq){
			out.push(DNA.complementDict[n]);
		}
		return new DNASeq(out.join(""));
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

	calcEnzymeSites(enzymeList){
		this.enzymeSites = [];
		for(let e of enzymeList){
			let rsxf = new RegExp(e.rf,"gi");
			let r = null;
			while(r = rsxf.exec(this.seq)){
				this.enzymeSites.push(new EnzymeSite(e,r.index,0));
			}
			if(e.csNumber==2){
				let rsxr = new RegExp(e.rr,"gi");
				while(r = rsxr.exec(this.seq)){
					this.enzymeSites.push(new EnzymeSite(e,r.index,1));
				}
			}
		}
		return this.enzymeSites;
	}

}