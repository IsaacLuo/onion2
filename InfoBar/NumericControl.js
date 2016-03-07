import React from 'react';

export class NumericControl extends React.Component
{
  static propTypes = {
    value: React.PropTypes.number,
    style: React.PropTypes.object,
    valueBoxStyle: React.PropTypes.object,
    upDownStyle: React.PropTypes.object,
    onChange: React.PropTypes.func,
    showValue: React.PropTypes.bool,
    minValue: React.PropTypes.number,
    maxValue: React.PropTypes.number,
  };

  static defaultProps = {
    style: {
    },
    valueBoxStyle: {
      background: '#ffffff',
      color: '#3b3e4c',
      borderWidth: 0,
      textAlign: 'right',
    },
    upDownStyle: {
      height: 20,
    },
    minValue: -Number.MAX_SAFE_INTEGER,
    maxValue: Number.MAX_SAFE_INTEGER,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
      showValue: props.showValue,
    };

    this.initCallBack();
  }

  componentWillReceiveProps(np) {
    if (this.state.value != np.value) {
      this.state.value = np.value;
    }
    if (this.state.showValue != np.showValue) {
      this.state.showValue = np.showValue;
    }

  }

  initCallBack() {
    this.onFocus = (e) => {
      e.target.select();
    }
    this.onChange = (e) => {
      this.setState({ value: e.target.value, showValue: true });
    };

    this.onBlur = (e) => {
      if (this.props.onChange) {
        const { value, minValue, maxValue } = this.props;
        let newValue = parseInt(e.target.value, 10);
        if (!newValue) {
          newValue = value;
        } else {
          if (newValue > maxValue) {
            newValue = maxValue;
          } else if (newValue < minValue) {
            newValue = minValue;
          }
        }
        this.props.onChange(this, newValue, e);
      }
    };

    this.onKeyPress = (e) => {
      if (e.which === 13) {
        this.onBlur(e);
        e.target.select();
      }
    };

    this.onPlus = (e) => {
      const newValue = this.state.value + 1;
      let update = true;
      if (this.props.onChange) {
        update = this.props.onChange(this, newValue, newValue);
      }

      if (update) {
        this.setState({ value: newValue, showValue: true });
      }
    };

    this.onMinus = (e) => {
      const newValue = this.state.value - 1;
      let update = true;
      if (this.props.onChange) {
        update = this.props.onChange(this, newValue, newValue);
      }

      if (update) {
        this.setState({ value: newValue, showValue: true });
      }
    };
  }

  render() {
    const { style, valueBoxStyle } = this.props;
    const { showValue } = this.state;
    let { upDownStyle } = this.props;
    upDownStyle = Object.assign({
      display: 'inline-block',
      padding: 0,
      verticalAlign: 'middle',
    }, upDownStyle);

    const value = showValue ? this.state.value : '';
    return (
      <div
        style = {Object.assign({
          display: 'inline-block',
          verticalAlign: 'middle',
          whiteSpace: 'nowrap',
        }, style)}
      >
        <input
          type="text"
          style = {Object.assign({
            display: 'inline-block',
            //color: showValue ? '#000000' : '#ffffff',
          }, valueBoxStyle)} value = {value} size="5"
          onChange={this.onChange}
          onKeyPress={this.onKeyPress}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
        />
        <div
          style = {upDownStyle}
        >
          <svg width="18" height="20">
            <g onClick={this.onPlus} className="cursorPointer">
              <path d="M 5 7 L 9 3 L 13 7" fill="none" stroke="#757884"/>
              <rect width="18" height="10" strokeWidth="0" fill="rgba(127,127,127,0.001)"/>
            </g>
            <g onClick={this.onMinus} className="cursorPointer">
              <path d="M 5 13 L 9 17 L 13 13" fill="none" stroke="#757884"/>
              <rect y="10" width="18" height="10" strokeWidth="0" fill="rgba(127,127,127,0.001)"/>
            </g>

          </svg>
        </div>

      </div>
    );
  }

}
