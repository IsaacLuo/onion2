/**
 * Created by luoyi on 1/12/2016.
 */
import React from 'react';
import { EyeIcon } from './MenuBar/EyeIcon';
import './css/Onion.css';
import jQuery from 'jquery';
const $ = jQuery;

//SequenceEditor Menu
export class MenuBar extends React.Component {
  static propTypes = {
    title: React.PropTypes.string,
    showEnzymes: React.PropTypes.bool,
    showRS: React.PropTypes.bool,
    showFeatures: React.PropTypes.bool,
    showRuler: React.PropTypes.bool,
    showBlockBar: React.PropTypes.bool,
    onSelect: React.PropTypes.func,
    showAA: React.PropTypes.bool,
  };
  static defaultProps = {
    title: 'Block',
  };

  constructor(props) {
    super(props);
    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(e) {
    const { onSelect } = this.props;

    let target = e.target;
    while (target.nodeName.toUpperCase() !== 'A') {
      target = target.parentNode;
    }

    //I don't know why $.data() always returns true;
    //const value = $target.data('val');
    const cmd = target.getAttribute('data-cmd');
    const value = target.getAttribute('data-val') === 'true';
    console.log(value);
    onSelect(cmd, !value);
  }

  render() {
    const {
      title,
      showEnzymes,
      showRS,
      showFeatures,
      showRuler,
      showBlockBar,
      showAA,
    } = this.props;
    const layerMenuItem = (text, cmd, value, padding = '10px 10px') =>
      (
        <div
          style={{
            display: 'inline-block',
            padding,
          }}
        >
          <a
            style={{
              color: value ? '#4c505f' : '#b3b3b3',
              cursor: 'pointer',
            }}
            data-cmd={cmd}
            data-val={value}
            onClick={this.onSelect}
          >
            {text}
          </a>
        </div>
      );

    const showAll = showEnzymes && showRS && showFeatures && showRuler && showBlockBar && showAA;
    return (
      <div>
        <div
          style={{
            height: 43,
            fontSize: '0.9rem',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              width: '100%',
              height: '100%',
              borderStyle: 'none none solid none',
              borderWidth: '1',
              textAlign: 'right',
              verticalAlign: 'top',
            }}
          >
            <div
              style={{
                display: 'inline-block',
                width: 20,
                height: 'calc(100% + 1px)',
                verticalAlign: 'top',
                borderStyle: 'none none solid none',
                borderWidth: 1,
                borderColor: 'white',
              }}
            ></div>
            {layerMenuItem(<EyeIcon
              stroke={showAll ? '#4c505f' : '#b3b3b3'}
            />, 'showAll', showAll, '10px 0px 10px 10px')}
            {layerMenuItem('Features', 'showFeatures', showFeatures)}
            {layerMenuItem('Reverse Strand', 'showRS', showRS)}
            {layerMenuItem('Enzymes', 'showEnzymes', showEnzymes)}
            {layerMenuItem('Amino Acids', 'showAA', showAA)}
            {layerMenuItem('Ruler', 'showRuler', showRuler)}
          </div>
        </div>
        <div
          style={{
            paddingTop: 8,
            paddingLeft: 8,
            paddingBottom: 8,
            color: '#8EC78D',
            fontSize: 20,
          }}
        >
          {title}
        </div>
      </div>
    );
  }
}
