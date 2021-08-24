const app = require("express")();

const http = require("http").createServer(app);

const io = require("socket.io")(http);

let usuarios = [];
let logou = false;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.get("/chat", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
  /*io.emit('conectado','Estou conectado!');

    socket.broadcast.emit('novo usuario','Um novo usuário se conectou!');

    socket.broadcast.emit('digitando','teste');*/

  socket.on("novo", (request) => {
    usuarios.push(request.usuario);
    io.emit("novo", request);
    logou = true;
  });

  socket.on("entrei", () => {
    if (!logou) {
      logou = true;
      console.log("Entrou direto");
      io.emit("logou", {
        usuario: usuarios[usuarios.length - 1],
        entrouDireto: logou,
      });
    } else {
      logou = false;
      console.log("Entrou na sala");
      io.emit("logou", {
        usuario: usuarios[usuarios.length - 1],
        entrouDireto: logou,
      });
    }
  });

  socket.on("chat message", (request) => {
    console.log(request);
    io.emit("chat message", request);
  });

  socket.on("digitando", (request) => {
    console.log(request);
    socket.broadcast.emit("digitando", request);
  });

  socket.on("disconnect", () => {
    console.log("Desconectado.");
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
