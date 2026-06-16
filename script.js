/* =============================================
   PORTFOLIO SCRIPT
   ============================================= */
 
// ── Footer year ──────────────────────────────
document.getElementById('footer-year').textContent =
  new Date().getFullYear();
 
// ── Navbar: scroll state & active link ───────
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-link');
const sections  = document.querySelectorAll('.section');
 
function updateNavbar() {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}
 
function updateActiveLink() {
  let current = '';
  sections.forEach(sec => {
    const top    = sec.offsetTop - 80;
    const bottom = top + sec.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) {
      current = sec.id;
    }
  });
  navLinks.forEach(link => {
    const href = link.getAttribute('href').slice(1);
    link.classList.toggle('active', href === current);
  });
}
 
window.addEventListener('scroll', () => {
  updateNavbar();
  updateActiveLink();
}, { passive: true });
 
updateNavbar();
 
// ── Hamburger (mobile nav) ────────────────────
const hamburger = document.getElementById('hamburger');
const navList   = document.querySelector('.nav-links');
 
hamburger.addEventListener('click', () => {
  const isOpen = navList.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});
 
// Close on nav link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navList.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});
 
// ── Smooth scroll for all internal anchors ────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
 
// ── Intersection Observer: entrance animations ─
const observerOpts = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};
 
const entranceObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const siblings = Array.from(entry.target.parentElement.children);
      const idx      = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = `${idx * 80}ms`;
      entry.target.classList.add('visible');
      entranceObserver.unobserve(entry.target);
    }
  });
}, observerOpts);
 
// Observe skill cards
document.querySelectorAll('.skill-card').forEach(el => entranceObserver.observe(el));
 
// Observe project cards
document.querySelectorAll('.project-card').forEach(el => entranceObserver.observe(el));
 
// Observe timeline items
function observeTimelineItems(tabEl) {
  tabEl.querySelectorAll('.timeline-item').forEach(el => {
    el.classList.remove('visible');
    el.style.transitionDelay = '';
    entranceObserver.observe(el);
  });
}
observeTimelineItems(document.getElementById('tab-leadership'));
 
// ── Skill bar animation on visibility ─────────
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fill  = entry.target.querySelector('.skill-fill');
      const width = fill.dataset.width;
      setTimeout(() => { fill.style.width = width + '%'; }, 200);
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
 
document.querySelectorAll('.skill-card').forEach(card => skillObserver.observe(card));
 
// ── Project documentation toggle ──────────────
function openDoc(projectId) {
  const doc  = document.getElementById('doc-' + projectId);
  const card = document.getElementById(projectId);
  if (!doc) return;
  doc.classList.add('open');
  card.style.borderColor = 'rgba(79, 142, 247, 0.5)';
  setTimeout(() => {
    doc.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 80);
}
 
function closeDoc(projectId) {
  const doc  = document.getElementById('doc-' + projectId);
  const card = document.getElementById(projectId);
  if (!doc) return;
  doc.classList.remove('open');
  card.style.borderColor = '';
}
 
document.querySelectorAll('.btn-doc').forEach(btn => {
  btn.addEventListener('click', () => {
    const pid = btn.dataset.project;
    const doc = document.getElementById('doc-' + pid);
    if (doc && doc.classList.contains('open')) {
      closeDoc(pid);
    } else {
      openDoc(pid);
    }
  });
});
 
document.querySelectorAll('.btn-close-doc').forEach(btn => {
  btn.addEventListener('click', () => closeDoc(btn.dataset.project));
});
 
// Tutup panel PROYEK saat klik di luar project-card
// Panel exp-doc TIDAK disentuh di sini
document.addEventListener('click', e => {
  if (!e.target.closest('.project-card')) {
    document.querySelectorAll('.project-doc.open').forEach(doc => {
      const fullId = doc.id.replace('doc-', '');
      closeDoc(fullId);
    });
  }
});
 
// ── Experience documentation toggle ──────────
function toggleExpDoc(id) {
  const panel = document.getElementById(id);
  if (!panel) return;
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) {
    setTimeout(() => {
      panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 80);
  }
}
 
// ── Experience tabs ───────────────────────────
const expTabs      = document.querySelectorAll('.exp-tab');
const expTimelines = {
  leadership:   document.getElementById('tab-leadership'),
  organization: document.getElementById('tab-organization')
};
 
expTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;
 
    expTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
 
    Object.entries(expTimelines).forEach(([key, el]) => {
      if (key === target) {
        el.classList.remove('hidden');
        el.querySelectorAll('.timeline-item').forEach(item => {
          item.classList.remove('visible');
          item.style.transitionDelay = '';
        });
        setTimeout(() => observeTimelineItems(el), 50);
      } else {
        el.classList.add('hidden');
      }
    });
  });
});
 
// ── Keyboard accessibility untuk tombol ───────
document.querySelectorAll('.btn-doc, .btn-close-doc').forEach(btn => {
  btn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});
 
// ── Parallax pada hero rings ──────────────────
const rings = document.querySelectorAll('.hero-ring');
 
if (window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
 
    rings.forEach((ring, i) => {
      const factor = (i + 1) * 5;
      ring.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  }, { passive: true });
}
 
// ── Typed effect pada hero name ───────────────
(function typedHero() {
  const el = document.querySelector('.hero-name');
  if (!el) return;
 
  const fullText = el.textContent.replace('_', '').trim();
  const textNode = el.childNodes[0];
 
  if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;
  if (!fullText) return;
 
  textNode.textContent = '';
  let i = 0;
  const speed = 60;
 
  setTimeout(() => {
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        textNode.textContent = fullText.slice(0, i);
        i++;
      } else {
        clearInterval(interval);
      }
    }, speed);
  }, 500);
})();
 
// ── Highlight nav on hash change ─────────────
window.addEventListener('hashchange', updateActiveLink);
updateActiveLink();