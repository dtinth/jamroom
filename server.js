const express = require("express");
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', function(socket){
  socket.on('jam', () => {
    socket.emit('ready to jam', {
      currentTime: Date.now(),
    })
  })
})

app.use(express.static("public"));

server.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + server.address().port);
});
