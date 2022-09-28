import  fs  from 'fs'

export default class Contenedor_FS{
    constructor(nombre){
        this.nombre=nombre+".txt"; 
        this.listado=[];
        this.ultimoID=0;
    }
  
  //Funcion para obtener todos los elementos del archivo. Los almacena en el listado y guarda el ultimo id asignado
    getAll(){
        let contenido;
        try{
            contenido = fs.readFileSync(this.nombre,'utf-8') || [];
            let listadoParce = JSON.parse(contenido) || [];
            this.listado=listadoParce;
            this.ultimoID=this.listado[this.listado.length-1].id;
            return listadoParce
        }
        catch (err){
            console.log("El archivo "+this.nombre+" no existe o se encuentra vacio");
            return []
        }   
    }
  
  
    //Funcion para guardar volver a guardar todo el listado en archivo(se usa cuando modifico un elemento del listado)
    saveModificado(){ 
        try{
            fs.writeFileSync(this.nombre,JSON.stringify(this.listado))            
        }
        catch{
            console.log("No se pudo guardar el archivo "+this.nombre)
        }
    }
  
    //Funcion para guardar un elemento nuevo en el archivo(asigna nuevo id)
    save(elemento)
    { 
        try{
            this.getAll()
            this.ultimoID++;
            elemento.id=this.ultimoID;
            this.listado.push(elemento);
            fs.writeFileSync(this.nombre,JSON.stringify(this.listado))
            return this.ultimoID;            
        }
        catch{
            console.log("No se pudo guardar el archivo "+this.nombre)
        }
    }

    //Funcion para mostrar la informacion de un producto segun el ID. Retorna el indice del listado
    getByID(indicador){
        try{
            this.getAll()
            let indice=-1;
            for(let i=0;i<this.listado.length;i++){
            if (this.listado[i].id==indicador){
                indice = i;
            }
            }
            return indice;
        }
        catch{
            console.log("No se pudo leer el archivo "+this.nombre)
            return null;  
        }
    } 

    //Funcion para eliminar un elemento del listado. Actualiza Archivo
    deleteByID(indicador){
        try{
            this.getAll()
            let indiceBorrar=-1;
            for(let i=0;i<this.listado.length;i++){
                if (this.listado[i].id==indicador)
                {
                    indiceBorrar=i;
                }
            }
            if(indiceBorrar==-1){
                console.log("No se encuentra el indice");
                return false; //Retorno false si no se encontro indice
            }
            else{
                this.listado.splice(indiceBorrar,1)
                fs.writeFileSync(this.nombre,JSON.stringify(this.listado))
                console.log("Elemento borrado")
                return true; //Retorno true si lo encontro y elimino correctamente
            }    
        }
        catch{
            console.log("No se pudo modificar el archivo "+this.nombre)
        }
    }

  //Funcion para eliminar todos los elementos del listado. Actualiza archivo
    deleteAll(){
        try{
            this.listado=[];
            this.ultimoID=0;
            fs.writeFileSync(this.nombre,JSON.stringify(this.listado))
            console.log("El contenido del archivo "+ this.nombre +" ha sido eliminado")
        }
        catch{
            console.log("No se pudo modificar el archivo "+this.nombre)
        }
    }



    agregarAlCarrito(idCarrito,producto)
    { 
        let i=0;
        try{
            this.getAll()
            let idEncontrado=-1;
            for(i=0; i<this.listado.length;++i)
            {
                if (this.listado[i].id==idCarrito){
                    idEncontrado=i;
                    break;
                }
            }
            if (idEncontrado>-1){
                this.listado[idEncontrado].productos.push(producto);
                fs.writeFileSync(this.nombre,JSON.stringify(this.listado))
                return true 
            }
            else {
                console.log("No se encontro el carrito")
                return false
            }            
        }
        catch{
            console.log("No se pudo guardar el archivo "+this.nombre)
        }
    }


    quitarDelCarrito(idCarrito,idProducto){
        let i=0;
        try{
            this.getAll()
            let indiceCarritoEncontrado=-1,indiceProductoEncontrado=-1;
            //Busco  del indice del carrito
            for(i=0; i<this.listado.length;++i)
            {
                //Si lo encuentro lo guardo y salgo del for
                if (this.listado[i].id==idCarrito){
                    indiceCarritoEncontrado=i;
                    break;
                }
            }
            //Si encuentro el indice del carrito busco el indice del producto
            if (indiceCarritoEncontrado>-1){
                for(i=0; i<this.listado[indiceCarritoEncontrado].productos.length;++i){
                    //Si lo encuentro el dindice del producto lo guardo y salgo del for
                    if (this.listado[indiceCarritoEncontrado].productos[i].id==idProducto){
                        indiceProductoEncontrado=i;
                        break;
                    }
                }
                //Si encontre el indice del producto lo borro y guardo el archivo
                if(indiceProductoEncontrado>-1){
                    this.listado[indiceCarritoEncontrado].productos.splice(indiceProductoEncontrado,1)
                    fs.writeFileSync(this.nombre,JSON.stringify(this.listado))
                    return 0
                }
                else{ //si no encuentro el producto
                    console.log("No se encontro el producto")
                    return 1
                } 
            }
            else{ //si no encuentro el carrito
                console.log("No se encontro el carrito")
                return 2
            }            
        }
        catch(err){
            console.log("No se pudo guardar el archivo "+this.nombre)
            console.log(err)
            return 3
        } 
    }

}