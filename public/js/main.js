(function () {
  const CONSENT_KEY = 'flowop_analytics_consent';

  function applyStoredConsent() {
    var stored = null;
    try {
      stored = localStorage.getItem(CONSENT_KEY);
    } catch (e) {
      stored = null;
    }
    if (stored === 'granted' && typeof window.gtag === 'function') {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
    return stored;
  }

  var banner = document.getElementById('cookie-consent');
  if (banner) {
    var storedConsent = applyStoredConsent();
    if (storedConsent !== 'granted' && storedConsent !== 'denied') {
      banner.removeAttribute('hidden');
    }
    var acceptBtn = banner.querySelector('[data-consent-accept]');
    var rejectBtn = banner.querySelector('[data-consent-reject]');
    function hideBanner() {
      banner.setAttribute('hidden', '');
    }
    if (acceptBtn) {
      acceptBtn.addEventListener('click', function () {
        try {
          localStorage.setItem(CONSENT_KEY, 'granted');
        } catch (e) {}
        if (typeof window.gtag === 'function') {
          window.gtag('consent', 'update', {
            analytics_storage: 'granted',
          });
        }
        hideBanner();
      });
    }
    if (rejectBtn) {
      rejectBtn.addEventListener('click', function () {
        try {
          localStorage.setItem(CONSENT_KEY, 'denied');
        } catch (e) {}
        hideBanner();
      });
    }
  }

  const navToggle = document.querySelector('[data-nav-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', navLinks.classList.contains('open') ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16 }
    );

    reveals.forEach(function (node) {
      observer.observe(node);
    });
  } else {
    reveals.forEach(function (node) {
      node.classList.add('show');
    });
  }

  const yearNode = document.querySelector('[data-year]');
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  const form = document.querySelector('[data-contact-form]');
  const status = document.querySelector('[data-form-status]');

  if (form && status) {
    form.addEventListener('submit', function (event) {
      const endpoint = form.getAttribute('action') || '';
      if (!/\/formspree\.io\/f\/[a-z0-9]+/i.test(endpoint)) {
        event.preventDefault();
        status.textContent = 'Contact form is not configured. Set PUBLIC_FORMSPREE_ID or the Formspree fallback in the site.';
        status.style.color = '#ffcf70';
      } else {
        status.textContent = 'Sending...';
        status.style.color = '#9aabbe';
      }
    });
  }

  const ctaCandidates = document.querySelectorAll('a, button');
  ctaCandidates.forEach(function (el) {
    const label = (el.textContent || '').trim().toLowerCase();
    if (label.indexOf('book discovery call') === -1) return;
    el.addEventListener('click', function () {
      var allow = false;
      try {
        allow = localStorage.getItem(CONSENT_KEY) === 'granted';
      } catch (e) {}
      if (allow && typeof window.gtag === 'function') {
        window.gtag('event', 'book_discovery_call', {
          link_url: el.getAttribute('href') || '',
          page_path: location.pathname,
        });
      }
    });
  });
})();
