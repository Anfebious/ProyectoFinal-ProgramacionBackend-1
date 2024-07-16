const socket = io();
socket.on("products", (data) => {
    updateProducts(data);
})
function updateProducts(data) {
    const container = document.getElementById("container");
    container.innerHTML = "";
    data.forEach(product => {
        const item = document.createElement("li");
        item.textContent = JSON.stringify(product);
        container.appendChild(item)
    });
}