//TODO: Ver de reemplazar el cart ID que queda guardado en un ID en el handlebar

const socket = io();
socket.on("carts", (data) => {
    updateCart(data);
})
async function updateCart(data) {
    console.log(data)
    const title = document.getElementsByTagName("p")
    const cartId = title[0].id 
    const container = document.getElementById("container");
    container.innerHTML = "";
    const list = document.createElement("ul")
    container.appendChild(list)
    data.products.forEach(product => {
        const item = document.createElement("li");
        for (const [key, value] of Object.entries(product)) {
            item.innerHTML += "<strong>" + key + ": </strong>" + value + "<br>";
        }
        // item.textContent = JSON.stringify(product);
        list.appendChild(item);
    });
}