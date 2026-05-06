// ─── Defaults ─────────────────────────────────────────────────────────────────
const DEFAULTS = {
  geral: {
    tagline:  'MAIS QUE CAFÉ, UM ENCONTRO',
    heroTitle: 'Mais que <span class="highlight">café</span>,<br> um <span class="highlight">encontro.</span>',
    heroSub:  'Sabores que acolhem.\nTexturas que envolvem.\nUm momento só seu\nou para compartilhar.',
    heroBtn:  'Quero Experimentar',
    ctaTitle: 'MAIS QUE ALIMENTOS,<br>MOMENTOS.',
    ctaText:  'Aqui cada escolha tem propósito. Seja sozinha ou em boa companhia, seu momento Dali sempre será especial.',
    ctaSig:   'Dali. Tudo fácil pra você.',
  },
  historia: {
    subtitle: 'SOBRE NÓS',
    title:    'Nossa História',
    text:     'A Dali nasceu de um amor profundo pelo café e pela experiência de compartilhar momentos especiais. Mais do que uma marca, somos um convite para desacelerar e saborear o melhor da vida.\n\nCada produto foi criado com cuidado e intenção — combinando nutrição, sabor e praticidade para que você possa criar memórias afetivas no café da manhã e no lanche da tarde.\n\nAcreditamos que alimentação é afeto. Que um bom café pode transformar o início do dia. Que a pausa certa pode mudar tudo.',
    sig:      'Dali. Um encontro que transforma.',
  },
  valores: {
    secSub:   'MENU DEGUSTAÇÃO DALI',
    secTitle: 'Um novo jeito de viver o café da manhã e o lanche da tarde.',
    secDesc:  'Criamos o Menu Degustação Dali para transformar pausas simples em experiências memoráveis. Cada item foi pensado para equilibrar nutrição, leveza e prazer.',
    secSig:   'Tudo fácil pra você.',
    items: [
      { icon: 'fa-mug-saucer', title: 'SABOR',       desc: 'Ingredientes selecionados para despertar sentidos.' },
      { icon: 'fa-heart',      title: 'NUTRIÇÃO',     desc: 'Escolhas saudáveis que nutrem o corpo e a alma.' },
      { icon: 'fa-leaf',       title: 'PRATICIDADE',  desc: 'Opções práticas para o seu dia a dia, sem abrir mão do sabor.' },
    ],
  },
  combinacoes: {
    title: 'COMBINAÇÕES QUE ENCANTAM',
    items: [
      { name: 'Biscoito de arroz com\ngeleia de frutas vermelhas' },
      { name: 'Torrada de cacau com\ncreme de amendoim' },
      { name: 'Seleção de biscoitos\nartesanais' },
    ],
  },
  cardapio: {
    frescor: [
      { icon: 'fa-bottle-water', name: 'Água saborizada' },
      { icon: 'fa-bowl-food',    name: 'Iogurte com geleia e granola' },
      { icon: 'fa-apple-whole',  name: 'Mix de frutas com oleaginosas' },
    ],
    frescorInfo: 'Incluímos também um pré-treino natural, ideal para quem busca disposição e vitalidade.',
    diaDia: [
      'Bisnaguinha de cenoura com creme de avelã',
      'Bisnaguinha integral com creme de queijo e ervas',
      'Bisnaguinha com patê',
      'Baguete de leite com salpicão',
      'Baguete natural (peito de peru, queijo, alface e tomate)',
    ],
  },
};

// ─── Config detection ─────────────────────────────────────────────────────────
const USE_FIREBASE   = window.FIREBASE_CONFIGURED === true;
const LEGACY_PW      = 'dali@2024';
const LEGACY_AUTH_KEY = 'dali-admin-auth';

// ─── Auth helpers ─────────────────────────────────────────────────────────────
function showPanel() {
  document.getElementById('login-screen').hidden = true;
  document.getElementById('admin-panel').hidden  = false;
  setStatusBadge(true);
}

function showLogin() {
  document.getElementById('admin-panel').hidden  = true;
  document.getElementById('login-screen').hidden = false;
}

function setLoginLoading(on) {
  const btn    = document.getElementById('login-btn');
  const icon   = document.getElementById('login-btn-icon');
  const spin   = document.getElementById('login-spinner');
  if (!btn) return;
  btn.disabled       = on;
  if (icon) icon.hidden  = on;
  if (spin) spin.hidden  = !on;
}

function showLoginError(msg) {
  const el = document.getElementById('login-error');
  if (!el) return;
  el.textContent = msg;
  el.hidden = !msg;
}

function fbErrorMessage(code) {
  const map = {
    'auth/user-not-found':       'Email não encontrado.',
    'auth/wrong-password':       'Senha incorreta.',
    'auth/invalid-email':        'Email inválido.',
    'auth/too-many-requests':    'Muitas tentativas. Aguarde alguns minutos.',
    'auth/invalid-credential':   'Email ou senha incorretos.',
    'auth/network-request-failed': 'Sem conexão. Verifique sua internet.',
  };
  return map[code] || 'Erro ao fazer login. Tente novamente.';
}

async function loginUser(email, password) {
  showLoginError('');

  // Legacy-only mode (Firebase not configured)
  if (!USE_FIREBASE) {
    if (password === LEGACY_PW) {
      sessionStorage.setItem(LEGACY_AUTH_KEY, '1');
      showPanel();
      await loadAllForms();
    } else {
      showLoginError('Senha incorreta. Tente novamente.');
    }
    return;
  }

  setLoginLoading(true);

  // Try Firebase Auth first; fall back to legacy password on failure
  try {
    await window.fbAuth.signInWithEmailAndPassword(email, password);
    // onAuthStateChanged will call showPanel() on success
  } catch (err) {
    // If Firebase Auth is not yet enabled or fails, try legacy password
    if (password === LEGACY_PW) {
      setLoginLoading(false);
      sessionStorage.setItem(LEGACY_AUTH_KEY, '1');
      showPanel();
      await loadAllForms();
    } else {
      showLoginError(fbErrorMessage(err.code));
      setLoginLoading(false);
    }
  }
}

function initAuth() {
  updateFirebaseBadge();

  // Check legacy session first (works both in Firebase and local modes)
  if (sessionStorage.getItem(LEGACY_AUTH_KEY) === '1') {
    showPanel();
    loadAllForms();
    return;
  }

  if (!USE_FIREBASE) {
    return;
  }

  window.fbAuth.onAuthStateChanged(async user => {
    setLoginLoading(false);
    if (user) {
      showPanel();
      await loadAllForms();
    } else {
      showLogin();
    }
  });
}

function updateFirebaseBadge() {
  const badge = document.getElementById('firebase-badge');
  const text  = document.getElementById('firebase-badge-text');
  if (!badge) return;
  badge.hidden = false;
  badge.className = USE_FIREBASE ? 'firebase-status firebase-on' : 'firebase-status firebase-off';
  if (text) text.textContent = USE_FIREBASE ? 'Firebase conectado' : 'Modo local (configure firebase-config.js)';
}

// ─── Status badge ─────────────────────────────────────────────────────────────
function setStatusBadge(online) {
  const badge = document.getElementById('status-badge');
  const text  = document.getElementById('status-text');
  if (!badge) return;
  if (USE_FIREBASE) {
    badge.className   = 'status-badge ' + (online ? 'online' : 'offline');
    if (text) text.textContent = online ? 'Firebase • online' : 'Firebase • offline';
  } else {
    badge.className   = 'status-badge local';
    if (text) text.textContent = 'Armazenamento local';
  }
}

// ─── Data layer ───────────────────────────────────────────────────────────────
async function getData() {
  if (!USE_FIREBASE) {
    try { return JSON.parse(localStorage.getItem('dali-data') || '{}'); } catch { return {}; }
  }
  try {
    const snap = await window.CONTENT_DOC.get();
    return snap.exists ? snap.data() : {};
  } catch (e) {
    console.error('[Admin] Firestore get:', e);
    setStatusBadge(false);
    return {};
  }
}

async function writeData(data) {
  if (!USE_FIREBASE) {
    localStorage.setItem('dali-data', JSON.stringify(data));
    return;
  }
  await window.CONTENT_DOC.set(data);
  setStatusBadge(true);
}

// ─── Deep merge with DEFAULTS ────────────────────────────────────────────────
function mergeDefaults(data) {
  const out = {};
  for (const key of Object.keys(DEFAULTS)) {
    out[key] = Object.assign({}, DEFAULTS[key], data[key] || {});
    if (key === 'valores'     && data[key]?.items)   out[key].items   = data[key].items;
    if (key === 'combinacoes' && data[key]?.items)   out[key].items   = data[key].items;
    if (key === 'cardapio') {
      if (data[key]?.frescor) out[key].frescor = data[key].frescor;
      if (data[key]?.diaDia)  out[key].diaDia  = data[key].diaDia;
    }
  }
  return out;
}

// ─── Tab management ───────────────────────────────────────────────────────────
const TAB_TITLES = {
  geral:       'Configurações Gerais',
  historia:    'Nossa História',
  valores:     'Nossos Valores',
  combinacoes: 'Menu — Combinações',
  cardapio:    'Cardápio do Dia',
};

function switchTab(name) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === `tab-${name}`));
  const title = document.getElementById('tab-title');
  if (title) title.textContent = TAB_TITLES[name] || '';
}

// ─── Form helpers ─────────────────────────────────────────────────────────────
function val(id, fallback = '') {
  return document.getElementById(id)?.value ?? fallback;
}

function setVal(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value ?? '';
}

function updateIconPreview(n, iconClass) {
  const preview = document.getElementById(`v-${n}-preview`);
  if (!preview) return;
  const i = preview.querySelector('i');
  if (i) i.className = `fa-solid ${iconClass || 'fa-star'}`;
}

// ─── Load all forms ──────────────────────────────────────────────────────────
async function loadAllForms() {
  const data = mergeDefaults(await getData());

  setVal('g-tagline',    data.geral.tagline);
  setVal('g-hero-title', data.geral.heroTitle);
  setVal('g-hero-sub',   data.geral.heroSub);
  setVal('g-hero-btn',   data.geral.heroBtn);
  setVal('g-cta-title',  data.geral.ctaTitle);
  setVal('g-cta-text',   data.geral.ctaText);
  setVal('g-cta-sig',    data.geral.ctaSig);

  setVal('h-subtitle', data.historia.subtitle);
  setVal('h-title',    data.historia.title);
  setVal('h-text',     data.historia.text);
  setVal('h-sig',      data.historia.sig);

  setVal('v-sec-sub',   data.valores.secSub);
  setVal('v-sec-title', data.valores.secTitle);
  setVal('v-sec-desc',  data.valores.secDesc);
  setVal('v-sec-sig',   data.valores.secSig);
  data.valores.items.forEach((item, i) => {
    const n = i + 1;
    setVal(`v-${n}-icon`,  item.icon);
    setVal(`v-${n}-title`, item.title);
    setVal(`v-${n}-desc`,  item.desc);
    updateIconPreview(n, item.icon);
  });

  setVal('c-title', data.combinacoes.title);
  data.combinacoes.items.forEach((item, i) => setVal(`c-${i + 1}-name`, item.name));

  data.cardapio.frescor.forEach((item, i) => {
    setVal(`f-${i + 1}-name`, item.name);
    setVal(`f-${i + 1}-icon`, item.icon);
  });
  setVal('f-info', data.cardapio.frescorInfo);
  data.cardapio.diaDia.forEach((name, i) => setVal(`d-${i + 1}`, name));
}

// ─── Build section data ───────────────────────────────────────────────────────
function buildSection(section) {
  if (section === 'geral') return {
    tagline:  val('g-tagline'),
    heroTitle: val('g-hero-title'),
    heroSub:  val('g-hero-sub'),
    heroBtn:  val('g-hero-btn'),
    ctaTitle: val('g-cta-title'),
    ctaText:  val('g-cta-text'),
    ctaSig:   val('g-cta-sig'),
  };

  if (section === 'historia') return {
    subtitle: val('h-subtitle'),
    title:    val('h-title'),
    text:     val('h-text'),
    sig:      val('h-sig'),
  };

  if (section === 'valores') return {
    secSub:   val('v-sec-sub'),
    secTitle: val('v-sec-title'),
    secDesc:  val('v-sec-desc'),
    secSig:   val('v-sec-sig'),
    items: [1, 2, 3].map(n => ({
      icon:  val(`v-${n}-icon`),
      title: val(`v-${n}-title`),
      desc:  val(`v-${n}-desc`),
    })),
  };

  if (section === 'combinacoes') return {
    title: val('c-title'),
    items: [1, 2, 3].map(n => ({ name: val(`c-${n}-name`) })),
  };

  if (section === 'cardapio') return {
    frescor: [1, 2, 3].map(n => ({
      icon: val(`f-${n}-icon`) || 'fa-circle-dot',
      name: val(`f-${n}-name`),
    })),
    frescorInfo: val('f-info'),
    diaDia: [1, 2, 3, 4, 5].map(n => val(`d-${n}`)),
  };

  return null;
}

// ─── Save section ─────────────────────────────────────────────────────────────
async function saveSection(section) {
  const btn      = document.querySelector(`[data-section="${section}"]`);
  const origHTML = btn?.innerHTML;

  if (btn) {
    btn.disabled  = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Salvando...';
  }

  try {
    const existing = await getData();
    existing[section] = buildSection(section);
    await writeData(existing);
    showToast('Salvo com sucesso!');
  } catch (err) {
    console.error('[Admin] Save error:', err);
    showToast('Erro ao salvar. Verifique a conexão.', true);
  } finally {
    if (btn) {
      btn.disabled  = false;
      btn.innerHTML = origHTML;
    }
  }
}

// ─── Reset to defaults ────────────────────────────────────────────────────────
async function resetDefaults() {
  if (!confirm('Redefinir todos os textos para os valores padrão?\nEsta ação não pode ser desfeita.')) return;
  try {
    if (USE_FIREBASE) {
      await window.CONTENT_DOC.delete();
    } else {
      localStorage.removeItem('dali-data');
    }
    await loadAllForms();
    showToast('Padrões restaurados!');
  } catch (err) {
    showToast('Erro ao redefinir.', true);
  }
}

// ─── Toast ────────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, isError = false) {
  const toast   = document.getElementById('toast');
  const msgEl   = document.getElementById('toast-msg');
  const iconEl  = document.getElementById('toast-icon');
  if (!toast || !msgEl) return;
  clearTimeout(toastTimer);
  msgEl.textContent = msg;
  toast.classList.toggle('toast-error', isError);
  if (iconEl) iconEl.className = isError
    ? 'fa-solid fa-circle-xmark'
    : 'fa-solid fa-circle-check';
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add('show'));
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => { toast.hidden = true; }, 350);
  }, 3000);
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Login form
  document.getElementById('login-form').addEventListener('submit', async e => {
    e.preventDefault();
    const email = (document.getElementById('email-input')?.value || '').trim();
    const pw    = document.getElementById('password-input').value;
    await loginUser(email, pw);
  });

  // Password toggle
  document.getElementById('toggle-pw')?.addEventListener('click', () => {
    const input = document.getElementById('password-input');
    const icon  = document.querySelector('#toggle-pw i');
    if (!input) return;
    const show = input.type === 'password';
    input.type       = show ? 'text' : 'password';
    if (icon) icon.className = show ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
  });

  // Tab navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
      document.querySelector('.sidebar')?.classList.remove('open');
    });
  });

  // Save buttons
  document.querySelectorAll('.btn-save').forEach(btn => {
    btn.addEventListener('click', () => saveSection(btn.dataset.section));
  });

  // Reset
  document.getElementById('reset-btn')?.addEventListener('click', resetDefaults);

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    if (USE_FIREBASE) {
      await window.fbAuth.signOut();
    } else {
      sessionStorage.removeItem(LEGACY_AUTH_KEY);
      showLogin();
    }
    document.getElementById('password-input').value = '';
    if (document.getElementById('email-input')) {
      document.getElementById('email-input').value = '';
    }
  });

  // Icon live preview
  [1, 2, 3].forEach(n => {
    document.getElementById(`v-${n}-icon`)?.addEventListener('input', e => {
      updateIconPreview(n, e.target.value);
    });
  });

  // Mobile sidebar toggle
  const toggle  = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  toggle?.addEventListener('click', () => sidebar?.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (sidebar && !sidebar.contains(e.target) && !toggle?.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });

  // Init auth
  initAuth();
});
