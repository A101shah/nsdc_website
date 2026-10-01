document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // Elements
  // --------------------------------------------------------------------------
  const siteHeader = document.getElementById('siteHeader');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('nav-links');
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const scrollLineFill = document.getElementById('scrollLineFill');
  const sectionCounter = document.getElementById('sectionCounter');
  const scrollKicker = document.getElementById('scrollKicker');
  const yearElement = document.getElementById('year');

  // Set current year in footer
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // Mobile Navigation Drawer Toggle
  // --------------------------------------------------------------------------
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking nav link
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!siteHeader.contains(e.target) && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --------------------------------------------------------------------------
  // Top Scroll Progress Bar & Sticky Header
  // --------------------------------------------------------------------------
  function handleScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Update top progress bar width
    if (docHeight > 0 && scrollProgressBar) {
      const scrollPercent = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    // Toggle sticky glassmorphic header style
    if (siteHeader) {
      if (scrollTop > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Update hero scroll fill line
    if (scrollLineFill) {
      const heroHeight = document.getElementById('hero')?.offsetHeight || window.innerHeight;
      const heroScrollPercent = Math.min(100, Math.max(0, (scrollTop / heroHeight) * 100));
      scrollLineFill.style.width = `${heroScrollPercent}%`;
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial invocation

  // --------------------------------------------------------------------------
  // Active Section Tracking & Dynamic Counter
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('main > section[data-section]');
  const navItems = document.querySelectorAll('.nav-links a[data-nav]');

  const sectionObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');
        const sectionNum = entry.target.getAttribute('data-section');
        const sectionName = entry.target.getAttribute('data-section-name');

        // Update active navbar link
        navItems.forEach(item => {
          const navTarget = item.getAttribute('data-nav');
          if (navTarget === sectionId) {
            item.classList.add('active');
          } else {
            item.classList.remove('active');
          }
        });

        // Update bottom scroll indicator counter
        if (sectionCounter && sectionNum) {
          sectionCounter.textContent = `${sectionNum} / 09`;
        }
        if (scrollKicker && sectionName) {
          scrollKicker.textContent = sectionId === 'hero' ? 'SCROLL TO DISCOVER' : sectionName;
        }
      }
    });
  }, sectionObserverOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // --------------------------------------------------------------------------
  // Scroll Reveal Animations
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserverOptions = {
    root: null,
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // --------------------------------------------------------------------------
  // Stat Card Count-Up Animation
  // --------------------------------------------------------------------------
  const statCards = document.querySelectorAll('.stat-card[data-count]');
  
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numElement = entry.target.querySelector('.count-num');
        const targetValue = parseInt(entry.target.getAttribute('data-count'), 10);
        
        if (numElement && !isNaN(targetValue)) {
          animateCount(numElement, targetValue);
        }
        countObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statCards.forEach(card => countObserver.observe(card));

  function animateCount(element, target) {
    let start = 0;
    const duration = 1200; // ms
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quadratic
      const current = Math.floor(progress * (2 - progress) * target);
      element.textContent = current < 10 ? `0${current}` : `${current}`;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = target < 10 ? `0${target}` : `${target}`;
      }
    }

    requestAnimationFrame(update);
  }

  // --------------------------------------------------------------------------
  // Dynamic Interactive Mouse Movement for Hero Orbits & Wallpaper
  // --------------------------------------------------------------------------
  const heroHome = document.querySelector('.hero-home');
  const heroWallpaper = document.querySelector('.hero-wallpaper');
  const heroOrbitsContainer = document.getElementById('heroOrbitsContainer');

  if (heroHome) {
    heroHome.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const xPercent = (clientX / innerWidth - 0.5);
      const yPercent = (clientY / innerHeight - 0.5);

      // Parallax on Wallpaper
      if (heroWallpaper) {
        heroWallpaper.style.transform = `scale(1.03) translate3d(${xPercent * 18}px, ${yPercent * 18}px, 0)`;
      }

      // Dynamic 3D tilt on Orbits Container
      if (heroOrbitsContainer) {
        const tiltX = yPercent * -25;
        const tiltY = xPercent * 25;
        heroOrbitsContainer.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translate3d(${xPercent * 25}px, ${yPercent * 25}px, 0)`;
      }
    });

    heroHome.addEventListener('mouseleave', () => {
      if (heroWallpaper) {
        heroWallpaper.style.transform = 'scale(1.02) translate3d(0, 0, 0)';
      }
      if (heroOrbitsContainer) {
        heroOrbitsContainer.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
      }
    });
  }

  // --------------------------------------------------------------------------
  // Idea Canvas Logic
  // --------------------------------------------------------------------------
  const ideaInput = document.getElementById('ideaInput');
  const addIdeaBtn = document.getElementById('addIdeaBtn');
  const ideaCanvas = document.getElementById('ideaCanvas');

  if (addIdeaBtn && ideaInput && ideaCanvas) {
    const stickerColors = ['#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#ffc6ff'];
    let zIndexCounter = 10;

    function makeStickerDraggable(sticker) {
      let isDragging = false;
      let startX, startY, initialLeft, initialTop;

      sticker.style.cursor = 'grab';
      // Prevent default touch actions like scrolling when dragging
      sticker.style.touchAction = 'none';

      const onPointerMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        sticker.style.left = `${initialLeft + dx}px`;
        sticker.style.top = `${initialTop + dy}px`;
      };

      const onPointerUp = () => {
        if (isDragging) {
          isDragging = false;
          sticker.style.cursor = 'grab';
          document.removeEventListener('pointermove', onPointerMove);
          document.removeEventListener('pointerup', onPointerUp);
        }
      };

      sticker.addEventListener('pointerdown', (e) => {
        isDragging = true;
        sticker.style.cursor = 'grabbing';
        zIndexCounter++;
        sticker.style.zIndex = zIndexCounter;
        
        startX = e.clientX;
        startY = e.clientY;
        
        // Convert position to pixels for smoother dragging
        initialLeft = sticker.offsetLeft;
        initialTop = sticker.offsetTop;
        
        sticker.style.left = `${initialLeft}px`;
        sticker.style.top = `${initialTop}px`;
        
        e.preventDefault();
        
        document.addEventListener('pointermove', onPointerMove);
        document.addEventListener('pointerup', onPointerUp);
      });
    }

    // Make initial hardcoded stickers draggable
    ideaCanvas.querySelectorAll('.sticker').forEach(makeStickerDraggable);

    addIdeaBtn.addEventListener('click', () => {
      const text = ideaInput.value.trim();
      if (!text) return;

      const sticker = document.createElement('div');
      sticker.className = 'sticker';
      sticker.textContent = text;
      
      // Random position and rotation
      const x = Math.random() * 70 + 5; // 5% to 75%
      const y = Math.random() * 65 + 5; // 5% to 70%
      const rot = Math.random() * 30 - 15; // -15deg to +15deg
      const color = stickerColors[Math.floor(Math.random() * stickerColors.length)];

      sticker.style.left = `${x}%`;
      sticker.style.top = `${y}%`;
      sticker.style.transform = `rotate(${rot}deg) scale(0)`;
      sticker.style.background = color;

      ideaCanvas.appendChild(sticker);
      makeStickerDraggable(sticker);
      
      // Animate entry
      requestAnimationFrame(() => {
        sticker.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        sticker.style.transform = `rotate(${rot}deg) scale(1)`;
      });

      ideaInput.value = '';
    });
    
    ideaInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addIdeaBtn.click();
    });
  }

  // --------------------------------------------------------------------------
  // Event Date Filtering
  // --------------------------------------------------------------------------
  const eventCards = document.querySelectorAll('.event-card');
  const noEventsMessage = document.getElementById('no-events-message');
  
  if (eventCards.length > 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let visibleEvents = 0;
    
    eventCards.forEach(card => {
      const eventDateStr = card.getAttribute('data-date');
      if (eventDateStr) {
        const eventDate = new Date(eventDateStr);
        if (eventDate < today) {
          card.style.display = 'none';
        } else {
          visibleEvents++;
        }
      } else {
        // If no date is set, assume it's an upcoming event
        visibleEvents++;
      }
    });

    if (visibleEvents === 0 && noEventsMessage) {
      noEventsMessage.style.display = 'block';
    }
  }

});