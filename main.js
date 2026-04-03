// Menson Gourmet - Landing Page Scripts
console.log('Menson Gourmet Visual Base Loaded.');

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;

    // 1. Navbar Scroll Effect
    const handleScroll = () => {
        if (navbar) {
            if (window.scrollY > 10) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    };

    window.addEventListener('scroll', handleScroll);

    // 2. Mobile Menu Toggle
    const openMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.add('active');
            body.classList.add('menu-open');
        }
    };

    const closeMenu = () => {
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            body.classList.remove('menu-open');
        }
    };

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', openMenu);
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMenu);
    }

    // Close menu when clicking on a link
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a, .mobile-nav-actions a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // 3. Smooth Scroll for anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.startsWith('#demo-')) return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 5. ECONOMY CALCULATOR LOGIC
    const slider = document.getElementById('faturamento-slider');
    const displayFaturamento = document.getElementById('faturamento-display');
    const displayIfoodMensal = document.getElementById('ifood-perde-mensal');
    const displayIfoodAnual = document.getElementById('ifood-perde-anual'); // savings box
    const displayIfoodAnualCard = document.querySelector('.js-ifood-anual'); // compare card
    const displayEconomiaMensal = document.getElementById('economia-mensal');
    const displayEconomiaAnual = document.getElementById('economia-anual');
    const displayRoiDays = document.getElementById('roi-days');

    const TAXA_IFOOD = 0.152;
    const MENSALIDADE_MENSON = 369;
    const SETUP_MENSON = 1990;
    const CUSTO_MENSON_ANUAL = MENSALIDADE_MENSON * 12;

    const formatBRL = (val) => {
        return val.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        });
    };

    const triggerPulse = (el) => {
        if (!el) return;
        el.classList.remove('pulse-animate');
        void el.offsetWidth; // reflow
        el.classList.add('pulse-animate');
    };

    const updateCalculator = () => {
        const val = parseInt(slider.value);
        
        // Update slider track background
        const percent = ((val - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.background = `linear-gradient(to right, #F97316 0%, #F97316 ${percent}%, #E2E8F0 ${percent}%, #E2E8F0 100%)`;

        const perdaIfood = val * TAXA_IFOOD;
        const perdaIfoodAnual = perdaIfood * 12;
        const economiaMensal = Math.max(0, perdaIfood - MENSALIDADE_MENSON);
        const economiaAnual = economiaMensal * 12;
        
        // ROI Calculation
        let diasRoi = 0;
        if (economiaMensal > 0) {
            diasRoi = Math.ceil(SETUP_MENSON / (economiaMensal / 30));
        }

        // Update DOM - compare cards
        displayFaturamento.textContent = formatBRL(val);
        if (displayIfoodMensal) displayIfoodMensal.textContent = `- ${formatBRL(perdaIfood)}`;
        if (displayIfoodAnualCard) displayIfoodAnualCard.textContent = `- ${formatBRL(perdaIfoodAnual)} 😱`;
        
        // Update DOM - savings box
        if (displayIfoodAnual) displayIfoodAnual.textContent = `- ${formatBRL(perdaIfoodAnual)} 😱`;
        if (displayEconomiaMensal) displayEconomiaMensal.textContent = `${formatBRL(economiaMensal)}/mês`;
        if (displayEconomiaAnual) {
            displayEconomiaAnual.textContent = `${formatBRL(economiaAnual)}`;
            triggerPulse(displayEconomiaAnual);
        }
        
        if (diasRoi > 0) {
            if (displayRoiDays) {
                displayRoiDays.closest('.roi-box').style.display = 'flex';
                displayRoiDays.textContent = `O setup de R$1.990 se paga em ${diasRoi} dias`;
            }
        } else {
            if (displayRoiDays) displayRoiDays.closest('.roi-box').style.display = 'none';
        }
    };

    if (slider) {
        slider.addEventListener('input', updateCalculator);
        // Initial setup
        updateCalculator();
    }

    // 6. FEATURE TABS LOGIC
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');

            // if already active, do nothing
            if (btn.classList.contains('active')) return;

            // Toggle buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Toggle panels with a brief fade effect
            tabPanels.forEach(panel => {
                if (panel.classList.contains('active')) {
                    panel.style.opacity = '0';
                    setTimeout(() => {
                        panel.classList.remove('active');
                        panel.style.display = 'none'; // Ensure it's hidden from layout
                        
                        const newPanel = document.getElementById(`tab-${target}`);
                        newPanel.style.display = 'grid'; // Return to layout (matches CSS)
                        newPanel.classList.add('active');
                        
                        // Trigger reflow for transition
                        void newPanel.offsetWidth;
                        newPanel.style.opacity = '1';
                    }, 250);
                }
            });
        });
    });

    // 7. FAQ ACCORDION LOGIC
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const header = item.querySelector('.faq-item-header');
        
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
                const content = faq.querySelector('.faq-item-content');
                if (content) content.style.maxHeight = null;
            });
            
            // If the clicked item wasn't active, open it
            if (!isActive) {
                item.classList.add('active');
                const content = item.querySelector('.faq-item-content');
                if (content) content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });

    // Optional: open first item by default
    setTimeout(() => {
        const firstFaq = document.querySelector('.faq-item');
        if (firstFaq) {
            const header = firstFaq.querySelector('.faq-item-header');
            header.click(); // Trigger the click logic instead of manual class add
        }
    }, 1000);

    // 8. WHATSAPP FLOAT BUTTON ENTRANCE
    const waFloat = document.getElementById('wa-float');
    if (waFloat) {
        setTimeout(() => {
            waFloat.classList.add('visible');
        }, 2000);
    }

    // 9. MODAL DEMO LOGIC
    const demoModal = document.getElementById('demo-modal');
    const openDemoBtns = document.querySelectorAll('.open-demo-btn');
    const closeDemoBtn = document.getElementById('close-modal');
    const closeDemoFooterBtn = document.getElementById('modal-close-footer');
    const demoIframeContainer = document.getElementById('demo-iframe-container');
    const modalTitle = document.getElementById('modal-title');

    const demoUrls = {
        menu: 'https://hamburgueria.menson.com.br',
        admin: 'https://hamburgueria.menson.com.br?demo=1'
    };

    const openModal = (type) => {
        const url = demoUrls[type];
        window.open(url, '_blank');
    };

    const closeModal = () => {
        if (demoModal) {
            demoModal.classList.remove('active');
            body.classList.remove('modal-open');
        }
        // Clean up iframe to stop background processes after transition
        setTimeout(() => {
            if (demoIframeContainer) {
                demoIframeContainer.innerHTML = `
                    <div id="iframe-placeholder" class="iframe-loading">
                        <div class="spinner"></div>
                        <p>Carregando demonstração segura...</p>
                    </div>
                `;
            }
        }, 400);
    };

    openDemoBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const type = btn.getAttribute('data-demo');
            openModal(type);
        });
    });

    if (closeDemoBtn) closeDemoBtn.addEventListener('click', closeModal);
    if (closeDemoFooterBtn) closeDemoFooterBtn.addEventListener('click', closeModal);

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && demoModal && demoModal.classList.contains('active')) {
            closeModal();
        }
    });

    // Close modal on outside click
    if (demoModal) {
        demoModal.addEventListener('click', (e) => {
            if (e.target === demoModal) {
                closeModal();
            }
        });
    }

    // 5. Pricing Carousel Logic for Mobile Focus
    const pricingGrid = document.querySelector('.pricing-grid');
    const pricingCards = document.querySelectorAll('.pricing-card');

    if (pricingGrid && pricingCards.length > 0) {
        const updateActiveCard = () => {
            // Only apply logic on mobile screens
            if (window.innerWidth > 768) {
                pricingCards.forEach(card => card.classList.remove('is-active'));
                return;
            }

            const gridRect = pricingGrid.getBoundingClientRect();
            const gridCenter = gridRect.left + gridRect.width / 2;

            let closestCard = null;
            let minDistance = Infinity;

            pricingCards.forEach(card => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + cardRect.width / 2;
                const distance = Math.abs(gridCenter - cardCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestCard = card;
                }
            });

            const pricingDots = document.querySelectorAll('#pricing-dots .dot');
            pricingCards.forEach((card, index) => {
                if (card === closestCard) {
                    card.classList.add('is-active');
                    if (pricingDots[index]) pricingDots[index].classList.add('active');
                } else {
                    card.classList.remove('is-active');
                    if (pricingDots[index]) pricingDots[index].classList.remove('active');
                }
            });
        };

        // Allow clicking dots to scroll
        const pricingDots = document.querySelectorAll('#pricing-dots .dot');
        pricingDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const targetCard = pricingCards[index];
                if (targetCard) {
                    const scrollTarget = targetCard.offsetLeft - (pricingGrid.offsetWidth / 2) + (targetCard.offsetWidth / 2);
                    pricingGrid.scrollTo({
                        left: scrollTarget,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Scroll listener for real-time focus as user drags
        pricingGrid.addEventListener('scroll', updateActiveCard);
        window.addEventListener('resize', updateActiveCard);
        
        // Initial setup for mobile: Start with the middle (featured) card focused
        if (window.innerWidth <= 768) {
            const featuredCard = document.querySelector('.pricing-card.featured');
            if (featuredCard) {
                // Wait for layout to settle, then center the featured card
                setTimeout(() => {
                    const scrollTarget = featuredCard.offsetLeft - (pricingGrid.offsetWidth / 2) + (featuredCard.offsetWidth / 2);
                    pricingGrid.scrollTo({
                        left: scrollTarget,
                        behavior: 'smooth'
                    });
                    setTimeout(updateActiveCard, 500); // Wait for smooth scroll to finish
                }, 300);
            } else {
                updateActiveCard();
            }
        }
    }

    // 11. SETUP STATS CAROUSEL
    const statsCarousel = document.querySelector('.setup-stats-carousel');
    const statsGrid = document.querySelector('.setup-stats-grid');
    const statsDots = document.querySelectorAll('#stats-dots .dot');
    const statsCards = document.querySelectorAll('.stats-card');

    if (statsCarousel && statsGrid && statsDots.length > 0) {
        const updateStatsActive = () => {
            let closestCard = null;
            let minDistance = Infinity;
            const carouselCenter = statsCarousel.getBoundingClientRect().left + statsCarousel.offsetWidth / 2;

            statsCards.forEach(card => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + cardRect.width / 2;
                const distance = Math.abs(carouselCenter - cardCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestCard = card;
                }
            });

            statsCards.forEach((card, index) => {
                if (card === closestCard) {
                    statsDots[index].classList.add('active');
                } else {
                    statsDots[index].classList.remove('active');
                }
            });
        };

        statsCarousel.addEventListener('scroll', updateStatsActive);
        window.addEventListener('resize', updateStatsActive);
        
        // Allow clicking dots to scroll stats
        statsDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const targetCard = statsCards[index];
                if (targetCard) {
                    const scrollTarget = targetCard.offsetLeft - (statsCarousel.offsetWidth / 2) + (targetCard.offsetWidth / 2);
                    statsCarousel.scrollTo({
                        left: scrollTarget,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Initialize
        updateStatsActive();
    }

    // 12. OBJECTIONS CAROUSEL (FAQ)
    const objectionsCarousel = document.querySelector('.objections-carousel');
    const objectionsDots = document.querySelectorAll('#objections-dots .dot');
    const objectionCards = document.querySelectorAll('.objection-card');

    if (objectionsCarousel && objectionsDots.length > 0) {
        const updateObjectionsActive = () => {
            let closestCard = null;
            let minDistance = Infinity;
            const carouselCenter = objectionsCarousel.getBoundingClientRect().left + objectionsCarousel.offsetWidth / 2;

            objectionCards.forEach(card => {
                const cardRect = card.getBoundingClientRect();
                const cardCenter = cardRect.left + cardRect.width / 2;
                const distance = Math.abs(carouselCenter - cardCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    closestCard = card;
                }
            });

            objectionCards.forEach((card, index) => {
                const dot = objectionsDots[index];
                if (card === closestCard) {
                    card.classList.add('active-card');
                    if (dot) dot.classList.add('active');
                } else {
                    card.classList.remove('active-card');
                    if (dot) dot.classList.remove('active');
                }
            });
        };

        objectionsCarousel.addEventListener('scroll', updateObjectionsActive);
        window.addEventListener('resize', updateObjectionsActive);
        
        // Dot clicks
        objectionsDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const targetCard = objectionCards[index];
                if (targetCard) {
                    const scrollTarget = targetCard.offsetLeft - (objectionsCarousel.offsetWidth / 2) + (targetCard.offsetWidth / 2);
                    objectionsCarousel.scrollTo({
                        left: scrollTarget,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Init
        updateObjectionsActive();
    }
});
