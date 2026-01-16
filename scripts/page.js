// load settings for sites on page init
chrome.storage.sync.get(["options", "hotkey"]).then((data) => {
  settings = merge_settings(settings, data.options || {});
  hotkeyConfig = merge_hotkey_config(hotkeyConfig, data.hotkey);
});

// watch for settings changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync") {
    if (changes.options?.newValue) {
      settings = merge_settings(settings, changes.options.newValue);
    }
    if (changes.hotkey?.newValue) {
      hotkeyConfig = merge_hotkey_config(hotkeyConfig, changes.hotkey.newValue);
    }
  }
});

document.onkeydown = async function keydown(evt) {
  if (matchesHotkey(evt)) {
    evt.preventDefault();
    const setting = Object.values(settings).find(byHostname);
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

function matchesHotkey(evt) {
  const customMatch =
    evt.key.toLowerCase() === hotkeyConfig.key.toLowerCase() &&
    evt.ctrlKey === hotkeyConfig.ctrl &&
    evt.altKey === hotkeyConfig.alt &&
    evt.shiftKey === hotkeyConfig.shift &&
    evt.metaKey === hotkeyConfig.meta;

  return (
    customMatch ||
    ((evt.metaKey || evt.ctrlKey) && evt.key === "k") ||
    evt.key === "/"
  );
}

function byHostname(setting) {
  return setting.url == window.location.hostname;
}

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
