/**
 * Created by luoyi on 11/01/2016.
 */
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