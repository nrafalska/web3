// ======= Mobile menu, smooth scroll, form, gallery, animations =======
document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle (for classic menu with .menu-toggle/.nav-menu)
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function() {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  // Smooth scroll to anchors (on single page)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Contact form submission handler (for Formspree or custom endpoint)
  window.handleSubmit = function(event) {
    event.preventDefault();
    const form = document.getElementById('contactForm');
    const formData = new FormData(form);
    fetch('https://formspree.io/f/mldbzjyw', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    }).finally(() => {
      window.location.href = 'merci.html';
    });
  };

  // Scroll animation for cards and images
  const animatedEls = document.querySelectorAll('.card, .section-image img, .about-image img');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-on-scroll');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  animatedEls.forEach(el => observer.observe(el));

  // Initialize automatic image galleries
  initImageGalleries();
});

// Function to initialize all image galleries on the page
function initImageGalleries() {
  const galleries = document.querySelectorAll('.section-gallery');
  galleries.forEach(gallery => {
    const images = gallery.querySelectorAll('.gallery-img');
    const dots = gallery.querySelectorAll('.gallery-dot');
    let currentIndex = 0;
    let interval = null;

    // Якщо менше двох зображень — нічого не робимо
    if (images.length < 2) return;

    // Показати потрібний слайд
    function showSlide(index) {
      images.forEach(img => img.style.display = 'none');
      dots.forEach(dot => dot.style.backgroundColor = 'rgba(255,255,255,0.5)');
      if (images[index]) images[index].style.display = 'block';
      if (dots[index]) dots[index].style.backgroundColor = '#ffffff';
      currentIndex = index;
    }

    // Клік по dot
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        clearInterval(interval);
        showSlide(index);
        startAutoScroll();
      });
    });

    // Запуск автопрокрутки
    function startAutoScroll() {
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        const nextIndex = (currentIndex + 1) % images.length;
        showSlide(nextIndex);
      }, 3000);
    }

    // Hover-пауза
    gallery.addEventListener('mouseenter', () => {
      clearInterval(interval);
    });
    gallery.addEventListener('mouseleave', () => {
      startAutoScroll();
    });

    // Запустити одразу
    startAutoScroll();
    showSlide(0);

    // Swipe для мобільних
    let touchStartX = 0;
    let touchEndX = 0;
    gallery.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].screenX;
    }, false);
    gallery.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, false);

    function handleSwipe() {
      if (touchEndX < touchStartX - 40) { // swipe left
        clearInterval(interval);
        showSlide((currentIndex + 1) % images.length);
        startAutoScroll();
      } else if (touchEndX > touchStartX + 40) { // swipe right
        clearInterval(interval);
        showSlide((currentIndex - 1 + images.length) % images.length);
        startAutoScroll();
      }
    }
  });
}
