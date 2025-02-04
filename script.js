document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling for internal anchor links (only for links starting with '#')
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.offsetTop - 50,
          behavior: "smooth"
        });
      }
    });
  });

  // Back to Top Button functionality
  const backToTopButton = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    backToTopButton.style.display = window.pageYOffset > 300 ? "block" : "none";
  });
  
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Accessible News Modal functionality (if the modal exists on this page)
  const newsModal = document.getElementById("newsModal");
  const closeModalBtn = document.getElementById("closeModal");
  
  if (newsModal && closeModalBtn) {
    // If a news card trigger exists, add an event listener
    const newsCard = document.getElementById("newsCard");
    if (newsCard) {
      newsCard.addEventListener("click", () => {
        newsModal.style.display = "block";
        newsModal.focus();
      });
    }
    closeModalBtn.addEventListener("click", () => {
      newsModal.style.display = "none";
      if (newsCard) newsCard.focus();
    });
    // Close modal when clicking outside modal content
    window.addEventListener("click", (event) => {
      if (event.target === newsModal) {
        newsModal.style.display = "none";
        if (newsCard) newsCard.focus();
      }
    });
  }
});
