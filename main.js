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
      //console.log('!!!!!!sequence loaded', this.onionBuilder.getSequence());
      const { seq, completeFlag } = this.onionBuilder.getSequence();
      if (completeFlag || this.allowToRefresh) {
        this.setState({
          sequence: seq,
          blocks: this.onionBuilder.getBlocks(),
        });
      }
    });

    this.onQueryNewBlocks = this.onionBuilder.updateSequence.bind(this.onionBuilder);


    this.showBlocks = (blocks) => {
      if(blocks && blocks.length>0) {
        const block  = blocks[0];
        const projectName = block.getName();
        const projectColor = block.metadata.color;

        this.onionBuilder.setPlaneBlocks(blocks);

        this.setState({
          title: projectName, //topSelectedBlocks[0].getName(),
          titleColor: projectColor,//topSelectedBlocks[0].metadata.color,
          features: this.onionBuilder.getFeatures(),
        });// =
      }
    }

    this.showBlockRange = () => {
      let leafBlocks = [];
      const project = window.constructor.api.focus.focusGetProject();
      let projectName = project.getName();

      const topSelectedBlocks = window.constructor.api.focus.focusGetBlockRange();
      const focusedBlocks = window.constructor.api.focus.focusGetBlocks();

      let projectColor = "black";
      if(topSelectedBlocks && topSelectedBlocks[0]) {
        let constructBlock = window.constructor.api.blocks.blockGetParentRoot(topSelectedBlocks[0].id)
        if (!constructBlock) {
          constructBlock = topSelectedBlocks[0];
        }
        projectName = constructBlock.getName();
        projectColor = constructBlock.metadata.color;

      }
      let features = [];

      if (topSelectedBlocks && topSelectedBlocks.length) {

        this.onionBuilder.setTopLevelBlocks(topSelectedBlocks, focusedBlocks);

        //set annotations
        for(const topBlock of topSelectedBlocks){
          for (const annotation of topBlock.sequence.annotations) {
            let realStart = annotation.start;
            let realEnd = annotation.end;
            let offset = 0;
            for (const block of leafBlocks){
              if(block.realStart > annotation.start)
                  break;
              if(block.realLength === 0) {
                offset+=13;
              }
            }

            let fakeStart = realStart + offset;
            let fakeEnd = realEnd + offset;

            features.push({
              start: fakeStart,
              end: fakeEnd,
              realStart: realStart,
              realEnd: realEnd,
              text: annotation.name,
              strand: annotation.isForward ? '+' : '-',
              color: annotation.color ? annotation.color : '#C5C4C1',
            });
          }
        }

        this.setState({
          title: projectName, //topSelectedBlocks[0].getName(),
          titleColor: projectColor,//topSelectedBlocks[0].metadata.color,
          features,
        });// =

      }


    };

    window.constructor.store.subscribe((state, lastAction) => {
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
        const blocks = window.constructor.api.focus.focusGetBlocks();
        this.showBlocks(blocks);
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
    const _width = $('.ExtensionView-content').width();
    const _height = $('.ExtensionView-content').height();
    const width = Math.max(300, _width);
    const height = Math.max(100, _height);
    this.setState({ width, height });
  }

  render() {
    const { sequence, title, titleColor, features, blocks, width, height } = this.state;
    //console.log('render dimensions', width, height);
    return (
      <OnionForGenomeDesigner
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


}

window.constructor.extensions.register('SequenceDetail', 'projectDetail', render);
