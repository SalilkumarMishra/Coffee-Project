// ============================================
// T Coffee Shop - Main JavaScript
// ============================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initStickyNavbar();
    initSmoothScroll();
    initScrollToTop();
    initMenuFilter();
    initGalleryModal();
    initBlogLoadMore();
    initContactForm();
    initCounterAnimation();
});

// ============================================
// Sticky Navbar
// ============================================
function initStickyNavbar() {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

        if (currentScroll > scrollThreshold) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

// ============================================
// Smooth Scrolling for Internal Links
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal links (not empty hash)
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ============================================
// Scroll to Top Button
// ============================================
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (!scrollToTopBtn) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'block';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
    });

    // Scroll to top on click
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// Menu Category Filter
// ============================================
function initMenuFilter() {
    const categoryButtons = document.querySelectorAll('[data-category]');
    const menuCategories = document.querySelectorAll('.menu-category');

    if (categoryButtons.length === 0 || menuCategories.length === 0) return;

    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetCategory = this.getAttribute('data-category');

            // Update button states
            categoryButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');

            // Show/hide menu categories
            menuCategories.forEach(category => {
                if (category.id === targetCategory) {
                    category.style.display = 'block';
                    // Smooth scroll to menu section
                    setTimeout(() => {
                        category.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                } else {
                    category.style.display = 'none';
                }
            });
        });
    });
}

// ============================================
// Gallery Modal
// ============================================
function initGalleryModal() {
    const galleryImages = document.querySelectorAll('.gallery-item img');
    const modalImage = document.getElementById('modalImage');
    const imageModal = document.getElementById('imageModal');

    if (galleryImages.length === 0 || !modalImage || !imageModal) return;

    galleryImages.forEach(img => {
        img.addEventListener('click', function() {
            const fullImageUrl = this.getAttribute('data-image') || this.src;
            modalImage.src = fullImageUrl;
            modalImage.alt = this.alt;
        });
    });

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = bootstrap.Modal.getInstance(imageModal);
            if (modal) {
                modal.hide();
            }
        }
    });
}

// ============================================
// Blog Load More
// ============================================
function initBlogLoadMore() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const blogPosts = document.querySelectorAll('.blog-post');
    
    if (!loadMoreBtn || blogPosts.length === 0) return;

    let visibleCount = 3; // Initially show 3 posts
    const postsToShow = 3; // Show 3 more each time

    // Initially hide posts beyond the first 3
    blogPosts.forEach((post, index) => {
        if (index >= visibleCount) {
            post.style.display = 'none';
        }
    });

    loadMoreBtn.addEventListener('click', function() {
        // Show next batch of posts
        for (let i = visibleCount; i < visibleCount + postsToShow && i < blogPosts.length; i++) {
            blogPosts[i].style.display = 'block';
        }

        visibleCount += postsToShow;

        // Hide button if all posts are visible
        if (visibleCount >= blogPosts.length) {
            loadMoreBtn.style.display = 'none';
        }

        // Smooth scroll to newly loaded posts
        if (visibleCount <= blogPosts.length) {
            setTimeout(() => {
                blogPosts[visibleCount - postsToShow].scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 100);
        }
    });
}

// ============================================
// Contact Form Validation
// ============================================
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Get form fields
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');

        // Reset previous validation states
        [name, email, message].forEach(field => {
            field.classList.remove('is-invalid', 'is-valid');
        });

        let isValid = true;

        // Validate name
        if (!name.value.trim()) {
            name.classList.add('is-invalid');
            isValid = false;
        } else {
            name.classList.add('is-valid');
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim() || !emailRegex.test(email.value)) {
            email.classList.add('is-invalid');
            isValid = false;
        } else {
            email.classList.add('is-valid');
        }

        // Validate message
        if (!message.value.trim()) {
            message.classList.add('is-invalid');
            isValid = false;
        } else {
            message.classList.add('is-valid');
        }

        // Show success message if valid
        if (isValid && formMessage) {
            formMessage.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    <strong>Thank you!</strong> Your message has been sent successfully. We'll get back to you soon.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
            
            // Reset form
            contactForm.reset();
            [name, email, message].forEach(field => {
                field.classList.remove('is-valid');
            });

            // Scroll to message
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else if (!isValid && formMessage) {
            formMessage.innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <strong>Please fix the errors</strong> and try again.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
        }
    });
}

// ============================================
// Counter Animation (for About page stats)
// ============================================
function initCounterAnimation() {
    const statItems = document.querySelectorAll('.stat-item h2[data-target]');
    
    if (statItems.length === 0) return;

    // Intersection Observer for scroll-triggered animation
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateCounter(entry.target);
                entry.target.classList.add('counted');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statItems.forEach(stat => {
        observer.observe(stat);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            // Format number with commas if needed
            if (target >= 1000) {
                element.textContent = Math.floor(current).toLocaleString();
            } else {
                element.textContent = Math.floor(current);
            }
            requestAnimationFrame(updateCounter);
        } else {
            // Ensure final value is exact
            if (target >= 1000) {
                element.textContent = target.toLocaleString();
            } else {
                element.textContent = target;
            }
        }
    };

    updateCounter();
}

// ============================================
// Utility Functions
// ============================================

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Optimize scroll event listeners
const optimizedScrollHandler = throttle(function() {
    // Scroll-based functions are already optimized
}, 100);

window.addEventListener('scroll', optimizedScrollHandler);

