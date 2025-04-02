const gallery = fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    return data;
  })
  .catch((error) => {
    console.log(error);
  });

const galleryContainer = document.getElementsByClassName("gallery")[0];

gallery.then((data) => {
  data.forEach((element) => {
    const item = document.createElement("figure");
    const itemImg = document.createElement("img");
    const itemTitle = document.createElement("figcaption");
    item.appendChild(itemImg);
    item.appendChild(itemTitle);
    itemImg.src = element.imageUrl;
    itemTitle.innerHTML = element.title;
    itemImg.alt = element.title;
    galleryContainer.appendChild(item);
  });
});
