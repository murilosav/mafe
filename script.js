// Função para adicionar fotos
function addPhoto(frame) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Remover o placeholder
                frame.innerHTML = `<img src="${e.target.result}" alt="Nossa foto">`;
                
                // Adicionar efeito visual
                frame.classList.add('photo-added');
                
                // Tocar som suave
                playGentleSound();
                
                // Criar efeito de coração sutil
                createHeartEffect(frame);
                
                setTimeout(() => {
                    frame.classList.remove('photo-added');
                }, 2000);
            };
            reader.readAsDataURL(file);
        }
    };
    
    input.click();
}

// Som suave ao adicionar foto
function playGentleSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 1);
}

// Efeito de coração sutil
function createHeartEffect(element) {
    const heart = document.createElement('div');
    heart.innerHTML = '💕';
    heart.style.position = 'absolute';
    heart.style.top = '50%';
    heart.style.left = '50%';
    heart.style.transform = 'translate(-50%, -50%)';
    heart.style.fontSize = '2rem';
    heart.style.zIndex = '10';
    heart.style.pointerEvents = 'none';
    heart.style.animation = 'fadeUpAndOut 2s ease-out forwards';
    
    element.style.position = 'relative';
    element.appendChild(heart);
    
    setTimeout(() => heart.remove(), 2000);
}

// Adicionar animação CSS para o efeito do coração
const style = document.createElement('style');
style.textContent = `
@keyframes fadeUpAndOut {
    0% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.5);
    }
    50% {
        opacity: 1;
        transform: translate(-50%, -60%) scale(1);
    }
    100% {
        opacity: 0;
        transform: translate(-50%, -80%) scale(0.8);
    }
}
`;
document.head.appendChild(style);

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar classe de animação aos elementos conforme aparecem
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    document.querySelectorAll('.letter-section, .photo-section, .final-section').forEach(el => {
        observer.observe(el);
    });
    
    // Adicionar movimento sutil aos corações flutuantes
    setInterval(createFloatingHeart, 8000);
});

// Criar novos corações flutuantes ocasionalmente
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '♡';
    heart.style.position = 'fixed';
    heart.style.fontSize = '1.2rem';
    heart.style.color = 'rgba(255, 107, 157, 0.2)';
    heart.style.top = Math.random() * 100 + 'vh';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.zIndex = '1';
    heart.style.pointerEvents = 'none';
    heart.style.animation = 'floatHeart 8s ease-in-out forwards';
    
    document.body.appendChild(heart);
    
    setTimeout(() => heart.remove(), 8000);
}

// Efeito suave no scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = scrolled * 0.5;
    
    document.querySelector('.floating-hearts').style.transform = `translateY(${parallax}px)`;
});


// Classe para gerenciar scroll customizado
class CustomScrollbar {
    constructor(container, scrollbar, thumb) {
        this.container = container;
        this.scrollbar = scrollbar;
        this.thumb = thumb;
        this.isDragging = false;
        this.startX = 0;
        this.startScrollLeft = 0;
        
        this.init();
    }
    
    init() {
        this.updateThumb();
        this.bindEvents();
        this.centerScroll();
    }
    
    updateThumb() {
        const containerWidth = this.container.clientWidth;
        const contentWidth = this.container.scrollWidth;
        const scrollbarWidth = this.scrollbar.clientWidth;
        
        if (contentWidth <= containerWidth) {
            this.scrollbar.style.display = 'none';
            return;
        }
        
        this.scrollbar.style.display = 'block';
        
        // Calcular largura do thumb baseado na proporção
        const thumbWidth = Math.max(30, (containerWidth / contentWidth) * scrollbarWidth);
        this.thumb.style.width = thumbWidth + 'px';
        
        // Calcular posição do thumb
        const scrollPercentage = this.container.scrollLeft / (contentWidth - containerWidth);
        const maxThumbPosition = scrollbarWidth - thumbWidth;
        const thumbPosition = scrollPercentage * maxThumbPosition;
        
        this.thumb.style.left = thumbPosition + 'px';
    }
    
    centerScroll() {
        // Aguardar renderização
        setTimeout(() => {
            const containerWidth = this.container.clientWidth;
            const contentWidth = this.container.scrollWidth;
            
            if (contentWidth > containerWidth) {
                const centerPosition = (contentWidth - containerWidth) / 2;
                this.container.scrollLeft = centerPosition;
                this.updateThumb();
            }
        }, 100);
    }
    
    bindEvents() {
        // Scroll do container atualiza o thumb
        this.container.addEventListener('scroll', () => {
            if (!this.isDragging) {
                this.updateThumb();
            }
        });
        
        // Clique na track da scrollbar
        this.scrollbar.addEventListener('click', (e) => {
            if (e.target === this.scrollbar || e.target.classList.contains('scrollbar-track')) {
                const rect = this.scrollbar.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const scrollbarWidth = this.scrollbar.clientWidth;
                const thumbWidth = this.thumb.clientWidth;
                
                const targetPosition = clickX - (thumbWidth / 2);
                const maxPosition = scrollbarWidth - thumbWidth;
                const clampedPosition = Math.max(0, Math.min(targetPosition, maxPosition));
                
                const scrollPercentage = clampedPosition / maxPosition;
                const containerWidth = this.container.clientWidth;
                const contentWidth = this.container.scrollWidth;
                const targetScrollLeft = scrollPercentage * (contentWidth - containerWidth);
                
                this.container.scrollTo({
                    left: targetScrollLeft,
                    behavior: 'smooth'
                });
            }
        });
        
        // Drag do thumb
        this.thumb.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.isDragging = true;
            this.startX = e.clientX;
            this.startScrollLeft = this.container.scrollLeft;
            
            document.addEventListener('mousemove', this.handleMouseMove);
            document.addEventListener('mouseup', this.handleMouseUp);
        });
        
        // Touch events para mobile
        this.thumb.addEventListener('touchstart', (e) => {
            this.isDragging = true;
            this.startX = e.touches[0].clientX;
            this.startScrollLeft = this.container.scrollLeft;
            
            document.addEventListener('touchmove', this.handleTouchMove);
            document.addEventListener('touchend', this.handleTouchEnd);
        });
        
        // Resize
        window.addEventListener('resize', () => {
            this.updateThumb();
            setTimeout(() => this.centerScroll(), 100);
        });
    }
    
    handleMouseMove = (e) => {
        if (!this.isDragging) return;
        
        const deltaX = e.clientX - this.startX;
        const scrollbarWidth = this.scrollbar.clientWidth;
        const thumbWidth = this.thumb.clientWidth;
        const maxThumbPosition = scrollbarWidth - thumbWidth;
        
        const containerWidth = this.container.clientWidth;
        const contentWidth = this.container.scrollWidth;
        const maxScrollLeft = contentWidth - containerWidth;
        
        const deltaScrollLeft = (deltaX / maxThumbPosition) * maxScrollLeft;
        const newScrollLeft = Math.max(0, Math.min(this.startScrollLeft + deltaScrollLeft, maxScrollLeft));
        
        this.container.scrollLeft = newScrollLeft;
        this.updateThumb();
    }
    
    handleMouseUp = () => {
        this.isDragging = false;
        document.removeEventListener('mousemove', this.handleMouseMove);
        document.removeEventListener('mouseup', this.handleMouseUp);
    }
    
    handleTouchMove = (e) => {
        if (!this.isDragging) return;
        
        const deltaX = e.touches[0].clientX - this.startX;
        const scrollbarWidth = this.scrollbar.clientWidth;
        const thumbWidth = this.thumb.clientWidth;
        const maxThumbPosition = scrollbarWidth - thumbWidth;
        
        const containerWidth = this.container.clientWidth;
        const contentWidth = this.container.scrollWidth;
        const maxScrollLeft = contentWidth - containerWidth;
        
        const deltaScrollLeft = (deltaX / maxThumbPosition) * maxScrollLeft;
        const newScrollLeft = Math.max(0, Math.min(this.startScrollLeft + deltaScrollLeft, maxScrollLeft));
        
        this.container.scrollLeft = newScrollLeft;
        this.updateThumb();
    }
    
    handleTouchEnd = () => {
        this.isDragging = false;
        document.removeEventListener('touchmove', this.handleTouchMove);
        document.removeEventListener('touchend', this.handleTouchEnd);
    }
}

// Inicializar scroll customizado
function initCustomScroll() {
    const container = document.getElementById('asciiScrollContainer');
    const scrollbar = document.getElementById('customScrollbar');
    const thumb = document.getElementById('scrollbarThumb');
    
    if (container && scrollbar && thumb) {
        const customScroll = new CustomScrollbar(container, scrollbar, thumb);
        
        // Observer para animar quando aparecer na tela
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.closest('.ascii-art-section')?.classList.add('in-view');
                    setTimeout(() => customScroll.centerScroll(), 200);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(container);
        
        return customScroll;
    }
}

// Inicializar quando o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    const customScroll = initCustomScroll();
    
    // Recentralizar após fonts carregarem
    document.fonts.ready.then(() => {
        setTimeout(() => {
            if (customScroll) {
                customScroll.centerScroll();
            }
        }, 300);
    });
    
    // ... resto do seu código
});
