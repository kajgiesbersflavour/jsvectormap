import EventHandler from '../eventHandler'

export default function setupContainerTouchEvents() {
  let map = this,
      touchStartScale,
      touchStartDistance,
      touchX,
      touchY,
      centerTouchX,
      centerTouchY,
      lastTouchesLength,
      isTouchPanning = false

  let handleTouchEvent = e => {
    const touches = e.touches
    let offset, scale, transXOld, transYOld

    if (e.type == 'touchstart') {
      lastTouchesLength = 0
      isTouchPanning = true
    }

    if (e.type == 'touchend' || e.type == 'touchcancel') {
      if (touches.length == 0 && isTouchPanning) {
        isTouchPanning = false;
        map._processDragEnd();
      }
      lastTouchesLength = touches.length;
      if (touches.length == 1) {
        touchX = touches[0].pageX;
        touchY = touches[0].pageY;
      }
      return;
    }


    if (touches.length == 1) {
      if (lastTouchesLength == 1) {
        transXOld = map.transX
        transYOld = map.transY
        const deltaX = -(touchX - touches[0].pageX) / map.scale;
        const deltaY = -(touchY - touches[0].pageY) / map.scale;
        map._processDrag(deltaX, deltaY);



        map._tooltip?.hide()
        map._applyTransform()
        map._emit(Events.onMapMoved, [map]);

        if (transXOld != map.transX || transYOld != map.transY) {
          e.preventDefault()
        }
      }

      touchX = touches[0].pageX
      touchY = touches[0].pageY
    } else if (touches.length == 2) {
      if (lastTouchesLength == 2) {
        scale = Math.sqrt(
          Math.pow(touches[0].pageX - touches[1].pageX, 2) +
          Math.pow(touches[0].pageY - touches[1].pageY, 2)
        ) / touchStartDistance

        map._setScale(touchStartScale * scale, centerTouchX, centerTouchY)

        map._tooltip?.hide()
        e.preventDefault()
      } else {
        let rect = map.container.getBoundingClientRect()

        offset = {
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
        }

        if (touches[0].pageX > touches[1].pageX) {
          centerTouchX = touches[1].pageX + (touches[0].pageX - touches[1].pageX) / 2
        } else {
          centerTouchX = touches[0].pageX + (touches[1].pageX - touches[0].pageX) / 2
        }

        if (touches[0].pageY > touches[1].pageY) {
          centerTouchY = touches[1].pageY + (touches[0].pageY - touches[1].pageY) / 2
        } else {
          centerTouchY = touches[0].pageY + (touches[1].pageY - touches[0].pageY) / 2
        }

        centerTouchX -= offset.left
        centerTouchY -= offset.top
        touchStartScale = map.scale

        touchStartDistance = Math.sqrt(
          Math.pow(touches[0].pageX - touches[1].pageX, 2) +
          Math.pow(touches[0].pageY - touches[1].pageY, 2)
        )
      }
    }

    lastTouchesLength = touches.length
  }

  EventHandler.on(map.container, 'touchstart', handleTouchEvent)
  EventHandler.on(map.container, 'touchmove', handleTouchEvent)
  EventHandler.on(map.container, 'touchend', handleTouchEvent);
  EventHandler.on(map.container, 'touchcancel', handleTouchEvent);
}