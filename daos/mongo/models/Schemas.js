import { Schema, model } from 'mongoose';

export const SchemaUsuario = new Schema({
  
  timeStamp: { type: String, required: true, max: 100 },
  username: { type: String, required: true },
  password: { type: String, required: true }

});

export const SchemaProducto = new Schema({
  
  timeStamp: { type: String, required: true, max: 100 },
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  thumbnail: { type: String, required: true }

});


