document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling for anchor links
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');

      // Allow normal navigation for external links (HTTP URLs) or HTML page links
      if (targetId.startsWith("http") || targetId.includes(".html")) {
        return;
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

  // Back to Top Button functionality
  const backToTopButton = document.getElementById("backToTop");
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      backToTopButton.style.display = "block";
    } else {
      backToTopButton.style.display = "none";
    }
  });
  
  backToTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

  // News modal functionality with accessibility enhancements
  const newsCard = document.getElementById("newsCard");
  const newsModal = document.getElementById("newsModal");
  const closeModalBtn = document.getElementById("closeModal");

  if (newsCard && newsModal) {
    newsCard.addEventListener("click", () => {
      newsModal.style.display = "block";
      // Move focus to the modal container for keyboard users
      newsModal.focus();
    });
  }

  if (closeModalBtn && newsModal) {
    closeModalBtn.addEventListener("click", () => {
      newsModal.style.display = "none";
      // Return focus to the triggering element
      newsCard.focus();
    });

    // Close modal when clicking outside the modal content
    window.addEventListener("click", (event) => {
      if (event.target === newsModal) {
        newsModal.style.display = "none";
        newsCard.focus();
      }
    });
  }
});
