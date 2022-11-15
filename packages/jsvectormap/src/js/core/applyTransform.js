export default function applyTransform() {
  let maxTransX, maxTransY, minTransX, minTransY
    const padFractionX = (this.params.mapPadding || 0) * this._defaultWidth
    const padFractionY = (this.params.mapPadding || 0) * this._defaultHeight


  if (this._defaultWidth * this.scale <= this._width) {
    maxTransX = (this._width - this._defaultWidth * this.scale) / (2 * this.scale) + padFractionX
    minTransX = (this._width - this._defaultWidth * this.scale) / (2 * this.scale) - padFractionX
  } else {
    maxTransX = padFractionX
    minTransX = (this._width - this._defaultWidth * this.scale) / this.scale - padFractionX
  }

  if (this._defaultHeight * this.scale <= this._height) {
    maxTransY = (this._height - this._defaultHeight * this.scale) / (2 * this.scale) + padFractionY
    minTransY = (this._height - this._defaultHeight * this.scale) / (2 * this.scale) - padFractionY
  } else {
    maxTransY = padFractionY
    minTransY = (this._height - this._defaultHeight * this.scale) / this.scale - padFractionY
  }

  if (this.transY > maxTransY) {
    this.transY = maxTransY
  } else if (this.transY < minTransY) {
    this.transY = minTransY
  }

  if (this.transX > maxTransX) {
    this.transX = maxTransX
  } else if (this.transX < minTransX) {
    this.transX = minTransX
  }

  this.canvas.applyTransformParams(this.scale, this.transX, this.transY)
 
  if (this._markers) {
    this._repositionMarkers()
  }

  if (this._lines) {
    this._repositionLines()
  }

  this._repositionLabels()
}