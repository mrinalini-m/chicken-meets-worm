/**
 * Related to the DOM and display (creating elements, updating elements etc.)
 */

export default class Display {
  constructor(width = 400, height = 700) {
    this.game = null
    this.worldSize = { width, height }
  }

  createElement(tag, className, id) {
    const element = document.createElement(tag)
    if (className) element.classList.add(className)
    if (id) element.id = id
    return element
  }

  getElement(selector) {
    return document.querySelector(selector)
  }

  createGame() {
    const game = this.createElement('div', 'game', 'game')
    this.game = game
    return game
  }

  printGame() {
    document.body.appendChild(this.game)
  }

  printWorld() {
    const world = this.createElement('canvas', null, 'world')
    world.width = this.worldSize.width
    world.height = this.worldSize.height
    this.game.append(world)
  }
}
