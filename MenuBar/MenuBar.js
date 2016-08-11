/**
 * Created by luoyi on 1/12/2016.
 */
import React from 'react';
import { EyeIcon } from './EyeIcon';
import '../css/Onion.css';
import jQuery from 'jquery';
const $ = jQuery;

/**
 * SequenceEditor Menu
 * The layer choosing menu, show or hide some layer
 */
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
    titleColor: React.PropTypes.string,
  };
  static defaultProps = {
    title: 'block',
    titleColor: '#000000',
  };

  constructor(props) {
    super(props);
    this.initCallBack();
  }

  initCallBack() {
    this.onSelect = (e) => {
      const { onSelect } = this.props;

      let target = e.target;
      while (target.nodeName.toUpperCase() !== 'A') {
        target = target.parentNode;
      }

      //I don't know why $.data() always returns true;
      //const value = $target.data('val');
      const cmd = target.getAttribute('data-cmd');
      const value = target.getAttribute('data-val') === 'true';
      //console.log(value);
      onSelect(cmd, !value);
    };
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
      titleColor,
    } = this.props;
    const layerMenuItem = (text, cmd, value, padding = '0px 10px') =>
      (
        <div
          style={{
            display: 'inline-block',
            lineHeight: '30px',
            verticalAlign: 'top',
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
    //{layerMenuItem('Enzymes', 'showEnzymes', showEnzymes)}
    return (
      <div>
        <div
          style={{
            height: 30,
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontSize: 12,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'inline-block',
              width: '100%',
              height: '100%',
              borderStyle: 'none none solid none',
              borderWidth: '1',
              borderColor: '#dadbdf',
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
            />, 'showAll', showAll, '0px 0px 0px 10px')}
            {layerMenuItem('Features', 'showFeatures', showFeatures)}
            {layerMenuItem('Reverse Strand', 'showRS', showRS)}

            {layerMenuItem('Amino Acids', 'showAA', showAA)}
            {layerMenuItem('Ruler', 'showRuler', showRuler)}
          </div>
        </div>
        <div
          style={{
            padding: 8,
            //color: '#8EC78D',
            color: titleColor,
            fontSize: 20,
            height: 36,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </div>
      </div>
    );
  }
}
