/**
 * Meridian Studio — Main App
 * Libraries (all local, no CDN):
 *   - Lenis  (smooth scroll)     → /assets/vendor/lenis/lenis.min.js
 *   - GSAP   (animations)        → /assets/vendor/gsap/gsap.min.js
 *   - ScrollTrigger              → /assets/vendor/gsap/ScrollTrigger.min.js
 *   - Swiper (carousels)         → /assets/vendor/swiper/swiper-bundle.min.js
 */

(function () {
  'use strict';

  // Guard: only run when the DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initLenis();
    initHeader();
    initHeroAnimations();
    initMarquee();
    initScrollReveal();
    initProcessHover();
    initButtonHover();
    initWorkSwiper();
    initTestimonialSwiper();
    initCounters();
    initMobileNav();
  }

  // ============================================================
  // Lenis — smooth scroll
  // ============================================================
  function initLenis() {
    if (typeof Lenis === 'undefined') return;

    var lenis = new Lenis({
      duration: 1.2,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      orientation: 'vertical',
      smoothWheel: true
    });

    // Ticker loop
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Expose for ScrollTrigger integration
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    // Smooth anchor clicks
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var id = this.getAttribute('href');
        if (id === '#') return;
        var target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -80 });
        }
      });
    });

    window.__meridianLenis = lenis;
  }

  // ============================================================
  // Header — scroll state + sticky
  // ============================================================
  function initHeader() {
    var header = document.getElementById('mn-header');
    if (!header) return;

    var lastY = 0;
    var ticking = false;

    function onScroll() {
      lastY = window.scrollY;
      if (!ticking) {
        requestAnimationFrame(function () {
          if (lastY > 20) {
            header.classList.add('is-scrolled');
          } else {
            header.classList.remove('is-scrolled');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ============================================================
  // Mobile nav
  // ============================================================
  function initMobileNav() {
    var hamburger  = document.querySelector('[data-hamburger]');
    var mobileNav  = document.querySelector('[data-mobile-nav]');
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', function () {
      var open = hamburger.classList.toggle('is-open');
      mobileNav.classList.toggle('is-open', open);
      hamburger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        hamburger.classList.remove('is-open');
        mobileNav.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ============================================================
  // Hero entrance animations (GSAP)
  // ============================================================
  function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

    var tl = gsap.timeline({ delay: 0.15 });

    // Label
    tl.from('[data-headline] + * , .mn-hero__label', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out'
    });

    // Headline lines stagger
    tl.from('[data-line]', {
      y: '110%',
      opacity: 0,
      duration: 0.9,
      stagger: 0.12,
      ease: 'power4.out'
    }, '-=0.5');

    // Sub, buttons, scroll cue, counter
    tl.from('.mn-hero__sub, .mn-hero__actions, .mn-hero__scroll-cue, .mn-hero__counter', {
      opacity: 0,
      y: 24,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    }, '-=0.5');

    // Subtle hero bg orb scale
    tl.from('.mn-hero__bg', {
      scale: 1.05,
      duration: 2.0,
      ease: 'power2.out'
    }, 0);
  }

  // ============================================================
  // Marquee — GSAP ticker (honours prefers-reduced-motion)
  // ============================================================
  function initMarquee() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // CSS animation handles it; GSAP ticker only needed for custom speed control
  }

  // ============================================================
  // Scroll reveal (GSAP + ScrollTrigger)
  // ============================================================
  function initScrollReveal() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Section headers
    gsap.utils.toArray('[data-section-header]').forEach(function (el) {
      var label = el.querySelector('.mn-section__label');
      var title = el.querySelector('.mn-section__title');
      var tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          once: true
        }
      });
      if (label) tl.from(label, { opacity: 0, y: 16, duration: 0.6, ease: 'power3.out' });
      if (title) tl.from(title, { opacity: 0, y: 32, duration: 0.8, ease: 'power3.out' }, '-=0.3');
    });

    // Service cards
    gsap.utils.toArray('[data-service-card]').forEach(function (card, i) {
      gsap.from(card, {
        opacity: 0,
        y: 40,
        duration: 0.7,
        delay: (i % 2) * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          once: true
        }
      });
    });

    // Process steps
    gsap.utils.toArray('[data-process-step]').forEach(function (step, i) {
      gsap.from(step, {
        opacity: 0,
        x: -30,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: step,
          start: 'top 82%',
          once: true
        }
      });
    });

    // About panels
    var aboutMedia = document.querySelector('[data-about-media]');
    var aboutCopy  = document.querySelector('[data-about-copy]');
    if (aboutMedia) {
      gsap.from(aboutMedia, {
        opacity: 0,
        x: -50,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: { trigger: aboutMedia, start: 'top 75%', once: true }
      });
    }
    if (aboutCopy) {
      gsap.from(aboutCopy, {
        opacity: 0,
        x: 50,
        duration: 1.0,
        ease: 'power3.out',
        scrollTrigger: { trigger: aboutCopy, start: 'top 75%', once: true }
      });
    }

    // Contact CTA
    var contactInner = document.querySelector('[data-contact-inner]');
    if (contactInner) {
      gsap.from(contactInner.children, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: contactInner, start: 'top 80%', once: true }
      });
    }

    // Generic [data-reveal] elements
    gsap.utils.toArray('[data-reveal]').forEach(function (el) {
      if (el.closest('.mn-hero')) return; // hero handled separately
      gsap.from(el, {
        opacity: 0,
        y: 20,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true }
      });
    });
  }

  // ============================================================
  // Counter animation (GSAP)
  // ============================================================
  function initCounters() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2.0,
        ease: 'power2.out',
        onUpdate: function () { el.textContent = Math.round(obj.val); },
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true
        }
      });
    });
  }

  // ============================================================
  // Process section — GSAP hover interactions
  // ============================================================
  function initProcessHover() {
    if (typeof gsap === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.querySelectorAll('[data-process-step]').forEach(function (step) {
      var num    = step.querySelector('.mn-process-step__num');
      var title  = step.querySelector('h3');
      var arrow  = step.querySelector('.mn-process-step__arrow');

      // Set initial arrow state via GSAP so it matches CSS will-change
      if (arrow) gsap.set(arrow, { opacity: 0, x: -10 });

      step.addEventListener('mouseenter', function () {
        // Number: accent colour + slight scale
        if (num) {
          gsap.to(num, {
            color: '#C9A96E',
            scale: 1.15,
            transformOrigin: 'left center',
            duration: 0.3,
            ease: 'power2.out'
          });
        }
        // Title: slide right 6px
        if (title) {
          gsap.to(title, {
            x: 6,
            color: '#F2EDE8',
            duration: 0.35,
            ease: 'power2.out'
          });
        }
        // Arrow: fade + slide in from left
        if (arrow) {
          gsap.to(arrow, {
            opacity: 1,
            x: 0,
            duration: 0.4,
            ease: 'power3.out'
          });
        }
      });

      step.addEventListener('mouseleave', function () {
        if (num) {
          gsap.to(num, {
            color: '#555555',
            scale: 1,
            duration: 0.3,
            ease: 'power2.inOut'
          });
        }
        if (title) {
          gsap.to(title, {
            x: 0,
            color: '#F2EDE8',
            duration: 0.3,
            ease: 'power2.inOut'
          });
        }
        if (arrow) {
          gsap.to(arrow, {
            opacity: 0,
            x: -10,
            duration: 0.25,
            ease: 'power2.in'
          });
        }
      });
    });
  }

  // ============================================================
  // Button hover — GSAP text-stagger (slide up / slide in from below)
  // ============================================================
  function initButtonHover() {
    if (typeof gsap === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.querySelectorAll('.mn-btn').forEach(function (btn) {
      // Skip if already initialised (e.g. called twice)
      if (btn.querySelector('.mn-btn__inner')) return;

      var text = btn.textContent.trim();
      if (!text) return;

      // Rebuild interior: two stacked clones inside a 2× tall wrapper
      btn.innerHTML =
        '<span class="mn-btn__inner" aria-hidden="false">' +
          '<span class="mn-btn__text">' + text + '</span>' +
          '<span class="mn-btn__text" aria-hidden="true">' + text + '</span>' +
        '</span>';

      var inner = btn.querySelector('.mn-btn__inner');

      btn.addEventListener('mouseenter', function () {
        gsap.to(inner, { yPercent: -50, duration: 0.45, ease: 'power3.inOut' });
      });

      btn.addEventListener('mouseleave', function () {
        gsap.to(inner, { yPercent: 0, duration: 0.45, ease: 'power3.inOut' });
      });
    });
  }

  // ============================================================
  // Work / Portfolio Swiper
  // ============================================================
  function initWorkSwiper() {
    if (typeof Swiper === 'undefined') return;

    var container = document.querySelector('[data-work-swiper]');
    if (!container) return;

    var prevBtn = document.querySelector('[data-work-prev]');
    var nextBtn = document.querySelector('[data-work-next]');

    var swiper = new Swiper(container, {
      slidesPerView: 'auto',
      spaceBetween: 24,
      grabCursor: true,
      speed: 700,
      navigation: {
        prevEl: prevBtn || null,
        nextEl: nextBtn || null
      },
      breakpoints: {
        0:   { spaceBetween: 16 },
        768: { spaceBetween: 24 },
        1200:{ spaceBetween: 32 }
      }
    });
  }

  // ============================================================
  // Testimonial Swiper
  // ============================================================
  function initTestimonialSwiper() {
    if (typeof Swiper === 'undefined') return;

    var container = document.querySelector('[data-testi-swiper]');
    if (!container) return;

    var pagination = document.querySelector('[data-testi-pagination]');

    new Swiper(container, {
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 800,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: true },
      pagination: {
        el: pagination || null,
        clickable: true
      }
    });
  }

})();
