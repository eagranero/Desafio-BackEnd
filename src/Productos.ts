import fs from "fs";

class elemento{
  nombre:string="";
  precio:number=0;
  thumbnail:string="";
  id:number=-1 
}

export default class Productos{
  nombre:string;
  listado:elemento[];
  cantidad:number
  
  constructor(nombre: string){
    this.nombre=nombre; 
    this.listado=[];
    this.cantidad=0;
  }
  
  //Funcion para obtener todos los elementos del archivo. Los almacena en el listado y guarda el ultimo id asignado
  getAll(){
    let contenido: string;
    try{
      contenido = fs.readFileSync(this.nombre,'utf-8') || "[]";
      let listadoParce:elemento[] = JSON.parse(contenido) || [];
      this.listado=listadoParce;
      this.cantidad=this.listado[this.listado.length-1].id;
      return listadoParce
    }
     catch (err){
      console.log("El archivo no existe o se encuentra vacio");
    }
  }
  
  
  //Funcion para guardar volver a guardar todo el listado en archivo(se usa cuando modifico un elemento del listado)
  saveModificado(){ 
    try{
      fs.writeFileSync(this.nombre,JSON.stringify(this.listado))            
    }
    catch{
      console.log("No se pudo guardar el archivo")
    }
  }
  
  //Funcion para guardar un elemento nuevo en el archivo(asigna nuevo id)
  save(nombre:string,precio:number,thumbnail:string)
  { 
    try{
      this.getAll()
      this.cantidad++;
      this.listado.push({nombre:nombre,precio:precio,thumbnail:thumbnail,id:this.cantidad});
      fs.writeFileSync(this.nombre,JSON.stringify(this.listado))            
    }
    catch{
      console.log("No se pudo guardar el archivo")
    }
  }



//Funcion para mostrar la informacion de un producto segun el ID. Muestra en consola y retorna el indice del listado
  getByID(indicador){
    try{
      this.getAll()
      for(let i=0;i<this.listado.length;i++){
        if (this.listado[i].id==indicador){
          console.log(this.listado[i])
          return i
        }
      }
    }
    catch{
      console.log("No se pudo leer el archivo")
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
      console.log("No se pudo modificar el archivo")
    }
  }

  //Funcion para eliminar todos los elementos del listado. Actualiza archivo
  deleteAll(){
    try{
      this.listado=[];
      this.cantidad=0;
      fs.writeFileSync(this.nombre,JSON.stringify(this.listado))
      console.log("El contenido del archivo ha sido eliminado")
    }
    catch{
      console.log("No se pudo modificar el archivo")
    }
  }
}