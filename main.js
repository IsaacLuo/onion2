import React from 'react';
import ReactDOM from 'react-dom';
import { OnionForGenomeDesigner } from './OnionForGenomeDesigner';
const manifest = require('json!./package.json');

const $ = require('jquery');

class OnionBuilder {
  constructor() {
    this.sequenceDict = {};
    this.onionBlocks = [];
    this.features = [];
  }

  setBlocks(blocks) {
    this.originalBlocks = blocks;
    this.onionBlocks = [];
    this.features = [];

    let start = 0;
    let realStart = 0;
    for (const block of blocks) {
      const { length, md5 } = block.sequence;
      const { name, color } = block.metadata;
      let fakeLength = length === 0 ? 13 : length;
      this.onionBlocks.push({
        md5,
        length: fakeLength,
        name,
        color,
        start,
        realStart,
        realLength: length,
      });

      const { annotations } = block.sequence;
      for (const annotation of annotations) {
        this.features.push({
          start: annotation.start + start,
          end: annotation.end + start,
          realStart: annotation.start + realStart,
          realEnd: annotation.end + realStart,
          text: annotation.name,
          color: annotation.color ? annotation.color : '#A5A6A2',
        });
      }

      realStart += length;
      start += fakeLength;
    }

    //this.generateFeatures();

    return this.updateSequence();
  }

  getFeatures() {
    return this.features;
  }

  setEventBlockUpdated(fn) {
    this.onBlockUpdated = fn;
  }

  updateSequence() {
    let completeFlag = true;
    for (let i = 0; i < this.onionBlocks.length; i++) {
      const { md5, length } = this.onionBlocks[i];
      const originalBlock = this.originalBlocks[i];
      if (!this.sequenceDict[md5] || this.sequenceDict[md5][0] === 'N') {
        completeFlag = false;
        if (originalBlock.getSequence) {
          //testing
          //setTimeout(() => {
            originalBlock.getSequence()
              .then(sequence => {
                this.sequenceDict[md5] = sequence;
                this.onBlockUpdated(i);
              });

          //}, Math.random() * 3000 + 1000);
          //test end

        } else {
          //getSequenceDoesn't exist
          // this.sequenceDict[md5] = 'N'.repeat(length);
           this.onBlockUpdated(i);
        }
      }

    }
    if (completeFlag === true) {
      this.onBlockUpdated();
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

// OnionViewer reads data from blocks, and converts it to onion format.
class OnionViewer extends React.Component {
  static propTypes = {
    container: React.PropTypes.object,
  };

  constructor(props) {
    super(props);
    const { container } = props;
    this.state = {
      width: props.width,
      height: props.height,
      block: null,
      rendered: Date.now(),
    };
    this.onionBuilder = new OnionBuilder();
    this.onionBuilder.setEventBlockUpdated( () => {
      // console.log('!!!!!!sequence loaded', this.onionBuilder.getSequence());
      const { seq, completeFlag } = this.onionBuilder.getSequence();
      if (completeFlag || this.allowToRefresh) {
        this.setState({
          sequence: seq,
          blocks: this.onionBuilder.getBlocks(),
        });
      }
    });

    this.showBlockRange = () => {
      let leafBlocks = [];
      const topSelectedBlocks = window.gd.api.focus.focusGetBlockRange();
      if (topSelectedBlocks && topSelectedBlocks.length) {
        for (let block of topSelectedBlocks) {
          const children = window.gd.api.blocks.blockGetChildrenRecursive(block.id);
          if (children && children.length === 0 ) {
            leafBlocks.push(block);
          } else {
            for (let node of children) {
              if (node.components && node.components.length === 0) {
                leafBlocks.push(node);
              }
            }
          }
        }
      }
      this.onionBuilder.setBlocks(leafBlocks);
    };

    window.gd.store.subscribe((state, lastAction) => {
      //console.log(`lastAction,`, lastAction);
      //console.log(lastAction.type);
      if (lastAction.type === 'FOCUS_BLOCKS') {
        this.showBlockRange();
      } else if (lastAction.type === 'FOCUS_FORCE_BLOCKS') {
        const blocks = window.gd.api.focus.focusGetBlocks();
        this.onionBuilder.setBlocks(blocks);
      }
    });

  }

  componentWillMount() {
    // console.log('componentwillmount');
    //this.updateDimensions();
    this.showBlockRange();
  }

  componentDidMount() {
    // console.log('componentDidMount:');


    window.addEventListener('resize', this.updateDimensions.bind(this));
    //let target = $('.ProjectDetail-chrome').get(0);
    //target.addEventListener('resize', this.updateDimensions.bind(this));
    this.allowToRefresh = true;
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  componentDidUpdate() {
    setTimeout(() => {this.allowToRefresh = true;}, 1000);
  }

  //read dimensions of onion container
  updateDimensions() {
    const { container } = this.props;
    const _width = $('.ProjectDetail-chrome').width();
    const _height = $('.ProjectDetail-chrome').height();
    let height2 = $('.ProjectDetail-chrome').get(0).getBoundingClientRect().height;
    const width = Math.max(300, _width);
    const height = Math.max(100, _height);
    // console.log('updateDimensions:', container, width, height, height2);
    this.setState({ width, height });
  }

  render() {
    const { sequence, features, blocks, width, height } = this.state;
    //console.log('render dimensions', width, height);
    return (
      <OnionForGenomeDesigner
        sequence={sequence}
        features={this.onionBuilder.getFeatures()}
        width={width}
        height={height}
        blocks={blocks}
      />
    );
  }
}

function render(container, options) {
  container.className += ' onionContainer';

  // console.log(options.boundingBox);
  const { left, top, width, height } = options.boundingBox;
  ReactDOM.render(<OnionViewer
    container={container}
    left={left}
    top={top}
    width={width}
    height={height}
  />, container);

  //var subscriber = window.gd.store.subscribe(function (state, lastAction) {
  //  var last = [];
  //  var current = state.ui.currentBlocks;
  //  if (current &&
  //    current.length &&
  //    (current.length !== last.length ||
  //    !current.every(function (item, index) {return item !== last[index]}))
  //  ) {
  //
  //    var block = state.blocks[current[0]];
  //    block.getSequence().then(function (sequence) {
  //      console.log(sequence);
  //    });
  //
  //    console.log(current);
  //    last = current;
  //  }
  //});


}

window.gd.registerExtension(manifest, render);
