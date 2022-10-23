
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generarProducto = generarProducto;
var _faker = require("@faker-js/faker");
_faker.faker.locale = "es";
function generarProducto() {
  return {
    nombre: _faker.faker.science.chemicalElement().name,
    precio: _faker.faker.random.numeric(3),
    thumbnail: _faker.faker.image.abstract(200, 200)
  };
}