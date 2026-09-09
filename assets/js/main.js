/* ============================================================
   VoltGrid EV Charging — Main JavaScript
   Features: Theme Toggle, RTL, Navbar, Hamburger, Particles,
             Scroll Reveal, Counter Animation, Carousel, Forms
   ============================================================ */

'use strict';

// ============================================================
// 1. THEME MANAGEMENT
// ============================================================
const ThemeManager = (() => {
  const STORAGE_KEY = 'voltgrid-theme';
  const DARK = 'dark';
  const LIGHT = 'light';

  function getSystemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
  }

  function getSavedTheme() {
    return localStorage.getItem(STORAGE_KEY);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateIcons(theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }

  function updateIcons(theme) {
    document.querySelectorAll('.btn-theme').forEach(btn => {
      const icon = btn.querySelector('i');
      if (!icon) return;
      if (theme === DARK) {
        icon.className = 'ph ph-sun';
        btn.setAttribute('aria-label', 'Switch to light mode');
      } else {
        icon.className = 'ph ph-moon';
        btn.setAttribute('aria-label', 'Switch to dark mode');
      }
    });
  }

  function toggle() {
    const current = document.documentElement.getAttribute('data-theme') || LIGHT;
    applyTheme(current === DARK ? LIGHT : DARK);
  }

  function init() {
    const theme = getSavedTheme() || getSystemTheme();
    applyTheme(theme);

    document.querySelectorAll('.btn-theme').forEach(btn => {
      btn.addEventListener('click', toggle);
    });

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if (!getSavedTheme()) applyTheme(e.matches ? DARK : LIGHT);
    });
  }

  return { init, toggle, applyTheme };
})();

// ============================================================
// 2. RTL MANAGEMENT
// ============================================================
const RTLManager = (() => {
  const STORAGE_KEY = 'voltgrid-dir';

  function getDir() {
    return localStorage.getItem(STORAGE_KEY) || 'ltr';
  }

  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(STORAGE_KEY, dir);
  }

  function toggle() {
    const current = document.documentElement.getAttribute('dir') || 'ltr';
    applyDir(current === 'rtl' ? 'ltr' : 'rtl');
  }

  function init() {
    applyDir(getDir());
    document.querySelectorAll('.btn-rtl').forEach(btn => {
      btn.addEventListener('click', toggle);
    });
  }

  return { init, toggle };
})();

// ============================================================
// 3. NAVBAR
// ============================================================
const Navbar = (() => {
  function init() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Scroll effect
    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Active link
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .drawer-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  return { init };
})();

// ============================================================
// 4. HAMBURGER DRAWER
// ============================================================
const Drawer = (() => {
  let drawer, overlay, openBtn, closeBtn;
  let isOpen = false;

  function open() {
    if (!drawer) return;
    isOpen = true;
    drawer.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    if (!drawer) return;
    isOpen = false;
    drawer.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    openBtn.focus();
  }

  function init() {
    drawer = document.querySelector('.nav-drawer');
    overlay = document.querySelector('.nav-overlay');
    openBtn = document.querySelector('.btn-hamburger');
    closeBtn = document.querySelector('.btn-drawer-close');

    if (!drawer || !overlay) return;

    openBtn?.addEventListener('click', open);
    closeBtn?.addEventListener('click', close);
    overlay.addEventListener('click', close);

    // Close on link click
    drawer.querySelectorAll('.drawer-link').forEach(link => {
      link.addEventListener('click', close);
    });

    // Escape key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen) close();
    });
  }

  return { init, open, close };
})();

// ============================================================
// 5. PARTICLE SYSTEM
// ============================================================
const ParticleSystem = (() => {
  function init(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animId;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.1,
        color: Math.random() > 0.5 ? '10, 255, 225' : '123, 47, 255',
      };
    }

    function initParticles() {
      const count = Math.floor((canvas.width * canvas.height) / 8000);
      particles = Array.from({ length: Math.min(count, 120) }, createParticle);
    }

    function drawConnections() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(10, 255, 225, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drawConnections();

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    }

    resize();
    initParticles();
    animate();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      initParticles();
    });
    resizeObserver.observe(canvas.parentElement);
  }

  return { init };
})();

// ============================================================
// 6. TYPEWRITER EFFECT
// ============================================================
const Typewriter = (() => {
  function init(selector, phrases, speed = 80, pause = 2200) {
    const el = document.querySelector(selector);
    if (!el) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const current = phrases[phraseIndex];

      if (isDeleting) {
        el.textContent = current.slice(0, charIndex - 1);
        charIndex--;
      } else {
        el.textContent = current.slice(0, charIndex + 1);
        charIndex++;
      }

      if (!isDeleting && charIndex === current.length) {
        setTimeout(() => { isDeleting = true; type(); }, pause);
        return;
      }

      if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }

      setTimeout(type, isDeleting ? speed / 2 : speed);
    }

    type();
  }

  return { init };
})();

// ============================================================
// 7. SCROLL REVEAL
// ============================================================
const ScrollReveal = (() => {
  function init() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elements.forEach(el => observer.observe(el));
  }

  return { init };
})();

// ============================================================
// 8. COUNTER ANIMATION
// ============================================================
const CounterAnimation = (() => {
  function animateCount(el, target, duration = 2000) {
    const start = performance.now();
    const isFloat = target % 1 !== 0;

    function update(timestamp) {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = eased * target;

      el.textContent = isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString();

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  function init() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseFloat(el.getAttribute('data-count'));
            animateCount(el, target);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(el => observer.observe(el));
  }

  return { init };
})();

// ============================================================
// 9. TESTIMONIAL CAROUSEL
// ============================================================
const Carousel = (() => {
  function init(selector) {
    const wrapper = document.querySelector(selector);
    if (!wrapper) return;

    const track = wrapper.querySelector('.testimonials-track');
    const cards = Array.from(wrapper.querySelectorAll('.testimonial-card'));
    const prevBtn = wrapper.querySelector('.carousel-btn.prev');
    const nextBtn = wrapper.querySelector('.carousel-btn.next');
    const dotsWrap = wrapper.querySelector('.carousel-dots');

    if (!track || !cards.length) return;

    let current = 0;
    let perView = window.innerWidth > 1024 ? 3 : window.innerWidth > 640 ? 2 : 1;
    const total = Math.ceil(cards.length / perView);
    let autoTimer;

    // Create dots
    if (dotsWrap) {
      for (let i = 0; i < total; i++) {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    }

    function goTo(index) {
      current = Math.max(0, Math.min(index, total - 1));
      const cardWidth = cards[0].offsetWidth + parseInt(getComputedStyle(track).gap || 24);
      track.style.transform = `translateX(-${current * perView * cardWidth}px)`;
      updateDots();
    }

    function updateDots() {
      if (!dotsWrap) return;
      dotsWrap.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }

    function next() { goTo(current < total - 1 ? current + 1 : 0); }
    function prev() { goTo(current > 0 ? current - 1 : total - 1); }

    prevBtn?.addEventListener('click', prev);
    nextBtn?.addEventListener('click', next);

    // Auto-play
    function startAuto() {
      autoTimer = setInterval(next, 5000);
    }
    function stopAuto() {
      clearInterval(autoTimer);
    }

    wrapper.addEventListener('mouseenter', stopAuto);
    wrapper.addEventListener('mouseleave', startAuto);
    startAuto();

    // Touch/swipe
    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    });

    // Resize
    window.addEventListener('resize', () => {
      perView = window.innerWidth > 1024 ? 3 : window.innerWidth > 640 ? 2 : 1;
      goTo(0);
    });
  }

  return { init };
})();

// ============================================================
// 10. FORM VALIDATION
// ============================================================
const FormValidator = (() => {
  const rules = {
    required: val => val.trim() !== '',
    email: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    minLength: (val, len) => val.length >= len,
    match: (val, other) => val === other,
  };

  function showError(input, message) {
    input.classList.remove('success');
    input.classList.add('error');
    const errEl = input.parentElement.querySelector('.form-error');
    if (errEl) { errEl.textContent = message; errEl.classList.add('show'); }
  }

  function showSuccess(input) {
    input.classList.remove('error');
    input.classList.add('success');
    const errEl = input.parentElement.querySelector('.form-error');
    if (errEl) errEl.classList.remove('show');
  }

  function clearState(input) {
    input.classList.remove('error', 'success');
    const errEl = input.parentElement.querySelector('.form-error');
    if (errEl) errEl.classList.remove('show');
  }

  function validateField(input) {
    const val = input.value;
    const type = input.type;
    const required = input.hasAttribute('required');
    const minLen = parseInt(input.getAttribute('data-min-length'));
    const matchSel = input.getAttribute('data-match');

    if (required && !rules.required(val)) {
      showError(input, input.getAttribute('data-error-required') || 'This field is required.');
      return false;
    }

    if (type === 'email' && val && !rules.email(val)) {
      showError(input, 'Please enter a valid email address.');
      return false;
    }

    if (minLen && !rules.minLength(val, minLen)) {
      showError(input, `Must be at least ${minLen} characters.`);
      return false;
    }

    if (matchSel) {
      const matchEl = document.querySelector(matchSel);
      if (matchEl && !rules.match(val, matchEl.value)) {
        showError(input, 'Passwords do not match.');
        return false;
      }
    }

    if (val) showSuccess(input);
    else clearState(input);
    return true;
  }

  function initForm(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea, select');
    const successMsg = form.querySelector('.form-success');
    const checkbox = form.querySelector('input[type="checkbox"][data-required]');

    inputs.forEach(input => {
      if (input.type === 'checkbox') return;
      input.addEventListener('blur', () => validateField(input));
      input.addEventListener('input', () => {
        if (input.classList.contains('error')) validateField(input);
      });
    });

    form.addEventListener('submit', e => {
      e.preventDefault();
      let valid = true;

      inputs.forEach(input => {
        if (input.type === 'checkbox') return;
        if (!validateField(input)) valid = false;
      });

      if (checkbox && !checkbox.checked) {
        showError(checkbox.parentElement, 'You must accept the terms.');
        valid = false;
      }

      if (valid && successMsg) {
        successMsg.classList.add('show');
        form.reset();
        inputs.forEach(input => clearState(input));
        setTimeout(() => successMsg.classList.remove('show'), 5000);
      }
    });
  }

  return { initForm, validateField };
})();

// ============================================================
// 11. SMOOTH SCROLL
// ============================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ============================================================
// 12. BLOG FILTER
// ============================================================
const BlogFilter = (() => {
  function init() {
    const filterBtns = document.querySelectorAll('.blog-filter-btn');
    const cards = document.querySelectorAll('.blog-card-wrap');

    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.getAttribute('data-filter');
        cards.forEach(card => {
          const cardCat = card.getAttribute('data-category');
          const show = cat === 'all' || cardCat === cat;
          card.style.display = show ? '' : 'none';
          if (show) {
            card.style.animation = 'fadeInUp 0.4s ease both';
          }
        });
      });
    });
  }

  return { init };
})();

// ============================================================
// 13. DASHBOARD SIDEBAR TOGGLE (Mobile)
// ============================================================
function initDashboardSidebar() {
  const toggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (!toggle || !sidebar) return;

  toggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}

// ============================================================
// 14. COMING SOON COUNTDOWN
// ============================================================
function initCountdown(targetDate) {
  const elements = {
    days: document.getElementById('countdown-days'),
    hours: document.getElementById('countdown-hours'),
    minutes: document.getElementById('countdown-minutes'),
    seconds: document.getElementById('countdown-seconds'),
  };

  if (!elements.days) return;

  function update() {
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const diff = target - now;

    if (diff <= 0) {
      Object.values(elements).forEach(el => el && (el.textContent = '00'));
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = n => String(n).padStart(2, '0');
    if (elements.days) elements.days.textContent = pad(days);
    if (elements.hours) elements.hours.textContent = pad(hours);
    if (elements.minutes) elements.minutes.textContent = pad(minutes);
    if (elements.seconds) elements.seconds.textContent = pad(seconds);
  }

  update();
  setInterval(update, 1000);
}

// ============================================================
// 15. INIT ALL
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  RTLManager.init();
  Navbar.init();
  Drawer.init();
  ScrollReveal.init();
  CounterAnimation.init();
  initSmoothScroll();
  BlogFilter.init();
  initDashboardSidebar();

  // Particles on hero
  ParticleSystem.init('particle-canvas');

  // Typewriter on hero (index only)
  Typewriter.init('.typewriter', [
    'Smart EV Charging',
    'Clean Energy Future',
    'Instant Power Access',
    'Zero Emissions Mobility',
  ]);

  // Testimonials carousel
  Carousel.init('.testimonials-section');

  // Form validation
  FormValidator.initForm('#contact-form');
  FormValidator.initForm('#login-form');
  FormValidator.initForm('#register-form');
  FormValidator.initForm('#newsletter-form');

  // Countdown (coming-soon page)
  initCountdown('2027-01-01T00:00:00');
});
