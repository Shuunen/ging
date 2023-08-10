import { debounce } from 'shuutils'

function scrollToElement (element: Element): void {
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
