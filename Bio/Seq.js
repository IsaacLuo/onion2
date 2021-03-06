/**
 * Created by luoyi on 11/01/2016.
 */
export class Seq
{
  constructor(o = '') {
    this.seq = this.removeInvalidLetter(o);
  }

  removeInvalidLetter(src) {
    return src;
  }

  toString() {
    return this.seq;
  }

  length() {
    return this.seq.length;
  }

  substr(start, len) {
    return new Seq(this.seq.substr(start, len));
  }

  setSegment(start, len, newStr = '') {
    return new Seq(this.seq.substr(0,start) + newStr + this.seq.substr(start+len,this.seq.length-start-len));
  }
}
