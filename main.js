document.getElementById('year').textContent = new Date().getFullYear();

const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', open ? 'true' : 'false');
});

const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    document.getElementById('form-note').style.display = 'block';
    form.reset();
  });
}
