import lerp from "./lerp"

export interface Scroller {
  animating: boolean
  cancel?: boolean
}

/**
 * Make `container` smoothly scroll vertically towards `target`'s center.
 * @param container The element which will have its scroll affected.
 * @param target The element that `container` should scroll towards.
 * @param duration How long the scroll should take in milliseconds.
 * @param options Additional options for the animation.
 */
export default function smoothScroll(
  container: HTMLElement,
  target: HTMLElement,
  duration: number,
  options?: {
    /**
     * Function to run when the animation finishes.
     */
    onFinish?: Function
    /**
     * The easing function to use - will be linear if omitted.
     */
    ease?: (x: number) => number
  }
): Scroller {
  const initialScroll = container.scrollTop
  const targetScroll = target.offsetTop + target.clientHeight / 2 - container.clientHeight / 2
  console.log(initialScroll, targetScroll)
  const startTime = performance.now()
  const endTime = startTime + duration

  const scroller: Scroller = {
    animating: true
  }

  const tickFunction = (time: DOMHighResTimeStamp) => {
    if (scroller.cancel) {
      return
    }

    let factor = (time - startTime) / duration
    if (options?.ease) {
      factor = options.ease(factor)
    }
    container.scrollTop = lerp(initialScroll, targetScroll, factor)

    if (time >= endTime) {
      container.scrollTop = targetScroll
      scroller.animating = false
      options?.onFinish?.()
    } else {
      requestAnimationFrame(tickFunction)
    }
  }

  requestAnimationFrame(tickFunction)

  return scroller
}
