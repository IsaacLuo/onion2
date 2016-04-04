import React from 'react';

// the cursor of plasmidViewer
export class PlasmidViewerCursor extends React.Component {
  static propTypes = {
    angle: React.PropTypes.number,
    theme: React.PropTypes.string,
  };
  static defaultProps =
    {
      angle: 0,
      radius: 250,

    };
  constructor(props) {
    super(props);
    this.state = { angle: props.angle };
  }

  shouldComponentUpdate(nextProps, nextState) {
    //console.log(nextProps,nextState);
    if (nextProps.angle !== this.props.angle) { //upading angle
      const targetAngle = nextProps.angle;
      const nowAngle = this.state.angle;
      this.angleD = (targetAngle - nowAngle) / 20;
      this.timerCount = 0;
      //console.log("newTarget");
      if (this.updateInterval === undefined) {
        this.updateInterval = setInterval(() => {
          //console.log(`anlgeD=${this.angleD},${this.timerCount}`);
          this.timerCount++;
          const nowAngle = this.state.angle;
          let nextAngle;
          if (this.timerCount >= 20) nextAngle = this.props.angle;
          else nextAngle = nowAngle + this.angleD;

          this.setState({ angle: nextAngle });
        }, 16);
      }

      return false;
    }

    return true;
  }

  componentDidUpdate() {
    if (this.state.angle === this.props.angle) {
      clearInterval(this.updateInterval);
      //console.log("cleaned");
      this.updateInterval = undefined;
    }
  }

}

export class PlasmidViewerCursorGeneral extends PlasmidViewerCursor {
  render() {
    const angle = this.state.angle;
    const r = this.props.radius;

    let a1 = this.props.watchLeftAngle;
    let a2 = this.props.watchRightAngle;

    if (angle + a1 < 0) a1 = -angle;
    if (angle + a2 > 324) a2 = 324 - angle;

    const cursorH = 20;

    //const d = `M 0 ${-r - cursorH} \
    //L 0 ${-r + cursorH} \
    //M -5 ${-r - cursorH} \
    //L 5 ${-r - cursorH} \
    //M -5 ${-r + cursorH} \
    //L 5 ${-r + cursorH}`;

    const d = `M 0 ${-r - cursorH} L 0 ${-r + cursorH}`;

    return (
      <g
        transform={`rotate(${this.state.angle})`}
      >
        {<path
          d = {d}
          fill="none"
          strokeWidth={2}
          stroke="#4E77BA"
        />}
      </g>
    );
  }
}

export class PlasmidViewerCursorMeter extends PlasmidViewerCursor {
  render() {
    const r = this.props.radius;

    const ptAR = { x: 10 * Math.cos(-Math.PI * 0.75), y: 10 * Math.sin(-Math.PI * 0.75) };
    const ptBR = { x: 10 * Math.cos(-Math.PI * 0.25), y: 10 * Math.sin(-Math.PI * 0.25) };

    const d = `M 0 0 L ${ptAR.x} ${ptAR.y} L 0 ${-r} L ${ptBR.x} ${ptBR.y} Z `;

    return (
      <g
        transform={`rotate(${this.state.angle})`}
      >
        {<path
          d = {d}
          fill="black"
          strokeWidth={1}
          stroke="black"
        />}
        <circle
          cx = "0"
          cy = "0"
          r = "15"
          fill="red"
        />
      </g>
    );
  }
}
