document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            // Check if it's an internal link (e.g., "#section-id")
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
