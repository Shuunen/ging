import { on, storage } from 'shuutils'
import { render } from './render'

class App {
  data: Data = { groups: [] }
  constructor () {
    console.log('app constructor')
    this.setListeners()
    this.checkStorage()
  }
  async checkStorage () {
    const data: Data | undefined = await storage.get('ging-data')
    if (data) this.onData(data)
  }
  setListeners () {
    on('data', this.onData)
    on('add-step', this.onAddStep.bind(this))
  }
  onAddStep ({ step, index }: { step: Step, index: number }) {
    console.log('step to add', step, 'at index', index)
    this.data.groups[0]?.steps.splice(index, 0, step)
    render(document.querySelector('main'), this.data)
  }
  onData (data: Data) {
    console.log('data detected', data)
    this.data = data
    render(document.querySelector('main'), data)
  }
}

