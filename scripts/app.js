const TASA_CAMBIO_BCV = 830;
const TELEFONO_COMERCIO = "04121965220";

//configuracion del carrito
const carrito = {
    hamburguesa: {nombre: "Hamburguesa Especial", precio: 5.50, cantidad: 0},
    patacon: {nombre: "Patacon Zuliano", precio: 6.00, cantidad: 0}
};

function sumar(id) {
    carrito[id].cantidad++;
    document.getElementById(`cant-${id}`).innerText = carrito[id].cantidad;
    calcularTotal();
}

function restar(id) {
    if (carrito[id].cantidad > 0) {
        carrito[id].cantidad--;
        document.getElementById(`cant-${id}`).innerText = carrito[id].cantidad;
        calcularTotal();
    }
}

function vaciarCarrito() {
    if (confirm("¿Esta seguro de que desea vaciar todo tu carrito?")) {
        for (let key in carrito) {
            
            carrito[key].cantidad = 0;
        }
        document.getElementById('cant-hamburguesa').innerText = "0";
        document.getElementById('cant-patacon').innerText = "0";
        calcularTotal();
    }
}

function calcularTotal() {
    let subtotal = 0;
    for (let key in carrito) {
        subtotal += carrito[key].cantidad * carrito[key].precio;
    }

    let costoDelivery = parseFloat(document.getElementById('delivery').value);
    let totalDolares = subtotal > 0 ? (subtotal + costoDelivery) : 0;

    let totalBolivares = totalDolares * TASA_CAMBIO_BCV;

    document.getElementById('monto-total').innerText = `${totalDolares.toFixed(2)}`;
    document.getElementById('monto-total-bs').innerText = `${totalBolivares.toFixed(2)}`;

    return {subtotal, totalDolares, totalBolivares};
}

function alternarPago() {
    const metodo = document.getElementById('pago').value;
    const bloqueBanco = document.getElementById('bloque-banco');
    const campoVerificacion = document.getElementById('campo-verficacion');

    if (metodo === "Pago Movil") {
        bloqueBanco.style.display = "block";
        campoVerificacion.style.display = "block";
    }else {
        bloqueBanco.style.display = "none";
        campoVerificacion.style.display = "none";
    }
}

function enviarPedido() {
    const calculo = calcularTotal();
    if (calculo.subtotal === 0) {
        alert("Agrega productos a tu carrito de compras.");
        return;
    }

    const nombre = document.getElementById('nombre_cliente').value.trim();
    const cedula = document.getElementById('cedula_cliente').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const metodoPago = document.getElementById('pago').value;

    if (!nombre || !cedula || !direccion) {
        alert("por favor complete los datos de envio (Nombre, Cadula, y Direccion.");
        return;
    }

    let datosPagoMovil = "";
    if (metodoPago === "Pago Movil") {
        const banco = document.getElementById('banco_emisor').value.trim();
        const ref = document.getElementById('referencia').value.trim();
        if (!banco || !ref) {
            alert("Para Pago Movil debes ingresar el Banco Emisor y el numero de Referencia.");
            return;
        }
        datosPagoMovil = `\n *Banco Emisor:* ${banco}\n *Referencia:* ${ref}`;
    }

    let texto = `*NUEVO PEDIDO WEB\n*`;
    texto += `*Cliente:* ${nombre}\n`;
    texto += `*Cedula:* V-${cedula}\n`;
    texto += `---------------------------\n`;

    for (const key in carrito) {
        if (carrito[key].cantidad > 0) {
            let subItem = carrito[key].cantidad * carrito[key].precio;
            texto += `· ${carrito[key].cantidad}x ${carrito[key].nombre} ($${subItem.toFixed(2)})\n`;
        }
    }

    const zonaDelivery = document.getElementById('delivery').options[document.getElementById('delivery').selectedIndex].text;
    texto += `----------------------------\n`;
    texto += `*Zona:* ${zonaDelivery}\n`;
    texto += `*Direccion:* ${direccion}\n`;
    texto += `*Metodo de Pago:* ${metodoPago}${datosPagoMovil}\n`;
    texto += `*Tasa de Cambio* ${TASA_CAMBIO_BCV.toFixed(2)} Bs/$\n`;
    texto += `*TOTAL REF:* $${calculo.totalDolares.toFixed(2)}\n`;
    texto += `*TOTAL BS:* ${calculo.totalBolivares.toFixed(2)} Bs.`;

    const urlDestno = "http://wa.me"+TELEFONO_COMERCIO+"?text="+encodeURIComponent(texto)};
    window.open(urlDestno, '_blank');
}
