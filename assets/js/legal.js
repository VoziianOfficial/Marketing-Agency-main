

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initLegalNavigation();
    initLegalAnchorLinks();
    initLegalBackToTop();
    initLegalUpdatedDate();
});




function initLegalNavigation() {
    const navigation =
        document.querySelector(".legal-nav");

    if (!navigation) {
        return;
    }

    const links =
        Array.from(
            navigation.querySelectorAll(
                ".legal-nav__link[href^='#']"
            )
        );

    if (!links.length) {
        return;
    }

    const sections = links
        .map((link) => {
            const id =
                link.getAttribute("href");

            if (
                !id ||
                id === "#"
            ) {
                return null;
            }

            try {
                return document.querySelector(id);
            } catch (error) {
                return null;
            }
        })
        .filter(Boolean);

    if (!sections.length) {
        return;
    }

    const setActiveLink = (sectionId) => {
        links.forEach((link) => {
            const isActive =
                link.getAttribute("href") ===
                `#${sectionId}`;

            link.classList.toggle(
                "is-active",
                isActive
            );

            if (isActive) {
                link.setAttribute(
                    "aria-current",
                    "location"
                );

                keepActiveLegalLinkVisible(
                    link,
                    navigation
                );
            } else {
                link.removeAttribute(
                    "aria-current"
                );
            }
        });
    };

    if (
        "IntersectionObserver" in window
    ) {
        const observer =
            new IntersectionObserver(
                (entries) => {
                    const visibleEntries =
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

                    if (!visibleEntries.length) {
                        return;
                    }

                    setActiveLink(
                        visibleEntries[0]
                            .target.id
                    );
                },
                {
                    rootMargin:
                        "-18% 0px -68% 0px",

                    threshold: [
                        0.01,
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



    const initialHash =
        window.location.hash;

    if (initialHash) {
        const initialSection =
            sections.find(
                (section) =>
                    `#${section.id}` ===
                    initialHash
            );

        if (initialSection) {
            setActiveLink(
                initialSection.id
            );
        }
    } else if (sections[0]) {
        setActiveLink(
            sections[0].id
        );
    }
}




function keepActiveLegalLinkVisible(
    link,
    navigation
) {
    if (
        window.innerWidth > 760
    ) {
        return;
    }

    const list =
        navigation.querySelector(
            ".legal-nav__list"
        );

    if (!list) {
        return;
    }

    const listRect =
        list.getBoundingClientRect();

    const linkRect =
        link.getBoundingClientRect();

    const isOutsideLeft =
        linkRect.left <
        listRect.left + 8;

    const isOutsideRight =
        linkRect.right >
        listRect.right - 8;

    if (
        !isOutsideLeft &&
        !isOutsideRight
    ) {
        return;
    }

    link.scrollIntoView({
        behavior:
            prefersLegalReducedMotion()
                ? "auto"
                : "smooth",

        block: "nearest",
        inline: "center"
    });
}




function initLegalAnchorLinks() {
    const links =
        document.querySelectorAll(
            [
                ".legal-nav__link[href^='#']",
                ".legal-back-top[href^='#']"
            ].join(",")
        );

    if (!links.length) {
        return;
    }

    links.forEach((link) => {
        link.addEventListener(
            "click",
            (event) => {
                const hash =
                    link.getAttribute(
                        "href"
                    );

                if (
                    !hash ||
                    hash === "#"
                ) {
                    return;
                }

                let target = null;

                try {
                    target =
                        document.querySelector(
                            hash
                        );
                } catch (error) {
                    return;
                }

                if (!target) {
                    return;
                }

                event.preventDefault();

                scrollToLegalTarget(
                    target
                );



                if (
                    window.history &&
                    window.history.pushState
                ) {
                    window.history.pushState(
                        null,
                        "",
                        hash
                    );
                }
            }
        );
    });
}




function scrollToLegalTarget(target) {
    const header =
        document.querySelector(
            ".site-header"
        );

    const headerHeight =
        header
            ? header.getBoundingClientRect()
                .height
            : 0;

    const extraOffset = 28;

    const targetTop =
        target.getBoundingClientRect()
            .top +
        window.scrollY -
        headerHeight -
        extraOffset;

    window.scrollTo({
        top: Math.max(
            0,
            targetTop
        ),

        behavior:
            prefersLegalReducedMotion()
                ? "auto"
                : "smooth"
    });
}




function initLegalBackToTop() {
    const buttons =
        document.querySelectorAll(
            ".legal-back-top"
        );

    if (!buttons.length) {
        return;
    }

    buttons.forEach((button) => {
        button.addEventListener(
            "click",
            (event) => {
                const href =
                    button.getAttribute(
                        "href"
                    );



                if (
                    href &&
                    href !== "#"
                ) {
                    return;
                }

                event.preventDefault();

                window.scrollTo({
                    top: 0,

                    behavior:
                        prefersLegalReducedMotion()
                            ? "auto"
                            : "smooth"
                });
            }
        );
    });
}




function initLegalUpdatedDate() {
    const elements =
        document.querySelectorAll(
            "[data-legal-updated]"
        );

    if (!elements.length) {
        return;
    }

    elements.forEach((element) => {
        const explicitDate =
            element.dataset.legalUpdated;

        if (
            explicitDate &&
            explicitDate !== "auto"
        ) {
            const date =
                parseLegalDate(
                    explicitDate
                );

            if (date) {
                element.textContent =
                    formatLegalDate(date);
            }

            return;
        }



        const modified =
            new Date(
                document.lastModified
            );

        if (
            Number.isNaN(
                modified.getTime()
            )
        ) {
            return;
        }

        element.textContent =
            formatLegalDate(modified);
    });
}




function parseLegalDate(value) {
    if (!value) {
        return null;
    }

    const date =
        new Date(
            `${value}T00:00:00`
        );

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return null;
    }

    return date;
}


function formatLegalDate(date) {
    try {
        return new Intl.DateTimeFormat(
            "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        ).format(date);
    } catch (error) {
        return date.toLocaleDateString();
    }
}




function prefersLegalReducedMotion() {
    return window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
}
