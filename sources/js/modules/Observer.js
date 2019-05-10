import '../../scss/modules/_observer.scss';

let images = document.querySelectorAll('source, img');

if ('IntersectionObserver' in window) {
  // IntersectionObserver Supported
  let config = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
  };

  // eslint-disable-next-line no-inner-declarations
  function onChange(changes, observer) {
    changes.forEach(function(change) {
      // console.log(change);
      if (change.intersectionRatio > 0) {
        // Stop watching and load the image
        loadImage(change.target);
        observer.unobserve(change.target);
      }
    });
  }

  let observer = new IntersectionObserver(onChange, config);
  images.forEach(function(img) {
    observer.observe(img);
  });
} else {
  for (let i = 0; i < images.length; i++) {
    loadImage(images[i]);
  }
}

function loadImage(image) {
  image.classList.add('fade-in');
  if (image.dataset && image.dataset.src) {
    image.src = image.dataset.src;
  }

  if (image.dataset && image.dataset.srcset) {
    image.srcset = image.dataset.srcset;
  }
}
