  export default function applyAndReposition() {
    this.canvas.applyTransformParams(this.scale, this.transX, this.transY);
    if (this.markers) this._repositionMarkers();
    if (this.lines) this._repositionLines();
    this._repositionLabels();
  }
