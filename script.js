/**
 * ==============================================================================
 * SERGIO ROMERO TEJEDOR - PORTAFOLIO WEB PERSONAL
 * ARCHIVO: script.js (JavaScript Puro / Vanilla JS)
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. MENÚ MÓVIL (HAMBURGUESA ACCESIBLE)
       ========================================================================== */
    const mobileToggle = document.getElementById('mobileNavToggle');
    const mainNav = document.getElementById('mainNav');

    if (mobileToggle && mainNav) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('open');
            mobileToggle.setAttribute('aria-expanded', isOpen);
        });

        // Cerrar menú al hacer clic en un enlace
        mainNav.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('open');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }


    /* ==========================================================================
       2.5. TRADUCCIÓN ESPAÑOL / INGLÉS
       ========================================================================== */
    const translateEs = document.getElementById('translateEs');
    const translateEn = document.getElementById('translateEn');
    let currentLanguage = 'es';
    let googleTranslationWasActive = false;
    const cvDownloadLinks = document.querySelectorAll('.cv-download-link');

    function updateCvDownloadLinks() {
        const cvUrl = currentLanguage === 'en'
            ? 'https://drive.google.com/uc?export=download&id=1PmkGZIrw6VYOUPc_GiBS8S083SsNzN-9'
            : 'https://drive.google.com/uc?export=download&id=1PdMtKUExRVXLFFOW_hDAWm7-X5RnNOdt';

        cvDownloadLinks.forEach(link => {
            link.href = cvUrl;
        });
    }

    function applyGoogleTranslation() {
        const languageSelector = document.querySelector('.goog-te-combo');

        if (!languageSelector) {
            window.setTimeout(applyGoogleTranslation, 150);
            return;
        }

        languageSelector.value = currentLanguage;
        languageSelector.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function updateLanguageButtons() {
        if (!translateEs || !translateEn) return;
        translateEs.classList.toggle('active', currentLanguage === 'es');
        translateEs.setAttribute('aria-pressed', String(currentLanguage === 'es'));
        translateEn.classList.toggle('active', currentLanguage === 'en');
        translateEn.setAttribute('aria-pressed', String(currentLanguage === 'en'));
    }

    function isGoogleTranslationActive() {
        return document.documentElement.classList.contains('translated-ltr')
            || document.documentElement.classList.contains('translated-rtl')
            || document.body?.classList.contains('translated-ltr')
            || document.body?.classList.contains('translated-rtl');
    }

    function selectSpanishAfterGoogleReset() {
        if (currentLanguage !== 'en') return;

        currentLanguage = 'es';
        updateLanguageButtons();
        updateCvDownloadLinks();
        googleTranslationWasActive = false;
    }

    function syncLanguageAfterGoogleReset() {
        const translationIsActive = isGoogleTranslationActive();

        if (translationIsActive) {
            googleTranslationWasActive = true;
        } else if (googleTranslationWasActive) {
            selectSpanishAfterGoogleReset();
        }
    }

    googleTranslationWasActive = isGoogleTranslationActive();
    const googleTranslationObserver = new MutationObserver(syncLanguageAfterGoogleReset);
    [document.documentElement, document.body].forEach(element => {
        if (!element) return;
        googleTranslationObserver.observe(element, {
            attributes: true,
            attributeFilter: ['class']
        });
    });

    document.addEventListener('change', event => {
        if (event.target instanceof HTMLSelectElement
            && event.target.matches('.goog-te-combo')
            && event.target.value !== 'en') {
            selectSpanishAfterGoogleReset();
        }
    });

    if (translateEs && translateEn) {
        function selectLanguage(language) {
            currentLanguage = language;
            updateLanguageButtons();
            updateCvDownloadLinks();
            applyGoogleTranslation();

            if (mainNav?.classList.contains('open')) {
                mainNav.classList.remove('open');
                mobileToggle?.setAttribute('aria-expanded', 'false');
            }
        }

        translateEs.addEventListener('click', () => selectLanguage('es'));
        translateEn.addEventListener('click', () => selectLanguage('en'));
        updateLanguageButtons();
    }

    const projectsSection = document.getElementById('proyectos');
    const internshipProjectLink = document.querySelector('.experience-link-card[href="#proyecto-practicas"]');
    const internshipProjectCard = document.getElementById('proyecto-practicas');
    const focusableProjectCards = projectsSection?.querySelectorAll('.project-card') || [];
    focusableProjectCards.forEach(card => card.setAttribute('tabindex', '-1'));
    let pendingProjectFocus = null;

    function clearProjectFocus() {
        pendingProjectFocus = null;
        projectsSection?.querySelector('.project-card:focus')?.blur();
    }

    function updateProjectFocus() {
        if (!projectsSection) return;

        const sectionBounds = projectsSection.getBoundingClientRect();

        if (pendingProjectFocus) {
            const cardBounds = pendingProjectFocus.getBoundingClientRect();
            if (cardBounds.bottom > 0 && cardBounds.top < window.innerHeight) {
                const cardToFocus = pendingProjectFocus;
                pendingProjectFocus = null;
                cardToFocus.focus({ preventScroll: true });
            }
            return;
        }

        const focusedCard = projectsSection.querySelector('.project-card:focus');
        if (focusedCard && (sectionBounds.bottom <= 0 || sectionBounds.top >= window.innerHeight)) {
            focusedCard.blur();
        }
    }

    if (projectsSection) {
        if (internshipProjectLink && internshipProjectCard) {
            internshipProjectLink.addEventListener('click', event => {
                if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

                pendingProjectFocus = internshipProjectCard;
                window.requestAnimationFrame(updateProjectFocus);
            });
        }

        projectsSection.addEventListener('click', event => {
            const clickedCard = event.target instanceof Element
                ? event.target.closest('.project-card')
                : null;

            if (!clickedCard) return;

            clearProjectFocus();
            clickedCard.focus({ preventScroll: true });
        });

        window.addEventListener('scroll', updateProjectFocus, { passive: true });
    }

    /* ==========================================================================
       3. NAVEGACIÓN ACTIVA EN SCROLL (SCROLLSPY)
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightNav() {
        const scrollPosition = window.scrollY + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav);


    /* ==========================================================================
       4. FILTRADO DINÁMICO DE PROYECTOS
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });

            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');

            const filterValue = button.getAttribute('data-filter');

            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category') || '';
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = card.classList.contains('featured-project') ? 'grid' : 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 20);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 200);
                }
            });
        });
    });


    /* ==========================================================================
       5. MODAL LIGHTBOX PARA AMPLIAR CAPTURAS DE PANTALLA
       ========================================================================== */
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const modalClose = document.getElementById('modalClose');
    const modalBackdrop = document.getElementById('modalBackdrop');

    const projectMediaWrappers = document.querySelectorAll('.project-media-wrapper');

    projectMediaWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', event => {
            if (event.target instanceof Element && event.target.closest('.project-destination-link')) return;

            const img = event.target instanceof HTMLImageElement
                ? event.target
                : wrapper.querySelector('.marchamalo-presentation-img') || wrapper.querySelector('.project-img');
            const overlayTitle = wrapper.closest('.project-card').querySelector('.project-title');

            if (img && modal && modalImg) {
                modalImg.src = img.src;
                modalImg.alt = img.alt;
                if (modalCaption) {
                    modalCaption.textContent = overlayTitle ? overlayTitle.textContent : img.alt;
                }
                modal.classList.add('active');
                modal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });


    /* ==========================================================================
       6. EFECTO DINÁMICO TILT 3D EN TARJETAS DE "ME GUSTA"
       ========================================================================== */
    const tiltCards = document.querySelectorAll('[data-tilt]');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -7;
            const rotateY = ((x - centerX) / centerX) * 7;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });


    /* ==========================================================================
       7. FORMULARIO DE CONTACTO (FEEDBACK INTERACTIVO EN FRONTEND)
       ========================================================================== */
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    if (contactForm && formFeedback) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const emailInput = document.getElementById('email');
            const email = emailInput.value.trim();
            const mensaje = document.getElementById('mensaje').value;

            if (!nombre || !email || !emailInput.validity.valid) {
                formFeedback.className = 'form-feedback error';
                formFeedback.textContent = 'Introduce tu nombre y un correo válido.';
                return;
            }

            const subject = encodeURIComponent(`Mensaje desde la web de ${nombre}`);
            const textoCorreo = mensaje.trim()
                ? mensaje
                : `Hola, soy ${nombre}. Le escribo desde el correo ${email}.`;
            const body = encodeURIComponent(textoCorreo);
            formFeedback.className = 'form-feedback success';
            formFeedback.textContent = 'Se abrirá tu aplicación de correo. Revisa el mensaje y pulsa Enviar.';
            window.location.href = `mailto:romerotejedorsergio@gmail.com?subject=${subject}&body=${body}`;
        });
    }


    /* ==========================================================================
       8. AÑO AUTOMÁTICO EN PIE DE PÁGINA
       ========================================================================== */
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

});
