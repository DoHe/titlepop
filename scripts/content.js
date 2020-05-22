const modalCss = `
  .titlepop-modal {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    opacity: 0;
    visibility: hidden;
    transform: scale(1.1);
    transition: visibility 0s linear 0.25s, opacity 0.25s 0s, transform 0.25s;
  }
  .titlepop-modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: white;
    padding: 1rem 1.5rem;
    width: 24rem;
    border-radius: 0.5rem;
  }
  .titlepop-close-button {
    float: right;
    width: 1.5rem;
    line-height: 1.5rem;
    text-align: center;
    cursor: pointer;
    border-radius: 0.25rem;
    background-color: lightgray;
  }
  .titlepop-close-button:hover {
    background-color: darkgray;
  }
  .titlepop-show-modal {
    opacity: 1;
    visibility: visible;
    transform: scale(1.0);
    transition: visibility 0s linear 0s, opacity 0.25s 0s, transform 0.25s;
  }
`;

const modalHtml = `
  <div class="js-titlepop-modal titlepop-modal">
  <div class="titlepop-modal-content">
      <span class="js-titlepop-close-button titlepop-close-button">&times;</span>
      <h1 class="js-titlepop-title"></h1>
  </div>
  </div>
`;

function addMapsToImages() {
  let idx = 0;
  document.querySelectorAll('img').forEach((image) => {
    const { clientHeight, clientWidth, title } = image;
    if (clientWidth > 300 && title) {
      const mapName = `${idx}-titlepop-map`;
      image.setAttribute('usemap', `#${mapName}`);
      const map = `<map name="${mapName}">
      <area
        class="js-titlepop-trigger"
        data-title="${title}"
        shape="rect"
        coords="${clientWidth - 100},${clientHeight - 100},${clientWidth},${clientHeight}"
        alt="Titlepop"
        href="#"
      >
    </map>`;
      const mapNode = document.createElement('div');
      mapNode.innerHTML = map;
      document.body.appendChild(mapNode);
      idx += 1;
    }
  });
}

function addPopTriggers() {
  document.addEventListener('click', (event) => {
    if (event.target.matches('.js-titlepop-trigger')) {
      event.preventDefault();
      const title = document.querySelector('.js-titlepop-title');
      title.textContent = event.target.dataset.title;
      const modal = document.querySelector('.js-titlepop-modal');
      modal.classList.add('titlepop-show-modal');
    }
  });
}

function addModal() {
  const cssNode = document.createElement('style');
  cssNode.type = 'text/css';
  cssNode.innerText = modalCss;
  document.head.appendChild(cssNode);

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

addMapsToImages();
addPopTriggers();
addModal();
