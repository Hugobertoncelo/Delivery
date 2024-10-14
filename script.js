const products = [
    { id: 1, name: 'Pizza de Queijo', price: 30, image: 'src/assets/pizza.jpg', category: 'pizza' },
    { id: 2, name: 'Hambúrguer', price: 20, image: 'src/assets/hamburguer.jpg', category: 'lanche' },
    { id: 3, name: 'Refrigerante', price: 5, image: 'src/assets/refrigerante.jpg', category: 'bebida' },
    // Adicione mais produtos aqui...
];

const productsContainer = document.querySelector('.products');
function renderProducts(products) {
    productsContainer.innerHTML = ''; // Limpa a lista de produtos
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.classList.add('product');
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>R$ ${product.price}</p>
            <button data-id="${product.id}">Adicionar ao Carrinho</button>
        `;
        productsContainer.appendChild(productElement);
    });
}
renderProducts(products); // Renderiza a lista inicial de produtos

const categoryFilter = document.getElementById('category');
categoryFilter.addEventListener('change', function() {
    const selectedCategory = this.value;
    const filteredProducts = selectedCategory === 'all'
        ? products
        : products.filter(product => product.category === selectedCategory);
    renderProducts(filteredProducts);
});

const cartItems = []; // Array para armazenar os itens do carrinho
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalContainer = document.querySelector('.cart-total');

function updateCart() {
    cartItemsContainer.innerHTML = ''; // Limpa a lista de itens do carrinho
    cartTotalContainer.innerHTML = ''; // Limpa o total do carrinho

    let totalPrice = 0;

    if (cartItems.length > 0) {
        cartItems.forEach(product => {
            const cartItemElement = document.createElement('div');
            cartItemElement.classList.add('cart-item');
            cartItemElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>R$ ${product.price}</p>
                <div class="quantity">
                    <button data-id="${product.id}" class="decrease">-</button>
                    <span>${product.quantity}</span>
                    <button data-id="${product.id}" class="increase">+</button>
                </div>
                <button data-id="${product.id}" class="remove">Excluir</button>
            `;
            cartItemsContainer.appendChild(cartItemElement);

            totalPrice += product.price * product.quantity;
        });

        const cartTotalElement = document.createElement('div');
        cartTotalElement.innerHTML = `
            <h3>Total: R$ ${totalPrice}</h3>
            <button>Finalizar Compra</button>
        `;
        cartTotalContainer.appendChild(cartTotalElement);
    } else {
        const emptyCartMessage = document.createElement('p');
        emptyCartMessage.textContent = 'Seu carrinho está vazio.';
        cartItemsContainer.appendChild(emptyCartMessage);
    }
}

// Adicionar item ao carrinho
document.querySelectorAll('.products button').forEach(button => {
    button.addEventListener('click', function() {
        const productId = parseInt(this.dataset.id);
        const product = products.find(p => p.id === productId);
        let existingItem = cartItems.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cartItems.push({ ...product, quantity: 1 });
        }

        updateCart();
    });
});

// Aumentar quantidade no carrinho
cartItemsContainer.addEventListener('click', function(event) {
    if (event.target.classList.contains('increase')) {
        const productId = parseInt(event.target.dataset.id);
        const cartItem = cartItems.find(item => item.id === productId);

        if (cartItem) {
            cartItem.quantity++;
            updateCart();
        }
    }
});

// Diminuir quantidade no carrinho
cartItemsContainer.addEventListener('click', function(event) {
    if (event.target.classList.contains('decrease')) {
        const productId = parseInt(event.target.dataset.id);
        const cartItem = cartItems.find(item => item.id === productId);

        if (cartItem && cartItem.quantity > 1) {
            cartItem.quantity--;
            updateCart();
        }
    }
});

// Remover item do carrinho
cartItemsContainer.addEventListener('click', function(event) {
    if (event.target.classList.contains('remove')) {
        const productId = parseInt(event.target.dataset.id);
        cartItems.splice(cartItems.findIndex(item => item.id === productId), 1);
        updateCart();
    }
});

const orderForm = document.getElementById('order-form');
const orderConfirmation = document.getElementById('order-confirmation');

orderForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const payment = document.getElementById('payment').value;

    const orderDetails = `
        <h2>Seu pedido foi confirmado!</h2>
        <p>Nome: ${name}</p>
        <p>Email: ${email}</p>
        <p>Endereço: ${address}</p>
        <p>Método de Pagamento: ${payment}</p>
        <p>Itens: ${cartItems.map(item => `${item.name} x ${item.quantity}`).join(', ')}</p>
        <p>Total: R$ ${totalPrice}</p>
    `;

    orderConfirmation.innerHTML = orderDetails;
});