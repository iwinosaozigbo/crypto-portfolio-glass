// ==========================================================================
// UNIFIED PRIVATE BANKING CONTROLLER
// Hardcoded Credentials: Username = IWINOSA | Login PIN = 123456
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const VALID_USERNAME = 'IWINOSA';
  const VALID_PIN = '123456';

  // Force Fullscreen on load and on first user interaction
  function enterFullscreen() {
    const el = document.documentElement;
    if (
      !document.fullscreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      const req =
        el.requestFullscreen ||
        el.webkitRequestFullscreen ||
        el.msRequestFullscreen;
      if (req) {
        try {
          const p = req.call(el);
          if (p && typeof p.catch === 'function') p.catch(() => {});
        } catch (_) {}
      }
    }
    window.scrollTo(0, 1);
  }

  // Try immediately on open
  enterFullscreen();

  // Also trigger automatically on the very first touch/click/key anywhere
  ['pointerdown', 'touchstart', 'click', 'keydown'].forEach((evt) => {
    window.addEventListener(evt, enterFullscreen, { once: true, passive: true });
  });

  const loginView = document.getElementById('login-view');
  const dashboardView = document.getElementById('dashboard-view');
  const loginForm = document.getElementById('login-form');
  const usernameInput = document.getElementById('login-username');
  const pinInput = document.getElementById('login-pin');
  const loginError = document.getElementById('login-error');
  const pinDots = document.querySelectorAll('#pin-dots span');
  const togglePinVisBtn = document.getElementById('toggle-pin-vis');
  const logoutBtn = document.getElementById('logout-btn');
  const navProfileBtn = document.getElementById('nav-profile-btn');
  const navTopBtn = document.getElementById('nav-top-btn');
  const navStatsBtn = document.getElementById('nav-stats-btn');
  const scrollArea = document.getElementById('dashboard-scroll-area');
  const allocationSection = document.getElementById('allocation-card-section');
  const focusAllocationBtn = document.getElementById('focus-allocation-btn');

  // Update 6-dot PIN progress indicator
  function syncPinDots() {
    const len = (pinInput?.value || '').length;
    pinDots.forEach((dot, idx) => {
      dot.classList.toggle('filled', idx < len);
    });
    if (loginError && !loginError.hidden) {
      loginError.hidden = true;
    }
  }

  if (pinInput) {
    pinInput.addEventListener('input', () => {
      pinInput.value = pinInput.value.replace(/\D/g, '').slice(0, 6);
      syncPinDots();
    });
  }

  if (usernameInput) {
    usernameInput.addEventListener('input', () => {
      if (loginError && !loginError.hidden) {
        loginError.hidden = true;
      }
    });
  }

  // Show / Hide PIN toggle
  if (togglePinVisBtn && pinInput) {
    togglePinVisBtn.addEventListener('click', () => {
      const isHidden = pinInput.type === 'password';
      pinInput.type = isHidden ? 'text' : 'password';
      togglePinVisBtn.textContent = isHidden ? 'Hide' : 'Show';
    });
  }

  // Tactile PIN Keypad buttons
  document.querySelectorAll('.key-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      enterFullscreen();
      if (!pinInput) return;
      const key = btn.getAttribute('data-key');
      if (key === 'clear') {
        pinInput.value = '';
      } else if (key === 'back') {
        pinInput.value = pinInput.value.slice(0, -1);
      } else if (key && pinInput.value.length < 6) {
        pinInput.value += key;
      }
      syncPinDots();
    });
  });

  // Validate Login (Username: IWINOSA, PIN: 123456)
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      enterFullscreen();
      const enteredUser = (usernameInput?.value || '').trim().toUpperCase();
      const enteredPin = (pinInput?.value || '').trim();

      if (enteredUser === VALID_USERNAME && enteredPin === VALID_PIN) {
        loginError.hidden = true;
        loginView.hidden = true;
        dashboardView.hidden = false;
        window.scrollTo({ top: 0, behavior: 'instant' });
      } else {
        loginError.hidden = false;
        loginForm.classList.remove('shake');
        void loginForm.offsetWidth;
        loginForm.classList.add('shake');
      }
    });
  }

  // Lock / Sign Out back to Login View
  function lockAccount() {
    dashboardView.hidden = true;
    loginView.hidden = false;
    if (pinInput) pinInput.value = '';
    syncPinDots();
  }

  if (logoutBtn) logoutBtn.addEventListener('click', lockAccount);
  if (navProfileBtn) navProfileBtn.addEventListener('click', lockAccount);

  // Smooth scrolling inside unified dashboard
  if (navTopBtn) {
    navTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function scrollToAllocation() {
    if (allocationSection) {
      allocationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  if (navStatsBtn) navStatsBtn.addEventListener('click', scrollToAllocation);
  if (focusAllocationBtn) focusAllocationBtn.addEventListener('click', scrollToAllocation);

  // Interactive Bar Chart & Period Toggle
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

  // Cadence Toggle & Matrix Bubble Cycle
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

  // 3D Chrome & Frosted Glass Account Value Card Actions
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

  function formatAccountBalance(cents) {
    const whole = Math.floor(Math.abs(cents) / 100);
    const dec = String(Math.abs(cents) % 100).padStart(2, '0');
    const wholeFormatted = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return `$${wholeFormatted}.${dec}`;
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
        modalDesc.textContent = 'Transfer balance to Checking or Savings';
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
