
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
        // item.textContent = JSON.stringify(product);
        list.appendChild(item)
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