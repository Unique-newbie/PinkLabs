// =============================================================
// PinkLabs Admin Panel — Full CMS Logic
// =============================================================

// --- Config ---
const SUPABASE_URL = (typeof PINKLABS_CONFIG !== 'undefined') ? PINKLABS_CONFIG.SUPABASE_URL : 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = (typeof PINKLABS_CONFIG !== 'undefined') ? PINKLABS_CONFIG.SUPABASE_ANON_KEY : 'YOUR_SUPABASE_ANON_KEY';

let sb = null;
let currentUser = null;
let currentSection = 'dashboard';

// =============================================================
// Init
// =============================================================
document.addEventListener('DOMContentLoaded', () => {
  if (typeof supabase !== 'undefined' && SUPABASE_URL !== 'YOUR_SUPABASE_URL') {
    sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        fetch: (fetchUrl, options) => fetch(fetchUrl, { ...options, cache: 'no-store' })
      }
    });
    checkAuth();
  } else {
    console.warn('Supabase not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY in admin.js');
    showToast('Configure Supabase credentials in admin.js', 'error');
  }
  bindLoginForm();
  bindSidebar();
  bindLogout();
  bindSidebarToggle();
});

// =============================================================
// Auth
// =============================================================
async function checkAuth() {
  const { data: { session } } = await sb.auth.getSession();
  if (session) {
    currentUser = session.user;
    showDashboard();
  }
}

function bindLoginForm() {
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!sb) { showLoginError('Supabase not configured.'); return; }
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const btn = document.getElementById('loginBtn');
    btn.disabled = true;
    btn.querySelector('.login-btn-text').style.display = 'none';
    btn.querySelector('.login-btn-loading').style.display = 'flex';
    showLoginError('');

    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    btn.disabled = false;
    btn.querySelector('.login-btn-text').style.display = 'flex';
    btn.querySelector('.login-btn-loading').style.display = 'none';

    if (error) { showLoginError(error.message); return; }
    currentUser = data.user;
    showDashboard();
  });
}

function showLoginError(msg) {
  document.getElementById('loginError').textContent = msg;
}

function showDashboard() {
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('adminDashboard').style.display = 'flex';
  document.getElementById('userEmail').textContent = currentUser.email;
  // Populate sidebar user info
  const emailSidebar = document.getElementById('userEmailSidebar');
  const nameSidebar = document.getElementById('userNameSidebar');
  const avatarSidebar = document.getElementById('userAvatarSidebar');
  if (emailSidebar) emailSidebar.textContent = currentUser.email;
  if (nameSidebar) nameSidebar.textContent = currentUser.email.split('@')[0];
  if (avatarSidebar) avatarSidebar.textContent = currentUser.email.charAt(0).toUpperCase();
  loadSection('dashboard');
}

function bindLogout() {
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    if (sb) await sb.auth.signOut();
    currentUser = null;
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
  });
}

function bindSidebarToggle() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');
  document.getElementById('sidebarToggle').addEventListener('click', () => {
    sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('active');
  });
  // Close button inside sidebar (mobile)
  const closeBtn = document.getElementById('sidebarClose');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
    });
  }
  // Overlay click closes sidebar
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('active');
    });
  }
}

// =============================================================
// Sidebar Navigation
// =============================================================
function bindSidebar() {
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      document.getElementById('sidebar').classList.remove('open');
      const overlay = document.getElementById('sidebarOverlay');
      if (overlay) overlay.classList.remove('active');
      loadSection(section);
    });
  });
}

// =============================================================
// Section Router
// =============================================================
async function loadSection(section) {
  currentSection = section;
  const area = document.getElementById('contentArea');
  const titleMap = {
    dashboard: 'Dashboard', hero: 'Hero Section', brands: 'Trusted Brands', services: 'Services', process: 'Process Steps',
    portfolio: 'Portfolio Projects', testimonials: 'Testimonials', team: 'Team Members',
    about: 'About Section', pricing: 'Pricing Plans', faq: 'FAQ', 'contact-info': 'Contact & Social',
    submissions: 'Submissions', settings: 'Site Settings', navbar: 'Navigation'
  };
  document.getElementById('topbarTitle').textContent = titleMap[section] || section;

  area.innerHTML = '<div style="text-align:center;padding:60px;color:var(--admin-text-dim)">Loading...</div>';

  try {
    switch (section) {
      case 'dashboard': await renderDashboard(area); break;
      case 'hero': await renderHeroEditor(area); break;
      case 'brands': await renderCrudList(area, 'trust_logos', ['name', 'sort_order']); break;
      case 'services': await renderCrudList(area, 'services', ['title', 'description', 'icon_svg']); break;
      case 'process': await renderCrudList(area, 'process_steps', ['step_number', 'title', 'description', 'icon_svg']); break;
      case 'portfolio': await renderCrudList(area, 'projects', ['title', 'description', 'tag', 'image_url', 'project_url', 'is_featured']); break;
      case 'testimonials': await renderCrudList(area, 'testimonials', ['client_name', 'client_role', 'client_company', 'client_initials', 'quote', 'rating']); break;
      case 'team': await renderCrudList(area, 'team_members', ['name', 'role', 'bio', 'avatar_url']); break;
      case 'about': await renderAboutEditor(area); break;
      case 'pricing': await renderPricingEditor(area); break;
      case 'faq': await renderCrudList(area, 'faq_items', ['question', 'answer']); break;
      case 'contact-info': await renderContactInfoEditor(area); break;
      case 'submissions': await renderSubmissions(area); break;
      case 'settings': await renderSettings(area); break;
      case 'navbar': await renderCrudList(area, 'nav_links', ['label', 'href', 'is_cta']); break;
    }
  } catch (err) {
    console.error(err);
    area.innerHTML = `<div class="empty-state"><p>Error loading section: ${err.message}</p></div>`;
  }
}

// =============================================================
// Dashboard Overview
// =============================================================
async function renderDashboard(area) {
  const counts = await Promise.all([
    sb.from('services').select('id', { count: 'exact', head: true }),
    sb.from('projects').select('id', { count: 'exact', head: true }),
    sb.from('team_members').select('id', { count: 'exact', head: true }),
    sb.from('testimonials').select('id', { count: 'exact', head: true }),
    sb.from('contact_submissions').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    sb.from('contact_submissions').select('id', { count: 'exact', head: true }),
  ]);

  const [services, projects, team, testimonials, newSubs, totalSubs] = counts.map(r => r.count || 0);

  if (newSubs > 0) {
    const badge = document.getElementById('submissionBadge');
    badge.textContent = newSubs;
    badge.style.display = 'inline-block';
  }

  area.innerHTML = `
    <div class="admin-grid">
      <div class="admin-stat-card"><div class="label">Services</div><div class="value pink">${services}</div></div>
      <div class="admin-stat-card"><div class="label">Projects</div><div class="value pink">${projects}</div></div>
      <div class="admin-stat-card"><div class="label">Team Members</div><div class="value pink">${team}</div></div>
      <div class="admin-stat-card"><div class="label">Testimonials</div><div class="value pink">${testimonials}</div></div>
      <div class="admin-stat-card"><div class="label">New Submissions</div><div class="value" style="color:var(--admin-blue)">${newSubs}</div></div>
      <div class="admin-stat-card"><div class="label">Total Submissions</div><div class="value">${totalSubs}</div></div>
    </div>

    <div class="section-panel">
      <div class="section-panel-header"><h3>Quick Actions</h3></div>
      <div class="section-panel-body" style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-pink" onclick="loadSectionLink('hero')">Edit Hero</button>
        <button class="btn btn-ghost" onclick="loadSectionLink('services')">Manage Services</button>
        <button class="btn btn-ghost" onclick="loadSectionLink('portfolio')">Manage Portfolio</button>
        <button class="btn btn-ghost" onclick="loadSectionLink('pricing')">Update Pricing</button>
        <button class="btn btn-ghost" onclick="loadSectionLink('submissions')">View Submissions</button>
        <button class="btn btn-ghost" onclick="loadSectionLink('settings')">Site Settings</button>
      </div>
    </div>
  `;
}

function loadSectionLink(section) {
  document.querySelectorAll('.sidebar-link').forEach(l => {
    l.classList.toggle('active', l.dataset.section === section);
  });
  loadSection(section);
}

// =============================================================
// Hero Editor
// =============================================================
async function renderHeroEditor(area) {
  const { data } = await sb.from('hero_content').select('*').order('updated_at', { ascending: false }).limit(1).single();
  const hero = data || {};

  area.innerHTML = `
    <div class="section-panel">
      <div class="section-panel-header"><h3>Hero Content</h3></div>
      <div class="section-panel-body" id="heroForm">
        <div class="field"><label>Badge Text <span class="hint">(small label above the title — e.g. "Available for Projects")</span></label><input type="text" id="heroBadge" value="${esc(hero.badge_text)}"></div>
        <div class="field-row">
          <div class="field"><label>Title Line 1 <span class="hint">(main heading text)</span></label><input type="text" id="heroTitle1" value="${esc(hero.title_line1)}"></div>
          <div class="field"><label>Title Highlight <span class="hint">(pink colored text on 2nd line)</span></label><input type="text" id="heroHighlight" value="${esc(hero.title_highlight)}"></div>
        </div>
        <div class="field"><label>Description <span class="hint">(paragraph below the title)</span></label><textarea id="heroDesc">${esc(hero.description)}</textarea></div>
        <div class="field-row">
          <div class="field"><label>Primary Button Text</label><input type="text" id="heroBtnPrimary" value="${esc(hero.btn_primary_text)}"></div>
          <div class="field"><label>Primary Button Link</label><input type="text" id="heroBtnPrimaryLink" value="${esc(hero.btn_primary_link)}"></div>
        </div>
        <div class="field-row">
          <div class="field"><label>Secondary Button Text</label><input type="text" id="heroBtnSecondary" value="${esc(hero.btn_secondary_text)}"></div>
          <div class="field"><label>Secondary Button Link</label><input type="text" id="heroBtnSecondaryLink" value="${esc(hero.btn_secondary_link)}"></div>
        </div>
        <div class="field">
          <label>Hero Image <span class="hint">(displayed on the right side of the hero — paste URL or upload)</span></label>
          <div class="image-upload-group">
            <input type="text" id="heroImage" value="${esc(hero.hero_image_url)}" placeholder="Paste URL or upload image">
            <label class="upload-btn" for="upload_hero_img">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Upload
            </label>
            <input type="file" id="upload_hero_img" accept="image/*" style="display:none" onchange="handleImageUpload(event, 'heroImage')">
          </div>
          ${hero.hero_image_url ? `<img src="${esc(hero.hero_image_url)}" class="image-preview" alt="hero preview">` : ''}
        </div>
        <div class="field-row">
          <div class="field"><label>Floating Card 1 Label <span class="hint">(small card floating on hero image)</span></label><input type="text" id="heroCard1Label" value="${esc(hero.floating_card1_label)}"></div>
          <div class="field"><label>Floating Card 1 Value</label><input type="text" id="heroCard1Value" value="${esc(hero.floating_card1_value)}"></div>
        </div>
        <div class="field-row">
          <div class="field"><label>Floating Card 2 Label</label><input type="text" id="heroCard2Label" value="${esc(hero.floating_card2_label)}"></div>
          <div class="field"><label>Floating Card 2 Value</label><input type="text" id="heroCard2Value" value="${esc(hero.floating_card2_value)}"></div>
        </div>
        <div class="btn-group" style="margin-top:16px">
          <button class="btn btn-pink" onclick="saveHero('${hero.id || ''}')">Save Changes</button>
        </div>
      </div>
    </div>

    <div class="section-panel">
      <div class="section-panel-header">
        <h3>Stats <span class="hint" style="font-weight:400">(counter bar below the hero — e.g. "100+ Projects")</span></h3>
        <button class="btn btn-pink btn-sm" onclick="openCrudModal('stats', ['number', 'suffix', 'label'], null)">+ Add Stat</button>
      </div>
      <div class="section-panel-body" id="statsContainer">Loading stats...</div>
    </div>
  `;
  loadStats();
}

async function saveHero(existingId) {
  const payload = {
    badge_text: document.getElementById('heroBadge').value,
    title_line1: document.getElementById('heroTitle1').value,
    title_highlight: document.getElementById('heroHighlight').value,
    description: document.getElementById('heroDesc').value,
    btn_primary_text: document.getElementById('heroBtnPrimary').value,
    btn_primary_link: document.getElementById('heroBtnPrimaryLink').value,
    btn_secondary_text: document.getElementById('heroBtnSecondary').value,
    btn_secondary_link: document.getElementById('heroBtnSecondaryLink').value,
    hero_image_url: document.getElementById('heroImage').value,
    floating_card1_label: document.getElementById('heroCard1Label').value,
    floating_card1_value: document.getElementById('heroCard1Value').value,
    floating_card2_label: document.getElementById('heroCard2Label').value,
    floating_card2_value: document.getElementById('heroCard2Value').value,
    is_active: true,
    updated_at: new Date().toISOString(),
  };

  let error;
  if (existingId) {
    ({ error } = await sb.from('hero_content').update(payload).eq('id', existingId));
  } else {
    ({ error } = await sb.from('hero_content').insert([payload]));
  }
  if (error) { showToast(error.message, 'error'); console.error('Hero save error:', error); return; }
  showToast('Hero saved! Changes will show on site immediately.', 'success');
}

async function loadStats() {
  const { data } = await sb.from('stats').select('*').order('sort_order');
  const container = document.getElementById('statsContainer');
  if (!data || data.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>No stats yet.</p></div>';
    return;
  }
  container.innerHTML = `<div class="items-list">${data.map(s => `
    <div class="item-row">
      <div class="item-info">
        <div class="item-title">${esc(s.number)}${esc(s.suffix)}</div>
        <div class="item-sub">${esc(s.label)}</div>
      </div>
      <div class="item-actions">
        <button class="btn btn-ghost btn-sm" onclick="openCrudModal('stats', ['number', 'suffix', 'label'], '${s.id}')">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteRow('stats','${s.id}')">Delete</button>
      </div>
    </div>
  `).join('')}</div>`;
}

// =============================================================
// Generic CRUD List
// =============================================================
async function renderCrudList(area, table, fields) {
  const { data } = await sb.from(table).select('*').order('sort_order');
  const items = data || [];

  const headerInfo = await sb.from('section_headers').select('*').eq('section_key', getSectionKey(table)).single();
  const header = headerInfo.data || {};

  const prettyName = table.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  area.innerHTML = `
    <div class="section-panel">
      <div class="section-panel-header">
        <h3>Section Header <span class="hint" style="font-weight:400">(appears above the content on the page)</span></h3>
      </div>
      <div class="section-panel-body">
        <div class="field-row">
          <div class="field"><label>Tag Text <span class="hint">(small pink label — e.g. "What We Do")</span></label><input type="text" id="sh_tag" value="${esc(header.tag_text)}"></div>
          <div class="field"><label>Title <span class="hint">(main heading — e.g. "Our Services")</span></label><input type="text" id="sh_title" value="${esc(header.title)}"></div>
        </div>
        <div class="field"><label>Subtitle <span class="hint">(description below the heading)</span></label><input type="text" id="sh_subtitle" value="${esc(header.subtitle)}"></div>
        <button class="btn btn-pink btn-sm" style="margin-top:8px" onclick="saveSectionHeader('${getSectionKey(table)}', '${header.id || ''}')">Save Header</button>
      </div>
    </div>

    <div class="section-panel">
      <div class="section-panel-header">
        <h3>${prettyName}</h3>
        <button class="btn btn-pink btn-sm" onclick="openCrudModal('${table}', ${JSON.stringify(fields).replace(/"/g, "'")}, null)">+ Add New</button>
      </div>
      <div class="section-panel-body" id="crudListBody">
        ${items.length === 0 ? '<div class="empty-state"><p>No items yet. Click "+ Add New" to get started.</p></div>' : ''}
        <div class="items-list">
          ${items.map(item => `
            <div class="item-row">
              ${item.image_url ? `<img class="item-img" src="${esc(item.image_url)}" alt="">` : ''}
              ${item.avatar_url ? `<img class="item-img" src="${esc(item.avatar_url)}" alt="" style="border-radius:50%">` : ''}
              <div class="item-info">
                <div class="item-title">${esc(item[fields[0]] || '')}</div>
                <div class="item-sub">${esc(item[fields[1]] || '').substring(0, 80)}</div>
              </div>
              <div class="item-actions">
                <button class="btn btn-ghost btn-sm" onclick="openCrudModal('${table}', ${JSON.stringify(fields).replace(/"/g, "'")}, '${item.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteRow('${table}', '${item.id}')">Delete</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function getSectionKey(table) {
  const map = {
    services: 'services', process_steps: 'process', projects: 'portfolio',
    testimonials: 'testimonials', team_members: 'team', pricing_plans: 'pricing',
    faq_items: 'faq', nav_links: 'navbar'
  };
  return map[table] || table;
}

async function saveSectionHeader(sectionKey, id) {
  const payload = {
    tag_text: document.getElementById('sh_tag').value,
    title: document.getElementById('sh_title').value,
    subtitle: document.getElementById('sh_subtitle').value,
    updated_at: new Date().toISOString(),
  };

  let error;
  if (id) {
    ({ error } = await sb.from('section_headers').update(payload).eq('id', id));
  } else {
    payload.section_key = sectionKey;
    ({ error } = await sb.from('section_headers').insert([payload]));
  }
  if (error) { showToast(error.message, 'error'); return; }
  showToast('Section header saved!', 'success');
}

// =============================================================
// CRUD Modal
// =============================================================
async function openCrudModal(table, fields, itemId) {
  let item = {};
  if (itemId) {
    const { data } = await sb.from(table).select('*').eq('id', itemId).single();
    item = data || {};
  }

  const fieldsArr = typeof fields === 'string' ? JSON.parse(fields.replace(/'/g, '"')) : fields;

  const isImageField = (f) => f.endsWith('_url') && (f.includes('image') || f.includes('avatar'));

  // Context-aware hints for each field so admins know what to enter
  const fieldHints = {
    icon_svg: 'Paste SVG markup for the icon — e.g. from heroicons.com or lucide.dev',
    step_number: 'Step number (e.g. "01", "02") — shown before the step title',
    tag: 'Category label shown on the portfolio card — e.g. "Web App", "E-Commerce"',
    image_url: 'Upload or paste the project thumbnail image URL',
    project_url: 'Link to the live website — visitors can click to view it',
    is_featured: 'Featured projects are highlighted on the portfolio page',
    client_name: 'Full name of the client who gave the testimonial',
    client_role: 'Job title or role — e.g. "CEO", "Marketing Director"',
    client_company: 'Company name — e.g. "Acme Corp"',
    client_initials: 'Leave empty to auto-generate from name — or enter custom (e.g. "JD")',
    quote: 'The client\'s testimonial text — keep it concise and impactful',
    rating: 'Star rating from 1 to 5 — shown as gold stars',
    avatar_url: 'Profile photo of the team member — upload or paste URL',
    bio: 'Brief bio or description — 1-2 sentences recommended',
    href: 'Link URL — e.g. "#services", "/about.html", or "https://..."',
    is_cta: 'Mark this as the highlighted Call-to-Action button in the navbar',
    platform: 'Social media platform name — e.g. "Twitter", "LinkedIn", "Instagram"',
    url: 'Full URL to the social profile — e.g. "https://twitter.com/pinklabs"',
    is_floating: 'Show as floating icon on the side of the page',
  };

  const formHtml = fieldsArr.map(f => {
    const label = f.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    const val = item[f] ?? '';
    const hint = fieldHints[f] ? ` <span class="hint">(${fieldHints[f]})</span>` : '';

    if (f === 'is_featured' || f === 'is_cta' || f === 'is_popular' || f === 'is_active' || f === 'is_floating') {
      return `<div class="field"><div class="checkbox-row"><input type="checkbox" id="modal_${f}" ${val ? 'checked' : ''}><label for="modal_${f}">${label}${hint}</label></div></div>`;
    }
    if (f === 'rating') {
      return `<div class="field"><label>${label}${hint}</label><input type="number" id="modal_${f}" value="${val}" min="1" max="5"></div>`;
    }
    if (f === 'description' || f === 'quote' || f === 'answer' || f === 'icon_svg' || f === 'bio') {
      return `<div class="field"><label>${label}${hint}</label><textarea id="modal_${f}">${esc(val)}</textarea></div>`;
    }
    if (isImageField(f)) {
      return `
        <div class="field">
          <label>${label}${hint}</label>
          <div class="image-upload-group">
            <input type="text" id="modal_${f}" value="${esc(val)}" placeholder="Paste URL or upload image">
            <label class="upload-btn" for="upload_${f}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Upload
            </label>
            <input type="file" id="upload_${f}" accept="image/*" style="display:none" onchange="handleImageUpload(event, 'modal_${f}')">
          </div>
          ${val ? `<img src="${esc(val)}" class="image-preview" alt="preview">` : ''}
        </div>`;
    }
    return `<div class="field"><label>${label}${hint}</label><input type="text" id="modal_${f}" value="${esc(val)}"></div>`;
  }).join('');

  showModal(itemId ? 'Edit Item' : 'Add New Item', formHtml, async () => {
    const payload = {};
    fieldsArr.forEach(f => {
      if (f === 'is_featured' || f === 'is_cta' || f === 'is_popular' || f === 'is_active' || f === 'is_floating') {
        payload[f] = document.getElementById(`modal_${f}`).checked;
      } else if (f === 'rating') {
        payload[f] = parseInt(document.getElementById(`modal_${f}`).value) || 5;
      } else {
        payload[f] = document.getElementById(`modal_${f}`).value;
      }
    });

    let error;
    if (itemId) {
      ({ error } = await sb.from(table).update(payload).eq('id', itemId));
    } else {
      // Auto-set sort_order
      const { count } = await sb.from(table).select('id', { count: 'exact', head: true });
      payload.sort_order = (count || 0) + 1;
      ({ error } = await sb.from(table).insert([payload]));
    }
    if (error) { showToast(error.message, 'error'); return; }
    showToast('Saved!', 'success');
    closeModal();
    loadSection(currentSection);
  });
}

// =============================================================
// Image Upload to Supabase Storage
// =============================================================
async function handleImageUpload(event, targetInputId) {
  const file = event.target.files[0];
  if (!file) return;
  if (!file.type.startsWith('image/')) {
    showToast('Please select an image file', 'error');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showToast('Image must be under 5MB', 'error');
    return;
  }

  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
  const filePath = `uploads/${fileName}`;

  // Show uploading state
  const uploadBtn = event.target.previousElementSibling;
  const originalText = uploadBtn.innerHTML;
  uploadBtn.innerHTML = 'Uploading...';

  try {
    const { error: uploadError } = await sb.storage.from('media').upload(filePath, file, {
      cacheControl: '31536000',
      upsert: false,
    });

    if (uploadError) throw uploadError;

    const { data: urlData } = sb.storage.from('media').getPublicUrl(filePath);
    const publicUrl = urlData.publicUrl;

    document.getElementById(targetInputId).value = publicUrl;

    // Update preview if exists
    const previewImg = document.getElementById(targetInputId)?.closest('.field')?.querySelector('.image-preview');
    if (previewImg) {
      previewImg.src = publicUrl;
    } else {
      const field = document.getElementById(targetInputId)?.closest('.field');
      if (field) {
        const img = document.createElement('img');
        img.src = publicUrl;
        img.className = 'image-preview';
        img.alt = 'preview';
        field.appendChild(img);
      }
    }

    showToast('Image uploaded!', 'success');
  } catch (err) {
    showToast('Upload failed: ' + err.message, 'error');
  } finally {
    uploadBtn.innerHTML = originalText;
  }
}

// =============================================================
// About Section Editor
// =============================================================
async function renderAboutEditor(area) {
  const { data } = await sb.from('about').select('*').limit(1).single();
  const about = data || {};
  const stats = about.stats || [
    { value: '50+', label: 'Projects' },
    { value: '30+', label: 'Clients' },
    { value: '3+', label: 'Years' }
  ];

  area.innerHTML = `
    <div class="section-panel">
      <div class="section-panel-header"><h3>About Section Content <span class="hint" style="font-weight:400">(shown in the About section on the homepage)</span></h3></div>
      <div class="section-panel-body">
        <div class="field"><label>Title <span class="hint">(heading — e.g. "Who We Are")</span></label><input type="text" id="aboutTitle" value="${esc(about.title)}"></div>
        <div class="field"><label>Description</label><textarea id="aboutDesc" rows="4">${esc(about.description)}</textarea></div>
        <div class="section-panel-header" style="margin-top:20px;padding:0;border:0"><h3>Stats</h3></div>
        <div id="aboutStatsContainer">
          ${stats.map((s, i) => `
            <div class="field-row" data-stat-idx="${i}">
              <div class="field"><label>Value</label><input type="text" class="stat-val" value="${esc(s.value)}"></div>
              <div class="field"><label>Label</label><input type="text" class="stat-label" value="${esc(s.label)}"></div>
              <button class="btn btn-danger btn-sm" onclick="this.closest('.field-row').remove()" style="align-self:end;margin-bottom:4px">✕</button>
            </div>
          `).join('')}
        </div>
        <button class="btn btn-ghost btn-sm" onclick="addAboutStat()" style="margin-top:8px">+ Add Stat</button>
        <div class="btn-group" style="margin-top:20px">
          <button class="btn btn-pink" onclick="saveAbout('${about.id || ''}')">Save About Section</button>
        </div>
      </div>
    </div>
  `;
}

function addAboutStat() {
  const container = document.getElementById('aboutStatsContainer');
  const row = document.createElement('div');
  row.className = 'field-row';
  row.innerHTML = `
    <div class="field"><label>Value</label><input type="text" class="stat-val" value=""></div>
    <div class="field"><label>Label</label><input type="text" class="stat-label" value=""></div>
    <button class="btn btn-danger btn-sm" onclick="this.closest('.field-row').remove()" style="align-self:end;margin-bottom:4px">✕</button>
  `;
  container.appendChild(row);
}

async function saveAbout(existingId) {
  const statRows = document.querySelectorAll('#aboutStatsContainer .field-row');
  const stats = [];
  statRows.forEach(row => {
    const val = row.querySelector('.stat-val').value.trim();
    const label = row.querySelector('.stat-label').value.trim();
    if (val || label) stats.push({ value: val, label });
  });

  const payload = {
    title: document.getElementById('aboutTitle').value,
    description: document.getElementById('aboutDesc').value,
    stats,
    updated_at: new Date().toISOString(),
  };

  let error;
  if (existingId) {
    ({ error } = await sb.from('about').update(payload).eq('id', existingId));
  } else {
    ({ error } = await sb.from('about').insert([payload]));
  }
  if (error) { showToast(error.message, 'error'); return; }
  showToast('About section saved!', 'success');
  loadSection('about');
}

// =============================================================
// Pricing Editor (special due to features JSONB)
// =============================================================
async function renderPricingEditor(area) {
  const { data } = await sb.from('pricing_plans').select('*').order('sort_order');
  const items = data || [];

  const headerInfo = await sb.from('section_headers').select('*').eq('section_key', 'pricing').single();
  const header = headerInfo.data || {};

  area.innerHTML = `
    <div class="section-panel">
      <div class="section-panel-header"><h3>Section Header <span class="hint" style="font-weight:400">(heading above pricing cards)</span></h3></div>
      <div class="section-panel-body">
        <div class="field-row">
          <div class="field"><label>Tag <span class="hint">(e.g. "Pricing")</span></label><input type="text" id="sh_tag" value="${esc(header.tag_text)}"></div>
          <div class="field"><label>Title</label><input type="text" id="sh_title" value="${esc(header.title)}"></div>
        </div>
        <div class="field"><label>Subtitle</label><input type="text" id="sh_subtitle" value="${esc(header.subtitle)}"></div>
        <button class="btn btn-pink btn-sm" style="margin-top:8px" onclick="saveSectionHeader('pricing', '${header.id || ''}')">Save Header</button>
      </div>
    </div>

    <div class="section-panel">
      <div class="section-panel-header">
        <h3>Pricing Plans</h3>
        <button class="btn btn-pink btn-sm" onclick="openPricingModal(null)">+ Add Plan</button>
      </div>
      <div class="section-panel-body">
        ${items.length === 0 ? '<div class="empty-state"><p>No pricing plans yet.</p></div>' : ''}
        <div class="items-list">
          ${items.map(p => `
            <div class="item-row">
              <div class="item-info">
                <div class="item-title">${esc(p.name)} ${p.is_popular ? '<span style="color:var(--admin-pink);font-size:0.75rem">★ Popular</span>' : ''}</div>
                <div class="item-sub">${esc(p.currency)}${esc(p.price)} — ${(p.features || []).length} features</div>
              </div>
              <div class="item-actions">
                <button class="btn btn-ghost btn-sm" onclick="openPricingModal('${p.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteRow('pricing_plans','${p.id}')">Delete</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

async function openPricingModal(id) {
  let item = {};
  if (id) {
    const { data } = await sb.from('pricing_plans').select('*').eq('id', id).single();
    item = data || {};
  }
  const features = (item.features || []).join('\n');

  const formHtml = `
    <div class="field-row">
      <div class="field"><label>Plan Name</label><input type="text" id="modal_name" value="${esc(item.name)}"></div>
      <div class="field"><label>Description</label><input type="text" id="modal_description" value="${esc(item.description)}"></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Currency Symbol</label><input type="text" id="modal_currency" value="${esc(item.currency || '₹')}"></div>
      <div class="field"><label>Price</label><input type="text" id="modal_price" value="${esc(item.price)}"></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Period Label</label><input type="text" id="modal_period" value="${esc(item.period || 'starting')}"></div>
      <div class="field"><label>Button Text</label><input type="text" id="modal_btn_text" value="${esc(item.btn_text || 'Get Started')}"></div>
    </div>
    <div class="field"><label>Features <span class="hint">(one per line)</span></label><textarea id="modal_features" rows="6">${esc(features)}</textarea></div>
    <div class="field"><div class="checkbox-row"><input type="checkbox" id="modal_is_popular" ${item.is_popular ? 'checked' : ''}><label for="modal_is_popular">Mark as Popular</label></div></div>
  `;

  showModal(id ? 'Edit Pricing Plan' : 'Add Pricing Plan', formHtml, async () => {
    const payload = {
      name: document.getElementById('modal_name').value,
      description: document.getElementById('modal_description').value,
      currency: document.getElementById('modal_currency').value,
      price: document.getElementById('modal_price').value,
      period: document.getElementById('modal_period').value,
      btn_text: document.getElementById('modal_btn_text').value,
      features: document.getElementById('modal_features').value.split('\n').map(f => f.trim()).filter(Boolean),
      is_popular: document.getElementById('modal_is_popular').checked,
    };

    let error;
    if (id) {
      ({ error } = await sb.from('pricing_plans').update(payload).eq('id', id));
    } else {
      const { count } = await sb.from('pricing_plans').select('id', { count: 'exact', head: true });
      payload.sort_order = (count || 0) + 1;
      ({ error } = await sb.from('pricing_plans').insert([payload]));
    }
    if (error) { showToast(error.message, 'error'); return; }
    showToast('Saved!', 'success');
    closeModal();
    loadSection('pricing');
  });
}

// =============================================================
// Contact Info & Social Links Editor
// =============================================================
async function renderContactInfoEditor(area) {
  const headerInfo = await sb.from('section_headers').select('*').eq('section_key', 'contact').single();
  const header = headerInfo.data || {};

  const { data: brandData } = await sb.from('site_settings').select('*').eq('key', 'brand').single();
  const brand = brandData ? (typeof brandData.value === 'string' ? JSON.parse(brandData.value) : brandData.value) : {};

  const { data: formConfigData } = await sb.from('site_settings').select('*').eq('key', 'contact_form').single();
  const formConfig = formConfigData ? (typeof formConfigData.value === 'string' ? JSON.parse(formConfigData.value) : formConfigData.value) : {};

  const { data: socials } = await sb.from('social_links').select('*').order('sort_order');

  area.innerHTML = `
    <div class="section-panel">
      <div class="section-panel-header"><h3>Contact Section Header <span class="hint" style="font-weight:400">(heading above the contact form on the homepage)</span></h3></div>
      <div class="section-panel-body">
        <div class="field-row">
          <div class="field"><label>Tag <span class="hint">(pink label — e.g. "Get In Touch")</span></label><input type="text" id="sh_tag" value="${esc(header.tag_text)}"></div>
          <div class="field"><label>Title</label><input type="text" id="sh_title" value="${esc(header.title)}"></div>
        </div>
        <div class="field"><label>Subtitle</label><input type="text" id="sh_subtitle" value="${esc(header.subtitle)}"></div>
        <button class="btn btn-pink btn-sm" style="margin-top:8px" onclick="saveSectionHeader('contact', '${header.id || ''}')">Save</button>
      </div>
    </div>

    <div class="section-panel">
      <div class="section-panel-header"><h3>Contact Details <span class="hint" style="font-weight:400">(shown on the contact page and footer)</span></h3></div>
      <div class="section-panel-body">
        <div class="field-row">
          <div class="field"><label>Email</label><input type="email" id="brandEmail" value="${esc(brand.email)}"></div>
          <div class="field"><label>Phone</label><input type="tel" id="brandPhone" value="${esc(brand.phone)}"></div>
        </div>
        <div class="field"><label>Location</label><input type="text" id="brandLocation" value="${esc(brand.location)}"></div>
        <button class="btn btn-pink btn-sm" style="margin-top:8px" onclick="saveBrandContact()">Save Contact</button>
      </div>
    </div>

    <div class="section-panel">
      <div class="section-panel-header"><h3>Form Config <span class="hint" style="font-weight:400">(dropdown options in the contact form)</span></h3></div>
      <div class="section-panel-body">
        <div class="field"><label>Project Types <span class="hint">(one per line)</span></label>
          <textarea id="formProjectTypes" rows="4">${(formConfig.project_types || []).join('\n')}</textarea>
        </div>
        <div class="field"><label>Budget Ranges <span class="hint">(one per line)</span></label>
          <textarea id="formBudgetRanges" rows="4">${(formConfig.budget_ranges || []).join('\n')}</textarea>
        </div>
        <button class="btn btn-pink btn-sm" style="margin-top:8px" onclick="saveFormConfig()">Save Form Config</button>
      </div>
    </div>

    <div class="section-panel">
      <div class="section-panel-header">
        <h3>Social Links <span class="hint" style="font-weight:400">(footer icons and floating sidebar)</span></h3>
        <button class="btn btn-pink btn-sm" onclick="openCrudModal('social_links', ['platform','url','icon_svg','is_floating'], null)">+ Add Link</button>
      </div>
      <div class="section-panel-body">
        <div class="items-list">
          ${(socials || []).map(s => `
            <div class="item-row">
              <div class="item-info">
                <div class="item-title">${esc(s.platform)}</div>
                <div class="item-sub">${esc(s.url)}</div>
              </div>
              <div class="item-actions">
                <button class="btn btn-ghost btn-sm" onclick="openCrudModal('social_links', ['platform','url','icon_svg','is_floating'], '${s.id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteRow('social_links','${s.id}')">Delete</button>
              </div>
            </div>
          `).join('')}
          ${(!socials || socials.length === 0) ? '<div class="empty-state"><p>No social links yet.</p></div>' : ''}
        </div>
      </div>
    </div>
  `;
}

async function saveBrandContact() {
  const { data: existing } = await sb.from('site_settings').select('*').eq('key', 'brand').single();
  const brand = existing ? (typeof existing.value === 'string' ? JSON.parse(existing.value) : existing.value) : {};
  brand.email = document.getElementById('brandEmail').value;
  brand.phone = document.getElementById('brandPhone').value;
  brand.location = document.getElementById('brandLocation').value;

  const { error } = await sb.from('site_settings').update({ value: brand }).eq('key', 'brand');
  if (error) { showToast(error.message, 'error'); return; }
  showToast('Contact details saved!', 'success');
}

async function saveFormConfig() {
  const val = {
    project_types: document.getElementById('formProjectTypes').value.split('\n').map(l => l.trim()).filter(Boolean),
    budget_ranges: document.getElementById('formBudgetRanges').value.split('\n').map(l => l.trim()).filter(Boolean),
  };
  const { error } = await sb.from('site_settings').update({ value: val }).eq('key', 'contact_form');
  if (error) { showToast(error.message, 'error'); return; }
  showToast('Form config saved!', 'success');
}

// =============================================================
// Submissions Viewer
// =============================================================
async function renderSubmissions(area) {
  const { data } = await sb.from('contact_submissions').select('*').order('created_at', { ascending: false });
  const items = data || [];

  area.innerHTML = `
    <div class="section-panel">
      <div class="section-panel-header">
        <h3>Contact Submissions (${items.length})</h3>
      </div>
      <div class="section-panel-body">
        ${items.length === 0 ? '<div class="empty-state"><p>No submissions yet.</p></div>' : `
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Project</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              ${items.map(s => `
                <tr>
                  <td><strong>${esc(s.name)}</strong></td>
                  <td>${esc(s.email)}</td>
                  <td>${esc(s.project_type)}</td>
                  <td><span class="status-badge status-${s.status}">${s.status}</span></td>
                  <td>${new Date(s.created_at).toLocaleDateString()}</td>
                  <td>
                    <div class="actions">
                      <button class="btn btn-ghost btn-sm" onclick="viewSubmission('${s.id}')">View</button>
                      <button class="btn btn-danger btn-sm" onclick="deleteRow('contact_submissions','${s.id}')">Delete</button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>`}
      </div>
    </div>
  `;
}

async function viewSubmission(id) {
  const { data } = await sb.from('contact_submissions').select('*').eq('id', id).single();
  if (!data) return;

  // Mark as read
  if (data.status === 'new') {
    await sb.from('contact_submissions').update({ status: 'read' }).eq('id', id);
  }

  const html = `
    <div class="field"><label>Name</label><input type="text" value="${esc(data.name)}" readonly></div>
    <div class="field-row">
      <div class="field"><label>Email</label><input type="text" value="${esc(data.email)}" readonly></div>
      <div class="field"><label>Phone</label><input type="text" value="${esc(data.phone || 'N/A')}" readonly></div>
    </div>
    <div class="field-row">
      <div class="field"><label>Project Type</label><input type="text" value="${esc(data.project_type)}" readonly></div>
      <div class="field"><label>Budget</label><input type="text" value="${esc(data.budget || 'N/A')}" readonly></div>
    </div>
    <div class="field"><label>Message</label><textarea readonly rows="4">${esc(data.message)}</textarea></div>
    <div class="field-row">
      <div class="field"><label>Status</label>
        <select id="subStatus">
          ${['new', 'read', 'replied', 'archived'].map(s => `<option value="${s}" ${data.status === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
      </div>
      <div class="field"><label>Date</label><input type="text" value="${new Date(data.created_at).toLocaleString()}" readonly></div>
    </div>
  `;

  showModal('Submission Details', html, async () => {
    const { error } = await sb.from('contact_submissions').update({
      status: document.getElementById('subStatus').value
    }).eq('id', id);
    if (error) { showToast(error.message, 'error'); return; }
    showToast('Status updated!', 'success');
    closeModal();
    loadSection('submissions');
  });
}

// =============================================================
// Site Settings
// =============================================================
async function renderSettings(area) {
  const { data: brandData } = await sb.from('site_settings').select('*').eq('key', 'brand').single();
  const brand = brandData ? (typeof brandData.value === 'string' ? JSON.parse(brandData.value) : brandData.value) : {};

  const { data: footerData } = await sb.from('site_settings').select('*').eq('key', 'footer').single();
  const footer = footerData ? (typeof footerData.value === 'string' ? JSON.parse(footerData.value) : footerData.value) : {};

  const { data: seoData } = await sb.from('site_settings').select('*').eq('key', 'seo').single();
  const seo = seoData ? (typeof seoData.value === 'string' ? JSON.parse(seoData.value) : seoData.value) : {};

  area.innerHTML = `
    <!-- Branding & Identity -->
    <div class="section-panel">
      <div class="section-panel-header"><h3>Branding & Identity <span class="hint" style="font-weight:400">(controls navbar logo, footer, and SEO defaults)</span></h3></div>
      <div class="section-panel-body">
        <div class="field-row">
          <div class="field"><label>Brand Name <span class="hint">(shown in navbar and page title)</span></label><input type="text" id="setBrandName" value="${esc(brand.name)}"></div>
          <div class="field"><label>Tagline <span class="hint">(shown in footer under brand name)</span></label><input type="text" id="setBrandTagline" value="${esc(brand.tagline)}"></div>
        </div>
        <div class="field"><label>Description <span class="hint">(footer description and meta fallback)</span></label><textarea id="setBrandDesc">${esc(brand.description)}</textarea></div>

        <div class="field-row">
          <div class="field">
            <label>Favicon URL <span class="hint">(browser tab icon — 32×32 or 64×64 PNG)</span></label>
            <div class="image-upload-group">
              <input type="text" id="setBrandFavicon" value="${esc(brand.favicon_url)}" placeholder="https://...favicon.png">
              <label class="upload-btn" for="upload_favicon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Upload
              </label>
              <input type="file" id="upload_favicon" accept="image/png,image/x-icon,image/svg+xml" style="display:none" onchange="handleImageUpload(event, 'setBrandFavicon')">
            </div>
            ${brand.favicon_url ? `<img src="${esc(brand.favicon_url)}" class="image-preview" style="max-width:48px;max-height:48px;margin-top:8px" alt="favicon preview">` : ''}
          </div>
          <div class="field">
            <label>Logo Image URL <span class="hint">(optional — replaces text logo)</span></label>
            <div class="image-upload-group">
              <input type="text" id="setBrandLogo" value="${esc(brand.logo_url)}" placeholder="https://...logo.png">
              <label class="upload-btn" for="upload_logo">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                Upload
              </label>
              <input type="file" id="upload_logo" accept="image/*" style="display:none" onchange="handleImageUpload(event, 'setBrandLogo')">
            </div>
            ${brand.logo_url ? `<img src="${esc(brand.logo_url)}" class="image-preview" style="max-height:40px;margin-top:8px" alt="logo preview">` : ''}
          </div>
        </div>

        <button class="btn btn-pink btn-sm" style="margin-top:8px" onclick="saveSettingsGroup('brand')">Save Brand & Identity</button>
      </div>
    </div>

    <!-- Footer -->
    <div class="section-panel">
      <div class="section-panel-header"><h3>Footer <span class="hint" style="font-weight:400">(text at the very bottom of every page)</span></h3></div>
      <div class="section-panel-body">
        <div class="field"><label>Copyright Text <span class="hint">(e.g. "© 2025 PinkLabs. All rights reserved.")</span></label><input type="text" id="setFooterCopy" value="${esc(footer.copyright)}"></div>
        <div class="field"><label>Footer Description <span class="hint">(short text shown in the footer column)</span></label><input type="text" id="setFooterDesc" value="${esc(footer.description)}"></div>
        <div class="field"><label>Built With Text <span class="hint">("Made with ❤️ by PinkLabs" — bottom right)</span></label><input type="text" id="setFooterBuilt" value="${esc(footer.built_with)}"></div>
        <button class="btn btn-pink btn-sm" style="margin-top:8px" onclick="saveSettingsGroup('footer')">Save Footer</button>
      </div>
    </div>

    <!-- SEO / Open Graph -->
    <div class="section-panel">
      <div class="section-panel-header"><h3>SEO / Open Graph</h3></div>
      <div class="section-panel-body">
        <div class="field"><label>Meta Title <span class="hint">(browser tab & search engine title)</span></label><input type="text" id="setSeoTitle" value="${esc(seo.og_title)}"></div>
        <div class="field"><label>Meta Description <span class="hint">(search engine snippet)</span></label><textarea id="setSeoDesc">${esc(seo.og_description)}</textarea></div>
        <div class="field">
          <label>OG Image URL <span class="hint">(social sharing image — 1200×630 recommended)</span></label>
          <div class="image-upload-group">
            <input type="text" id="setSeoImage" value="${esc(seo.og_image)}" placeholder="https://...og-image.png">
            <label class="upload-btn" for="upload_og">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Upload
            </label>
            <input type="file" id="upload_og" accept="image/*" style="display:none" onchange="handleImageUpload(event, 'setSeoImage')">
          </div>
          ${seo.og_image ? `<img src="${esc(seo.og_image)}" class="image-preview" style="max-width:300px;margin-top:8px" alt="og preview">` : ''}
        </div>
        <button class="btn btn-pink btn-sm" style="margin-top:8px" onclick="saveSettingsGroup('seo')">Save SEO</button>
      </div>
    </div>
  `;
}

async function saveSettingsGroup(key) {
  let val = {};
  switch (key) {
    case 'brand': {
      const { data: existing } = await sb.from('site_settings').select('*').eq('key', 'brand').single();
      val = existing ? (typeof existing.value === 'string' ? JSON.parse(existing.value) : existing.value) : {};
      val.name = document.getElementById('setBrandName').value;
      val.tagline = document.getElementById('setBrandTagline').value;
      val.description = document.getElementById('setBrandDesc').value;
      val.favicon_url = document.getElementById('setBrandFavicon').value;
      val.logo_url = document.getElementById('setBrandLogo').value;
      break;
    }
    case 'footer':
      val = {
        copyright: document.getElementById('setFooterCopy').value,
        description: document.getElementById('setFooterDesc').value,
        built_with: document.getElementById('setFooterBuilt').value,
      };
      break;
    case 'seo':
      val = {
        og_title: document.getElementById('setSeoTitle').value,
        og_description: document.getElementById('setSeoDesc').value,
        og_image: document.getElementById('setSeoImage').value,
      };
      break;
  }

  // Use upsert so settings auto-create if missing
  const { error } = await sb.from('site_settings').upsert(
    { key, value: val },
    { onConflict: 'key' }
  );
  if (error) { showToast(error.message, 'error'); return; }
  showToast(`${key} settings saved!`, 'success');
}

// =============================================================
// Delete Row (generic)
// =============================================================
async function deleteRow(table, id) {
  if (!confirm('Are you sure you want to delete this item?')) return;
  const { error } = await sb.from(table).delete().eq('id', id);
  if (error) { showToast(error.message, 'error'); return; }
  showToast('Deleted!', 'success');
  loadSection(currentSection);
}

// =============================================================
// Modal System
// =============================================================
let modalOverlayEl = null;

function showModal(title, bodyHtml, onSave) {
  // Remove existing modal
  if (modalOverlayEl) modalOverlayEl.remove();

  modalOverlayEl = document.createElement('div');
  modalOverlayEl.className = 'admin-modal-overlay';
  modalOverlayEl.innerHTML = `
    <div class="admin-modal">
      <div class="admin-modal-header">
        <h3>${title}</h3>
        <button class="admin-modal-close" onclick="closeModal()">×</button>
      </div>
      <div class="admin-modal-body">${bodyHtml}</div>
      <div class="admin-modal-footer">
        <button class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button class="btn btn-pink" id="modalSaveBtn">Save</button>
      </div>
    </div>
  `;
  document.body.appendChild(modalOverlayEl);

  requestAnimationFrame(() => modalOverlayEl.classList.add('active'));

  document.getElementById('modalSaveBtn').addEventListener('click', onSave);
  modalOverlayEl.addEventListener('click', (e) => {
    if (e.target === modalOverlayEl) closeModal();
  });
}

function closeModal() {
  if (modalOverlayEl) {
    modalOverlayEl.classList.remove('active');
    setTimeout(() => { modalOverlayEl.remove(); modalOverlayEl = null; }, 300);
  }
}

// =============================================================
// Toast
// =============================================================
function showToast(msg, type = 'success') {
  const toast = document.getElementById('adminToast');
  const msgEl = document.getElementById('adminToastMsg');
  toast.className = 'admin-toast';
  msgEl.textContent = msg;
  toast.classList.add(type, 'visible');
  setTimeout(() => toast.classList.remove('visible'), 3500);
}

// =============================================================
// Utilities
// =============================================================
function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
