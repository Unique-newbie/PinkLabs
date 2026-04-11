// =============================================================
// PinkLabs — Dynamic Public Site Script
// Dark mode, expandable project cards, animated counters
// =============================================================

const SUPABASE_URL = (typeof PINKLABS_CONFIG !== 'undefined') ? PINKLABS_CONFIG.SUPABASE_URL : 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = (typeof PINKLABS_CONFIG !== 'undefined') ? PINKLABS_CONFIG.SUPABASE_ANON_KEY : 'YOUR_SUPABASE_ANON_KEY';

let sb = null;

// =============================================================
// Init
// =============================================================
document.addEventListener('DOMContentLoaded', async () => {
  if (typeof supabase !== 'undefined' && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
    sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  initPreloader();
  initTheme();
  initNavbar();
  initMobileMenu();
  initSmoothScroll();
  initBackToTop();
  initCookieConsent();

  // Load from Supabase if configured
  if (sb) {
    await loadAllContent();
  }

  initScrollReveal();
  initScrollSpy();
  initAnimatedCounters();
  initTestimonialCarousel();
  initContactForm();
  initProjectModal();
  initLazyLoading();
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
    }, 600);
  });
  // Fallback: always hide after 3s
  setTimeout(() => {
    preloader.classList.add('hidden');
  }, 3000);
}

// =============================================================
// Navbar Scroll
// =============================================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// =============================================================
// Mobile Menu
// =============================================================
function initMobileMenu() {
  const toggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const open = toggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navLinks.addEventListener('click', (e) => {
    if (e.target.matches('a')) {
      toggle.classList.remove('active');
      navLinks.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// =============================================================
// Smooth Scroll
// =============================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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

  const onScroll = () => btn.classList.toggle('visible', window.scrollY > 500);
  window.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// =============================================================
// Cookie Consent
// =============================================================
function initCookieConsent() {
  const el = document.getElementById('cookieConsent');
  const accept = document.getElementById('cookieAccept');
  const decline = document.getElementById('cookieDecline');
  if (!el) return;

  if (localStorage.getItem('pinklabs-cookies')) return;

  setTimeout(() => el.classList.add('visible'), 2500);

  const dismiss = (val) => {
    localStorage.setItem('pinklabs-cookies', val);
    el.classList.remove('visible');
    setTimeout(() => el.remove(), 500);
  };
  if (accept) accept.addEventListener('click', () => dismiss('accepted'));
  if (decline) decline.addEventListener('click', () => dismiss('declined'));
}

// =============================================================
// Scroll Reveal
// =============================================================
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}

// =============================================================
// Scroll Spy
// =============================================================
function initScrollSpy() {
  const sections = document.querySelectorAll('.section');
  const links = document.querySelectorAll('.nav-link[href^="#"]');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(s => observer.observe(s));
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
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const suffix = el.querySelector('.pink');
  const suffixText = suffix ? suffix.textContent : '';
  const duration = 2000;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current;
    if (suffix) {
      const span = document.createElement('span');
      span.className = 'pink';
      span.textContent = suffixText;
      el.appendChild(span);
    }
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// =============================================================
// Testimonial Carousel
// =============================================================
function initTestimonialCarousel() {
  const track = document.getElementById('testimonialTrack');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  const dotsContainer = document.getElementById('testimonialDots');
  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.testimonial-card');
  if (!cards.length) return;

  let page = 0;
  let perView = getPerView();

  function getPerView() {
    if (window.innerWidth <= 768) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function totalPages() {
    return Math.max(1, Math.ceil(cards.length / perView));
  }

  function goTo(p) {
    page = Math.max(0, Math.min(p, totalPages() - 1));
    const cardW = cards[0].offsetWidth + 28; // card width + gap
    track.style.transform = `translateX(-${page * perView * cardW}px)`;
    updateDots();
  }

  function updateDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const total = totalPages();
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('div');
      dot.className = `dot${i === page ? ' active' : ''}`;
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  prevBtn.addEventListener('click', () => goTo(page - 1));
  nextBtn.addEventListener('click', () => goTo(page + 1));

  window.addEventListener('resize', () => {
    perView = getPerView();
    goTo(0);
  });

  updateDots();
}

// =============================================================
// FAQ Toggle
// =============================================================
function toggleFaq(btn) {
  const item = btn.parentElement;
  const wasActive = item.classList.contains('active');
  // Close all
  document.querySelectorAll('.faq-item').forEach(i => {
    i.classList.remove('active');
    const ans = i.querySelector('.faq-answer');
    if (ans) ans.style.maxHeight = null;
    const q = i.querySelector('.faq-question');
    if (q) q.setAttribute('aria-expanded', 'false');
  });
  // Open clicked (if wasn't already open)
  if (!wasActive) {
    item.classList.add('active');
    const answer = item.querySelector('.faq-answer');
    if (answer) answer.style.maxHeight = answer.scrollHeight + 'px';
    btn.setAttribute('aria-expanded', 'true');
  }
}

// =============================================================
// Project Modal — Rich Expandable View
// =============================================================
function initProjectModal() {
  const modal = document.getElementById('projectModal');
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');
  if (!modal) return;

  // Click handler for work cards
  document.addEventListener('click', (e) => {
    const card = e.target.closest('.work-card');
    if (!card) return;
    openProjectModal(card);
  });

  // Close
  if (overlay) overlay.addEventListener('click', closeProjectModal);
  if (closeBtn) closeBtn.addEventListener('click', closeProjectModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeProjectModal(); });
}

function openProjectModal(card) {
  const modal = document.getElementById('projectModal');
  if (!modal) return;

  // Extract data from card
  const img = card.querySelector('.work-card-img img');
  const tag = card.querySelector('.work-card-tag');
  const title = card.querySelector('h3');
  const desc = card.getAttribute('data-details') || card.querySelector('p')?.textContent || '';
  const tech = card.getAttribute('data-tech') || '';
  const liveUrl = card.getAttribute('data-live') || '';
  const githubUrl = card.getAttribute('data-github') || '';
  const gallery = card.getAttribute('data-gallery') || '';

  // Fill modal
  const modalImg = document.getElementById('modalImage');
  const modalTag = document.getElementById('modalTag');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');

  if (modalImg && img) { modalImg.src = img.src; modalImg.alt = img.alt; }
  if (modalTag && tag) modalTag.textContent = tag.textContent;
  if (modalTitle && title) modalTitle.textContent = title.textContent;
  if (modalDesc) modalDesc.textContent = desc;

  // Tech stack
  const techContainer = document.getElementById('modalTech');
  const techSection = document.getElementById('modalTechSection');
  if (techContainer && techSection) {
    techContainer.innerHTML = '';
    if (tech) {
      const techs = tech.split(',').map(t => t.trim()).filter(Boolean);
      techs.forEach(t => {
        const span = document.createElement('span');
        span.className = 'modal-tech-tag';
        span.textContent = t;
        techContainer.appendChild(span);
      });
      techSection.style.display = 'block';
    } else {
      techSection.style.display = 'none';
    }
  }

  // Links
  const linksContainer = document.getElementById('modalLinks');
  const linksSection = document.getElementById('modalLinksSection');
  if (linksContainer && linksSection) {
    linksContainer.innerHTML = '';
    let hasLinks = false;
    if (liveUrl) {
      hasLinks = true;
      linksContainer.innerHTML += `<a href="${liveUrl}" target="_blank" rel="noopener" class="modal-link"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg> Live Site</a>`;
    }
    if (githubUrl) {
      hasLinks = true;
      linksContainer.innerHTML += `<a href="${githubUrl}" target="_blank" rel="noopener" class="modal-link"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg> GitHub</a>`;
    }
    linksSection.style.display = hasLinks ? 'block' : 'none';
  }

  // Gallery
  const galleryContainer = document.getElementById('modalGallery');
  const gallerySection = document.getElementById('modalGallerySection');
  if (galleryContainer && gallerySection) {
    galleryContainer.innerHTML = '';
    if (gallery) {
      const imgs = gallery.split(',').map(u => u.trim()).filter(Boolean);
      imgs.forEach(url => {
        const imgEl = document.createElement('img');
        imgEl.src = url;
        imgEl.alt = 'Project screenshot';
        imgEl.loading = 'lazy';
        galleryContainer.appendChild(imgEl);
      });
      gallerySection.style.display = 'block';
    } else {
      gallerySection.style.display = 'none';
    }
  }

  // Open
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const modal = document.getElementById('projectModal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

// =============================================================
// Contact Form
// =============================================================
function initContactForm() {
  const form = document.querySelector('.contact form, #contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    showToast('success', 'Message sent! We\'ll get back to you within 24 hours.');
    form.reset();
  });
}

// =============================================================
// Toast
// =============================================================
function showToast(type, message) {
  const toast = document.getElementById('toast');
  const msg = document.getElementById('toastMessage');
  if (!toast || !msg) return;
  toast.className = 'toast';
  msg.textContent = message;
  toast.classList.add(type, 'visible');
  setTimeout(() => toast.classList.remove('visible'), 4500);
}

// =============================================================
// Lazy Loading
// =============================================================
function initLazyLoading() {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '100px' });

    document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
  }
}

// =============================================================
// Content Loader — Supabase
// =============================================================
async function loadAllContent() {
  try {
    await Promise.all([
      loadSiteSettings(),
      loadNavLinks(),
      loadHero(),
      loadStats(),
      loadServices(),
      loadProcess(),
      loadPortfolio(),
      loadTestimonials(),
      loadPricing(),
      loadFAQ(),
      loadFooter(),
    ]);
  } catch (err) {
    console.warn('[PinkLabs] Content load error:', err);
  }
}

async function loadSiteSettings() {
  const { data } = await sb.from('site_settings').select('*').limit(1).single();
  if (!data) return;
  const title = data.site_name || 'PinkLabs';
  document.title = `${title} — Web Development Agency`;
  const navBrand = document.getElementById('brandNameNav');
  const footBrand = document.getElementById('brandNameFooter');
  if (navBrand) navBrand.textContent = title;
  if (footBrand) footBrand.textContent = title;
  if (data.meta_description) {
    document.querySelector('meta[name="description"]')?.setAttribute('content', data.meta_description);
  }
}

async function loadNavLinks() {
  const { data } = await sb.from('nav_links').select('*').order('sort_order');
  if (!data || !data.length) return;
  const nav = document.getElementById('navLinks');
  if (!nav) return;
  nav.innerHTML = '';
  data.forEach(link => {
    const a = document.createElement('a');
    a.href = link.url;
    a.textContent = link.label;
    a.className = link.is_cta ? 'nav-cta' : 'nav-link';
    if (link.open_new_tab) a.target = '_blank';
    nav.appendChild(a);
  });
}

async function loadHero() {
  const { data } = await sb.from('hero').select('*').limit(1).single();
  if (!data) return;
  if (data.title) setTextIfExists('heroTitle', data.title);
  if (data.subtitle) setTextIfExists('heroDesc', data.subtitle);
  if (data.badge_text) setTextIfExists('heroBadgeText', data.badge_text);
  if (data.image_url) {
    const img = document.getElementById('heroImage');
    const wrapper = document.getElementById('heroImageWrapper');
    if (img) img.src = data.image_url;
    if (wrapper) wrapper.style.display = '';
  }
  // Show floating cards if hero card data exists
  const card1 = document.getElementById('heroCard1');
  const card2 = document.getElementById('heroCard2');
  if (card1 && data.card1_label) { card1.style.display = ''; setTextIfExists('heroCard1Label', data.card1_label); setTextIfExists('heroCard1Value', data.card1_value); }
  if (card2 && data.card2_label) { card2.style.display = ''; setTextIfExists('heroCard2Label', data.card2_label); setTextIfExists('heroCard2Value', data.card2_value); }
}

async function loadStats() {
  const { data } = await sb.from('stats').select('*').order('sort_order');
  if (!data || !data.length) return;
  const grid = document.getElementById('statsGrid');
  if (!grid) return;
  grid.innerHTML = '';
  data.forEach(stat => {
    const item = document.createElement('div');
    item.className = 'stat-item';
    item.innerHTML = `<span class="stat-number" data-count="${stat.count_value}">${stat.count_value}<span class="pink">${stat.suffix || ''}</span></span><span class="stat-label">${stat.label}</span>`;
    grid.appendChild(item);
  });
  showSection('statsBar');
}

async function loadServices() {
  const { data } = await sb.from('services').select('*').order('sort_order');
  if (!data || !data.length) return;
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;
  grid.innerHTML = '';
  data.forEach(svc => {
    const card = document.createElement('div');
    card.className = 'service-card reveal';
    card.innerHTML = `
      <div class="service-icon">${svc.icon || ''}</div>
      <h3>${svc.title}</h3>
      <p>${svc.description}</p>
    `;
    grid.appendChild(card);
  });
  showSection('services');
}

async function loadProcess() {
  const { data } = await sb.from('process_steps').select('*').order('sort_order');
  if (!data || !data.length) return;
  const timeline = document.getElementById('processTimeline');
  if (!timeline) return;
  timeline.innerHTML = '';
  data.forEach((step, i) => {
    const el = document.createElement('div');
    el.className = 'process-step reveal';
    el.innerHTML = `
      <div class="process-icon">${step.icon || ''}</div>
      <span class="process-number">${String(i + 1).padStart(2, '0')}</span>
      <h3>${step.title}</h3>
      <p>${step.description}</p>
    `;
    timeline.appendChild(el);
  });
  showSection('process');
}

async function loadPortfolio() {
  const { data } = await sb.from('portfolio').select('*').order('sort_order');
  if (!data || !data.length) return;
  const grid = document.getElementById('workGrid');
  if (!grid) return;
  grid.innerHTML = '';
  data.forEach(project => {
    const card = document.createElement('div');
    card.className = 'work-card reveal';
    if (project.tech_stack) card.setAttribute('data-tech', project.tech_stack);
    if (project.live_url) card.setAttribute('data-live', project.live_url);
    if (project.github_url) card.setAttribute('data-github', project.github_url);
    if (project.details) card.setAttribute('data-details', project.details);
    if (project.gallery_urls) card.setAttribute('data-gallery', project.gallery_urls);
    card.innerHTML = `
      <div class="work-card-img"><img src="${project.image_url || ''}" alt="${project.title}" loading="lazy"></div>
      <div class="work-card-body">
        <span class="work-card-tag">${project.category || ''}</span>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        <span class="work-card-expand">View Details <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
      </div>
    `;
    grid.appendChild(card);
  });
  showSection('work');
}

async function loadTestimonials() {
  const { data } = await sb.from('testimonials').select('*').order('sort_order');
  if (!data || !data.length) return;
  const track = document.getElementById('testimonialTrack');
  if (!track) return;
  track.innerHTML = '';
  const starSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="#FFBF00" stroke="#FFBF00" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
  data.forEach(t => {
    const card = document.createElement('div');
    card.className = 'testimonial-card';
    const initials = (t.name || '').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
    card.innerHTML = `
      <div class="testimonial-stars">${starSvg.repeat(t.rating || 5)}</div>
      <p class="testimonial-quote">"${t.quote}"</p>
      <div class="testimonial-author">
        <div class="testimonial-avatar">${initials}</div>
        <div><div class="testimonial-name">${t.name}</div><div class="testimonial-role">${t.role || ''}</div></div>
      </div>
    `;
    track.appendChild(card);
  });
  showSection('testimonials');
}

async function loadPricing() {
  const { data } = await sb.from('pricing').select('*').order('sort_order');
  if (!data || !data.length) return;
  const grid = document.getElementById('pricingGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const checkSvg = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--pink-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  data.forEach(plan => {
    const card = document.createElement('div');
    card.className = `pricing-card reveal${plan.is_popular ? ' popular' : ''}`;
    const features = (plan.features || '').split('\n').filter(Boolean).map(f => `<li>${checkSvg} ${f.trim()}</li>`).join('');
    card.innerHTML = `
      ${plan.is_popular ? '<span class="popular-badge">Most Popular</span>' : ''}
      <h3>${plan.name}</h3>
      <p class="pricing-desc">${plan.description || ''}</p>
      <div class="pricing-price"><span class="currency">${plan.currency || '₹'}</span><span class="amount">${plan.price}</span><span class="period">${plan.period || ''}</span></div>
      <ul class="pricing-features">${features}</ul>
      <a href="${plan.cta_url || 'reachout.html'}" class="btn-primary pricing-btn">${plan.cta_text || 'Get Started'}</a>
    `;
    grid.appendChild(card);
  });
  showSection('pricing');
}

async function loadFAQ() {
  const { data } = await sb.from('faq').select('*').order('sort_order');
  if (!data || !data.length) return;
  const list = document.getElementById('faqList');
  if (!list) return;
  list.innerHTML = '';
  data.forEach(faq => {
    const item = document.createElement('div');
    item.className = 'faq-item';
    item.innerHTML = `
      <button class="faq-question" onclick="toggleFaq(this)" aria-expanded="false">
        ${faq.question}
        <span class="faq-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span>
      </button>
      <div class="faq-answer"><p>${faq.answer}</p></div>
    `;
    list.appendChild(item);
  });
  showSection('faq');
}

async function loadFooter() {
  try {
    const { data } = await sb.from('site_settings').select('*').limit(1).single();
    if (!data) return;
    if (data.footer_description) setTextIfExists('footerDesc', data.footer_description);
    if (data.copyright_text) setTextIfExists('footerCopyright', data.copyright_text);
  } catch {}
}

// =============================================================
// Helpers
// =============================================================
function setTextIfExists(id, text) {
  if (!text) return;
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function showSection(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = '';
}
