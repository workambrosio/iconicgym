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

    // Submissão do(s) formulário(s) para n8n (webhook)
    const webhookMeta = document.querySelector('meta[name="n8n-webhook-url"]');
    const n8nWebhookUrl = (webhookMeta && webhookMeta.content) ? webhookMeta.content.trim() : '';
    const forms = document.querySelectorAll('form[data-n8n="true"]');
    forms.forEach((form) => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitButton = form.querySelector('button[type="submit"], .form-button');
            if (submitButton) submitButton.disabled = true;

            try {
                const formData = new FormData(form);
                // Enviar como form-data para compatibilidade com n8n e evitar preflight
                formData.append('page', window.location.pathname);
                if (form.id) formData.append('formId', form.id);

                if (!n8nWebhookUrl) {
                    throw new Error('Webhook URL em falta (meta name="n8n-webhook-url").');
                }

                const res = await fetch(n8nWebhookUrl, {
                    method: 'POST',
                    body: formData,
                    mode: 'cors',
                    cache: 'no-store',
                });

                if (!res.ok) throw new Error('Falha no envio.');

                window.location.href = 'obrigado.html';
            } catch (err) {
                console.error(err);
                alert('Não foi possível enviar o formulário. Tenta novamente mais tarde.');
            } finally {
                if (submitButton) submitButton.disabled = false;
            }
        });
    });

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