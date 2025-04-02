async function getGalleryWorks() {
  const gallery = await fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error);
    });
  return gallery;
}

async function displayGalleryWork() {
  const galleryData = await getGalleryWorks();
  const galleryContainer = document.getElementsByClassName("gallery")[0];

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
}

displayGalleryWork();
