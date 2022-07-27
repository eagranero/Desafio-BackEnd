const  fs=require('fs')
const  express=require('express')

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

class Contenedor{
    constructor(nombre){
        this.nombre=nombre; 
        this.listado=[];
        this.id=0;
    }
    async getAll(){
        try{
            const contenido = await fs.promises.readFile(this.nombre,'utf-8') || "[]";
            const listadoParce = await JSON.parse(contenido) || [];
            //console.log(listadoParce)
            this.listado=listadoParce;
            this.id=this.listado[this.listado.length-1].id;
            return listadoParce
        }
        catch (err){
            console.log("El archivo no existe o se encuentra vacio");
        }
    }


    async save(elemento){ 
        try{
            await this.getAll()
            this.id++;
            this.listado.push({nombre:elemento.nombre,precio:elemento.precio,tumbnail:elemento.tumbnail,id:this.id});
            await fs.promises.writeFile(this.nombre,JSON.stringify(this.listado))            
        }
        catch{
            console.log("No se pudo guardar el archivo")
        }
    }

    async getByID(indicador){
        try{
            await this.getAll()
            for(let i=0;i<this.listado.length;i++){
                if (this.listado[i].id==indicador){console.log(this.listado[i])}
            }
        }
        catch{
            console.log("No se pudo leer el archivo")
        }
    }

    async deleteByID(indicador){
        try{
            await this.getAll()
            let indiceBorrar=null;
            for(let i=0;i<this.listado.length;i++){
                if (this.listado[i].id==indicador)
                {
                    indiceBorrar=i;
                }
            }
            if(indiceBorrar==null)console.log("No se encuentra el indice")
            else{
                this.listado.splice(indiceBorrar,1)
                await fs.promises.writeFile(this.nombre,JSON.stringify(this.listado))
                console.log("Elemento borrado")
            }    
        }
        catch{
            console.log("No se pudo modificar el archivo")
        }

    }
    async deleteAll(){
        try{
            this.listado=[];
            this.id=0;
            await fs.promises.writeFile(this.nombre,JSON.stringify(this.listado))
            console.log("El contenido del archivo ha sido eliminado")
        }
        catch{
            console.log("No se pudo modificar el archivo")
        }
        
    }
}



const listadoProductos = new Contenedor("listado.txt");

(async()=>{
    await listadoProductos.deleteAll()
    await listadoProductos.save({nombre:"Escuadra", precio:123.45, tumbnail:"https://imagen.com/123456"})
    await listadoProductos.save({nombre:"Calculadora", precio:123.45, tumbnail:"https://imagen.com/123456"})
    await listadoProductos.save({nombre:"Cuaderno", precio:123.45, tumbnail:"https://imagen.com/123456"})
    await listadoProductos.save({nombre:"Regla", precio:123.45, tumbnail:"https://imagen.com/123456"})
})();


const app = express()

const PORT = process.env.PORT || 3000

const server = app.listen(PORT,()=>{
    console.log("Servidor Encendido")
})

server.on("error",(error)=>{console.log("Error en servidor")})

app.get("/", (req,res)=>{
    res.send({mensaje:"Curso de Back-End"});
})

app.get("/productos", (req,res)=>{
    res.send(listadoProductos.listado);
})

app.get("/productoRandom", (req,res)=>{
    res.send(listadoProductos.listado[getRandomInt(listadoProductos.listado.length)]);
})



