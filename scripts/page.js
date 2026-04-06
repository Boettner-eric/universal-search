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

// iframe
if (window !== window.top) {
  function getIframeActions() {
    const setting = Object.values(settings).find(byHostname);
    return setting?.actions?.filter((a) => a.iframe && a.enabled) || [];
  }

  const observer = new MutationObserver(() => {
    for (const action of getIframeActions().filter((a) => a.auto)) {
      const el = document.querySelector(action.query);
      if (el) {
        el.click();
        observer.disconnect();
        return;
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), 10000);

  function handleActionKey(key) {
    for (const action of getIframeActions().filter((a) => a.key)) {
      if (key === action.key) {
        const el = document.querySelector(action.query);
        if (el) el.click();
      }
    }
  }

  window.addEventListener("message", (evt) => {
    if (evt.data?.type === "universal-search-action") {
      handleActionKey(evt.data.key);
    }
  });
}

document.onkeydown = async function keydown(evt) {
  const setting = Object.values(settings).find(byHostname);

  // don't capture keys when typing in input fields
  const tag = document.activeElement?.tagName;
  const inInput =
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    document.activeElement?.isContentEditable;
  if (inInput) return;

  // Site-specific action shortcuts (main page only)
  if (window === window.top) {
    const actions = setting?.actions?.filter((a) => a.enabled && a.key) || [];
    for (const action of actions) {
      if (evt.key === action.key) {
        if (action.iframe) {
          const frame = document.querySelector(action.iframe);
          if (frame?.contentWindow) {
            frame.contentWindow.postMessage(
              { type: "universal-search-action", key: action.key },
              "*",
            );
          }
        } else {
          const el = document.querySelector(action.query);
          if (el) {
            el.click();
            return;
          }
        }
      }
    }
  }

  if (matchesHotkey(evt)) {
    evt.preventDefault();
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
