import { globalEnzymeList, globalEnzymeSet } from './EnzymeList';

export class Enzyme
{
  constructor(name, restrictionSite, regexForward, regexReverse, cuttingSite, symmetry = true) {
    this.name = name;
    this.rs = restrictionSite;
    this.rf = regexForward;
    this.rr = regexReverse;
    if (cuttingSite.length === 2) {
      this.cs = cuttingSite;
      this.csNumber = 1;
    } else if (cuttingSite.length === 4) {
      this.cs = [cuttingSite[0], cuttingSite[1]];
      this.cs2 = [cuttingSite[2], cuttingSite[3]];
      this.csNumber = 2;
    } else throw new Error('splitPos must be an integer array length 2 or 4');

    this.symmetry = symmetry;
  }

  getCuttingSite(c = 0) {
    if (c === 0) {
      return this.cs;
    } else if (c === 1 && this.csNumber === 2) {
      return this.cs2;
    }

    return null;
  }
}

export class EnzymeSite
{
  constructor(enzyme, anchor, strand) {
    this.enzyme = enzyme;
    this.anchor = anchor;
    this.strand = strand;
  }

  getAnchor() {
    return this.anchor;
  }

  getRestrictionSite() {
    return [this.anchor, this.anchor + this.enzyme.rs.length];
  }

  getCuttingSite(c = 0) {
    const css = this.enzyme.getCuttingSite(c);
    const re = new Array(css.length);
    if (this.strand === '-') {
      for (let i = 0; i < css.length; i++) {
        re[i] = this.anchor + this.enzyme.rs.length - css[i];
      }
    } else {
      for (let i = 0; i < css.length; i++) {
        re[i] = this.anchor + css[i];
      }
    }

    return re;
  }

  getEnzyme() {
    return this.enzyme;
  }
}

export function loadEnzymeList(filterName = 'All Commercial') {
  const re = [];
  const filter = globalEnzymeSet[filterName];
  for (const e of globalEnzymeList.enzymes) {
    if (filter.indexOf(e.n) >= 0) {
      if (e.c === 0) {
        re.push(new Enzyme(e.n, e.s, e.fr, e.rr, [e.ds.df, e.ds.dr], e.m));
      } else {
        re.push(new Enzyme(e.n, e.s, e.fr, e.rr, [e.ds.df, e.ds.dr, e.us.uf, e.us.ur], e.m));
      }
    }
  }

  // console.log('loaded enzyme list', re, re.length);
  return re;
}
