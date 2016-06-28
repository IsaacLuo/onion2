import React from 'react';
import ReactDOM from 'react-dom';
import { OnionForGenomeDesigner } from './OnionForGenomeDesigner';
import { OnionBuilder } from './GD/OnionBuilder';
const manifest = require('json!./package.json');

const $ = require('jquery');



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
      title: '...',
      sequence: '',
    };
    this.onionBuilder = new OnionBuilder();
    this.onionBuilder.setEventBlockUpdated( () => {
      console.log('!!!!!!sequence loaded', this.onionBuilder.getSequence());
      const { seq, completeFlag } = this.onionBuilder.getSequence();
      if (completeFlag || this.allowToRefresh) {
        this.setState({
          sequence: seq,
          blocks: this.onionBuilder.getBlocks(),
        });
      }
    });

    this.onQueryNewBlocks = this.onionBuilder.updateSequence.bind(this.onionBuilder);

    this.getChildrenRecursive = (id) => {
      gd.api.blocks.blockFlattenConstructAndLists(id)
    };

    this.showBlockRange = () => {
      let leafBlocks = [];
      const topSelectedBlocks = window.gd.api.focus.focusGetBlockRange();
      if (topSelectedBlocks && topSelectedBlocks.length) {
        this.setState({
          title: topSelectedBlocks[0].metadata.name,
          titleColor: topSelectedBlocks[0].metadata.color,
        });// =
        for (let block of topSelectedBlocks) {
          //const children = window.gd.api.blocks.blockGetChildrenRecursive(block.id);
          const children = gd.api.blocks.blockFlattenConstructAndLists(block.id);

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
      console.log(lastAction.type);
      if (lastAction.type === 'FOCUS_BLOCKS'
        || lastAction.type === 'BLOCK_SET_COLOR'
        || lastAction.type === 'BLOCK_RENAME'
          || lastAction.type ==='FOCUS_BLOCK_OPTION'
      ) {
        this.showBlockRange();
      } 
      else if (lastAction.type === 'FOCUS_FORCE_BLOCKS'){
        const blocks = window.gd.api.focus.focusGetBlocks();
        this.showBlockRange();
      } else if (lastAction.type === 'BLOCK_SET_SEQUENCE') {
        const block = lastAction.block;
        this.onionBuilder.removeBlock(block.sequence.md5);
        this.showBlockRange();
      }
    });



  }

  componentWillMount() {
    // console.log('componentwillmount');
    //this.updateDimensions();

  }

  componentDidMount() {
    // console.log('componentDidMount:');


    window.addEventListener('resize', this.updateDimensions.bind(this));
    //let target = $('.ProjectDetail-chrome').get(0);
    //target.addEventListener('resize', this.updateDimensions.bind(this));
    this.allowToRefresh = true;
    this.showBlockRange();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  componentDidUpdate() {
    const _this = this;
    setTimeout(() => {_this.allowToRefresh = true;}, 1000);
  }

  //read dimensions of onion container
  updateDimensions() {
    const { container } = this.props;
    const _width = $('.ProjectDetail-chrome').width();
    const _height = $('.ProjectDetail-chrome').height();
    let height2 = $('.ProjectDetail-chrome').get(0).getBoundingClientRect().height;
    const width = Math.max(300, _width);
    const height = Math.max(100, _height);
    console.log('updateDimensions:', container, width, height, height2);
    this.setState({ width, height });
  }

  render() {
    const { sequence, title, titleColor, features, blocks, width, height } = this.state;
    //console.log('render dimensions', width, height);
    return (
      <OnionForGenomeDesigner
        sequence={sequence}
        features={this.onionBuilder.getFeatures()}
        width={width}
        height={height}
        blocks={blocks}
        menuTitle={title}
        titleColor={titleColor}
        onQueryNewBlocks={this.onQueryNewBlocks}
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
