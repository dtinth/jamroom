const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', function(socket){
  socket.on('jam', () => {
    socket.emit('ready to jam', {
      currentTime: Date.now(),
      id: socket.id,
    })
  })
  socket.on('recording', (recording) => {
    io.emit('recording submitted', { recording, socketId: socket.id })
  })
})

app.use(express.static("public"));

server.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + server.address().port);
});
