"use strict";

process.on("message", msg => {
  let cantidadTotal;
  if (msg.cantidad) cantidadTotal = msg.cantidad;else cantidadTotal = 10000000;
  if (msg.comando == "start") {
    let array = [],
      arrayObjeto = [];
    let a = 0;
    for (a = 0; a < cantidadTotal; ++a) {
      array.push(Math.floor(Math.random() * (100 - 0 + 1) + 0));
    }
    arrayObjeto.push({
      numero: array[0],
      cantidad: 1
    });
    for (a = 1; a < cantidadTotal; ++a) {
      let encontrado = false;
      for (let b = 0; b < arrayObjeto.length; ++b) {
        //console.log(arrayObjeto[b].numero)
        if (arrayObjeto[b].numero == array[a]) {
          encontrado = true;
          arrayObjeto[b].cantidad++;
        }
      }
      if (!encontrado) arrayObjeto.push({
        numero: array[a],
        cantidad: 1
      });
    }
    process.send({
      type: "datos",
      data: arrayObjeto
    });
  }
});