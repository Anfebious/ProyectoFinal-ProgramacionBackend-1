
let currentPage = 1
let nextPage = null
let prevPage = null
const socket = io();
socket.on("products", (data) => {
    updateProducts(data.docs);
    currentPage = data.page;
    nextPage = data.nextPage;
    prevPage = data.prevPage;
})
function updateProducts(docs) {
    const container = document.getElementById("container");
    container.innerHTML = "";
    const list = document.createElement("ul")
    container.appendChild(list)
    docs.forEach(product => {
        const item = document.createElement("li");
        for (const [key, value] of Object.entries(product)) {
            item.innerHTML += "<strong>" + key + ": </strong>" + value + "<br>";
        }
        // item.textContent = product.description;
        const button = document.createElement("button");
        button.className = "product-btn";
        button.setAttribute("data-id", product._id);
        button.textContent = "Agregar al Carrito";
        item.appendChild(button);
        list.appendChild(item);
        button.addEventListener('click', function() {
            agregarAlCarrito(product._id)
        });
    });
}
async function getNextPage() {
    const response = await fetch("http://localhost:8080/api/products?page=" + (currentPage + 1)) 
    const products = await response.json();
    updateProducts(products.docs)
    currentPage = products.page;
    nextPage = products.nextPage;
    prevPage = products.prevPage;
}
async function getPrevPage() {
    const response = await fetch("http://localhost:8080/api/products?page=" + (currentPage - 1)) 
    const products = await response.json();
    updateProducts(products.docs)
    currentPage = products.page;
    nextPage = products.nextPage;
    prevPage = products.prevPage;
}
async function agregarAlCarrito(productId) {
    const cartId = "66972d13ead2566399043270" //Por el momento, esto va a estar hardcodeado
    const response = await fetch("http://localhost:8080/api/carts/" + cartId + "/products/" + productId, {
        method: "POST"
    }) 
}