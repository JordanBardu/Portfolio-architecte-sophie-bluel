// Récupération et construction de la galerie

const getGalleryWorks = async () => {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupération des œuvres :", error);
    return [];
  }
};

const displayGalleryWork = (galleryData) => {
  const galleryContainer = document.getElementsByClassName("gallery")[0];
  galleryContainer.innerHTML = "";

  galleryData.forEach((work) => {
    const galleryWork = document.createElement("figure");
    const galleryWorkImage = document.createElement("img");
    const galleryWorkTitle = document.createElement("figcaption");

    galleryWorkImage.src = work.imageUrl;
    galleryWorkTitle.innerHTML = work.title;
    galleryWorkImage.alt = work.title;
    galleryWork.style.height = "505.27px";
    galleryWorkImage.style.height = "100%";

    galleryWork.appendChild(galleryWorkImage);
    galleryWork.appendChild(galleryWorkTitle);
    galleryContainer.appendChild(galleryWork);
  });
};

const init = async () => {
  const allWorks = await getGalleryWorks();
  displayGalleryWork(allWorks);
};

init();

// Récupération des catégories et construction du menu de filtrer dynamiquement

const getCategories = async () => {
  const categories = await fetch("http://localhost:5678/api/categories")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
    });

  return categories;
};

const displayCategories = async () => {
  const categoriesData = await getCategories();
  const categoriesContainer = document.getElementById("categories");
  const allCategoriesButton = document.createElement("button");

  allCategoriesButton.classList.add(
    "category__button",
    "category__button__active",
  );
  allCategoriesButton.textContent = "Tous";
  categoriesContainer.appendChild(allCategoriesButton);

  categoriesData.forEach((category) => {
    const categoryButton = document.createElement("button");

    categoryButton.className = "category__button";
    categoryButton.textContent = category.name;
    categoryButton.setAttribute("categoryId", category.id);

    categoriesContainer.appendChild(categoryButton);
  });

  const categoryButtons = document.querySelectorAll(".category__button");
  categoryButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      filterWorks(event);
      handleActiveButton(event);
    });
  });
};

const filterWorks = async (event) => {
  const allWorks = await getGalleryWorks();
  const categoryId = event.target.getAttribute("categoryId");

  if (categoryId === null) {
    displayGalleryWork(allWorks);
    return;
  }

  const filteredWorks = allWorks.filter((work) => {
    return work.category.id.toString() === categoryId;
  });

  displayGalleryWork(filteredWorks);
};

const handleActiveButton = (event) => {
  const categoryButtons = document.querySelectorAll(".category__button");
  categoryButtons.forEach((button) => {
    button.classList.remove("category__button__active");
  });
  event.target.classList.add("category__button__active");
};

let token = localStorage.getItem("token");
if (!token) {
  displayCategories();
}

const toggleAdminHomepage = () => {
  const loginButton = document.getElementById("login-button");
  const logoutButton = document.getElementById("logout-button");
  const editionModeHeader = document.getElementById("edition-mode-header");
  const modifyButton = document.getElementById("modify-text");
  if (token) {
    loginButton.style.display = "none";
    logoutButton.style.display = "flex";
    editionModeHeader.style.display = "flex";
    modifyButton.style.display = "flex";
  } else {
    loginButton.style.display = "flex";
    logoutButton.style.display = "none";
    editionModeHeader.style.display = "none";
    modifyButton.style.display = "none";
  }
};

const logout = () => {
  localStorage.removeItem("token");
  window.location.reload();
};

toggleAdminHomepage();

// Gestion des modales

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

const closeModal = () => {
  const photoGalleryModal = document.getElementById("photo-gallery-modal");
  const addPhotoModal = document.getElementById("add-photo-modal");
  const overlay = document.getElementById("modal-overlay");

  photoGalleryModal.style.display = "none";
  addPhotoModal.style.display = "none";
  overlay.style.display = "none";
  cleanModal();
};

const cleanModal = () => {
  const validFormatText = document.getElementById("valid-format-text");
  validFormatText.style.display = "inline";
  const addPictureButton =
    document.getElementsByClassName("add-picture-button");
  addPictureButton[0].style.display = "block";
  const previewImage = document.getElementById("image-preview");
  previewImage.src = "./assets/icons/pictureplaceholder.svg";
  previewImage.style.height = "auto";
};

const displayModalGallery = (galleryData) => {
  // A voir pour faire une seule fonction avec displayGallery
  const modalGalleryContainer = document.getElementById("modal-gallery");
  modalGalleryContainer.innerHTML = "";

  galleryData.forEach((work) => {
    const galleryWork = document.createElement("figure");
    const galleryWorkImage = document.createElement("img");
    const trashIcon = document.createElement("img");

    galleryWork.style.position = "relative";
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

const fileInput = document.getElementById("add-picture-input");
const uploadFile = () => {
  const previewImage = document.getElementById("image-preview");
  const formatText = document.getElementById("valid-format-text");
  const addPictureButton =
    document.getElementsByClassName("add-picture-button");

  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];

    if (!file) {
      return;
    }

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
  });
};

const openAddPhotoModal = () => {
  const modal = document.getElementById("add-photo-modal");
  const overlay = document.getElementById("modal-overlay");
  const photoGalleryModal = document.getElementById("photo-gallery-modal");
  photoGalleryModal.style.display = "none";

  modal.style.display = "flex";
  overlay.style.display = "flex";
  uploadFile();
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
        body: {
          id: id,
        },
      },
    );

    if (response.ok) {
      alert("Suppression réussie");
      // Faire fake suppression visuelle
    } else {
      alert("Échec de la suppression");
    }
  } catch (error) {
    alert("Une erreur est survenue");
  }
};

const modalTitle = document.getElementById("modal-title-input");
const modalCategory = document.getElementById("modal-category-input");
const modalFileInput = document.getElementById("add-picture-input");

const isPhotoFormValid = () => {
  // Le bouton reste gris
  if (
    modalTitle.value !== "" &&
    modalCategory.value !== "" &&
    modalFileInput.files
  ) {
    modalFileInput.style.backgroundImage = "rgba(29, 97, 84, 1)";
  } else {
    modalFileInput.style.backgroundImage = "rgba(167, 167, 167, 1)"; // Et empecher le post
  }
};

document
  .getElementById("add-photo-button")
  .addEventListener("click", async (event) => {
    event.preventDefault();

    const file = fileInput.files[0];
    if (!file) {
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

const addNewWork = (data) => {
  const galleryContainer = document.getElementsByClassName("gallery")[0];
  const newWork = document.createElement("figure");
  const newWorkImage = document.createElement("img");
  const newWorkTitle = document.createElement("figcaption");
  newWorkTitle.innerHTML = document.getElementById("modal-title-input").value;
  newWorkImage.src = data.imageUrl;

  newWork.appendChild(newWorkImage);
  newWork.appendChild(newWorkTitle);
  galleryContainer.appendChild(newWork);
};
