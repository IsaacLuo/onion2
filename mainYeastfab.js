import React from 'react';
import ReactDOM from 'react-dom';
import { OnionForYeastfab } from './OnionForYeastfab';
const manifest = require('json!./package.json');

const $ = require('jquery');

global.renderOnion = (container, param) => {
  const { sequence, features, width, height} = param;
  ReactDOM.render(<OnionForYeastfab
    sequence={sequence}
    features={features}
    width={800}
    height={800}
  />, container);
}
