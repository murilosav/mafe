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
// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se a imagem de fundo carregou
    const backgroundImg = document.getElementById('backgroundImg');
    
    backgroundImg.onerror = function() {
        // Se a foto não carregar, usar gradiente rosa
        document.querySelector('.background-photo').style.background = 
            'linear-gradient(135deg, #fff5f8 0%, #ffe8f1 100%)';
        backgroundImg.style.display = 'none';
    };
    
    // Adicionar animações suaves de entrada
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
    document.querySelectorAll('.letter-section, .featured-photo-section, .final-section').forEach(el => {
        observer.observe(el);
    });
    
    // Adicionar movimento sutil aos corações flutuantes
    setInterval(createFloatingHeart, 8000);
    
    // Tocar som suave quando a página carrega
    setTimeout(playWelcomeSound, 1000);
    
    // Efeito parallax sutil no scroll
    window.addEventListener('scroll', handleScrollEffects);
});

// Som suave de boas-vindas
function playWelcomeSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
        
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                gainNode.gain.linearRampToValueAtTime(0.03, audioContext.currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 1.5);
            }, index * 300);
        });
    } catch (e) {
        // Silenciosamente falha se o áudio não estiver disponível
    }
}

// Criar novos corações flutuantes ocasionalmente
function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.innerHTML = '♡';
    heart.style.position = 'fixed';
    heart.style.fontSize = Math.random() * 10 + 15 + 'px';
    heart.style.color = 'rgba(255, 255, 255, 0.6)';
    heart.style.textShadow = '0 0 10px rgba(255, 107, 157, 0.5)';
    heart.style.top = Math.random() * 100 + 'vh';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.zIndex = '1';
    heart.style.pointerEvents = 'none';
    heart.style.animation = 'floatHeart 10s ease-in-out forwards';
    
    document.body.appendChild(heart);
    
    setTimeout(() => heart.remove(), 10000);
}

// Efeitos no scroll
function handleScrollEffects() {
    const scrolled = window.pageYOffset;
    const parallax = scrolled * 0.2;
    
    // Movimento parallax nos corações
    document.querySelector('.floating-hearts').style.transform = `translateY(${parallax}px)`;
    
    // Efeito sutil no blur da foto de fundo
    const backgroundImg = document.querySelector('.background-photo img');
    if (backgroundImg && backgroundImg.style.display !== 'none') {
        const blurAmount = Math.min(8 + scrolled * 0.01, 12);
        backgroundImg.style.filter = `blur(${blurAmount}px) brightness(0.7)`;
    }
}

// Efeito hover na foto especial
document.addEventListener('DOMContentLoaded', function() {
    const specialPhoto = document.querySelector('.photo-frame-special');
    
    if (specialPhoto) {
        specialPhoto.addEventListener('mouseenter', () => {
            specialPhoto.style.transform = 'scale(1.05) rotate(2deg)';
            specialPhoto.style.filter = 'saturate(1.2)';
        });
        
        specialPhoto.addEventListener('mouseleave', () => {
            specialPhoto.style.transform = 'scale(1) rotate(0deg)';
            specialPhoto.style.filter = 'saturate(1)';
        });
    }
});
