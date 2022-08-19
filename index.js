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
            this.listado.push({nombre:elemento.nombre,precio:elemento.precio,thumbnail:elemento.thumbnail,id:this.id});
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
    await listadoProductos.save({nombre:"Escuadra", precio:123.45, thumbnail:"../img/escuadra.jpg"})
    await listadoProductos.save({nombre:"Calculadora", precio:123.45, thumbnail:"../img/calculadora.jpg"})
    await listadoProductos.save({nombre:"Cuaderno", precio:123.45, thumbnail:"../img/cuaderno.jpg"})
    await listadoProductos.save({nombre:"Regla", precio:123.45, thumbnail:"../img/regla.jpg"})
})();

//Inicio Servidor Express
const app = express();
const router = express.Router();
const { engine } = require('express-handlebars');


const httpServer = require("http").createServer(app);
const io = require("socket.io")(httpServer);
const PORT = process.env.PORT || 8080


httpServer.listen(PORT,()=>{
    console.log("Servidor Encendido")
})

httpServer.on("error",(error)=>{console.log("Error en servidor")})

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));

app.use('/api/productos',router)

app.set('view engine', 'hbs');
app.set('views', './views');
app.engine(
    'hbs',
    engine({
        extname: '.hbs',
        defaultLayout: 'index.hbs',
        layoutsDir: __dirname + '/views/layouts',
        partialsDir: __dirname + '/views/partials',
    })
);


//Direccion para cargar el formulario
app.get('/', (req, res) => {
    res.render('body', { products: listadoProductos.listado, productsExist: true });
});


//Direccion para cargar y ver el producto cargado desde el formulario
router.post('/', (req,res)=>{
    const {body} = req;
    (async()=>{
        await listadoProductos.save(body) //agrego producto al archivo
        res.render('producto', { products: listadoProductos.listado[listadoProductos.listado.length-1], productsExist: true });
    })();  
})


//Direccion para ver todos los productos cargados
router.get('/', (req,res)=>{
    res.render('productos', { products: listadoProductos.listado, productsExist: true });    
})

let chat;
try{chat = JSON.parse(fs.readFileSync("chat.txt",'utf-8') || "[]") || []}
catch{chat=[]}


io.on("connection", (socket) => {
    io.sockets.emit("listadoProductos", listadoProductos.listado);
    
    chat.push({mail:"",tiempo:"",msg: "Se unio al chat " + socket.id});
    io.sockets.emit("listadoChat", chat);

    socket.on("msg-chat", (data) => {
    chat.push(data);
    io.sockets.emit("listadoChat", chat);
    fs.writeFileSync("chat.txt",JSON.stringify(chat))
  });

socket.on("nuevoProducto", (data) => {
    console.log(data);
    (async()=>{
        await listadoProductos.save(data) //agrego producto al archivo
        io.sockets.emit("listadoProductos", listadoProductos.listado);
    })();  
  });
});