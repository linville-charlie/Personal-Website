(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Elements
  const entries = document.querySelectorAll('.timeline-entry');
  const progressFill = document.querySelector('.timeline-progress-fill');
  const scrollIndicator = document.querySelector('.scroll-indicator');
  const yearIndicator = document.querySelector('.year-indicator');
  const timelineSection = document.getElementById('journey');
  const timelineWrapper = document.querySelector('.timeline-wrapper');

  // ROT13 email decode
  document.querySelectorAll('.email-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const encoded = link.dataset.email;
      const decoded = encoded.replace(/[a-zA-Z]/g, c =>
        String.fromCharCode(c.charCodeAt(0) + (c.toLowerCase() < 'n' ? 13 : -13))
      );
      window.location.href = 'mailto:' + decoded;
    });
  });

  if (prefersReducedMotion) {
    entries.forEach(entry => entry.classList.add('in-view'));
    return;
  }

  // IntersectionObserver for card reveals
  const revealObserver = new IntersectionObserver((observed) => {
    observed.forEach((item, i) => {
      if (item.isIntersecting) {
        item.target.style.transitionDelay = (i * 0.08) + 's';
        item.target.classList.add('in-view');
        revealObserver.unobserve(item.target);
      }
    });
  }, { threshold: 0.15 });

  entries.forEach(entry => revealObserver.observe(entry));

  // Scroll-driven updates
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateOnScroll);
  }

  function updateOnScroll() {
    ticking = false;

    // --- BATCH ALL READS ---
    const scrollTop = window.scrollY;
    const viewportHeight = window.innerHeight;
    const docHeight = document.documentElement.scrollHeight - viewportHeight;

    let wrapperRect = null;
    if (timelineWrapper) {
      wrapperRect = timelineWrapper.getBoundingClientRect();
    }

    let sectionRect = null;
    if (timelineSection) {
      sectionRect = timelineSection.getBoundingClientRect();
    }

    let closestEntry = null;
    let closestDist = Infinity;
    const inTimeline = sectionRect &&
      sectionRect.top < viewportHeight * 0.6 &&
      sectionRect.bottom > viewportHeight * 0.4;

    if (inTimeline) {
      entries.forEach(entry => {
        const rect = entry.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - viewportHeight / 2);
        if (dist < closestDist) {
          closestDist = dist;
          closestEntry = entry;
        }
      });
    }

    // --- BATCH ALL WRITES ---
    if (docHeight > 0) {
      scrollIndicator.style.width = ((scrollTop / docHeight) * 100) + '%';
    }

    if (wrapperRect) {
      const viewCenter = scrollTop + viewportHeight * 0.5;
      const progress = (viewCenter - (wrapperRect.top + scrollTop)) / wrapperRect.height;
      progressFill.style.height = (Math.max(0, Math.min(1, progress)) * 100) + '%';
    }

    if (yearIndicator) {
      if (inTimeline) {
        yearIndicator.classList.add('visible');
        if (closestEntry) {
          yearIndicator.textContent = closestEntry.dataset.year;
          const eraClass = [...closestEntry.classList].find(c => c.startsWith('era-'));
          if (eraClass) {
            const colors = {
              'era-highschool': '#3e6524',
              'era-college': '#6b8f3c',
              'era-career': '#6e5310',
              'era-current': '#c9a84c'
            };
            yearIndicator.style.color = colors[eraClass] || '#667eea';
          }
        }
      } else {
        yearIndicator.classList.remove('visible');
      }
    }
  }

  // Sticky nav — show after scrolling past header, highlight active section
  const siteNav = document.querySelector('.site-nav');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]');

  function updateNav() {
    const scrollTop = window.scrollY;

    // Show/hide nav
    if (scrollTop > 300) {
      siteNav.classList.add('visible');
    } else {
      siteNav.classList.remove('visible');
    }

    // Active section highlight
    let currentId = '';
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (scrollTop >= top) {
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scroll', updateNav, { passive: true });
  updateOnScroll(); // Initial call
  updateNav();
})();
