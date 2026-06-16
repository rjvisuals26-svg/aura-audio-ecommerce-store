// Reveal on scroll — handles .reveal, .reveal-left, .reveal-right, .reveal-scale
const revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.10 });
document.querySelectorAll(revealSelectors).forEach(el => io.observe(el));

// Auto stagger siblings in grids
document.querySelectorAll('.product-grid-clean, .category-grid, .features-grid-banner').forEach(grid => {
  Array.from(grid.children).forEach((child, i) => {
    child.style.transitionDelay = `${i * 0.12}s`;
  });
});


// Animated counters
const counters = document.querySelectorAll('.num');
const counterIO = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    const el = e.target;
    const to = parseFloat(el.dataset.to);
    const suffix = el.dataset.suffix || '';
    const dur = 1600; const start = performance.now();
    function tick(now){
      const p = Math.min(1,(now-start)/dur);
      const eased = 1 - Math.pow(1-p,3);
      el.textContent = Math.round(to*eased) + suffix;
      if(p<1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterIO.unobserve(el);
  });
},{threshold:.5});
counters.forEach(c=>counterIO.observe(c));



// Mobile burger
const burger = document.querySelector('.burger');
const links = document.querySelector('.nav-links');
if(burger){
  burger.addEventListener('click',()=>{
    if(!links) return;
    const open = links.style.display === 'flex';
    links.style.display = open ? 'none' : 'flex';
    links.style.flexDirection = 'column';
    links.style.position = 'absolute';
    links.style.top = '64px';
    links.style.left = '0';
    links.style.right = '0';
    links.style.background = 'rgba(255,255,255,.95)';
    links.style.backdropFilter = 'blur(16px)';
    links.style.padding = '20px';
    links.style.borderBottom = '1px solid rgba(0,0,0,.06)';
  });
}

// Search toggle
const searchToggle = document.getElementById('searchToggle');
const searchInput  = document.getElementById('searchInput');
if (searchToggle && searchInput) {
  searchToggle.addEventListener('click', () => {
    searchInput.classList.toggle('open');
    if (searchInput.classList.contains('open')) searchInput.focus();
  });
  document.addEventListener('click', e => {
    if (!e.target.closest('#navSearchWrap')) searchInput.classList.remove('open');
  });
}

// Cart counter
let cartCount = 0;
const cartBadge = document.getElementById('cartBadge');
function incrementCart() {
  cartCount++;
  if (cartBadge) { cartBadge.textContent = cartCount; cartBadge.style.transform = 'scale(1.4)'; setTimeout(() => cartBadge.style.transform = '', 250); }
}
document.querySelectorAll('.na-buy-btn, .na-cart-btn, .tt-buy-btn').forEach(btn => {
  btn.addEventListener('click', e => { e.preventDefault(); incrementCart(); });
});

// Wishlist heart toggle
document.querySelectorAll('[aria-label="Wishlist"]').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.textContent = btn.textContent.trim() === '♡' ? '♥' : '♡';
    btn.style.color = btn.textContent.trim() === '♥' ? '#e63946' : '';
  });
});

// Newsletter form
function handleNewsletter(e) {
  e.preventDefault();
  const input = document.getElementById('newsletterEmail');
  const btn = e.target.querySelector('button[type=submit]');
  if (!input || !btn) return;
  btn.textContent = '✓ Subscribed!';
  btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
  input.value = '';
  setTimeout(() => { btn.textContent = 'Subscribe →'; btn.style.background = ''; }, 4000);
}

// Product Card Like Button toggle
document.querySelectorAll('.na-like-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    btn.classList.toggle('liked');
  });
});

// Generic slider factory: wires up arrows + drag-to-scroll for any track
function initSlider(trackId, prevSel, nextSel) {
  const track = document.getElementById(trackId);
  const prev  = document.querySelector(prevSel);
  const next  = document.querySelector(nextSel);
  if (!track || !prev || !next) return;

  const scrollAmt = () => (track.querySelector('.na-card')?.offsetWidth || 260) + 20;
  next.addEventListener('click', () => track.scrollBy({ left:  scrollAmt(), behavior: 'smooth' }));
  prev.addEventListener('click', () => track.scrollBy({ left: -scrollAmt(), behavior: 'smooth' }));

  // Drag-to-scroll
  let isDown = false, startX, scrollLeft;
  track.addEventListener('mousedown',  e => { isDown = true; track.style.cursor = 'grabbing'; startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft; });
  track.addEventListener('mouseleave', () => { isDown = false; track.style.cursor = 'grab'; });
  track.addEventListener('mouseup',    () => { isDown = false; track.style.cursor = 'grab'; });
  track.addEventListener('mousemove',  e => { if (!isDown) return; e.preventDefault(); track.scrollLeft = scrollLeft - (e.pageX - track.offsetLeft - startX) * 1.4; });
  track.style.cursor = 'grab';
}

// New Arrivals slider
initSlider('naTrack', '.na-arrow-prev', '.na-arrow-next');

// Top Trending slider
initSlider('ttTrack', '.tt-arrow-prev', '.tt-arrow-next');

// You May Also Like slider
initSlider('ymalTrack', '.ymal-arrow-prev', '.ymal-arrow-next');

// Banner Slider
const bannerTrack = document.getElementById('bannerTrack');
const bannerPrev = document.querySelector('.banner-arrow-prev');
const bannerNext = document.querySelector('.banner-arrow-next');
const bannerDots = document.querySelectorAll('.banner-dots .dot');
if (bannerTrack && bannerPrev && bannerNext && bannerDots.length) {
  let activeIndex = 0;
  const updateDots = () => bannerDots.forEach((dot, i) => dot.classList.toggle('active', i === activeIndex));
  const scrollToSlide = (index) => {
    bannerTrack.scrollTo({ left: index * bannerTrack.offsetWidth, behavior: 'smooth' });
    activeIndex = index;
    updateDots();
  };
  bannerNext.addEventListener('click', () => scrollToSlide((activeIndex + 1) % bannerDots.length));
  bannerPrev.addEventListener('click', () => scrollToSlide((activeIndex - 1 + bannerDots.length) % bannerDots.length));
  bannerDots.forEach((dot, idx) => dot.addEventListener('click', () => scrollToSlide(idx)));
  
  // Update active dot on manual scroll
  bannerTrack.addEventListener('scroll', () => {
    const newIdx = Math.round(bannerTrack.scrollLeft / bannerTrack.offsetWidth);
    if (newIdx !== activeIndex && newIdx >= 0 && newIdx < bannerDots.length) {
      activeIndex = newIdx;
      updateDots();
    }
  });
}

/* -------------------------------------
 * PRODUCT PAGE LOGIC
 * ----------------------------------- */

// Product Gallery
const mainProductImage = document.getElementById('mainProductImage');
const thumbBtns = document.querySelectorAll('.thumb-btn');

if (mainProductImage && thumbBtns.length > 0) {
  thumbBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      thumbBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      mainProductImage.style.opacity = '0';
      setTimeout(() => {
        mainProductImage.src = btn.dataset.img;
        mainProductImage.style.opacity = '1';
      }, 150);
    });
  });
}

// Color Selector
const colorSwatches = document.querySelectorAll('.color-swatch');
const colorNameDisplay = document.getElementById('colorNameDisplay');

if (colorSwatches.length > 0 && colorNameDisplay) {
  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      colorNameDisplay.textContent = swatch.dataset.color;
      
      if (swatch.dataset.img && mainProductImage) {
        mainProductImage.style.opacity = '0';
        setTimeout(() => {
          mainProductImage.src = swatch.dataset.img;
          mainProductImage.style.opacity = '1';
        }, 150);
        
        if (thumbBtns.length > 0) {
          thumbBtns.forEach(b => {
            b.classList.remove('active');
            if (b.dataset.color === swatch.dataset.color) {
              b.classList.add('active');
            }
          });
        }
      }
    });
  });
}

if (thumbBtns.length > 0 && colorSwatches.length > 0) {
  thumbBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.dataset.color) {
        colorSwatches.forEach(s => {
          s.classList.remove('active');
          if (s.dataset.color === btn.dataset.color) {
            s.classList.add('active');
            if (colorNameDisplay) colorNameDisplay.textContent = s.dataset.color;
          }
        });
      }
    });
  });
}

// Accordions
const accordions = document.querySelectorAll('.accordion');

if (accordions.length > 0) {
  accordions.forEach(acc => {
    const trigger = acc.querySelector('.accordion-trigger');
    const content = acc.querySelector('.accordion-content');
    
    trigger.addEventListener('click', () => {
      const isActive = acc.classList.contains('active');
      
      accordions.forEach(a => {
        a.classList.remove('active');
        a.querySelector('.accordion-content').style.maxHeight = null;
      });
      
      if (!isActive) {
        acc.classList.add('active');
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
}

// Make all product cards clickable
const productCards = document.querySelectorAll('.na-card');
if (productCards.length > 0) {
  productCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (!e.target.closest('button') && !e.target.closest('a')) {
        window.location.href = 'product.html';
      }
    });
  });
}
