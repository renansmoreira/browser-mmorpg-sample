const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {
  origins: '*:*',
  pingInterval: 3000
});
const uuid = require('uuid');

const players = {};

function fetchPlayerInfo(playerId) {
  players[playerId] = Object.assign({}, players[playerId], {
    id: uuid.v4(),
    position: { x: 231, y: 412 }
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

    io.to(socket.id).emit('joined', players[socket.id]);
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

http.listen(3000, () => {
  console.log('listening on *:3000');
});
