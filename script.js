// Simple smooth scroll to top effect for page navigation
document.addEventListener("DOMContentLoaded", function() {
    const links = document.querySelectorAll('a');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            window.scrollTo({
                top: target.offsetTop - 50,
                behavior: 'smooth'
            });
        });
    });
});
