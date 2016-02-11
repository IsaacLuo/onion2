import React from 'react';
import ReactDOM from 'react-dom';
import {OnionForGenomeDesigner} from './OnionForGenomeDesigner';
let manifest = require('json!./package.json');

// OnionViewer reads data from blocks, and converts it to onion format.
class OnionViewer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: props.container.offsetWidth,
      height: props.container.offsetHeight,
    };
  }

  componentWillMount() {
    this.setState({
      block: null,
      rendered: Date.now(),
    });
    console.log("componentwillmount");

    var subscriber = window.gd.store.subscribe(function (state, lastAction) {
      var last = [];
      var current = state.ui.currentBlocks;
      if (current &&
        current.length &&
        (current.length !== last.length || !current.every(function (item, index) {
          return item !== last[index];
        }))
      ) {
        let currentBlocks = current;
        let readBlockCount = currentBlocks.length;
        let onionBlocks = [];
        let start = 0;
        let totalSequence = "";

        let readSequenceFromBlock = (i, count)=> {
          let block = state.blocks[currentBlocks[i]];

          block.getSequence().then(sequence=> {
            if (sequence) {
              onionBlocks.push({
                color: block.metadata.color,
                start: start,
                length: sequence.length,
              });
              start += sequence.length;
              totalSequence += sequence;
              if (i == count - 1) {
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
    console.log("componentDidMount:");
    window.addEventListener("resize", this.updateDimensions.bind(this));

  }

  componentWillUnmount() {
    this.subscriber();
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }

  render() {
    let { sequence, features, width, height, blocks } = this.state;
    //can't read correct width and height, I don't know why.
    return (
      <OnionForGenomeDesigner
        sequence={sequence}
        features={features}
        width={width}
        height={400}
        blocks={blocks}
      ></OnionForGenomeDesigner>
    );
  }

  //read dimensions of onion container
  updateDimensions() {
    let width = $(".onionContainer").width();
    let height = $(".onionContainer").height();
    width = Math.max(100, width);
    height = Math.max(100, height);
    console.log("updateDimensions:", this.props.container, width, height);
    this.setState({ width: width });
  }

}

const render = (container)=> {
  container.className += " onionContainer";
  ReactDOM.render(<OnionViewer
    container={container}
  />, container);
};

window.gd.registerExtension(manifest, render);

