const express = require('express')
const app = express()
const path = require('path')
const http = require('http') // Protocol for communication
const server = http.createServer(app)

const socketio = require('socket.io') // Enables communication between client and server
const io = socketio(server)

// Use static folder
app.use(express.static(path.join(__dirname, 'public')))

// Handle socket connection request from the web client
const connections = [null, null]
io.on('connection', socket => {

  // Find an available player number
  let playerIndex = -1
  for (var i in connections) {
    if (connections[i] === null) {
      playerIndex = parseInt(i)
      break
    }
  }

  // Ignore player 3
  if (playerIndex === -1) return
  connections[playerIndex] = false

  // Tell the connecting client which player are they
  socket.emit('player-number', playerIndex)
  console.log(`Player ${playerIndex} joined the game`)

  // Tell everyone which player connected
  socket.broadcast.emit('player-connection', playerIndex)

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`Player ${playerIndex} disconnected`)
    connections[playerIndex] = null
    socket.broadcast.emit('player-connection', playerIndex)
  })

  // Check if players are still connected
  socket.on('check-players', () => {
    const players = []
    for (var i in connections) {
      connections[i] === null ? players.push({ connected: false, ready: false }) : players.push({ connected: true, ready: connections[i] })
    }
    socket.emit('check-players', players)
  })

  // On Ready
  socket.on('player-ready', () => {
    connections[playerIndex] = true
    socket.broadcast.emit('enemy-ready', playerIndex)
  })

  // When player receives fire
  socket.on('fire', id => {
    console.log(`Shot fired from player ${playerIndex}`, id)
    socket.broadcast.emit('fire', id)
  })

  // When player fires back
  socket.on('fire-back', square => {
    console.log(square)
    socket.broadcast.emit('fire-back', square)
  })

  // Connection timeout (2 min)
  setTimeout(() => {
    connections[playerIndex] = null
    socket.emit('timeout')
    socket.disconnect()
  }, 120000)
})


const PORT = 3000 || process.env.PORT
server.listen(3000, () => { console.log(`Started server at port ${PORT}`) })
