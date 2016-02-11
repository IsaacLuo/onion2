import React, { PropTypes } from 'react';
import { LA } from './../LA';

// the cursor of plasmidViewer
export class PlasmidViewerCursor extends React.Component {
  static propTypes = {
    //angle: React.PropTypes.number.required,
    theme:React.PropTypes.string,
  };
  static defaultProps =
    {
      angle: 0,

      radius:250,

    };
  constructor(props) {
    super(props);
    this.state = { angle:this.props.angle };
  }

  shouldComponentUpdate(nextProps, nextState) {
    //console.log(nextProps,nextState);
    if (nextProps.angle !== this.props.angle) { //upading angle
      let targetAngle = nextProps.angle;
      let nowAngle = this.state.angle;
      this.angleD = (targetAngle - nowAngle) / 20;
      this.timerCount = 0;
      //console.log("newTarget");
      if (this.updateInterval === undefined) {
        this.updateInterval = setInterval(() => {
          //console.log(`anlgeD=${this.angleD},${this.timerCount}`);
          this.timerCount++;
          let nowAngle = this.state.angle;
          let nextAngle;
          if (this.timerCount >= 20)
            nextAngle = this.props.angle;
          else
            nextAngle = nowAngle + this.angleD;

          this.setState({ angle:nextAngle });
        }, 16);
      }

      return false;
    } else
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
    let angle = this.state.angle;
    let angle2 = this.props.selectedAngle;
    let pointerAngle = (angle2 - 90) * Math.PI / 180;
    let r = this.props.radius;

    let a1 = this.props.watchLeftAngle;
    let a2 = this.props.watchRightAngle;

    if (angle + a1 < 0) a1 = -angle;
    if (angle + a2 > 324) a2 = 324 - angle;
    let a1R = (a1 - 90) * Math.PI / 180;
    let a2R = (a2 - 90) * Math.PI / 180;

    let ptE = { x:r * Math.cos(pointerAngle), y:r * Math.sin(pointerAngle) };
    let ptAR = { x:10 * Math.cos(-Math.PI * 0.75), y:10 * Math.sin(-Math.PI * 0.75) };
    let ptBR = { x:10 * Math.cos(pointerAngle + Math.PI / 4), y:10 * Math.sin(pointerAngle + Math.PI / 4) };
    //let d = `M 0 0 L ${ptA.x} ${ptA.y} L ${ptE.x} ${ptE.y} L ${ptB.x} ${ptB.y} `;

    const cursorH = 20;
    let d = '';
    let d2 = '';
    // if(angle2==0)
    d = `M 0 ${-r - cursorH} L 0 ${-r + cursorH} M -5 ${-r - cursorH} L 5 ${-r - cursorH} M -5 ${-r + cursorH} L 5 ${-r + cursorH}`;
    // else{
    // d = `M 5 ${-r-cursorH} L 0 ${-r-cursorH} L 0 ${-r+cursorH} L 5 ${-r+cursorH} L 5 ${-r+cursorH}`;
    // d2 = `M -5 ${-r-cursorH} L 0 ${-r-cursorH} L 0 ${-r+cursorH} L -5 ${-r+cursorH} L -5 ${-r+cursorH}`

    // }

    // let viewD = `M 0 0 L ${r*Math.cos(a1R)} ${r*Math.sin(a1R)} A ${r} ${r} 0 0 1 ${r*Math.cos(a2R)} ${r*Math.sin(a2R)} `;
    //this.state.angle = nextAngle;

    return (
      <g
        transform={`rotate(${this.state.angle})`}
      >
        {<path
          d = {d}
          fill="none"
          strokeWidth={3}
          stroke="red"
        />}
      </g>
    );
  }
}

export class PlasmidViewerCursorMeter extends PlasmidViewerCursor {
  render() {
    let angle = this.state.angle;
    let r = this.props.radius;

    let ptE = { x:0, y:-r };
    let ptAR = { x:10 * Math.cos(-Math.PI * 0.75), y:10 * Math.sin(-Math.PI * 0.75) };
    let ptBR = { x:10 * Math.cos(-Math.PI * 0.25), y:10 * Math.sin(-Math.PI * 0.25) };
    //let d = `M 0 0 L ${ptA.x} ${ptA.y} L ${ptE.x} ${ptE.y} L ${ptB.x} ${ptB.y} `;
    let d = `M 0 0 L ${ptAR.x} ${ptAR.y} L 0 ${-r} L ${ptBR.x} ${ptBR.y} Z `;
    //this.state.angle = nextAngle;
    return (
      <g
        transform={`rotate(${this.state.angle})`}
      >

        {<path
          d = {d}
          fill="black"
          strokeWidth={1}
          stroke="black"
        ></path>}
        <circle
          cx = "0"
          cy = "0"
          r = "15"
          fill="red"
        >
        </circle>


      </g>
    );
  }
}
