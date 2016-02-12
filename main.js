import React from 'react';
import ReactDOM from 'react-dom';
import { OnionForGenomeDesigner } from './OnionForGenomeDesigner';
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
      width: container.offsetWidth,
      height: container.offsetHeight,
      block: null,
      rendered: Date.now(),
    };

    console.log('componentwillmount');

    window.gd.store.subscribe(
      (state, lastAction) => {
        let last = [];
        const current = state.ui.currentBlocks;
        if (current &&
          current.length &&
          (current.length !== last.length
            || !current.every((item, index) => item !== last[index])
          )) {
          const currentBlocks = current;
          const readBlockCount = currentBlocks.length;
          const onionBlocks = [];
          let start = 0;
          let totalSequence = '';

          const readSequenceFromBlock = (i, count) => {
            const block = state.blocks[currentBlocks[i]];

            block.getSequence().then(sequence => {
              if (sequence) {
                onionBlocks.push({
                  color: block.metadata.color,
                  start,
                  length: sequence.length,
                });
                start += sequence.length;
                totalSequence += sequence;
                if (i === count - 1) {
                  this.setState({ blocks: onionBlocks, sequence: totalSequence });
                } else {
                  readSequenceFromBlock(i + 1, count);
                }
              }
            });
          };

          readSequenceFromBlock(0, readBlockCount);

          last = current;
        }
      });

    this.updateDimensions();
  }

  componentDidMount() {
    console.log('componentDidMount:');
    window.addEventListener('resize', this.updateDimensions.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions.bind(this));
  }

  //read dimensions of onion container
  updateDimensions() {
    const { container } = this.props;

    let width = $('.onionContainer').width();
    let height = $('.onionContainer').height();
    width = Math.max(100, width);
    height = Math.max(100, height);
    console.log('updateDimensions:', container, width, height);
    this.setState({ width, height });
  }

  render() {
    const { sequence, features, width, height, blocks } = this.state;
    //can't read correct width and height, I don't know why.
    console.log('render dimensions', width, height);
    return (
      <OnionForGenomeDesigner
        sequence={sequence}
        features={features}
        width={width}
        height={400}
        blocks={blocks}
      />
    );
  }
}

const render = (_container) => {
  const container = _container;
  container.className += ' onionContainer';
  ReactDOM.render(<OnionViewer
    container={container}
  />, container);
};

window.gd.registerExtension(manifest, render);
