const  fs=require('fs')
const  express=require('express')

class Contenedor{
    constructor(nombre){
        this.nombre=nombre; 
        this.listado=[];
        this.id=0;
    }

    //Funcion para obtener todos los elementos del archivo. Los almacena en el listado y guarda el ultimo id asignado
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

    //Funcion para guardar volver a guardar todo el listado en archivo(se usa cuando modifico un elemento del listado)
    async saveModificado(){ 
        try{
            await fs.promises.writeFile(this.nombre,JSON.stringify(this.listado))            
        }
        catch{
            console.log("No se pudo guardar el archivo")
        }
    }

    //Funcion para guardar un elemento nuevo en el archivo(asigna nuevo id)
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

    //Funcion para mostrar la informacion de un producto segun el ID. Muestra en consola y retorna el indice del listado
    async getByID(indicador){
        try{
            await this.getAll()
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
            if(indiceBorrar==null){
                console.log("No se encuentra el indice");
                return false; //Retorno false si no se encontro indice
            }
            else{
                this.listado.splice(indiceBorrar,1)
                await fs.promises.writeFile(this.nombre,JSON.stringify(this.listado))
                console.log("Elemento borrado")
                return true; //Retorno true si lo encontro y elimino correctamente
            }    
        }
        catch{
            console.log("No se pudo modificar el archivo")
        }

    }

    //Funcion para eliminar todos los elementos del listado. Actualiza archivo
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

// Creo un objeto de la clase Contenedor
const listadoProductos = new Contenedor("listado.txt");

//Cargo elementos en el listado y el archivo para experimentar con ellos
(async()=>{
    await listadoProductos.deleteAll()
    await listadoProductos.save({nombre:"Escuadra", precio:123.45, tumbnail:"https://imagen.com/123456"})
    await listadoProductos.save({nombre:"Calculadora", precio:123.45, tumbnail:"https://imagen.com/123456"})
    await listadoProductos.save({nombre:"Cuaderno", precio:123.45, tumbnail:"https://imagen.com/123456"})
    await listadoProductos.save({nombre:"Regla", precio:123.45, tumbnail:"https://imagen.com/123456"})
})();


//Inicio Servidor Express
const app = express();
const router = express.Router();

const PORT = process.env.PORT || 8080

const server = app.listen(PORT,()=>{
    console.log("Servidor Encendido")
})

server.on("error",(error)=>{console.log("Error en servidor")})

app.use(express.json())
app.use(express.urlencoded({extended:true}));

app.use('/api/productos',router)

//Rutas del servidor

//En la raiz dejo el formulario
app.get('/', (req,res)=>{
    //res.json({mensaje:"Curso de Back-End"});
    res.sendFile(__dirname+'/public/index.html')
})

//Muestro todos los productos
router.get('/', (req,res)=>{
    res.json(listadoProductos.listado);
})


//Muestro producto segun id
router.get('/:id', (req,res)=>{

    const {id} = req.params;
    let elemento=listadoProductos.listado.find((item)=>item.id==id)
    if (elemento) res.json(elemento)
    else res.json({error:"Producto no encontrado"})
    
})

//Agrego nuevo producto. Actualizo archivo y respondo con el producto cargado y su id
router.post('/', (req,res)=>{

    const {body} = req;
    (async()=>{
        await listadoProductos.save(body) //agrego producto al archivo
        res.json(listadoProductos.listado[listadoProductos.listado.length-1])
    })();
    
})

router.put('/:id', (req,res)=>{

    const {id} = req.params;
    const {body} = req;
    let encontrado=false;

    for(let i=0; i<listadoProductos.listado.length;++i){ //Realizo barrido de busqueda en listado
        if (listadoProductos.listado[i].id==id){ //Busco elemento segun id
            encontrado=true; //Indico que lo encontre
            if(body.nombre)listadoProductos.listado[i].nombre=body.nombre; //si indico nombre lo cambio
            if(body.precio)listadoProductos.listado[i].precio=body.precio; //si indico precio lo cambio
            if(body.tumbnail)listadoProductos.listado[i].tumbnail=body.tumbnail; //si indico tumbnail lo cambio
            break; //Salgo del bucle
        }
    }
    if (encontrado==false) res.json({error:"Producto no encontrado"})
    else{
        (async()=>{ 
            await listadoProductos.saveModificado(); //Actualizo el archivo
            res.json(listadoProductos.listado[await listadoProductos.getByID(id)]) //Respondo con el elemento modificado
        })();
    }
})


//Elimino un producto en funcion de su id
router.delete('/:id', (req,res)=>{

    let respuesta;
    const {id} = req.params;
    (async()=>{
        respuesta = await listadoProductos.deleteByID(id); //Elimino elemento y actualizo archivo. Segun respuesta envío mensaje
        if(respuesta==true) res.json({mensaje:"Elemento eliminado"})
        else if(respuesta==false) res.json({error:"Producto no encontrado"})
        else res.json({error:"Ocurrio un error al eliminar el elemento"})
    })();
    
})

