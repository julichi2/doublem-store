const cart = [];
const drawer = document.querySelector('.cart-drawer');
const overlay = document.querySelector('.cart-overlay');
const countNodes = document.querySelectorAll('.cart-count, .drawer-count');
const cartItems = document.querySelector('.cart-items');
const subtotalNode = document.querySelector('.cart-subtotal');

function money(amount) { return `$${amount.toFixed(2).replace(/\.00$/, '')}`; }
function renderCart() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.querySelector('.cart-count').textContent = count;
  document.querySelector('.drawer-count').textContent = `(${count})`;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  subtotalNode.textContent = money(subtotal);
  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">Your bag is looking a little light.<br>Go find something good.</p>';
    return;
  }
  cartItems.innerHTML = cart.map((item, index) => `<div class="cart-item"><div><strong>${item.name}</strong><p>Qty ${item.quantity} · ${money(item.price)} each</p></div><div>${money(item.price * item.quantity)}<br><button data-remove="${index}">Remove</button></div></div>`).join('');
}
function setCartOpen(open) {
  drawer.classList.toggle('open', open);
  drawer.setAttribute('aria-hidden', String(!open));
  overlay.hidden = !open;
  document.body.style.overflow = open ? 'hidden' : '';
  if (open) document.querySelector('.close-cart').focus();
}
document.querySelectorAll('.quick-add').forEach(button => button.addEventListener('click', () => {
  const name = button.dataset.name;
  const item = cart.find(product => product.name === name);
  if (item) item.quantity += 1;
  else cart.push({ name, price: Number(button.dataset.price), quantity: 1 });
  renderCart();
  setCartOpen(true);
}));
document.querySelector('.cart-trigger').addEventListener('click', () => setCartOpen(true));
document.querySelector('.close-cart').addEventListener('click', () => setCartOpen(false));
overlay.addEventListener('click', () => setCartOpen(false));
cartItems.addEventListener('click', event => {
  const button = event.target.closest('[data-remove]');
  if (!button) return;
  cart.splice(Number(button.dataset.remove), 1);
  renderCart();
});
document.addEventListener('keydown', event => { if (event.key === 'Escape') setCartOpen(false); });

document.querySelectorAll('.filter-button').forEach(button => button.addEventListener('click', () => {
  document.querySelector('.filter-button.active')?.classList.remove('active');
  button.classList.add('active');
  const filter = button.dataset.filter;
  document.querySelectorAll('.product-card').forEach(card => { card.hidden = filter !== 'All' && card.dataset.category !== filter; });
}));
document.querySelectorAll('[data-filter-link]').forEach(link => link.addEventListener('click', () => {
  const filter = link.dataset.filterLink;
  document.querySelector(`.filter-button[data-filter="${filter}"]`)?.click();
}));
const menuToggle = document.querySelector('.menu-toggle');
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  document.querySelector('.main-nav').classList.toggle('open', open);
});
document.querySelectorAll('.main-nav a').forEach(link => link.addEventListener('click', () => {
  document.querySelector('.main-nav').classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));
document.querySelector('.newsletter-form').addEventListener('submit', event => {
  event.preventDefault();
  const email = document.querySelector('#email');
  document.querySelector('.form-message').textContent = `You're on the list, ${email.value}. See you in your inbox!`;
  email.value = '';
});
document.querySelector('.checkout-button').addEventListener('click', () => alert('Thanks for shopping DOUBLEM! Checkout is a demo for now.'));
document.querySelector('#year').textContent = new Date().getFullYear();
renderCart();
