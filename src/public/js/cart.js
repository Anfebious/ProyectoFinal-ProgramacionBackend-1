//TODO: Ver de reemplazar el cart ID que queda guardado en un ID en el handlebar

const socket = io();
socket.on("carts", () => {
    updateCart();
})
async function updateCart() {
    const title = document.getElementsByTagName("p")
    const cartId = title[0].id 
    const response = await fetch("http://localhost:8080/api/carts/" + cartId) 
    const cart = await response.json();
    const container = document.getElementById("container");
    container.innerHTML = "";
    cart.products.forEach(product => {
        const item = document.createElement("li");
        item.textContent = JSON.stringify(product);
        container.appendChild(item);
    });
}