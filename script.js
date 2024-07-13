// script.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('product-form');
    const productList = document.getElementById('products-container');
    const apiUrl = 'http://localhost:3000/products';

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('product-name').value;
        const price = document.getElementById('product-price').value;
        const imageInput = document.getElementById('product-image');
        const imageFile = imageInput.files[0];

        if (imageFile) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const imageUrl = e.target.result;
                if (validateForm(name, price, imageUrl)) {
                    addProduct(name, price, imageUrl);
                    saveProductToApi(name, price, imageUrl);
                    form.reset();
                }
            };
            reader.readAsDataURL(imageFile);
        } else {
            alert('Por favor, seleccione una imagen.');
        }
    });

    function validateForm(name, price, imageUrl) {
        if (name && price && imageUrl) {
            return true;
        } else {
            alert('Por favor, complete todos los campos.');
            return false;
        }
    }

    function addProduct(name, price, imageUrl) {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');

        const productImage = document.createElement('img');
        productImage.src = imageUrl;
        productImage.alt = name;

        const productName = document.createElement('h3');
        productName.textContent = name;

        const productPrice = document.createElement('p');
        productPrice.textContent = `$ ${price}`;

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '🗑️';
        deleteButton.addEventListener('click', () => {
            productList.removeChild(productCard);
            deleteProductFromApi(name, price, imageUrl);
        });

        productCard.appendChild(productImage);
        productCard.appendChild(productName);
        productCard.appendChild(productPrice);
        productCard.appendChild(deleteButton);

        productList.appendChild(productCard);
    }

    async function saveProductToApi(name, price, imageUrl) {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, price, imageUrl })
        });
        return response.json();
    }

    async function deleteProductFromApi(name, price, imageUrl) {
        const response = await fetch(apiUrl);
        const products = await response.json();
        const product = products.find(p => p.name === name && p.price === price && p.imageUrl === imageUrl);
        if (product) {
            await fetch(`${apiUrl}/${product.id}`, {
                method: 'DELETE'
            });
        }
    }

    async function loadProductsFromApi() {
        const response = await fetch(apiUrl);
        const products = await response.json();
        products.forEach(product => addProduct(product.name, product.price, product.imageUrl));
    }

    loadProductsFromApi();
});
 