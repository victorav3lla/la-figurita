import './admin.css';
import { BATCHES } from '../data/batches.js';
import { SHIPPING_OPTIONS } from '../data/pricing.js';

// ─── Estado global ─────────────────────────────────────────────────────────

const state = {
  authenticated: false,
  view: 'dashboard',
  orders: [],
  stats: null,
  filters: { status: 'all', batch: 'all', channel: 'all' },
  loading: false,
  creating: false,
};

const STATUS_LABELS = {
  pending: 'Pendiente',
  paid_pending_review: 'Comprobante recibido',
  confirmed: 'Pago confirmado',
  production: 'En producción',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
};

const formatCOP = (n) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(n || 0);

// ─── API ───────────────────────────────────────────────────────────────────

async function api(path, method = 'GET', body = null) {
  const token = sessionStorage.getItem('admin_token')
  const res = await fetch(path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token || ''
    },
    body: body ? JSON.stringify(body) : null
  })
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`)
    err.response = res
    throw err
  }
  return res.json()
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateOrderId() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `LF-${day}${month}${year}-${random}`;
}

function statusBadge(status) {
  return `<span class="status-badge status-${status}">${STATUS_LABELS[status] || status}</span>`;
}

function channelBadge(channel) {
  const label = channel === 'web' ? '🌐 Web' : '💬 WhatsApp';
  return `<span class="channel-badge channel-${channel}">${label}</span>`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getBatchLabel(id) {
  return BATCHES.find((b) => b.id === id)?.label || id;
}

// ─── Views ─────────────────────────────────────────────────────────────────

function viewLogin() {
  return `
    <div class="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
      <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <h1 class="font-display font-black text-2xl mb-1">La Figurita</h1>
        <p class="text-zinc-500 text-sm mb-6">Panel de administración</p>

        <form id="login-form" class="flex flex-col gap-4">
          <div>
            <label class="text-sm font-semibold text-zinc-700 block mb-1">Contraseña</label>
            <input type="password" id="login-password" required autofocus
                   class="w-full border-2 border-zinc-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-900 transition" />
          </div>
          <p id="login-error" class="text-red-500 text-sm hidden">Contraseña incorrecta.</p>
          <button type="submit"
                  class="bg-zinc-900 text-white font-display font-bold py-3 rounded-xl hover:bg-zinc-700 transition">
            Entrar
          </button>
        </form>
      </div>
    </div>
  `;
}

function viewDashboard() {
  const s = state.stats;
  const recent = state.orders.slice(0, 8);

  return `
    <div class="p-6 max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="font-display font-black text-2xl">Dashboard</h1>
          <p class="text-zinc-500 text-sm">La Figurita · Panel admin</p>
        </div>
        <div class="flex gap-3">
          <button data-view="orders" class="nav-btn bg-white border border-zinc-200 text-zinc-700 px-4 py-2 rounded-xl text-sm font-semibold hover:border-zinc-900 transition">
            Ver todos los pedidos
          </button>
          <button data-view="create" class="nav-btn bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition">
            + Nuevo pedido
          </button>
        </div>
      </div>

      <!-- Stats cards -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100">
          <p class="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Total pedidos</p>
          <p class="font-display font-black text-3xl">${s?.total_orders || 0}</p>
        </div>
        <div class="bg-zinc-900 rounded-2xl p-5 shadow-sm text-white">
          <p class="text-zinc-400 text-xs font-semibold uppercase tracking-wider mb-1">Ingresos totales</p>
          <p class="font-display font-black text-3xl">${formatCOP(s?.total_revenue)}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100">
          <p class="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">Web</p>
          <p class="font-display font-black text-3xl">${s?.web_orders || 0}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-zinc-100">
          <p class="text-zinc-500 text-xs font-semibold uppercase tracking-wider mb-1">WhatsApp</p>
          <p class="font-display font-black text-3xl">${s?.wa_orders || 0}</p>
        </div>
      </div>

      <!-- Status overview -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        ${Object.entries(STATUS_LABELS)
          .map(
            ([key, label]) => `
          <div class="bg-white rounded-xl p-4 border border-zinc-100 flex items-center gap-3">
            ${statusBadge(key)}
            <span class="font-bold text-lg">${s?.[key] || 0}</span>
          </div>
        `
          )
          .join('')}
      </div>

      <!-- Recent orders -->
      <div class="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div class="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <h2 class="font-display font-bold text-lg">Pedidos recientes</h2>
          <button data-view="orders" class="nav-btn text-sm text-zinc-500 hover:text-zinc-900 transition">Ver todos →</button>
        </div>
        <div class="overflow-x-auto">
          ${ordersTable(recent)}
        </div>
      </div>
    </div>
  `;
}

function ordersTable(orders) {
  if (!orders.length) {
    return `<p class="text-center py-12 text-zinc-400">No hay pedidos aún.</p>`;
  }

  return `
    <table class="w-full text-sm">
      <thead>
        <tr class="text-left text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-100">
          <th class="px-4 py-3 font-semibold">Pedido</th>
          <th class="px-4 py-3 font-semibold">Cliente</th>
          <th class="px-4 py-3 font-semibold">Batch</th>
          <th class="px-4 py-3 font-semibold">Qty</th>
          <th class="px-4 py-3 font-semibold">Total</th>
          <th class="px-4 py-3 font-semibold">Canal</th>
          <th class="px-4 py-3 font-semibold">Estado</th>
          <th class="px-4 py-3 font-semibold">Fecha</th>
          <th class="px-4 py-3"></th>
        </tr>
      </thead>
      <tbody>
        ${orders
          .map(
            (o) => `
          <tr class="border-b border-zinc-50 hover:bg-zinc-50 transition">
            <td class="px-4 py-3 font-mono text-xs font-semibold text-zinc-600">${o.order_id}</td>
            <td class="px-4 py-3">
              <p class="font-semibold">${o.name}</p>
              <p class="text-zinc-400 text-xs">${o.whatsapp}</p>
            </td>
            <td class="px-4 py-3 text-xs text-zinc-600">${getBatchLabel(o.batch_id)}</td>
            <td class="px-4 py-3 font-semibold text-center">${o.quantity}</td>
            <td class="px-4 py-3 font-bold">${formatCOP(o.total)}</td>
            <td class="px-4 py-3">${channelBadge(o.channel)}</td>
            <td class="px-4 py-3">
              <select class="status-select text-xs border border-zinc-200 rounded-lg px-2 py-1 bg-white cursor-pointer"
                      data-order-id="${o.order_id}" data-current="${o.status}">
                ${Object.entries(STATUS_LABELS)
                  .map(
                    ([val, label]) =>
                      `<option value="${val}" ${o.status === val ? 'selected' : ''}>${label}</option>`
                  )
                  .join('')}
              </select>
            </td>
            <td class="px-4 py-3 text-xs text-zinc-400">${formatDate(o.created_at)}</td>
            <td class="px-4 py-3">
              <a href="https://wa.me/${o.whatsapp?.replace(/\D/g, '')}"
                 target="_blank" class="text-green-600 hover:text-green-800 text-xs font-semibold">
                WA →
              </a>
            </td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  `;
}

function viewOrders() {
  const filtered = state.orders.filter((o) => {
    if (state.filters.status !== 'all' && o.status !== state.filters.status)
      return false;
    if (state.filters.batch !== 'all' && o.batch_id !== state.filters.batch)
      return false;
    if (state.filters.channel !== 'all' && o.channel !== state.filters.channel)
      return false;
    return true;
  });

  const totalFiltered = filtered.reduce((sum, o) => sum + (o.total || 0), 0);

  return `
    <div class="p-6 max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <div>
          <button data-view="dashboard" class="nav-btn text-zinc-500 text-sm hover:text-zinc-900 transition mb-1">← Dashboard</button>
          <h1 class="font-display font-black text-2xl">Todos los pedidos</h1>
        </div>
        <button data-view="create" class="nav-btn bg-zinc-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition">
          + Nuevo pedido
        </button>
      </div>

      <!-- Filtros -->
      <div class="bg-white rounded-2xl border border-zinc-100 shadow-sm p-4 mb-4 flex flex-wrap gap-4 items-end">
        <div>
          <label class="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Estado</label>
          <select id="filter-status" class="border border-zinc-200 rounded-lg px-3 py-2 text-sm bg-white">
            <option value="all">Todos</option>
            ${Object.entries(STATUS_LABELS)
              .map(
                ([val, label]) =>
                  `<option value="${val}" ${state.filters.status === val ? 'selected' : ''}>${label}</option>`
              )
              .join('')}
          </select>
        </div>
        <div>
          <label class="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Batch</label>
          <select id="filter-batch" class="border border-zinc-200 rounded-lg px-3 py-2 text-sm bg-white">
            <option value="all">Todos</option>
            ${BATCHES.map((b) => `<option value="${b.id}" ${state.filters.batch === b.id ? 'selected' : ''}>${b.label}</option>`).join('')}
          </select>
        </div>
        <div>
          <label class="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1">Canal</label>
          <select id="filter-channel" class="border border-zinc-200 rounded-lg px-3 py-2 text-sm bg-white">
            <option value="all">Todos</option>
            <option value="web"       ${state.filters.channel === 'web' ? 'selected' : ''}>Web</option>
            <option value="whatsapp"  ${state.filters.channel === 'whatsapp' ? 'selected' : ''}>WhatsApp</option>
          </select>
        </div>
        <div class="ml-auto text-right">
          <p class="text-xs text-zinc-400">${filtered.length} pedido(s)</p>
          <p class="font-bold">${formatCOP(totalFiltered)}</p>
        </div>
      </div>

      <!-- Tabla -->
      <div class="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          ${ordersTable(filtered)}
        </div>
      </div>
    </div>
  `;
}

function viewCreate() {
  const allBatches = BATCHES.filter((b) => b.active);

  return `
    <div class="p-6 max-w-2xl mx-auto">
      <button data-view="dashboard" class="nav-btn text-zinc-500 text-sm hover:text-zinc-900 transition mb-4">← Dashboard</button>
      <h1 class="font-display font-black text-2xl mb-6">Nuevo pedido (WhatsApp)</h1>

      <form id="create-form" class="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6 flex flex-col gap-4">

        <div class="grid grid-cols-2 gap-4">
          <div class="col-span-2">
            <label class="label">Nombre completo *</label>
            <input type="text" name="name" required class="input" />
          </div>
          <div>
            <label class="label">WhatsApp *</label>
            <input type="tel" name="whatsapp" required placeholder="+57 300..." class="input" />
          </div>
          <div>
            <label class="label">Email</label>
            <input type="email" name="email" placeholder="(opcional)" class="input" />
          </div>
          <div>
            <label class="label">Ciudad *</label>
            <input type="text" name="city" required class="input" />
          </div>
          <div class="col-span-2">
            <label class="label">Dirección *</label>
            <textarea name="address" required rows="2" class="input"></textarea>
          </div>
        </div>

        <hr class="border-zinc-100" />

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">Batch *</label>
            <select name="batch_id" required id="create-batch" class="input">
              <option value="">Selecciona...</option>
              ${allBatches.map((b) => `<option value="${b.id}">${b.label}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="label">Zona de envío *</label>
            <select name="shipping_zone" required id="create-zone" class="input">
              <option value="">Selecciona...</option>
              ${SHIPPING_OPTIONS.map((o) => `<option value="${o.id}">${o.label}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="label">Cantidad *</label>
            <input type="number" name="quantity" required min="1" max="10" value="1" class="input" id="create-qty" />
          </div>
          <div>
            <label class="label">Estado inicial</label>
            <select name="status" class="input">
              <option value="pending">Pendiente</option>
              <option value="confirmed">Pago confirmado</option>
            </select>
          </div>
          <div class="col-span-2">
            <label class="label">Link de fotos</label>
            <input type="url" name="photos_link" placeholder="https://drive.google.com/..." class="input" />
          </div>
          <div class="col-span-2">
            <label class="label">Notas</label>
            <textarea name="notes" rows="2" class="input" placeholder="Observaciones..."></textarea>
          </div>
        </div>

        <!-- Resumen de precio -->
        <div id="create-summary" class="bg-zinc-50 rounded-xl p-4 text-sm hidden">
          <div class="flex justify-between mb-1"><span class="text-zinc-500">Subtotal</span><span id="cs-subtotal">—</span></div>
          <div class="flex justify-between mb-1"><span class="text-zinc-500">Envío</span><span id="cs-shipping">—</span></div>
          <div class="flex justify-between font-bold text-base border-t border-zinc-200 pt-2 mt-2"><span>Total</span><span id="cs-total">—</span></div>
        </div>

        <p id="create-error" class="text-red-500 text-sm hidden"></p>

        <button type="submit" id="create-submit"
                class="bg-zinc-900 text-white font-display font-bold py-3 rounded-xl hover:bg-zinc-700 transition">
          Crear pedido
        </button>
      </form>
    </div>
  `;
}

function orderDetailPanel(order, editMode = false) {
  if (!order) return ''
  const batch = BATCHES.find(b => b.id === order.batch_id)

  const viewField = (label, value) => `
    <div class="mb-3">
      <p class="detail-sublabel">${label}</p>
      <p class="text-sm font-medium text-zinc-800">${value || '—'}</p>
    </div>
  `

  const editField = (label, id, value, type = 'text') => `
    <div class="mb-3">
      <label class="detail-sublabel">${label}</label>
      ${type === 'textarea'
        ? `<textarea class="input text-sm" id="${id}" rows="2">${value || ''}</textarea>`
        : `<input type="${type}" class="input text-sm" id="${id}" value="${value || ''}" />`
      }
    </div>
  `

  return `
    <div class="detail-overlay" id="detail-overlay">
      <div class="detail-panel" id="detail-panel">

        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <div>
            <p class="font-mono text-xs text-zinc-400 mb-1">${order.order_id}</p>
            <h2 class="font-display font-black text-xl">${order.name}</h2>
            <div class="mt-1 flex gap-2">${channelBadge(order.channel)} ${statusBadge(order.status)}</div>
          </div>
          <div class="flex gap-2">
            ${!editMode ? `
              <button id="toggle-edit" title="Editar"
                      class="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition text-zinc-600">
                ✏️
              </button>
            ` : ''}
            <button id="close-detail"
                    class="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 flex items-center justify-center transition text-zinc-600 font-bold">
              ✕
            </button>
          </div>
        </div>

        <!-- Estado (siempre editable) -->
        <div class="detail-section">
          <p class="detail-label">Estado</p>
          <select class="detail-status-select input" data-order-id="${order.order_id}">
            ${Object.entries(STATUS_LABELS).map(([val, label]) =>
              `<option value="${val}" ${order.status === val ? 'selected' : ''}>${label}</option>`
            ).join('')}
          </select>
        </div>

        <!-- Datos del cliente -->
        <div class="detail-section">
          <p class="detail-label">Cliente</p>
          ${editMode ? `
            ${editField('Nombre', 'edit-name', order.name)}
            ${editField('Email', 'edit-email', order.email, 'email')}
            ${editField('WhatsApp', 'edit-whatsapp', order.whatsapp, 'tel')}
            ${editField('Ciudad', 'edit-city', order.city)}
            ${editField('Dirección', 'edit-address', order.address, 'textarea')}
          ` : `
            ${viewField('Nombre', order.name)}
            ${viewField('Email', order.email)}
            ${viewField('WhatsApp', order.whatsapp)}
            ${viewField('Ciudad', order.city)}
            ${viewField('Dirección', order.address)}
          `}
          <a href="https://wa.me/${order.whatsapp?.replace(/\D/g,'')}"
             target="_blank"
             class="mt-1 inline-flex items-center gap-2 bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-xl hover:bg-green-600 transition">
            Abrir WhatsApp →
          </a>
        </div>

        <!-- Pedido -->
        <div class="detail-section">
          <p class="detail-label">Pedido</p>
          ${editMode ? `
            <div class="mb-3">
              <label class="detail-sublabel">Batch</label>
              <select class="input text-sm" id="edit-batch">
                ${BATCHES.map(b =>
                  `<option value="${b.id}" ${order.batch_id === b.id ? 'selected' : ''}>${b.label}</option>`
                ).join('')}
              </select>
            </div>
            ${editField('Cantidad', 'edit-quantity', order.quantity, 'number')}
          ` : `
            ${viewField('Batch', batch?.label || order.batch_id)}
            ${viewField('Cantidad', order.quantity + ' álbum(es)')}
            ${viewField('Canal', order.channel)}
            ${viewField('Método de pago', order.payment_method)}
          `}
        </div>

        <!-- Fotos -->
        <div class="detail-section">
          <p class="detail-label">Link de fotos</p>
          ${editMode
            ? editField('', 'edit-photos', order.photos_link, 'url')
            : viewField('', order.photos_link
                ? `<a href="${order.photos_link}" target="_blank" class="text-blue-600 hover:underline text-sm">Ver fotos →</a>`
                : '—')
          }
        </div>

        <!-- Notas -->
        <div class="detail-section">
          <p class="detail-label">Notas</p>
          ${editMode
            ? editField('', 'edit-notes', order.notes, 'textarea')
            : viewField('', order.notes)
          }
        </div>

        <!-- Botones edición -->
        ${editMode ? `
          <div class="flex gap-3 mb-6">
            <button id="save-all" data-order-id="${order.order_id}"
                    class="flex-1 bg-zinc-900 text-white font-display font-bold py-3 rounded-xl hover:bg-zinc-700 transition">
              Guardar cambios
            </button>
            <button id="cancel-edit"
                    class="flex-1 bg-zinc-100 text-zinc-700 font-display font-bold py-3 rounded-xl hover:bg-zinc-200 transition">
              Cancelar
            </button>
          </div>
          <p id="save-msg" class="text-center text-sm mb-4 hidden"></p>
        ` : ''}

        <!-- Comprobante -->
        <div class="detail-section">
          <p class="detail-label">Comprobante de pago</p>
          ${order.proof_signed_url ? `
            <img src="${order.proof_signed_url}" alt="Comprobante"
                class="w-full rounded-xl border border-zinc-200 object-cover max-h-64 mb-2 cursor-zoom-in" />
            <button class="proof-fullscreen text-xs text-blue-600 hover:underline block mb-3 text-left"
              data-url="${order.proof_signed_url}">
              Ver en tamaño completo →
            </button>
          ` : `
            <div class="bg-zinc-50 rounded-xl p-4 text-center text-zinc-400 text-sm mb-3">
              Sin comprobante aún
            </div>
          `}
          <input type="file" id="proof-upload" accept="image/jpeg,image/png,application/pdf"
                 class="block w-full text-sm text-zinc-500
                        file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0
                        file:bg-zinc-900 file:text-white file:font-bold file:cursor-pointer
                        hover:file:bg-zinc-700" />
          <button id="upload-proof-btn" data-order-id="${order.order_id}"
                  class="mt-3 w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl hover:bg-blue-700 transition text-sm disabled:opacity-50"
                  disabled>
            Subir comprobante
          </button>
          <p id="proof-msg" class="text-center text-sm mt-2 hidden"></p>
        </div>

        <!-- Total -->
        <div class="detail-section">
          <p class="detail-label">Total</p>
          <div class="detail-card">
            <p><strong>Subtotal:</strong> ${formatCOP(order.subtotal)}</p>
            <p><strong>Envío:</strong> ${formatCOP(order.shipping)}</p>
            <p class="text-lg font-black mt-2">Total: ${formatCOP(order.total)}</p>
          </div>
        </div>

        <p class="text-xs text-zinc-400 text-center mt-2">
          Pedido recibido el ${formatDate(order.created_at)}
        </p>

      </div>
    </div>
  `
}

// ─── Render ─────────────────────────────────────────────────────────────────

function render() {
  const app = document.getElementById('admin-app');

  if (!state.authenticated) {
    app.innerHTML = viewLogin();
    attachLogin();
    return;
  }

  if (state.loading) {
    app.innerHTML = `
      <div class="min-h-screen flex items-center justify-center">
        <p class="text-zinc-400 animate-pulse">Cargando...</p>
      </div>
    `;
    return;
  }

  switch (state.view) {
    case 'dashboard':
      app.innerHTML = viewDashboard();
      break;
    case 'orders':
      app.innerHTML = viewOrders();
      break;
    case 'create':
      app.innerHTML = viewCreate();
      break;
  }

  attachEvents();
}

// ─── Event listeners ────────────────────────────────────────────────────────

function attachLogin() {
  document
    .getElementById('login-form')
    ?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const password = document.getElementById('login-password').value;
      const errEl = document.getElementById('login-error');
      errEl.classList.add('hidden');

      try {
        const { token } = await api('/api/admin/auth', 'POST', { password });
        sessionStorage.setItem('admin_token', token);
        state.authenticated = true;
        await loadData();
      } catch {
        errEl.classList.remove('hidden');
      }
    });
}

function attachEvents() {
  // Navegación
  document.querySelectorAll('[data-view]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.view = btn.dataset.view;
      render();
    });
  });

  // Cambiar estado de un pedido
  document.querySelectorAll('.status-select').forEach((sel) => {
    sel.addEventListener('change', async () => {
      const orderId = sel.dataset.orderId;
      const status = sel.value;
      try {
        await api('/api/admin/update-status', 'POST', {
          order_id: orderId,
          status,
        });
        const order = state.orders.find((o) => o.order_id === orderId);
        if (order) order.status = status;
        // Actualizar stats
        await loadData();
      } catch {
        sel.value = sel.dataset.current;
        alert('Error al actualizar el estado.');
      }
    });
  });

  // Filtros
  document.getElementById('filter-status')?.addEventListener('change', (e) => {
    state.filters.status = e.target.value;
    render();
  });
  document.getElementById('filter-batch')?.addEventListener('change', (e) => {
    state.filters.batch = e.target.value;
    render();
  });
  document.getElementById('filter-channel')?.addEventListener('change', (e) => {
    state.filters.channel = e.target.value;
    render();
  });

  // Resumen de precio al crear
  const batchSel = document.getElementById('create-batch');
  const zoneSel = document.getElementById('create-zone');
  const qtySel = document.getElementById('create-qty');

  function updateCreateSummary() {
    const batch = BATCHES.find((b) => b.id === batchSel?.value);
    const zone = SHIPPING_OPTIONS.find((o) => o.id === zoneSel?.value);
    const qty = parseInt(qtySel?.value) || 0;

    if (!batch || !zone || !qty) {
      document.getElementById('create-summary')?.classList.add('hidden');
      return;
    }

    const subtotal = batch.price * qty;
    const shipping = zone.cost;
    const total = subtotal + shipping;

    document.getElementById('cs-subtotal').textContent = formatCOP(subtotal);
    document.getElementById('cs-shipping').textContent = formatCOP(shipping);
    document.getElementById('cs-total').textContent = formatCOP(total);
    document.getElementById('create-summary')?.classList.remove('hidden');

    // Guardar para el submit
    document.getElementById('create-form').dataset.subtotal = subtotal;
    document.getElementById('create-form').dataset.shipping = shipping;
    document.getElementById('create-form').dataset.total = total;
  }

  batchSel?.addEventListener('change', updateCreateSummary);
  zoneSel?.addEventListener('change', updateCreateSummary);
  qtySel?.addEventListener('input', updateCreateSummary);

  // Submit crear pedido
  document
    .getElementById('create-form')
    ?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const errEl = document.getElementById('create-error');
      const btn = document.getElementById('create-submit');
      errEl.classList.add('hidden');
      btn.disabled = true;
      btn.textContent = 'Creando...';

      const data = Object.fromEntries(new FormData(form));

      if (!form.dataset.total) {
        errEl.textContent =
          'Completa batch, zona y cantidad para calcular el total.';
        errEl.classList.remove('hidden');
        btn.disabled = false;
        btn.textContent = 'Crear pedido';
        return;
      }

      try {
        const order_id = generateOrderId();
        await api('/api/admin/create-order', 'POST', {
          ...data,
          order_id,
          subtotal: form.dataset.subtotal,
          shipping: form.dataset.shipping,
          total: form.dataset.total,
        });

        await loadData();
        state.view = 'orders';
        render();
      } catch (err) {
        let msg = 'Error al crear el pedido.';
        try {
          const data = await err?.response?.json();
          if (data?.error) msg += ` ${data.error}`;
        } catch {}
        errEl.textContent = msg + ` (${err.message})`;
        errEl.classList.remove('hidden');
        btn.disabled = false;
        btn.textContent = 'Crear pedido';
      }
    });

  // Abrir panel de detalles al hacer clic en una fila
  document.querySelectorAll('tbody tr').forEach(row => {
    row.style.cursor = 'pointer'
    row.addEventListener('click', (e) => {
      // No abrir si hicieron clic en el select de estado o el link de WA
      if (e.target.closest('select') || e.target.closest('a')) return

      const orderId = row.querySelector('.status-select')?.dataset.orderId
      if (!orderId) return

      const order = state.orders.find(o => o.order_id === orderId)
      if (!order) return

      openDetailPanel(order)
    })
  });
}

function openDetailPanel(order, editMode = false) {
  document.getElementById('detail-overlay')?.remove()

  const div = document.createElement('div')
  div.innerHTML = orderDetailPanel(order, editMode)
  document.body.appendChild(div.firstElementChild)

  // Cerrar al hacer clic en el overlay
  document.getElementById('detail-overlay')?.addEventListener('click', e => {
    if (e.target.id === 'detail-overlay') closeDetailPanel()
  })

  // Botón cerrar (✕)
  document.getElementById('close-detail')?.addEventListener('click', closeDetailPanel)

  // Lápiz: activar modo edición
  document.getElementById('toggle-edit')?.addEventListener('click', () => {
    const current = state.orders.find(o => o.order_id === order.order_id)
    closeDetailPanel()
    openDetailPanel(current, true)
  })

  // Cancelar: volver a modo vista
  document.getElementById('cancel-edit')?.addEventListener('click', () => {
    const current = state.orders.find(o => o.order_id === order.order_id)
    closeDetailPanel()
    openDetailPanel(current, false)
  })

  // Cambiar estado
  document.querySelector('.detail-status-select')?.addEventListener('change', async e => {
    try {
      const { order: updated } = await api('/api/admin/update-status', 'POST', {
        order_id: e.target.dataset.orderId,
        status: e.target.value
      })
      updateOrderInState(updated)
    } catch { alert('Error al actualizar el estado.') }
  })

  // Guardar cambios
  document.getElementById('save-all')?.addEventListener('click', async () => {
    const btn     = document.getElementById('save-all')
    const msg     = document.getElementById('save-msg')
    const orderId = btn.dataset.orderId

    btn.disabled    = true
    btn.textContent = 'Guardando...'

    try {
      const { order: updated } = await api('/api/admin/update-order', 'POST', {
        order_id:    orderId,
        name:        document.getElementById('edit-name')?.value,
        email:       document.getElementById('edit-email')?.value,
        whatsapp:    document.getElementById('edit-whatsapp')?.value,
        city:        document.getElementById('edit-city')?.value,
        address:     document.getElementById('edit-address')?.value,
        batch_id:    document.getElementById('edit-batch')?.value,
        quantity:    document.getElementById('edit-quantity')?.value,
        photos_link: document.getElementById('edit-photos')?.value,
        notes:       document.getElementById('edit-notes')?.value
      })

      updateOrderInState(updated)
      closeDetailPanel()
      openDetailPanel(updated, false)
    } catch {
      msg.textContent = 'Error al guardar.'
      msg.style.color = 'red'
      msg.classList.remove('hidden')
      btn.disabled    = false
      btn.textContent = 'Guardar cambios'
    }
  })

  // Habilitar botón de subir comprobante
  const proofInput = document.getElementById('proof-upload')
  const proofBtn   = document.getElementById('upload-proof-btn')

  proofInput?.addEventListener('change', () => {
    proofBtn.disabled = !proofInput.files.length
  })

  // Subir comprobante
  proofBtn?.addEventListener('click', async () => {
    const file    = proofInput.files[0]
    const orderId = proofBtn.dataset.orderId
    const msgEl   = document.getElementById('proof-msg')

    if (!file) return

    proofBtn.disabled    = true
    proofBtn.textContent = 'Subiendo...'

    try {
      const base64 = await fileToBase64(file)
      const { order: updated } = await api('/api/admin/upload-proof', 'POST', {
        order_id:    orderId,
        filename:    file.name,
        contentType: file.type,
        data:        base64
      })

      updateOrderInState(updated)
      msgEl.textContent = '¡Comprobante subido!'
      msgEl.style.color = 'green'
      msgEl.classList.remove('hidden')

      setTimeout(() => {
        closeDetailPanel()
        openDetailPanel(updated, false)
      }, 800)
    } catch {
      msgEl.textContent = 'Error al subir el archivo.'
      msgEl.style.color = 'red'
      msgEl.classList.remove('hidden')
      proofBtn.disabled    = false
      proofBtn.textContent = 'Subir comprobante'
    }
  })

    document.querySelector('.proof-fullscreen')?.addEventListener('click', e => {
      const url = e.target.dataset.url
      const w = window.open('', '_blank')
      w.document.write(`<html><body style="margin:0;background:#000;display:flex;align-items:center;justify-content:center;min-height:100vh"><img src="${url}" style="max-width:100%;max-height:100vh;object-fit:contain"></body></html>`)
      w.document.close()
    })
}

function updateOrderInState(updated) {
  const idx = state.orders.findIndex(o => o.order_id === updated.order_id)
  if (idx !== -1) state.orders[idx] = updated
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result.split(',')[1])
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

function closeDetailPanel() {
  const overlay = document.getElementById('detail-overlay')
  if (overlay) {
    overlay.style.animation = 'fadeIn 0.15s ease reverse'
    setTimeout(() => overlay.remove(), 150)
  }
}

// ─── Data ──────────────────────────────────────────────────────────────────

async function loadData() {
  state.loading = true;
  render();

  try {
    const { orders, stats } = await api('/api/admin/orders');
    state.orders = orders;
    state.stats = stats;
  } catch {
    alert('Error al cargar los datos. Verifica tu conexión.');
  }

  state.loading = false;
  render();
}

// ─── Estilos de formulario inline ──────────────────────────────────────────

const style = document.createElement('style');
style.textContent = `
  .label { display: block; font-size: 13px; font-weight: 600; color: #52525b; margin-bottom: 4px; }
  .input { width: 100%; border: 2px solid #e4e4e7; border-radius: 10px; padding: 10px 14px;
           font-size: 14px; background: white; transition: border-color 0.2s; font-family: inherit; }
  .input:focus { outline: none; border-color: #18181b; }
`;
document.head.appendChild(style);

// ─── Init ──────────────────────────────────────────────────────────────────

function init() {
  const token = sessionStorage.getItem('admin_token');
  if (token) {
    state.authenticated = true;
    loadData();
  } else {
    render();
  }
}

init();
