const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  origins: '*:*',
  pingInterval: 3000
});
const uuid = require('uuid');

const players = {};

function getMap(playerId) {
  return {
    px: players[playerId].position.x,
    py: players[playerId].position.y,
    a: [
      { t: 't', x: 5, y: 23 },
      { t: 't', x: 149, y: 212 },
      { t: 't', x: 50, y: 95 },
      { t: 't', x: 123, y: 250 },
      { t: 't', x: 400, y: 20 },
      { t: 't', x: 280, y: 300 },
      { t: 't', x: 319, y: 400 }
    ]
  };
}

function fetchPlayerInfo(playerId) {
  players[playerId] = Object.assign({}, players[playerId], {
    id: uuid.v4(),
    position: { x: 120, y: 300 }
  });
  return players[playerId];
}

function fetchPlayersInMapInfos(playerId) {
  io.sockets.clients((error, clients) => {
    const othersPlayers = clients
      .filter(socketId => socketId !== playerId)
      .map(socketId => players[socketId]);
    io.to(playerId).emit('map-players', othersPlayers);
  });
}

const map = 'first-map';

io.on('connection', (socket) => {
  socket.join(map, () => {
    players[socket.id] = fetchPlayerInfo(socket.id);

    io.to(socket.id)
      .emit('joined', players[socket.id])
      .emit('map', getMap(socket.id));
    fetchPlayersInMapInfos(socket.id);
    socket.to(map).emit('new-player-joined', fetchPlayerInfo(socket.id));
  });

  socket.on('player-started', (playerName) => {
    players[socket.id] = Object.assign({}, players[socket.id], {
      name: playerName
    });
  });

  socket.on('movement-was-made', (position) => {
    // TODO: Validate position consistency
    players[socket.id] = Object.assign({}, players[socket.id], { position });
    socket.to(map).emit('player-moved', { id: players[socket.id].id, position });
  });

  socket.on('disconnect', () => {
    socket.to(map).emit('player-disconnected', players[socket.id]);
  });
});

const port = process.env.PORT || 80;
http.listen(port, () => {
  console.log(`Started on *:${port}`);
});
