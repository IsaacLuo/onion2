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
      width: props.width,
      height: props.height,
      block: null,
      rendered: Date.now(),
    };

    window.gd.store.subscribe((state, lastAction) => {
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
          console.log(block);

          block.getSequence().then(sequence => {
            if (sequence) {
              onionBlocks.push({
                color: block.metadata.color,
                start,
                length: sequence.length,
                name: block.metadata.name,
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

  }

  componentWillMount() {
    console.log('componentwillmount');



    //this.updateDimensions();
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
    const _width = $('.onionContainer').width();
    const _height = $('.onionContainer').height();
    const width = Math.max(100, _width);
    const height = Math.max(100, _height);
    console.log('updateDimensions:', container, width, height);
    this.setState({ width, height });
  }

  render() {
    const { sequence, features, blocks, width, height } = this.state;
    //console.log('render dimensions', width, height);
    return (
      <OnionForGenomeDesigner
        sequence={sequence}
        features={features}
        width={width}
        height={height}
        blocks={blocks}
      />
    );
  }
}

function render(container, options) {
  container.className += ' onionContainer';

  console.log(options.boundingBox);
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
