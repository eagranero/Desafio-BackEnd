import express from "express";
import { fork } from "child_process";

export const randoms = express.Router()


randoms.get("/",(req,res)=>{
    res.render("random")
  })
  
randoms.post("/",(req,res)=>{
  
    const {body} = req;
    const {cantidad} = body;
    let computo=fork("./computo.js")
    computo.send({comando:"start",cantidad})
  
    computo.on("message", (msg) => {
      const { data, type } = msg;
      switch (type) {
        case "datos":
          console.log()
          res.end(`Los datos son ${JSON.stringify(data)}`);
          break;
      }
    })
  });
  
  