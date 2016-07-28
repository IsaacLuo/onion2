export class OnionBuilder {
  constructor() {
    this.sequenceDict = {};
    this.onionBlocks = [];
    this.features = [];
  }

  setTopLevelBlocks(topLevelBlocks) {

    let start = 0;
    let realStart = 0;

    this.onionBlocks = [];
    this.features = [];
    this.sequenceDict = {};

    for (let block of topLevelBlocks) {
      const children = window.gd.api.blocks.blockFlattenConstructAndLists(block.id);
      for(const leafBlock of children) {
        let listName =  null;
        if (block.isList()){
          listName = block.getName();
        } else if(block.isConstruct()){
          let listBlock = window.gd.api.blocks.blockGetListOwner(leafBlock.id,block.id);
          if (listBlock && listBlock.isList()) {
            listName = listBlock.getName();
          }
        }

        const { length, md5 } = leafBlock.sequence;
        const { color } = leafBlock.metadata;
        const name = leafBlock.getName();
        let fakeLength = length === 0 ? 13 : length;
        const hash = md5 ? md5 : Math.random().toString(36).substr(2);
        const isConnector = leafBlock.isHidden();
        this.onionBlocks.push({
          md5,
          hash,
          length: fakeLength,
          name,
          color,
          start,
          realStart,
          realLength: length,
          gdBlock: leafBlock,
          listName,
          isConnector,
        });

        const { annotations } = leafBlock.sequence;
        for (const annotation of annotations) {
          this.features.push({
            start: annotation.start + start,
            end: annotation.end + start,
            realStart: annotation.start + realStart,
            realEnd: annotation.end + realStart,
            text: annotation.name,
            color: annotation.color ? annotation.color : '#C5C4C1',
          });
        }

        realStart += length;
        start += fakeLength;

      }
    }

    this.onBlockUpdated(0);
  }

  setBlocks(blocks) {
    //
    this.originalBlocks = blocks;
    this.onionBlocks = [];
    this.features = [];
    this.sequenceDict = {};

    let start = 0;
    let realStart = 0;

    for (let block of blocks) {
      const { length, md5 } = block.sequence;
      const { color } = block.metadata;
      const name = block.getName();
      let fakeLength = length === 0 ? 13 : length;
      const hash = md5 ? md5 : Math.random().toString(36).substr(2);
      const isConnector = block.isHidden();
      this.onionBlocks.push({
        md5,
        hash,
        length: fakeLength,
        name,
        color,
        start,
        realStart,
        realLength: length,
        gdBlock: block,
        isConnector,
      });

      const { annotations } = block.sequence;
      for (const annotation of annotations) {
        this.features.push({
          start: annotation.start + start,
          end: annotation.end + start,
          realStart: annotation.start + realStart,
          realEnd: annotation.end + realStart,
          text: annotation.name,
          color: annotation.color ? annotation.color : '#C5C4C1',
        });
      }

      realStart += length;
      start += fakeLength;
    }

    //this.generateFeatures();

    //return this.getSequence();
    this.onBlockUpdated(0);
  }

  getFeatures() {
    return this.features;
  }

  removeBlock(md5) {
    if(this.sequenceDict[md5])
      delete this.sequenceDict[md5];
  }

  setEventBlockUpdated(fn) {
    this.onBlockUpdated = fn;
  }

  // updateAllSequence() {
  //   let completeFlag = true;
  //   for (let i = 0; i < this.onionBlocks.length; i++) {
  //     const { md5, length } = this.onionBlocks[i];
  //     const originalBlock = this.originalBlocks[i];
  //     if (!this.sequenceDict[md5] || this.sequenceDict[md5][0] === 'N') {
  //       completeFlag = false;
  //       if (originalBlock.getSequence) {
  //         //testing
  //         //setTimeout(() => {
  //         console.log('getting',originalBlock.metadata.name);
  //         originalBlock.getSequence()
  //           .then(sequence => {
  //             this.sequenceDict[md5] = sequence;
  //             this.onBlockUpdated(i);
  //           });
  //
  //         //}, Math.random() * 3000 + 1000);
  //         //test end
  //
  //       } else {
  //         this.onBlockUpdated(i);
  //       }
  //     }
  //
  //   }
  //   if (completeFlag === true) {
  //     this.onBlockUpdated();
  //   }
  // }

  updateSequence(blockList) {
    for ( const block of blockList) {
      const { hash } = block;
      if (block.realLength !== 0 && !this.sequenceDict[hash] ) {
        const originalBlock = block.gdBlock;
        if (originalBlock.getSequence) {
          this.sequenceDict[hash] = '~'.repeat(block.length);
          originalBlock.getSequence()
            .then(sequence => {
              this.sequenceDict[hash] = sequence;
              this.onBlockUpdated();
            });
        }
      }
      // else if (this.sequenceDict[md5]) {
      //   delete this.sequenceDict[md5];
      // }
    }
  }

  getSequence() {
    let seq = [];
    let completeFlag = true;
    for (let i = 0; i < this.onionBlocks.length; i++) {
      const { md5, length, realLength } = this.onionBlocks[i];
      if (realLength === 0) {
        //empty block
        seq.push('X'.repeat(length));
      } else if (this.sequenceDict[md5]) {
        seq.push(this.sequenceDict[md5]);
      } else {
        completeFlag = false;
        seq.push('·'.repeat(length));
      }
    }

    return { seq: seq.join(''), completeFlag };
  }

  getBlocks() {
    return this.onionBlocks;
  }

}