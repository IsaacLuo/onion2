export let globalEnzymeList = {
  enzymes: [
    { n: 'BsmBI', s: 'CGTCTC', c: 0, fr: 'CGTCTC', rr: 'GAGACG', ds: { df: 7, dr: 11 }, us: null, m: 0 },
    { n: 'BsaI', s: 'GGTCTC', c: 0, fr: 'G{2}TCTC', rr: 'GAGAC{2}', ds: { df: 7, dr: 11 }, us: null, m: 0 },
    { n: 'EcoRII', s: 'CCWGG', c: 0, fr: 'C{2}[ATW]G{2}', rr: 'C{2}[ATW]G{2}', ds: { df: 0, dr: 5 }, us: null, m: 1 },
    { n: 'EcoRV', s: 'GATATC', c: 0, fr: 'GATATC', rr: 'GATATC', ds: { df: 3, dr: 3 }, us: null, m: 1 },
    { n: 'BamHI', s: 'GGATCC', c: 0, fr: 'G{2}ATC{2}', rr: 'G{2}ATC{2}', ds: { df: 1, dr: 5 }, us: null, m: 1 },
    { n: 'HindIII', s: 'AAGCTT', c: 0, fr: 'A{2}GCT{2}', rr: 'A{2}GCT{2}', ds: { df: 1, dr: 5 }, us: null, m: 1 },
    { n: 'NotI', s: 'GCGGCCGC', c: 0, fr: 'GCG{2}C{2}GC', rr: 'GCG{2}C{2}GC', ds: { df: 2, dr: 6 }, us: null, m: 1 },
  ],
};

export let globalEnzymeSet = {
  caiLab: ['BsmBI', 'BsaI', 'EcoRI', 'EcoRV', 'BamHI', 'HindIII', 'NotI'],
};
