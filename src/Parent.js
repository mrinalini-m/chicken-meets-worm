import { LinkedList } from 'data_structures'
import MovingObject from './MovingObject'

export default class Parent extends MovingObject {
  constructor(pos, radius = 13, world, lives, color = '#7280f6', easing = 0.9) {
    super(pos, radius, world, color)
    this.children = new LinkedList()
    this.lives = lives
    this.easing = easing
    this.currPredCols = []
    this.posCache = []

    this.move = this.move.bind(this)
    this.checkInRange = this.checkInRange.bind(this)
    this.hitPredator = this.hitPredator.bind(this)
    this.hitChild = this.hitChild.bind(this)
  }

  setCurrPredCols = (currPredCols) => {
    this.currPredCols = currPredCols
  }

  getChildCount = () => {
    return this.children.size
  }

  appendChild = (child) => {
    if (!this.children.search(child)) {
      const tail = this.children.tail,
        lastChild = tail && tail.val
      if (lastChild) lastChild.setNextChild(child)

      this.children.appendToTail(child)

      child.setChainPos(this.getChildCount())
      child.parent = this
    }
  }

  checkInRange(obj, cushion = 0) {
    if (obj.constructor.name === 'Predator')
      this.checkCollisionWithPredator(obj)
    else super.checkInRange(obj, cushion)
  }

  checkCollisionWithPredator = (predator) => {
    const collided = super.checkInRange(predator),
      colliding = this.currPredCols.includes(predator)
    /* if collided and first contact,
      add predator to the current collisions with predator,
      call collide with predator (decrement lives)
    */
    if (collided && !colliding) {
      const currPredCols = this.currPredCols.slice()
      currPredCols.push(predator)
      this.setCurrPredCols(currPredCols)

      this.hitPredator()
    }

    /* if was colliding and stopped colliding, remove predator from current collisions */
    if (!collided && super.checkInRange(predator, 5) && colliding) {
      const currPredCols = this.currPredCols.slice(),
        index = currPredCols.indexOf(predator)
      currPredCols.splice(index, 1)
      this.setCurrPredCols(currPredCols)
    }
  }

  hitPredator() {
    this.lives.decrementCount()
  }

  hitChild(obj) {
    this.appendChild(obj)
    obj.setIndependence(false)
  }

  move(pos) {
    super.moveWithCursor(pos, this.easing)
    const firstChild = this.children.head && this.children.head.val

    if (firstChild)
      firstChild.move(this.posCache.length ? this.posCache[0] : pos)
  }
}
