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

// ── Safe async wrapper ──
export async function safeAsync(fn, errorContainerId, errorMsg) {
  try { return await fn(); } catch (e) {
    console.error(e);
    if (errorContainerId) showModuleError(errorContainerId, errorMsg || 'Failed to load data');
    return null;
  }
}

// ── Build sidebar HTML ──
export function buildSidebar(role, userName, navItems) {
  const initials = userName ? userName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() : '??';
  return `
    <div class="sidebar-logo">
      <a class="logo-mark" href="/">
        <div class="logo-icon"><span class="icon icon-filled icon-xl" style="color:#fff;">school</span></div>
        <div>
          <div class="logo-text">EduCore</div>
          <div class="logo-sub">ERP PLATFORM</div>
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
