const menuBtn = document.getElementById('profileMenuBtn');
const menu = document.getElementById('profileMenu');

function closeMenu() {
  if (!menu) return;
  menu.hidden = true;
  menuBtn?.setAttribute('aria-expanded', 'false');
}

function toggleMenu() {
  if (!menu) return;
  const next = menu.hidden ? false : true;
  menu.hidden = next;
  menuBtn?.setAttribute('aria-expanded', next ? 'false' : 'true');
}

menuBtn?.addEventListener('click', (event) => {
  event.stopPropagation();
  toggleMenu();
});

document.addEventListener('click', (event) => {
  if (!menu || menu.hidden) return;
  if (event.target.closest('.profile-actions')) return;
  closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});
