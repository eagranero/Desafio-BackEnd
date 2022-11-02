import { faker } from "@faker-js/faker";
faker.locale = "es";

export function generarProducto() {
  return {
    nombre: faker.science.chemicalElement().name,
    precio: faker.random.numeric(3),
    thumbnail: faker.image.abstract(200,200)
  };
}
