/* =========================================================
   LUNERA — SERVICE PAGES JS
   Hero / Process Swiper / FAQ / Parallax / Counters
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initServiceHero();
    initProcessSwiper();
    initServiceFAQ();
    initServiceParallax();
    initServiceCounters();
});


/* =========================================================
   1. MOTION SETTINGS
   ========================================================= */

function serviceReducedMotion() {
    return window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
}


function prepareProcessSwiperLoop(
    swiperElement,
    minimumSlides
) {
    const wrapper =
        swiperElement?.querySelector(
            ".swiper-wrapper"
        );

    if (!wrapper) {
        return;
    }

    const sourceSlides =
        Array.from(
            wrapper.children
        ).filter((slide) =>
            slide.classList.contains(
                "swiper-slide"
            ) &&
            !slide.dataset.loopFill
        );

    if (!sourceSlides.length) {
        return;
    }

    let slideIndex = 0;

    while (
        wrapper.children.length <
        minimumSlides
    ) {
        const clone =
            sourceSlides[
                slideIndex %
                sourceSlides.length
            ].cloneNode(true);

        clone.dataset.loopFill = "true";
        clone
            .querySelectorAll("[id]")
            .forEach((element) => {
                element.removeAttribute("id");
            });

        wrapper.appendChild(clone);
        slideIndex += 1;
    }
}


function refreshProcessSwiperAfterLayout(
    swiper
) {
    if (
        !swiper ||
        swiper.destroyed
    ) {
        return;
    }

    swiper.update();

    if (swiper.params.loop) {
        swiper.loopFix();
    }
}


/* =========================================================
   2. SERVICE HERO ENTRANCE
   ========================================================= */

function initServiceHero() {
    const hero =
        document.querySelector(".service-hero");

    if (
        !hero ||
        serviceReducedMotion()
    ) {
        return;
    }

    const contentItems =
        hero.querySelectorAll(
            [
                ".service-hero__label",
                ".service-hero__title",
                ".service-hero__copy",
                ".service-hero__actions"
            ].join(",")
        );

    const media =
        hero.querySelector(
            ".service-hero__media"
        );

    const back =
        hero.querySelector(
            ".service-hero__media-back"
        );

    const floatingItems =
        hero.querySelectorAll(
            [
                ".service-hero__float",
                ".service-hero__accent"
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
                    delay: 80 + index * 105,
                    easing:
                        "cubic-bezier(0.22, 1, 0.36, 1)",
                    fill: "both"
                }
            );
        }
    );

    if (back) {
        back.animate(
            [
                {
                    opacity: 0,
                    transform:
                        "translateY(25px) rotate(5deg) scale(0.96)"
                },
                {
                    opacity: 1,
                    transform:
                        "translateY(0) rotate(3deg) scale(1)"
                }
            ],
            {
                duration: 900,
                delay: 160,
                easing:
                    "cubic-bezier(0.22, 1, 0.36, 1)",
                fill: "both"
            }
        );
    }

    if (media) {
        media.animate(
            [
                {
                    opacity: 0,
                    transform:
                        "translateY(34px) scale(0.96)"
                },
                {
                    opacity: 1,
                    transform:
                        "translateY(0) scale(1)"
                }
            ],
            {
                duration: 950,
                delay: 220,
                easing:
                    "cubic-bezier(0.22, 1, 0.36, 1)",
                fill: "both"
            }
        );
    }

    floatingItems.forEach(
        (element, index) => {
            element.animate(
                [
                    {
                        opacity: 0,
                        transform:
                            "translateY(15px) scale(0.94)"
                    },
                    {
                        opacity: 1,
                        transform:
                            "translateY(0) scale(1)"
                    }
                ],
                {
                    duration: 560,
                    delay: 570 + index * 105,
                    easing:
                        "cubic-bezier(0.22, 1, 0.36, 1)",
                    fill: "both"
                }
            );
        }
    );
}


/* =========================================================
   3. PROCESS SWIPER
   ========================================================= */

function initProcessSwiper() {
    const swiperElement =
        document.querySelector(
            ".process-swiper"
        );

    if (
        !swiperElement ||
        !window.Swiper
    ) {
        return;
    }

    const section =
        swiperElement.closest(
            ".service-process"
        );

    const previousButton =
        section?.querySelector(
            ".process-swiper__prev"
        );

    const nextButton =
        section?.querySelector(
            ".process-swiper__next"
        );

    const reduceMotion =
        serviceReducedMotion();

    prepareProcessSwiperLoop(
        swiperElement,
        9
    );

    const options = {
        slidesPerView: 1,
        spaceBetween: 16,
        slidesPerGroup: 1,

        loop: true,
        loopAdditionalSlides: 3,

        speed: reduceMotion
            ? 0
            : 760,

        grabCursor: true,
        watchOverflow: false,
        watchSlidesProgress: true,
        updateOnWindowResize: true,
        resizeObserver: true,
        roundLengths: true,

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
                delay: 4400,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
            },

        breakpoints: {
            0: {
                slidesPerView: 1,
                slidesPerGroup: 1,
                spaceBetween: 14
            },

            680: {
                slidesPerView: 2,
                slidesPerGroup: 1,
                spaceBetween: 18
            },

            1120: {
                slidesPerView: 3,
                slidesPerGroup: 1,
                spaceBetween: 22
            }
        },

        on: {
            init() {
                updateProcessSlides(this);
            },

            slideChangeTransitionStart() {
                updateProcessSlides(this);
            },

            resize() {
                refreshProcessSwiperAfterLayout(this);
                updateProcessSlides(this);
            },

            orientationchange() {
                refreshProcessSwiperAfterLayout(this);
                updateProcessSlides(this);
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


function updateProcessSlides(swiper) {
    if (!swiper?.slides) {
        return;
    }

    swiper.slides.forEach((slide) => {
        const isVisible =
            slide.classList.contains(
                "swiper-slide-visible"
            ) ||
            slide.classList.contains(
                "swiper-slide-active"
            );

        slide.setAttribute(
            "aria-hidden",
            isVisible
                ? "false"
                : "true"
        );
    });
}


/* =========================================================
   4. SERVICE FAQ
   ========================================================= */

function initServiceFAQ() {
    const lists =
        document.querySelectorAll(
            ".service-faq__list"
        );

    if (!lists.length) {
        return;
    }

    lists.forEach(
        (list, listIndex) => {
            const items =
                list.querySelectorAll(
                    ".faq-item"
                );

            items.forEach(
                (item, itemIndex) => {
                    prepareServiceFAQItem(
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

                    const wasOpen =
                        item.classList.contains(
                            "is-open"
                        );

                    items.forEach(
                        (currentItem) => {
                            closeServiceFAQ(
                                currentItem
                            );
                        }
                    );

                    if (!wasOpen) {
                        openServiceFAQ(item);
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

                    if (currentIndex === -1) {
                        return;
                    }

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

                    if (
                        event.key ===
                        "Home"
                    ) {
                        event.preventDefault();
                        buttons[0]?.focus();
                    }

                    if (
                        event.key ===
                        "End"
                    ) {
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


function prepareServiceFAQItem(
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
        `service-faq-button-${listIndex}-${itemIndex}`;

    const panelId =
        panel.id ||
        `service-faq-panel-${listIndex}-${itemIndex}`;

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


function openServiceFAQ(item) {
    const button =
        item.querySelector(
            ".faq-item__button"
        );

    const panel =
        item.querySelector(
            ".faq-item__panel"
        );

    item.classList.add(
        "is-open"
    );

    button?.setAttribute(
        "aria-expanded",
        "true"
    );

    panel?.setAttribute(
        "aria-hidden",
        "false"
    );
}


function closeServiceFAQ(item) {
    const button =
        item.querySelector(
            ".faq-item__button"
        );

    const panel =
        item.querySelector(
            ".faq-item__panel"
        );

    item.classList.remove(
        "is-open"
    );

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
   5. SERVICE PARALLAX
   ========================================================= */

function initServiceParallax() {
    const elements =
        document.querySelectorAll(
            ".service-parallax"
        );

    if (
        !elements.length ||
        serviceReducedMotion()
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

            const travel =
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
                        travel
                    )
                );

            const offset =
                -35 + progress * 70;

            element.style.setProperty(
                "--service-parallax-offset",
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
        {
            passive: true
        }
    );

    window.addEventListener(
        "resize",
        requestUpdate,
        {
            passive: true
        }
    );
}


/* =========================================================
   6. RESULT COUNTERS
   ========================================================= */

function initServiceCounters() {
    const counters =
        document.querySelectorAll(
            "[data-service-counter]"
        );

    if (!counters.length) {
        return;
    }

    const reduceMotion =
        serviceReducedMotion();

    const renderFinalValue = (
        counter
    ) => {
        const target =
            Number(
                counter.dataset
                    .serviceCounter
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
                    counter.dataset
                        .counterDecimals
                ) || 0
            );

        counter.textContent =
            formatServiceCounter(
                target,
                prefix,
                suffix,
                decimals
            );
    };

    if (
        reduceMotion ||
        !(
            "IntersectionObserver" in
            window
        )
    ) {
        counters.forEach(
            renderFinalValue
        );

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

                        animateServiceCounter(
                            entry.target
                        );

                        observer.unobserve(
                            entry.target
                        );
                    }
                );
            },
            {
                threshold: 0.4
            }
        );

    counters.forEach((counter) => {
        const target =
            Number(
                counter.dataset
                    .serviceCounter
            );

        if (!Number.isFinite(target)) {
            return;
        }

        observer.observe(counter);
    });
}


function animateServiceCounter(counter) {
    const target =
        Number(
            counter.dataset.serviceCounter
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

    const duration =
        Math.max(
            500,
            Number(
                counter.dataset.counterDuration
            ) || 1250
        );

    const startTime =
        performance.now();

    const render = (time) => {
        const progress =
            Math.min(
                1,
                (
                    time -
                    startTime
                ) /
                duration
            );

        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );

        const currentValue =
            target * eased;

        counter.textContent =
            formatServiceCounter(
                currentValue,
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


function formatServiceCounter(
    value,
    prefix,
    suffix,
    decimals
) {
    const formatted =
        Number(value).toLocaleString(
            "en-US",
            {
                minimumFractionDigits:
                    decimals,
                maximumFractionDigits:
                    decimals
            }
        );

    return `${prefix}${formatted}${suffix}`;
}
