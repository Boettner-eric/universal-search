let options = {};
let hotkey = {};
const optionsForm = document.getElementById("optionsForm");
const EXCLUDED_KEYS = ["Meta", "Alt", "Esc", "Control"];

function createCheckboxField(name, config) {
  const container = document.createElement("div");
  container.className = "toggle-item";

  const labelText = document.createElement("span");
  labelText.className = "toggle-label";
  labelText.textContent = config.label || name;
  labelText.setAttribute("for", name);

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "toggle-checkbox";
  checkbox.name = name;
  checkbox.id = name;
  checkbox.checked = Boolean(config.enabled);

  checkbox.addEventListener("change", async (event) => {
    options[name] = event.target.checked;
    await chrome.storage.sync.set({ options });
  });

  const toggleSwitch = document.createElement("span");
  toggleSwitch.className = "toggle-switch";

  container.addEventListener("click", (event) => {
    if (event.target !== checkbox) {
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event("change"));
    }
  });

  container.appendChild(labelText);
  container.appendChild(checkbox);
  container.appendChild(toggleSwitch);

  return container;
}

function initializeHotkeyField(config) {
  const display = document.getElementById("hotkey-display");

  if (!display) {
    console.error("Hotkey display element not found");
    return;
  }

  function updateDisplay() {
    const parts = [];
    if (config.ctrl) parts.push("Ctrl");
    if (config.alt) parts.push("Alt");
    if (config.shift) parts.push("Shift");
    if (config.meta) parts.push("Cmd");
    if (config.key && !EXCLUDED_KEYS.includes(config.key))
      parts.push(config.key.toUpperCase());
    display.value = parts.join(" + ") || "";
  }

  updateDisplay();

  display.addEventListener("keydown", async (e) => {
    e.preventDefault();

    config.key = e.key;
    config.ctrl = e.ctrlKey;
    config.alt = e.altKey;
    config.shift = e.shiftKey;
    config.meta = e.metaKey;

    updateDisplay();

    hotkey = { ...config };
    // maybe add some sort of validation
    await chrome.storage.sync.set({ hotkey });
  });
}

async function generateForm() {
  optionsForm.innerHTML = "";

  const data = await chrome.storage.sync.get(["options", "hotkey"]);
  const newSettings = merge_settings(settings, data.options || {});

  Object.entries(newSettings).forEach(([key, config]) => {
    const field = createCheckboxField(key, config);
    optionsForm.appendChild(field);
  });

  const hotkeyData = merge_hotkey_config(hotkeyConfig, data.hotkey);
  initializeHotkeyField(hotkeyData);
}

generateForm();
