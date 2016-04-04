import { Seq } from './Seq';
import { EnzymeSite } from './Enzyme';
import { AASeq } from './AASeq';

export class DNASeq extends Seq
{
  static complementDict = { A: 'T', T: 'A', C: 'G', G: 'C', a: 't', t: 'a', c: 'g', g: 'c' };

  static codonDict = {
    TTT: 'F',
    TTC: 'F',
    TTA: 'F',
    TTG: 'L',
    CTT: 'L',
    CTC: 'L',
    CTA: 'L',
    CTG: 'L',
    ATT: 'I',
    ATC: 'I',
    ATA: 'I',
    ATG: 'M',
    GTT: 'V',
    GTC: 'V',
    GTA: 'V',
    GTG: 'V',
    TCT: 'S',
    TCC: 'S',
    TCA: 'S',
    TCG: 'S',
    CCT: 'P',
    CCC: 'P',
    CCA: 'P',
    CCG: 'P',
    ACT: 'T',
    ACC: 'T',
    ACA: 'T',
    ACG: 'T',
    GCT: 'A',
    GCC: 'A',
    GCA: 'A',
    GCG: 'A',
    TAT: 'Y',
    TAC: 'Y',
    TAA: '*',
    TAG: '*',
    CAT: 'H',
    CAC: 'H',
    CAA: 'Q',
    CAG: 'Q',
    AAT: 'N',
    AAC: 'N',
    AAA: 'K',
    AAG: 'K',
    GAT: 'D',
    GAC: 'D',
    GAA: 'E',
    GAG: 'E',
    TGT: 'C',
    TGC: 'C',
    TGA: '*',
    TGG: 'W',
    CGT: 'R',
    CGC: 'R',
    CGA: 'R',
    CGG: 'R',
    AGT: 'S',
    AGC: 'S',
    AGA: 'R',
    AGG: 'R',
    GGT: 'G',
    GGC: 'G',
    GGA: 'G',
    GGG: 'G',
  };

  constructor(o) {
    super(o);
  }

  removeInvalidLetter(src) {
    return src.replace(/[^A|^G|^T|^C]/gi, '');
  }

  reverseComplement() {
    const out = [];
    for (const n of this.seq) {
      out.push(DNASeq.complementDict[n]);
    }

    return new DNASeq(out.reverse().join(''));
  }

  complement() {
    const out = [];
    for (const n of this.seq) {
      out.push(DNASeq.complementDict[n]);
    }

    return new DNASeq(out.join(''));
  }

  reverse() {
    return new DNASeq(this.seq.split('').reverse().join(''));
  }

  getGCCount() {
    return (this.seq.match(/[G|C]/gi) || []).length;
  }

  getATCount() {
    return this.length() - this.getGCCount();
  }

  getGCPercentage() {
    return this.seq.length > 0 ? this.getGCCount() / this.length() : 0;
  }

  getTM() {
    const gc = this.getGCCount();
    const at = this.getATCount();
    let re;
    if (this.length() < 14) {
      re = gc * 4 + at * 2;
    } else {
      re = 64.9 + 41 * (gc - 16.4) / (at + gc);
    }

    return re;
  }

  calcEnzymeSites(enzymeList) {
    this.enzymeSites = [];
    for (const e of enzymeList) {
      const rsxf = new RegExp(e.rf, 'gi');
      for (let r = rsxf.exec(this.seq); r; r = rsxf.exec(this.seq)) {
        if (!r) break;
        this.enzymeSites.push(new EnzymeSite(e, r.index, '+'));
      }

      if (!e.symmetry) {
        const rsxr = new RegExp(e.rr, 'gi');
        for (let r = rsxr.exec(this.seq); r; r = rsxr.exec(this.seq)) {
          if (!r) break;
          this.enzymeSites.push(new EnzymeSite(e, r.index, '-'));
        }
      }
    }

    return this.enzymeSites;
  }

  substr(start, len) {
    return new DNASeq(this.seq.substr(start, len));
  }

  toAASeq() {
    let re = '';
    for (let i = 0; i <= this.seq.length - 3; i += 3) {
      const aa = DNASeq.codonDict[this.seq.substr(i, 3)];
      re += aa;
    }

    return new AASeq(re);
  }

}
