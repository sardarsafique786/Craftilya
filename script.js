document.addEventListener('DOMContentLoaded', () => {

  /* ===== Mobile NAV TOGGLE ===== */
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      mainNav.classList.toggle('show');
    });
    mainNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      mainNav.classList.remove('show');
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        mainNav.classList.remove('show');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ===== Scroll reveal ===== */
  const revealEls = document.querySelectorAll('.reveal-up');
  if ('IntersectionObserver' in window && revealEls.length) {
    const obs = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => obs.observe(el));
  } else { revealEls.forEach(el => el.classList.add('is-visible')); }

  /* ===== LIGHTBOX ===== */
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightbox-img');
  const lbClose = document.querySelector('.lightbox-close');
  document.querySelectorAll('.gallery-grid img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      lbImg.src = img.dataset.full || img.src;
      lightbox.classList.add('show');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      lbClose?.focus();
    });
  });
  const closeLightbox = () => {
    lightbox.classList.remove('show');
    lightbox.setAttribute('aria-hidden','true');
    lbImg.src = '';
    document.body.style.overflow = '';
  };
  lbClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key==='Escape') closeLightbox(); });

  /* ===== FAQ Accordion ===== */
  document.querySelectorAll('.accordion-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      const parent = btn.closest('.accordion');
      parent?.querySelectorAll('.accordion-toggle').forEach(t => {
        t.setAttribute('aria-expanded','false');
        const p = document.getElementById(t.getAttribute('aria-controls'));
        p && (p.hidden = true);
      });
      if (!expanded) { btn.setAttribute('aria-expanded','true'); panel && (panel.hidden=false); }
    });
    btn.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' ') { e.preventDefault(); btn.click(); } });
  });

  /* ===== Simple Cart ===== */
  const CART_KEY = 'ac_cart_v2';
  const readCart = () => { try { return JSON.parse(localStorage.getItem(CART_KEY))||[]; } catch { return []; } };
  const writeCart = c => { localStorage.setItem(CART_KEY, JSON.stringify(c)); updateCartCount(); };
  const updateCartCount = () => {
    const count = readCart().reduce((s,i)=>s+i.qty,0);
    const el = document.getElementById('cart-count');
    if(el) el.textContent = String(count);
  };
  updateCartCount();
  const showToast = text => {
    const t = document.createElement('div'); t.className='cart-toast'; t.textContent=text;
    document.body.appendChild(t);
    requestAnimationFrame(()=>t.classList.add('show'));
    setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),250); },1800);
  };
  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', e => {
      const card = e.currentTarget.closest('.product-card');
      if(!card) return;
      const id=card.dataset.id, title=card.dataset.title, price=Number(card.dataset.price||0);
      const cart=readCart();
      const item=cart.find(i=>i.id===id);
      if(item) item.qty+=1; else cart.push({id,title,price,qty:1});
      writeCart(cart); showToast(`Added "${title}" to cart`);
    });
  });

  /* ===== Newsletter & Contact ===== */
  const newsForm = document.getElementById('newsletterForm');
  newsForm?.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail')?.value||'';
    const msg = document.getElementById('newsletterMsg');
    if(msg) msg.textContent=email?`🎉 ${email} subscribed (demo)`:'🎉 Subscribed (demo)';
    newsForm.reset();
  });
  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', e => {
    e.preventDefault();
    const fm = document.getElementById('formMessage');
    if(fm) fm.textContent='✅ Message sent (demo). We will contact you soon!';
    contactForm.reset();
  });

  /* ===== Dark/Light Toggle ===== */
  const darkBtn = document.createElement('button');
  darkBtn.id='darkModeToggle';
  darkBtn.innerText='🌙';
  document.body.appendChild(darkBtn);
  darkBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    darkBtn.innerText = document.body.classList.contains('dark') ? '☀️' : '🌙';
    localStorage.setItem('ac_dark', document.body.classList.contains('dark') ? '1':'0');
  });
  if(localStorage.getItem('ac_dark')==='1') { document.body.classList.add('dark'); darkBtn.innerText='☀️'; }

  /* ===== Product Filter (Readymade / Handmade) ===== */
  const gallery = document.querySelector('.card-grid');
  if(gallery){
    const filterWrapper = document.createElement('div');
    filterWrapper.className='filter-buttons';
    filterWrapper.innerHTML='<button class="filter-btn active" data-type="all">All</button><button class="filter-btn" data-type="readymade">Readymade</button><button class="filter-btn" data-type="handmade">Handmade</button>';
    gallery.parentNode.insertBefore(filterWrapper,gallery);
    const items = gallery.querySelectorAll('.product-card');
    filterWrapper.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click',()=>{
        filterWrapper.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        const type = btn.dataset.type;
        items.forEach(i=>{
          if(type==='all'||i.dataset.type===type) i.style.display='flex'; else i.style.display='none';
        });
      });
    });
  }

  /* ===== Chat Popup ===== */
  const chatFab = document.createElement('div');
  chatFab.className='chat-fab'; chatFab.innerText='💬';
  document.body.appendChild(chatFab);
  const chatPopup = document.createElement('div'); chatPopup.className='chat-popup';
  chatPopup.innerHTML=`<div class="chat-header">Support</div><div class="chat-messages"></div>
  <div style="display:flex;"><input type="text" placeholder="Type..." /><button class="send-btn">➤</button></div>`;
  document.body.appendChild(chatPopup);
  chatPopup.style.display='none';
  const messages = chatPopup.querySelector('.chat-messages');
  const input = chatPopup.querySelector('input');
  const sendBtn = chatPopup.querySelector('.send-btn');
  chatFab.addEventListener('click',()=>{ chatPopup.style.display = chatPopup.style.display==='flex'?'none':'flex'; });
  sendBtn.addEventListener('click', ()=>{
    const msg=input.value.trim(); if(!msg) return;
    const p = document.createElement('p'); p.textContent=msg; messages.appendChild(p);
    input.value=''; messages.scrollTop=messages.scrollHeight;
  });

});
  /* ===== Dark/Light Mode Toggle ===== */
  const modeToggle = document.getElementById('modeToggle');

  // Load saved preference
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    if (modeToggle) modeToggle.textContent = '🌞';
  } else {
    if (modeToggle) modeToggle.textContent = '🌙';
  }

  modeToggle?.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    modeToggle.textContent = isDark ? '🌞' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
