const rotateButton = document.getElementById('rotate')
const removeButton = document.getElementById('remove')
const startSingleButton = document.getElementById('single')
const startMultiButton = document.getElementById('multi')

const playerBoard = document.querySelector('.player-board')
const enemyBoard = document.querySelector('.enemy-board')
const shipGrid = document.querySelector('.ship-grid')

const infoText = document.getElementById('info')
const statusText = document.getElementById('status')

const ships = document.querySelectorAll('.ship')

const playerSquares = []
const enemySquares = []

let isHorizontal = false
let gameReady = false
let placedShips = 0



createGrid(playerBoard, playerSquares)
createGrid(enemyBoard, enemySquares)
rotateAndRemoveButtons()

startSingleButton.addEventListener('click', playSinglePlayer)
//startMultiButton.addEventListener('click', playMultiPlayer)

// ---------------------------------------------------------------------------------------------
const checkSquareX = Math.floor(document.querySelector(`div[data-id="${99}"]`).getBoundingClientRect().x)
const checkSquareY = Math.floor(document.querySelector(`div[data-id="${99}"]`).getBoundingClientRect().y)
let selectedShip
let selectedShipLength
let x
let y

//console.log(checkSquareX, checkSquareY)

ships.forEach(ship => ship.addEventListener('dragstart', dragStart))
playerSquares.forEach(square => square.addEventListener('dragenter', dropSquare))
ships.forEach(ship => ship.addEventListener('dragend', dropShip))
playerSquares.forEach(square => square.addEventListener('click', () => { console.log(square.getBoundingClientRect()) }))




/* ------------------------------------------------------------------------ */

// Selects the dragged ship
function dragStart(e) {
  selectedShip = e.target
  startX = Math.floor(selectedShip.getBoundingClientRect().x)
  startY = Math.floor(selectedShip.getBoundingClientRect().y)
  //console.log(startX, startY)
}

function dropSquare(e) {
  e.preventDefault()
  const dropSquare = e.target.dataset.id
  const square = document.querySelector(`div[data-id="${dropSquare}"]`)
  x = Math.floor(square.getBoundingClientRect().x + 1)
  y = Math.floor(square.getBoundingClientRect().y + 1)
  //console.log(x, y)
}

function dropShip(e) {
  e.preventDefault()
  selectedShip.id = 'placed'
  checkValidPosition()
  if (selectedShip.hasAttribute('id') === false) return
  selectedShip.style.top = y + "px"
  selectedShip.style.left = x + "px"
  checkStatus()
}


// Check if the last square of the selected ship goes over the grid
function checkValidPosition() {
  selectedShipLength = selectedShip.children.length - 1
  const shipSize = selectedShipLength * 30
  if (!isHorizontal) {
    if (y + shipSize > checkSquareY) {
      showInfoText()
      selectedShip.removeAttribute('id')
    }
  }
  if (isHorizontal) {
    if (x + shipSize > checkSquareX) {
      showInfoText()
      selectedShip.removeAttribute('id')
    }
  }
}

// Creates the board grid and assigns an ID to each square
function createGrid(board, squares) {
  for (let i = 0; i < 100; i++) {
    const square = document.createElement('div')
    square.dataset.id = i
    board.appendChild(square)
    squares.push(square)
  }
}

// Adds functionality to rotate and remove buttons
function rotateAndRemoveButtons() {
  rotateButton.addEventListener('click', () => {
    isHorizontal = !isHorizontal
    shipGrid.classList.toggle('horizontal')
    ships.forEach(ship => {
      if (ship.id !== 'placed') {
        ship.classList.toggle('horizontal')
      }
    })
    removeButton.addEventListener('click', () => {
      placedShips = 0
      isHorizontal = false
      shipGrid.classList.remove('horizontal')
      placeStatusText()
      ships.forEach(ship => {
        ship.removeAttribute('id')
        ship.classList.remove('horizontal')
      })
    })
  })
}

// Display info text on wrong action
function showInfoText() {
  infoText.innerText = 'Invalid ship position!'
  infoText.style.color = 'darkred'
  infoText.classList.add('show')
  infoText.style.animation = "fade 3.5s"
  setTimeout(() => { infoText.classList.remove('show') }, 3500)
}

function readyStatusText() {
  statusText.innerText = 'Ready. Start the game!'
  statusText.style.color = 'forestgreen'
}

function placeStatusText() {
  statusText.innerText = 'Place Your Ships!'
  statusText.style.color = '#000040'
}

function checkStatus() {
  ships.forEach(ship => {
    if (ship.hasAttribute('id')) {
      placedShips += 1
      console.log(placedShips)
      if (placedShips === 15) {
        readyStatusText()
        gameReady = true
      }
    }
  })
}

function playSinglePlayer() {
  if (gameReady === true) {
    startSinglePlayer()
  } else {
    showInfoText()
    infoText.innerText = 'Place all the ships first!'
  }
}


// DISABLE SHIP PLACEMENT ON THE SQUARES NEXT TO THE PLACED SHIPS
// DISABLE PLACED SHIPS GOING OVER EACH OTHER

// optional: make placedShips count to 5, not 15
