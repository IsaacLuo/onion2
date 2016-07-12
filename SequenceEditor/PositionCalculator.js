/**
 * Created by luoyi on 13/04/2016.
 */
export class PositionCalculator
{

  constructor(blocks) {
    this.blocks = blocks;
  }

  findBlockByIndex(_index) {
    const index = _index<0 ? 0 : _index;
    if (this.blocks && this.blocks.length) {
      const lastBlock = this.blocks[this.blocks.length - 1];
      if (index === lastBlock.start + lastBlock.length) {
        return lastBlock;
      } else {
        for (const block of this.blocks) {
          if (index >= block.start && index < block.start + block.length) {
            return block;
          }
        }
      }
    }
    return null;
  }

  findBlockByIndexReal(_index) {
    const index = _index<0 ? 0 : _index;
    if (this.blocks && this.blocks.length) {
      const lastBlock = this.blocks[this.blocks.length - 1];
      if (index === lastBlock.realStart + lastBlock.realLength) {
        return lastBlock;
      } else {
        for (const block of this.blocks) {
          if (index >= block.realStart && index < block.realStart + block.realLength) {
            return block;
          }
        }
      }
    }
    return null;
  }

  uiPosToRealPos(index) {
    const currentBlock = this.findBlockByIndex(index);
    if (currentBlock) {
      if (currentBlock.realLength === 0) {
        return currentBlock.realStart;
      } else {
        const offset = index - currentBlock.start;
        return currentBlock.realStart + offset;
      }
    }
    return index;
  }

  realPosTouiPos(index) {
    const currentBlock = this.findBlockByIndexReal(index);
    if (currentBlock) {
      const offset = index - currentBlock.realStart;
      return currentBlock.start + offset;
    }
    return index;
  }


}
