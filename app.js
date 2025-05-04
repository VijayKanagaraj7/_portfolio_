console.log("Casting portfolio loaded.");

document.addEventListener('DOMContentLoaded', () => {
    // Cards Navigation System
    const cards = document.querySelectorAll('.card');
    const nextButtons = document.querySelectorAll('.next-btn');
    const prevButtons = document.querySelectorAll('.prev-btn');
    let currentCard = 0;

    // Show first card initially
    cards[0].classList.add('active');

    // Add click event listeners to next buttons
    nextButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            if (currentCard < cards.length - 1) {
                // Hide current card
                cards[currentCard].classList.remove('active');
                
                // Show next card
                currentCard++;
                cards[currentCard].classList.add('active');
                
                // Update button states
                updateButtonStates();
            }
        });
    });

    // Add click event listeners to previous buttons
    prevButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            if (currentCard > 0) {
                // Hide current card
                cards[currentCard].classList.remove('active');
                
                // Show previous card
                currentCard--;
                cards[currentCard].classList.add('active');
                
                // Update button states
                updateButtonStates();
            }
        });
    });

    function updateButtonStates() {
        // Disable/enable previous buttons
        prevButtons.forEach(button => {
            button.disabled = currentCard === 0;
        });
        
        // Disable/enable next buttons
        nextButtons.forEach(button => {
            button.disabled = currentCard === cards.length - 1;
        });
    }

    // Initial button states
    updateButtonStates();

    // Add swipe functionality for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0 && currentCard > 0) {
                // Swipe right - previous card
                cards[currentCard].classList.remove('active');
                currentCard--;
                cards[currentCard].classList.add('active');
                updateButtonStates();
            } else if (swipeDistance < 0 && currentCard < cards.length - 1) {
                // Swipe left - next card
                cards[currentCard].classList.remove('active');
                currentCard++;
                cards[currentCard].classList.add('active');
                updateButtonStates();
            }
        }
    }

    // Enhanced Gallery Functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.querySelector('.close-lightbox');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    let currentImgIndex = 0;
    let filteredGalleryItems = [...galleryItems];

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Filter gallery items
            galleryItems.forEach(item => {
                const year = item.getAttribute('data-year');
                if (filter === 'all' || year === filter) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
            
            // Update filtered items array for lightbox navigation
            filteredGalleryItems = [...galleryItems].filter(item => {
                const year = item.getAttribute('data-year');
                return filter === 'all' || year === filter;
            });
        });
    });

    // Lightbox functionality
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const year = item.getAttribute('data-year');
            
            openLightbox(img.src, year, filteredGalleryItems.indexOf(item));
        });
    });

    function openLightbox(imgSrc, year, index) {
        lightboxImg.src = imgSrc;
        lightbox.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Set current image index for navigation
        currentImgIndex = index;
        updateLightboxNavigation();
    }

    function updateLightboxNavigation() {
        // Hide/show prev/next buttons based on current index
        lightboxPrev.style.visibility = currentImgIndex > 0 ? 'visible' : 'hidden';
        lightboxNext.style.visibility = currentImgIndex < filteredGalleryItems.length - 1 ? 'visible' : 'hidden';
    }

    // Close lightbox
    closeLightbox.addEventListener('click', () => {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close lightbox when clicking outside image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Navigate to previous image
    lightboxPrev.addEventListener('click', () => {
        if (currentImgIndex > 0) {
            currentImgIndex--;
            const prevItem = filteredGalleryItems[currentImgIndex];
            const img = prevItem.querySelector('img');
            const year = prevItem.getAttribute('data-year');
            
            lightboxImg.src = img.src;
            updateLightboxNavigation();
        }
    });

    // Navigate to next image
    lightboxNext.addEventListener('click', () => {
        if (currentImgIndex < filteredGalleryItems.length - 1) {
            currentImgIndex++;
            const nextItem = filteredGalleryItems[currentImgIndex];
            const img = nextItem.querySelector('img');
            const year = nextItem.getAttribute('data-year');
            
            lightboxImg.src = img.src;
            updateLightboxNavigation();
        }
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'block') {
            if (e.key === 'Escape') {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            } else if (e.key === 'ArrowLeft' && currentImgIndex > 0) {
                lightboxPrev.click();
            } else if (e.key === 'ArrowRight' && currentImgIndex < filteredGalleryItems.length - 1) {
                lightboxNext.click();
            }
        }
    });

    // Add loading animation
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Add fade-in animation to gallery items
        galleryItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('fade-in');
            }, index * 150);
        });
    });

    // Add masonry-like layout effect for gallery
    function adjustGalleryItemHeights() {
        // Reset all heights first
        galleryItems.forEach(item => {
            const imgContainer = item.querySelector('.gallery-image-container');
            imgContainer.style.height = '300px';
        });
        
        // Only apply varied heights on larger screens
        if (window.innerWidth > 768) {
            // Apply varied heights to create masonry effect
            galleryItems.forEach((item, index) => {
                const imgContainer = item.querySelector('.gallery-image-container');
                if (index % 3 === 0) {
                    imgContainer.style.height = '350px';
                } else if (index % 3 === 1) {
                    imgContainer.style.height = '280px';
                } else {
                    imgContainer.style.height = '320px';
                }
            });
        }
    }

    // Initial call and resize listener
    adjustGalleryItemHeights();
    window.addEventListener('resize', adjustGalleryItemHeights);

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('.card').forEach(section => {
        observer.observe(section);
    });
});