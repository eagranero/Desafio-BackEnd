
const socket = io();

socket.on("connect", () => {
  console.log("me conecte!");
});

socket.on("data-generica", (data) => {
  console.log(data);
});


const authorSchema = new normalizr.schema.Entity("authors", {},{idAttribute:'mail'})
const schemaMensaje = new normalizr.schema.Entity("post", {author:authorSchema},{idAttribute:'id'})
const schemaPosteos = new normalizr.schema.Entity('posts', { mensajes: [schemaMensaje] }, { idAttribute: 'id' })


socket.on("listadoChat", (data) => {
  console.log(data)
  let data_desnormalizada = normalizr.denormalize(data.result, schemaPosteos, data.entities)
  console.log(data_desnormalizada)
  const dataString = data_desnormalizada.mensajes.map(d=>`<div><span style='color:blue;font-weight:bold'> ${d.author.mail} </span> <span style='color:brown'>${d.author.tiempo}</span> <span style='font-style:italic'>${d.text}</span></div>`);
  const html = dataString.reduce((html, item) => item + html,"");
  if(document.getElementById("div-chats")!=null) document.getElementById("div-chats").innerHTML = html;

  let mensajesNsize = JSON.stringify(data).length
  let mensajesDsize = JSON.stringify(data_desnormalizada).length
  let compresion=parseInt((mensajesNsize * 100) / mensajesDsize)
  if(document.getElementById("h1-compresion")!=null)document.getElementById("h1-compresion").innerHTML = `Compresion del chat: ${compresion}`;

 });

function enviar() {
  let date = new Date();
  const mail = document.getElementById("caja-mail").value;
  if(mail!=""){
    const nombre = document.getElementById("caja-nombre").value;
    const apellido = document.getElementById("caja-apellido").value;
    const edad = document.getElementById("caja-edad").value;
    const alias = document.getElementById("caja-alias").value;
    const avatar = document.getElementById("caja-avatar").value;
    const msg = document.getElementById("caja-msg").value;
    const tiempo = "["+date.toLocaleDateString() + " - " + date.toLocaleTimeString()+"]";
    socket.emit("msg-chat", {author: {mail,tiempo,nombre,apellido,edad,alias,avatar},text:msg});
  }
  else alert("El E-Mail no puede estar en blanco")
  return false;
}

function cargar(){
    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;
    const thumbnail = document.getElementById("thumbnail").value;
    socket.emit("nuevoProducto", {nombre,precio,thumbnail});
    return false;
}

socket.on("listadoProductos", (data) => {
  const html = data.reduce((html, item) =>
  html+ 
  "<div style=\"border-style:solid; padding:20px ;margin:10px ;text-align:center; width:200px\">" 
  + "<h2>" + item.nombre + "</h2>"
  + "<h3>" + item.precio + "</h3>"
  + "<img src=\"" + item.thumbnail + "\"/>"  
  + "</div>","");
  if(document.getElementById("div-productos")!=null)
  document.getElementById("div-productos").innerHTML = html;
});

socket.on("listadoProductos-test", (data) => {
  const html = data.reduce((html, item) =>
  html+ 
  "<div style=\"border-style:solid; padding:20px ;margin:10px ;text-align:center; width:200px\">" 
  + "<h2>" + item.nombre + "</h2>"
  + "<h3>" + item.precio + "</h3>"
  + "<img src=\"" + item.thumbnail + "\"/>"  
  + "</div>","");
  if(document.getElementById("div-productos-test")!=null)
  document.getElementById("div-productos-test").innerHTML = html;
});
