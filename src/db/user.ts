// deno-lint-ignore-file
import type { User, UserForCreation, UserForUpdate } from "../types/user.ts";
import { v1 } from "../deps.ts";

let users: User[] = [];

export const findUserById = (uuid: string) => {
  const found = users.find(e => e.uuid == uuid)
  if (found){
    return { uuid, name: found.name, birthDate: found.birthDate };
  }else{
    throw new Error("User not found");
  }
};

export const createUser = (user: UserForCreation): User => {
  if(user.name && user.birthDate){
    const nuevoUsuario ={
      uuid: v1.generate().toString(),
      name: user.name,
      birthDate: user.birthDate,
    }
    users.push(nuevoUsuario)
    return nuevoUsuario;
  }else{
    throw new Error("cant create the user");
  }
};

// updateUser
export const updateUser = (
  uuid: string,
  userForUpdate: UserForUpdate
): User => {

  const index = users.map(e => e.uuid).indexOf(uuid)
  if (index > -1){
    if (userForUpdate.name)users[index].name=userForUpdate.name
    if (userForUpdate.birthDate)users[index].birthDate=userForUpdate.birthDate
    return users[index];
  }else{
    throw new Error("User not found");
  }
};

// deleteUser
export const deleteUser = (uuid: string): boolean => {
  const index = users.map(e => e.uuid).indexOf(uuid)
  if (index >-1){
    users.splice(index,1)
    return true;
  }else{
    throw new Error("User not found");
  }
};
