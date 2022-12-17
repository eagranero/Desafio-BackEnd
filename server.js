import express from "express";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import crypto from "crypto";
import cors from "cors";
import { listadoProductos } from "./persistencia/productos_persistencia.js";


const asincronica=(async()=>{
  await listadoProductos.deleteAll()
  await listadoProductos.save({nombre:"Escuadra", precio:123.45, thumbnail:"../img/escuadra.jpg"})
  await listadoProductos.save({nombre:"Calculadora", precio:123.45, thumbnail:"../img/calculadora.jpg"})
  await listadoProductos.save({nombre:"Cuaderno", precio:123.45, thumbnail:"../img/cuaderno.jpg"})
})()


const schema = buildSchema(`
  type Producto {
    _id: String
    nombre: String,
    precio: String,
    thumbnail: String
  }
  input ProductoInput {
    nombre: String,
    precio: String,
    thumbnail: String
  }
  type Query {
    getProductos(campo: String): [Producto]
  }
  type Mutation {
    createProducto(datos: ProductoInput): Producto
    deleteProducto(id: String):String
    updateProducto(id: String, datos: ProductoInput): Producto
  }
`);

const createProducto = async ({datos})=>{
  await listadoProductos.save({...datos})
  return {...datos}
}

const getProductos = async ()=>{
  return listadoProductos.listado
}

const deleteProducto = async (datos)=>{
  await listadoProductos.deleteByID(parseInt(datos.id))
  return "Producto Eliminado"
}

const updateProducto = async ({id,datos})=>{
  //await listadoProductos.save({...datos})
  await listadoProductos.updateById(id,datos)
  return await await listadoProductos.getById(parseInt(id))
}


class Producto {
  constructor({ nombre, precio, thumbnail }) {
    this.nombre = nombre;
    this.precio = precio;
    this.thumbnail = thumbnail;
  }
}


const app = express();

app.use(cors());
app.use(express.static("public"));

app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: {
      getProductos,
      createProducto,
      deleteProducto,
      updateProducto
    },
    graphiql: true,
  })
);

const PORT = 8080;
app.listen(PORT, () => {
  const msg = `Servidor corriendo en puerto: ${PORT}`;
  console.log(msg);
});
