const closeButtons = document.getElementsByClassName("modal-close-button");

Array.from(closeButtons).forEach((button) => {
  button.addEventListener("click", function () {
    closeModal();
  });
});

document
  .getElementById("modal-overlay")
  .addEventListener("click", function (e) {
    if (e.target === document.getElementById("modal-overlay")) {
      closeModal();
    }
  });

document
  .getElementById("photo-gallery-button")
  .addEventListener("click", function () {
    openAddPhotoModal();
  });

document
  .getElementById("modal-back-button")
  .addEventListener("click", function () {
    openPhotoGalleryModal();
  });

document.getElementById("logout-button").addEventListener("click", function () {
  logout();
});

document
  .getElementById("add-picture-input")
  .addEventListener("change", function () {
    handleAddFileModal();
  });

document.getElementById("modify-text").addEventListener("click", function () {
  openPhotoGalleryModal();
});

modalTitle.addEventListener("input", isPhotoFormValid);
modalCategory.addEventListener("change", isPhotoFormValid);
modalFileInput.addEventListener("change", isPhotoFormValid);
