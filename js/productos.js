////////////// FUNCIONES PARA MOSTRAR PRODUCTOS EN PANTALLA

/**
 * Crea un elemento div para mostrar la información de un producto en pantalla.
 * 
 * @param {Object} producto - El objeto del producto con su información.
 * @param {string} producto.imagen - La URL de la imagen del producto.
 * @param {string} producto.nombre - El nombre del producto.
 * @param {string} producto.descripcion - La descripción del producto.
 * @param {number} producto.precio - El precio del producto.
 * @param {number} producto.stock - La cantidad de stock disponible.
 * @returns {HTMLElement} - El elemento div con el contenido del producto.
 */
function mostrarProducto(producto) {

    const divProducto = document.createElement('div');
    const img = document.createElement('img');
    const h3 = document.createElement('h3');
    const pDescripcion = document.createElement('p');
    const pPrecio = document.createElement('p');
    const btnAgregar = document.createElement('button');

    img.setAttribute('src', producto.imagen);
    img.setAttribute('alt', `Imagen de ${producto.nombre}`);
    h3.textContent = producto.nombre;
    pDescripcion.textContent = producto.descripcion;
    pPrecio.textContent = `${producto.precio}€`;
    btnAgregar.textContent = 'Agregar al carrito';
    btnAgregar.addEventListener('click', (event) => agregarAlCarrito(producto));
    btnAgregar.classList.add('btn')
    divProducto.classList.add('producto');

    if (producto.stock <= 0) {
        divProducto.classList.add('noDisponible');
    }

    divProducto.append(img, h3, pDescripcion, pPrecio, btnAgregar);
    return divProducto;
}

const wrapper = document.querySelector('.wrapperMain');

/**
 * Muestra todos los productos en el contenedor principal.
 */
function mostrarTodos() {

    for (let producto of productos) {
        const productoPlanta = mostrarProducto(producto);
        wrapper.appendChild(productoPlanta);
    }
}

mostrarTodos();

/////// CARRITO
//////// FUNCION PINTAR CARRITO 

/**
 * Muestra los productos en el carrito en el DOM.
 * 
 * @param {Array} lista - Lista de productos añadidos al carrito.
 */
function pintarCarrito(lista) {
    const contenedorCarro = document.querySelector('.contenedorCarro');
    contenedorCarro.innerHTML = '';

    const h3 = document.createElement('h3');
    h3.textContent = 'Carrito de compra';

    const contenedorProductos = document.createElement('ul');
    contenedorProductos.classList.add('ulCarrito');

    lista.forEach((productoAñadido) => {
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = "Eliminar";
        btnEliminar.addEventListener('click', (event) => eliminarProducto(productoAñadido));

        const btnSumar = document.createElement('button');
        btnSumar.textContent = '+';
        btnSumar.addEventListener('click', (event) => sumarProducto(productoAñadido));
        btnSumar.classList.add('button-count');

        const btnRestar = document.createElement('button');
        btnRestar.textContent = '-';
        btnRestar.addEventListener('click', (event) => restarProducto(productoAñadido));
        btnRestar.classList.add('button-count');

        const li = document.createElement('li');
        const p = document.createElement('p');
        li.append(p);
        p.textContent = `${productoAñadido.nombre} - ${productoAñadido.precio}€ x ${productoAñadido.cantidad}`;
        li.append(btnEliminar, btnSumar, btnRestar);

        contenedorProductos.append(li);
    });

    const total = calcularTotal();
    const p = document.createElement('p');
    p.textContent = `Total a pagar: ${total}€`;

    const btnVaciar = document.createElement('button');
    btnVaciar.textContent = 'Vaciar carrito';
    btnVaciar.addEventListener('click', vaciarCarrito);

    const btnPagar = document.createElement('button');
    btnPagar.textContent = 'Realizar pago';
    btnPagar.addEventListener('click', (event) => pagar());

    contenedorCarro.append(h3, contenedorProductos, p, btnVaciar, btnPagar);
}

/**
 * Realiza el pago del carrito.
 */
function pagar() {
    if (carrito.length > 0) {
        alert('pedido realizado');
    } else {
        alert('no hay productos en el carrito');
    }
}

/**
 * Sumar cantidad de producto.
 * 
 * @param {Object} productoAñadido - El producto que se desea sumar.
 */
function sumarProducto(productoAñadido) {
    console.log('producto añadido', productoAñadido);
    if (productoAñadido.cantidad < productoAñadido.stock) {
        productoAñadido.cantidad = productoAñadido.cantidad + 1;
    } else {
        alert('Stock no disponible');
    }
    calcularTotal();
    pintarCarrito(carrito);
}

/**
 * Resta una unidad a un producto en el carrito o lo elimina si la cantidad es 1.
 * 
 * @param {Object} productoAñadido - El producto que se desea restar.
 */
function restarProducto(productoAñadido) {
    console.log('producto añadido', productoAñadido);
    if (productoAñadido.cantidad > 1) {
        productoAñadido.cantidad = productoAñadido.cantidad - 1;
    } else {
        eliminarProducto(productoAñadido);
    }
    calcularTotal();
    pintarCarrito(carrito);
}

/**
 * Elimina un producto del carrito.
 * 
 * @param {Object} productoAñadido - El producto que se desea eliminar.
 */
function eliminarProducto(productoAñadido) {
    console.log('producto añadido', productoAñadido.cantidad);
    productoAñadido.cantidad = 0;
    calcularTotal();
    for (let i = 0; i < carrito.length; i++) {
        const element = carrito[i];
        if (productoAñadido === element) {
            carrito.splice(element, 1);
        }
    }
    eventoBoton(2);
    pintarCarrito(carrito);
}

/** Calcular total del carrito.
 * 
 * @returns {number} - El total del precio de los productos en el carrito.
 */
function calcularTotal() {
    return carrito.reduce((total, productoAñadido) => {
        return total + (productoAñadido.precio * productoAñadido.cantidad);
    }, 0);
}


// Vaciar el carrito.


function vaciarCarrito() {
    carrito = [];
    pintarCarrito(carrito);
    eventoBoton(0);
}

/// Función para agregar productos al carrito y aumentar la cantidad.

let carrito = [];

/**  
 * @param {Object} producto - El producto que se desea agregar al carrito.
 */

function agregarAlCarrito(producto) {

    let existeProducto = carrito.find((productoAñadido) => productoAñadido.id === producto.id);
    if (existeProducto && existeProducto.cantidad < producto.stock) {
        existeProducto.cantidad++;
    }
    else if (existeProducto && existeProducto.cantidad === producto.stock) {
        console.log('Stock no disponible');
        alert('Stock no disponible');
    }

    if (!existeProducto) {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            cantidad: 1,
            precio: producto.precio,
            stock: producto.stock
        });
    }
    eventoBoton(1);
    pintarCarrito(carrito);
}

pintarCarrito(carrito);


///// Mostrar u ocultar el carrito al hacer click en el icono.

const btnCarrito = document.querySelector('#btnCarrito');

function eventoBoton(estado) {
    const contenedorCarro = document.querySelector('.contenedorCarro');
    switch (estado) {
        case 0:
            // Muestra el carrito al pulsar el icono
            if (contenedorCarro.style.display === 'block') {
                contenedorCarro.style.display = 'none';
            } else {
                contenedorCarro.style.display = 'block';
            }
            break;
        // Muestra el carrito al agregar el primer producto.
        case 1:
            contenedorCarro.style.display = 'block';
            break;
        // Oculta el carrito al eliminar todos los productos o vaciar carrito.
        case 2:
            if (carrito.length <= 0) {
                contenedorCarro.style.display = 'none'
            }

        default:
            break;
    }
}
