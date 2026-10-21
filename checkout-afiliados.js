/* Adicione à vitrine com defer. Não contém credenciais. */
(() => {
  'use strict';
  const checkout = 'https://srv2076909.hstgr.cloud/';
  const storageKey = 'duque-checkout-affiliate';
  const params = new URLSearchParams(location.search);
  const valid = value => typeof value === 'string' && /^[a-z][a-z0-9-]{1,39}$/.test(value);
  let affiliate = null;
  if (params.has('ref')) {
    affiliate = valid(params.get('ref')) ? params.get('ref') : null;
    try {
      if (affiliate) sessionStorage.setItem(storageKey, affiliate);
      else sessionStorage.removeItem(storageKey);
    } catch { /* A referência da URL atual ainda pode ser usada sem armazenamento. */ }
  } else {
    try { const saved = sessionStorage.getItem(storageKey); if (valid(saved)) affiliate = saved; } catch {}
  }
  function connectButtons() {
    for (const link of document.querySelectorAll('a[data-checkout-pack]')) {
      const pack = link.dataset.checkoutPack;
      if (!/^[a-z][a-z0-9_-]{0,63}$/.test(pack || '')) continue;
      const destination = new URL(checkout);
      destination.searchParams.set('pack', pack);
      if (affiliate) destination.searchParams.set('ref', affiliate);
      link.href = destination.href;
      // Master e Hot usam este endereço ao confirmar o aviso de idade.
      link.dataset.paymentUrl = destination.href;
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', connectButtons, { once: true });
  else connectButtons();

  // Apenas identificadores aleatórios; sem email, telefone ou dados da compra.
  try {
    if (navigator.doNotTrack === '1' || navigator.globalPrivacyControl === true) return;
    const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    let visitorId = localStorage.getItem('duque-audience-visitor');
    if (!uuid.test(visitorId || '')) {
      visitorId = crypto.randomUUID();
      localStorage.setItem('duque-audience-visitor', visitorId);
    }
    let previous;
    try { previous = JSON.parse(localStorage.getItem('duque-audience-visit') || 'null'); } catch {}
    const now = Date.now();
    const age = now - previous?.seenAt;
    const visitId = uuid.test(previous?.id || '') && Number.isFinite(age) && age >= 0 && age < 30 * 60 * 1000
      ? previous.id : crypto.randomUUID();
    localStorage.setItem('duque-audience-visit', JSON.stringify({ id: visitId, seenAt: now }));
    fetch(new URL('/api/visit', checkout).href, {
      method: 'POST', credentials: 'omit', keepalive: true,
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify({ visitorId, visitId })
    }).catch(() => {});
  } catch { /* Falhas no contador não interrompem a compra. */ }
})();
