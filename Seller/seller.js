// 🌸 ELEMENTS
const productForm = document.getElementById('productForm');
const productImages = document.getElementById('productImages');
const imageDrop = document.getElementById('imageDrop');
const imagePreview = document.getElementById('imagePreview');
const livePreview = document.getElementById('livePreview');
const recentProducts = document.getElementById('recentProducts');
const categoryFilter = document.getElementById('categoryFilter');
const clearFormBtn = document.getElementById('clearFormBtn');
const toast = document.getElementById('toast');

// 🌸 LOAD SAVED PRODUCTS
let products = JSON.parse(localStorage.getItem('craftilyaProducts')) || [];

// 🌸 DRAG & DROP IMAGE HANDLING
['dragenter', 'dragover'].forEach(eventName => {
  imageDrop.addEventListener(eventName, e => {
    e.preventDefault();
    e.stopPropagation();
    imageDrop.classList.add('dragover');
  });
});
['dragleave', 'drop'].forEach(eventName => {
  imageDrop.addEventListener(eventName, e => {
    e.preventDefault();
    e.stopPropagation();
    imageDrop.classList.remove('dragover');
  });
});
imageDrop.addEventListener('drop', e => {
  productImages.files = e.dataTransfer.files;
  updateImagePreview();
  updateLivePreview();
});
productImages.addEventListener('change', () => {
  updateImagePreview();
  updateLivePreview();
});

// 🌸 IMAGE PREVIEW
function updateImagePreview() {
  imagePreview.innerHTML = '';
  const files = Array.from(productImages.files);
  files.forEach(file => {
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    imagePreview.appendChild(img);
  });
}

// 🌸 LIVE PREVIEW
function updateLivePreview() {
  const name = document.getElementById('productName').value;
  const desc = document.getElementById('productDesc').value;
  const price = document.getElementById('productPrice').value;
  const category = document.getElementById('productCategory').value;
  const files = Array.from(productImages.files);

  if (!name && files.length === 0) {
    livePreview.innerHTML = '<p>No product selected yet.</p>';
    return;
  }

  livePreview.innerHTML = '';

  if (files.length > 0) {
    files.forEach(file => {
      const img = document.createElement('img');
      img.src = URL.createObjectURL(file);
      livePreview.appendChild(img);
    });
  }

  const info = document.createElement('div');
  info.innerHTML = `
    <h4>${name || 'Untitled Product'}</h4>
    <p>${desc || 'No description added yet.'}</p>
    <p class="price">${price ? `₹${price}` : 'Price not set'}</p>
    <p>Category: ${category || 'Not selected'}</p>
  `;
  livePreview.appendChild(info);
}

// 🌸 FORM SUBMIT
productForm.addEventListener('submit', e => {
  e.preventDefault();

  const name = document.getElementById('productName').value.trim();
  const seller = document.getElementById('sellerName').value.trim();
  const desc = document.getElementById('productDesc').value.trim();
  const price = document.getElementById('productPrice').value.trim();
  const stock = document.getElementById('productStock').value.trim();
  const category = document.getElementById('productCategory').value;
  const files = Array.from(productImages.files);

  if (!name || !seller || !price || !stock || !category || files.length === 0) {
    showToast('⚠️ Please fill all required fields.');
    return;
  }

  // Convert images to Base64 for persistent storage
  const readerPromises = files.map(file => {
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target.result);
      reader.readAsDataURL(file);
    });
  });

  Promise.all(readerPromises).then(images => {
    const product = { name, seller, desc, price, stock, category, images, added: new Date().toISOString() };
    products.push(product);
    localStorage.setItem('craftilyaProducts', JSON.stringify(products));

    updateRecentProducts();
    showToast('✅ Product added successfully!');
    productForm.reset();
    imagePreview.innerHTML = '';
    livePreview.innerHTML = '<p>No product selected yet.</p>';
  });
});

// 🌸 CLEAR FORM
clearFormBtn.addEventListener('click', () => {
  productForm.reset();
  imagePreview.innerHTML = '';
  livePreview.innerHTML = '<p>No product selected yet.</p>';
  showToast('🧹 Form cleared');
});

// 🌸 SHOW TOAST
function showToast(msg) {
  toast.textContent = msg;
  toast.style.opacity = 1;
  toast.style.transform = 'translateX(-50%) translateY(0)';
  setTimeout(() => {
    toast.style.opacity = 0;
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 2600);
}

// 🌸 DISPLAY RECENT PRODUCTS
function updateRecentProducts() {
  recentProducts.innerHTML = '';
  const filter = categoryFilter.value;
  const filteredProducts = filter === 'all'
    ? products
    : products.filter(p => p.category === filter);

  if (filteredProducts.length === 0) {
    recentProducts.innerHTML = '<p style="color:#888;">No products found in this category.</p>';
    return;
  }

  filteredProducts.slice().reverse().forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.innerHTML = `
      <img src="${product.images[0]}" alt="${product.name}">
      <h4>${product.name}</h4>
      <p class="price">₹${product.price}</p>
      <p>${product.category}</p>
      <small>By ${product.seller}</small>
    `;
    recentProducts.appendChild(card);
  });
}

// 🌸 CATEGORY FILTER
categoryFilter.addEventListener('change', updateRecentProducts);

// 🌸 INPUT LIVE PREVIEW UPDATES
['productName', 'productDesc', 'productPrice', 'productCategory'].forEach(id => {
  document.getElementById(id).addEventListener('input', updateLivePreview);
});

// 🌸 INITIAL LOAD
updateRecentProducts();
