"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.itemProducto = exports.itemCarrito = void 0;
class itemProducto {
  constructor(nombre, descripcion, codigo, foto, precio, stock) {
    this.timeStamp = new Date().toLocaleString();
    this.nombre = nombre;
    this.descrcipcion = descripcion, this.codigo = codigo;
    this.foto = foto;
    this.precio = precio, this.stock = stock, this.id = 0;
  }
}
exports.itemProducto = itemProducto;
class itemCarrito {
  constructor() {
    this.timeStamp = new Date().toLocaleString(), this.productos = [], this.id = 0;
  }
}
exports.itemCarrito = itemCarrito;