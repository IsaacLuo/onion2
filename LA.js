import d3 from "d3";

//LA is a "length" to "angle" converter, used for PlasmidViewer
export class LA {
  constructor(l, e0, e1) {
    this.l = l;
    this.e0 = e0;
    this.e1 = e1;
    this.l2a = d3.scale.linear().domain([0, l]).range([e0, e1]);
    this.a2l = d3.scale.linear().domain([e0, e1]).range([0, l]);
  }

  setL(l) {
    this.l = l;
  }

  l(a) {
    return this.a2l(a);
  }

  a(l) {
    return this.l2a(l);
  }
}
;
