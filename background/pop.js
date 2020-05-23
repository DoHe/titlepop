function pop(titleAlt) {
  function modalHtml(title, alt) {
    return `
  <div class="js-titlepop-context-modal titlepop-modal titlepop-show-modal">
  <div class="titlepop-modal-content">
      <span class="js-titlepop-context-close-button titlepop-close-button">&times;</span>
      <h2>${title}</h2>
      <h2>${alt}</h2>
  </div>
  </div>
  `;
  }

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

  const image = browser.menus.getTargetElement(targetElementId);

  let modal = document.querySelector('.js-titlepop-context-modal');
  if (modal) {
    modal.classList.add('titlepop-show-modal');
  } else {
    const cssNode = document.createElement('style');
    cssNode.type = 'text/css';
    cssNode.innerText = modalCss;
    document.head.appendChild(cssNode);

    const modalNode = document.createElement('div');
    let title = '';
    if (titleAlt === 'title' || titleAlt === 'both') {
      title = image.title;
    }
    let alt = '';
    if (titleAlt === 'alt' || titleAlt === 'both') {
      alt = image.alt;
    }
    modalNode.innerHTML = modalHtml(title, alt);
    document.body.appendChild(modalNode);

    modal = document.querySelector('.js-titlepop-context-modal');

    const closeButton = document.querySelector('.js-titlepop-context-close-button');

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
}

function start() {
  const getting = browser.storage.sync.get('titleAlt');
  getting.then(({ titleAlt }) => {
    pop(titleAlt);
  }, (error) => {
    console.log(`Error: ${error}`);
  });
}

start();
