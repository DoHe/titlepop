const settings = {
  width: 500,
  height: -1,
  titleAlt: 'title',
};

const modalHtml = `
  <div class="js-titlepop-modal titlepop-modal">
  <div class="titlepop-modal-content">
      <span class="js-titlepop-close-button titlepop-close-button">&times;</span>
      <h2 class="js-titlepop-title"></h2>
      <h2 class="js-titlepop-alt"></h2>
  </div>
  </div>
`;

function isValidImage(image) {
  const {
    height, width, title, alt,
  } = image;
  const correctWidth = settings.width < 0 || width >= settings.width;
  const correctHeight = settings.height < 0 || height >= settings.height;
  let hasTitleAlt = false;
  switch (settings.titleAlt) {
    case 'both':
      hasTitleAlt = alt || title;
      break;
    case 'title':
      hasTitleAlt = !!title;
      break;
    case 'alt':
      hasTitleAlt = !!alt;
      break;
    default:
      break;
  }
  return correctWidth && correctHeight && hasTitleAlt;
}

function addMap(image, idx) {
  if (!isValidImage(image)) {
    return;
  }
  const mapName = `${idx}-titlepop-map`;
  image.setAttribute('usemap', `#${mapName}`);
  const {
    height, width, title, alt,
  } = image;
  const map = `<map name="${mapName}">
      <area
        class="js-titlepop-trigger"
        data-title="${title}"
        data-alt="${alt}"
        shape="rect"
        coords="${Math.max(0, width - 100)},${Math.max(0, height - 100)},${width},${height}"
        alt="Titlepop"
        href="#"
      >
    </map>`;
  const mapNode = document.createElement('div');
  mapNode.innerHTML = map;
  document.body.appendChild(mapNode);
}

function addMapsToImages() {
  let idx = 0;
  document.querySelectorAll('img').forEach((image) => {
    if (image.complete) {
      addMap(image, idx);
    } else {
      image.addEventListener('load', () => addMap(image, idx), false);
    }
    idx += 1;
  });
}

function addPopTriggers() {
  document.addEventListener('click', (event) => {
    if (event.target.matches('.js-titlepop-trigger')) {
      event.preventDefault();
      const title = document.querySelector('.js-titlepop-title');
      const alt = document.querySelector('.js-titlepop-alt');
      switch (settings.titleAlt) {
        case 'title':
          title.textContent = event.target.dataset.title;
          break;
        case 'alt':
          alt.textContent = event.target.dataset.alt;
          break;
        case 'both':
          title.textContent = event.target.dataset.title;
          alt.textContent = event.target.dataset.alt;
          break;
        default:
          break;
      }
      const modal = document.querySelector('.js-titlepop-modal');
      modal.classList.add('titlepop-show-modal');
    }
  });
}

function addModal() {
  const modalNode = document.createElement('div');
  modalNode.innerHTML = modalHtml;
  document.body.appendChild(modalNode);

  const modal = document.querySelector('.js-titlepop-modal');
  const closeButton = document.querySelector('.js-titlepop-close-button');
  function toggleModal() {
    modal.classList.toggle('titlepop-show-modal');
  }

  function windowOnClick(event) {
    if (event.target === modal) {
      toggleModal();
    }
  }

  closeButton.addEventListener('click', toggleModal);
  window.addEventListener('click', windowOnClick);
}

function start() {
  const getting = browser.storage.sync.get([
    'width',
    'height',
    'titleAlt',
  ]);
  getting.then((syncedSettings) => {
    Object.assign(settings, syncedSettings);
    addMapsToImages();
    addPopTriggers();
    addModal();
  }, (error) => {
    console.log(`Error: ${error}`);
  });
}

start();
