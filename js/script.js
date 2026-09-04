document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');

  if (toggle && header) {
    toggle.addEventListener('click', function () {
      var isOpen = header.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    document.querySelectorAll('.nav-links a').forEach(function (link) {
      link.addEventListener('click', function () {
        header.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.textContent = 'Дякуємо, надіслано';
      btn.disabled = true;
      setTimeout(function () {
        btn.textContent = original;
        btn.disabled = false;
        form.reset();
      }, 3000);
      // Примітка для розробника: тут потрібно підключити реальну відправку
      // (наприклад, через Formspree, Getform або власний бекенд),
      // оскільки статичний сайт сам по собі листи не надсилає.
    });
  }

  // ---------- Органічні анімації: проявлення при скролі ----------
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var revealSelectors = [
      '.practice-card', '.service-row', '.team-card', '.approach-item',
      '.statute-item', '.feature-item', '.badge-item', '.stat',
      '.section-head', '.mend-rule'
    ];
    var revealEls = document.querySelectorAll(revealSelectors.join(','));

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });

    // ---------- Лічильник статистики: цифри рахують вгору при появі ----------
    var statNumbers = document.querySelectorAll('.stat .n');
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var raw = el.textContent.trim();
        var match = raw.match(/^(\d+)(.*)$/);
        if (!match) { countObserver.unobserve(el); return; }
        var target = parseInt(match[1], 10);
        var suffix = match[2] || '';
        var duration = 1100;
        var startTime = null;

        function step(ts) {
          if (!startTime) startTime = ts;
          var progress = Math.min((ts - startTime) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          var current = Math.round(eased * target);
          el.textContent = current + suffix;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = target + suffix;
          }
        }
        el.textContent = '0' + suffix;
        requestAnimationFrame(step);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(function (el) { countObserver.observe(el); });
  } else {
    // Без анімації просто показуємо все одразу (сумісність / reduced motion)
    document.querySelectorAll('.practice-card, .service-row, .team-card, .approach-item, .statute-item, .feature-item, .badge-item, .stat, .section-head, .mend-rule')
      .forEach(function (el) { el.classList.add('is-visible'); });
  }
});
