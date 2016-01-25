import {Seq} from "./Seq"

export class AASeq extends Seq
{
	static dict3Letter = {
		A:"ala",
		R:"arg",
		N:"asn",
		D:"asp",
		B:"asx",
		C:"cys",
		E:"glu",
		Q:"gln",
		Z:"glx",
		G:"gly",
		H:"his",
		I:"ile",
		L:"leu",
		K:"lys",
		M:"met",
		F:"phe",
		P:"pro",
		S:"ser",
		T:"thr",
		W:"trp",
		Y:"tyr",
		V:"val"
	};
	static dictFullName = {
		A:"alanine",
		R:"arginine",
		N:"asparagine",
		D:"aspartic acid",
		B:"asparagine",
		C:"cysteine",
		E:"glutamic",
		Q:"glutamine",
		Z:"glutamine",
		G:"glycine",
		H:"histidine",
		I:"isoleucine",
		L:"leucine",
		K:"lysine",
		M:"methionine",
		F:"phenylalanine",
		P:"proline",
		S:"serine",
		T:"threonine",
		W:"tryptophan",
		Y:"tyrosine",
		V:"valine"
	};

	constructor(o){
		super(o)
	}

	removeInvalidLetter(src){
		return src.replace(/[^F|^L|^I|^M|^A|^Y|^H|^Q|^C|^W|^R|^S|^V|^P|^T|^N|^K|^D|^E|^G|^\*]/gi, "");
	}

	to3Letters(connector="-"){
		let {seq} = this.props;
		let re="";
		for(let i=0;i<seq.length-1;i++){
			re+=AASeq.dict3Letter[seq[i]]+connector;
		}
		re+=AASeq.dict3Letter[seq.length-1];
		return re;
	}
	toFullNames(connector="-") {
		let {seq} = this.props;
		let re = "";
		for (let i = 0; i < seq.length - 1; i++) {
			re += AASeq.dictFullName[seq[i]] + connector;
		}
		re += AASeq.dictFullName[seq.length - 1];
		return re;
	}

	substr(start,len){
		return new AASeq(this.seq.substr(start,len))
	}

	reverse(){
		return new AASeq(this.seq.split("").reverse().join(""));
	}

}