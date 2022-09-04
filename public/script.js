const socket = io();

socket.on("connect", () => {
  console.log("me conecte!");
});

socket.on("data-generica", (data) => {
  console.log(data);
});



socket.on("listadoChat", (data) => {
  const dataString = data.map(d=>`<div><span style='color:blue;font-weight:bold'> ${d.mail} </span> <span style='color:brown'>${d.tiempo}</span> <span style='font-style:italic'>${d.msg}</span></div>`);
  const html = dataString.reduce((html, item) => item + html,"");
  document.getElementById("div-chats").innerHTML = html;
});

function enviar() {
  let date = new Date();
  const mail = document.getElementById("caja-mail").value;
  if(mail!=""){
  const msg = document.getElementById("caja-msg").value;
  const tiempo = "["+date.toLocaleDateString() + " - " + date.toLocaleTimeString()+"]";
  socket.emit("msg-chat", {mail,tiempo,msg});
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
    console.log(data)
    const html = data.reduce((html, item) =>
    html+ 
    "<div style=\"border-style:solid; padding:20px ;margin:10px ;text-align:center; width:200px\">" 
    + "<h2>" + item.nombre + "</h2>"
    + "<h3>" + item.precio + "</h3>"
    + "<img src=\"" + item.thumbnail + "\"/>"  
    + "</div>","");
    document.getElementById("div-productos").innerHTML = html;
  });