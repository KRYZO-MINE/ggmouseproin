const menuBtn = document.getElementById('menuBtn');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');
const mobileLinks = document.querySelectorAll('.mobile-link');

function openMenu() {
    mobileMenu.classList.add('active');
    menuOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeMenu() {
    mobileMenu.classList.remove('active');
    menuOverlay.classList.add('hidden');
    document.body.style.overflow = '';
}

menuBtn.addEventListener('click', openMenu);
closeMenuBtn.addEventListener('click', closeMenu);
menuOverlay.addEventListener('click', closeMenu);
mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

const navbar = document.getElementById('navbar');
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 100) {
        navbar.classList.add('shadow-md');
    } else {
        navbar.classList.remove('shadow-md');
    }
    lastScroll = currentScroll;
});

const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        backToTop.classList.remove('opacity-0', 'invisible');
        backToTop.classList.add('opacity-100', 'visible');
    } else {
        backToTop.classList.add('opacity-0', 'invisible');
        backToTop.classList.remove('opacity-100', 'visible');
    }
});
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

const accordionBtns = document.querySelectorAll('.accordion-btn');
accordionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const content = btn.nextElementSibling;
        const icon = btn.querySelector('.accordion-icon');
        const isExpanded = btn.getAttribute('aria-expanded') === 'true';

        btn.setAttribute('aria-expanded', !isExpanded);
        content.classList.toggle('active');
        icon.classList.toggle('rotate-180');

        accordionBtns.forEach(otherBtn => {
            if (otherBtn !== btn) {
                otherBtn.setAttribute('aria-expanded', 'false');
                otherBtn.nextElementSibling.classList.remove('active');
                otherBtn.querySelector('.accordion-icon').classList.remove('rotate-180');
            }
        });
    });
});

const faqSearch = document.getElementById('faqSearch');
const faqItems = document.querySelectorAll('.faq-item');
faqSearch.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    faqItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

const scrollElements = document.querySelectorAll('.scroll-animate');
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);
scrollElements.forEach(el => observer.observe(el));

// Floating label handler
const formInputs = document.querySelectorAll('input, select, textarea');
formInputs.forEach(input => {
    // Check if element has value on page load
    if (input.value) {
        input.classList.add('has-content');
    }
    // Update on input change
    input.addEventListener('input', () => {
        if (input.value) {
            input.classList.add('has-content');
        } else {
            input.classList.remove('has-content');
        }
    });
    // Also handle select change
    input.addEventListener('change', () => {
        if (input.value) {
            input.classList.add('has-content');
        } else {
            input.classList.remove('has-content');
        }
    });
});

document.getElementById('supportForm').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
});
