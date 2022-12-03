import dotenv from "dotenv";
import path from "path";

if(typeof process.env.NODE_ENV == "undefined") {
  console.log("production" + ".env");
  dotenv.config({
    path: path.resolve(process.cwd(), "production" + ".env"),
  })
  }else{
  console.log(process.env.NODE_ENV + ".env");
  dotenv.config({
    path: path.resolve(process.cwd(), process.env.NODE_ENV + ".env"),
  });
}

export default {
  NODE_ENV: process.env.NODE_ENV || "development",
  HOST: process.env.HOST || "localhost",
  PORT: process.env.PORT || 8080,
  TIPO_PERSISTENCIA: process.env.TIPO_PERSISTENCIA || "MEM",
  DATABASE_CONNECTION_STRING:process.env.DATABASE_CONNECTION_STRING || "",
  SECRET_MONGO:process.env.SECRET_MONGO || ""
};
