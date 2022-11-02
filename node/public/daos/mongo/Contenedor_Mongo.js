import { connect } from 'mongoose';
import { model } from 'mongoose';
import logger from '../../utils/logger.js';


export const connectMG = async(nombre)=>{
    try {
        return await connect('mongodb://localhost:27017/'+nombre, { useNewUrlParser: true });
      } catch (e) {
        console.log(e);
      }
}

export default class Contenedor_Mongo{

    constructor(nombre,schema){
        this.nombre=nombre
        this.collectionElement = model(nombre, schema);
    }

    //Funcion para obtener todos los elementos de una coleccion
    async getAll(){
        try{
            return await this.collectionElement.find({});
        }catch(e){
            logger.error("No se pudo obtener los datos de Mongo")
        }
    }

    async buscar(elemento){
        try{
            let encontrado=await this.collectionElement.findOne(elemento);
            return encontrado
            /*if (encontrado.length>0)return encontrado;
            else return null*/ 
        }catch(e){
            logger.error("No se pudo obtener el dato buscado de Mongo")
            return (e)
        }
    }

    //Funcion para agregar un elemento nuevo
    async save(elemento){
        try {
            elemento.timeStamp=new Date().toLocaleString(); //Incorporo timestamp al crear
            const nuevo = new this.collectionElement(elemento);
            nuevo.save()
            console.log("Elemento agregado")
            return nuevo._id.toString() 
        }catch(e) {
            logger.error("No se pudo guardar el dato en Mongo")
        }
    }


    //funcion para quitar un elemento con cualquier tipo de argumento
    async quitarElemento(argumento){
        try {
            await this.collectionElement.deleteOne(argumento);
            console.log("Elemento quitado")
        }catch(e) {
            logger.error("No se pudo quitar el dato en Mongo")
        }
    }

    //Funcion para obtener un elemento a partir de su id
    async getById(id){
        try{
            const elemento = await this.collectionElement.findById(id);
            return elemento
        }
        catch(e){
            logger.error("No se pudo obtener el dato de Mongo")
            return -1;  
        }
    }

        //Funcion para obtener un elemento a partir de su id
        async getByIdFunc(id,func){
            try{
                const elemento = await this.collectionElement.findById(id,func);
                return elemento
            }
            catch(e){
                logger.error("No se pudo obtener el dato de Mongo")
                return e;  
            }
        }
    
    //Funcion para eliminar elemento indicando id
    async deleteById(id){
        try{
            if(await this.collectionElement.findByIdAndDelete(id)==null)return 0;
            else{
                console.log("Elemento con Id:"+id+" eliminado")
                return 1
            }
        }
        catch(e){
            logger.error("No se pudo eliminar el dato de Mongo")
            return -1
        }
    } 

    //Funcion para eliminar todos los elementos de una coleccion
    async deleteAll(){
        try {
            await this.collectionElement.deleteMany();
            console.log("Se elminaron todos los documentos")
        }catch(e) {
            logger.error("No se pudieron eliminar los datos de Mongo");
        }
    }

    async updateById(idElemento,nuevaInformacion){
        try{
            let elementoActual=await this.getById(idElemento)
            if (elementoActual!=null){
                if (nuevaInformacion.nombre)elementoActual.nombre=nuevaInformacion.nombre;
                if (nuevaInformacion.descripcion)elementoActual.descripcion=nuevaInformacion.descripcion;
                if (nuevaInformacion.codigo)elementoActual.codigo=nuevaInformacion.codigo;
                if (nuevaInformacion.foto)elementoActual.foto=nuevaInformacion.foto;
                if (nuevaInformacion.precio)elementoActual.precio=nuevaInformacion.precio;
                if (nuevaInformacion.stock)elementoActual.stock=nuevaInformacion.stock;
                await this.collectionElement.findByIdAndUpdate(idElemento,elementoActual)
                return 1
            }else return 0

        }catch(e){
            logger.error("No se pudo actualizar el dato en Mongo")
            return -1
        }
    }

    
}

