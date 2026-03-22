// ========================================
// TEACHER PAGE - FIXED CAROUSEL
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure DOM is fully ready
    setTimeout(() => {
        initializeCarousel();
        initializeLoading();
    }, 50);
});

// ========== CAROUSEL ==========
function initializeCarousel() {
    const track = document.getElementById('carouselTrack');
    const wrapper = document.querySelector('.carousel-wrapper');
    
    if (!track || !wrapper) {
        console.error('Carousel elements not found');
        return;
    }
    
    const originalCards = Array.from(track.children);
    if (originalCards.length === 0) {
        console.error('No cards found');
        return;
    }
    
    console.log('Original cards:', originalCards.length);
    
    // Clone cards for infinite effect
    const cardsToClone = [...originalCards];
    
    // Add clones before (for scrolling left)
    cardsToClone.slice().reverse().forEach(card => {
        const clone = card.cloneNode(true);
        track.insertBefore(clone, track.firstChild);
    });
    
    // Add clones after (for scrolling right)
    cardsToClone.forEach(card => {
        const clone = card.cloneNode(true);
        track.appendChild(clone);
    });
    
    // Get all cards after cloning
    const allCards = Array.from(track.children);
    const cardsPerSet = originalCards.length;
    
    console.log('Total cards after cloning:', allCards.length);
    console.log('Cards per set:', cardsPerSet);
    
    // Initialize card flips
    initializeCardFlips(allCards);
    
    // Carousel state
    const state = {
        currentIndex: cardsPerSet, // Start at the original set (middle)
        isDragging: false,
        startX: 0,
        currentTranslate: 0,
        prevTranslate: 0,
        animationID: 0
    };
    
    // Get card width including gap
    function getCardWidth() {
        const card = allCards[0];
        if (!card) return 412;
        const rect = card.getBoundingClientRect();
        const styles = window.getComputedStyle(track);
        const gap = parseFloat(styles.gap) || 32;
        return rect.width + gap;
    }
    
    let cardWidth = getCardWidth();
    console.log('Card width:', cardWidth);
    
    // Set position without animation
    function setPositionByIndex(index) {
        state.currentIndex = index;
        state.currentTranslate = -state.currentIndex * cardWidth;
        state.prevTranslate = state.currentTranslate;
        track.style.transition = 'none';
        track.style.transform = `translateX(${state.currentTranslate}px)`;
    }
    
    // Set initial position (middle set)
    setPositionByIndex(cardsPerSet);
    console.log('Initial position set');
    
    // Animate to position
    function animateToIndex(index) {
        state.currentIndex = index;
        state.currentTranslate = -state.currentIndex * cardWidth;
        state.prevTranslate = state.currentTranslate;
        track.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        track.style.transform = `translateX(${state.currentTranslate}px)`;
    }
    
    // Check if we need to wrap around
    function checkWrap() {
        // If we've scrolled past the last set, wrap back to middle set
        if (state.currentIndex >= cardsPerSet * 2) {
            const offset = state.currentIndex - (cardsPerSet * 2);
            setTimeout(() => {
                setPositionByIndex(cardsPerSet + offset);
            }, 350);
        }
        // If we've scrolled before the first set, wrap forward to middle set
        else if (state.currentIndex < cardsPerSet) {
            const offset = state.currentIndex; // This will be 0 to cardsPerSet-1
            setTimeout(() => {
                setPositionByIndex(cardsPerSet + offset);
            }, 350);
        }
    }
    
    // Navigation
    function goNext() {
        animateToIndex(state.currentIndex + 1);
        checkWrap();
    }
    
    function goPrev() {
        animateToIndex(state.currentIndex - 1);
        checkWrap();
    }
    
    // Drag functionality
    function touchStart(e) {
        state.isDragging = true;
        state.startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        state.animationID = requestAnimationFrame(animation);
        track.style.cursor = 'grabbing';
    }
    
    function touchMove(e) {
        if (!state.isDragging) return;
        
        const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        state.currentTranslate = state.prevTranslate + currentX - state.startX;
    }
    
    function touchEnd() {
        if (!state.isDragging) return;
        
        state.isDragging = false;
        cancelAnimationFrame(state.animationID);
        track.style.cursor = 'grab';
        
        const movedBy = state.currentTranslate - state.prevTranslate;
        
        // Determine direction and snap to nearest card
        if (movedBy < -50) {
            state.currentIndex += 1;
        } else if (movedBy > 50) {
            state.currentIndex -= 1;
        }
        
        // Clamp index
        if (state.currentIndex < 0) state.currentIndex = 0;
        if (state.currentIndex >= allCards.length) state.currentIndex = allCards.length - 1;
        
        animateToIndex(state.currentIndex);
        checkWrap();
    }
    
    function animation() {
        if (state.isDragging) {
            track.style.transition = 'none';
            track.style.transform = `translateX(${state.currentTranslate}px)`;
            requestAnimationFrame(animation);
        }
    }
    
    // Mouse events
    track.addEventListener('mousedown', touchStart);
    document.addEventListener('mousemove', touchMove);
    document.addEventListener('mouseup', touchEnd);
    
    // Touch events
    track.addEventListener('touchstart', touchStart, { passive: true });
    track.addEventListener('touchmove', touchMove, { passive: true });
    track.addEventListener('touchend', touchEnd, { passive: true });
    
    // Smooth horizontal scroll with wheel (only horizontal scroll, not vertical)
    let isScrolling = false;
    let scrollTimeout;
    
    wrapper.addEventListener('wheel', (e) => {
        // Only handle horizontal scroll (deltaX)
        // Let vertical scroll (deltaY) pass through to scroll the page
        const horizontalDelta = e.deltaX;
        const verticalDelta = e.deltaY;
        
        // If this is primarily vertical scroll, let it pass through
        if (Math.abs(verticalDelta) > Math.abs(horizontalDelta)) {
            return; // Don't prevent default, allow page scroll
        }
        
        // This is horizontal scroll, handle it
        if (Math.abs(horizontalDelta) < 10) return; // Ignore tiny movements
        
        e.preventDefault(); // Only prevent default for horizontal scroll
        
        // Prevent rapid scroll triggers
        if (isScrolling) return;
        
        isScrolling = true;
        
        if (horizontalDelta > 0) {
            // Scrolling right - go next
            goNext();
        } else {
            // Scrolling left - go prev
            goPrev();
        }
        
        // Reset scrolling flag after animation completes
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 400);
        
    }, { passive: false });
    
    // Navigation buttons
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', goPrev);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', goNext);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goPrev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            goNext();
        }
    });
    
    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            cardWidth = getCardWidth();
            setPositionByIndex(state.currentIndex);
        }, 250);
    });
}

// ========== CARD FLIP ==========
function initializeCardFlips(cards) {
    const messageCards = cards.filter(card => card.classList.contains('message-card'));
    
    messageCards.forEach(card => {
        let startX = 0;
        let startY = 0;
        let hasMoved = false;
        
        // Mouse events for flip detection
        const handleMouseDown = (e) => {
            startX = e.clientX;
            startY = e.clientY;
            hasMoved = false;
        };
        
        const handleMouseMove = (e) => {
            if (startX !== 0) {
                const diffX = Math.abs(e.clientX - startX);
                const diffY = Math.abs(e.clientY - startY);
                if (diffX > 5 || diffY > 5) {
                    hasMoved = true;
                }
            }
        };
        
        const handleClick = function(e) {
            if (!hasMoved) {
                e.stopPropagation();
                this.classList.toggle('flipped');
            }
            startX = 0;
            startY = 0;
            hasMoved = false;
        };
        
        card.addEventListener('mousedown', handleMouseDown);
        card.addEventListener('mousemove', handleMouseMove);
        card.addEventListener('click', handleClick);
        
        // Touch support
        let touchStartX = 0;
        let touchStartY = 0;
        let touchMoved = false;
        
        card.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
            touchMoved = false;
        }, { passive: true });
        
        card.addEventListener('touchmove', (e) => {
            const diffX = Math.abs(e.touches[0].clientX - touchStartX);
            const diffY = Math.abs(e.touches[0].clientY - touchStartY);
            if (diffX > 10 || diffY > 10) {
                touchMoved = true;
            }
        }, { passive: true });
        
        card.addEventListener('touchend', function(e) {
            if (!touchMoved) {
                e.preventDefault();
                this.classList.toggle('flipped');
            }
            touchMoved = false;
        });
    });
}

// ========== LOADING SCREEN ==========
function initializeLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;
    
    // Hide loading screen
    setTimeout(() => {
        loadingScreen.classList.remove('active');
    }, 100);
}
