import React from 'react';

export class NumericControl extends React.Component
{
  static propTypes = {
    value: React.PropTypes.number,
    style: React.PropTypes.object,
    valueBoxStyle: React.PropTypes.object,
    upDownStyle: React.PropTypes.object,
    onChange: React.PropTypes.func,

  };

  static defaultProps = {
    style: {

    },
    valueBoxStyle: {
      background: '#ffffff',
      borderWidth: 0,
      textAlign: 'right',
    },
    upDownStyle: {
      height: 20,
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };
  }

  componentWillReceiveProps(np) {
    this.state = {
      value: np.value,
    };
  }

  onChange(e) {
    const newValue = e.target.value;
    let update = true;
    if (this.props.onChange) {
      update = this.props.onChange(this, newValue, e);
    }

    if (update) {
      this.setState({ value: newValue });
    }
  }

  onPlus(n, e) {
    const newValue = this.state.value + n;
    let update = true;
    if (this.props.onChange) {
      update = this.props.onChange(this, newValue, newValue);
    }

    if (update) {
      this.setState({ value: newValue });
    }
  }

  render() {
    const { style, valueBoxStyle } = this.props;
    let { upDownStyle } = this.props;
    upDownStyle = Object.assign({
      display: 'inline-block',
      padding: 0,
      verticalAlign: 'middle',
    }, upDownStyle);

    const value = this.state.value;
    return (
      <div
        style = {Object.assign({
          display: 'inline-block',
          verticalAlign: 'middle',
        }, style)}
      >
        <input
          type="text"
          style = {Object.assign({
            display: 'inline-block',
          }, valueBoxStyle)} value = {value} size="5"
          onChange={this.onChange.bind(this)}
        />
        <div
          style = {upDownStyle}
        >
          <svg width="18" height="20">
            <g onClick={this.onPlus.bind(this, 1)} >
              <path d="M 5 7 L 9 3 L 13 7" fill="none" stroke="#757884"/>
              <rect width="18" height="10" strokeWidth="0" fill="rgba(127,127,127,0.001)"/>
            </g>
            <g onClick={this.onPlus.bind(this, -1)} >
              <path d="M 5 13 L 9 17 L 13 13" fill="none" stroke="#757884"/>
              <rect y="10" width="18" height="10" strokeWidth="0" fill="rgba(127,127,127,0.001)"/>
            </g>

          </svg>
        </div>

      </div>
    );
  }

}
