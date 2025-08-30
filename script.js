// Global variables
let currentUser = null;
let cart = [];
let filteredProducts = [];

// Wait for DOM to be fully loaded
window.onload = function() {
    console.log('Page loaded');
    
    // Initialize filtered products
    if (typeof products !== 'undefined') {
        filteredProducts = products;
        console.log('Products loaded:', products);
    } else {
        console.error('Products not found!');
    }
    
    // Check if user is already logged in
    const savedUser = localStorage.getItem('leetmart_user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        showMainApp();
    } else {
        showLoginScreen();
    }
    
    // Setup login functionality
    setupLogin();
    setupMainApp();
};

function setupLogin() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.querySelector('.login-btn');
    const passwordInput = document.getElementById('password');
    
    // Method 1: Form submit event
    if (loginForm) {
        loginForm.onsubmit = function(e) {
            e.preventDefault();
            console.log('Form submitted');
            attemptLogin();
            return false;
        };
    }
    
    // Method 2: Button click event
    if (loginBtn) {
        loginBtn.onclick = function(e) {
            e.preventDefault();
            console.log('Button clicked');
            attemptLogin();
            return false;
        };
    }
    
    // Method 3: Enter key on password field
    if (passwordInput) {
        passwordInput.onkeydown = function(e) {
            if (e.key === 'Enter' || e.keyCode === 13) {
                e.preventDefault();
                console.log('Enter pressed');
                attemptLogin();
                return false;
            }
        };
    }
}

function attemptLogin() {
    console.log('Attempting login...');
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorDiv = document.getElementById('loginError');
    
    console.log('Username:', username);
    console.log('Available users:', users);
    
    // Clear previous error
    errorDiv.textContent = '';
    
    if (!username || !password) {
        errorDiv.textContent = 'Please enter both username and password';
        return;
    }
    
    // Find user
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        console.log('Login successful!');
        currentUser = user;
        localStorage.setItem('leetmart_user', JSON.stringify(user));
        showMainApp();
    } else {
        console.log('Login failed');
        errorDiv.textContent = 'Invalid username or password';
    }
}

function showLoginScreen() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
    
    // Clear form
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('loginError').textContent = '';
}

function showMainApp() {
    console.log('Showing main app');
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('mainApp').style.display = 'block';
    
    // Update user info
    updateUserInfo();
    
    // Load categories and products
    loadCategories();
    loadProducts();
    
    // Update cart display
    updateCartDisplay();
}

function setupMainApp() {
    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.onclick = function() {
            currentUser = null;
            cart = [];
            localStorage.removeItem('leetmart_user');
            showLoginScreen();
        };
    }
    
    // Cart functionality
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.onclick = toggleCart;
    }
    
    // FIXED: Close cart button
    const closeCartBtn = document.getElementById('closeCart');
    if (closeCartBtn) {
        closeCartBtn.onclick = closeCartFunction;
    }
    
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
        cartOverlay.onclick = closeCartFunction;
    }
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.oninput = handleSearch;
    }
    
    // Checkout functionality
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.onclick = handleCheckout;
    }
    
    // Modal functionality
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.onclick = function() {
            document.getElementById('productModal').style.display = 'none';
        };
    }
    
    const productModal = document.getElementById('productModal');
    if (productModal) {
        productModal.onclick = function(e) {
            if (e.target === productModal) {
                document.getElementById('productModal').style.display = 'none';
            }
        };
    }
}

function updateUserInfo() {
    const usernameDisplay = document.getElementById('username-display');
    const profilePic = document.getElementById('userProfilePic');
    
    if (usernameDisplay) {
        usernameDisplay.textContent = currentUser.username;
    }
    
    if (profilePic) {
        if (currentUser.profilePic) {
            profilePic.src = currentUser.profilePic;
        } else {
            profilePic.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTYiIGZpbGw9IiM2NjdlZWEiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik04IDhDOS42NTY4NSA4IDExIDYuNjU2ODUgMTEgNUMxMSAzLjM0MzE1IDkuNjU2ODUgMiA4IDJDNi4zNDMxNSAyIDUgMy4zNDMxNSA1IDVDNSA2LjY1Njg1IDYuMzQzMTUgOCA4IDhaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNOCAxMEM2LjM0MzE1IDEwIDUgMTEuMzQzMiA1IDEzVjE0SDE0VjEzQzE0IDExLjM0MzIgMTIuNjU2OSAxMCAxMSAxMEg4WiIgZmlsbD0id2hpdGUiLz4KPHN2Zz4KPHN2Zz4K';
        }
    }
}

function loadCategories() {
    const categoryContainer = document.getElementById('categoryButtons');
    if (!categoryContainer || !products) {
        console.log('Category container or products not found');
        return;
    }
    
    const categories = [...new Set(products.map(p => p.category))];
    console.log('Categories found:', categories);
    
    categoryContainer.innerHTML = '';
    
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-btn';
        button.textContent = category;
        button.setAttribute('data-category', category);
        button.onclick = function() {
            filterByCategory(category);
        };
        categoryContainer.appendChild(button);
    });
}

function filterByCategory(category) {
    console.log('Filtering by category:', category);
    
    // Update active button
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (category === 'all') {
        const allBtn = document.querySelector('.category-btn[data-category="all"]');
        if (allBtn) allBtn.classList.add('active');
        filteredProducts = products;
    } else {
        const targetBtn = document.querySelector('[data-category="' + category + '"]');
        if (targetBtn) {
            targetBtn.classList.add('active');
        }
        filteredProducts = products.filter(p => p.category === category);
    }
    
    console.log('Filtered products:', filteredProducts);
    loadProducts();
}

function loadProducts() {
    console.log('Loading products...');
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) {
        console.log('Products grid not found');
        return;
    }
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<div class="no-results">No products found</div>';
        return;
    }
    
    const productCards = filteredProducts.map(product => createProductCard(product)).join('');
    productsGrid.innerHTML = productCards;
    console.log('Products loaded successfully');
}

function createProductCard(product) {
    const hasDiscount = product.discountedPrice > 0;
    const finalPrice = hasDiscount ? product.discountedPrice : product.price;
    const discountPercent = hasDiscount ? Math.round(((product.price - product.discountedPrice) / product.price) * 100) : 0;
    const productIndex = products.indexOf(product);
    
    return `
        <div class="product-card" onclick="openProductModal(${productIndex})">
            <img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjgwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDI4MCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyODAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjFmM2Y0Ii8+Cjx0ZXh0IHg9IjE0MCIgeT0iMTA1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K'">
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-pricing">
                    <span class="current-price">₹${finalPrice}</span>
                    ${hasDiscount ? `
                        <span class="original-price">₹${product.price}</span>
                        <span class="discount-badge">${discountPercent}% OFF</span>
                    ` : ''}
                </div>
                <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCart(${productIndex})">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

function openProductModal(productIndex) {
    const product = products[productIndex];
    const modal = document.getElementById('productModal');
    const modalContent = document.getElementById('modalContent');
    
    const hasDiscount = product.discountedPrice > 0;
    const finalPrice = hasDiscount ? product.discountedPrice : product.price;
    const discountPercent = hasDiscount ? Math.round(((product.price - product.discountedPrice) / product.price) * 100) : 0;
    
    modalContent.innerHTML = `
        <div style="padding: 2rem;">
            <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 250px; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgdmlld0JveD0iMCAwIDQwMCAyNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjUwIiBmaWxsPSIjZjFmM2Y0Ii8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOTk5IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4K'">
            <div style="color: #666; font-size: 12px; text-transform: uppercase; margin-bottom: 0.5rem;">${product.category}</div>
            <h2 style="margin-bottom: 1rem; font-weight: 600;">${product.name}</h2>
            <p style="color: #666; margin-bottom: 1rem; line-height: 1.5;">${product.description}</p>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1.5rem;">
                <span style="font-size: 24px; font-weight: 600;">₹${finalPrice}</span>
                ${hasDiscount ? `
                    <span style="color: #999; text-decoration: line-through;">₹${product.price}</span>
                    <span style="background: #48bb78; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">${discountPercent}% OFF</span>
                ` : ''}
            </div>
            ${product.options ? `
                <div style="margin-bottom: 1.5rem;">
                    ${product.options.size ? `
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Size:</label>
                            <select id="productSize" style="padding: 8px; border: 1px solid #e1e5e9; border-radius: 4px; width: 100%;">
                                ${product.options.size.map(size => `<option value="${size}">${size}</option>`).join('')}
                            </select>
                        </div>
                    ` : ''}
                    ${product.options.type ? `
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Type:</label>
                            <select id="productType" style="padding: 8px; border: 1px solid #e1e5e9; border-radius: 4px; width: 100%;">
                                ${product.options.type.map(type => `<option value="${type}">${type}</option>`).join('')}
                            </select>
                        </div>
                    ` : ''}
                    ${product.options.flavor ? `
                        <div style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">Flavor:</label>
                            <select id="productFlavor" style="padding: 8px; border: 1px solid #e1e5e9; border-radius: 4px; width: 100%;">
                                ${product.options.flavor.map(flavor => `<option value="${flavor}">${flavor}</option>`).join('')}
                            </select>
                        </div>
                    ` : ''}
                </div>
            ` : ''}
            <button onclick="addToCartFromModal(${productIndex}); document.getElementById('productModal').style.display='none';" style="width: 100%; padding: 12px; background: #667eea; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-family: 'Okra', sans-serif;">
                Add to Cart
            </button>
        </div>
    `;
    
    modal.style.display = 'flex';
}

function addToCartFromModal(productIndex) {
    const product = products[productIndex];
    let selectedOptions = {};
    
    if (product.options) {
        if (product.options.size && document.getElementById('productSize')) {
            selectedOptions.size = document.getElementById('productSize').value;
        }
        if (product.options.type && document.getElementById('productType')) {
            selectedOptions.type = document.getElementById('productType').value;
        }
        if (product.options.flavor && document.getElementById('productFlavor')) {
            selectedOptions.flavor = document.getElementById('productFlavor').value;
        }
    }
    
    addToCart(productIndex, selectedOptions);
    document.getElementById('productModal').style.display = 'none';
}

function addToCart(productIndex, options = {}) {
    const product = products[productIndex];
    const finalPrice = product.discountedPrice > 0 ? product.discountedPrice : product.price;
    
    // Create unique item key based on product and options
    const itemKey = JSON.stringify({ productIndex, options });
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => JSON.stringify({ productIndex: item.productIndex, options: item.options }) === itemKey);
    
    if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            productIndex,
            product,
            options,
            quantity: 1,
            price: finalPrice
        });
    }
    
    updateCartDisplay();
    
    // Visual feedback
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartIcon.style.transform = 'scale(1)';
        }, 200);
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const totalItems = document.getElementById('totalItems');
    const grandTotal = document.getElementById('grandTotal');
    
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (cartCount) cartCount.textContent = totalQuantity;
    if (totalItems) totalItems.textContent = totalQuantity;
    if (grandTotal) grandTotal.textContent = totalPrice;
    
    if (cartItems) {
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">🛒</div>
                    <p>Your cart is empty</p>
                </div>
            `;
        } else {
            cartItems.innerHTML = cart.map((item, index) => createCartItem(item, index)).join('');
        }
    }
}

function createCartItem(item, index) {
    const optionsText = Object.entries(item.options).map(([key, value]) => `${key}: ${value}`).join(', ');
    
    return `
        <div class="cart-item">
            <img src="${item.product.image}" alt="${item.product.name}" class="cart-item-image" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjZjFmM2Y0Ii8+Cjx0ZXh0IHg9IjMwIiB5PSIzNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzk5OSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIj5ObyBJbWFnZTwvdGV4dD4KPHN2Zz4K'">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.product.name}</div>
                ${optionsText ? `<div style="font-size: 12px; color: #999;">${optionsText}</div>` : ''}
                <div class="cart-item-price">₹${item.price} each</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
            </div>
        </div>
    `;
}

function changeQuantity(itemIndex, change) {
    cart[itemIndex].quantity += change;
    
    if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
    }
    
    updateCartDisplay();
}

function toggleCart() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar) cartSidebar.classList.toggle('open');
    if (cartOverlay) cartOverlay.classList.toggle('open');
}

// FIXED: Renamed function to avoid conflicts
function closeCartFunction() {
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartSidebar) cartSidebar.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('open');
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    console.log('Searching for:', searchTerm);
    
    if (searchTerm === '') {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    console.log('Search results:', filteredProducts);
    
    // Reset category filter to "All"
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const allBtn = document.querySelector('.category-btn[data-category="all"]');
    if (allBtn) allBtn.classList.add('active');
    
    loadProducts();
}

function handleCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Generate order ID
    const now = new Date();
    const orderId = `LM-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
    
    // Prepare WhatsApp message
    let message = `🧾 LeeMart Order Invoice\n`;
    message += `Order ID: ${orderId}\n\n`;
    message += `Customer: ${currentUser.username}\n\n`;
    message += `Items:\n`;
    
    cart.forEach((item, index) => {
        const optionsText = Object.entries(item.options).length > 0 
            ? ` (${Object.entries(item.options).map(([key, value]) => value).join(', ')})` 
            : '';
        message += `${index + 1}. ${item.product.name}${optionsText} - ₹${item.price} x ${item.quantity} = ₹${item.price * item.quantity}\n`;
    });
    
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    message += `\n----------------------------------\n`;
    message += `Total Items: ${totalQuantity}\n`;
    message += `Grand Total: ₹${totalPrice}\n\n`;
    message += `> Don't edit this text! Editing might face cancellation in order.`;
    
    // Open WhatsApp
    const phoneNumber = '+918879706046';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    // Clear cart after checkout
    cart = [];
    updateCartDisplay();
    closeCartFunction();
}
