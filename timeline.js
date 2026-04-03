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

    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Scroll indicator (top bar)
    if (docHeight > 0) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      scrollIndicator.style.width = scrollPercent + '%';
    }

    // Timeline progress fill
    if (timelineWrapper) {
      const wrapperRect = timelineWrapper.getBoundingClientRect();
      const wrapperTop = wrapperRect.top + scrollTop;
      const wrapperHeight = wrapperRect.height;
      const viewCenter = scrollTop + window.innerHeight * 0.5;
      const progress = (viewCenter - wrapperTop) / wrapperHeight;
      const clampedProgress = Math.max(0, Math.min(1, progress));
      progressFill.style.height = (clampedProgress * 100) + '%';
    }

    // Year indicator
    if (timelineSection && yearIndicator) {
      const sectionRect = timelineSection.getBoundingClientRect();
      const inTimeline = sectionRect.top < window.innerHeight * 0.6 &&
                         sectionRect.bottom > window.innerHeight * 0.4;

      if (inTimeline) {
        yearIndicator.classList.add('visible');

        // Find closest entry to viewport center
        let closestEntry = null;
        let closestDist = Infinity;
        entries.forEach(entry => {
          const rect = entry.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const dist = Math.abs(center - window.innerHeight / 2);
          if (dist < closestDist) {
            closestDist = dist;
            closestEntry = entry;
          }
        });

        if (closestEntry) {
          const year = closestEntry.dataset.year;
          yearIndicator.textContent = year;

          // Update color based on era
          const eraClass = [...closestEntry.classList].find(c => c.startsWith('era-'));
          if (eraClass) {
            const colors = {
              'era-highschool': '#4c782c',
              'era-college': '#6b8f3c',
              'era-career': '#8b6914',
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

  window.addEventListener('scroll', onScroll, { passive: true });
  updateOnScroll(); // Initial call
})();
