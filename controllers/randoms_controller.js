import { fork } from "child_process";

export const randomsInitController = (req,res)=>{
    const pid= process.pid;
    const args=process.argv[3];
    res.render("random",{pid,args});
}

export const randomsGenerarController = (req,res)=>{
  
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
}