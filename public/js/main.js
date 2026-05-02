(function () {
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
  const stage = document.querySelector('[data-contact-form-stage]');
  const thanks = document.querySelector('[data-contact-thanks]');
  const titleEl = document.querySelector('[data-contact-form-title]');
  const submitBtn = form ? form.querySelector('[data-contact-submit]') : null;

  if (form && status && stage && thanks && submitBtn) {
    const labelEl = submitBtn.querySelector('.btn-submit-label');
    const defaultLabelHtml = labelEl ? labelEl.innerHTML : submitBtn.innerHTML;

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const endpoint = form.getAttribute('action') || '';
      if (!/\/formspree\.io\/f\/[a-z0-9]+/i.test(endpoint)) {
        status.textContent =
          'Contact form is not configured. Set PUBLIC_FORMSPREE_ID or the Formspree fallback in the site.';
        status.style.color = '#ffcf70';
        return;
      }

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      status.textContent = '';
      status.style.color = '';

      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
      submitBtn.classList.add('is-loading');
      if (labelEl) {
        labelEl.textContent = 'Sending…';
      } else {
        submitBtn.textContent = 'Sending…';
      }

      fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      })
        .then(function (response) {
          return response.json().then(function (data) {
            return { response: response, data: data };
          });
        })
        .then(function (_ref) {
          var response = _ref.response;
          var data = _ref.data;
          if (response.ok) {
            stage.setAttribute('hidden', '');
            thanks.removeAttribute('hidden');
            if (titleEl) {
              titleEl.textContent = 'Thank you';
            }
            thanks.focus();
            return;
          }
          var msg =
            (data && (data.error || data.errors)) ||
            'Something went wrong. Please try again or reach out by email.';
          if (data && data.errors && typeof data.errors === 'object') {
            var parts = [];
            Object.keys(data.errors).forEach(function (key) {
              var val = data.errors[key];
              if (typeof val === 'string') {
                parts.push(val);
              } else if (Array.isArray(val)) {
                parts.push(val.join(' '));
              }
            });
            if (parts.length) {
              msg = parts.join(' ');
            }
          }
          status.textContent = typeof msg === 'string' ? msg : 'Please check the form and try again.';
          status.style.color = '#ffcf70';
        })
        .catch(function () {
          status.textContent = 'Network error. Check your connection and try again.';
          status.style.color = '#ffcf70';
        })
        .finally(function () {
          if (thanks.hasAttribute('hidden')) {
            submitBtn.disabled = false;
            submitBtn.removeAttribute('aria-busy');
            submitBtn.classList.remove('is-loading');
            if (labelEl) {
              labelEl.innerHTML = defaultLabelHtml;
            } else {
              submitBtn.innerHTML = defaultLabelHtml;
            }
          }
        });
    });
  }
})();
