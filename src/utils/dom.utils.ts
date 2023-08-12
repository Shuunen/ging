import { debounce } from 'shuutils'

function scrollToElement (element: Element) {
  // below is not working with horizontal scroll hidden items
  // const { top: topPosition, bottom: bottomPosition } = element.getBoundingClientRect()
  // const isVisible = topPosition >= 0 && bottomPosition <= window.innerHeight
  // if (isVisible) { console.log('element is visible, not scrolling'); return }
  // console.log('scrolling to element', element)
  element.scrollIntoView({ behavior: 'smooth' })
}

const scrollDelay = 100

export const debouncedScrollToElement = debounce(scrollToElement, scrollDelay)

export function unfocusActiveElement () {
  const active = document.activeElement
  if (active && active instanceof HTMLInputElement) active.blur()
}

export function focusInput (selector: string) {
  const input = document.querySelector(selector)
  if (input && input instanceof HTMLInputElement) input.focus()
}
