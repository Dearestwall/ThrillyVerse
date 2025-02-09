document.addEventListener("DOMContentLoaded", function () {
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
    // Close the modal if clicking outside its content area
    window.addEventListener("click", (event) => {
      if (event.target === newsModal) {
        newsModal.style.display = "none";
        if (newsCard) newsCard.focus();
      }
    });
  }
});
