const menuBtn = document.getElementById('menuBtn');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');
const mobileLinks = document.querySelectorAll('.mobile-link');

function openMenu() { mobileMenu.classList.add('active'); menuOverlay.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
function closeMenu() { mobileMenu.classList.remove('active'); menuOverlay.classList.add('hidden'); document.body.style.overflow = ''; }

menuBtn.addEventListener('click', openMenu);
closeMenuBtn.addEventListener('click', closeMenu);
menuOverlay.addEventListener('click', closeMenu);
mobileLinks.forEach(link => { link.addEventListener('click', closeMenu); });

const navbar = document.getElementById('navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) { navbar.classList.add('shadow-md'); }
    else { navbar.classList.remove('shadow-md'); }
    lastScroll = currentScroll;
});

const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) { backToTop.classList.remove('opacity-0', 'invisible'); backToTop.classList.add('opacity-100', 'visible'); } else { backToTop.classList.add('opacity-0', 'invisible'); backToTop.classList.remove('opacity-100', 'visible'); }
});
backToTop.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });

const scrollElements = document.querySelectorAll('.scroll-animate');
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => { entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); }) }, observerOptions);
scrollElements.forEach(el => observer.observe(el));

const formInputs = document.querySelectorAll('input, select, textarea');
formInputs.forEach(input => {
    if (input.value) input.classList.add('has-content');
    input.addEventListener('input', () => { if (input.value) input.classList.add('has-content'); else input.classList.remove('has-content'); });
    input.addEventListener('change', () => { if (input.value) input.classList.add('has-content'); else input.classList.remove('has-content'); });
});

document.getElementById('supportForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
});

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    document.getElementById('reading-progress').style.width = scrolled + '%';
});
