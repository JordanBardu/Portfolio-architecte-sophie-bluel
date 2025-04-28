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

const loggedHomepage = () => {
  if (token) {
    const loginButton = document.getElementById("login-button");
    const logoutButton = document.getElementById("logout-button");
    const editionModeHeader = document.getElementById("edition-mode-header");
    const modifyButton = document.getElementById("modify-text");

      loginButton.style.display = "none";
      logoutButton.style.display = "flex";
      editionModeHeader.style.display = "flex";
      modifyButton.style.display = "flex";

  }
}

loggedHomepage();
