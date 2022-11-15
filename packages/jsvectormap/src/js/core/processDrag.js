  export default function processDrag(deltaX, deltaY) {
    this.transX += deltaX;
    this.transY += deltaY;
    this._applyTransform();
  }

