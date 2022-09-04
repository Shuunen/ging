import { debounce } from 'shuutils'

const scrollToElement = (element: Element): void => {
  // console.log('scrolling to', element)
  element.scrollIntoView({ behavior: 'smooth' })
}

export const debouncedScrollToElement = debounce(scrollToElement, 100)
