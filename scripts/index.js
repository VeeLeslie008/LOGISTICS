document.addEventListener('DOMContentLoaded', () => {

  // ── COUNT UP ANIMATION ──
  function countUp(el, target, decimals, duration = 1800) {
    const start = performance.now();
    const numberEl = el.querySelector('.stat-number');

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      if (target >= 1000) {
        numberEl.textContent = Math.floor(current).toLocaleString();
      } else {
        numberEl.textContent = current.toFixed(decimals);
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        numberEl.textContent = target >= 1000
          ? target.toLocaleString()
          : target.toFixed(decimals);
      }
    }
    requestAnimationFrame(update);
  }

  // ── SINGLE OBSERVER FOR EVERYTHING ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      el.classList.add('visible');

      // Only stat cards trigger countUp
      if (el.classList.contains('stat-card') && el.dataset.target) {
        setTimeout(() => {
          countUp(
            el,
            parseFloat(el.dataset.target),
            parseInt(el.dataset.decimals)
          );
        }, 200);
      }

      observer.unobserve(el);
    });
  }, { threshold: 0.15 });

  // ── OBSERVE ALL ANIMATED ELEMENTS ──
  document.querySelectorAll('.stat-card, .fade-up, .step-row').forEach(el => {
    observer.observe(el);
  });

});


document.addEventListener('DOMContentLoaded', () => {

  // ── MOBILE MENU TOGGLE ──
  const menuToggle = document.getElementById('menuToggle');
  const mainNav    = document.getElementById('mainNav');
  const navOverlay = document.getElementById('navOverlay');

  if (menuToggle && mainNav && navOverlay) {
    function openMenu() {
      menuToggle.classList.add('open');
      mainNav.classList.add('open');
      navOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      menuToggle.classList.remove('open');
      mainNav.classList.remove('open');
      navOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', () => {
      mainNav.classList.contains('open') ? closeMenu() : openMenu();
    });

    navOverlay.addEventListener('click', closeMenu);

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  // =========================================
  // ── SCROLL ANIMATIONS (stats, fade-up, steps) ──
  // =========================================
  function countUp(el, target, decimals, duration = 1800) {
    const start    = performance.now();
    const numberEl = el.querySelector('.stat-number');

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = eased * target;

      if (target >= 1000) {
        numberEl.textContent = Math.floor(current).toLocaleString();
      } else {
        numberEl.textContent = current.toFixed(decimals);
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        numberEl.textContent = target >= 1000
          ? target.toLocaleString()
          : target.toFixed(decimals);
      }
    }
    requestAnimationFrame(update);
  }

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('visible');

      if (el.classList.contains('stat-card') && el.dataset.target) {
        setTimeout(() => {
          countUp(el, parseFloat(el.dataset.target), parseInt(el.dataset.decimals));
        }, 200);
      }

      scrollObserver.unobserve(el);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.stat-card, .fade-up, .step-row').forEach(el => {
    scrollObserver.observe(el);
  });

  // =========================================
  // ── TRACK SHIPMENT SECTION ──
  // =========================================
  const input        = document.getElementById('trackingInput');
  const trackBtn     = document.getElementById('trackBtn');
  const valMsg       = document.getElementById('validationMsg');
  const valRules     = document.getElementById('validationRules');
  const etaCard      = document.getElementById('etaCard');
  const etaIdDisplay = document.getElementById('etaIdDisplay');
  const moreDetails  = document.getElementById('moreDetails');

  if (input && trackBtn) {

    const rules = {
      length:  document.getElementById('rule-length'),
      letters: document.getElementById('rule-letters'),
      numbers: document.getElementById('rule-numbers'),
      special: document.getElementById('rule-special'),
      nospace: document.getElementById('rule-nospace'),
    };

    function countLetters(val) {
      return (val.match(/[a-zA-Z]/g) || []).length;
    }

    function validate(val) {
      const len     = val.length;
      const letters = countLetters(val);
      const hasNum  = /[0-9]/.test(val);
      const hasSpc  = /[^a-zA-Z0-9]/.test(val);
      const noSpace = !/\s/.test(val);

      const checks = {
        length:  len >= 10 && len <= 18,
        letters: letters >= 2 && letters <= 4,
        numbers: hasNum,
        special: hasSpc,
        nospace: noSpace,
      };

      Object.entries(checks).forEach(([key, pass]) => {
        if (rules[key]) {
          rules[key].classList.toggle('pass', pass);
          rules[key].classList.toggle('fail', val.length > 0 && !pass);
        }
      });

      return Object.values(checks).every(Boolean);
    }

    function showMsg(text, type) {
      valMsg.textContent = text;
      valMsg.className   = `validation-msg ${type}`;
    }

    function clearMsg() {
      valMsg.className   = 'validation-msg hidden';
      valMsg.textContent = '';
    }

    input.addEventListener('focus', () => {
      valRules.classList.add('visible');
      clearMsg();
    });

    input.addEventListener('blur', () => {
      if (!input.value.trim()) {
        valRules.classList.remove('visible');
        clearMsg();
        if (etaCard)     etaCard.classList.remove('visible');
        if (moreDetails) moreDetails.classList.remove('visible');
      }
    });

    input.addEventListener('input', () => {
      const val = input.value;
      if (/\s/.test(val)) input.value = val.replace(/\s/g, '');

      const isValid = validate(input.value);

      if (input.value.length === 0) {
        clearMsg();
        input.classList.remove('input-error', 'input-success');
        trackBtn.disabled = true;
        if (etaCard)     etaCard.classList.remove('visible');
        if (moreDetails) moreDetails.classList.remove('visible');
        return;
      }

      if (isValid) {
        input.classList.remove('input-error');
        input.classList.add('input-success');
        showMsg('✓ Tracking ID is valid', 'success');
        trackBtn.disabled = false;
      } else {
        input.classList.remove('input-success');
        input.classList.add('input-error');
        clearMsg();
        trackBtn.disabled = true;
        if (etaCard)     etaCard.classList.remove('visible');
        if (moreDetails) moreDetails.classList.remove('visible');
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !trackBtn.disabled) trackBtn.click();
    });

    trackBtn.addEventListener('click', () => {

      // ── EXIT MODE ──
      if (trackBtn.dataset.mode === 'exit') {
        input.value            = '';
        input.disabled         = false;
        input.style.opacity    = '1';
        input.classList.remove('input-success', 'input-error');
        if (etaCard)     etaCard.classList.remove('visible');
        if (moreDetails) moreDetails.classList.remove('visible');
        valRules.classList.remove('visible');
        clearMsg();
        trackBtn.innerHTML        = 'Track →';
        trackBtn.style.background = '#ff6a00';
        trackBtn.style.color      = '#111';
        trackBtn.style.fontSize   = '';
        trackBtn.disabled         = true;
        trackBtn.dataset.mode     = 'track';
        return;
      }

      // ── TRACK MODE ──
      const val = input.value.trim();
      if (!validate(val)) return;

      // Read from sessionStorage — already saved by quote form
      const storedId       = sessionStorage.getItem('ll_tracking_id') || '';
      const storedOrigin   = sessionStorage.getItem('ll_origin')      || '';
      const storedDest     = sessionStorage.getItem('ll_dest')        || '';
      const storedShipping = sessionStorage.getItem('ll_shipping')    || '';

      // Match only if IDs are identical
      const isMatch = storedId.length > 0 && val.toUpperCase() === storedId.toUpperCase();

      const origins      = ['Lagos, NG', 'Abuja, NG', 'Accra, GH', 'Nairobi, KE', 'Cairo, EG'];
      const destinations = ['London, UK', 'New York, US', 'Dubai, UAE', 'Hamburg, DE', 'Rotterdam, NL'];
      const carriers     = ['Sea Freight', 'Air Freight', 'Road Freight', 'Express Courier'];
      const locations    = ['Lisbon, PT', 'Casablanca, MA', 'Tenerife, ES', 'Gibraltar, GB', 'Cape Verde'];
      const etaDays      = ['2 Days Left', '3 Days Left', '5 Days Left', '1 Day Left', '4 Days Left'];
      const progress     = ['45%', '62%', '78%', '91%', '33%'];

      const seed = val.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const pick = (arr) => arr[seed % arr.length];

      etaIdDisplay.textContent = val.toUpperCase();

      const etaItems = document.querySelectorAll('.eta-item');
      if (etaItems.length >= 6) {
        etaItems[0].querySelector('span').textContent = isMatch ? storedOrigin   : pick(origins);
        etaItems[1].querySelector('span').textContent = isMatch ? storedDest     : pick(destinations);
        etaItems[2].querySelector('span').textContent = pick(etaDays);
        etaItems[3].querySelector('span').textContent = isMatch ? storedShipping : pick(carriers);
        etaItems[4].querySelector('span').textContent = pick(locations);
        etaItems[5].querySelector('span').textContent = pick(progress);
      }

      if (etaCard)     etaCard.classList.add('visible');
      // After etaCard.classList.add('visible')
      const origin = isMatch ? storedOrigin : pick(origins);
      const dest   = isMatch ? storedDest   : pick(destinations);

      if (typeof plotRoute === 'function') {
      plotRoute(origin, dest);
      }
      if (moreDetails) moreDetails.classList.add('visible');
      valRules.classList.remove('visible');
      showMsg('✓ Shipment found — tracking active', 'success');

      input.disabled            = true;
      input.style.opacity       = '0.5';
      trackBtn.innerHTML        = '✕';
      trackBtn.style.background = '#e74c3c';
      trackBtn.style.color      = '#fff';
      trackBtn.style.fontSize   = '1.1rem';
      trackBtn.dataset.mode     = 'exit';
    });
  }

  // =========================================
  // ── QUOTE FORM SECTION ──
  // =========================================
  const submitBtn = document.getElementById('submitBtn');

  if (submitBtn) {

    document.querySelectorAll('.ship-toggle').forEach(label => {
      label.addEventListener('click', () => {
        document.querySelectorAll('.ship-toggle').forEach(l => l.classList.remove('selected'));
        label.classList.add('selected');
      });
    });

    function showError(id, msg) {
      const err = document.getElementById('err-' + id);
      const inp = document.getElementById(id);
      if (err) { err.textContent = msg; err.classList.add('visible'); }
      if (inp) { inp.classList.add('error'); inp.classList.remove('valid'); }
    }

    function clearError(id) {
      const err = document.getElementById('err-' + id);
      const inp = document.getElementById(id);
      if (err) { err.textContent = ''; err.classList.remove('visible'); }
      if (inp) { inp.classList.remove('error'); inp.classList.add('valid'); }
    }

    function validateForm() {
      let valid = true;

      const name = document.getElementById('fullName').value.trim();
      if (!name || name.length < 3) { showError('fullName', 'Enter your full name (min 3 characters)'); valid = false; }
      else clearError('fullName');

      const email = document.getElementById('email').value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError('email', 'Enter a valid email address'); valid = false; }
      else clearError('email');

      const phone = document.getElementById('phone').value.trim();
      if (!/^[\+]?[\d\s\-\(\)]{7,15}$/.test(phone)) { showError('phone', 'Enter a valid phone number'); valid = false; }
      else clearError('phone');

      const cargo = document.getElementById('cargoType').value;
      if (!cargo) { showError('cargoType', 'Please select a cargo type'); valid = false; }
      else clearError('cargoType');

      const origin = document.getElementById('origin').value.trim();
      if (!origin || origin.length < 3) { showError('origin', 'Enter the origin location'); valid = false; }
      else clearError('origin');

      const dest = document.getElementById('destination').value.trim();
      if (!dest || dest.length < 3) { showError('destination', 'Enter the destination location'); valid = false; }
      else clearError('destination');

      const weight = parseFloat(document.getElementById('weight').value);
      if (!weight || weight <= 0) { showError('weight', 'Enter a valid cargo weight'); valid = false; }
      else clearError('weight');

      const volume = parseFloat(document.getElementById('volume').value);
      if (!volume || volume <= 0) { showError('volume', 'Enter a valid quantity'); valid = false; }
      else clearError('volume');

      return valid;
    }

    ['fullName','email','phone','cargoType','origin','destination','weight','volume'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('blur', validateForm);
    });

    function generateTrackingId(name, origin, dest) {
      const nameParts = name.trim().split(' ');
      const initials  = nameParts.map(p => p[0].toUpperCase()).join('').slice(0, 2);
      const num1      = Math.floor(1000 + Math.random() * 9000);
      const specials  = ['-', '#', '_', '.', '@'];
      const spec      = specials[Math.floor(Math.random() * specials.length)];
      const num2      = Math.floor(100 + Math.random() * 900);
      const suffix    = (origin[0] + dest[0]).toUpperCase();
      const id        = `${initials}${spec}${num1}${spec}${num2}${suffix}`;

      const letters = (id.match(/[a-zA-Z]/g) || []).length;
      const len     = id.length;

      if (
        len >= 10 && len <= 18 &&
        letters >= 2 && letters <= 4 &&
        /[0-9]/.test(id) &&
        /[^a-zA-Z0-9]/.test(id) &&
        !/\s/.test(id)
      ) {
        return id;
      }
      return `LL${spec}${num1}${spec}${num2}`;
    }

    submitBtn.addEventListener('click', () => {
      if (!validateForm()) return;

      const btn     = document.getElementById('submitBtn');
      btn.disabled  = true;
      btn.innerHTML = `<div class="spinner"></div> Processing...`;

      // ── Collect data BEFORE setTimeout ──
      const name     = document.getElementById('fullName').value.trim();
      const cargo    = document.getElementById('cargoType').value;
      const origin   = document.getElementById('origin').value.trim();
      const dest     = document.getElementById('destination').value.trim();
      const weight   = document.getElementById('weight').value;
      const shipping = document.querySelector('.ship-toggle.selected input').value;
      const trackingId = generateTrackingId(name, origin, dest);

      setTimeout(() => {

        // ── Save to sessionStorage INSIDE timeout ──
        sessionStorage.setItem('ll_tracking_id', trackingId);
        sessionStorage.setItem('ll_origin',      origin);
        sessionStorage.setItem('ll_dest',        dest);
        sessionStorage.setItem('ll_shipping',    shipping);
        sessionStorage.setItem('ll_weight',      weight + ' kg');

        // Populate popup
        document.getElementById('popupTrackingId').textContent = trackingId;
        document.getElementById('popupName').textContent       = name;
        document.getElementById('popupCargo').textContent      = cargo;
        document.getElementById('popupOrigin').textContent     = origin;
        document.getElementById('popupDest').textContent       = dest;
        document.getElementById('popupWeight').textContent     = weight + ' kg';
        document.getElementById('popupShipping').textContent   = shipping;

        document.getElementById('trackingPopup').classList.add('active');

        btn.disabled  = false;
        btn.innerHTML = `
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
          Submit Quote Request
        `;

      }, 1600);
    });

    // Copy button
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const id = document.getElementById('popupTrackingId').textContent;
        navigator.clipboard.writeText(id).then(() => {
          copyBtn.textContent = 'Copied!';
          copyBtn.classList.add('copied');
          setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('copied');
          }, 2000);
        });
      });
    }

    function closePopup() {
      document.getElementById('trackingPopup').classList.remove('active');
    }

    const popupClose    = document.getElementById('popupClose');
    const popupDismiss  = document.getElementById('popupDismiss');
    const trackingPopup = document.getElementById('trackingPopup');

    if (popupClose)    popupClose.addEventListener('click', closePopup);
    if (popupDismiss)  popupDismiss.addEventListener('click', closePopup);
    if (trackingPopup) {
      trackingPopup.addEventListener('click', (e) => {
        if (e.target === trackingPopup) closePopup();
      });
    }

    const goTrackBtn = document.getElementById('goTrackBtn');
    if (goTrackBtn) {
      goTrackBtn.addEventListener('click', () => {
        closePopup();
        const trackSection = document.getElementById('track');
        if (trackSection) trackSection.scrollIntoView({ behavior: 'smooth' });

        const trackInput = document.getElementById('trackingInput');
        if (trackInput) {
          trackInput.value = sessionStorage.getItem('ll_tracking_id') || '';
          trackInput.dispatchEvent(new Event('input'));
        }
      });
    }
  }

});


document.addEventListener('DOMContentLoaded', () => {
 
  // ── INIT MAP ──
  const map = L.map('liveMap', {
    center: [20, 10],
    zoom: 3,
    zoomControl: true,
    attributionControl: false,
  });
 
  // Dark OpenStreetMap tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '© OpenStreetMap © CARTO',
    subdomains: 'abcd',
    maxZoom: 18,
  }).addTo(map);
 
  // Track markers and route
  let originMarker, currentMarker, destMarker, routeLine, pulseInterval;
 
  // ── CUSTOM MARKER ICONS ──
  function createIcon(color, size = 14) {
    return L.divIcon({
      className: '',
      html: `
        <div style="position:relative; width:${size * 3}px; height:${size * 3}px; display:flex; align-items:center; justify-content:center;">
          <div style="
            position:absolute;
            width:${size * 2.4}px; height:${size * 2.4}px;
            border-radius:50%;
            background:${color};
            opacity:0.2;
            animation: mapPulse 1.8s infinite;
          "></div>
          <div style="
            width:${size}px; height:${size}px;
            border-radius:50%;
            background:${color};
            border:2.5px solid #fff;
            position:relative;
            z-index:2;
            box-shadow: 0 0 8px ${color};
          "></div>
        </div>
      `,
      iconSize:   [size * 3, size * 3],
      iconAnchor: [size * 1.5, size * 1.5],
      popupAnchor:[0, -size],
    });
  }
 
  // Inject pulse animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes mapPulse {
      0%, 100% { transform: scale(1); opacity: 0.2; }
      50% { transform: scale(1.5); opacity: 0.05; }
    }
  `;
  document.head.appendChild(style);
 
  // ── GEOCODE using Nominatim (free, no API key) ──
  async function geocode(address) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
    const res  = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    const data = await res.json();
    if (!data || data.length === 0) throw new Error(`Could not find: ${address}`);
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), name: data[0].display_name };
  }
 
  // ── PLOT ROUTE ON MAP ──
  async function plotRoute(originAddress, destAddress) {
    try {
      // Clear old layers
      if (originMarker)  map.removeLayer(originMarker);
      if (currentMarker) map.removeLayer(currentMarker);
      if (destMarker)    map.removeLayer(destMarker);
      if (routeLine)     map.removeLayer(routeLine);
      if (pulseInterval) clearInterval(pulseInterval);
 
      // Geocode both addresses
      const [origin, dest] = await Promise.all([
        geocode(originAddress),
        geocode(destAddress),
      ]);
 
      // Midpoint as current location
      const current = {
        lat: (origin.lat + dest.lat) / 2,
        lng: (origin.lng + dest.lng) / 2,
      };
 
      // ── ORIGIN — Blue marker ──
      originMarker = L.marker([origin.lat, origin.lng], {
        icon: createIcon('#3498db', 14),
        zIndexOffset: 100,
      }).addTo(map).bindPopup(`
        <div style="background:#111;color:#3498db;padding:8px 12px;border-radius:6px;font-family:Barlow,sans-serif;font-size:13px;font-weight:700;border:1px solid #3498db;">
          📍 Origin<br><span style="color:#fff;font-weight:400;">${originAddress}</span>
        </div>
      `);
 
      // ── CURRENT LOCATION — Orange marker ──
      currentMarker = L.marker([current.lat, current.lng], {
        icon: createIcon('#ff6a00', 16),
        zIndexOffset: 200,
      }).addTo(map).bindPopup(`
        <div style="background:#111;color:#ff6a00;padding:8px 12px;border-radius:6px;font-family:Barlow,sans-serif;font-size:13px;font-weight:700;border:1px solid #ff6a00;">
          🚚 In Transit<br><span style="color:#fff;font-weight:400;">Currently en route</span>
        </div>
      `);
 
      // ── DESTINATION — Green marker ──
      destMarker = L.marker([dest.lat, dest.lng], {
        icon: createIcon('#2ecc71', 14),
        zIndexOffset: 100,
      }).addTo(map).bindPopup(`
        <div style="background:#111;color:#2ecc71;padding:8px 12px;border-radius:6px;font-family:Barlow,sans-serif;font-size:13px;font-weight:700;border:1px solid #2ecc71;">
          🏁 Destination<br><span style="color:#fff;font-weight:400;">${destAddress}</span>
        </div>
      `);
 
      // ── ROUTE LINE — dashed orange ──
      routeLine = L.polyline(
        [[origin.lat, origin.lng], [current.lat, current.lng], [dest.lat, dest.lng]],
        {
          color: '#ff6a00',
          weight: 2.5,
          opacity: 0.8,
          dashArray: '8, 6',
        }
      ).addTo(map);
 
      // ── Fit map to show all 3 points ──
      const bounds = L.latLngBounds(
        [origin.lat, origin.lng],
        [dest.lat, dest.lng]
      ).extend([current.lat, current.lng]);
 
      map.fitBounds(bounds, { padding: [50, 50] });
 
      // ── Hide placeholder ──
      document.getElementById('mapPlaceholder').classList.add('hidden');
 
    } catch (err) {
      console.error('Map error:', err);
    }
  }
 
  // ── TRACKING FORM LOGIC ──
  const input        = document.getElementById('trackingInput');
  const trackBtn     = document.getElementById('trackBtn');
  const valMsg       = document.getElementById('validationMsg');
  const valRules     = document.getElementById('validationRules');
  const etaCard      = document.getElementById('etaCard');
  const etaIdDisplay = document.getElementById('etaIdDisplay');
  const moreDetails  = document.getElementById('moreDetails');
 
  const rules = {
    length:  document.getElementById('rule-length'),
    letters: document.getElementById('rule-letters'),
    numbers: document.getElementById('rule-numbers'),
    special: document.getElementById('rule-special'),
    nospace: document.getElementById('rule-nospace'),
  };
 
  function countLetters(val) { return (val.match(/[a-zA-Z]/g) || []).length; }
 
  function validate(val) {
    const checks = {
      length:  val.length >= 10 && val.length <= 18,
      letters: countLetters(val) >= 2 && countLetters(val) <= 4,
      numbers: /[0-9]/.test(val),
      special: /[^a-zA-Z0-9]/.test(val),
      nospace: !/\s/.test(val),
    };
    Object.entries(checks).forEach(([key, pass]) => {
      if (rules[key]) {
        rules[key].classList.toggle('pass', pass);
        rules[key].classList.toggle('fail', val.length > 0 && !pass);
      }
    });
    return Object.values(checks).every(Boolean);
  }
 
  function showMsg(text, type) { valMsg.textContent = text; valMsg.className = `validation-msg ${type}`; }
  function clearMsg() { valMsg.className = 'validation-msg hidden'; valMsg.textContent = ''; }
 
  input.addEventListener('focus', () => { valRules.classList.add('visible'); clearMsg(); });
 
  input.addEventListener('blur', () => {
    if (!input.value.trim()) {
      valRules.classList.remove('visible');
      clearMsg();
      etaCard.classList.remove('visible');
      moreDetails.classList.remove('visible');
    }
  });
 
  input.addEventListener('input', () => {
    if (/\s/.test(input.value)) input.value = input.value.replace(/\s/g, '');
    const isValid = validate(input.value);
 
    if (input.value.length === 0) {
      clearMsg();
      input.classList.remove('input-error', 'input-success');
      trackBtn.disabled = true;
      etaCard.classList.remove('visible');
      moreDetails.classList.remove('visible');
      return;
    }
 
    if (isValid) {
      input.classList.remove('input-error');
      input.classList.add('input-success');
      showMsg('✓ Tracking ID is valid', 'success');
      trackBtn.disabled = false;
    } else {
      input.classList.remove('input-success');
      input.classList.add('input-error');
      clearMsg();
      trackBtn.disabled = true;
      etaCard.classList.remove('visible');
      moreDetails.classList.remove('visible');
    }
  });
 
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !trackBtn.disabled) trackBtn.click();
  });
 
  trackBtn.addEventListener('click', () => {
 
    // ── EXIT MODE ──
    if (trackBtn.dataset.mode === 'exit') {
      input.value           = '';
      input.disabled        = false;
      input.style.opacity   = '1';
      input.classList.remove('input-success', 'input-error');
      etaCard.classList.remove('visible');
      moreDetails.classList.remove('visible');
      valRules.classList.remove('visible');
      clearMsg();
      trackBtn.innerHTML        = 'Track →';
      trackBtn.style.background = '#ff6a00';
      trackBtn.style.color      = '#111';
      trackBtn.style.fontSize   = '';
      trackBtn.disabled         = true;
      trackBtn.dataset.mode     = 'track';
 
      // Reset map
      if (originMarker)  map.removeLayer(originMarker);
      if (currentMarker) map.removeLayer(currentMarker);
      if (destMarker)    map.removeLayer(destMarker);
      if (routeLine)     map.removeLayer(routeLine);
      map.setView([20, 10], 3);
      document.getElementById('mapPlaceholder').classList.remove('hidden');
      return;
    }
 
    // ── TRACK MODE ──
    const val = input.value.trim();
    if (!validate(val)) return;
 
    // Read from sessionStorage
    const storedId       = sessionStorage.getItem('ll_tracking_id') || '';
    const storedOrigin   = sessionStorage.getItem('ll_origin')      || '';
    const storedDest     = sessionStorage.getItem('ll_dest')        || '';
    const storedShipping = sessionStorage.getItem('ll_shipping')    || '';
 
    const isMatch = storedId.length > 0 && val.toUpperCase() === storedId.toUpperCase();
 
    const origins      = ['Lagos, Nigeria', 'Abuja, Nigeria', 'Accra, Ghana', 'Nairobi, Kenya', 'Cairo, Egypt'];
    const destinations = ['London, UK', 'New York, USA', 'Dubai, UAE', 'Hamburg, Germany', 'Rotterdam, Netherlands'];
    const carriers     = ['Sea Freight', 'Air Freight', 'Road Freight', 'Express Courier'];
    const locations    = ['Lisbon, Portugal', 'Casablanca, Morocco', 'Tenerife, Spain', 'Gibraltar', 'Cape Verde'];
    const etaDays      = ['2 Days Left', '3 Days Left', '5 Days Left', '1 Day Left', '4 Days Left'];
    const progress     = ['45%', '62%', '78%', '91%', '33%'];
 
    const seed = val.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const pick = (arr) => arr[seed % arr.length];
 
    const finalOrigin   = isMatch ? storedOrigin   : pick(origins);
    const finalDest     = isMatch ? storedDest     : pick(destinations);
    const finalShipping = isMatch ? storedShipping : pick(carriers);
 
    // Update ETA card
    etaIdDisplay.textContent = val.toUpperCase();
    document.getElementById('etaOrigin').textContent   = finalOrigin;
    document.getElementById('etaDest').textContent     = finalDest;
    document.getElementById('etaDays').textContent     = pick(etaDays);
    document.getElementById('etaCarrier').textContent  = finalShipping;
    document.getElementById('etaLocation').textContent = pick(locations);
    document.getElementById('etaProgress').textContent = pick(progress);
 
    etaCard.classList.add('visible');
    moreDetails.classList.add('visible');
    valRules.classList.remove('visible');
    showMsg('✓ Shipment found — tracking active', 'success');
 
    // Plot on live map
    plotRoute(finalOrigin, finalDest);
 
    // Switch button to exit
    input.disabled            = true;
    input.style.opacity       = '0.5';
    trackBtn.innerHTML        = '✕';
    trackBtn.style.background = '#e74c3c';
    trackBtn.style.color      = '#fff';
    trackBtn.style.fontSize   = '1.1rem';
    trackBtn.dataset.mode     = 'exit';
  });
 
  // More Details scroll to map
  moreDetails.addEventListener('click', () => {
    document.getElementById('liveMap').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
 
});