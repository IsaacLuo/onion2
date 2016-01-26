var PositionAnnotationOnCircle = function({children, height=0, sAngle=0, eAngle=0, forward=true}) {
    const sAngleDegs = sAngle * 360 / Math.PI / 2
    const eAngleDegs = eAngle * 360 / Math.PI / 2
    var transform;
    if (forward) {
        transform = `translate(0,${-height}) rotate(${sAngleDegs},0,${height})`
    } else {
        transform = `scale(-1,1) translate(0,${-height}) rotate(${-eAngleDegs},0,${height}) `
    }
    return (
        <g transform={ transform }>
          { children }
        </g>
        )
}