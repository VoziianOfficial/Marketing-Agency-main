/* =========================================================
   LUNERA — GLOBAL JS
   Config / Header / Fullscreen Menu / Search / Cookies /
   Forms / Navigation / AOS
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const CONFIG = window.SITE_CONFIG || {};

    initSiteConfig(CONFIG);
    initHeader();
    initMenu();
    initSearch(CONFIG);
    initCookies(CONFIG);
    initForms(CONFIG);
    initNavigation();
    initServicesDropdown();
    initAOS();
});


/* =========================================================
   1. CONFIG
   ========================================================= */

function initSiteConfig(config) {
    if (!config || typeof config !== "object") {
        return;
    }

    const pageKey = document.body.dataset.page;
    const currentPage = pageKey && config.pages
        ? config.pages[pageKey]
        : null;

    /* Browser title */

    if (currentPage?.title) {
        document.title = currentPage.title;
    } else if (config.browserTitle) {
        document.title = config.browserTitle;
    }

    /* Meta description */

    if (currentPage?.description) {
        const description =
            document.querySelector('meta[name="description"]');

        if (description) {
            description.setAttribute(
                "content",
                currentPage.description
            );
        }
    }

    /* Brand name */

    document
        .querySelectorAll("[data-brand-name]")
        .forEach((element) => {
            element.textContent = config.brandName || "";
        });

    /* Logo */

    document
        .querySelectorAll("[data-site-logo]")
        .forEach((image) => {
            if (!config.logo) {
                return;
            }

            image.src = config.logo;
            image.alt = `${config.brandName || "Agency"} logo`;
        });

    /* Favicon */

    if (config.favicon) {
        let favicon =
            document.querySelector(
                'link[rel="icon"][data-site-favicon]'
            );

        if (!favicon) {
            favicon = document.createElement("link");
            favicon.rel = "icon";
            favicon.setAttribute(
                "data-site-favicon",
                ""
            );

            document.head.appendChild(favicon);
        }

        favicon.href = config.favicon;
    }

    /* Email */

    document
        .querySelectorAll("[data-site-email]")
        .forEach((element) => {
            if (!config.email) {
                return;
            }

            element.textContent = config.email;

            if (element.tagName === "A") {
                element.href = `mailto:${config.email}`;
            }
        });

    /* Disclaimer */

    document
        .querySelectorAll("[data-site-disclaimer]")
        .forEach((element) => {
            element.textContent =
                config.disclaimer || "";
        });

    /* Navigation labels */

    if (config.navigation) {
        document
            .querySelectorAll("[data-nav-label]")
            .forEach((element) => {
                const key =
                    element.dataset.navLabel;

                if (config.navigation[key]) {
                    element.textContent =
                        config.navigation[key];
                }
            });
    }

    /* Social links */

    if (config.socialLinks) {
        document
            .querySelectorAll("[data-social]")
            .forEach((link) => {
                const platform =
                    link.dataset.social;

                const url =
                    config.socialLinks[platform];

                if (url) {
                    link.href = url;
                }
            });
    }

    /* Current year */

    const year = new Date().getFullYear();

    document
        .querySelectorAll("[data-current-year]")
        .forEach((element) => {
            element.textContent = year;
        });

    /* Copyright */

    document
        .querySelectorAll("[data-copyright]")
        .forEach((element) => {
            const prefix =
                config.copyright?.prefix || "©";

            const suffix =
                config.copyright?.suffix ||
                `${config.brandName || ""}. All rights reserved.`;

            element.textContent =
                `${prefix} ${year} ${suffix}`;
        });
}


/* =========================================================
   2. HEADER
   ========================================================= */

function initHeader() {
    const header =
        document.querySelector(".site-header");

    if (!header) {
        return;
    }

    let ticking = false;

    const updateHeader = () => {
        header.classList.toggle(
            "is-scrolled",
            window.scrollY > 18
        );

        ticking = false;
    };

    const requestHeaderUpdate = () => {
        if (ticking) {
            return;
        }

        ticking = true;

        window.requestAnimationFrame(
            updateHeader
        );
    };

    updateHeader();

    window.addEventListener(
        "scroll",
        requestHeaderUpdate,
        { passive: true }
    );
}


/* =========================================================
   3. FULLSCREEN BURGER MENU
   ========================================================= */

function initMenu() {
    const menu =
        document.querySelector(".menu-panel");

    const toggles =
        document.querySelectorAll(".menu-toggle");

    if (!menu || !toggles.length) {
        return;
    }

    const closeButton =
        menu.querySelector(".menu-panel__close");

    const menuLinks =
        menu.querySelectorAll(
            ".menu-panel__nav-link"
        );

    const menuSearch =
        menu.querySelector(
            ".menu-panel__search-input"
        );

    let previousFocus = null;

    const getFocusableElements = () => {
        return Array.from(
            menu.querySelectorAll(
                [
                    "a[href]",
                    "button:not([disabled])",
                    "input:not([disabled])",
                    "textarea:not([disabled])",
                    "select:not([disabled])",
                    '[tabindex]:not([tabindex="-1"])'
                ].join(",")
            )
        ).filter((element) => {
            return (
                !element.hasAttribute("hidden") &&
                element.offsetParent !== null
            );
        });
    };

    const openMenu = () => {
        previousFocus =
            document.activeElement;

        menu.classList.add("is-open");

        document.body.classList.add(
            "menu-open"
        );

        menu.setAttribute(
            "aria-hidden",
            "false"
        );

        toggles.forEach((toggle) => {
            toggle.setAttribute(
                "aria-expanded",
                "true"
            );
        });

        window.requestAnimationFrame(() => {
            if (closeButton) {
                closeButton.focus();
            }
        });
    };

    const closeMenu = ({
        restoreFocus = true
    } = {}) => {
        menu.classList.remove("is-open");

        document.body.classList.remove(
            "menu-open"
        );

        menu.setAttribute(
            "aria-hidden",
            "true"
        );

        toggles.forEach((toggle) => {
            toggle.setAttribute(
                "aria-expanded",
                "false"
            );
        });

        if (
            restoreFocus &&
            previousFocus instanceof HTMLElement
        ) {
            previousFocus.focus();
        }
    };

    toggles.forEach((toggle) => {
        toggle.setAttribute(
            "aria-expanded",
            "false"
        );

        toggle.addEventListener(
            "click",
            openMenu
        );
    });

    closeButton?.addEventListener(
        "click",
        () => closeMenu()
    );

    menuLinks.forEach((link) => {
        link.addEventListener(
            "click",
            () => {
                closeMenu({
                    restoreFocus: false
                });
            }
        );
    });

    menu.addEventListener(
        "click",
        (event) => {
            if (event.target === menu) {
                closeMenu();
            }
        }
    );

    menu.addEventListener(
        "keydown",
        (event) => {
            if (
                !menu.classList.contains(
                    "is-open"
                )
            ) {
                return;
            }

            if (event.key === "Escape") {
                event.preventDefault();
                closeMenu();
                return;
            }

            if (event.key !== "Tab") {
                return;
            }

            const focusable =
                getFocusableElements();

            if (!focusable.length) {
                event.preventDefault();
                return;
            }

            const first = focusable[0];
            const last =
                focusable[
                    focusable.length - 1
                ];

            if (
                event.shiftKey &&
                document.activeElement === first
            ) {
                event.preventDefault();
                last.focus();
            } else if (
                !event.shiftKey &&
                document.activeElement === last
            ) {
                event.preventDefault();
                first.focus();
            }
        }
    );

    /*
       Search inside the fullscreen menu.
       Enter closes the burger and opens the
       main search modal with the entered query.
    */

    if (menuSearch) {
        menuSearch.addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key !== "Enter"
                ) {
                    return;
                }

                event.preventDefault();

                const query =
                    menuSearch.value.trim();

                closeMenu({
                    restoreFocus: false
                });

                document.dispatchEvent(
                    new CustomEvent(
                        "lunera:open-search",
                        {
                            detail: {
                                query
                            }
                        }
                    )
                );
            }
        );
    }
}


/* =========================================================
   4. SITE SEARCH
   ========================================================= */

function initSearch(config) {
    const modal =
        document.querySelector(
            ".search-modal"
        );

    if (!modal) {
        return;
    }

    const input =
        modal.querySelector(
            ".search-modal__input"
        );

    const results =
        modal.querySelector(
            ".search-results"
        );

    const closeButton =
        modal.querySelector(
            ".search-modal__close"
        );

    const openButtons =
        document.querySelectorAll(
            ".header-search, [data-search-open]"
        );

    let previousFocus = null;

    const searchIndex =
        buildSearchIndex(config);

    const getFocusableElements = () => {
        return Array.from(
            modal.querySelectorAll(
                [
                    "a[href]",
                    "button:not([disabled])",
                    "input:not([disabled])",
                    '[tabindex]:not([tabindex="-1"])'
                ].join(",")
            )
        ).filter((element) => {
            return (
                !element.hasAttribute("hidden") &&
                element.offsetParent !== null
            );
        });
    };

    const openSearch = (
        initialQuery = ""
    ) => {
        previousFocus =
            document.activeElement;

        modal.classList.add("is-open");

        document.body.classList.add(
            "search-open"
        );

        modal.setAttribute(
            "aria-hidden",
            "false"
        );

        if (input) {
            input.value = initialQuery;

            window.requestAnimationFrame(
                () => {
                    input.focus();

                    if (initialQuery) {
                        renderSearchResults(
                            initialQuery,
                            searchIndex,
                            results
                        );
                    } else {
                        renderSearchResults(
                            "",
                            searchIndex,
                            results
                        );
                    }
                }
            );
        }
    };

    const closeSearch = () => {
        modal.classList.remove(
            "is-open"
        );

        document.body.classList.remove(
            "search-open"
        );

        modal.setAttribute(
            "aria-hidden",
            "true"
        );

        if (input) {
            input.value = "";
        }

        if (results) {
            results.replaceChildren();
        }

        if (
            previousFocus instanceof HTMLElement
        ) {
            previousFocus.focus();
        }
    };

    openButtons.forEach((button) => {
        button.addEventListener(
            "click",
            (event) => {
                event.preventDefault();
                openSearch();
            }
        );
    });

    closeButton?.addEventListener(
        "click",
        closeSearch
    );

    modal.addEventListener(
        "click",
        (event) => {
            if (event.target === modal) {
                closeSearch();
            }
        }
    );

    input?.addEventListener(
        "input",
        () => {
            renderSearchResults(
                input.value,
                searchIndex,
                results
            );
        }
    );

    results?.addEventListener(
        "click",
        (event) => {
            const result =
                event.target.closest(
                    ".search-result"
                );

            if (result) {
                closeSearch();
            }
        }
    );

    modal.addEventListener(
        "keydown",
        (event) => {
            if (
                !modal.classList.contains(
                    "is-open"
                )
            ) {
                return;
            }

            if (event.key === "Escape") {
                event.preventDefault();
                closeSearch();
                return;
            }

            if (event.key !== "Tab") {
                return;
            }

            const focusable =
                getFocusableElements();

            if (!focusable.length) {
                return;
            }

            const first = focusable[0];
            const last =
                focusable[
                    focusable.length - 1
                ];

            if (
                event.shiftKey &&
                document.activeElement === first
            ) {
                event.preventDefault();
                last.focus();
            } else if (
                !event.shiftKey &&
                document.activeElement === last
            ) {
                event.preventDefault();
                first.focus();
            }
        }
    );

    document.addEventListener(
        "lunera:open-search",
        (event) => {
            openSearch(
                event.detail?.query || ""
            );
        }
    );
}


function buildSearchIndex(config) {
    const brand =
        config.brandName || "Lunera";

    const services =
        Array.isArray(config.servicePages)
            ? config.servicePages
            : [];

    const index = [
        {
            title: "Home",
            type: "Page",
            url: "index.html",
            keywords:
                "home marketing agency creative growth strategy"
        },
        {
            title: "About",
            type: "Section",
            url: "index.html#about",
            keywords:
                "about agency team studio marketing"
        },
        {
            title: "Services",
            type: "Section",
            url: "index.html#services",
            keywords:
                "services marketing seo advertising social content web strategy"
        },
        {
            title: "Contact",
            type: "Section",
            url: "index.html#contact",
            keywords:
                "contact email project brief message"
        },
        {
            title: "Privacy Policy",
            type: "Legal",
            url: "privacy-policy.html",
            keywords:
                "privacy policy data information"
        },
        {
            title: "Terms & Conditions",
            type: "Legal",
            url: "terms.html",
            keywords:
                "terms conditions website services"
        },
        {
            title: "Cookie Policy",
            type: "Legal",
            url: "cookies.html",
            keywords:
                "cookies cookie policy preferences"
        }
    ];

    services.forEach((service) => {
        if (
            !service?.name ||
            !service?.slug
        ) {
            return;
        }

        index.push({
            title: service.name,
            type: "Service",
            url: service.slug,
            keywords:
                `${brand} marketing ${service.name}`
                    .toLowerCase()
        });
    });

    return index;
}


function renderSearchResults(
    query,
    searchIndex,
    container
) {
    if (!container) {
        return;
    }

    container.replaceChildren();

    const normalizedQuery =
        query.trim().toLowerCase();

    const matches =
        normalizedQuery.length === 0
            ? searchIndex.slice(0, 6)
            : searchIndex
                .filter((item) => {
                    const haystack = [
                        item.title,
                        item.type,
                        item.keywords
                    ]
                        .join(" ")
                        .toLowerCase();

                    return haystack.includes(
                        normalizedQuery
                    );
                })
                .slice(0, 8);

    if (!matches.length) {
        const empty =
            document.createElement("p");

        empty.className =
            "search-result__type";

        empty.textContent =
            "No matching pages found.";

        container.appendChild(empty);
        return;
    }

    matches.forEach((item) => {
        const link =
            document.createElement("a");

        link.className =
            "search-result";

        link.href = item.url;

        const title =
            document.createElement("span");

        title.className =
            "search-result__title";

        title.textContent =
            item.title;

        const type =
            document.createElement("span");

        type.className =
            "search-result__type";

        type.textContent =
            item.type;

        link.append(
            title,
            type
        );

        container.appendChild(link);
    });
}


/* =========================================================
   5. COOKIE CARD
   ========================================================= */

function initCookies(config) {
    const card =
        document.querySelector(
            ".cookie-card"
        );

    if (!card) {
        return;
    }

    const message =
        card.querySelector(
            "[data-cookie-message]"
        );

    const policy =
        card.querySelector(
            "[data-cookie-policy]"
        );

    const acceptButton =
        card.querySelector(
            "[data-cookie-accept]"
        );

    const declineButton =
        card.querySelector(
            "[data-cookie-decline]"
        );

    const storageKey =
        "lunera-cookie-choice";

    if (message && config.cookies?.message) {
        message.textContent =
            config.cookies.message;
    }

    if (
        policy &&
        config.cookies?.policyText
    ) {
        policy.textContent =
            config.cookies.policyText;
    }

    if (
        acceptButton &&
        config.cookies?.acceptText
    ) {
        acceptButton.textContent =
            config.cookies.acceptText;
    }

    if (
        declineButton &&
        config.cookies?.rejectText
    ) {
        declineButton.textContent =
            config.cookies.rejectText;
    }

    let savedChoice = null;

    try {
        savedChoice =
            window.localStorage.getItem(
                storageKey
            );
    } catch (error) {
        savedChoice = null;
    }

    if (savedChoice) {
        card.classList.add(
            "is-hidden"
        );

        card.hidden = true;
        return;
    }

    card.hidden = false;

    const saveChoice = (choice) => {
        try {
            window.localStorage.setItem(
                storageKey,
                choice
            );
        } catch (error) {
            /*
               Storage may be blocked.
               The card can still close normally.
            */
        }

        card.classList.add(
            "is-hidden"
        );

        window.setTimeout(() => {
            card.hidden = true;
        }, 340);
    };

    acceptButton?.addEventListener(
        "click",
        () => saveChoice("accepted")
    );

    declineButton?.addEventListener(
        "click",
        () => saveChoice("declined")
    );
}


/* =========================================================
   6. CONTACT FORMS
   ========================================================= */

function initForms(config) {
    const forms =
        document.querySelectorAll(
            ".js-contact-form"
        );

    if (!forms.length) {
        return;
    }

    forms.forEach((form) => {
        const status =
            form.querySelector(
                ".form-status"
            );

        const submitButton =
            form.querySelector(
                'button[type="submit"]'
            );

        if (status) {
            status.setAttribute(
                "aria-live",
                "polite"
            );

            status.setAttribute(
                "role",
                "status"
            );
        }

        form.addEventListener(
            "submit",
            async (event) => {
                event.preventDefault();

                if (!form.checkValidity()) {
                    form.reportValidity();
                    return;
                }

                clearFormStatus(status);

                const formData =
                    new FormData(form);

                const endpoint =
                    form.getAttribute(
                        "action"
                    ) ||
                    config.form?.endpoint ||
                    "contact.php";

                const originalButtonText =
                    submitButton?.textContent;

                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.textContent =
                        "Sending...";
                }

                try {
                    const response =
                        await fetch(endpoint, {
                            method: "POST",
                            body: formData,
                            headers: {
                                Accept:
                                    "application/json"
                            }
                        });

                    let payload = null;

                    try {
                        payload =
                            await response.json();
                    } catch (error) {
                        payload = null;
                    }

                    if (
                        !response.ok ||
                        payload?.success === false
                    ) {
                        throw new Error(
                            payload?.message ||
                            config.form
                                ?.errorMessage ||
                            "Something went wrong."
                        );
                    }

                    showFormStatus(
                        status,
                        "success",
                        payload?.message ||
                            config.form
                                ?.successMessage ||
                            "Thank you. Your message has been successfully sent."
                    );

                    form.reset();
                } catch (error) {
                    showFormStatus(
                        status,
                        "error",
                        error?.message ||
                            config.form
                                ?.errorMessage ||
                            "Something went wrong. Please try again."
                    );
                } finally {
                    if (submitButton) {
                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            originalButtonText;
                    }
                }
            }
        );
    });
}


function clearFormStatus(status) {
    if (!status) {
        return;
    }

    status.classList.remove(
        "is-success",
        "is-error"
    );

    status.textContent = "";
}


function showFormStatus(
    status,
    type,
    message
) {
    if (!status) {
        return;
    }

    status.classList.remove(
        "is-success",
        "is-error"
    );

    status.classList.add(
        type === "success"
            ? "is-success"
            : "is-error"
    );

    status.textContent = message;
}


/* =========================================================
   7. NAVIGATION
   ========================================================= */

function initNavigation() {
    const currentFile =
        window.location.pathname
            .split("/")
            .pop() || "index.html";

    const navLinks =
        document.querySelectorAll(
            ".site-header__nav-link"
        );

    navLinks.forEach((link) => {
        const href =
            link.getAttribute("href");

        if (!href) {
            return;
        }

        const cleanHref =
            href.split("#")[0];

        if (
            cleanHref &&
            cleanHref === currentFile
        ) {
            link.classList.add(
                "is-active"
            );
        }
    });

    initHomeSectionNavigation();
}


function initHomeSectionNavigation() {
    const homePage =
        document.body.dataset.page ===
        "home";

    if (!homePage) {
        return;
    }

    const sectionIds = [
        "about",
        "services",
        "contact"
    ];

    const sections =
        sectionIds
            .map((id) =>
                document.getElementById(id)
            )
            .filter(Boolean);

    if (
        !sections.length ||
        !("IntersectionObserver" in window)
    ) {
        return;
    }

    const links =
        Array.from(
            document.querySelectorAll(
                ".site-header__nav-link"
            )
        );

    const setActiveSection = (id) => {
        links.forEach((link) => {
            const href =
                link.getAttribute("href");

            const isMatch =
                href === `#${id}` ||
                href === `index.html#${id}`;

            if (isMatch) {
                link.classList.add(
                    "is-active"
                );
            } else if (
                href?.startsWith("#") ||
                href?.startsWith(
                    "index.html#"
                )
            ) {
                link.classList.remove(
                    "is-active"
                );
            }
        });
    };

    const observer =
        new IntersectionObserver(
            (entries) => {
                const visible =
                    entries
                        .filter(
                            (entry) =>
                                entry.isIntersecting
                        )
                        .sort(
                            (a, b) =>
                                b.intersectionRatio -
                                a.intersectionRatio
                        );

                if (visible[0]) {
                    setActiveSection(
                        visible[0].target.id
                    );
                }
            },
            {
                rootMargin:
                    "-25% 0px -55% 0px",
                threshold: [
                    0.1,
                    0.25,
                    0.5
                ]
            }
        );

    sections.forEach((section) => {
        observer.observe(section);
    });
}


/* =========================================================
   8. HEADER SERVICES DROPDOWN
   ========================================================= */

function initServicesDropdown() {
    const wrapper =
        document.querySelector(".nav-services");

    if (!wrapper) {
        return;
    }

    const trigger =
        wrapper.querySelector(
            ".nav-services__trigger"
        );

    const panel =
        wrapper.querySelector(
            ".nav-services__panel"
        );

    if (!trigger || !panel) {
        return;
    }

    const items =
        Array.from(
            panel.querySelectorAll(
                ".nav-services__item"
            )
        );

    const hoverQuery =
        window.matchMedia(
            "(hover: hover) and (pointer: fine)"
        );

    const currentFile =
        window.location.pathname
            .split("/")
            .pop() || "index.html";

    items.forEach((item) => {
        if (
            item.getAttribute("href") ===
            currentFile
        ) {
            item.classList.add("is-current");

            item.setAttribute(
                "aria-current",
                "page"
            );
        }
    });

    let isOpen = false;
    let wasOpenBeforeInteraction = false;

    const openDropdown = () => {
        if (isOpen) {
            return;
        }

        isOpen = true;

        wrapper.classList.add("is-open");

        trigger.setAttribute(
            "aria-expanded",
            "true"
        );
    };

    const closeDropdown = ({
        restoreFocus = false
    } = {}) => {
        if (!isOpen) {
            return;
        }

        isOpen = false;

        wrapper.classList.remove("is-open");

        trigger.setAttribute(
            "aria-expanded",
            "false"
        );

        if (restoreFocus) {
            trigger.focus();
        }
    };

    trigger.addEventListener(
        "pointerdown",
        () => {
            /*
               Captured before the browser shifts focus to the
               button (which happens on mousedown and already
               opens the panel via "focusin"). Without this
               snapshot, "click" would always see an
               already-open panel and immediately close it.
            */

            wasOpenBeforeInteraction = isOpen;
        }
    );

    trigger.addEventListener(
        "click",
        () => {
            /*
               On hover-capable pointers, "mouseenter" already
               manages the open state, so a click here should
               only ever open (never surprise-close on click).
            */

            if (hoverQuery.matches) {
                openDropdown();
                return;
            }

            if (wasOpenBeforeInteraction) {
                closeDropdown();
            } else {
                openDropdown();
            }
        }
    );

    wrapper.addEventListener(
        "mouseenter",
        () => {
            if (hoverQuery.matches) {
                openDropdown();
            }
        }
    );

    wrapper.addEventListener(
        "mouseleave",
        () => {
            if (hoverQuery.matches) {
                closeDropdown();
            }
        }
    );

    wrapper.addEventListener(
        "focusin",
        () => {
            openDropdown();
        }
    );

    wrapper.addEventListener(
        "focusout",
        (event) => {
            if (
                !wrapper.contains(
                    event.relatedTarget
                )
            ) {
                closeDropdown();
            }
        }
    );

    wrapper.addEventListener(
        "keydown",
        (event) => {
            if (event.key === "Escape") {
                if (isOpen) {
                    event.preventDefault();

                    closeDropdown({
                        restoreFocus: true
                    });
                }

                return;
            }

            const isArrowDown =
                event.key === "ArrowDown";

            const isArrowUp =
                event.key === "ArrowUp";

            if (
                !isArrowDown &&
                !isArrowUp ||
                !items.length
            ) {
                return;
            }

            event.preventDefault();

            if (!isOpen) {
                openDropdown();
                items[0].focus();
                return;
            }

            const focusedIndex =
                items.indexOf(
                    document.activeElement
                );

            let nextIndex = 0;

            if (focusedIndex === -1) {
                nextIndex = 0;
            } else if (isArrowDown) {
                nextIndex =
                    (focusedIndex + 1) %
                    items.length;
            } else {
                nextIndex =
                    (focusedIndex -
                        1 +
                        items.length) %
                    items.length;
            }

            items[nextIndex].focus();
        }
    );

    document.addEventListener(
        "click",
        (event) => {
            if (
                isOpen &&
                !wrapper.contains(event.target)
            ) {
                closeDropdown();
            }
        }
    );
}


/* =========================================================
   9. AOS
   ========================================================= */

function initAOS() {
    if (!window.AOS) {
        return;
    }

    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

    if (reduceMotion) {
        return;
    }

    window.AOS.init({
        duration: 760,
        easing: "ease-out-cubic",
        once: true,
        mirror: false,
        offset: 42,
        anchorPlacement: "top-bottom"
    });

    window.addEventListener(
        "load",
        () => {
            window.AOS.refresh();
        },
        { once: true }
    );
}
