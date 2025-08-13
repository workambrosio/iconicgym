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

    // Image fallback handler (useful for case-sensitive hosts like GitHub Pages)
    const fallbackImages = document.querySelectorAll('img[data-fallbacks]');
    fallbackImages.forEach((img) => {
        const variants = img.getAttribute('data-fallbacks')?.split(',').map(s => s.trim()).filter(Boolean) || [];
        let idx = 0;
        img.addEventListener('error', function onErr() {
            if (idx < variants.length) {
                img.src = variants[idx] + (variants[idx].includes('?') ? '' : '?v=1');
                idx += 1;
            } else {
                img.removeEventListener('error', onErr);
            }
        });
    });

// Desativado: parallax no hero causava deslocamento em desktop em alguns browsers

    // Submissão do formulário para Google Apps Script (JSON)
    const form = document.getElementById('free-trial-form');
    const gsMeta = document.querySelector('meta[name="apps-script-url"]');
    const appsScriptUrl = (gsMeta && gsMeta.content) ? gsMeta.content.trim() : '';
    if (form && appsScriptUrl) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"], .form-button');
            if (submitButton) submitButton.disabled = true;

            try {
                const formData = new FormData(form);
                const payload = {
                    name: formData.get('name') || '',
                    email: formData.get('email') || '',
                    phone: formData.get('phone') || '',
                    message: formData.get('message') || ''
                };

                const body = JSON.stringify(payload);

                // 1) Tenta enviar de forma "fire-and-forget" (rápido) com sendBeacon
                let sent = false;
                if (navigator.sendBeacon) {
                    try {
                        const blob = new Blob([body], { type: 'application/json' });
                        sent = navigator.sendBeacon(appsScriptUrl, blob);
                    } catch (_) { /* ignore */ }
                }

                // 2) Fallback: fetch com timeout curto e keepalive, para não atrasar o redirect
                if (!sent) {
                    try {
                        await Promise.race([
                            fetch(appsScriptUrl, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body,
                                mode: 'no-cors',
                                keepalive: true
                            }),
                            new Promise((resolve) => setTimeout(resolve, 1200))
                        ]);
                    } catch (_) { /* ignore */ }
                }

                // Redirecionar sem esperar a conclusão do Apps Script (evita atrasos de 3-5s)
                window.location.href = 'obrigado.html';
            } catch (err) {
                console.error(err);
                alert('Não foi possível enviar o formulário. Tenta novamente mais tarde.');
            } finally {
                if (submitButton) submitButton.disabled = false;
            }
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