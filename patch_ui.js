const fs = require('fs');
const path = require('path');

const files = ['index.html', 'services.html', 'about.html', 'portfolio.html', 'reachout.html', 'privacy.html'];

const sunSvg = `<svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
const moonSvg = `<svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
const backToTopSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>`;
const heartSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="var(--pink-primary)" stroke="var(--pink-primary)" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;

const newFooter = `  <footer class="footer" id="footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a href="/" class="logo"><span class="logo-icon">P</span>PinkLabs</a>
          <p>We craft premium digital experiences that elevate brands and drive business growth through innovative technology.</p>
          <div class="social-links" id="footerSocials">
            <a href="#" class="social-link" aria-label="Twitter"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg></a>
            <a href="#" class="social-link" aria-label="LinkedIn"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg></a>
            <a href="#" class="social-link" aria-label="GitHub"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg></a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Services</h4>
          <a href="services.html">Web Development</a>
          <a href="services.html">App Development</a>
          <a href="services.html">UI/UX Design</a>
          <a href="services.html">Digital Strategy</a>
        </div>
        <div class="footer-col">
          <h4>Company</h4>
          <a href="portfolio.html">Portfolio</a>
          <a href="/#pricing">Pricing</a>
          <a href="about.html">About</a>
          <a href="reachout.html">Contact</a>
        </div>
        <div class="footer-col">
          <h4>Legal</h4>
          <a href="privacy.html">Privacy Policy</a>
        </div>
      </div>
      <div class="footer-bottom">
        <p id="footerCopyright">&copy; 2026 PinkLabs. All rights reserved.</p>
        <p>Built with ${heartSvg} by PinkLabs</p>
      </div>
    </div>
  </footer>`;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Revert Theme Toggles
  content = content.replace(/<i data-lucide="sun" class="icon-sun"><\/i>/g, sunSvg);
  content = content.replace(/<i data-lucide="moon" class="icon-moon"><\/i>/g, moonSvg);
  
  // Revert Back To Top
  content = content.replace(/<i data-lucide="chevron-up"><\/i>/g, backToTopSvg);
  
  // Clean up section-tags that got lucide icons artificially
  content = content.replace(/<span class="section-tag"><i data-lucide="[^"]+" class="lucide-sm"><\/i>\s*(.*?)<\/span>/g, '<span class="section-tag">$1</span>');
  
  // Replace the entire footer block
  content = content.replace(/<footer class="footer" id="footer">[\s\S]*?<\/footer>/g, newFooter);
  
  fs.writeFileSync(file, content);
});

// For about.html specifically restore the 4 value SVGs
let about = fs.readFileSync('about.html', 'utf8');
const svg1 = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-pink)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const svg2 = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-pink)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`;
const svg3 = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-pink)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
const svg4 = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent-pink)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`;

about = about.replace(/<div class="value-icon"><i data-lucide="star"[^>]*><\/i><\/div>/g, `<div class="value-icon">\n              ${svg1}\n            </div>`);
about = about.replace(/<div class="value-icon"><i data-lucide="users"[^>]*><\/i><\/div>/g, `<div class="value-icon">\n              ${svg2}\n            </div>`);
about = about.replace(/<div class="value-icon"><i data-lucide="globe"[^>]*><\/i><\/div>/g, `<div class="value-icon">\n              ${svg3}\n            </div>`);
about = about.replace(/<div class="value-icon"><i data-lucide="check-circle"[^>]*><\/i><\/div>/g, `<div class="value-icon">\n              ${svg4}\n            </div>`);

fs.writeFileSync('about.html', about);

console.log('Restored all SVGs and upgraded the footer!');
