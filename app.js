
class BaseDeDatos {
  constructor() {
    
    this.productos = [];
    
    this.agregarRegistro(1, "Blusa", 5000, "Prendas", "blusa.jpg");
    this.agregarRegistro(2, "Remera", 3500, "Prendas", "remera.jpg");
    this.agregarRegistro(3, "Saco", 7000, "Prendas", "saco.jpg");
    this.agregarRegistro(4, "Buzo", 5500, "Prendas", "buzo.jpg");
  }

 
  agregarRegistro(id, nombre, precio, categoria, imagen) {
    const producto = new Producto(id, nombre, precio, categoria, imagen);
    this.productos.push(producto);
  }

 
  traerRegistros() {
    return this.productos;
  }

 
  registroPorId(id) {
    return this.productos.find((producto) => producto.id === id);
  }


  registrosPorNombre(palabra) {
    return this.productos.filter((producto) => producto.nombre.toLowerCase().includes(palabra));
  }
}

class Carrito {
  constructor() {
    
    const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
    
    this.carrito = carritoStorage || [];
    this.total = 0;
    this.totalProductos = 0;
  
    this.listar();
  }


  estaEnCarrito({ id }) {
    return this.carrito.find((producto) => producto.id === id);
  }

  agregar(producto) {
 
    const productoEnCarrito = this.estaEnCarrito(producto);
    if (productoEnCarrito) {
      
      productoEnCarrito.cantidad++;
    } else {
     
      this.carrito.push({ ...producto, cantidad: 1 });
    }
    
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
    
    this.listar();
  }

  
  quitar(id) {
  
    const indice = this.carrito.findIndex((producto) => producto.id === id);
    
    if (this.carrito[indice].cantidad > 1) {
      this.carrito[indice].cantidad--;
    } else {
   
      this.carrito.splice(indice, 1);
    }
    
    localStorage.setItem("carrito", JSON.stringify(this.carrito));
   
    this.listar();
  }

  
  listar() {
   
    this.total = 0;
    this.totalProductos = 0;
    divCarrito.innerHTML = "";
   
    for (const producto of this.carrito) {
     
      divCarrito.innerHTML += `
        <div class="productoCarrito">
            <h2>${producto.nombre}</h2>
            <p>$${producto.precio}</p>
            <p>Cantidad: ${producto.cantidad}</p>
            <a href="#" data-id="${producto.id}" class="btnQuitar">Quitar del carrito</a>
        </div>
    `;
     
      this.total += producto.precio * producto.cantidad;
      this.totalProductos += producto.cantidad;
    }
    
    const botonesQuitar = document.querySelectorAll(".btnQuitar");
    for (const boton of botonesQuitar) {
      
      boton.onclick = (event) => {
        event.preventDefault();
        
        this.quitar(Number(boton.dataset.id));
      };
    }
   
    spanCantidadProductos.innerText = this.totalProductos;
    spanTotalCarrito.innerText = this.total;
  }
}


class Producto {
  constructor(id, nombre, precio, categoria, imagen = false) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
    this.imagen = imagen;
  }
}


const bd = new BaseDeDatos();


const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector("#carrito");
const spanCantidadProductos = document.querySelector("#cantidadProductos");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const inputBuscar = document.querySelector("#inputBuscar");
const botonCarrito = document.querySelector("section h1");


cargarProductos(bd.traerRegistros());


function cargarProductos(productos) {
  divProductos.innerHTML = "";
 
  for (const producto of productos) {

    divProductos.innerHTML += `
        <div class="producto">
            <h2>${producto.nombre}</h2>
            <p class="precio">$${producto.precio}</p>
            <div class="imagen">
              <img src="img/${producto.imagen}" />
            </div>
            <a href="#" class="btnAgregar" data-id="${producto.id}">Lo quiero</a>
        </div>
    `;
  }

  const botonesAgregar = document.querySelectorAll(".btnAgregar");
  for (const boton of botonesAgregar) {
 
    boton.addEventListener("click", (event) => {
      event.preventDefault();
     
      const id = Number(boton.dataset.id);
      
      const producto = bd.registroPorId(id);
     
      carrito.agregar(producto);
    });
  }
}


inputBuscar.addEventListener("keyup", (event) => {
  event.preventDefault();
  
  const palabra = inputBuscar.value;

  const productos = bd.registrosPorNombre(palabra.toLowerCase());
 
  cargarProductos(productos);
});


botonCarrito.addEventListener("click", (event) => {
  document.querySelector("section").classList.toggle("ocultar");
});


const carrito = new Carrito();
