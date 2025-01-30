document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Allow normal navigation for external links (HTML pages)
            if (targetId.startsWith("http") || targetId.includes(".html")) {
                return; // Don't prevent default behavior for normal links
            }

            // Smooth scroll for internal anchor links (e.g., #section)
            if (targetId.startsWith("#")) {
                e.preventDefault();
                const target = document.querySelector(targetId);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 50,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});
