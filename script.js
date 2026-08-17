/* ═══════════════════════════════════════════════════════════════
   THE WANDERING EYE — script.js
   Mobile nav · Gallery filters · Lightbox · Header scroll state
   Vanilla JS, no dependencies.
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Respect reduced-motion preference ───────────────────── */
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* ═══════════════════════════════════════════════════════════
     1. MOBILE NAVIGATION
  ═══════════════════════════════════════════════════════════ */
  const menuToggle  = document.querySelector('.menu-toggle');
  const navOverlay  = document.getElementById('nav-overlay');
  const overlayLinks = navOverlay
    ? navOverlay.querySelectorAll('.nav-overlay-links a')
    : [];

  function openNav() {
    if (!menuToggle || !navOverlay) return;
    navOverlay.classList.add('open');
    navOverlay.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('no-scroll');
    // Move focus into overlay for keyboard users
    const firstLink = navOverlay.querySelector('a');
    if (firstLink) firstLink.focus();
  }

  function closeNav() {
    if (!menuToggle || !navOverlay) return;
    navOverlay.classList.remove('open');
    navOverlay.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    menuToggle.focus();
  }

  function toggleNav() {
    const isOpen = navOverlay && navOverlay.classList.contains('open');
    isOpen ? closeNav() : openNav();
  }

  menuToggle?.addEventListener('click', toggleNav);

  // Close on overlay link click
  overlayLinks.forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (navOverlay?.classList.contains('open')) closeNav();
    }
  });


  /* ═══════════════════════════════════════════════════════════
     2. HEADER — scroll-aware transparency
        Adds .scrolled class so CSS can adjust blend-mode / bg
        when the user has scrolled past the hero.
  ═══════════════════════════════════════════════════════════ */
  const siteHeader = document.getElementById('site-header');

  function onScroll() {
    if (!siteHeader) return;
    // Use the actual hero height so the header goes opaque
    // immediately after the hero image scrolls out of view.
    // Works for both the full-viewport homepage hero and the
    // shorter 70vh story-page hero.
    const heroEl = document.querySelector('.hero, .gallery-page-hero');
    const threshold = heroEl
      ? heroEl.offsetHeight * 0.88
      : window.innerHeight * 0.85;
    siteHeader.classList.toggle('scrolled', window.scrollY > threshold);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load


  /* ═══════════════════════════════════════════════════════════
     3. GALLERY FILTERS
        Filters items by data-category attribute.
        data-category can contain multiple space-separated values.
  ═══════════════════════════════════════════════════════════ */
  const filterButtons = document.querySelectorAll('.filter');
  const galleryItems  = document.querySelectorAll('.gallery-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.removeAttribute('aria-current');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-current', 'true');

      const selected = btn.dataset.filter;

      galleryItems.forEach(item => {
        if (selected === 'all') {
          item.classList.remove('is-hidden');
          return;
        }
        // data-category may be "mumbai travel street" — match any token
        const cats = (item.dataset.category || '').split(/\s+/);
        const match = cats.includes(selected);
        item.classList.toggle('is-hidden', !match);
      });

      // Re-announce count for screen readers
      const visible = document.querySelectorAll('.gallery-item:not(.is-hidden)').length;
      announceToSR(`${visible} photograph${visible !== 1 ? 's' : ''} shown`);
    });
  });


  /* ═══════════════════════════════════════════════════════════
     4. LIGHTBOX
  ═══════════════════════════════════════════════════════════ */
  const lightbox       = document.getElementById('lightbox');
  const lightboxImg    = document.getElementById('lightbox-image');
  const lightboxCap    = document.getElementById('lightbox-caption');
  const lightboxClose  = document.getElementById('lightbox-close');

  // Track which button opened the lightbox so we can return focus
  let lightboxOpener = null;

  function openLightbox(src, alt, caption) {
    if (!lightbox || !lightboxImg) return;

    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    if (lightboxCap) lightboxCap.textContent = caption || '';

    // Must set display before toggling class so transition fires
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');

    // Focus the close button
    lightboxClose?.focus();
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('no-scroll');

    // Clear src after transition to free memory
    const delay = prefersReducedMotion ? 0 : 320;
    setTimeout(() => {
      if (lightboxImg) lightboxImg.src = '';
      if (lightboxCap) lightboxCap.textContent = '';
    }, delay);

    // Return focus to the button that opened the lightbox
    lightboxOpener?.focus();
    lightboxOpener = null;
  }

  // Open on image-button click
  document.querySelectorAll('.img-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      lightboxOpener = btn;

      const fullSrc = btn.dataset.full;
      const img     = btn.querySelector('img');
      const alt     = img ? img.alt : '';

      // Build caption from figcaption inside the parent figure
      const figure  = btn.closest('figure');
      const title   = figure?.querySelector('.fig-title')?.textContent || '';
      const meta    = figure?.querySelector('.fig-meta')?.textContent  || '';
      const caption = [title, meta].filter(Boolean).join('  ·  ');

      openLightbox(fullSrc || img?.src || '', alt, caption);
    });
  });

  // Close via button
  lightboxClose?.addEventListener('click', closeLightbox);

  // Close on backdrop click
  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  // Close on Escape (also handled above for nav, both can coexist)
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox?.classList.contains('open')) {
      closeLightbox();
    }
  });

  // Keyboard: Left/Right arrow navigation between gallery images
  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;

    const visibleItems  = Array.from(
      document.querySelectorAll('.gallery-item:not(.is-hidden) .img-btn')
    );
    if (visibleItems.length < 2) return;

    const currentSrc = lightboxImg?.src || '';
    const currentIdx = visibleItems.findIndex(btn => {
      const src = btn.dataset.full || btn.querySelector('img')?.src || '';
      return currentSrc.includes(src.split('/').pop());
    });

    let nextIdx;
    if (e.key === 'ArrowRight') {
      nextIdx = (currentIdx + 1) % visibleItems.length;
    } else {
      nextIdx = (currentIdx - 1 + visibleItems.length) % visibleItems.length;
    }

    const nextBtn = visibleItems[nextIdx];
    if (!nextBtn) return;

    const nextImg     = nextBtn.querySelector('img');
    const nextFigure  = nextBtn.closest('figure');
    const nextTitle   = nextFigure?.querySelector('.fig-title')?.textContent || '';
    const nextMeta    = nextFigure?.querySelector('.fig-meta')?.textContent  || '';
    const nextCaption = [nextTitle, nextMeta].filter(Boolean).join('  ·  ');

    lightboxOpener = nextBtn;
    lightboxImg.src = nextBtn.dataset.full || nextImg?.src || '';
    lightboxImg.alt = nextImg?.alt || '';
    if (lightboxCap) lightboxCap.textContent = nextCaption;
  });


  /* ═══════════════════════════════════════════════════════════
     5. SMOOTH ANCHOR SCROLLING (offset for fixed header)
  ═══════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const id = anchor.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();

      const headerH = siteHeader ? siteHeader.offsetHeight : 0;
      const top     = target.getBoundingClientRect().top + window.scrollY - headerH;

      if (prefersReducedMotion) {
        window.scrollTo(0, top);
      } else {
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ═══════════════════════════════════════════════════════════
     5b. STORY PAGE — click-to-lightbox for .photo-item figures
         (no .img-btn wrapper on story pages; click the figure itself)
  ═══════════════════════════════════════════════════════════ */
  document.querySelectorAll('.photo-item').forEach(item => {
    const img = item.querySelector('img');
    if (!img) return;

    item.addEventListener('click', () => {
      lightboxOpener = item;
      const caption = item.querySelector('.photo-caption')?.textContent || '';
      openLightbox(img.src, img.alt, caption);
    });

    // Keyboard: Enter / Space activates lightbox
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', `View: ${img.alt || 'photograph'}`);
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });


  /* ═══════════════════════════════════════════════════════════
     6. LAZY INTERSECTION OBSERVER
        Adds .is-visible class when images enter the viewport.
        CSS can use this for a subtle fade-in if desired.
  ═══════════════════════════════════════════════════════════ */
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.08 }
    );

    document.querySelectorAll(
      '.gallery-item, .story-card, .cat-card, .about-portrait, .intro-statement, .photo-item, .project-intro'
    ).forEach(el => {
      el.classList.add('will-animate');
      io.observe(el);
    });
  }


  /* ═══════════════════════════════════════════════════════════
     7. LIVE-REGION HELPER (screen reader announcements)
  ═══════════════════════════════════════════════════════════ */
  function announceToSR(message) {
    let region = document.getElementById('sr-live');
    if (!region) {
      region = document.createElement('div');
      region.id = 'sr-live';
      region.setAttribute('aria-live', 'polite');
      region.setAttribute('aria-atomic', 'true');
      Object.assign(region.style, {
        position: 'absolute',
        width:    '1px',
        height:   '1px',
        padding:  '0',
        overflow: 'hidden',
        clip:     'rect(0,0,0,0)',
        whiteSpace: 'nowrap',
        border:   '0',
      });
      document.body.appendChild(region);
    }
    region.textContent = '';
    // Slight delay ensures the DOM change is noticed by assistive tech
    requestAnimationFrame(() => { region.textContent = message; });
  }

})();
