/**
 * Created by luoyi on 18/01/2016.
 */
import React from 'react';

export default class AminoAcidMarker extends React.Component {
  static propTypes = {};
  static defaultProps = {
    h: 18,
    style: "full",
    direction: "+",
  };

  static colorDict = {
    F: "#F3DACA",
    L: "#D3D34F",
    I: "#F1E8BB",
    M: "#F1EBAA",
    A: "#C3E6F0",
    Y: "#CAC9C9",
    H: "#D8D9D8",
    Q: "#EFD79A",
    C: "#9CCFD2",
    W: "#A5A8BA",
    R: "#DEEBC8",
    "*": "#8BACAB",
    V: "#C5DEAE",
    S: "#D2E19E",
    P: "#DDE7EB",
    T: "#ABDAE1",
    N: "#D9BA9B",
    K: "#CCE8E7",
    D: "#B1DDE7",
    E: "#BADAA9",
    G: "#DBDBDB",
  };

  constructor(props) {
    super(props);
  }

  render() {
    let { x, y, w, h, aa, style, direction } = this.props;

    let genPath = (pts) => {
      let re = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        re += `L ${pts[i].x} ${pts[i].y}`;
      }

      re += "Z";
      return re;
    };

    let genPathWithStyle = (style, direction)=> {
      if (direction == "-") {
        if (style == "full") {
          return genPath([
            { x: 1.1 * w, y: 0 },
            { x: w * 0.1, y: 0 },
            { x: w * -0.2, y: 9 },
            { x: w * 0.1, y: 18 },
            { x: 1.1 * w, y: 18 },
            { x: w * 0.8, y: 9 },
          ]);
        } else if (style == "left2") {
          return genPath([
            { x: 0.766 * w, y: 0 },
            { x: w * 0.1, y: 0 },
            { x: w * -0.2, y: 9 },
            { x: w * 0.1, y: 18 },
            { x: 0.766 * w, y: 18 },
            { x: w * 0.566, y: 9 },
          ]);
        } else if (style == "left1") {
          return genPath([
            { x: 0.433 * w, y: 0 },
            { x: w * 0.1, y: 0 },
            { x: w * -0.2, y: 9 },
            { x: w * 0.1, y: 18 },
            { x: 0.433 * w, y: 18 },
            { x: w * 0.233, y: 9 },
          ]);
        } else if (style == "right1") {
          return genPath([
            { x: 1.1 * w, y: 0 },
            { x: w * 0.766, y: 0 },
            { x: w * 0.566, y: 9 },
            { x: w * 0.766, y: 18 },
            { x: 1.1 * w, y: 18 },
            { x: w * 0.8, y: 9 },
          ]);
        } else if (style == "right2") {
          return genPath([
            { x: 1.1 * w, y: 0 },
            { x: w * 0.433, y: 0 },
            { x: w * 0.233, y: 9 },
            { x: w * 0.433, y: 18 },
            { x: 1.1 * w, y: 18 },
            { x: w * 0.8, y: 9 },
          ]);
        } else if (style == "left3") {
          return genPath([
            { x: 1.1 * w, y: 0 },
            { x: w * 0, y: 0 },
            { x: w * 0, y: 18 },
            { x: 1.1 * w, y: 18 },
            { x: w * 0.8, y: 9 },

          ]);
        } else if (style == "right3") {
          return genPath([
            { x: 1 * w, y: 0 },
            { x: w * 0.1, y: 0 },
            { x: w * -0.2, y: 9 },
            { x: w * 0.1, y: 18 },
            { x: 1 * w, y: 18 },

          ]);
        }
      } else {
        if (style == "full") {
          return genPath([
            { x: -0.1 * w, y: 0 },
            { x: w * 0.9, y: 0 },
            { x: w * 1.2, y: 9 },
            { x: w * 0.9, y: 18 },
            { x: -0.1 * w, y: 18 },
            { x: w * 0.2, y: 9 },
          ]);
        } else if (style == "left2") {
          return genPath([
            { x: -0.1 * w, y: 0 },
            { x: w * 0.566, y: 0 },
            { x: w * 0.866, y: 9 },
            { x: w * 0.566, y: 18 },
            { x: -0.1 * w, y: 18 },
            { x: w * 0.2, y: 9 },
          ]);
        } else if (style == "left1") {
          return genPath([
            { x: -0.1 * w, y: 0 },
            { x: w * 0.333, y: 0 },
            { x: w * 0.633, y: 9 },
            { x: w * 0.333, y: 18 },
            { x: -0.1 * w, y: 18 },
            { x: w * 0.2, y: 9 },
          ]);
        } else if (style == "right1") {
          return genPath([
            { x: w * 0.766, y: 9 },
            { x: w * 0.466, y: 0 },
            { x: w * 0.9, y: 0 },
            { x: w * 1.2, y: 9 },
            { x: w * 0.9, y: 18 },
            { x: w * 0.466, y: 18 },
          ]);
        } else if (style == "right2") {
          return genPath([
            { x: w * 0.433, y: 9 },
            { x: w * 0.133, y: 0 },
            { x: w * 0.9, y: 0 },
            { x: w * 1.2, y: 9 },
            { x: w * 0.9, y: 18 },
            { x: w * 0.133, y: 18 },
          ]);
        } else if (style == "left3") {
          return genPath([
            { x: 0, y: 0 },
            { x: w * 0.9, y: 0 },
            { x: w * 1.2, y: 9 },
            { x: w * 0.9, y: 18 },
            { x: 0, y: 18 },
          ]);
        } else if (style == "right3") {
          return genPath([
            { x: -0.1 * w, y: 0 },
            { x: w * 1.0, y: 0 },
            { x: w * 1.0, y: 18 },
            { x: -0.1 * w, y: 18 },
            { x: w * 0.2, y: 9 },
          ]);
        }
      }
    };

    let textPos = (style, w)=> {
      switch (style) {
        case "full":
          return w / 2;
        case "left1":
          return w / 6;
        case "left2":
          return w / 3;
        case "right1":
          return 5 * w / 6;
        case "right2":
          return 2 * w / 3;
        case "left3":
          return w / 2;
        case "right3":
          return w / 2;
      }
    };

    return (
      <g
        transform={`translate(${x},${y})`}
        onClick={(e)=> {
          if (this.props.onSelect) {
            this.props.onSelect(this, e);
          }
        }}

        onHover={(e)=> {console.log('hovering', e);}}

        onMouseOver={(e)=> {
          if (this.hoveringTimer) {
            clearTimeout(this.hoveringTimer);
          }

          if (this.props.onMouseOver) {
            this.props.onMouseOver(this, e);
          }
        }}
      >
        <path
          d={genPathWithStyle(style, direction)}
          fill={AminoAcidMarker.colorDict[aa]}
        ></path>
        {(style != "left1" && style != "right1") && <text
          x={textPos(style, w)}
          y={h / 2}
          style={{
            textAnchor:"middle",
            alignmentBaseline:"central",
            WebkitUserSelect:"none",
          }}
        >{aa}</text>}
      </g>
    );

  }

}
