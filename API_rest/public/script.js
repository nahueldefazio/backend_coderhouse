let productos


function cargarProducto() {
    fetch('http://localhost:8080/api/productos')
        .then(response => response.json())
        .then(data => {
            productos = data
            let product_div = document.getElementById("productos")
            let producto_container = document.createElement("ul");
            productos.forEach(producto =>{

                producto_container.innerHTML += `
                                    <li>${producto.title} - ${producto.price}$ </li>
                                        `
                product_div.appendChild(producto_container);
            })
        })
}


function enviarFormulario(e) {
    e.preventDefault();
    let form = e.target;
    let formData = new FormData(form);
    let encodedData = new URLSearchParams(formData).toString()

    fetch('/api/productos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: encodedData
    })
        .then(result => {
            document.getElementById("productos").innerHTML = ""
            cargarProducto()
        });
}

cargarProducto()



