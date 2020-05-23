function clicked(info, tab) {
  const { targetElementId } = info;

  browser.tabs.executeScript(tab.id, {
    frameId: info.frameId,
    code: `
      if (typeof targetElementId === 'undefined') {
        var targetElementId = ${targetElementId}; 
      } else {
        targetElementId = ${targetElementId}; 
      }
    `,
  }, () => {
    browser.tabs.executeScript(tab.id,
      {
        frameId: info.frameId,
        file: '/background/pop.js',
      });
  });
}

browser.menus.create({
  id: 'pop-title',
  title: browser.i18n.getMessage('contextMenuItem'),
  contexts: ['image'],
  onclick: clicked,
});
