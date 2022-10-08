import knex from "knex"

export default class DB{
    constructor(nombre,tipo){
        this.nombre=nombre; 
        this.myknex = knex(tipo);
    }
    
    //Metodo para crear tabla. SOLO PARA PRODUCTOS
    crearDBProductos(){
        this.myknex.schema.createTable(this.nombre, (table) => {
            table.increments("id"), 
            table.string("nombre"), 
            table.integer("precio"),
            table.string("thumbnail");
        })
        .then(() => {
            console.log("Tabla Creada");})
        .catch((err) => {
            if(err.code=="ER_TABLE_EXISTS_ERROR")console.log("La tabla ya existe");})
    }

    crearDBChat(){
        this.myknex.schema.createTable(this.nombre, (table) => {
            table.increments("id"), 
            table.string("mail"),
            table.string("tiempo"),
            table.string("msg")   
        })
        .then(() => {
            console.log("Tabla Creada");})
        .catch((err) => {
            if(err.code=="SQLITE_ERROR" && err.errno==1)console.log("La tabla ya existe");
        else console.log(err)})
    }

    borrarTabla(){
        this.myknex.schema.dropTable(this.nombre)
        .then((response)=>{
            console.log("borrado")})
        .catch((err)=>{if(err.code=="ER_NO_SUCH_TABLE")console.log("La tabla no existe");})
            
    }

    async getAll_Knex(){
        let data = await this.myknex(this.nombre)
        .select("*")
        .then((response) => response)
        .catch((err) => console.log(err))
        
        return data;
    }

   async save_Knex(elemento){
        await this.myknex(this.nombre)
        .insert(elemento)
        .then((r)=>{
            console.log("Elemento cargado")
            return true
        })
        .catch((err)=>{
            if(err.code=="ER_NO_SUCH_TABLE")console.log("La tabla no existe");
            else console.log(err)
            return false
        })
         
    }

    async getByID_Knex(indicador){
        let data = await this.myknex(this.nombre)
        .where("id", indicador)
        .then((res) => res)
        .catch((err) => console.log(err))

        return data;
    }

    deleteByID_Knex(indicador) {
        let deleted = this.myknex(this.nombre).del()
          .where("id", indicador)
          .then((res) => res)
          .catch((err) => console.log(err))
    
        return deleted;
    }

    deleteAll(){
        let deleted = this.myknex.from(this.nombre).del()
            .then(()=>console.log("Elementos borrados"))
            .catch((err)=>{console.log(err);throw err})
        return deleted; 
    }
}