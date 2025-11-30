
export const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        window.history.pushState(null, null, `#${sectionId}`);
    }
};

export const handleLandingPageLoad = () => {
    const hash = window.location.hash;
    if (hash) {
        setTimeout(() => {
            const sectionId = hash.replace('#', '');
            scrollToSection(sectionId);
        }, 100);
    }
};