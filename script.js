/**
 * ==============================================================================
 * SERGIO ROMERO TEJEDOR - PORTAFOLIO WEB PERSONAL
 * ARCHIVO: script.js (JavaScript Puro / Vanilla JS)
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. MÁQUINA DE ESCRIBIR DINÁMICA (HERO SECTION)
       ========================================================================== */
    const typingElement = document.getElementById('typingText');
    const words = [
        'de Android (Java, MVVM)',
        'de PC (Python, PySide6)',
        'de IA y Big Data'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 90;
    const deletingSpeed = 45;
    const pauseTime = 1800;

    function typeEffect() {
        if (!typingElement) return;

        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && charIndex === currentWord.length) {
            speed = pauseTime;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            speed = 400;
        }

        setTimeout(typeEffect, speed);
    }

    typeEffect();


    /* ==========================================================================
       2. MENÚ MÓVIL (HAMBURGUESA ACCESIBLE)
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
    let translationScriptRequested = false;
    let translationAttempts = 0;

    function applyGoogleTranslation() {
        const languageSelector = document.querySelector('.goog-te-combo');

        if (!languageSelector) {
            if (translationAttempts < 30) {
                translationAttempts++;
                window.setTimeout(applyGoogleTranslation, 100);
            }
            return;
        }

        languageSelector.value = currentLanguage;
        languageSelector.dispatchEvent(new Event('change', { bubbles: true }));
        translationAttempts = 0;
    }

    function updateLanguageButtons() {
        translateEs.classList.toggle('active', currentLanguage === 'es');
        translateEs.setAttribute('aria-pressed', String(currentLanguage === 'es'));
        translateEn.classList.toggle('active', currentLanguage === 'en');
        translateEn.setAttribute('aria-pressed', String(currentLanguage === 'en'));
    }

    if (translateEs && translateEn) {
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement({
                pageLanguage: 'es',
                includedLanguages: 'en,es',
                autoDisplay: false
            }, 'google_translate_element');

            if (currentLanguage !== 'es') applyGoogleTranslation();
        };

        function selectLanguage(language) {
            currentLanguage = language;
            updateLanguageButtons();

            if (window.google?.translate?.TranslateElement) {
                applyGoogleTranslation();
            } else if (language === 'en' && !translationScriptRequested) {
                translationScriptRequested = true;
                const translationScript = document.createElement('script');
                translationScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
                translationScript.onerror = () => {
                    currentLanguage = 'es';
                    updateLanguageButtons();
                    translateEn.title = 'No se pudo cargar la traducción';
                    translateEn.setAttribute('aria-label', 'No se pudo cargar la traducción');
                    translationScriptRequested = false;
                };
                document.head.appendChild(translationScript);
            }

            if (mainNav?.classList.contains('open')) {
                mainNav.classList.remove('open');
                mobileToggle?.setAttribute('aria-expanded', 'false');
            }
        }

        translateEs.addEventListener('click', () => selectLanguage('es'));
        translateEn.addEventListener('click', () => selectLanguage('en'));
        updateLanguageButtons();
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
