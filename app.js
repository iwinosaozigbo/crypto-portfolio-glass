// ==========================================================================
// INTERACTIVE CONTROLLER: CRYPTO PORTFOLIO & 3D CHROME GLASS ACCOUNT CARD
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Floating View Mode Switcher
  const switchBtns = document.querySelectorAll('.switch-btn');
  switchBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      switchBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.getAttribute('data-view');
      if (view === 'all') {
        document.body.removeAttribute('data-mode');
      } else {
        document.body.setAttribute('data-mode', view);
      }
    });
  });

  // 2. Left Phone: Interactive Bar Chart & Period Toggle
  const incomeDisplay = document.getElementById('total-income-display');
  const calloutPercent = document.getElementById('callout-percent');
  const bars = document.querySelectorAll('.chart-bar');

  bars.forEach((bar) => {
    bar.addEventListener('click', () => {
      const income = bar.getAttribute('data-income');
      const pct = bar.getAttribute('data-pct');
      if (incomeDisplay && income) incomeDisplay.textContent = income;
      if (calloutPercent && pct) calloutPercent.textContent = pct;
    });
  });

  const periodBtn = document.getElementById('period-toggle-btn');
  const periods = [
    { label: '30 Days', income: '$8,72K', pct: '+73%' },
    { label: '7 Days', income: '$2,14K', pct: '+18%' },
    { label: '90 Days', income: '$24,90K', pct: '+112%' },
  ];
  let periodIdx = 0;

  if (periodBtn) {
    periodBtn.addEventListener('click', () => {
      periodIdx = (periodIdx + 1) % periods.length;
      periodBtn.textContent = periods[periodIdx].label;
      if (incomeDisplay) incomeDisplay.textContent = periods[periodIdx].income;
      if (calloutPercent) calloutPercent.textContent = periods[periodIdx].pct;
    });
  }

  // 3. Left Phone -> Right Phone Focus Highlight
  const focusHoldingsBtn = document.getElementById('focus-holdings-btn');
  const rightPhone = document.getElementById('phone-holdings');
  if (focusHoldingsBtn && rightPhone) {
    focusHoldingsBtn.addEventListener('click', () => {
      rightPhone.classList.add('pulse-highlight');
      rightPhone.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => rightPhone.classList.remove('pulse-highlight'), 900);
    });
  }

  // 4. Right Phone: Cadence Toggle & Matrix Bubble Cycle
  const cadenceBtn = document.getElementById('cadence-btn');
  const cadenceLabel = document.getElementById('cadence-label');
  const allocationTotalVal = document.getElementById('allocation-total-val');
  const cadences = [
    { label: 'Weekly', total: '$17.3K' },
    { label: 'Monthly', total: '$68.4K' },
    { label: 'Daily', total: '$2.47K' },
  ];
  let cadenceIdx = 0;

  if (cadenceBtn) {
    cadenceBtn.addEventListener('click', () => {
      cadenceIdx = (cadenceIdx + 1) % cadences.length;
      if (cadenceLabel) cadenceLabel.textContent = cadences[cadenceIdx].label;
      if (allocationTotalVal) allocationTotalVal.textContent = cadences[cadenceIdx].total;
    });
  }

  const bubbleClasses = [
    'b-dark-hatch',
    'b-olive-solid',
    'b-light-hatch',
    'b-mid-hatch',
    'b-light-solid',
  ];
  document.querySelectorAll('.bubble').forEach((bubble) => {
    bubble.addEventListener('click', () => {
      const currentIdx = bubbleClasses.findIndex((cls) => bubble.classList.contains(cls));
      if (currentIdx !== -1) {
        bubble.classList.remove(bubbleClasses[currentIdx]);
        const nextIdx = (currentIdx + 1) % bubbleClasses.length;
        bubble.classList.add(bubbleClasses[nextIdx]);
      }
    });
  });

  // 5. Section 2: 3D Chrome & Frosted Glass Account Value Card Actions
  const DEFAULT_BALANCE_CENTS = 8734800; // $87.348,00
  let currentBalanceCents = DEFAULT_BALANCE_CENTS;
  let activeAction = 'add';

  const balanceEl = document.getElementById('account-balance-val');
  const modalEl = document.getElementById('glass-action-modal');
  const modalTitle = document.getElementById('glass-modal-title');
  const modalDesc = document.getElementById('glass-modal-desc');
  const amountInput = document.getElementById('glass-amount-input');
  const closeBtn = document.getElementById('glass-modal-close');
  const resetBtn = document.getElementById('glass-reset-btn');
  const confirmBtn = document.getElementById('glass-confirm-btn');

  // Format cents into exact European/International "$87.348,00" notation
  function formatAccountBalance(cents) {
    const whole = Math.floor(Math.abs(cents) / 100);
    const dec = String(Math.abs(cents) % 100).padStart(2, '0');
    const wholeFormatted = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `$${wholeFormatted},${dec}`;
  }

  document.querySelectorAll('.glass-action-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeAction = btn.getAttribute('data-action') || 'add';
      if (activeAction === 'pay') {
        modalTitle.textContent = 'Pay from Account';
        modalDesc.textContent = 'Send an instant payment from Account ID: 8674';
      } else if (activeAction === 'add') {
        modalTitle.textContent = 'Add Money';
        modalDesc.textContent = 'Deposit funds directly into Account ID: 8674';
      } else {
        modalTitle.textContent = 'Transfer Funds';
        modalDesc.textContent = 'Transfer balance to an external wallet or account';
      }
      modalEl.hidden = false;
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modalEl.hidden = true;
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      currentBalanceCents = DEFAULT_BALANCE_CENTS;
      balanceEl.textContent = formatAccountBalance(currentBalanceCents);
      modalEl.hidden = true;
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      const val = parseFloat(amountInput.value) || 0;
      const deltaCents = Math.round(val * 100);
      if (activeAction === 'add') {
        currentBalanceCents += deltaCents;
      } else {
        currentBalanceCents = Math.max(0, currentBalanceCents - deltaCents);
      }
      balanceEl.textContent = formatAccountBalance(currentBalanceCents);
      modalEl.hidden = true;
    });
  }
});
