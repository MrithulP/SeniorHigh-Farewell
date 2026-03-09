// ========================================
// TEACHER PAGE - CIRCULAR INFINITE CAROUSEL
// Simple and clean circular implementation
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeInfiniteCarousel();
    initializeLoading();
});

// ========== INFINITE CAROUSEL ==========
function initializeInfiniteCarousel() {
    const wrapper = document.querySelector('.carousel-wrapper');
    const track = document.getElementById('carouselTrack');
    if (!track || !wrapper) return;
    
    const originalCards = Array.from(track.children);
    if (originalCards.length === 0) return;
    
    // Simple approach: just clone cards a few times
    const cloneSets = 2;
    const allCardsData = [];
    
    // Store original cards data
    originalCards.forEach(card => {
        allCardsData.push(card.cloneNode(true));
    });
    
    // Clear and rebuild
    track.innerHTML = '';
    
    // Add multiple sets
    for (let set = 0; set < (cloneSets * 2 + 1); set++) {
        allCardsData.forEach(cardTemplate => {
            const card = cardTemplate.cloneNode(true);
            track.appendChild(card);
        });
    }
    
    // Get all cards
    const allCards = Array.from(track.children);
    initializeCardFlips(allCards);
    
    // Get dimensions
    const getCardWidth = () => {
        const firstCard = allCards[0];
        if (!firstCard) return 412;
        const rect = firstCard.getBoundingClientRect();
        const style = window.getComputedStyle(firstCard);
        const marginRight = parseFloat(style.marginRight) || 0;
        return rect.width + 32; // width + gap
    };
    
    let cardWidth = getCardWidth();
    const cardsPerSet = allCardsData.length;
    
    // Wait for layout
    setTimeout(() => {
        cardWidth = getCardWidth();
        initializeCarouselMovement();
    }, 100);
    
    function initializeCarouselMovement() {
        // State
        const state = {
            offset: 0,
            isDragging: false,
            startX: 0,
            dragOffset: 0
        };
        
        // Start in the middle set
        const middleSet = cloneSets;
        state.offset = -(cardWidth * cardsPerSet * middleSet);
        
        // Apply position
        const setPosition = (offset, smooth = false) => {
            track.style.transition = smooth ? 'transform 0.3s ease-out' : 'none';
            track.style.transform = `translateX(${offset}px)`;
        };
        
        setPosition(state.offset);
        
        // Make track visible after positioning
        setTimeout(() => {
            track.style.opacity = '1';
        }, 50);
        
        // Circular wrap function
        const wrapPosition = () => {
            const setWidth = cardWidth * cardsPerSet;
            const currentSet = Math.round(-state.offset / setWidth);
            
            // If we're too far left or right, wrap around
            if (currentSet <= 0) {
                // Wrap from left to right
                state.offset -= setWidth * 2;
                setPosition(state.offset, false);
            } else if (currentSet >= cloneSets * 2) {
                // Wrap from right to left
                state.offset += setWidth * 2;
                setPosition(state.offset, false);
            }
        };
        
        // Drag start
        const handleDragStart = (clientX) => {
            state.isDragging = true;
            state.startX = clientX;
            state.dragOffset = 0;
            track.style.cursor = 'grabbing';
        };
        
        // Drag move
        const handleDragMove = (clientX) => {
            if (!state.isDragging) return;
            
            state.dragOffset = clientX - state.startX;
            setPosition(state.offset + state.dragOffset, false);
        };
        
        // Drag end
        const handleDragEnd = () => {
            if (!state.isDragging) return;
            
            state.isDragging = false;
            track.style.cursor = 'grab';
            
            // Update offset
            state.offset += state.dragOffset;
            
            // Snap to nearest card
            const nearestCard = Math.round(-state.offset / cardWidth);
            state.offset = -nearestCard * cardWidth;
            
            setPosition(state.offset, true);
            
            // Check for wrap after animation
            setTimeout(() => {
                wrapPosition();
            }, 300);
        };
        
        // Mouse events
        track.addEventListener('mousedown', (e) => {
            e.preventDefault();
            handleDragStart(e.clientX);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (state.isDragging) {
                e.preventDefault();
                handleDragMove(e.clientX);
            }
        });
        
        document.addEventListener('mouseup', () => {
            handleDragEnd();
        });
        
        // Touch events
        track.addEventListener('touchstart', (e) => {
            handleDragStart(e.touches[0].clientX);
        }, { passive: true });
        
        track.addEventListener('touchmove', (e) => {
            if (state.isDragging) {
                handleDragMove(e.touches[0].clientX);
            }
        }, { passive: true });
        
        track.addEventListener('touchend', () => {
            handleDragEnd();
        }, { passive: true });
        
        // Navigation buttons
        initializeNavButtons(state, cardWidth, setPosition, wrapPosition);
        
        // Resize handler
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                cardWidth = getCardWidth();
                const currentCard = Math.round(-state.offset / cardWidth);
                state.offset = -currentCard * cardWidth;
                setPosition(state.offset, false);
            }, 250);
        });
    }
}

// ========== CARD FLIP ==========
function initializeCardFlips(cards) {
    const messageCards = cards.filter(card => card.classList.contains('message-card'));
    
    messageCards.forEach(card => {
        if (card.hasAttribute('data-flip-initialized')) return;
        
        card.setAttribute('data-flip-initialized', 'true');
        
        let clickStartX = 0;
        let clickStartY = 0;
        
        card.addEventListener('mousedown', (e) => {
            clickStartX = e.clientX;
            clickStartY = e.clientY;
        });
        
        card.addEventListener('click', function(e) {
            const diffX = Math.abs(e.clientX - clickStartX);
            const diffY = Math.abs(e.clientY - clickStartY);
            
            if (diffX < 5 && diffY < 5) {
                e.stopPropagation();
                this.classList.toggle('flipped');
            }
        });
    });
}

// ========== NAVIGATION BUTTONS ==========
function initializeNavButtons(state, cardWidth, setPosition, wrapPosition) {
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    const move = (direction) => {
        state.offset += direction * cardWidth;
        setPosition(state.offset, true);
        
        setTimeout(() => {
            wrapPosition();
        }, 300);
    };
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => move(1));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => move(-1));
    }
    
    // Keyboard
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            move(1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            move(-1);
        }
    });
}

// ========== LOADING SCREEN ==========
function initializeLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;
    
    window.addEventListener('pageshow', () => {
        loadingScreen.classList.remove('active');
    });
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.remove('active');
        }, 500);
    });
}