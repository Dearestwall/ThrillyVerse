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

// Wait until the document is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Get elements
  const newsCard = document.getElementById("newsCard");
  const newsModal = document.getElementById("newsModal");
  const closeModalBtn = document.getElementById("closeModal");

  // Open modal when news card is clicked
  if (newsCard && newsModal) {
    newsCard.addEventListener("click", () => {
      newsModal.style.display = "block";
    });
  }

  // Close modal when close button is clicked
  if (closeModalBtn && newsModal) {
    closeModalBtn.addEventListener("click", () => {
      newsModal.style.display = "none";
    });

    // Close modal when clicking outside the modal content
    window.addEventListener("click", (event) => {
      if (event.target === newsModal) {
        newsModal.style.display = "none";
      }
    });
  }
});

