document.addEventListener('DOMContentLoaded', () => {

  // ── NAV SCROLL ──
  const nav = document.querySelector('.nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  // ── HAMBURGER MENU ──
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open');
      document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── REVEAL ON SCROLL ──
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  reveals.forEach(el => observer.observe(el));

  // ── COUNTER ANIMATION ──
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = Math.max(1, Math.floor(target / 60));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = current + suffix;
        }, 25);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // ── BUDGET RANGE SLIDER ──
  const budgetRange = document.getElementById('budget');
  const budgetValue = document.getElementById('budget-value');
  if (budgetRange && budgetValue) {
    budgetRange.addEventListener('input', () => {
      budgetValue.textContent = '€' + parseInt(budgetRange.value).toLocaleString('nl-BE');
    });
  }

  // ── FORM VALIDATION ──
  const forms = document.querySelectorAll('form[data-validate]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;

      // Clear old errors
      form.querySelectorAll('.error-msg').forEach(el => el.remove());
      form.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));

      // Check required fields
      form.querySelectorAll('[required]').forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.classList.add('input-error');
          field.style.borderColor = '#ff4444';
          const msg = document.createElement('span');
          msg.className = 'error-msg';
          msg.style.cssText = 'color:#ff4444;font-size:0.75rem;margin-top:0.25rem;display:block;';
          msg.textContent = 'Dit veld is verplicht';
          field.parentNode.appendChild(msg);
        }
      });

      // Email validation
      const emailField = form.querySelector('input[type="email"]');
      if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        valid = false;
        emailField.style.borderColor = '#ff4444';
        const msg = document.createElement('span');
        msg.className = 'error-msg';
        msg.style.cssText = 'color:#ff4444;font-size:0.75rem;margin-top:0.25rem;display:block;';
        msg.textContent = 'Ongeldig e-mailadres';
        emailField.parentNode.appendChild(msg);
      }

      if (valid) {
        // Show success
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = '✓ Verzonden!';
        btn.style.background = '#22c55e';
        btn.disabled = true;

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
          btn.disabled = false;
          form.reset();
          if (budgetValue) budgetValue.textContent = '€250.000';
        }, 3000);
      }
    });

    // Remove error on input
    form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('input', () => {
        field.style.borderColor = '';
        field.classList.remove('input-error');
        const err = field.parentNode.querySelector('.error-msg');
        if (err) err.remove();
      });
    });
  });

  // ── ACTIVE NAV LINK ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    if (a.getAttribute('href') === currentPage) {
      a.classList.add('active');
    }
  });

  // ── SMOOTH ANCHOR SCROLLING ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
