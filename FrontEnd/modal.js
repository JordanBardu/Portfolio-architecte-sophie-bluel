const modalTitle = document.getElementById("modal-title-input");
const modalCategory = document.getElementById("modal-category-input");
const modalFileInput = document.getElementById("add-picture-input");
const modalSubmitButton = document.getElementById("add-photo-button");

const getCategorySelector = async () => {
  const categories = await getCategories();
  const categorySelector = document.getElementById("modal-category-input");
  categorySelector.innerHTML = "";

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.name;
    categorySelector.appendChild(option);
  });
};

const openAddPhotoModal = () => {
  const modal = document.getElementById("add-photo-modal");
  const overlay = document.getElementById("modal-overlay");
  const photoGalleryModal = document.getElementById("photo-gallery-modal");
  photoGalleryModal.style.display = "none";

  modal.style.display = "flex";
  overlay.style.display = "flex";
  getCategorySelector();
};

const deleteGalleryWork = async (id) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(
      `http://localhost:5678/api/works/` + id.toString(),
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      deleteWorkInGallery(id);
    });
  } catch (error) {
    alert("Une erreur est survenue dans la suppression de l'élément.");
  }
};

const addNewWork = (data) => {
  const galleryContainer = document.getElementsByClassName("gallery")[0];
  const newWork = document.createElement("figure");
  const newWorkImage = document.createElement("img");
  const newWorkTitle = document.createElement("figcaption");
  newWorkTitle.innerHTML = document.getElementById("modal-title-input").value;
  newWorkImage.src = data.imageUrl;
  newWork.setAttribute("workId", data.id);

  newWork.appendChild(newWorkImage);
  newWork.appendChild(newWorkTitle);
  galleryContainer.appendChild(newWork);
};

const deleteWorkInGallery = (id) => {
  const modalGalleryContainer = document.getElementById("modal-gallery");
  const mainGallery = document.querySelector(".gallery");

  const workToDelete = modalGalleryContainer.querySelector(
    `figure[workId="${id}"]`,
  );

  if (workToDelete) {
    workToDelete.remove();
  }

  const mainWorkToDelete = mainGallery.querySelector(`figure[workId="${id}"]`);

  if (mainWorkToDelete) {
    mainWorkToDelete.remove();
  }
};

document
  .getElementById("add-photo-button")
  .addEventListener("click", async (event) => {
    event.preventDefault();

    const file = fileInput.files[0];

    if (!isPhotoFormValid()) {
      handleFormError();
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append(
      "title",
      document.getElementById("modal-title-input").value,
    );
    formData.append(
      "category",
      document.getElementById("modal-category-input").value,
    );

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          addNewWork(data);
          closeModal();
        });
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire :", error);
    }
  });

const isPhotoFormValid = () => {
  if (
    modalTitle.value !== "" &&
    modalCategory.value !== "" &&
    modalFileInput.files.length > 0
  ) {
    modalSubmitButton.style.backgroundColor = "rgba(29, 97, 84, 1)";
    return true;
  } else {
    modalSubmitButton.style.backgroundColor = "rgba(167, 167, 167, 1)";
    return false;
  }
};

const handleFormError = () => {
  if (!isPhotoFormValid()) {
    const modal = document.getElementById("add-photo-modal");
    const errorContainer = document.createElement("div");
    errorContainer.classList.add("error-message");
    errorContainer.textContent = "Veuillez remplir tous les champs.";
    errorContainer.style.backgroundColor = "#BF3030";
    errorContainer.style.color = "white";
    errorContainer.style.position = "absolute";

    const existingError = modal.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    modal.appendChild(errorContainer);

    return;
  }
};

const displayModalGallery = (galleryData) => {
  const modalGalleryContainer = document.getElementById("modal-gallery");
  modalGalleryContainer.innerHTML = "";

  galleryData.forEach((work) => {
    const galleryWork = document.createElement("figure");
    const galleryWorkImage = document.createElement("img");
    const trashIcon = document.createElement("img");

    galleryWork.style.position = "relative";
    galleryWork.setAttribute("workId", work.id);
    trashIcon.src = "./assets/icons/trash.svg";
    trashIcon.style.position = "absolute";
    trashIcon.style.marginLeft = "-27%";
    trashIcon.style.marginTop = "6%";
    trashIcon.style.zIndex = "1";
    trashIcon.style.cursor = "pointer";
    galleryWorkImage.src = work.imageUrl;

    trashIcon.addEventListener("click", () => deleteGalleryWork(work.id));

    galleryWork.appendChild(galleryWorkImage);
    galleryWork.appendChild(trashIcon);
    modalGalleryContainer.appendChild(galleryWork);
  });
};

const closeModal = () => {
  const photoGalleryModal = document.getElementById("photo-gallery-modal");
  const addPhotoModal = document.getElementById("add-photo-modal");
  const overlay = document.getElementById("modal-overlay");

  photoGalleryModal.style.display = "none";
  addPhotoModal.style.display = "none";
  overlay.style.display = "none";
};

const openPhotoGalleryModal = async () => {
  const modal = document.getElementById("photo-gallery-modal");
  const overlay = document.getElementById("modal-overlay");
  const addPhotoModal = document.getElementById("add-photo-modal");
  addPhotoModal.style.display = "none";
  const allWorks = await getGalleryWorks();
  displayModalGallery(allWorks);

  modal.style.display = "flex";
  overlay.style.display = "flex";
};

const fileInput = document.getElementById("add-picture-input");

fileInput.addEventListener("change", function () {
  handleAddFileModal();
});

const handleAddFileModal = () => {
  const previewImage = document.getElementById("image-preview");
  const formatText = document.getElementById("valid-format-text");
  const addPictureButton =
    document.getElementsByClassName("add-picture-button");
  const file = fileInput.files[0];

  const acceptedTypes = ["image/png", "image/jpg", "image/jpeg"];

  if (!acceptedTypes.includes(file.type)) {
    alert("Le format du fichier doit être PNG ou JPG.");
    fileInput.value = "";
    return;
  }

  const fileSize = file.size / (1024 * 1024);

  if (fileSize > 4) {
    alert("La taille du fichier ne doit pas dépasser 4 Mo.");
    fileInput.value = "";
    return;
  }

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => {
    previewImage.src = reader.result;
  };

  fileInput.style.display = "none";
  formatText.style.display = "none";
  addPictureButton[0].style.display = "none";
  previewImage.style.height = "100%";
  previewImage.style.width = "auto";
};

const cleanModal = () => {
  const previewImage = document.getElementById("image-preview");
  previewImage.src = "./assets/icons/pictureplaceholder.svg";
  modalTitle.value = "";
};
