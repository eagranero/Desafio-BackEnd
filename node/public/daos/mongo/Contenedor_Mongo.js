"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.connectMG = void 0;
var _mongoose = require("mongoose");
const connectMG = async nombre => {
  try {
    return await (0, _mongoose.connect)('mongodb://localhost:27017/' + nombre, {
      useNewUrlParser: true
    });
  } catch (e) {
    console.log(e);
  }
};
exports.connectMG = connectMG;
class Contenedor_Mongo {
  constructor(nombre, schema) {
    this.nombre = nombre;
    this.collectionElement = (0, _mongoose.model)(nombre, schema);
  }

  //Funcion para obtener todos los elementos de una coleccion
  async getAll() {
    try {
      return await this.collectionElement.find({});
    } catch (e) {
      console.log(e);
    }
  }
  async buscar(elemento) {
    try {
      let encontrado = await this.collectionElement.findOne(elemento);
      return encontrado;
      /*if (encontrado.length>0)return encontrado;
      else return null*/
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  //Funcion para agregar un elemento nuevo
  async save(elemento) {
    try {
      elemento.timeStamp = new Date().toLocaleString(); //Incorporo timestamp al crear
      const nuevo = new this.collectionElement(elemento);
      nuevo.save();
      console.log("Elemento agregado");
      return nuevo._id.toString();
    } catch (e) {
      console.log(e);
    }
  }

  //funcion para quitar un elemento con cualquier tipo de argumento
  async quitarElemento(argumento) {
    try {
      await this.collectionElement.deleteOne(argumento);
      console.log("Elemento quitado");
    } catch (e) {
      console.log(e);
    }
  }

  //Funcion para obtener un elemento a partir de su id
  async getById(id) {
    try {
      const elemento = await this.collectionElement.findById(id);
      return elemento;
    } catch (e) {
      console.log(e);
      return -1;
    }
  }

  //Funcion para obtener un elemento a partir de su id
  async getByIdFunc(id, func) {
    try {
      const elemento = await this.collectionElement.findById(id, func);
      return elemento;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  //Funcion para eliminar elemento indicando id
  async deleteById(id) {
    try {
      if ((await this.collectionElement.findByIdAndDelete(id)) == null) return 0;else {
        console.log("Elemento con Id:" + id + " eliminado");
        return 1;
      }
    } catch (e) {
      console.log(e);
      return -1;
    }
  }

  //Funcion para eliminar todos los elementos de una coleccion
  async deleteAll() {
    try {
      await this.collectionElement.deleteMany();
      console.log("Se elminaron todos los documentos");
    } catch (e) {
      console.log(e);
    }
  }
  async updateById(idElemento, nuevaInformacion) {
    try {
      let elementoActual = await this.getById(idElemento);
      if (elementoActual != null) {
        if (nuevaInformacion.nombre) elementoActual.nombre = nuevaInformacion.nombre;
        if (nuevaInformacion.descripcion) elementoActual.descripcion = nuevaInformacion.descripcion;
        if (nuevaInformacion.codigo) elementoActual.codigo = nuevaInformacion.codigo;
        if (nuevaInformacion.foto) elementoActual.foto = nuevaInformacion.foto;
        if (nuevaInformacion.precio) elementoActual.precio = nuevaInformacion.precio;
        if (nuevaInformacion.stock) elementoActual.stock = nuevaInformacion.stock;
        await this.collectionElement.findByIdAndUpdate(idElemento, elementoActual);
        return 1;
      } else return 0;
    } catch (e) {
      console.log(e);
      return -1;
    }
  }
}
exports.default = Contenedor_Mongo;