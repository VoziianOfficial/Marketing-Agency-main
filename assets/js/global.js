

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    const CONFIG = window.SITE_CONFIG || {};

    initSiteConfig(CONFIG);
    initHeader();
    initMenu(CONFIG);
    initSearch(CONFIG);
    initCookies(CONFIG);
    initForms(CONFIG);
    initNavigation();
    initServicesDropdown();
    initAOS();
});




function initSiteConfig(config) {
    if (!config || typeof config !== "object") {
        return;
    }

    const pageKey = document.body.dataset.page;
    const currentPage = pageKey && config.pages
        ? config.pages[pageKey]
        : null;



    if (currentPage?.title) {
        document.title = currentPage.title;
    } else if (config.browserTitle) {
        document.title = config.browserTitle;
    }



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



    document
        .querySelectorAll("[data-brand-name]")
        .forEach((element) => {
            element.textContent = config.brandName || "";
        });



    document
        .querySelectorAll("[data-site-logo]")
        .forEach((image) => {
            if (!config.logo) {
                return;
            }

            image.src = config.logo;
            image.alt = `${config.brandName || "Agency"} logo`;
        });



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



    document
        .querySelectorAll("[data-site-disclaimer]")
        .forEach((element) => {
            element.textContent =
                config.disclaimer || "";
        });



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



    const year = new Date().getFullYear();

    document
        .querySelectorAll("[data-current-year]")
        .forEach((element) => {
            element.textContent = year;
        });



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




function initMenu(config = {}) {
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

    const menuSearchIcon =
        menu.querySelector(
            ".menu-panel__search-icon"
        );

    const menuSearchIndex =
        buildSearchIndex(config);

    const menuSearchResults =
        document.createElement("div");

    menuSearchResults.className =
        "menu-panel__search-results";

    menuSearchResults.setAttribute(
        "aria-live",
        "polite"
    );

    menuSearchResults.hidden = true;

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

        if (menuSearchResults) {
            menuSearchResults.hidden = true;
            menuSearchResults.replaceChildren();
        }

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



    if (menuSearch) {
        menuSearch
            .closest(".menu-panel__search")
            ?.appendChild(menuSearchResults);

        const updateMenuSearch = () => {
            renderMenuSearchResults(
                menuSearch.value,
                menuSearchIndex,
                menuSearchResults
            );
        };

        const openMenuSearch = () => {
            const query =
                menuSearch.value.trim();

            const firstMatch =
                getSearchMatches(
                    query,
                    menuSearchIndex,
                    1
                )[0];

            closeMenu({
                restoreFocus: false
            });

            if (query && firstMatch) {
                window.location.href =
                    firstMatch.url;

                return;
            }

            document.dispatchEvent(
                new CustomEvent(
                    "advantshield:open-search",
                    {
                        detail: {
                            query
                        }
                    }
                )
            );
        };

        menuSearch.addEventListener(
            "keydown",
            (event) => {
                if (
                    event.key !== "Enter"
                ) {
                    return;
                }

                event.preventDefault();

                openMenuSearch();
            }
        );

        menuSearch.addEventListener(
            "input",
            updateMenuSearch
        );

        menuSearchResults.addEventListener(
            "click",
            (event) => {
                const result =
                    event.target.closest(
                        ".menu-panel__search-result"
                    );

                if (result) {
                    closeMenu({
                        restoreFocus: false
                    });
                }
            }
        );

        menuSearchIcon?.addEventListener(
            "click",
            openMenuSearch
        );
    }
}




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
        "advantshield:open-search",
        (event) => {
            openSearch(
                event.detail?.query || ""
            );
        }
    );
}


function buildSearchIndex(config) {
    const brand =
        config.brandName || "LLC Advantshield";

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
                "services service marketing seo advertising ads paid social content web website design strategy"
        },
        {
            title: "Contact",
            type: "Section",
            url: "index.html#contact",
            keywords:
                "contact email project brief message"
        }
    ];

    const serviceKeywords = {
        "digital-strategy.html":
            "digital strategy brand strategy marketing plan positioning audience research growth roadmap consulting",
        "seo.html":
            "seo search organic traffic keywords rankings google visibility technical seo content search engine optimization",
        "social-media-marketing.html":
            "social media marketing smm instagram facebook linkedin tiktok community content audience engagement",
        "paid-advertising.html":
            "paid advertising ads ppc paid search google ads meta ads campaigns performance media buying conversion",
        "content-marketing.html":
            "content marketing copywriting articles blog storytelling editorial brand content social search sales",
        "web-design.html":
            "web design website design site landing page ux ui digital experience responsive conversion"
    };

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
                [
                    brand,
                    "service",
                    "services",
                    "marketing",
                    service.name,
                    serviceKeywords[service.slug] || ""
                ]
                    .join(" ")
                    .toLowerCase()
        });
    });

    index.push(
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
    );

    return index;
}


function getSearchMatches(
    query,
    searchIndex,
    limit = 8
) {
    const normalizedQuery =
        query.trim().toLowerCase();

    if (normalizedQuery.length === 0) {
        return searchIndex.slice(0, limit);
    }

    const queryTokens =
        normalizedQuery
            .split(/\s+/)
            .filter(Boolean);

    return searchIndex
        .map((item, index) => {
            const title =
                item.title.toLowerCase();

            const haystack = [
                item.title,
                item.type,
                item.keywords
            ]
                .join(" ")
                .toLowerCase();

            const words =
                haystack.split(/\s+/);

            const isMatch =
                queryTokens.every((token) => {
                    return (
                        haystack.includes(token) ||
                        words.some((word) =>
                            word.startsWith(token)
                        )
                    );
                });

            if (!isMatch) {
                return null;
            }

            let score = index;

            if (item.type === "Service") {
                score -= 100;
            }

            if (title.startsWith(normalizedQuery)) {
                score -= 60;
            }

            if (
                queryTokens.some((token) =>
                    title
                        .split(/\s+/)
                        .some((word) =>
                            word.startsWith(token)
                        )
                )
            ) {
                score -= 25;
            }

            return {
                item,
                score
            };
        })
        .filter(Boolean)
        .sort((a, b) => a.score - b.score)
        .slice(0, limit)
        .map((match) => match.item);
}


function renderMenuSearchResults(
    query,
    searchIndex,
    container
) {
    if (!container) {
        return;
    }

    container.replaceChildren();

    const normalizedQuery =
        query.trim();

    if (!normalizedQuery) {
        container.hidden = true;
        return;
    }

    const matches =
        getSearchMatches(
            normalizedQuery,
            searchIndex,
            5
        );

    container.hidden = false;

    if (!matches.length) {
        const empty =
            document.createElement("p");

        empty.className =
            "menu-panel__search-empty";

        empty.textContent =
            "No services found.";

        container.appendChild(empty);
        return;
    }

    matches.forEach((item) => {
        const link =
            document.createElement("a");

        link.className =
            "menu-panel__search-result";

        link.href = item.url;

        const title =
            document.createElement("span");

        title.textContent =
            item.title;

        const type =
            document.createElement("small");

        type.textContent =
            item.type;

        link.append(title, type);
        container.appendChild(link);
    });
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

    const matches =
        getSearchMatches(
            query,
            searchIndex,
            query.trim() ? 8 : 6
        );

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
        "advantshield-cookie-choice";

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


            wasOpenBeforeInteraction = isOpen;
        }
    );

    trigger.addEventListener(
        "click",
        () => {


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
