import React from 'react';
import ReactDOM from 'react-dom';
import { OnionForYeastfab } from './OnionForYeastfab';
const manifest = require('json!./package.json');

const $ = require('jquery');

global.renderOnion = (container, props) => {

  const myProps = Object.assign({
    width: 800,
    height: 800,
  },props);

  ReactDOM.render(<OnionForYeastfab
    {...props}
  />, container);
}
