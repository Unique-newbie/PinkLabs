// =============================================================
// PinkLabs — Dynamic Public Site Script
// Dark mode, expandable project cards, animated counters
// =============================================================

let sb = null;

function getCurrentPath() {
  const rawPath = window.location.pathname || '/';
  const normalized = rawPath.endsWith('/') && rawPath.length > 1 ? rawPath.slice(0, -1) : rawPath;
  return normalized || '/';
}

function isHomePage() {
  const path = getCurrentPath();
  return path === '/' || path.endsWith('/index.html');
}

function normalizeInternalHref(href) {
  if (!href) return '#';
  if (/^(https?:|mailto:|tel:|#)/i.test(href)) return href;
  if (!href.startsWith('/')) return href;

  const [pathPart, hashPart] = href.split('#');
  const hash = hashPart ? `#${hashPart}` : '';
  if (pathPart === '/') return `index.html${hash}`;

  const trimmedPath = pathPart.replace(/^\//, '');
  if (!trimmedPath) return `index.html${hash}`;
  if (trimmedPath.includes('.')) return `${trimmedPath}${hash}`;
  return `${trimmedPath}.html${hash}`;
}

function resolveSiteHref(href) {
  if (!href) return '#';
  if (/^(https?:|mailto:|tel:)/i.test(href)) return href;
  if (href.startsWith('/')) return normalizeInternalHref(href);
  if (!href.startsWith('#')) return href;
  const section = href.slice(1).toLowerCase();
  const routeMap = {
    home: 'index.html#home',
    services: 'services.html',
    process: 'services.html#processPage',
    work: 'portfolio.html',
    portfolio: 'portfolio.html',
    pricing: 'index.html#pricing',
    team: 'about.html#teamSection',
    about: 'about.html',
    faq: 'index.html#faq',
    contact: 'reachout.html',
    reachout: 'reachout.html',
  };

  return routeMap[section] || `index.html${href}`;
}

function isCurrentNavTarget(href) {
  if (!href || href === '#') return false;
  const normalizedHref = resolveSiteHref(href);
  const currentPath = getCurrentPath();
  const [hrefPath, hrefHash] = normalizedHref.split('#');

  if (!hrefPath || hrefPath === 'index.html') {
    if (!hrefHash) return isHomePage() && (!window.location.hash || window.location.hash === '#pricing');
    return isHomePage() && window.location.hash === `#${hrefHash}`;
  }

  const currentFile = currentPath === '/' ? 'index.html' : currentPath.split('/').pop();
  const hrefFile = hrefPath.split('/').pop();
  return currentFile === hrefFile;
}

// HTML escaping to prevent XSS from DB content
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function initSupabase() {
  const url = (typeof PINKLABS_CONFIG !== 'undefined') ? PINKLABS_CONFIG.SUPABASE_URL : 'YOUR_SUPABASE_URL';
  const key = (typeof PINKLABS_CONFIG !== 'undefined') ? PINKLABS_CONFIG.SUPABASE_ANON_KEY : 'YOUR_SUPABASE_ANON_KEY';
  if (typeof supabase !== 'undefined' && url !== 'YOUR_SUPABASE_URL') {
    sb = supabase.createClient(url, key, {
      global: {
        fetch: (fetchUrl, options) => fetch(fetchUrl, { ...options, cache: 'no-store' })
      }
    });
    return true;
  }
  return false;
}

let contactSubmitLockedUntil = 0;

// =============================================================
// Init
// =============================================================
document.addEventListener('DOMContentLoaded', async () => {
  initPreloader();
  initTheme();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initBackToTop();
  initCookieConsent();

  // Try immediate init (scripts may already be loaded)
  if (!initSupabase()) {
    // Deferred scripts haven't loaded yet, wait for them
    await new Promise(resolve => {
      const check = setInterval(() => {
        if (typeof supabase !== 'undefined') { clearInterval(check); resolve(); }
      }, 50);
      // Give up after 5s
      setTimeout(() => { clearInterval(check); resolve(); }, 5000);
    });
    initSupabase();
  }

  // Load from Supabase if configured
  if (sb) {
    await loadAllContent();
  }

  initScrollReveal();
  initScrollSpy();
  initAnimatedCounters();
  initTestimonialCarousel();
  initContactForms();
  initProjectModal();
  initTeamInteractions();
  initLazyLoading();

  // Re-init Lucide icons after dynamic content is rendered
  if (typeof lucide !== 'undefined') { try { lucide.createIcons(); } catch(e) {} }
});

// =============================================================
// Theme Toggle (Dark / Light)
// =============================================================
function initTheme() {
  const toggle = document.getElementById('themeToggle');
  const stored = localStorage.getItem('pinklabs-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (stored) {
    document.documentElement.setAttribute('data-theme', stored);
  } else if (prefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('pinklabs-theme', next);
    });
  }
}

// =============================================================
// Preloader
// =============================================================
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      setTimeout(() => preloader.remove(), 500);
    }, 300);
  });
  setTimeout(() => {
    preloader.classList.add('hidden');
    setTimeout(() => preloader.remove(), 500);
  }, 4000);
}

// =============================================================
// Navbar Scroll
// =============================================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const cur = window.scrollY;
    navbar.classList.toggle('scrolled', cur > 50);
    if (cur > 400) {
      navbar.classList.toggle('navbar-hidden', cur > lastScroll);
    } else {
      navbar.classList.remove('navbar-hidden');
    }
    lastScroll = cur;
  }, { passive: true });
}

// =============================================================
// Mobile Menu
// =============================================================
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('navLinks');
  if (!toggle || !nav) return;

  // Create backdrop overlay for mobile menu
  let backdrop = document.getElementById('navBackdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'navBackdrop';
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
  }

  function openMenu() {
    nav.classList.add('open');
    toggle.classList.add('active');
    backdrop.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    nav.classList.remove('open');
    toggle.classList.remove('active');
    backdrop.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', () => {
    nav.classList.contains('open') ? closeMenu() : openMenu();
  });
  backdrop.addEventListener('click', closeMenu);
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

// =============================================================
// Smooth Scroll
// =============================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#' || href === '#main') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = document.getElementById('navbar')?.offsetHeight || 0;
        const y = target.getBoundingClientRect().top + window.scrollY - navH - 20;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });
}

// =============================================================
// Back to Top
// =============================================================
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 600);
  }, { passive: true });
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// =============================================================
// Cookie Consent
// =============================================================
function initCookieConsent() {
  const el = document.getElementById('cookieConsent');
  if (!el || localStorage.getItem('pinklabs-cookies')) { if (el) el.remove(); return; }
  setTimeout(() => el.classList.add('visible'), 2000);
  document.getElementById('cookieAccept')?.addEventListener('click', () => {
    localStorage.setItem('pinklabs-cookies', 'accepted');
    el.classList.remove('visible');
    setTimeout(() => el.remove(), 400);
  });
  document.getElementById('cookieDecline')?.addEventListener('click', () => {
    localStorage.setItem('pinklabs-cookies', 'declined');
    el.classList.remove('visible');
    setTimeout(() => el.remove(), 400);
  });
}

// =============================================================
// Scroll Reveal
// =============================================================
let globalScrollObserver = null;

function initScrollReveal() {
  if (globalScrollObserver) {
    globalScrollObserver.disconnect();
  }
  globalScrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        globalScrollObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  observeRevealElements();
}

function observeRevealElements() {
  if (!globalScrollObserver) return;
  const els = document.querySelectorAll('.reveal:not(.revealed)');
  els.forEach(el => globalScrollObserver.observe(el));
}

// =============================================================
// Scroll Spy
// =============================================================
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  if (!sections.length || !links.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(sec => observer.observe(sec));
}

// =============================================================
// Animated Counters
// =============================================================
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.stat-number[data-count]');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        // Preserve the suffix span inside the stat-number
        const suffixSpan = el.querySelector('.pink');
        const suffixText = suffixSpan ? suffixSpan.textContent : '';
        const duration = 2000;
        let start = 0;
        const step = (timestamp) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
          const current = Math.floor(ease * target);
          el.innerHTML = `${current}<span class="pink">${escapeHtml(suffixText)}</span>`;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

// =============================================================
// Testimonial Carousel
// =============================================================
function initTestimonialCarousel() {
  const track = document.getElementById('testimonialTrack');
  const prev = document.getElementById('testimonialPrev');
  const next = document.getElementById('testimonialNext');
  const dots = document.getElementById('testimonialDots');
  if (!track || !prev || !next) return;
  let idx = 0;
  let autoplay = null;

  function update() {
    const cards = track.querySelectorAll('.testimonial-card');
    if (!cards.length) return;
    const gap = 28;
    const width = cards[0].offsetWidth + gap;
    track.style.transform = `translateX(-${idx * width}px)`;
    if (dots) {
      dots.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    }
  }

  function buildDots() {
    const cards = track.querySelectorAll('.testimonial-card');
    if (!dots || !cards.length) return;
    dots.innerHTML = '';
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = `dot${i === 0 ? ' active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => { idx = i; update(); });
      dots.appendChild(dot);
    });
  }

  function goNext() {
    const cards = track.querySelectorAll('.testimonial-card');
    if (!cards.length) return;
    idx = (idx + 1) % cards.length;
    update();
  }
  function goPrev() {
    const cards = track.querySelectorAll('.testimonial-card');
    if (!cards.length) return;
    idx = (idx - 1 + cards.length) % cards.length;
    update();
  }

  prev.addEventListener('click', goPrev);
  next.addEventListener('click', goNext);

  // Autoplay with pause on hover and resume on leave
  function startAutoplay() {
    stopAutoplay();
    autoplay = setInterval(goNext, 5000);
  }
  function stopAutoplay() {
    if (autoplay) { clearInterval(autoplay); autoplay = null; }
  }
  track.addEventListener('mouseenter', stopAutoplay);
  track.addEventListener('mouseleave', startAutoplay);

  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });
  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) { diff > 0 ? goNext() : goPrev(); }
    startAutoplay();
  }, { passive: true });

  setTimeout(() => { buildDots(); update(); startAutoplay(); }, 100);
}

// =============================================================
// Contact Form
// =============================================================
function initContactForms() {
  initLegacyContactForm();
  initReachoutForm();
}

function showContactToast(msg, type) {
  const toast = document.getElementById('toast');
  const message = document.getElementById('toastMessage');
  if (!toast || !message) return;
  message.textContent = msg;
  toast.className = `toast ${type} visible`;
  setTimeout(() => toast.classList.remove('visible'), 4000);
}

function setButtonLoadingState(button, loading) {
  if (!button) return;
  const btnText = button.querySelector('.btn-text');
  const btnLoading = button.querySelector('.btn-loading');
  const btnArrow = button.querySelector('.btn-arrow');

  button.disabled = loading;

  if (btnText || btnLoading || btnArrow) {
    if (btnText) btnText.style.display = loading ? 'none' : 'inline';
    if (btnLoading) btnLoading.style.display = loading ? 'inline-flex' : 'none';
    if (btnArrow) btnArrow.style.display = loading ? 'none' : 'inline';
    return;
  }

  if (loading) {
    button.dataset.originalText = button.textContent;
    button.textContent = 'Sending...';
  } else if (button.dataset.originalText) {
    button.textContent = button.dataset.originalText;
  }
}

async function submitContactPayload(payload) {
  const now = Date.now();
  if (now < contactSubmitLockedUntil) {
    showContactToast('Please wait before submitting again.', 'error');
    return { ok: false, rateLimited: true };
  }

  const { error } = await sb.from('contact_submissions').insert([payload]);
  if (error) throw error;

  contactSubmitLockedUntil = now + 30000;
  return { ok: true };
}

function initLegacyContactForm() {
  const form = document.getElementById('contactForm');
  if (!form || !sb || form.dataset.bound === 'true') return;
  form.dataset.bound = 'true';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const email = form.querySelector('[name="email"]')?.value?.trim() || '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showContactToast('Please enter a valid email address.', 'error');
      return;
    }

    const payload = {
      name: form.querySelector('[name="name"]')?.value?.trim() || '',
      email,
      phone: form.querySelector('[name="phone"]')?.value?.trim() || '',
      project_type: form.querySelector('[name="project_type"]')?.value || '',
      budget: form.querySelector('[name="budget"]')?.value || '',
      message: form.querySelector('[name="message"]')?.value?.trim() || '',
    };

    setButtonLoadingState(btn, true);
    try {
      const result = await submitContactPayload(payload);
      if (!result.ok) return;
      form.reset();
      showContactToast('Thanks! We\'ll get back to you soon.', 'success');
    } catch (error) {
      console.error(error);
      showContactToast('Something went wrong. Please try again.', 'error');
    } finally {
      setButtonLoadingState(btn, false);
    }
  });
}

function initReachoutForm() {
  const form = document.getElementById('reachoutForm');
  if (!form || !sb || form.dataset.bound === 'true') return;
  form.dataset.bound = 'true';

  const submitBtn = document.getElementById('roSubmitBtn');
  const fields = {
    name: { el: document.getElementById('roName'), err: document.getElementById('roNameError') },
    email: { el: document.getElementById('roEmail'), err: document.getElementById('roEmailError') },
    project: { el: document.getElementById('roProject'), err: document.getElementById('roProjectError') },
    message: { el: document.getElementById('roMessage'), err: document.getElementById('roMessageError') },
  };

  function validate(key) {
    const field = fields[key];
    if (!field?.el || !field?.err) return true;

    const rawValue = field.el.value || '';
    const value = rawValue.trim();
    let ok = true;
    let msg = '';

    switch (key) {
      case 'name':
        if (!value) { ok = false; msg = 'Name is required'; }
        else if (value.length < 2) { ok = false; msg = 'Min 2 characters'; }
        break;
      case 'email':
        if (!value) { ok = false; msg = 'Email is required'; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { ok = false; msg = 'Invalid email'; }
        break;
      case 'project':
        if (!field.el.value) { ok = false; msg = 'Select a project type'; }
        break;
      case 'message':
        if (!value) { ok = false; msg = 'Message is required'; }
        else if (value.length < 10) { ok = false; msg = 'Min 10 characters'; }
        break;
      default:
        break;
    }

    field.err.textContent = msg;
    field.el.classList.toggle('error', !ok);
    field.el.classList.toggle('success', ok && Boolean(value || field.el.value));
    return ok;
  }

  Object.keys(fields).forEach((key) => {
    const field = fields[key];
    if (!field?.el) return;
    field.el.addEventListener('blur', () => validate(key));
    field.el.addEventListener('input', () => {
      if (field.el.classList.contains('error')) validate(key);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const allValid = Object.keys(fields).every((key) => validate(key));
    if (!allValid) return;

    const payload = {
      name: fields.name.el.value.trim(),
      email: fields.email.el.value.trim(),
      phone: document.getElementById('roPhone')?.value.trim() || null,
      project_type: fields.project.el.value,
      budget: document.getElementById('roBudget')?.value || null,
      message: fields.message.el.value.trim(),
    };

    setButtonLoadingState(submitBtn, true);
    try {
      const result = await submitContactPayload(payload);
      if (!result.ok) return;
      showContactToast('Message sent! We\'ll get back to you within 24 hours.', 'success');
      form.reset();
      Object.values(fields).forEach(({ el, err }) => {
        if (el) el.classList.remove('success', 'error');
        if (err) err.textContent = '';
      });
    } catch (error) {
      console.error(error);
      showContactToast('Something went wrong. Please try again.', 'error');
    } finally {
      setButtonLoadingState(submitBtn, false);
    }
  });
}

// =============================================================
// Project Modal
// =============================================================
function initProjectModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.work-card');
    if (!card) return;
    const imgEl = card.querySelector('img');
    const tagEl = card.querySelector('.work-card-tag');
    const titleEl = card.querySelector('h3');
    const descEl = card.querySelector('p');

    document.getElementById('modalImage').src = imgEl?.src || '';
    document.getElementById('modalTag').textContent = tagEl?.textContent || '';
    document.getElementById('modalTitle').textContent = titleEl?.textContent || '';
    document.getElementById('modalDesc').textContent = descEl?.textContent || '';

    // Tech stack
    const tech = card.dataset.tech;
    const techSection = document.getElementById('modalTechSection');
    const techContainer = document.getElementById('modalTech');
    if (tech && techContainer) {
      techContainer.innerHTML = tech.split(',').map(t => `<span class="tech-tag">${t.trim()}</span>`).join('');
      techSection.style.display = '';
    } else if (techSection) {
      techSection.style.display = 'none';
    }

    // Links
    const linksSection = document.getElementById('modalLinksSection');
    const linksContainer = document.getElementById('modalLinks');
    const live = card.dataset.live;
    const github = card.dataset.github;
    if ((live || github) && linksContainer) {
      let linksHtml = '';
      if (live) linksHtml += `<a href="${live}" target="_blank" class="modal-link">Live Site ↗</a>`;
      if (github) linksHtml += `<a href="${github}" target="_blank" class="modal-link">GitHub ↗</a>`;
      linksContainer.innerHTML = linksHtml;
      linksSection.style.display = '';
    } else if (linksSection) {
      linksSection.style.display = 'none';
    }

    // Gallery
    const gallerySection = document.getElementById('modalGallerySection');
    const galleryContainer = document.getElementById('modalGallery');
    const gallery = card.dataset.gallery;
    if (gallery && galleryContainer) {
      try {
        const urls = JSON.parse(gallery);
        if (urls.length) {
          galleryContainer.innerHTML = urls.map(url => `<img src="${url}" alt="" loading="lazy">`).join('');
          gallerySection.style.display = '';
        } else { gallerySection.style.display = 'none'; }
      } catch { gallerySection.style.display = 'none'; }
    } else if (gallerySection) {
      gallerySection.style.display = 'none';
    }

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
}

// =============================================================
// FAQ Toggle
// =============================================================
function toggleFaq(btn) {
  const item = btn.parentElement;
  const answer = item.querySelector('.faq-answer');
  const isOpen = item.classList.toggle('active');
  item.classList.toggle('open', isOpen);
  btn.setAttribute('aria-expanded', isOpen);
  if (answer) {
    answer.style.maxHeight = isOpen ? answer.scrollHeight + 'px' : '0';
  }
}

// =============================================================
// Lazy Loading
// =============================================================
function initLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) { img.src = img.dataset.src; }
          observer.unobserve(img);
        }
      });
    });
    images.forEach(img => observer.observe(img));
  }
}

// =============================================================
// Content Loader — Supabase
// =============================================================
async function loadAllContent() {
  const results = await Promise.allSettled([
    loadSiteSettings(),
    loadNavLinks(),
    loadHero(),
    loadStats(),
    loadBrands(),
    loadServices(),
    loadProcess(),
    loadPortfolio(),
    loadTestimonials(),
    loadPricing(),
    loadFAQ(),
    loadAbout(),
    loadTeam(),
    loadFooter(),
    loadContactInfo(),
    loadFormConfig(),
  ]);

  results.forEach((result) => {
    if (result.status === 'rejected') {
      console.warn('[PinkLabs] Content load error:', result.reason);
    }
  });
}

async function loadSiteSettings() {
  const { data } = await sb.from('site_settings').select('*');
  if (!data || data.length === 0) return;

  // Build a key→value map
  const settings = {};
  data.forEach(row => {
    settings[row.key] = typeof row.value === 'string' ? JSON.parse(row.value) : row.value;
  });

  // --- Brand ---
  const brand = settings.brand || {};
  if (brand.name) {
    const navBrand = document.getElementById('brandNameNav');
    const footBrand = document.getElementById('brandNameFooter');
    if (navBrand) navBrand.textContent = brand.name;
    if (footBrand) footBrand.textContent = brand.name;
  }
  // Dynamic favicon
  if (brand.favicon_url) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
    link.href = brand.favicon_url;
    let apple = document.querySelector("link[rel='apple-touch-icon']");
    if (!apple) { apple = document.createElement('link'); apple.rel = 'apple-touch-icon'; document.head.appendChild(apple); }
    apple.href = brand.favicon_url;
  }
  // Dynamic logo image
  if (brand.logo_url) {
    const logoContainers = document.querySelectorAll('.logo');
    logoContainers.forEach(logo => {
      const existingImg = logo.querySelector('.logo-custom-img');
      if (!existingImg) {
        const img = document.createElement('img');
        img.src = brand.logo_url;
        img.alt = brand.name || 'Logo';
        img.className = 'logo-custom-img';
        img.style.cssText = 'height:32px;width:auto;object-fit:contain;';
        const iconEl = logo.querySelector('.logo-icon');
        const textEl = logo.querySelector('span:not(.logo-icon)');
        if (iconEl) iconEl.style.display = 'none';
        if (textEl) textEl.style.display = 'none';
        logo.prepend(img);
      }
    });
  }

  // --- SEO / Open Graph ---
  const seo = settings.seo || {};
  if (seo.og_title && isHomePage()) {
    let metaOgTitle = document.querySelector("meta[property='og:title']");
    if (!metaOgTitle) { metaOgTitle = document.createElement('meta'); metaOgTitle.setAttribute('property', 'og:title'); document.head.appendChild(metaOgTitle); }
    metaOgTitle.content = seo.og_title;
    document.title = seo.og_title;
  }
  if (seo.og_description) {
    let metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc && isHomePage()) metaDesc.content = seo.og_description;
    let metaOgDesc = document.querySelector("meta[property='og:description']");
    if (!metaOgDesc) { metaOgDesc = document.createElement('meta'); metaOgDesc.setAttribute('property', 'og:description'); document.head.appendChild(metaOgDesc); }
    metaOgDesc.content = seo.og_description;
  }
  if (seo.og_image) {
    let metaOgImage = document.querySelector("meta[property='og:image']");
    if (!metaOgImage) { metaOgImage = document.createElement('meta'); metaOgImage.setAttribute('property', 'og:image'); document.head.appendChild(metaOgImage); }
    metaOgImage.content = seo.og_image;
  }

  // --- Footer ---
  const footer = settings.footer || {};
  if (footer.copyright) {
    const el = document.getElementById('footerCopyright');
    if (el) el.textContent = footer.copyright;
  }
  if (footer.description) {
    const el = document.getElementById('footerDesc');
    if (el) el.textContent = footer.description;
  }
  if (footer.built_with) {
    const el = document.getElementById('footerBuiltWith');
    if (el) el.textContent = footer.built_with;
  }

  // --- Brand tagline in footer ---
  if (brand.tagline) {
    const taglineEl = document.getElementById('footerTagline');
    if (taglineEl) taglineEl.textContent = brand.tagline;
  }
  if (brand.description) {
    const el = document.getElementById('footerDesc');
    if (el && !footer.description) el.textContent = brand.description;
  }
}

// --- Nav Links ---
// DB table: nav_links | columns: label, href, is_cta
async function loadNavLinks() {
  const { data } = await sb.from('nav_links').select('*').order('sort_order');
  if (!data || !data.length) return;
  const nav = document.getElementById('navLinks');
  if (!nav) return;
  nav.innerHTML = '';
  data.forEach(link => {
    const a = document.createElement('a');
    const href = resolveSiteHref(link.href || '#');
    a.href = href;
    if (link.is_cta) {
      a.className = 'nav-cta';
      a.innerHTML = `<i data-lucide="send" class="lucide-sm"></i> ` + escapeHtml(link.label);
    } else {
      a.className = 'nav-link';
      a.textContent = link.label;
    }
    if (isCurrentNavTarget(link.href || href)) {
      a.classList.add('active');
      a.setAttribute('aria-current', 'page');
    }
    nav.appendChild(a);
  });
}

// --- Hero ---
// DB table: hero_content | columns: badge_text, title_line1, title_highlight, description,
//   btn_primary_text, btn_primary_link, btn_secondary_text, btn_secondary_link,
//   hero_image_url, floating_card1_label, floating_card1_value, floating_card2_label, floating_card2_value
async function loadHero() {
  const { data, error } = await sb.from('hero_content').select('*').order('updated_at', { ascending: false }).limit(1).single();
  if (error || !data) return;

  // Title — combine title_line1 and title_highlight (always apply)
  const titleEl = document.getElementById('heroTitle');
  if (titleEl) {
    const line1 = data.title_line1 || '';
    const highlight = data.title_highlight || '';
    if (line1 || highlight) {
      titleEl.innerHTML = `${line1} <br><span class="pink">${highlight}</span>`;
    }
  }

  // Description — always apply (even empty clears default)
  const descEl = document.getElementById('heroDesc');
  if (descEl && data.description !== null && data.description !== undefined) {
    descEl.textContent = data.description || '';
  }

  // Badge text — always apply
  const badgeEl = document.getElementById('heroBadgeText');
  if (badgeEl && data.badge_text !== null && data.badge_text !== undefined) {
    badgeEl.textContent = data.badge_text || '';
  }

  // Hero image — show/hide based on whether URL exists
  const img = document.getElementById('heroImage');
  const wrapper = document.getElementById('heroImageWrapper');
  const visual = wrapper?.closest('.hero-visual');
  if (data.hero_image_url) {
    if (img) img.src = data.hero_image_url;
    if (wrapper) wrapper.style.display = '';
    if (visual) visual.style.display = '';
  } else {
    if (wrapper) wrapper.style.display = 'none';
    // Hide the entire visual container to prevent empty space
    if (visual && !data.floating_card1_label && !data.floating_card2_label) {
      visual.style.display = 'none';
    }
  }

  // Buttons — always apply text + link
  const btnPrimary = document.getElementById('heroBtnPrimary');
  if (btnPrimary) {
    if (data.btn_primary_text) {
      const span = btnPrimary.querySelector('span');
      if (span) span.textContent = data.btn_primary_text;
    }
    if (data.btn_primary_link) btnPrimary.href = data.btn_primary_link;
  }
  const btnSecondary = document.getElementById('heroBtnSecondary');
  if (btnSecondary) {
    if (data.btn_secondary_text) btnSecondary.textContent = data.btn_secondary_text;
    if (data.btn_secondary_link) btnSecondary.href = data.btn_secondary_link;
  }

  // Floating cards
  const card1 = document.getElementById('heroCard1');
  const card2 = document.getElementById('heroCard2');
  if (card1) {
    if (data.floating_card1_label) {
      card1.style.display = '';
      setTextIfExists('heroCard1Label', data.floating_card1_label);
      setTextIfExists('heroCard1Value', data.floating_card1_value);
    } else {
      card1.style.display = 'none';
    }
  }
  if (card2) {
    if (data.floating_card2_label) {
      card2.style.display = '';
      setTextIfExists('heroCard2Label', data.floating_card2_label);
      setTextIfExists('heroCard2Value', data.floating_card2_value);
    } else {
      card2.style.display = 'none';
    }
  }
}

// --- Stats ---
// DB table: stats | columns: number, suffix, label, sort_order
async function loadStats() {
  const { data } = await sb.from('stats').select('*').order('sort_order');
  if (!data || !data.length) return;
  const grid = document.getElementById('statsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  data.forEach(stat => {
    const item = document.createElement('div');
    item.className = 'stat-item';
    item.innerHTML = `<span class="stat-number" data-count="${stat.number}">${stat.number}<span class="pink">${stat.suffix || ''}</span></span><span class="stat-label">${stat.label}</span>`;
    grid.appendChild(item);
  });
  showSection('statsGrid');
}

// --- Trusted Brands ---
// DB table: trust_logos | columns: name, sort_order
async function loadBrands() {
  const { data } = await sb.from('trust_logos').select('*').order('sort_order');
  if (!data || !data.length) {
    const section = document.getElementById('trustedBrands');
    if (section) section.style.display = 'none';
    return;
  }
  const track = document.querySelector('.brands-track');
  if (!track) return;
  track.innerHTML = '';
  data.forEach(brand => {
    if (brand.logo_url) {
      const img = document.createElement('img');
      img.src = brand.logo_url;
      img.alt = brand.name || 'Trusted Brand';
      img.className = 'brand-logo-img';
      // Inline style to match height with text roughly while maintaining aspect ratio
      img.style.height = '40px';
      img.style.width = 'auto';
      img.style.objectFit = 'contain';
      img.style.opacity = '0.7';
      img.style.transition = 'opacity 0.3s, filter 0.3s';
      img.style.filter = 'grayscale(100%)';
      img.onmouseenter = () => { img.style.opacity = '1'; img.style.filter = 'grayscale(0%)'; };
      img.onmouseleave = () => { img.style.opacity = '0.7'; img.style.filter = 'grayscale(100%)'; };
      track.appendChild(img);
    } else {
      const el = document.createElement('span');
      el.className = 'brand-logo';
      el.textContent = brand.name;
      track.appendChild(el);
    }
  });
  showSection('trustedBrands');
}

// --- Services ---
// DB table: services | columns: title, description, icon_svg
async function loadServices() {
  const { data } = await sb.from('services').select('*').order('sort_order');
  if (!data || !data.length) return;

  // Also load section header
  await loadSectionHeader('services', 'servicesHeader');

  const grid = document.getElementById('servicesGrid');
  if (!grid) return;
  grid.innerHTML = '';
  data.forEach(svc => {
    const card = document.createElement('div');
    card.className = 'service-card reveal';
    card.innerHTML = `
      <div class="service-icon">${svc.icon_svg || ''}</div>
      <h3>${escapeHtml(svc.title)}</h3>
      <p>${escapeHtml(svc.description)}</p>
    `;
    grid.appendChild(card);
  });
  showSection('services');
}

// --- Process ---
// DB table: process_steps | columns: step_number, title, description, icon_svg
async function loadProcess() {
  const { data } = await sb.from('process_steps').select('*').order('sort_order');
  if (!data || !data.length) return;

  await loadSectionHeader('process', 'processHeader');

  const timeline = document.getElementById('processTimeline') || document.getElementById('processSteps');
  if (!timeline) return;
  timeline.innerHTML = '';
  data.forEach((step, i) => {
    const el = document.createElement('div');
    el.className = 'process-step reveal';
    el.innerHTML = `
      <div class="process-icon">${step.icon_svg || ''}</div>
      <span class="process-number">${String(step.step_number || i + 1).padStart(2, '0')}</span>
      <h3>${escapeHtml(step.title)}</h3>
      <p>${escapeHtml(step.description)}</p>
    `;
    timeline.appendChild(el);
  });
  showSection('process');
  showSection('processPage');
}

// --- Portfolio ---
// DB table: projects | columns: title, description, tag, image_url, project_url, is_featured
async function loadPortfolio() {
  const { data } = await sb.from('projects').select('*').order('sort_order');
  if (!data || !data.length) return;

  await loadSectionHeader('portfolio', 'workHeader');

  const grid = document.getElementById('workGrid');
  if (!grid) return;
  grid.innerHTML = '';
  data.forEach(project => {
    const card = document.createElement('div');
    card.className = 'work-card reveal';
    if (project.project_url) card.setAttribute('data-live', project.project_url);
    card.innerHTML = `
      <div class="work-card-img"><img src="${escapeHtml(project.image_url || '')}" alt="${escapeHtml(project.title)}" loading="lazy"></div>
      <div class="work-card-body">
        <span class="work-card-tag">${escapeHtml(project.tag || '')}</span>
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.description)}</p>
        <span class="work-card-expand">View Details <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
      </div>
    `;
    grid.appendChild(card);
  });
  showSection('work');
}

// --- Testimonials ---
// DB table: testimonials | columns: client_name, client_role, client_company, client_initials, quote, rating
async function loadTestimonials() {
  const { data } = await sb.from('testimonials').select('*').order('sort_order');
  if (!data || !data.length) return;

  await loadSectionHeader('testimonials', 'testimonialsHeader');

  const track = document.getElementById('testimonialTrack');
  if (!track) return;
  track.innerHTML = '';
  const starSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="#FFBF00" stroke="#FFBF00" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
  data.forEach(t => {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    const initials = escapeHtml(t.client_initials || (t.client_name || '').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase());
    card.innerHTML = `
      <div class="testimonial-stars">${starSvg.repeat(Math.min(Math.max(t.rating || 5, 1), 5))}</div>
      <p class="testimonial-quote">"${escapeHtml(t.quote)}"</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${initials}</div>
        <div><div class="testimonial-name">${escapeHtml(t.client_name)}</div><div class="testimonial-role">${escapeHtml(t.client_role || '')}${t.client_company ? ' at ' + escapeHtml(t.client_company) : ''}</div></div>
      </div>
    `;
    track.appendChild(card);
  });
  showSection('testimonials');
}

// --- Pricing ---
// DB table: pricing_plans | columns: name, description, currency, price, period, features (JSONB array), is_popular, btn_text, btn_link
async function loadPricing() {
  const { data } = await sb.from('pricing_plans').select('*').order('sort_order');
  if (!data || !data.length) return;

  await loadSectionHeader('pricing', 'pricingHeader');

  const grid = document.getElementById('pricingGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const checkSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--pink-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  data.forEach(plan => {
    const card = document.createElement('div');
    card.className = `pricing-card reveal${plan.is_popular ? ' popular' : ''}`;
    // features is a JSONB array — escape each item
    const features = (Array.isArray(plan.features) ? plan.features : []).map(f => `<li>${checkSvg} ${escapeHtml(f)}</li>`).join('');
    card.innerHTML = `
      ${plan.is_popular ? '<span class="popular-badge">Most Popular</span>' : ''}
      <h3>${escapeHtml(plan.name)}</h3>
      <p class="pricing-desc">${escapeHtml(plan.description || '')}</p>
      <div class="pricing-price"><span class="currency">${escapeHtml(plan.currency || '₹')}</span><span class="amount">${escapeHtml(plan.price)}</span><span class="period">${escapeHtml(plan.period || '')}</span></div>
      <ul class="pricing-features">${features}</ul>
      <a href="${escapeHtml(plan.btn_link || 'reachout.html')}" class="btn-primary pricing-btn">${escapeHtml(plan.btn_text || 'Get Started')}</a>
    `;
    grid.appendChild(card);
  });
  showSection('pricing');
}

// --- FAQ ---
// DB table: faq_items | columns: question, answer
async function loadFAQ() {
  const { data } = await sb.from('faq_items').select('*').order('sort_order');
  if (!data || !data.length) return;

  await loadSectionHeader('faq', 'faqHeader');

  const list = document.getElementById('faqList');
  if (!list) return;
  list.innerHTML = '';
  data.forEach(faq => {
    const item = document.createElement('div');
    item.className = 'faq-item';
    item.innerHTML = `
      <button class="faq-question" aria-expanded="false">
        ${escapeHtml(faq.question)}
        <span class="faq-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
      </button>
      <div class="faq-answer"><p>${escapeHtml(faq.answer)}</p></div>
    `;
    // Event delegation instead of onclick
    item.querySelector('.faq-question').addEventListener('click', function() { toggleFaq(this); });
    list.appendChild(item);
  });
  showSection('faq');
}

// --- Footer (social links) ---
async function loadFooter() {
  try {
    const { data: socials } = await sb.from('social_links').select('*').order('sort_order');
    const container = document.getElementById('footerSocials');
    if (container && socials && socials.length > 0) {
      container.innerHTML = socials.map(s =>
        `<a href="${s.url}" target="_blank" rel="noopener" class="footer-social-link" title="${s.platform}">${s.icon_svg || s.platform}</a>`
      ).join('');
    }
    // Also populate floating socials
    const floating = document.getElementById('floatingSocials');
    if (floating && socials) {
      const floatingLinks = socials.filter(s => s.is_floating);
      if (floatingLinks.length > 0) {
        floating.innerHTML = floatingLinks.map(s =>
          `<a href="${s.url}" target="_blank" rel="noopener" title="${s.platform}">${s.icon_svg || s.platform}</a>`
        ).join('');
      }
    }
  } catch {}
}

// --- About ---
async function loadAbout() {
  try {
    const { data, error } = await sb.from('about').select('*').limit(1).single();
    if (error || !data) return;
    // Always apply title and description (even empty clears the default)
    const titleEl = document.getElementById('aboutTitle');
    if (titleEl && data.title !== null && data.title !== undefined) titleEl.textContent = data.title;
    const descEl = document.getElementById('aboutDesc');
    if (descEl && data.description !== null && data.description !== undefined) descEl.textContent = data.description;
    if (data.stats) {
      const container = document.getElementById('aboutStats');
      if (container && Array.isArray(data.stats)) {
        container.innerHTML = data.stats.map(s => {
          const match = String(s.value).match(/^([^\d]*)(\d+)([^\d]*)$/);
          if (match) {
            const prefix = match[1] || '';
            const target = parseInt(match[2], 10);
            const suffix = match[3] || '';
            return `<div class="about-stat">
              <span class="about-stat-number" data-target="${target}" data-prefix="${prefix}" data-suffix="${suffix}">${prefix}0${suffix}</span>
              <span class="about-stat-label">${s.label}</span>
            </div>`;
          } else {
            return `<div class="about-stat"><span class="about-stat-number">${s.value}</span><span class="about-stat-label">${s.label}</span></div>`;
          }
        }).join('');

        // Animate numbers counting up on scroll
        const statEls = container.querySelectorAll('.about-stat-number[data-target]');
        const observer = new IntersectionObserver((entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const el = entry.target;
              const target = parseInt(el.getAttribute('data-target'), 10);
              const prefix = el.getAttribute('data-prefix');
              const suffix = el.getAttribute('data-suffix');
              const duration = 2000;
              let startTime = null;

              const step = (timestamp) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                const current = Math.floor(ease * target);
                
                el.textContent = prefix + current + suffix;
                
                if (progress < 1) {
                  window.requestAnimationFrame(step);
                } else {
                  el.textContent = prefix + target + suffix;
                }
              };
              window.requestAnimationFrame(step);
              obs.unobserve(el);
            }
          });
        }, { threshold: 0.3 });

        statEls.forEach(el => observer.observe(el));
      }
    }
    showSection('about');
  } catch {}
}

// --- Team ---
async function loadTeam() {
  try {
    const { data } = await sb.from('team_members').select('*').order('sort_order');
    if (!data || !data.length) return;
    await loadSectionHeader('team', 'teamHeader');
    const grid = document.getElementById('teamGrid');
    if (!grid) return;
    const founderMembers = data.filter((member) => /founder/i.test(member.role || ''));
    const nonFounderMembers = data.filter((member) => !/founder/i.test(member.role || ''));
    const rows = [];

    if (founderMembers.length > 0) {
      rows.push({ className: 'team-row team-row-founders', tier: 'founder', members: founderMembers });
    }

    const rowSizes = [3, 4];
    let cursor = 0;
    let rowIndex = 0;
    while (cursor < nonFounderMembers.length) {
      const size = rowSizes[Math.min(rowIndex, rowSizes.length - 1)];
      const members = nonFounderMembers.slice(cursor, cursor + size);
      rows.push({
        className: `team-row team-row-depth-${rowIndex + 1}`,
        tier: rowIndex === 0 ? 'lead' : 'member',
        members,
      });
      cursor += size;
      rowIndex += 1;
    }

    grid.innerHTML = `
      <div class="team-pyramid">
        ${rows.map((row, rowNumber) => `
          <div class="${row.className} team-row-size-${row.members.length}" data-row="${rowNumber + 1}">
            ${row.members.map((member, memberIndex) => renderTeamCard(member, row.tier, rowNumber, memberIndex)).join('')}
          </div>
        `).join('')}
      </div>
    `;
    initTeamInteractions();
    showSection('about');
  } catch {}
}

function renderTeamCard(member, tier, rowIndex, memberIndex) {
  const safeName = escapeHtml(member.name || 'Team Member');
  const safeRole = escapeHtml(member.role || '');
  const safeBio = escapeHtml(member.bio || 'Profile details coming soon.');
  const avatar = member.avatar_url
    ? `<img src="${escapeHtml(member.avatar_url)}" alt="${safeName}" loading="lazy">`
    : `<span class="team-avatar-placeholder">${safeName.charAt(0).toUpperCase()}</span>`;
  const cardId = `team-card-${rowIndex}-${memberIndex}`;

  return `
    <article class="team-card team-card-${tier} reveal" tabindex="0" role="button" aria-expanded="false" aria-controls="${cardId}">
      <div class="team-card-shell">
        <div class="team-card-summary">
          <span class="team-tier">${tier === 'founder' ? 'Founder' : tier === 'lead' ? 'Leadership' : 'Team'}</span>
          <div class="team-avatar">${avatar}</div>
          <h4>${safeName}</h4>
          <p class="team-role">${safeRole}</p>
        </div>
        <div class="team-card-details" id="${cardId}">
          <p class="team-bio">${safeBio}</p>
        </div>
        <span class="team-card-toggle">Click to ${member.bio ? 'read more' : 'view profile'}</span>
      </div>
    </article>
  `;
}

function initTeamInteractions() {
  const cards = document.querySelectorAll('.team-card');
  cards.forEach((card) => {
    if (card.dataset.bound === 'true') return;
    card.dataset.bound = 'true';

    const details = card.querySelector('.team-card-details');
    const toggleCard = () => {
      const nextState = !card.classList.contains('active');
      cards.forEach((otherCard) => {
        if (otherCard === card) return;
        otherCard.classList.remove('active');
        otherCard.setAttribute('aria-expanded', 'false');
        const otherDetails = otherCard.querySelector('.team-card-details');
        if (otherDetails) otherDetails.style.maxHeight = '0px';
      });

      card.classList.toggle('active', nextState);
      card.setAttribute('aria-expanded', String(nextState));
      if (details) {
        details.style.maxHeight = nextState ? `${details.scrollHeight}px` : '0px';
      }
    };

    card.addEventListener('click', toggleCard);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleCard();
      }
    });
  });
}

// --- Section Header Loader ---
// Loads section_headers from DB and applies tag, title, subtitle to the page
async function loadSectionHeader(sectionKey, containerId) {
  try {
    const { data } = await sb.from('section_headers').select('*').eq('section_key', sectionKey).single();
    if (!data) return;
    const container = document.getElementById(containerId);
    if (!container) return;
    const tagEl = container.querySelector('.section-tag');
    const titleEl = container.querySelector('h2');
    const subtitleEl = container.querySelector('p');
    // Always apply values (even empty strings) so admin changes sync immediately
    if (tagEl && data.tag_text !== null && data.tag_text !== undefined) tagEl.textContent = data.tag_text;
    if (titleEl && data.title !== null && data.title !== undefined) titleEl.textContent = data.title;
    if (subtitleEl && data.subtitle !== null && data.subtitle !== undefined) subtitleEl.textContent = data.subtitle;
  } catch {}
}

// --- Contact Info (reachout page) ---
// Loads email, phone, location from site_settings.brand into reachout page
async function loadContactInfo() {
  try {
    const { data } = await sb.from('site_settings').select('*').eq('key', 'brand').single();
    if (!data) return;
    const brand = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;

    // Update email link
    if (brand.email) {
      const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
      emailLinks.forEach(el => {
        el.href = `mailto:${brand.email}`;
        el.textContent = brand.email;
      });
    }
    // Update phone link
    if (brand.phone) {
      const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
      phoneLinks.forEach(el => {
        el.href = `tel:${brand.phone.replace(/\s/g, '')}`;
        el.textContent = brand.phone;
      });
    }
    // Update location
    if (brand.location) {
      const locationEls = document.querySelectorAll('.reachout-detail');
      locationEls.forEach(detail => {
        const h4 = detail.querySelector('h4');
        if (h4 && h4.textContent.trim() === 'Visit Us') {
          const p = detail.querySelector('p');
          if (p) p.textContent = brand.location;
        }
      });
    }
  } catch {}
}

// --- Form Config (reachout page dropdowns) ---
// Loads project types and budget ranges from site_settings.contact_form
async function loadFormConfig() {
  try {
    const { data } = await sb.from('site_settings').select('*').eq('key', 'contact_form').single();
    if (!data) return;
    const config = typeof data.value === 'string' ? JSON.parse(data.value) : data.value;

    // Project types dropdown
    if (config.project_types && config.project_types.length > 0) {
      const sel = document.getElementById('roProject');
      if (sel) {
        sel.innerHTML = '<option value="" disabled selected>Select type</option>' +
          config.project_types.map(t => `<option value="${t}">${t}</option>`).join('');
      }
    }
    // Budget ranges dropdown
    if (config.budget_ranges && config.budget_ranges.length > 0) {
      const sel = document.getElementById('roBudget');
      if (sel) {
        sel.innerHTML = '<option value="">Select budget (optional)</option>' +
          config.budget_ranges.map(b => `<option value="${b}">${b}</option>`).join('');
      }
    }
  } catch {}
}

// =============================================================
// Helpers
// =============================================================
function setTextIfExists(id, text) {
  if (text === null || text === undefined) return;
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function showSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.style.display = '';
    // Re-bind intersection observer for dynamically loaded cards
    requestAnimationFrame(() => {
      if (typeof observeRevealElements === 'function') {
        observeRevealElements();
      }
    });
  }
}
