// import 'styles/modules/_observer.scss';

const images = document.querySelectorAll("source, img");
const imageArray = [].slice.call(images);

function loadImage(image) {
  image.classList.add("fade-in");
  if (image.dataset && image.dataset.src) {
    image.src = image.dataset.src;
  }

  if (image.dataset && image.dataset.srcset) {
    image.srcset = image.dataset.srcset;
  }
}

if ("IntersectionObserver" in window) {
  const config = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const ovserver = new IntersectionObserver((entries, observer) => {
    entries.map((entry) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0.75) {
        loadImage(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, config);

  imageArray.map((item) => {
    ovserver.observe(item);
  });
} else {
  imageArray.map((element, index) => {
    loadImage(element[index]);
  });
}
