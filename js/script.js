document.addEventListener('DOMContentLoaded', () => {

    // Scroll suave para as âncoras
    const links = document.querySelectorAll('a[href^="#"]');

    for (const link of links) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const target = document.querySelector(href);

            if (target) {
                // Calcular a altura do header para fazer offset
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight - 20; // 20px extra de espaço
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                }
        });
    }

    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav#primary-nav');
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });
    }

// Parallax effect for hero section
function parallaxHero() {
    const hero = document.querySelector('.hero-section');
    if (hero) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5; // Velocidade do parallax
        
        // Aplicar o efeito apenas no background
        hero.style.backgroundPosition = `center ${rate}px`;
    }
}

// Add scroll event listener for parallax (desktop only)
if (window.matchMedia('(min-width: 901px)').matches) {
    window.addEventListener('scroll', parallaxHero);
}

    // Submissão do formulário
    const form = document.getElementById('free-trial-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simular envio do formulário
            // Em produção, aqui farias uma requisição AJAX para o servidor
            
            // Redirecionar para página de agradecimento
            window.location.href = 'obrigado.html';
        });
    }

});

// Função para alternar a história completa do testemunho
function toggleFullStory(element) {
    const storyText = element.querySelector('.story-full-text');
    
    if (storyText.classList.contains('hidden')) {
        // Mostrar história
        storyText.classList.remove('hidden');
        storyText.classList.add('visible');
        element.classList.add('story-mode');
    } else {
        // Esconder história
        storyText.classList.remove('visible');
        storyText.classList.add('hidden');
        element.classList.remove('story-mode');
    }
}