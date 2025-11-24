const sliderWrapper = document.getElementById('sliderWrapper');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const indicatorsContainer = document.getElementById('indicators');
const cards = document.querySelectorAll('.slider-card');

let currentIndex = 0;
let cardsPerView = 3;
const totalCards = cards.length;

// Actualizar cards por vista según el tamaño de pantalla
function updateCardsPerView() {
    const width = window.innerWidth;
    if (width <= 576) {
        cardsPerView = 1;
    } else if (width <= 992) {
        cardsPerView = 2;
    } else {
        cardsPerView = 3;
    }
}

// Crear indicadores
function createIndicators() {
    indicatorsContainer.innerHTML = '';
    const totalSlides = totalCards - cardsPerView + 1;

    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (i === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => goToSlide(i));
        indicatorsContainer.appendChild(indicator);
    }
}

// Actualizar slider
function updateSlider() {
    const cardWidth = cards[0].offsetWidth;
    const gap = 20;
    const offset = currentIndex * (cardWidth + gap);

    sliderWrapper.style.transform = `translateX(-${offset}px)`;

    // Actualizar indicadores
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentIndex);
    });

    // Actualizar botones
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= totalCards - cardsPerView;
}

// Ir a slide específico
function goToSlide(index) {
    currentIndex = index;
    updateSlider();
}

// Navegación
prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < totalCards - cardsPerView) {
        currentIndex++;
        updateSlider();
    }
});

// Soporte para swipe en móviles
let startX = 0;
let isDragging = false;

sliderWrapper.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
});

sliderWrapper.addEventListener('touchend', (e) => {
    if (!isDragging) return;

    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
        if (diff > 0 && currentIndex < totalCards - cardsPerView) {
            currentIndex++;
        } else if (diff < 0 && currentIndex > 0) {
            currentIndex--;
        }
        updateSlider();
    }

    isDragging = false;
});

// Auto-play
let autoplayInterval;

function startAutoplay() {
    autoplayInterval = setInterval(() => {
        if (currentIndex < totalCards - cardsPerView) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateSlider();
    }, 4000);
}

function stopAutoplay() {
    clearInterval(autoplayInterval);
}

// Pausar autoplay al hover
sliderWrapper.addEventListener('mouseenter', stopAutoplay);
sliderWrapper.addEventListener('mouseleave', startAutoplay);

// Responsive
window.addEventListener('resize', () => {
    updateCardsPerView();
    createIndicators();
    currentIndex = 0;
    updateSlider();
});

// Inicializar
updateCardsPerView();
createIndicators();
updateSlider();
startAutoplay();