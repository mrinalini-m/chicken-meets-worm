import { LinkedList } from 'data_structures'
import Child from './Child.js'
import Energy from './Energy.js'
import Lives from './Lives.js'
import Parent from './Parent.js'
import Predator from './Predator.js'
import Score from './Score.js'
import './style.css'
import World from './World.js'
import Worm from './Worm.js'

export default class Game {
  constructor(display, childCount = 10, predatorCount = 4, wormCount = 5) {
    this.display = display
    this.mouse = { x: null, y: null }
    this.world = null
    this.parent = null
    this.predators = new LinkedList()
    this.children = new LinkedList()
    this.worms = new LinkedList()
    this.childCount = childCount
    this.predatorCount = predatorCount
    this.wormCount = wormCount
    this.lives = null
    this.energy = null
    this.score = 0
  }

  handleMouseMove = (e) => {
    this.mouse = { x: e.clientX, y: e.clientY }
  }

  destroyChild = (child) => {
    this.children.deleteNode(child)
    this.spawnChildren(10)
  }

  checkInRange = () => {
    const parent = this.parent,
      children = this.children.toArray(),
      predators = this.predators.toArray(),
      worms = this.worms.toArray()

    // Child collisions
    for (const child of children) {
      if (parent.checkInRange(child)) parent.hitsChild(child)
      for (const predator of predators) {
        if (child.checkInRange(predator, 10)) child.avoidPredator()
        if (child.checkInRange(predator, 0)) child.hitsPredator(this)
      }
    }
    // Parent collisions
    for (const predator of predators) {
      if (parent.checkInRange(predator, 5))
        parent.checkCollisionWithPredator(predator)
    }

    for (const worm of worms) {
      if (parent.checkInRange(worm, 2)) parent.hitsWorm(worm)
    }
  }

  draw = () => {
    const canvas = this.world.canvas,
      ctx = canvas.getContext('2d'),
      children = this.children.toArray(),
      predators = this.predators.toArray(),
      worms = this.worms.toArray()

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    this.parent.moves(this.mouse)
    this.parent.draw(ctx)

    for (const predator of predators) {
      predator.moves()
      predator.draw(ctx)
    }

    for (const worm of worms) {
      worm.moves()
      worm.draw(ctx)
    }

    for (const child of children) {
      if (child.independence) child.moves()
      child.draw(ctx)
    }

    this.checkInRange()
    window.requestAnimationFrame(this.draw)
  }

  spawnChildren = (r) => {
    while (this.children.size < this.childCount) {
      const randomPos = this.world.getRandomPos(r),
        child = new Child(randomPos, r, this.world)
      child.setRandomDir()
      this.children.appendToTail(child)
    }
  }

  spawnPredators = (r) => {
    while (this.predators.size < this.predatorCount) {
      const randomPos = this.world.getRandomPos(r),
        predator = new Predator(randomPos, r, this.world)
      predator.setRandomDir()
      this.predators.appendToTail(predator)
    }
  }

  spawnWorms = (r) => {
    while (this.worms.size < this.wormCount) {
      const randomPos = this.world.getRandomPos(r),
        worm = new Worm(randomPos, r, this.world)
      worm.setRandomDir()
      this.worms.appendToTail(worm)
    }
  }

  initChildren = (radius) => {
    this.spawnChildren(radius)
  }

  initPredators = (radius) => {
    this.spawnPredators(radius)
  }

  initParent = (radius) => {
    const initialPos = {
      x: this.world.size.width / 2 + radius,
      y: this.world.size.height / 2 + radius,
    }

    const parent = new Parent(
      initialPos,
      radius,
      this.world,
      this.lives,
      this.score
    )
    this.parent = parent
  }

  initWorms = (radius) => {
    this.spawnWorms(radius)
  }

  initLives = (count) => {
    const lives = new Lives(this.display, count)
    lives.init()
    this.lives = lives
  }

  initWorld = () => {
    const world = new World(this.display)
    world.init()
    this.world = world
  }

  initScore = () => {
    const score = new Score(this.display)
    score.init()
    this.score = score
  }

  initEnergy = () => {
    const energy = new Energy(this.display)
    energy.init()
    this.energy = energy
  }

  init = () => {
    this.display.renderGame()
    this.display.renderScore()
    this.display.renderLives()
    this.display.renderEnergy()
    this.display.renderWorld()

    window.addEventListener('mousemove', this.handleMouseMove, false)

    this.initEnergy()
    this.initWorld()
    this.initScore()
    this.initLives(1)
    this.initParent(13)
    this.initChildren(10)
    this.initPredators(10)
    this.initWorms(5)
    window.requestAnimationFrame(this.draw)
  }
}
