"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.socket = void 0;
var _normalizr = require("normalizr");
var _productos = require("./routers/productos.js");
var _productosTest = require("./routers/productos-test.js");
const authorSchema = new _normalizr.schema.Entity("authors", {}, {
  idAttribute: 'mail'
});
const schemaMensaje = new _normalizr.schema.Entity("post", {
  author: authorSchema
}, {
  idAttribute: 'id'
});
const schemaPosteos = new _normalizr.schema.Entity('posts', {
  mensajes: [schemaMensaje]
}, {
  idAttribute: 'id'
});
let chat = [],
  chatNorm = {};
let chat_a_normalizar = {
  id: "chat",
  mensajes: []
};
const socket = io => {
  io.on("connection", async socket => {
    chat = await _productos.listadoChat.getAll();
    let date = new Date();
    io.sockets.emit("listadoProductos-test", _productosTest.listadoProductosTest);
    io.sockets.emit("listadoProductos", await _productos.listadoProductos.getAll_Knex());
    const tiempo = "[" + date.toLocaleDateString() + " - " + date.toLocaleTimeString() + "]";
    let nuevaConexion = {
      author: {
        mail: "Nuevo",
        tiempo: tiempo,
        nombre: "",
        apellido: "",
        edad: "",
        alias: "",
        avatar: ""
      },
      text: "Se unio al chat " + socket.id
    };
    chat.push(nuevaConexion);
    _productos.listadoChat.save(nuevaConexion);
    chat_a_normalizar.mensajes = JSON.parse(JSON.stringify(chat));
    chatNorm = (0, _normalizr.normalize)(chat_a_normalizar, schemaPosteos);
    io.sockets.emit("listadoChat", chatNorm);
    socket.on("msg-chat", async data => {
      _productos.listadoChat.save(data);
      chat = await _productos.listadoChat.getAll();
      chat_a_normalizar.mensajes = JSON.parse(JSON.stringify(chat));
      chatNorm = (0, _normalizr.normalize)(chat_a_normalizar, schemaPosteos);
      io.sockets.emit("listadoChat", chatNorm);
    });
    socket.on("nuevoProducto", async data => {
      console.log(data);
      await _productos.listadoProductos.save_Knex(data); //agrego producto al archivo
      io.sockets.emit("listadoProductos", await _productos.listadoProductos.getAll_Knex());
    });
  });
};
exports.socket = socket;