import { Schema, model } from 'mongoose';

export const SchemaUsuario = new Schema({
  
  timeStamp: { type: String, required: true, max: 100 },
  username: { type: String, required: true },
  password: { type: String, required: true }

});


