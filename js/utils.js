// ── Icon helper (Material Symbols) ──
export function icon(name, size = '') {
  return `<span class="icon icon-filled${size ? ' icon-' + size : ''}">${name}</span>`;
}

// ── Toast Notifications ──
export function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) { container = document.createElement('div'); container.id = 'toast-container'; document.body.appendChild(container); }
  const icons = { success: 'check_circle', error: 'error', info: 'info', warning: 'warning' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span class="icon icon-sm">${icons[type] || 'info'}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.animation = 'fadeOut 0.4s ease forwards'; setTimeout(() => toast.remove(), 400); }, duration);
}

// ── Module Error Banner ──
export function showModuleError(containerId, message) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `<div class="module-error"><span class="icon">warning</span> ${message} — <strong>Other modules are unaffected.</strong></div>`;
}

// ── Format Date ──
export function formatDate(timestamp) {
  if (!timestamp) return '—';
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(timestamp) {
  if (!timestamp) return '—';
  const d = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ── Attendance Color Class ──
export function attClass(pct) {
  if (pct >= 75) return 'att-high';
  if (pct >= 60) return 'att-mid';
  return 'att-low';
}

export function progressColor(pct) {
  if (pct >= 75) return 'green';
  if (pct >= 60) return 'yellow';
  return 'red';
}

// ── Currency Format ──
export function formatCurrency(amount) {
  return 'Rs.' + Number(amount).toLocaleString('en-IN');
}

// ── Subject Coloring ──
export function getSubjectColor(code) {
  if (!code) return 'var(--text-muted)';
  const colors = [
    'rgba(37,99,235,0.15)', // Blue
    'rgba(16,185,129,0.15)', // Green
    'rgba(245,158,11,0.15)', // Amber
    'rgba(239,68,68,0.15)',  // Red
    'rgba(139,92,246,0.15)', // Purple
    'rgba(236,72,153,0.15)', // Pink
    'rgba(6,182,212,0.15)'   // Cyan
  ];
  let hash = 0;
  for (let i = 0; i < code.length; i++) hash = code.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export function getSubjectBorder(code) {
  if (!code) return 'var(--glass-border)';
  const colors = [
    'rgba(37,99,235,0.4)', 'rgba(16,185,129,0.4)', 'rgba(245,158,11,0.4)',
    'rgba(239,68,68,0.4)', 'rgba(139,92,246,0.4)', 'rgba(236,72,153,0.4)', 'rgba(6,182,212,0.4)'
  ];
  let hash = 0;
  for (let i = 0; i < code.length; i++) hash = code.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

// ── Safe async wrapper ──
export async function safeAsync(fn, errorContainerId, errorMsg) {
  try { return await fn(); } catch (e) {
    console.error(e);
    if (errorContainerId) showModuleError(errorContainerId, errorMsg || 'Failed to load data');
    return null;
  }
}

// ── Master Navigation Lists ──
export function getStudentNav(activeHref) {
  const nav = [
    { label: 'Main', items: [
      { href: 'dashboard.html', icon: 'home', text: 'Dashboard' },
      { href: 'attendance.html', icon: 'calendar_month', text: 'Attendance' },
      { href: 'marks.html', icon: 'grade', text: 'Marks & Results' },
      { href: 'fees.html', icon: 'payments', text: 'Fees' },
    ]},
    { label: 'Resources', items: [
      { href: 'courses.html', icon: 'menu_book', text: 'My Courses' },
      { href: 'materials.html', icon: 'folder', text: 'Study Materials' },
      { href: 'announcements.html', icon: 'campaign', text: 'Announcements' },
      { href: 'timetable.html', icon: 'event_note', text: 'Time Table' }
    ]}
  ];
  return markActive(nav, activeHref);
}

export function getFacultyNav(activeHref) {
  const nav = [
    { label: 'Faculty', items: [
      { href: 'dashboard.html', icon: 'home', text: 'Dashboard' },
      { href: 'timetable.html', icon: 'calendar_today', text: 'My Schedule' },
      { href: 'attendance.html', icon: 'calendar_month', text: 'Mark Attendance' },
      { href: 'marks.html', icon: 'grade', text: 'Enter Marks' },
      { href: 'materials.html', icon: 'library_books', text: 'Study Materials' },
    ]},
    { label: 'Communication', items: [
      { href: 'announcements.html', icon: 'campaign', text: 'Announcements' },
    ]}
  ];
  return markActive(nav, activeHref);
}

function markActive(nav, href) {
  nav.forEach(s => s.items.forEach(i => i.active = i.href === href));
  return nav;
}

// ── Build sidebar HTML ──
export function buildSidebar(role, userName, navItems) {
  const initials = userName ? userName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : '??';
  return `
    <div class="sidebar-logo">
      <a class="logo-mark" href="/">
        <div class="logo-icon"><img src="../favicon.png" alt="MyClg Logo" style="width:32px;height:32px;border-radius:6px;"></div>
        <div>
          <div class="logo-text">MyClg</div>
          <div class="logo-sub">ERP SYSTEM</div>
        </div>
      </a>
    </div>
    <nav class="sidebar-nav">
      ${navItems.map(section => `
        <div class="nav-section-label">${section.label}</div>
        ${section.items.map(item => `
          <a class="nav-item ${item.active ? 'active' : ''}" href="${item.href}">
            <span class="nav-icon icon icon-filled">${item.icon}</span>
            <span>${item.text}</span>
          </a>`).join('')}
      `).join('')}
    </nav>
    <div class="sidebar-user">
      <a href="profile.html" style="display:flex;align-items:center;gap:12px;flex:1;cursor:pointer;text-decoration:none;color:inherit;" title="View Profile">
        <div class="user-avatar">${initials}</div>
        <div class="user-info">
          <div class="user-name">${userName || 'Loading...'}</div>
          <div class="user-role">${role || ''}</div>
        </div>
      </a>
      <button class="logout-btn" id="logout-btn" title="Logout"><span class="icon icon-sm">logout</span></button>
    </div>`;
}
