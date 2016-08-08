import React from 'react';
import ReactDOM from 'react-dom';
import { OnionGD } from './GD/OnionGD';
import { OnionBuilder } from './GD/OnionBuilder';
import {themeColor} from './GD/defaultValues';
const manifest = require('json!./package.json');

const $ = require('jquery');

/**
 * OnionViewer is the container of the onion components. It reads data from blocks, and converts
 * it to onion format.
 */
class OnionViewer extends React.Component {
  static propTypes = {
    container: React.PropTypes.object,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
  };

  constructor(props) {
    super(props);
    this.state = {
      //dimensions, it's fixed, should be modified by javascript if frame size is changed.
      width: props.width,
      height: props.height,

      // the converted blocks, in onion format.
      blocks: null,
      rendered: Date.now(),

      title: '...',
      sequence: '',
    };

    //onionBuilder is the the converter for GD project, to convert GD blocks to onion blocks
    this.onionBuilder = new OnionBuilder();
    //when new blocks fetched, callback this function to update the editor.
    this.onionBuilder.setEventBlockUpdated(() => {
      const { sequence, completeFlag } = this.onionBuilder.getSequence();
      if (completeFlag || this.allowToRefresh) {
        this.setState({
          sequence,
          blocks: this.onionBuilder.getBlocks(),
        });
      }
    });

    //when system queries new blocks, call onionBuilder to update them.
    this.onQueryNewBlocks = this.onionBuilder.updateSequence.bind(this.onionBuilder);

    this.showBlocks = (blocks) => {

      //use the first block name and color as titleName
      if (blocks && blocks.length > 0) {
        const block = blocks[0];
        const title = block.getName();
        const titleColor = block.metadata.color;

        //put new blocks in to builder, then call getFeatures to get annotations.
        this.onionBuilder.setPlaneBlocks(blocks);

        this.setState({
          title,
          titleColor,
          features: this.onionBuilder.getFeatures(),
        });// =
      }
    }

    /**
     * showBlockRange
     * callback
     * when select some new blocks, use api to get what focused, then get all sub blocks
     * recursively.
     */
    this.showBlockRange = () => {
      const leafBlocks = [];
      const project = window.constructor.api.focus.focusGetProject();
      let projectName = project.getName();

      const topSelectedBlocks = window.constructor.api.focus.focusGetBlockRange();
      const focusedBlocks = window.constructor.api.focus.focusGetBlocks();

      let projectColor = 'black';

      const features = [];

      // set blocks
      if (topSelectedBlocks && topSelectedBlocks[0]) {
        let constructBlock =
          window.constructor.api.blocks.blockGetParentRoot(topSelectedBlocks[0].id);

        if (!constructBlock) {
          constructBlock = topSelectedBlocks[0];
        }

        projectName = constructBlock.getName();
        projectColor = constructBlock.metadata.color;

        this.onionBuilder.setTopLevelBlocks(topSelectedBlocks, focusedBlocks);

        //set annotations
        for (const topBlock of topSelectedBlocks) {
          for (const annotation of topBlock.sequence.annotations) {
            let realStart = annotation.start;
            let realEnd = annotation.end;
            let offset = 0;
            for (const block of leafBlocks) {
              if (block.realStart > annotation.start) {
                break;
              }

              if (block.realLength === 0) {
                offset += 13;
              }
            }

            let fakeStart = realStart + offset;
            let fakeEnd = realEnd + offset;

            features.push({
              start: fakeStart,
              end: fakeEnd,
              realStart,
              realEnd,
              text: annotation.name,
              strand: annotation.isForward ? '+' : '-',
              color: annotation.color ? annotation.color : themeColor.defaultFeatureColor,
            });
          }
        }

        this.setState({
          title: projectName, //topSelectedBlocks[0].getName(),
          titleColor: projectColor,//topSelectedBlocks[0].metadata.color,
          features,
        });
      }

    }

    //subscribe extension
    window.constructor.store.subscribe((state, lastAction) => {
      //console.log(lastAction.type);
      //FOCUS_BLOCKS: click on some block, need to refresh
      //BLOCK_SET_COLOR: change a block color, need to refresh
      //BLOCK_RENAME: rename, refresh
      //FOCUS_BLOCK_OPTION: click on a template item, refresh
      //FOCUS_FORCE_BLOCKS: click on an inventory block.
      //BLOCK_SET_SEQUENCE: new sequence set to a block, remove cached sequence, then refresh.
      if (lastAction.type === 'FOCUS_BLOCKS'
        || lastAction.type === 'BLOCK_SET_COLOR'
        || lastAction.type === 'BLOCK_RENAME'
        || lastAction.type === 'FOCUS_BLOCK_OPTION'
      ) {
        this.showBlockRange();
      } else if (lastAction.type === 'FOCUS_FORCE_BLOCKS') {
        const blocks = window.constructor.api.focus.focusGetBlocks();
        this.showBlocks(blocks);
      } else if (lastAction.type === 'BLOCK_SET_SEQUENCE') {
        const block = lastAction.block;
        this.onionBuilder.removeBlock(block.sequence.md5);
        this.showBlockRange();
      }
    });

    this.setCallBack();

  }

  componentWillMount() {

  }

  componentDidMount() {
    window.addEventListener('resize', this.updateDimensions);
    this.allowToRefresh = true;
    this.showBlockRange();
  }

  componentDidUpdate() {
    const _this = this;
    setTimeout(() => {_this.allowToRefresh = true;}, 1000);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  setCallBack() {
    //read dimensions of onion container
    this.updateDimensions = () => {
      const _width = $('.ExtensionView-content').width();
      const _height = $('.ExtensionView-content').height();
      const width = Math.max(300, _width);
      const height = Math.max(100, _height);
      this.setState({ width, height });
    };
  }

  render() {
    const { sequence, title, titleColor, features, blocks, width, height } = this.state;
    //console.log('render dimensions', width, height);
    return (
      <OnionGD
        sequence={sequence}
        features={features}
        width={width}
        height={height}
        blocks={blocks}
        menuTitle={title}
        titleColor={titleColor}
        onQueryNewBlocks={this.onQueryNewBlocks}
      />
    );
  }
} // end of OnionViewer

/**
 * the function framework calls, it's a main()
 * @param container
 * @param options
 */
function onionMain(container, options) {
  container.className += ' onionContainer';
  const { left, top, width, height } = options.boundingBox;
  ReactDOM.render(<OnionViewer
    container={container}
    left={left}
    top={top}
    width={width}
    height={height}
  />, container);

}

//register "onionMain" as the main function.
window.constructor.extensions.register('SequenceDetail', onionMain);
