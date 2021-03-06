export default class Energy {
  constructor(display, energy = 5, max = 5) {
    this.display = display
    this.count = energy
    this.min = 0
    this.max = max
  }

  setCount = (count) => {
    this.count = count
  }

  reset = () => {
    this.setCount(this.max)
    this.updateEnergy()
  }

  incrementCount = () => {
    const count = Math.min(this.count + 1, this.max)
    this.setCount(count)
    this.updateEnergy()
  }

  decrementCount = () => {
    const count = this.count
    this.count = Math.max(count - 1, this.min)
    this.updateEnergy()
  }

  decrementCountByHalf = () => {
    const count = this.count
    this.count = Math.max(count - 0.5, this.min)
    this.updateEnergy()
  }

  updateEnergy = () => {
    this.display.updateEnergyBar(this.count)
  }

  init = () => {
    this.updateEnergy()
  }
}
