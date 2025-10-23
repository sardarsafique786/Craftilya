/* app.js
   Full frontend behavior for Craftilya shop page
   - Works with index.html and style.css supplied earlier
   - Uses localStorage for cart, wishlist, compare
*/

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Config & Demo Data (20 products) ---------- */
  const DEMO_PRODUCTS = [
    {id: "p01", title: "Handmade Vase", price: 450, category: "handmade", rating: 4.5, discount: "10%", description: "Beautiful handmade ceramic vase.", images: ["https://picsum.photos/seed/v1/800/600","https://picsum.photos/seed/v1b/800/600","https://picsum.photos/seed/v1c/800/600"], stock: 12},
    {id: "p02", title: "Decor Lamp", price: 1200, category: "readymade", rating: 4.2, discount: "15%", description: "Stylish decor lamp for living rooms.", images: ["https://picsum.photos/seed/l1/800/600","https://picsum.photos/seed/l2/800/600"], stock: 4},
    {id: "p03", title: "Wall Art", price: 800, category: "handmade", rating: 4.8, discount: "20%", description: "Hand-painted wall art with vibrant colors.", images: ["https://picsum.photos/seed/a1/800/600","https://picsum.photos/seed/a2/800/600"], stock: 5},
    {id: "p04", title: "Photo Frame", price: 300, category: "readymade", rating: 3.9, discount: "5%", description: "Classic photo frame in wooden finish.", images: ["https://picsum.photos/seed/f1/800/600"], stock: 20},
    {id: "p05", title: "Jewelry Box", price: 1500, category: "handmade", rating: 4.7, discount: "12%", description: "Elegant jewelry box with lock.", images: ["https://picsum.photos/seed/j1/800/600","https://picsum.photos/seed/j2/800/600"], stock: 3},
    {id: "p06", title: "Candle Holder", price: 600, category: "handmade", rating: 4.3, discount: "8%", description: "Intricate candle holder for decor.", images: ["https://picsum.photos/seed/c1/800/600"], stock: 8},
    {id: "p07", title: "Wooden Tray", price: 700, category: "handmade", rating: 4.4, discount: "18%", description: "Solid wooden serving tray.", images: ["https://picsum.photos/seed/t1/800/600","https://picsum.photos/seed/t2/800/600"], stock: 7},
    {id: "p08", title: "Handwoven Basket", price: 950, category: "handmade", rating: 4.6, discount: "22%", description: "Eco-friendly handwoven basket.", images: ["https://picsum.photos/seed/b1/800/600","https://picsum.photos/seed/b2/800/600"], stock: 6},
    {id: "p09", title: "Designer Clock", price: 1100, category: "readymade", rating: 4.0, discount: "10%", description: "Modern designer wall clock.", images: ["https://picsum.photos/seed/clk1/800/600"], stock: 9},
    {id: "p10", title: "Wall Hanging", price: 550, category: "handmade", rating: 4.5, discount: "15%", description: "Colorful cotton wall hanging.", images: ["https://picsum.photos/seed/w1/800/600","https://picsum.photos/seed/w2/800/600"], stock: 10},
    {id: "p11", title: "Clay Pot", price: 250, category: "handmade", rating: 4.1, discount: "7%", description: "Earthen clay pot for plants.", images: ["https://picsum.photos/seed/cl1/800/600"], stock: 25},
    {id: "p12", title: "Mirror Frame", price: 1250, category: "readymade", rating: 4.6, discount: "18%", description: "Elegant mirror frame with carved design.", images: ["https://picsum.photos/seed/m1/800/600","https://picsum.photos/seed/m2/800/600"], stock: 2},
    {id: "p13", title: "Handmade Diary", price: 350, category: "handmade", rating: 4.3, discount: "9%", description: "Diary with handmade paper and cover.", images: ["https://picsum.photos/seed/d1/800/600"], stock: 18},
    {id: "p14", title: "Cushion Cover Set", price: 800, category: "readymade", rating: 4.7, discount: "25%", description: "Designer cushion cover set - 2 pcs.", images: ["https://picsum.photos/seed/cc1/800/600","https://picsum.photos/seed/cc2/800/600"], stock: 12},
    {id: "p15", title: "Pendant Light", price: 2000, category: "readymade", rating: 4.8, discount: "30%", description: "Modern pendant light for ambiance.", images: ["https://picsum.photos/seed/pl1/800/600","https://picsum.photos/seed/pl2/800/600"], stock: 1},
    {id: "p16", title: "Hand-painted Mug", price: 400, category: "handmade", rating: 4.2, discount: "6%", description: "Artisan painted coffee mug.", images: ["https://picsum.photos/seed/mg1/800/600"], stock: 30},
    {id: "p17", title: "Kitchen Organizer", price: 950, category: "readymade", rating: 4.5, discount: "14%", description: "Smart kitchen organizer rack.", images: ["https://picsum.photos/seed/ko1/800/600","https://picsum.photos/seed/ko2/800/600"], stock: 11},
    {id: "p18", title: "Handcrafted Bowl", price: 650, category: "handmade", rating: 4.6, discount: "12%", description: "Beautiful handcrafted serving bowl.", images: ["https://picsum.photos/seed/hb1/800/600"], stock: 9},
    {id: "p19", title: "Wall Shelf", price: 1400, category: "readymade", rating: 4.4, discount: "20%", description: "Floating wooden wall shelf.", images: ["https://picsum.photos/seed/ws1/800/600","https://picsum.photos/seed/ws2/800/600"], stock: 5},
    {id: "p20", title: "Handmade Rug", price: 1800, category: "handmade", rating: 4.9, discount: "28%", description: "Handwoven rug for your home.", images: ["https://picsum.photos/seed/hr1/800/600","https://picsum.photos/seed/hr2/800/600","https://picsum.photos/seed/hr3/800/600"], stock: 2},
  ];

  /* ---------- State & DOM refs ---------- */
  const state = {
    products: [...DEMO_PRODUCTS],
    page: 1,
    perPage: 12,
    view: 'grid',
    sortBy: 'relevance',
    filters: { category: 'all', price: 'all', rating: 'all', text: '' },
    cart: JSON.parse(localStorage.getItem('cl_cart') || '[]'),
    wishlist: JSON.parse(localStorage.getItem('cl_wishlist') || '[]'),
    compare: JSON.parse(localStorage.getItem('cl_compare') || '[]'),
    modal: { open: false, product: null, index: 0, autoplay: false, autoplayTimer: null },
    fullscreen: { open: false },
  };

  // DOM elements
  const dom = {
    productGrid: document.getElementById('productGrid'),
    resultsCount: document.getElementById('resultsCount'),
    skeletonContainer: document.getElementById('skeletonContainer'),
    loadMoreBtn: document.getElementById('loadMore'),
    infiniteLoader: document.getElementById('infiniteLoader'),

    // filters / controls
    categoryRadios: document.querySelectorAll('input[name="category"]'),
    priceRange: document.getElementById('priceRange'),
    ratingFilter: document.getElementById('ratingFilter'),
    sortSelect: document.getElementById('topSort') || document.getElementById('sortBy'),
    viewModeSelect: document.getElementById('viewMode'),
    filterSearch: document.getElementById('filterSearch'),
    globalSearch: document.getElementById('globalSearch') || document.getElementById('globalSearch'),

    // modal
    modalWrap: document.getElementById('productModal'),
    modalClose: document.getElementById('modalClose'),
    modalMainImage: document.getElementById('modalMainImage'),
    modalThumbs: document.getElementById('modalThumbs'),
    modalPrev: document.getElementById('modalPrev'),
    modalNext: document.getElementById('modalNext'),
    modalTitle: document.getElementById('modalTitle'),
    modalPrice: document.getElementById('modalPrice'),
    modalDiscount: document.getElementById('modalDiscount'),
    modalRating: document.getElementById('modalRating'),
    modalShortDesc: document.getElementById('modalShortDesc'),
    modalQty: document.getElementById('modalQty'),
    modalAddCart: document.getElementById('modalAddCart'),
    modalWishlist: document.getElementById('modalWishlist'),
    modalFullscreenBtn: document.getElementById('modalFullscreenBtn'),

    // fullscreen
    fsViewer: document.getElementById('fullscreenViewer'),
    fsImage: document.getElementById('fsImage'),
    fsClose: document.getElementById('fsClose'),
    fsPrev: document.getElementById('fsPrev'),
    fsNext: document.getElementById('fsNext'),
    fsThumbs: document.getElementById('fsThumbs'),

    // mini-cart & counts
    cartBtn: document.getElementById('cartBtn') || document.getElementById('cartBtn'),
    cartCountBadge: document.getElementById('cartCount'),
    miniCart: document.getElementById('miniCart'),
    miniCartClose: document.getElementById('miniCartClose'),
    miniCartItems: document.getElementById('miniCartItems'),
    miniCartTotal: document.getElementById('miniCartTotal'),
    clearCartBtn: document.getElementById('clearCart'),
    goToCheckoutBtn: document.getElementById('goToCheckout'),

    // wishlist & compare counts
    wishlistBtn: document.getElementById('wishlistBtn'),
    wishlistCount: document.getElementById('wishlistCount'),
    compareBtn: document.getElementById('compareBtn'),

    // helpers
    overlay: document.getElementById('pageOverlay'),
    subscribeForm: document.getElementById('subscribeForm'),
    footerYear: document.getElementById('footerYear'),
    resetFiltersBtn: document.getElementById('resetFilters'),
    applyFiltersBtn: document.getElementById('applyFilters'),
    topSort: document.getElementById('topSort'),
    viewMode: document.getElementById('viewMode'),
  };

  // Defensive: some elements may not exist (older markup), allow fallback
  function ensure(el, fallback = null) { return el ? el : fallback; }

  /* ---------- Utilities ---------- */
  function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
  function formatPrice(n) { return '₹' + Number(n).toLocaleString('en-IN'); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  /* ---------- UI Updaters ---------- */
  function updateCounts() {
    dom.cartCountBadge && (dom.cartCountBadge.textContent = state.cart.length);
    dom.wishlistCount && (dom.wishlistCount.textContent = state.wishlist.length);
    // results count
    dom.resultsCount && (dom.resultsCount.textContent = state.products.length);
  }

  /* ---------- Rendering: product cards (paged) ---------- */
  function showSkeletons(show = true) {
    if (!dom.skeletonContainer) return;
    dom.skeletonContainer.hidden = !show;
    if (show) {
      dom.skeletonContainer.innerHTML = '';
      const n = Math.min(8, state.perPage);
      for (let i = 0; i < n; i++) {
        const s = document.createElement('div');
        s.className = 'skeleton';
        dom.skeletonContainer.appendChild(s);
      }
    } else {
      dom.skeletonContainer.innerHTML = '';
    }
  }

  function createProductCard(p) {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.id = p.id;

    // markup (image, title, price, rating, actions)
    card.innerHTML = `
      <img data-src="${p.images[0]}" alt="${escapeHtml(p.title)}" class="lazy" loading="lazy" />
      <div class="product-info">
        <h4>${escapeHtml(p.title)} <span class="badge">${p.discount}</span></h4>
        <div class="price">${formatPrice(p.price)}</div>
        <div class="rating small">⭐ ${p.rating}</div>
        <p class="small muted">${escapeHtml(p.description)}</p>
        <div class="product-actions">
          <button class="btn add-cart" data-id="${p.id}">Add</button>
          <button class="btn ghost wishlist" data-id="${p.id}">${state.wishlist.includes(p.id) ? '♥' : '♡'}</button>
        </div>
      </div>
    `;
    // add view details button outside for accessibility
    const viewBtn = document.createElement('button');
    viewBtn.className = 'btn ghost';
    viewBtn.textContent = 'View Details';
    viewBtn.style.margin = '.5rem';
    viewBtn.addEventListener('click', () => openModal(p.id));
    card.querySelector('.product-info').appendChild(viewBtn);

    // wishlist handler
    const wishBtn = card.querySelector('.wishlist');
    wishBtn.addEventListener('click', () => toggleWishlist(p.id, wishBtn));

    // add to cart handler
    const addBtn = card.querySelector('.add-cart');
    addBtn.addEventListener('click', () => {
      addToCart(p.id, 1);
      flashEmoji('✨', addBtn);
    });

    // lazy observer will load images later
    return card;
  }

  // escape helper
  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));
  }

  // lazy loader using IntersectionObserver
  const lazyObserver = ('IntersectionObserver' in window) ? new IntersectionObserver((entries, obs)=>{
    entries.forEach(entry=>{
      if (entry.isIntersecting) {
        const img = entry.target;
        const src = img.dataset.src;
        if (src) { img.src = src; img.removeAttribute('data-src'); }
        obs.unobserve(img);
      }
    });
  }, {rootMargin: '200px'}) : null;

  function renderProducts(reset = true) {
    // show skeletons briefly
    if (reset) {
      dom.productGrid.innerHTML = '';
      showSkeletons(true);
      setTimeout(()=>showSkeletons(false), 350); // short simulated load
    }
    // apply filters & sort
    let filtered = applyFilterLogic(state.products);
    // sorting
    filtered = applySortLogic(filtered);
    // pagination (simulate load more)
    const start = 0;
    const end = state.page * state.perPage;
    const slice = filtered.slice(start, end);

    // render slice
    dom.productGrid.innerHTML = '';
    if (slice.length === 0) {
      dom.productGrid.innerHTML = `<p class="muted small">No products found.</p>`;
    } else {
      slice.forEach(p=>{
        const card = createProductCard(p);
        dom.productGrid.appendChild(card);
      });
    }

    // lazy images hooking
    dom.productGrid.querySelectorAll('img.lazy').forEach(img=>{
      if (lazyObserver) lazyObserver.observe(img);
      else {
        // fallback
        const src = img.dataset.src;
        if (src) img.src = src;
      }
    });

    dom.resultsCount && (dom.resultsCount.textContent = filtered.length);
    updateCounts();
    updateLoadMoreUI(filtered.length);
  }

  function updateLoadMoreUI(totalMatching) {
    const shown = Math.min(state.page * state.perPage, totalMatching);
    if (shown >= totalMatching) {
      dom.loadMoreBtn && (dom.loadMoreBtn.hidden = true);
    } else {
      dom.loadMoreBtn && (dom.loadMoreBtn.hidden = false);
    }
  }

  /* ---------- Filter & Sort logic ---------- */
  function applyFilterLogic(items) {
    const f = state.filters;
    let list = items.slice();

    if (f.category && f.category !== 'all') {
      list = list.filter(i => i.category === f.category);
    }
    if (f.price && f.price !== 'all') {
      if (f.price === '2000+') list = list.filter(i => i.price >= 2000);
      else {
        const [min, max] = f.price.split('-').map(Number);
        list = list.filter(i => i.price >= min && i.price <= max);
      }
    }
    if (f.rating && f.rating !== 'all') {
      const r = Number(f.rating);
      list = list.filter(i => Math.floor(i.rating) >= r);
    }
    if (f.text && f.text.trim()) {
      const q = f.text.trim().toLowerCase();
      list = list.filter(i => i.title.toLowerCase().includes(q) || (i.description || '').toLowerCase().includes(q));
    }
    return list;
  }

  function applySortLogic(items) {
    const s = state.sortBy || (dom.sortSelect && dom.sortSelect.value) || 'featured';
    let list = items.slice();
    switch (s) {
      case 'price-asc': list.sort((a,b)=>a.price-b.price); break;
      case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
      case 'rating-desc': list.sort((a,b)=>b.rating-a.rating); break;
      case 'newest': list.sort((a,b)=>a.id.localeCompare(b.id)); break;
      default: /* featured */ break;
    }
    return list;
  }

  /* ---------- Filter UI handlers ---------- */
  // category radios
  dom.categoryRadios && dom.categoryRadios.forEach(r => {
    r.addEventListener('change', () => {
      state.filters.category = r.value;
      state.page = 1;
      renderProducts(true);
    });
  });

  // price select
  dom.priceRange && dom.priceRange.addEventListener('change', (e) => {
    state.filters.price = e.target.value;
    state.page = 1;
    renderProducts(true);
  });

  // rating
  dom.ratingFilter && dom.ratingFilter.addEventListener('change', (e) => {
    state.filters.rating = e.target.value;
    state.page = 1;
    renderProducts(true);
  });

  // top sort
  dom.topSort && dom.topSort.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderProducts(true);
  });

  // view mode
  dom.viewMode && dom.viewMode.addEventListener('change', (e) => {
    state.view = e.target.value;
    // could toggle grid/list classes — for simplicity, just re-render
    renderProducts(true);
  });

  // local filter search
  dom.filterSearch && dom.filterSearch.addEventListener('input', debounce((e)=>{
    state.filters.text = e.target.value;
    state.page = 1;
    renderProducts(true);
  }, 220));

  // global search
  dom.globalSearch && dom.globalSearch.addEventListener('input', debounce((e)=>{
    state.filters.text = e.target.value;
    state.page = 1;
    renderProducts(true);
  }, 220));

  dom.resetFilters && dom.resetFilters.addEventListener('click', () => {
    state.filters = { category: 'all', price: 'all', rating: 'all', text: '' };
    // reset UI
    document.querySelectorAll('input[name="category"]').forEach(n => n.checked = n.value === 'all');
    dom.priceRange && (dom.priceRange.value = 'all');
    dom.ratingFilter && (dom.ratingFilter.value = 'all');
    dom.filterSearch && (dom.filterSearch.value = '');
    dom.globalSearch && (dom.globalSearch.value = '');
    state.page = 1;
    renderProducts(true);
  });

  dom.applyFiltersBtn && dom.applyFiltersBtn.addEventListener('click', () => {
    state.page = 1;
    renderProducts(true);
  });

  /* ---------- Pagination / Load more ---------- */
  dom.loadMoreBtn && dom.loadMoreBtn.addEventListener('click', () => {
    state.page += 1;
    renderProducts(false);
  });

  // optional infinite scrolling (when reaching bottom)
  let infiniteLoading = false;
  window.addEventListener('scroll', debounce(() => {
    if (infiniteLoading) return;
    if (!dom.loadMoreBtn || dom.loadMoreBtn.hidden) return;
    const bottom = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
    if (bottom < 320) {
      infiniteLoading = true;
      dom.infiniteLoader && (dom.infiniteLoader.hidden = false);
      setTimeout(() => {
        state.page += 1;
        renderProducts(false);
        dom.infiniteLoader && (dom.infiniteLoader.hidden = true);
        infiniteLoading = false;
      }, 700);
    }
  }, 200), {passive:true});

  /* ---------- Cart / Wishlist / Compare ---------- */
  function persistState() {
    save('cl_cart', state.cart);
    save('cl_wishlist', state.wishlist);
    save('cl_compare', state.compare);
  }

  function addToCart(id, qty = 1) {
    const p = state.products.find(x => x.id === id);
    if (!p) return;
    const item = state.cart.find(i=>i.id===id);
    if (item) item.qty += qty; else state.cart.push({id, title: p.title, price: p.price, qty});
    persistState();
    updateMiniCartUI();
    updateCounts();
    // open mini cart briefly
    openMiniCart();
  }

  function removeFromCart(id) {
    state.cart = state.cart.filter(i=>i.id !== id);
    persistState();
    updateMiniCartUI();
    updateCounts();
  }

  function clearCart() {
    state.cart = [];
    persistState();
    updateMiniCartUI();
    updateCounts();
  }

  function toggleWishlist(id, btn) {
    if (state.wishlist.includes(id)) {
      state.wishlist = state.wishlist.filter(x=>x!==id);
      if (btn) btn.textContent = '♡';
    } else {
      state.wishlist.push(id);
      if (btn) btn.textContent = '♥';
    }
    persistState();
    updateCounts();
  }

  // mini cart UI
  function updateMiniCartUI() {
    if (!dom.miniCartItems) return;
    dom.miniCartItems.innerHTML = '';
    if (state.cart.length === 0) {
      dom.miniCartItems.innerHTML = '<p class="muted small">Your cart is empty.</p>';
      dom.miniCartTotal.textContent = '₹0';
      return;
    }
    let total = 0;
    state.cart.forEach(item => {
      const p = state.products.find(x=>x.id===item.id) || {};
      const row = document.createElement('div');
      row.className = 'mini-item';
      row.innerHTML = `<div style="flex:1"><strong>${escapeHtml(item.title)}</strong><div class="small">Qty: ${item.qty}</div></div>
                       <div style="text-align:right">${formatPrice(item.price*item.qty)}<div><button class="btn ghost small remove-mini" data-id="${item.id}">Remove</button></div></div>`;
      dom.miniCartItems.appendChild(row);
      total += item.price * item.qty;
    });
    dom.miniCartTotal.textContent = formatPrice(total);
    // attach remove handlers
    dom.miniCartItems.querySelectorAll('.remove-mini').forEach(btn=>{
      btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
    });
  }

  // cart drawer open/close
  function openMiniCart() {
    if (!dom.miniCart) return;
    dom.miniCart.classList.add('active');
    dom.overlay && (dom.overlay.classList.add('active'), dom.overlay.hidden = false);
    updateMiniCartUI();
  }
  function closeMiniCart() {
    if (!dom.miniCart) return;
    dom.miniCart.classList.remove('active');
    dom.overlay && (dom.overlay.classList.remove('active'), dom.overlay.hidden = true);
  }

  dom.miniCartClose && dom.miniCartClose.addEventListener('click', closeMiniCart);
  dom.clearCartBtn && dom.clearCartBtn.addEventListener('click', clearCart);
  dom.goToCheckoutBtn && dom.goToCheckoutBtn.addEventListener('click', ()=>{
    alert('Demo checkout — no payment implemented.'); clearCart(); closeMiniCart();
  });

  // cart button
  const cartBtn = document.getElementById('cartBtn') || document.getElementById('cartBtn') || document.querySelector('.cart-btn');
  cartBtn && cartBtn.addEventListener('click', openMiniCart);

  /* ---------- Modal / Gallery / Fullscreen ---------- */

  // open modal
  function openModal(id) {
    const p = state.products.find(x=>x.id === id);
    if (!p) return;
    state.modal.open = true;
    state.modal.product = p;
    state.modal.index = 0;
    renderModal();
    dom.modalWrap && dom.modalWrap.classList.add('active');
    dom.modalWrap && (dom.modalWrap.setAttribute('aria-hidden', 'false'));
    startModalAutoplay();
  }

  function closeModal() {
    stopModalAutoplay();
    state.modal.open = false;
    state.modal.product = null;
    state.modal.index = 0;
    dom.modalWrap && dom.modalWrap.classList.remove('active');
    dom.modalWrap && (dom.modalWrap.setAttribute('aria-hidden', 'true'));
  }

  function renderModal() {
    const p = state.modal.product;
    if (!p) return;
    dom.modalTitle && (dom.modalTitle.textContent = p.title);
    dom.modalPrice && (dom.modalPrice.textContent = formatPrice(p.price));
    dom.modalDiscount && (dom.modalDiscount.textContent = p.discount + ' OFF');
    dom.modalRating && (dom.modalRating.textContent = '⭐ ' + p.rating);
    dom.modalShortDesc && (dom.modalShortDesc.textContent = p.description);
    dom.modalQty && (dom.modalQty.value = 1);

    renderModalImage(p.images[state.modal.index]);
    renderModalThumbs(p.images, state.modal.index);
  }

  function renderModalImage(url) {
    if (dom.modalMainImage) {
      dom.modalMainImage.src = url;
      dom.modalMainImage.style.transformOrigin = 'center center';
    }
  }

  function renderModalThumbs(images, activeIndex=0) {
    if (!dom.modalThumbs) return;
    dom.modalThumbs.innerHTML = '';
    images.forEach((img, idx) => {
      const t = document.createElement('img');
      t.src = img;
      t.className = (idx === activeIndex) ? 'active' : '';
      t.style.width = '60px';
      t.style.height = '60px';
      t.style.objectFit = 'cover';
      t.style.marginRight = '6px';
      t.style.cursor = 'pointer';
      t.addEventListener('click', () => {
        state.modal.index = idx;
        renderModal();
      });
      dom.modalThumbs.appendChild(t);
    });
  }

  // modal prev/next
  dom.modalPrev && dom.modalPrev.addEventListener('click', () => {
    if (!state.modal.product) return;
    const len = state.modal.product.images.length;
    state.modal.index = (state.modal.index - 1 + len) % len;
    renderModal();
  });
  dom.modalNext && dom.modalNext.addEventListener('click', () => {
    if (!state.modal.product) return;
    const len = state.modal.product.images.length;
    state.modal.index = (state.modal.index + 1) % len;
    renderModal();
  });
  dom.modalClose && dom.modalClose.addEventListener('click', closeModal);

  // Add to cart from modal
  dom.modalAddCart && dom.modalAddCart.addEventListener('click', () => {
    if (!state.modal.product) return;
    const qty = Number(dom.modalQty.value || 1);
    addToCart(state.modal.product.id, qty);
    closeModal();
  });

  // wishlist from modal
  dom.modalWishlist && dom.modalWishlist.addEventListener('click', () => {
    if (!state.modal.product) return;
    toggleWishlist(state.modal.product.id);
    // update modal UI
    renderModal();
  });

  // modal zoom on hover + pan
  if (dom.modalMainImage) {
    dom.modalMainImage.addEventListener('mousemove', (e)=> {
      dom.modalMainImage.classList.add('zoomed');
      const rect = dom.modalMainImage.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      dom.modalMainImage.style.transformOrigin = `${x}% ${y}%`;
    });
    dom.modalMainImage.addEventListener('mouseleave', () => {
      dom.modalMainImage.classList.remove('zoomed');
      dom.modalMainImage.style.transformOrigin = 'center center';
    });
  }

  // modal keyboard navigation & ESC
  document.addEventListener('keydown', (e) => {
    if (state.modal.open) {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') dom.modalPrev && dom.modalPrev.click();
      if (e.key === 'ArrowRight') dom.modalNext && dom.modalNext.click();
    }
    if (state.fullscreen && state.fullscreen.open) {
      if (e.key === 'Escape') closeFullscreen();
      if (e.key === 'ArrowLeft') dom.fsPrev && dom.fsPrev.click();
      if (e.key === 'ArrowRight') dom.fsNext && dom.fsNext.click();
    }
  });

  /* ---------- Modal Autoplay Carousel ---------- */
  function startModalAutoplay() {
    stopModalAutoplay();
    // autoplay only if product has multiple images
    const p = state.modal.product;
    if (!p || p.images.length < 2) return;
    state.modal.autoplay = true;
    state.modal.autoplayTimer = setInterval(()=> {
      state.modal.index = (state.modal.index + 1) % p.images.length;
      renderModal();
    }, 3000);
    // pause on hover
    if (dom.modalMainImage) {
      dom.modalMainImage.addEventListener('mouseenter', stopModalAutoplayOnce);
      dom.modalMainImage.addEventListener('mouseleave', startModalAutoplayOnce);
    }
  }
  function stopModalAutoplay() {
    state.modal.autoplay = false;
    if (state.modal.autoplayTimer) {
      clearInterval(state.modal.autoplayTimer);
      state.modal.autoplayTimer = null;
    }
  }
  function stopModalAutoplayOnce(e) { stopModalAutoplay(); dom.modalMainImage.removeEventListener('mouseenter', stopModalAutoplayOnce); }
  function startModalAutoplayOnce(e) { startModalAutoplay(); dom.modalMainImage.removeEventListener('mouseleave', startModalAutoplayOnce); }

  /* ---------- Fullscreen viewer ---------- */
  function openFullscreen() {
    if (!state.modal.product) return;
    state.fullscreen.open = true;
    dom.fsViewer && dom.fsViewer.classList.add('active');
    dom.fsViewer && (dom.fsViewer.setAttribute('aria-hidden', 'false'));
    dom.fsImage && (dom.fsImage.src = state.modal.product.images[state.modal.index]);
    renderFsThumbs();
  }

  function closeFullscreen() {
    state.fullscreen.open = false;
    dom.fsViewer && dom.fsViewer.classList.remove('active');
    dom.fsViewer && (dom.fsViewer.setAttribute('aria-hidden', 'true'));
    dom.fsImage && dom.fsImage.classList.remove('zoomed');
  }

  function renderFsThumbs() {
    if (!dom.fsThumbs || !state.modal.product) return;
    dom.fsThumbs.innerHTML = '';
    state.modal.product.images.forEach((img, i) => {
      const t = document.createElement('img');
      t.src = img;
      if (i === state.modal.index) t.classList.add('active');
      t.addEventListener('click', () => {
        state.modal.index = i;
        dom.fsImage.src = img;
        renderModal(); // keep modal in sync
        renderFsThumbs();
      });
      dom.fsThumbs.appendChild(t);
    });
  }

  dom.modalFullscreenBtn && dom.modalFullscreenBtn.addEventListener('click', openFullscreen);
  dom.fsClose && dom.fsClose.addEventListener('click', closeFullscreen);
  dom.fsPrev && dom.fsPrev.addEventListener('click', () => {
    if (!state.modal.product) return;
    state.modal.index = (state.modal.index - 1 + state.modal.product.images.length) % state.modal.product.images.length;
    dom.fsImage && (dom.fsImage.src = state.modal.product.images[state.modal.index]);
    renderModal();
    renderFsThumbs();
  });
  dom.fsNext && dom.fsNext.addEventListener('click', () => {
    if (!state.modal.product) return;
    state.modal.index = (state.modal.index + 1) % state.modal.product.images.length;
    dom.fsImage && (dom.fsImage.src = state.modal.product.images[state.modal.index]);
    renderModal();
    renderFsThumbs();
  });

  // fullscreen image zoom toggle
  dom.fsImage && dom.fsImage.addEventListener('click', () => {
    dom.fsImage.classList.toggle('zoomed');
  });

  // swipe gestures for modal and fullscreen
  addSwipeSupport(dom.modalMainImage, ()=>dom.modalPrev && dom.modalPrev.click(), ()=>dom.modalNext && dom.modalNext.click());
  addSwipeSupport(dom.fsImage, ()=>dom.fsPrev && dom.fsPrev.click(), ()=>dom.fsNext && dom.fsNext.click());

  /* ---------- Wishlist / Compare UI hooks ---------- */
  dom.wishlistBtn && dom.wishlistBtn.addEventListener('click', () => {
    alert('Wishlist view not implemented in demo — items saved locally.');
  });
  dom.compareBtn && dom.compareBtn.addEventListener('click', () => {
    alert('Compare panel not implemented in demo — feature placeholder.');
  });

  /* ---------- Theme toggle ---------- */
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const root = document.documentElement;
      if (root.hasAttribute('data-theme')) {
        root.removeAttribute('data-theme');
        themeToggle.textContent = '🌙';
      } else {
        root.setAttribute('data-theme', 'dark');
        themeToggle.textContent = '☀️';
      }
    });
  }

  /* ---------- Subscribe form ---------- */
  if (dom.subscribeForm) {
    dom.subscribeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const em = document.getElementById('subscribeEmail');
      if (!em || !em.value.includes('@')) { alert('Enter a valid email'); return; }
      alert('Thanks — you are subscribed!');
      dom.subscribeForm.reset();
    });
  }

  /* ---------- Small helpers ---------- */
  function debounce(fn, wait=180) {
    let t;
    return function(...a) { clearTimeout(t); t = setTimeout(()=>fn.apply(this, a), wait); };
  }

  function flashEmoji(emoji, target) {
    const span = document.createElement('span');
    span.className = 'emoji-float';
    span.textContent = emoji;
    document.body.appendChild(span);
    let rect = { left: window.innerWidth/2, top: window.innerHeight/2, width: 20 };
    try { rect = target.getBoundingClientRect(); } catch(e){}
    span.style.left = `${rect.left + rect.width/2}px`;
    span.style.top = `${Math.max(rect.top - 12, 10)}px`;
    setTimeout(()=>span.remove(), 1400);
  }

  // swipe helper for touch elements (leftCallback for prev, rightCallback for next)
  function addSwipeSupport(el, leftCallback, rightCallback) {
    if (!el) return;
    let startX = 0;
    el.addEventListener('touchstart', (ev) => startX = ev.changedTouches[0].clientX);
    el.addEventListener('touchend', (ev) => {
      const endX = ev.changedTouches[0].clientX;
      const diff = endX - startX;
      if (Math.abs(diff) < 40) return;
      if (diff > 0) leftCallback && leftCallback();
      else rightCallback && rightCallback();
    }, {passive:true});
  }

  /* ---------- Initialization ---------- */
  function init() {
    // set footer year
    dom.footerYear && (dom.footerYear.textContent = new Date().getFullYear());

    // initial render
    renderProducts(true);
    updateMiniCartUI();
    updateCounts();

    // persist initial arrays to localStorage
    persistState();

    // attach overlay to close mini cart on click
    dom.overlay && dom.overlay.addEventListener('click', () => {
      closeMiniCart();
      closeModal();
      closeFullscreen();
    });

    // click outside modal to close
    dom.modalWrap && dom.modalWrap.addEventListener('click', (e) => {
      if (e.target === dom.modalWrap) closeModal();
    });

    // click outside fullscreen to close
    dom.fsViewer && dom.fsViewer.addEventListener('click', (e) => {
      if (e.target === dom.fsViewer) closeFullscreen();
    });

    // mobile menu toggle (if exists)
    const menuToggle = document.getElementById('menuToggle');
    const filtersPanel = document.getElementById('filters');
    if (menuToggle && filtersPanel) {
      menuToggle.addEventListener('click', ()=> filtersPanel.classList.toggle('open'));
    }

    // mini cart open/close
    const cartBtnLocal = document.getElementById('cartBtn') || document.querySelector('.cart-btn');
    cartBtnLocal && cartBtnLocal.addEventListener('click', openMiniCart);
  }

  init();

  /* ---------- Helper: Escape HTML again (local function) ---------- */
  function escapeHtml(str) { return String(str||'').replace(/[&<>"']/g, s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s])); }
});
