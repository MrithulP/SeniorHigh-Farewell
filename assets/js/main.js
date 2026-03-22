// ========================================
// BRAND NEW - CLASS OF 2025
// Simple modal search system
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
    initializeScrollAnimations();
    initializeHeaderScroll();
    initializeLoadingScreen();
});

// SEARCH MODAL SYSTEM
function initializeSearch() {
    const searchTrigger = document.getElementById('searchTrigger');
    const searchModal = document.getElementById('searchModal');
    const overlay = document.getElementById('overlay');
    const searchBox = document.getElementById('searchBox');
    const searchResults = document.getElementById('searchResults');
    const closeModal = document.getElementById('closeModal');
    const body = document.body;
    
    if (!searchTrigger || !searchModal || !overlay || !searchBox || !searchResults || !closeModal) {
        console.error('Required elements not found');
        return;
    }
    
    const teachers = [
        { name: "Mr. Vitalis Mugo", page: "./pages/mr-mugo.html" },
        { name: "Mrs. Sharma", page: "./pages/mrs-sharma.html" },
        { name: "Mr. Simon Nganga", page: "./pages/mr-nganga.html" },
        { name: "Mr. Raphael Kiunguti Nyaga", page: "./pages/mr-nyaga.html" },
        { name: "Mr. Daniel Kyale", page: "./pages/mr-daniel.html" },
        { name: "Mr. Franklin Onkoba", page: "./pages/mr-onkoba.html" },
        { name: "Mr. Andrew Nyansikera Machuki", page: "./pages/mr-machuki.html" },
        { name: "Mr. Shadrack Kamau Mwangi", page: "./pages/mr-shadrack.html" },
        { name: "Mr. Leonard Makombi Gesuka", page: "./pages/mr-leonard.html" },
        { name: "Mr. Thaddeus Gaitho", page: "./pages/mr-gaitho.html" },
        { name: "Mr. Erick Mutongwa Wekesa", page: "./pages/mr-erick.html" },
        { name: "Mr. Charles Kinuthia", page: "./pages/mr-kinuthia.html" },
        { name: "Mr. Charles Muiruri Njuguna", page: "./pages/mr-njuguna.html" },
        { name: "Ms. Grace Lieta Wanda", page: "./pages/ms-grace.html" },
        { name: "Mr. Victor Brain Maina", page: "./pages/mr-victor.html" },
        { name: "Mr. Kennedy Wago Otieno", page: "./pages/mr-kennedy.html" },
        { name: "Mr. Richard Ongera Ombwori", page: "./pages/mr-richard.html" },
        { name: "Ms. Mary Wambui Warutere", page: "./pages/ms-mary.html" },
        { name: "Mr. Johannes Jaoko Nyamwanga", page: "./pages/mr-nyamwanga.html" },
        { name: "Mr. Alfred Wao", page: "./pages/mr-wao.html" },
        { name: "Mr. Wycliffe Siro Mang'aa", page: "./pages/mr-wycliff.html" },
        { name: "Mr. Isaac Okoth Otieno", page: "./pages/mr-isaac.html" },
        { name: "Mr. Wilbert Mangata Nyangaresi", page: "./pages/mr-wilbert.html" },
        { name: "Ms. Faith Sirengo", page: "./pages/ms-mr-faith-caleb.html" },
        { name: "Mr. Caleb Kariri", page: "./pages/ms-mr-faith-caleb.html" },
        { name: "Mrs. Shini Paul", page: "./pages/ms-paul.html" },
        { name: "Mr. Moses Ruirie Ndegwa", page: "./pages/mr-ndegwa.html" },
        { name: "Mr. Dennis Ochieng", page: "./pages/mr-dennis.html" },
        { name: "Ms. Dorcas Mmbone", page: "./pages/ms-dorcas.html" },
        { name: "Ms. Glory Gatwiri", page: "./pages/ms-glory.html" },
        { name: "Ms. Pauline Wambui Macharia", page: "./pages/ms-pauline.html" },
        { name: "Ms. Norah Evonnah Nyabuti", page: "./pages/ms-norah.html" },
        { name: "Mr. Miano Joseph Mathenge", page: "./pages/mr-mathenge.html" },
        { name: "Mr. Reuben Nkirote Muthomi", page: "./pages/mr-reuben.html" },
        { name: "Ms. Clara Wangui Magairo", page: "./pages/mrs-clara.html" }
    ];
    
    // Open modal
    function openModal() {
        overlay.classList.add('active');
        body.classList.add('no-scroll');
        
        setTimeout(() => {
            searchModal.classList.add('active');
        }, 50);
        
        setTimeout(() => {
            searchBox.focus();
        }, 450);
    }
    
    // Close modal
    function closeModalHandler() {
        searchModal.classList.remove('active');
        
        setTimeout(() => {
            overlay.classList.remove('active');
            body.classList.remove('no-scroll');
        }, 200);
        
        setTimeout(() => {
            searchBox.value = '';
            searchResults.innerHTML = '';
            searchResults.classList.remove('visible');
        }, 400);
    }
    
    // Search functionality
    function performSearch() {
        const searchTerm = searchBox.value.toLowerCase().trim();
        
        if (searchTerm.length > 0) {
            const filtered = teachers.filter(teacher => 
                teacher.name.toLowerCase().includes(searchTerm)
            );
            displayResults(filtered);
        } else {
            searchResults.innerHTML = '';
            searchResults.classList.remove('visible');
        }
    }
    
    // Display results
    function displayResults(results) {
        searchResults.innerHTML = '';
        
        if (results.length > 0) {
            results.forEach(teacher => {
                const li = document.createElement('li');
                li.className = 'result-item';
                li.textContent = teacher.name;
                
                li.addEventListener('click', function() {
                    navigateToPage(teacher.page);
                });
                
                searchResults.appendChild(li);
            });
            
            setTimeout(() => {
                searchResults.classList.add('visible');
            }, 50);
        } else {
            const li = document.createElement('li');
            li.className = 'result-item no-results';
            li.textContent = 'No teachers found';
            searchResults.appendChild(li);
            
            setTimeout(() => {
                searchResults.classList.add('visible');
            }, 50);
        }
    }
    
    // Navigate to teacher page
    function navigateToPage(page) {
        const loadingScreen = document.getElementById('loading-screen');
        
        if (loadingScreen) {
            loadingScreen.classList.add('active');
            body.classList.add('no-scroll');
            
            setTimeout(() => {
                window.location.href = page;
            }, 1500);
        } else {
            window.location.href = page;
        }
    }
    
    // Event listeners
    searchTrigger.addEventListener('click', openModal);
    overlay.addEventListener('click', closeModalHandler);
    closeModal.addEventListener('click', closeModalHandler);
    searchBox.addEventListener('input', performSearch);
    
    // ESC key to close
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchModal.classList.contains('active')) {
            closeModalHandler();
        }
    });
}

// SCROLL ANIMATIONS
function initializeScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    
    if (revealElements.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// HEADER SCROLL EFFECT
function initializeHeaderScroll() {
    const header = document.querySelector('.site-header');
    
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// LOADING SCREEN
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    
    if (!loadingScreen) return;
    
    window.addEventListener('pageshow', function() {
        loadingScreen.classList.remove('active');
        document.body.classList.remove('no-scroll');
    });
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            loadingScreen.classList.remove('active');
            document.body.classList.remove('no-scroll');
        }, 500);
    });
}
