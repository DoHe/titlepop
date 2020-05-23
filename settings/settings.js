function setIntSetting(selector, key, settings) {
  const value = parseInt(document.querySelector(selector).value, 10);
  if (!isNaN(value)) {
    settings[key] = value;
  }
}

function saveSettings(e) {
  e.preventDefault();
  let titleAlt = 'title';
  if (document.querySelector('.js-alt').checked) {
    titleAlt = 'alt';
  } else if (document.querySelector('.js-both').checked) {
    titleAlt = 'both';
  }
  const settings = { titleAlt };
  setIntSetting('.js-width', 'width', settings);
  setIntSetting('.js-height', 'height', settings);
  browser.storage.sync.set(settings);
}

function restoreSettings() {
  function setCurrentChoice(result) {
    document.querySelector('.js-width').value = result.width || 500;
    document.querySelector('.js-height').value = result.height || -1;
    let radioSelector = '';
    switch (result.titleAlt) {
      case 'alt':
        radioSelector = '.js-alt';
        break;
      case 'both':
        radioSelector = '.js-both';
        break;
      default:
        radioSelector = '.js-title';
        break;
    }
    document.querySelector(radioSelector).checked = true;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  const getting = browser.storage.sync.get([
    'width',
    'height',
    'titleAlt',
  ]);
  getting.then(setCurrentChoice, onError);
}

document.addEventListener('DOMContentLoaded', restoreSettings);
document.querySelector('form').addEventListener('submit', saveSettings);
