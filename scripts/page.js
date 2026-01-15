// load settings for sites on page init
chrome.storage.sync.get("options").then((data) => {
  settings = merge_settings(settings, data.options || {});
});

// watch for settings changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.options?.newValue) {
    settings = merge_settings(settings, changes.options.newValue);
  }
});

document.onkeydown = async function keydown(evt) {
  if ((evt.metaKey || evt.ctrlKey) && evt.key === "k") {
    const setting = Object.values(settings).find(
      (i) => i.url == window.location.hostname
    );
    if (setting && setting.enabled) {
      const element = document.querySelector(setting.queries.join(", "));
      if (!element) return;
      if (element.nodeName == "BUTTON" || element.nodeName == "A") {
        element.click();
      } else if (document.activeElement !== element) {
        element.focus();
      } else {
        clickOutside(element);
      }
    }
  }
};

// blur element and simulate click outside
function clickOutside(element) {
  element.blur();

  const clickEvent = new MouseEvent("click", {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: 0,
    clientY: 0,
  });
  document.body.dispatchEvent(clickEvent);
}
