/* =========================================================
   LUNERA — HOME PAGE JS
   Swipers / FAQ / Parallax / Hero Motion /
   Entrance Animation / Counters
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initHomeHeroEntrance();
    initHeroMotion();

    initHomeSwipers();
    initHomeFAQ();

    initHomeParallax();
    initCounters();
});


/* =========================================================
   1. MOTION SETTINGS
   ========================================================= */

function prefersReducedMotion() {
    return window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
}


/* =========================================================
   2. HERO ENTRANCE
   ========================================================= */

function initHomeHeroEntrance() {
    const hero =
        document.querySelector(".home-hero");

    if (
        !hero ||
        prefersReducedMotion()
    ) {
        return;
    }

    const contentItems =
        hero.querySelectorAll(
            [
                ".hero-kicker",
                ".home-hero__title",
                ".home-hero__copy",
                ".home-hero__actions"
            ].join(",")
        );

    const portrait =
        hero.querySelector(".hero-portrait");

    const visualItems =
        hero.querySelectorAll(
            [
                ".hero-sticker",
                ".hero-team-card",
                ".hero-metric-card",
                ".hero-growth-card",
                ".hero-accent-dot"
            ].join(",")
        );

    contentItems.forEach(
        (element, index) => {
            element.animate(
                [
                    {
                        opacity: 0,
                        transform:
                            "translateY(28px)"
                    },
                    {
                        opacity: 1,
                        transform:
                            "translateY(0)"
                    }
                ],
                {
                    duration: 720,
                    delay: 90 + index * 110,
                    easing:
                        "cubic-bezier(0.22, 1, 0.36, 1)",
                    fill: "both"
                }
            );
        }
    );

    if (portrait) {
        portrait.animate(
            [
                {
                    opacity: 0,
                    transform:
                        "translateY(35px) scale(0.96)"
                },
                {
                    opacity: 1,
                    transform:
                        "translateY(0) scale(1)"
                }
            ],
            {
                duration: 920,
                delay: 180,
                easing:
                    "cubic-bezier(0.22, 1, 0.36, 1)",
                fill: "both"
            }
        );
    }

    visualItems.forEach(
        (element, index) => {
            element.animate(
                [
                    {
                        opacity: 0
                    },
                    {
                        opacity: 1
                    }
                ],
                {
                    duration: 520,
                    delay: 520 + index * 95,
                    easing: "ease-out",
                    fill: "both"
                }
            );
        }
    );
}


/* =========================================================
   3. HERO POINTER MOTION
   ========================================================= */

function initHeroMotion() {
    const visual =
        document.querySelector(
            ".home-hero__visual"
        );

    if (
        !visual ||
        prefersReducedMotion()
    ) {
        return;
    }

    const canHover =
        window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        ).matches;

    if (!canHover) {
        return;
    }

    const elements =
        visual.querySelectorAll(
            "[data-hero-depth]"
        );

    if (!elements.length) {
        return;
    }

    let frame = null;
    let pointerX = 0;
    let pointerY = 0;

    const update = () => {
        const rect =
            visual.getBoundingClientRect();

        const normalizedX =
            pointerX / rect.width - 0.5;

        const normalizedY =
            pointerY / rect.height - 0.5;

        elements.forEach((element) => {
            const depth =
                Number(
                    element.dataset.heroDepth
                ) || 1;

            const moveX =
                normalizedX * 14 * depth;

            const moveY =
                normalizedY * 12 * depth;

            element.style.translate =
                `${moveX}px ${moveY}px`;
        });

        frame = null;
    };

    visual.addEventListener(
        "pointermove",
        (event) => {
            const rect =
                visual.getBoundingClientRect();

            pointerX =
                event.clientX - rect.left;

            pointerY =
                event.clientY - rect.top;

            if (frame) {
                return;
            }

            frame =
                window.requestAnimationFrame(
                    update
                );
        }
    );

    visual.addEventListener(
        "pointerleave",
        () => {
            if (frame) {
                window.cancelAnimationFrame(
                    frame
                );

                frame = null;
            }

            elements.forEach((element) => {
                element.style.translate =
                    "0px 0px";
            });
        }
    );
}


/* =========================================================
   4. SWIPERS
   ========================================================= */

function initHomeSwipers() {
    if (!window.Swiper) {
        return;
    }

    const reduceMotion =
        prefersReducedMotion();

    initServicesSwiper(reduceMotion);
    initProjectsSwiper(reduceMotion);
    initTestimonialsSwiper(reduceMotion);
}


/* =========================================================
   5. SERVICES SWIPER
   ========================================================= */

function initServicesSwiper(
    reduceMotion
) {
    const swiperElement =
        document.querySelector(
            ".services-swiper"
        );

    if (!swiperElement) {
        return;
    }

    const section =
        swiperElement.closest(
            ".services-showcase"
        );

    const previousButton =
        section?.querySelector(
            ".services-swiper__prev"
        );

    const nextButton =
        section?.querySelector(
            ".services-swiper__next"
        );

    const options = {
        slidesPerView: 1,
        spaceBetween: 16,

        loop: true,
        loopAdditionalSlides: 2,

        speed: reduceMotion
            ? 0
            : 720,

        grabCursor: true,
        watchOverflow: true,

        observer: true,
        observeParents: true,

        keyboard: {
            enabled: true,
            onlyInViewport: true
        },

        a11y: {
            enabled: true
        },

        autoplay: reduceMotion
            ? false
            : {
                delay: 4300,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },

        breakpoints: {
            0: {
                slidesPerView: 1,
                spaceBetween: 14
            },

            700: {
                slidesPerView: 2,
                spaceBetween: 18
            },

            1120: {
                slidesPerView: 3,
                spaceBetween: 22
            }
        }
    };

    if (
        previousButton &&
        nextButton
    ) {
        options.navigation = {
            prevEl: previousButton,
            nextEl: nextButton
        };
    }

    new window.Swiper(
        swiperElement,
        options
    );
}


/* =========================================================
   6. PROJECTS SWIPER
   ========================================================= */

function initProjectsSwiper(
    reduceMotion
) {
    const swiperElement =
        document.querySelector(
            ".projects-swiper"
        );

    if (!swiperElement) {
        return;
    }

    const section =
        swiperElement.closest(
            ".projects-showcase"
        );

    const previousButton =
        section?.querySelector(
            ".projects-swiper__prev"
        );

    const nextButton =
        section?.querySelector(
            ".projects-swiper__next"
        );

    const options = {
        slidesPerView: "auto",
        centeredSlides: true,
        spaceBetween: 22,

        loop: true,
        loopAdditionalSlides: 3,

        speed: reduceMotion
            ? 0
            : 850,

        grabCursor: true,

        observer: true,
        observeParents: true,

        keyboard: {
            enabled: true,
            onlyInViewport: true
        },

        a11y: {
            enabled: true
        },

        autoplay: reduceMotion
            ? false
            : {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },

        breakpoints: {
            0: {
                spaceBetween: 14
            },

            760: {
                spaceBetween: 20
            },

            1200: {
                spaceBetween: 26
            }
        },

        on: {
            init() {
                updateProjectSlides(this);
            },

            slideChangeTransitionStart() {
                updateProjectSlides(this);
            },

            resize() {
                updateProjectSlides(this);
            }
        }
    };

    if (
        previousButton &&
        nextButton
    ) {
        options.navigation = {
            prevEl: previousButton,
            nextEl: nextButton
        };
    }

    new window.Swiper(
        swiperElement,
        options
    );
}


function updateProjectSlides(swiper) {
    if (!swiper?.slides) {
        return;
    }

    swiper.slides.forEach(
        (slide) => {
            const isActive =
                slide.classList.contains(
                    "swiper-slide-active"
                );

            slide.setAttribute(
                "aria-hidden",
                isActive
                    ? "false"
                    : "true"
            );
        }
    );
}


/* =========================================================
   7. TESTIMONIALS SWIPER
   ========================================================= */

function initTestimonialsSwiper(
    reduceMotion
) {
    const swiperElement =
        document.querySelector(
            ".testimonials-swiper"
        );

    if (!swiperElement) {
        return;
    }

    const section =
        swiperElement.closest(
            ".testimonials-section"
        );

    const pagination =
        section?.querySelector(
            ".testimonials-pagination"
        );

    const options = {
        slidesPerView: 1,
        loop: true,

        speed: reduceMotion
            ? 0
            : 780,

        effect: reduceMotion
            ? "slide"
            : "creative",

        grabCursor: true,

        observer: true,
        observeParents: true,

        keyboard: {
            enabled: true,
            onlyInViewport: true
        },

        a11y: {
            enabled: true
        },

        autoplay: reduceMotion
            ? false
            : {
                delay: 5600,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            }
    };

    if (!reduceMotion) {
        options.creativeEffect = {
            limitProgress: 2,

            prev: {
                translate: [
                    "-8%",
                    0,
                    -1
                ],
                opacity: 0,
                scale: 0.97
            },

            next: {
                translate: [
                    "8%",
                    0,
                    -1
                ],
                opacity: 0,
                scale: 0.97
            }
        };
    }

    if (pagination) {
        options.pagination = {
            el: pagination,
            clickable: true
        };
    }

    new window.Swiper(
        swiperElement,
        options
    );
}


/* =========================================================
   8. FAQ ACCORDION
   ========================================================= */

function initHomeFAQ() {
    const faqLists =
        document.querySelectorAll(
            ".faq-list"
        );

    if (!faqLists.length) {
        return;
    }

    faqLists.forEach(
        (list, listIndex) => {
            const items =
                list.querySelectorAll(
                    ".faq-item"
                );

            items.forEach(
                (item, itemIndex) => {
                    prepareFAQItem(
                        item,
                        listIndex,
                        itemIndex
                    );
                }
            );

            list.addEventListener(
                "click",
                (event) => {
                    const button =
                        event.target.closest(
                            ".faq-item__button"
                        );

                    if (
                        !button ||
                        !list.contains(button)
                    ) {
                        return;
                    }

                    const item =
                        button.closest(
                            ".faq-item"
                        );

                    if (!item) {
                        return;
                    }

                    const isOpen =
                        item.classList.contains(
                            "is-open"
                        );

                    items.forEach(
                        (currentItem) => {
                            closeFAQItem(
                                currentItem
                            );
                        }
                    );

                    if (!isOpen) {
                        openFAQItem(item);
                    }
                }
            );

            list.addEventListener(
                "keydown",
                (event) => {
                    const button =
                        event.target.closest(
                            ".faq-item__button"
                        );

                    if (!button) {
                        return;
                    }

                    const buttons =
                        Array.from(
                            list.querySelectorAll(
                                ".faq-item__button"
                            )
                        );

                    const currentIndex =
                        buttons.indexOf(button);

                    if (
                        event.key ===
                        "ArrowDown"
                    ) {
                        event.preventDefault();

                        buttons[
                            (
                                currentIndex + 1
                            ) %
                            buttons.length
                        ]?.focus();
                    }

                    if (
                        event.key ===
                        "ArrowUp"
                    ) {
                        event.preventDefault();

                        buttons[
                            (
                                currentIndex -
                                1 +
                                buttons.length
                            ) %
                            buttons.length
                        ]?.focus();
                    }

                    if (event.key === "Home") {
                        event.preventDefault();
                        buttons[0]?.focus();
                    }

                    if (event.key === "End") {
                        event.preventDefault();

                        buttons[
                            buttons.length - 1
                        ]?.focus();
                    }
                }
            );
        }
    );
}


function prepareFAQItem(
    item,
    listIndex,
    itemIndex
) {
    const button =
        item.querySelector(
            ".faq-item__button"
        );

    const panel =
        item.querySelector(
            ".faq-item__panel"
        );

    if (
        !button ||
        !panel
    ) {
        return;
    }

    const buttonId =
        button.id ||
        `faq-button-${listIndex}-${itemIndex}`;

    const panelId =
        panel.id ||
        `faq-panel-${listIndex}-${itemIndex}`;

    button.id = buttonId;
    panel.id = panelId;

    button.setAttribute(
        "aria-controls",
        panelId
    );

    panel.setAttribute(
        "aria-labelledby",
        buttonId
    );

    const isOpen =
        item.classList.contains(
            "is-open"
        );

    button.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    panel.setAttribute(
        "aria-hidden",
        String(!isOpen)
    );
}


function openFAQItem(item) {
    const button =
        item.querySelector(
            ".faq-item__button"
        );

    const panel =
        item.querySelector(
            ".faq-item__panel"
        );

    item.classList.add("is-open");

    button?.setAttribute(
        "aria-expanded",
        "true"
    );

    panel?.setAttribute(
        "aria-hidden",
        "false"
    );
}


function closeFAQItem(item) {
    const button =
        item.querySelector(
            ".faq-item__button"
        );

    const panel =
        item.querySelector(
            ".faq-item__panel"
        );

    item.classList.remove("is-open");

    button?.setAttribute(
        "aria-expanded",
        "false"
    );

    panel?.setAttribute(
        "aria-hidden",
        "true"
    );
}


/* =========================================================
   9. PARALLAX
   ========================================================= */

function initHomeParallax() {
    const elements =
        document.querySelectorAll(
            ".parallax-media"
        );

    if (
        !elements.length ||
        prefersReducedMotion()
    ) {
        return;
    }

    let ticking = false;

    const update = () => {
        const viewportHeight =
            window.innerHeight;

        elements.forEach((element) => {
            const rect =
                element.getBoundingClientRect();

            if (
                rect.bottom < 0 ||
                rect.top > viewportHeight
            ) {
                return;
            }

            const totalDistance =
                viewportHeight +
                rect.height;

            const progress =
                Math.min(
                    1,
                    Math.max(
                        0,
                        (
                            viewportHeight -
                            rect.top
                        ) /
                        totalDistance
                    )
                );

            const offset =
                -35 + progress * 70;

            element.style.setProperty(
                "--parallax-offset",
                `${offset.toFixed(2)}px`
            );
        });

        ticking = false;
    };

    const requestUpdate = () => {
        if (ticking) {
            return;
        }

        ticking = true;

        window.requestAnimationFrame(
            update
        );
    };

    update();

    window.addEventListener(
        "scroll",
        requestUpdate,
        { passive: true }
    );

    window.addEventListener(
        "resize",
        requestUpdate,
        { passive: true }
    );
}


/* =========================================================
   10. COUNTERS
   ========================================================= */

function initCounters() {
    const counters =
        document.querySelectorAll(
            "[data-counter]"
        );

    if (!counters.length) {
        return;
    }

    const reduceMotion =
        prefersReducedMotion();

    counters.forEach((counter) => {
        const target =
            Number(
                counter.dataset.counter
            );

        if (!Number.isFinite(target)) {
            return;
        }

        const prefix =
            counter.dataset.counterPrefix ||
            "";

        const suffix =
            counter.dataset.counterSuffix ||
            "";

        const decimals =
            Math.max(
                0,
                Number(
                    counter.dataset.counterDecimals
                ) || 0
            );

        if (reduceMotion) {
            counter.textContent =
                formatCounterValue(
                    target,
                    prefix,
                    suffix,
                    decimals
                );

            return;
        }

        counter.dataset.counterReady =
            "true";
    });

    if (
        reduceMotion ||
        !(
            "IntersectionObserver" in
            window
        )
    ) {
        return;
    }

    const observer =
        new IntersectionObserver(
            (entries) => {
                entries.forEach(
                    (entry) => {
                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }

                        const counter =
                            entry.target;

                        animateCounter(
                            counter
                        );

                        observer.unobserve(
                            counter
                        );
                    }
                );
            },
            {
                threshold: 0.45
            }
        );

    counters.forEach((counter) => {
        if (
            counter.dataset.counterReady ===
            "true"
        ) {
            observer.observe(counter);
        }
    });
}


function animateCounter(counter) {
    const target =
        Number(counter.dataset.counter);

    const prefix =
        counter.dataset.counterPrefix ||
        "";

    const suffix =
        counter.dataset.counterSuffix ||
        "";

    const decimals =
        Math.max(
            0,
            Number(
                counter.dataset.counterDecimals
            ) || 0
        );

    const duration =
        Math.max(
            500,
            Number(
                counter.dataset.counterDuration
            ) || 1250
        );

    const start =
        performance.now();

    const render = (time) => {
        const progress =
            Math.min(
                1,
                (time - start) / duration
            );

        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );

        const value =
            target * eased;

        counter.textContent =
            formatCounterValue(
                value,
                prefix,
                suffix,
                decimals
            );

        if (progress < 1) {
            window.requestAnimationFrame(
                render
            );
        }
    };

    window.requestAnimationFrame(
        render
    );
}


function formatCounterValue(
    value,
    prefix,
    suffix,
    decimals
) {
    return (
        prefix +
        Number(value).toLocaleString(
            "en-US",
            {
                minimumFractionDigits:
                    decimals,
                maximumFractionDigits:
                    decimals
            }
        ) +
        suffix
    );
}
