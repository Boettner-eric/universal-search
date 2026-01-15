//
let options = {};
const optionsForm = document.getElementById("optionsForm");

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

async function generateForm() {
  optionsForm.innerHTML = "";

  const data = await chrome.storage.sync.get("options");
  const newSettings = merge_settings(settings, data.options || {});

  Object.entries(newSettings).forEach(([key, config]) => {
    const field = createCheckboxField(key, config);
    optionsForm.appendChild(field);
  });
}

generateForm();
