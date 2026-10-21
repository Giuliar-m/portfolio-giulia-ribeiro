/**
 * Portfólio Giulia Ribeiro — Assistente Virtual para Médicos
 * Vanilla JavaScript (Interações, Animações Suaves, Navegação e Acessibilidade)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const header = document.getElementById('mainHeader');
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const backToTopBtn = document.getElementById('backToTop');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const fadeElements = document.querySelectorAll('.fade-up');

  /* ---------------------------------------------------------
     1. BARRA DE PROGRESSO DE ROLAGEM & ESTADO DO CABEÇALHO
  --------------------------------------------------------- */
  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Atualiza barra de progresso
    if (scrollHeight > 0 && scrollProgressBar) {
      const scrollPercent = (scrollTop / scrollHeight) * 100;
      scrollProgressBar.style.width = `${scrollPercent}%`;
      scrollProgressBar.setAttribute('aria-valuenow', Math.round(scrollPercent));
    }

    // Estilo compacto do cabeçalho
    if (header) {
      if (scrollTop > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Botão Voltar ao Topo
    if (backToTopBtn) {
      if (scrollTop > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // Atualiza link ativo na navbar
    updateActiveNavLink(scrollTop);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Executa uma vez no carregamento

  /* ---------------------------------------------------------
     2. BOTÃO VOLTAR AO TOPO
  --------------------------------------------------------- */
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ---------------------------------------------------------
     3. NAVEGAÇÃO ATIVA CONFORME ROLAGEM (SPY SCROLL)
  --------------------------------------------------------- */
  function updateActiveNavLink(scrollTop) {
    const headerHeight = header ? header.offsetHeight : 70;
    const scrollPos = scrollTop + headerHeight + 60;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  /* ---------------------------------------------------------
     4. ROLAGEM SUAVE COM AJUSTE DE ALTURA DO CABEÇALHO
  --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Fecha o menu mobile se estiver aberto
        closeMobileMenu();

        const headerHeight = header ? header.offsetHeight : 70;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Foco para acessibilidade
        targetElement.setAttribute('tabindex', '-1');
        targetElement.focus({ preventScroll: true });
      }
    });
  });

  /* ---------------------------------------------------------
     5. MENU MOBILE RESPONSIVO
  --------------------------------------------------------- */
  function toggleMobileMenu() {
    const isOpen = navMenu.classList.contains('open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    navMenu.classList.add('open');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    // Fecha o menu ao clicar fora dele
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && !navMenu.contains(e.target) && !navToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });

    // Fecha com a tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  /* ---------------------------------------------------------
     6. ANIMAÇÕES DE ENTRADA SUAVES (INTERSECTION OBSERVER)
  --------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeElements.forEach((el) => {
      revealObserver.observe(el);
    });
  } else {
    // Fallback para navegadores legados
    fadeElements.forEach((el) => {
      el.classList.add('in-view');
    });
  }
});
