// Save this block as app.js

// CONFIG: ganti nomor WA di sini (format internasional tanpa '+', contoh: 6281234567890)
const WHATSAPP_NUMBER = '6288973461209';

// Produk contoh: ubah sesuai kebutuhan
const PRODUCTS = [
  { id: 1, name: 'Jasa Edit & Desain Canva', price: 15000, img: 'e.jpg', desc: '📌 Jasa Edit & Desain Canva ✔ Desain Instagram, Facebook, & TikTok ✔ Poster, Banner, Brosur, Menu ✔ Undangan Digital & Katalog Produk ✔ CV & Portofolio 💡 Keunggulan: Desain rapi & modern Bisa revisi sampai puas,Pengerjaan cepat (mulai dari 1-2 jam), Harga ramah di kantong.' },
  { id: 2, name: 'JASA PEMBUATAN WEBSITE', price: 25000, img: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=placeholder', desc: 'Layanan pembuatan website profesional untuk berbagai kebutuhan — mulai dari toko online, portofolio, hingga website custom sesuai permintaan Anda.' }
];

// App state
let cart = JSON.parse(localStorage.getItem('promoCart') || '[]');

// Helpers
function formatIDR(n){ return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(n); }
function updateCartCount(){ const count = cart.reduce((s,it)=>s+it.qty,0); document.getElementById('cartCount').textContent = count; }
function saveCart(){ localStorage.setItem('promoCart', JSON.stringify(cart)); updateCartCount(); renderCartItems(); }

// Render products
function renderProducts(){
  const grid = document.getElementById('productsGrid'); grid.innerHTML = '';
  PRODUCTS.forEach(p=>{
    const card = document.createElement('div');
    card.className = 'product-card bg-gradient-to-br from-slate-800/50 to-slate-900/30 rounded-2xl p-4 shadow-lg';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.name}" class="w-full h-40 object-cover rounded-xl"/>
      <div class="mt-3">
        <div class="flex items-start justify-between">
          <div>
            <div class="font-semibold">${p.name}</div>
            <div class="text-xs text-slate-300">${p.desc}</div>
          </div>
          <div class="text-amber-400 font-bold">${formatIDR(p.price)}</div>
        </div>
        <div class="mt-3 flex gap-2">
          <button data-id="${p.id}" class="addToCart px-3 py-2 rounded-lg bg-amber-400 text-slate-900 font-semibold">Tambah</button>
          <button data-id="${p.id}" class="buyNow px-3 py-2 rounded-lg border border-white/10">Beli</button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  document.querySelectorAll('.addToCart').forEach(btn => btn.addEventListener('click', e=>{
    const id = Number(e.currentTarget.dataset.id); addToCart(id,1);
    gsap.fromTo(e.currentTarget,{scale:1},{scale:.95,duration:.08,yoyo:true,repeat:1});
  }));
  document.querySelectorAll('.buyNow').forEach(btn => btn.addEventListener('click', e=>{
    const id = Number(e.currentTarget.dataset.id); addToCart(id,1); openCart();
  }));
}

// Cart logic
function addToCart(id,qty=1){ const prod = PRODUCTS.find(p=>p.id===id); if(!prod) return; const found = cart.find(c=>c.id===id); if(found) found.qty+=qty; else cart.push({ id: prod.id, name: prod.name, price: prod.price, img: prod.img, qty }); saveCart(); }
function removeFromCart(id){ cart = cart.filter(c=>c.id!==id); saveCart(); }
function changeQty(id,delta){ const it = cart.find(c=>c.id===id); if(!it) return; it.qty = Math.max(1, it.qty + delta); saveCart(); }

function renderCartItems(){ const el = document.getElementById('cartItems'); el.innerHTML = ''; if(cart.length===0){ el.innerHTML = '<div class="text-slate-400">Keranjang kosong.</div>'; document.getElementById('cartTotal').textContent = formatIDR(0); return; }
  let total = 0; cart.forEach(item=>{
    total += item.price * item.qty;
    const row = document.createElement('div');
    row.className = 'flex items-center gap-3 p-3 bg-slate-800/40 rounded-lg';
    row.innerHTML = `
      <img src="${item.img}" class="w-16 h-16 object-cover rounded-lg" />
      <div class="flex-1 text-sm">
        <div class="font-semibold">${item.name}</div>
        <div class="text-slate-400 text-xs">${formatIDR(item.price)} x ${item.qty}</div>
      </div>
      <div class="flex items-center gap-2">
        <button class="decrease text-slate-300 px-2">-</button>
        <div class="font-semibold">${item.qty}</div>
        <button class="increase text-slate-300 px-2">+</button>
        <button class="remove text-red-400 px-3">Hapus</button>
      </div>
    `;
    el.appendChild(row);
    row.querySelector('.remove').addEventListener('click', ()=> removeFromCart(item.id));
row.querySelector('.decrease').addEventListener('click', ()=> changeQty(item.id, -1));
    row.querySelector('.increase').addEventListener('click', ()=> changeQty(item.id, +1));
  });
  document.getElementById('cartTotal').textContent = formatIDR(total);
}

// Cart modal controls
const cartModal = document.getElementById('cartModal');
function openCart(){ cartModal.classList.remove('hidden'); cartModal.classList.add('flex'); renderCartItems(); gsap.fromTo('#cartModal .glass',{y:60,opacity:0},{y:0,opacity:1,duration:.4}); }
function closeCart(){ cartModal.classList.remove('flex'); cartModal.classList.add('hidden'); }

// Checkout via WA (no API)
document.getElementById('checkoutBtn').addEventListener('click', ()=>{
  if(cart.length===0){ alert('Keranjang kosong. Tambahkan produk dulu.'); return; }
  let msg = 'Halo! Saya ingin memesan:%0A';
  cart.forEach(it=>{ msg += `- ${it.name} (x${it.qty}) — ${formatIDR(it.price)}%0A`; });
  msg += `%0ATotal: ${encodeURIComponent(document.getElementById('cartTotal').textContent)}%0A%0A`;
  msg += 'Mohon informasi pembayaran dan pengiriman.';
  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(decodeURIComponent(msg))}`;
  window.open(waUrl,'_blank');
});

// UI binds
document.getElementById('openCartBtn').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
document.getElementById('clearCart').addEventListener('click', ()=>{ if(confirm('Kosongkan keranjang?')){ cart=[]; saveCart(); }});

// Animations (GSAP): hero + scroll reveal
window.addEventListener('load', ()=>{
  renderProducts(); updateCartCount(); renderCartItems();

  // floating character animation
  gsap.to('#charCard',{ y: -12, duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });

  // scroll reveal for product cards
  gsap.utils.toArray('.product-card').forEach((el,i)=>{
    gsap.fromTo(el,{y:20,opacity:0},{y:0,opacity:1,duration:.6,delay: i*0.08, scrollTrigger: { trigger: el, start: 'top 85%' } });
  });
// preview button animation sequence
document.getElementById('previewAnim').addEventListener('click', () => {
  const card = document.getElementById('charCard');
  gsap.fromTo(card, { scale: 1, rotation: -2 }, { scale: 1.06, rotation: 6, duration: .35, yoyo: true, repeat: 3, ease: 'power1.inOut' });
  gsap.to('#charImg', { rotation: [0, 6, -6, 0], duration: 1.2, ease: 'sine.inOut' });
});

document.getElementById('stopAnim').addEventListener('click', () => { gsap.killTweensOf('#charCard');
gsap.set('#charCard', { clearProps: 'all' }); });
});

// save on exit
window.addEventListener('beforeunload', () => saveCart());

// expose for debugging (optional)
window._PROMO_APP = { PRODUCTS, cart };

document.addEventListener("DOMContentLoaded", function() {
    const text = "Belanja Praktis, Cepat, dan Aman hanya di Yudha Store";
    const element = document.getElementById("typing-text");
    let index = 0;

    function typeEffect() {
        if (index < text.length) {
            element.textContent += text.charAt(index);
            index++;
            setTimeout(typeEffect, 50); // Kecepatan mengetik (ms)
        }
    }

    typeEffect();
});