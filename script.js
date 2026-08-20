/* -------------------------------------------------------------
 * Script for Sarah Yaseen - WordPress Developer Portfolio
 * Handles Navigation, Filtering, Validation, and Scroll Effects
 * ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. Sticky Header & Compact Scroll Effect
  // ==========================================
  const header = document.querySelector('.header');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ==========================================
  // 2. Full-Screen Menu Overlay Toggle
  // ==========================================
  const hamburger = document.getElementById('hamburger');
  const navigation = document.getElementById('navigation');
  const overlayLinks = document.querySelectorAll('.nav-overlay-link');

  if (hamburger && navigation) {
    hamburger.addEventListener('click', () => {
      const isOpen = navigation.classList.contains('open');
      
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close menu when a link inside is clicked
    overlayLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Close menu when pressing the Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navigation.classList.contains('open')) {
        closeMenu();
      }
    });

    function openMenu() {
      navigation.classList.add('open');
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      navigation.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Stop page scrolling background
    }

    function closeMenu() {
      navigation.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      navigation.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Restore scrolling
    }
  }

  // ==========================================
  // 3. Active Link Highlight on Scroll
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  
  function highlightNavOnScroll() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120; // offset for sticky header
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-overlay-link[href*=${sectionId}]`);
      
      if (activeLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          activeLink.classList.add('active');
        } else {
          activeLink.classList.remove('active');
        }
      }
    });
  }
  
  window.addEventListener('scroll', highlightNavOnScroll);

  // ==========================================
  // 4. Portfolio Interactive Filters
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active state on buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        // Simple animation trigger for show/hide
        if (filterValue === 'all') {
          card.classList.remove('hide');
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
        } else {
          const cardCategories = card.getAttribute('data-category').split(' ');
          if (cardCategories.includes(filterValue)) {
            card.classList.remove('hide');
            setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.9)';
            setTimeout(() => card.classList.add('hide'), 300);
          }
        }
      });
    });
  });

  // ==========================================
  // 5. Intersection Observer: Fade-up & Skill Meters
  // ==========================================
  const fadeElements = document.querySelectorAll('.fade-up');
  const skillMeters = document.querySelectorAll('.skill-meter-fill');

  const appearanceOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearanceObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, appearanceOptions);

  fadeElements.forEach(el => appearanceObserver.observe(el));

  // Skill meters transition trigger
  const skillOptions = {
    threshold: 0.5
  };

  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const level = fill.getAttribute('data-level');
        fill.style.width = level + '%';
        observer.unobserve(fill);
      }
    });
  }, skillOptions);

  skillMeters.forEach(meter => skillObserver.observe(meter));

  // ==========================================
  // 6. Contact Form Validation & Submission
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const successMsg = document.getElementById('successMsg');

  if (contactForm) {
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.textContent : 'Send Inquiry';

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      let isValid = true;
      const inputs = contactForm.querySelectorAll('.form-control');

      inputs.forEach(input => {
        const value = input.value.trim();
        const errorMsgEl = input.nextElementSibling; // the .form-error element

        // Reset errors
        input.classList.remove('invalid');
        if (errorMsgEl && errorMsgEl.classList.contains('form-error')) {
          errorMsgEl.style.display = 'none';
        }

        // Validate required fields
        if (input.hasAttribute('required') && value === '') {
          showError(input, 'This field is required');
          isValid = false;
        }

        // Validate email format
        if (input.type === 'email' && value !== '') {
          const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailPattern.test(value)) {
            showError(input, 'Please enter a valid email address');
            isValid = false;
          }
        }
      });

      if (isValid) {
        // Collect form data
        const formData = {
          name: document.getElementById('name').value.trim(),
          email: document.getElementById('email').value.trim(),
          phone: document.getElementById('phone') ? document.getElementById('phone').value.trim() : '',
          subject: document.getElementById('subject') ? document.getElementById('subject').value.trim() : '',
          projectType: document.getElementById('projectType') ? document.getElementById('projectType').value : '',
          budget: document.getElementById('budget') ? document.getElementById('budget').value : '',
          message: document.getElementById('message').value.trim()
        };

        // Loading state
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sending Inquiry...';
          submitBtn.style.opacity = '0.7';
        }

        // Hide previous success message
        if (successMsg) {
          successMsg.style.display = 'none';
        }

        // Submit data to backend API
        fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        })
        .then(response => {
          if (!response.ok) {
            return response.json().then(errData => {
              throw new Error(errData.error || 'Server error occurred during submission.');
            });
          }
          return response.json();
        })
        .then(resData => {
          // Success Feedback
          if (successMsg) {
            successMsg.style.display = 'flex';
            successMsg.style.borderColor = 'rgba(16, 185, 129, 0.2)';
            successMsg.style.backgroundColor = 'rgba(16, 185, 129, 0.08)';
            successMsg.style.color = '#10B981';
            successMsg.querySelector('svg').style.color = '#10B981';
            successMsg.querySelector('svg').innerHTML = '<polyline points="20 6 9 17 4 12"/>';
            successMsg.querySelector('span').textContent = 'Thank you! Your inquiry has been sent successfully. I will get back to you shortly.';
            successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            contactForm.reset();

            // Clear success message after 6 seconds
            setTimeout(() => {
              successMsg.style.display = 'none';
            }, 6000);
          }
        })
        .catch(error => {
          console.error('Submission error:', error);
          if (successMsg) {
            successMsg.style.display = 'flex';
            successMsg.style.borderColor = '#EF4444';
            successMsg.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
            successMsg.style.color = '#EF4444';
            successMsg.querySelector('svg').style.color = '#EF4444';
            successMsg.querySelector('svg').innerHTML = '<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2"/><line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2"/>';
            successMsg.querySelector('span').textContent = error.message || 'Failed to send inquiry. Please try again later.';
            successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        })
        .finally(() => {
          // Reset button loading state
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
            submitBtn.style.opacity = '';
          }
        });
      }
    });

    function showError(input, message) {
      input.classList.add('invalid');
      const errorMsgEl = input.nextElementSibling;
      if (errorMsgEl && errorMsgEl.classList.contains('form-error')) {
        errorMsgEl.textContent = message;
        errorMsgEl.style.display = 'block';
      }
    }
  }

  // ==========================================
  // 7. FAQs Accordion Trigger
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Close other open accordion items
        faqItems.forEach(i => {
          i.classList.remove('active');
          const content = i.querySelector('.faq-content');
          if (content) content.style.maxHeight = '0';
        });
        
        if (!isActive) {
          item.classList.add('active');
          const content = item.querySelector('.faq-content');
          if (content) content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    }
  });

  // ==========================================
  // 8. Cross-Page Navigation Smooth Scroll
  // ==========================================
  const crossPageLinks = document.querySelectorAll('a[href*="index.html#"]');
  crossPageLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const currentPath = window.location.pathname;
      const isHomePage = currentPath === '/' || currentPath.endsWith('index.html') || currentPath === '';
      
      if (isHomePage) {
        const hrefValue = link.getAttribute('href');
        const hashIndex = hrefValue.indexOf('#');
        if (hashIndex !== -1) {
          const targetId = hrefValue.substring(hashIndex + 1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            e.preventDefault();
            
            // Close mobile menu if open
            const nav = document.getElementById('navigation');
            const ham = document.getElementById('hamburger');
            if (nav && ham && nav.classList.contains('open')) {
              nav.classList.remove('open');
              ham.classList.remove('open');
              ham.setAttribute('aria-expanded', 'false');
              nav.setAttribute('aria-hidden', 'true');
              document.body.style.overflow = '';
            }
            
            // Scroll to element
            setTimeout(() => {
              targetElement.scrollIntoView({ behavior: 'smooth' });
            }, 50);
            
            // Update URL hash without reloading the page
            history.pushState(null, null, '#' + targetId);
          }
        }
      }
    });
  });

});
