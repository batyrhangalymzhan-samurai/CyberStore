const products = [
    { id: 1, title: "Counter-Strike 2 Prime", price: 7500, img: "img/cs2.webp" },
    { id: 2, title: "GTA V Premium", price: 12000, img: "img/gtav.jpg" },
    { id: 3, title: "Cyberpunk 2077", price: 25000, img: "img/cyberpunk.jpg" },
    { id: 4, title: "Minecraft", price: 10000, img: "img/minecraft.jpg" },
    { id: 5, title: "Elden Ring", price: 28000, img: "img/elden.jpg" },
    { id: 6, title: "Red Dead Redemption 2", price: 18000, img: "img/rdr2.jpg" },
    { id: 7, title: "Dota 2 (Battle Pass)", price: 4500, img: "img/dota2.jpg" },
    { id: 8, title: "Valorant Points", price: 5500, img: "img/valorant.jpg" },
    { id: 9, title: "Fortnite V-Bucks", price: 3800, img: "img/fortnite.jpg" },
    { id: 10, title: "Atomic Heart", price: 22000, img: "img/atomic.jpg" },
    { id: 11, title: "The Witcher 3: Wild Hunt", price: 9000, img: "img/witcher3.jpg" },
    { id: 12, title: "Forza Horizon 5", price: 24000, img: "img/forza5.jpg" },
    { id: 13, title: "FIFA 24 (FC 24)", price: 32000, img: "img/fifa26.jpg" },
    { id: 14, title: "Resident Evil 4 Remake", price: 26000, img: "img/re4.jpg" },
    { id: 15, title: "Call of Duty: MW III", price: 35000, img: "img/cod.jpg" },
    { id: 16, title: "Hogwarts Legacy", price: 21000, img: "img/hogwarts.jpg" },
    { id: 17, title: "Mortal Kombat 1", price: 29000, img: "img/mk1.jpg" },
    { id: 18, title: "Marvel's Spider-Man 2", price: 33000, img: "img/spiderman2.jpg" }
];

let cart = JSON.parse(localStorage.getItem('neonCart')) || [];

function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    grid.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.img}" alt="${product.title}" class="product-img">
            <h3 class="product-title">${product.title}</h3>
            <p class="product-price">${product.price.toLocaleString()} ₸</p>
            <button class="btn-add" onclick="addToCart(${product.id})">В корзину</button>
        `;
        grid.appendChild(card);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) { existingItem.qty++; } 
    else { cart.push({ ...product, qty: 1 }); }
    showToast(`✅ ${product.title} добавлена!`);
    updateCartUI(); 
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalQtyElement = document.getElementById('total-qty');
    const totalPriceElement = document.getElementById('total-price');
    const headerQtyElement = document.getElementById('header-qty');

    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';
    let totalQty = 0;
    let totalPrice = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Корзина пуста 🥺</p>';
    } else {
        cart.forEach(item => {
            totalQty += item.qty;
            totalPrice += item.price * item.qty;
            const cartRow = document.createElement('div');
            cartRow.className = 'cart-item';
            cartRow.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.title} (x${item.qty})</h4>
                    <p>${(item.price * item.qty).toLocaleString()} ₸</p>
                </div>
                <button class="btn-remove" onclick="removeFromCart(${item.id})">
                    <i data-lucide="trash-2"></i>
                </button>
            `;
            cartItemsContainer.appendChild(cartRow);
        });
        if (window.lucide) lucide.createIcons();
    }
    totalQtyElement.innerText = totalQty;
    headerQtyElement.innerText = totalQty;
    totalPriceElement.innerText = `${totalPrice.toLocaleString()} ₸`;
    localStorage.setItem('neonCart', JSON.stringify(cart));
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i data-lucide="info"></i> <span>${message}</span>`;
    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

const modal = document.getElementById('checkout-modal');
const checkoutBtn = document.querySelector('.checkout-btn');
const closeBtn = document.querySelector('.close-modal');
const myPhoneNumber = "77055755098"; // Номер без лишних знаков

if (checkoutBtn) {
    checkoutBtn.onclick = function() {
        if (cart.length === 0) {
            showToast("⚠️ Корзина пуста!");
            return;
        }
        let message = "Салам! Я хочу оформить заказ в NeonStore:\n\n";
        cart.forEach((item, index) => {
            message += `${index + 1}. ${item.title} (x${item.qty}) — ${(item.price * item.qty).toLocaleString()} ₸\n`;
        });
        const finalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        message += `\nИТОГО К ОПЛАТЕ: ${finalPrice.toLocaleString()} ₸`;

        const whatsappUrl = `https://wa.me/${myPhoneNumber}?text=${encodeURIComponent(message)}`;
        modal.style.display = "flex";
        setTimeout(() => { window.open(whatsappUrl, '_blank'); }, 2000);
    }
}

if (closeBtn) closeBtn.onclick = () => { modal.style.display = "none"; };
window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };

renderProducts();
updateCartUI();
