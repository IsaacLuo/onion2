import React from 'react';
import { render as reactRender } from 'react-dom';

import {OnionForGenomeDesigner} from './OnionForGenomeDesigner';
var manifest = require('json!./package.json');

class OnionViewer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            width: props.container.offsetWidth,
            height: props.container.offsetHeight,
        };
        //console.log(this.enzymeList);
    }

    componentWillMount() {
        const self = this;
        let lastBlock;

        this.setState({
            block: null,
            rendered: Date.now(),

        });
        console.log("componentwillmount");
        const storeSubscriber = (store) => {
            const { currentBlocks } = store.ui;
            //console.log("--block",store.ui);
            const block = (Array.isArray(currentBlocks) && currentBlocks.length) ? store.blocks[currentBlocks[0]] : null;
            // all instances in the store are immutables, so you can just do a reference equality check to see if it has changed
            // this would also be a good place to convert to the onion format
            // it would be a great place to memoize
            // (i.e. return same value if input === previous input, rather than storing it explicitly in the component,
            // and then you can reuse the selector for all things you retrieve from the store)
            //if (!!block && block !== lastBlock) {
            //  //note that right now, blocks dont have a sequence... this will work but nothing will be returned
            //  block.getSequence()
            //    .then(sequence => {
            //      self.setState({
            //        blocks,
            //        sequence,
            //      });
            //    });
            //  lastBlock = block;
            //}

            if(Array.isArray(currentBlocks) && currentBlocks.length) {
                let readBlockCount = currentBlocks.length;
                let onionBlocks = [];
                let start = 0;
                let totalSequence = "";
                let readSequenceFromBlock = (i,count)=>{
                    let block = store.blocks[currentBlocks[i]];
                    block.getSequence().then(sequence=>{
                        if(sequence) {
                            onionBlocks.push({
                                color: block.metadata.color,
                                start: start,
                                length: sequence.length,
                            });
                            start += sequence.length;
                            totalSequence += sequence;
                            if (i == count - 1) {
                                this.setState({blocks: onionBlocks, sequence: totalSequence});
                            }
                            else {
                                readSequenceFromBlock(i + 1, count);
                            }
                        }
                    });
                };
                readSequenceFromBlock(0,readBlockCount);
            }
            else{
                console.log("no block");
            }
        };
        this.subscriber = window.gd.store.subscribe(storeSubscriber);
    }

    updateDimensions(){
        //let width = this.props.container.offsetWidth;
        let width = $(".onionContainer").width();
        console.log("updateDimensions:",this.props.container,width);
        this.setState({width: width});
    }

    componentDidMount() {
        console.log("componentDidMount:");
        window.addEventListener("resize", this.updateDimensions.bind(this));
        this.updateDimensions();
    }

    componentWillUnmount() {
        this.subscriber();
        window.removeEventListener("resize", this.updateDimensions.bind(this));
    }

    render() {
        let {sequence,features,width,height,blocks} = this.state;
        //can't read correct width and height, I don't know why.
        return (
            <OnionForGenomeDesigner
                sequence={sequence}
                features={features}
                width={800}
                height={300}
                blocks={blocks}
            ></OnionForGenomeDesigner>
        )
    }
}

/* register with store */
//note that if you were using redux, you could wrap your component in a Provider, and pass in window.gd.store
//we'll just register directly for this example

/* rendering + registering extension */

//const render = (container) => {
//    container.className += " onionContainer";
//    reactRender(<OnionViewer
//        container={container}
//    />, container);
//};

const render = (container)=>{
    container.className += " onionContainer";
    reactRender(<OnionViewer
        container={container}
    />, container);
}

window.gd.registerExtension(manifest, render);

