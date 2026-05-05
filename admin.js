// ─── Default content (mirrors index.html defaults) ───────────────────────────
const DEFAULTS = {
  geral: {
    tagline: 'MAIS QUE CAFÉ, UM ENCONTRO',
    heroTitle: 'Mais que <span class="highlight">café</span>,<br> um <span class="highlight">encontro.</span>',
    heroSub: 'Sabores que acolhem.\nTexturas que envolvem.\nUm momento só seu\nou para compartilhar.',
    heroBtn: 'Quero Experimentar',
    ctaTitle: 'MAIS QUE ALIMENTOS,<br>MOMENTOS.',
    ctaText: 'Aqui cada escolha tem propósito. Seja sozinha ou em boa companhia, seu momento Dali sempre será especial.',
    ctaSig: 'Dali. Tudo fácil pra você.',
  },
  historia: {
    subtitle: 'SOBRE NÓS',
    title: 'Nossa História',
    text: 'A Dali nasceu de um amor profundo pelo café e pela experiência de compartilhar momentos especiais. Mais do que uma marca, somos um convite para desacelerar e saborear o melhor da vida.\n\nCada produto foi criado com cuidado e intenção — combinando nutrição, sabor e praticidade para que você possa criar memórias afetivas no café da manhã e no lanche da tarde.\n\nAcreditamos que alimentação é afeto. Que um bom café pode transformar o início do dia. Que a pausa certa pode mudar tudo.',
    sig: 'Dali. Um encontro que transforma.',
  },
  valores: {
    secSub: 'MENU DEGUSTAÇÃO DALI',
    secTitle: 'Um novo jeito de viver o café da manhã e o lanche da tarde.',
    secDesc: 'Criamos o Menu Degustação Dali para transformar pausas simples em experiências memoráveis. Cada item foi pensado para equilibrar nutrição, leveza e prazer.',
    secSig: 'Tudo fácil pra você.',
    items: [
      { icon: 'fa-mug-saucer', title: 'SABOR', desc: 'Ingredientes selecionados para despertar sentidos.' },
      { icon: 'fa-heart', title: 'NUTRIÇÃO', desc: 'Escolhas saudáveis que nutrem o corpo e a alma.' },
      { icon: 'fa-leaf', title: 'PRATICIDADE', desc: 'Opções práticas para o seu dia a dia, sem abrir mão do sabor.' },
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
      { icon: 'fa-bowl-food', name: 'Iogurte com geleia e granola' },
      { icon: 'fa-apple-whole', name: 'Mix de frutas com oleaginosas' },
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

// ─── Auth ─────────────────────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'dali@2024';
const AUTH_KEY = 'dali-admin-auth';

function isAuthenticated() {
  return sessionStorage.getItem(AUTH_KEY) === '1';
}

function authenticate(password) {
  return password === ADMIN_PASSWORD;
}

// ─── localStorage helpers ─────────────────────────────────────────────────────
function getData() {
  try {
    return JSON.parse(localStorage.getItem('dali-data') || '{}');
  } catch {
    return {};
  }
}

function setData(data) {
  localStorage.setItem('dali-data', JSON.stringify(data));
}

function mergeDefaults(data) {
  const result = {};
  for (const key of Object.keys(DEFAULTS)) {
    result[key] = Object.assign({}, DEFAULTS[key], data[key] || {});
    // Deep merge arrays
    if (key === 'valores' && data[key]?.items) {
      result[key].items = data[key].items;
    }
    if (key === 'combinacoes' && data[key]?.items) {
      result[key].items = data[key].items;
    }
    if (key === 'cardapio') {
      if (data[key]?.frescor) result[key].frescor = data[key].frescor;
      if (data[key]?.diaDia) result[key].diaDia = data[key].diaDia;
    }
  }
  return result;
}

// ─── Tab management ───────────────────────────────────────────────────────────
const TAB_TITLES = {
  geral: 'Configurações Gerais',
  historia: 'História da Marca',
  valores: 'Nossos Valores',
  combinacoes: 'Menu — Combinações',
  cardapio: 'Cardápio do Dia',
};

function switchTab(name) {
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.tab === name));
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.id === `tab-${name}`));
  document.getElementById('tab-title').textContent = TAB_TITLES[name] || '';
}

// ─── Form population ──────────────────────────────────────────────────────────
function val(id, fallback = '') {
  return document.getElementById(id)?.value ?? fallback;
}

function setVal(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value ?? '';
}

function loadAllForms() {
  const data = mergeDefaults(getData());

  // Geral
  setVal('g-tagline', data.geral.tagline);
  setVal('g-hero-title', data.geral.heroTitle);
  setVal('g-hero-sub', data.geral.heroSub);
  setVal('g-hero-btn', data.geral.heroBtn);
  setVal('g-cta-title', data.geral.ctaTitle);
  setVal('g-cta-text', data.geral.ctaText);
  setVal('g-cta-sig', data.geral.ctaSig);

  // Historia
  setVal('h-subtitle', data.historia.subtitle);
  setVal('h-title', data.historia.title);
  setVal('h-text', data.historia.text);
  setVal('h-sig', data.historia.sig);

  // Valores
  setVal('v-sec-sub', data.valores.secSub);
  setVal('v-sec-title', data.valores.secTitle);
  setVal('v-sec-desc', data.valores.secDesc);
  setVal('v-sec-sig', data.valores.secSig);
  data.valores.items.forEach((item, i) => {
    const n = i + 1;
    setVal(`v-${n}-icon`, item.icon);
    setVal(`v-${n}-title`, item.title);
    setVal(`v-${n}-desc`, item.desc);
    updateIconPreview(n, item.icon);
  });

  // Combinações
  setVal('c-title', data.combinacoes.title);
  data.combinacoes.items.forEach((item, i) => setVal(`c-${i + 1}-name`, item.name));

  // Cardápio
  data.cardapio.frescor.forEach((item, i) => {
    setVal(`f-${i + 1}-name`, item.name);
    setVal(`f-${i + 1}-icon`, item.icon);
  });
  setVal('f-info', data.cardapio.frescorInfo);
  data.cardapio.diaDia.forEach((name, i) => setVal(`d-${i + 1}`, name));
}

// ─── Save sections ────────────────────────────────────────────────────────────
function saveSection(section) {
  const data = getData();

  if (section === 'geral') {
    data.geral = {
      tagline: val('g-tagline'),
      heroTitle: val('g-hero-title'),
      heroSub: val('g-hero-sub'),
      heroBtn: val('g-hero-btn'),
      ctaTitle: val('g-cta-title'),
      ctaText: val('g-cta-text'),
      ctaSig: val('g-cta-sig'),
    };
  }

  if (section === 'historia') {
    data.historia = {
      subtitle: val('h-subtitle'),
      title: val('h-title'),
      text: val('h-text'),
      sig: val('h-sig'),
    };
  }

  if (section === 'valores') {
    data.valores = {
      secSub: val('v-sec-sub'),
      secTitle: val('v-sec-title'),
      secDesc: val('v-sec-desc'),
      secSig: val('v-sec-sig'),
      items: [1, 2, 3].map(n => ({
        icon: val(`v-${n}-icon`),
        title: val(`v-${n}-title`),
        desc: val(`v-${n}-desc`),
      })),
    };
  }

  if (section === 'combinacoes') {
    data.combinacoes = {
      title: val('c-title'),
      items: [1, 2, 3].map(n => ({ name: val(`c-${n}-name`) })),
    };
  }

  if (section === 'cardapio') {
    data.cardapio = {
      frescor: [1, 2, 3].map(n => ({
        icon: val(`f-${n}-icon`) || 'fa-circle-dot',
        name: val(`f-${n}-name`),
      })),
      frescorInfo: val('f-info'),
      diaDia: [1, 2, 3, 4, 5].map(n => val(`d-${n}`)),
    };
  }

  setData(data);
  showToast('Salvo com sucesso!');
}

// ─── Reset ────────────────────────────────────────────────────────────────────
function resetDefaults() {
  if (!confirm('Redefinir todos os textos para os valores padrão? Esta ação não pode ser desfeita.')) return;
  localStorage.removeItem('dali-data');
  loadAllForms();
  showToast('Padrões restaurados!');
}

// ─── Icon preview ─────────────────────────────────────────────────────────────
function updateIconPreview(n, iconClass) {
  const preview = document.getElementById(`v-${n}-preview`);
  if (!preview) return;
  const i = preview.querySelector('i');
  if (i) i.className = `fa-solid ${iconClass || 'fa-star'}`;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, isError = false) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  if (!toast || !msgEl) return;
  clearTimeout(toastTimer);
  msgEl.textContent = msg;
  toast.classList.toggle('toast-error', isError);
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add('show'));
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => { toast.hidden = true; }, 350);
  }, 2800);
}

// ─── Mobile sidebar toggle ────────────────────────────────────────────────────
function initMobileSidebar() {
  const toggle = document.getElementById('sidebar-toggle');
  const sidebar = document.querySelector('.sidebar');
  if (!toggle || !sidebar) return;
  toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Check existing auth
  if (isAuthenticated()) {
    document.getElementById('login-screen').hidden = true;
    document.getElementById('admin-panel').hidden = false;
    loadAllForms();
  }

  // Login form
  document.getElementById('login-form').addEventListener('submit', e => {
    e.preventDefault();
    const pw = document.getElementById('password-input').value;
    const errEl = document.getElementById('login-error');
    if (authenticate(pw)) {
      sessionStorage.setItem(AUTH_KEY, '1');
      document.getElementById('login-screen').hidden = true;
      const panel = document.getElementById('admin-panel');
      panel.hidden = false;
      loadAllForms();
      errEl.hidden = true;
    } else {
      errEl.hidden = false;
      document.getElementById('password-input').value = '';
      document.getElementById('password-input').focus();
    }
  });

  // Password toggle
  document.getElementById('toggle-pw').addEventListener('click', () => {
    const input = document.getElementById('password-input');
    const icon = document.querySelector('#toggle-pw i');
    if (input.type === 'password') {
      input.type = 'text';
      icon.className = 'fa-solid fa-eye-slash';
    } else {
      input.type = 'password';
      icon.className = 'fa-solid fa-eye';
    }
  });

  // Tab navigation
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
      // Close mobile sidebar after tab click
      document.querySelector('.sidebar')?.classList.remove('open');
    });
  });

  // Save buttons
  document.querySelectorAll('.btn-save').forEach(btn => {
    btn.addEventListener('click', () => saveSection(btn.dataset.section));
  });

  // Reset
  document.getElementById('reset-btn').addEventListener('click', resetDefaults);

  // Logout
  document.getElementById('logout-btn').addEventListener('click', () => {
    sessionStorage.removeItem(AUTH_KEY);
    document.getElementById('admin-panel').hidden = true;
    document.getElementById('login-screen').hidden = false;
    document.getElementById('password-input').value = '';
  });

  // Icon live preview
  [1, 2, 3].forEach(n => {
    const input = document.getElementById(`v-${n}-icon`);
    if (input) {
      input.addEventListener('input', () => updateIconPreview(n, input.value));
    }
  });

  // Mobile sidebar
  initMobileSidebar();
});
