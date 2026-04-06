let settings = {
  amazon: {
    url: "www.amazon.com",
    queries: ['input[aria-label*="Search Amazon" i]'],
    enabled: true,
  },
  disney: {
    url: "www.disneyplus.com",
    queries: ['a[aria-label*="SEARCH" i]'],
    enabled: true,
  },
  google: {
    url: "www.google.com",
    queries: ['textarea[aria-label*="search" i]'],
    enabled: true,
  },
  gmail: {
    url: "mail.google.com",
    queries: ['input[aria-label*="search" i]', 'input[name*="search_query" i]'],
    enabled: true,
  },
  youtube: {
    url: "www.youtube.com",
    queries: ['input[aria-label*="search" i]', 'input[name*="search_query" i]'],
    enabled: true,
    actions: [
      {
        key: "x",
        query: "#close-button button",
        label: "Hide Chat (x)",
        enabled: true,
        iframe: "#chatframe",
        auto: false,
      },
      {
        key: "g",
        query: '[aria-label="Skip ahead to live broadcast."]',
        label: "Skip to Live (g)",
        enabled: true,
      },
    ],
  },
  hbo: {
    url: "play.hbomax.com",
    queries: ['a[aria-label*="Search" i]'],
    enabled: true,
  },
  netflix: {
    url: "www.netflix.com",
    queries: ['button[aria-label*="Search" i]', 'input[id*="searchInput" i]'],
    enabled: true,
  },
  peacocktv: {
    url: "www.peacocktv.com",
    queries: ['a[aria-label*="search" i]'],
    enabled: true,
  },
  paramountplus: {
    url: "www.paramountplus.com",
    queries: ['a[aria-label*="Search" i]'],
    enabled: true,
  },
};

let hotkeyConfig = {
  key: "K",
  ctrl: false,
  alt: false,
  shift: false,
  meta: true,
};

function merge_settings(settings, storage) {
  Object.entries(storage).forEach(([key, value]) => {
    if (key in settings) {
      if (typeof value === "object" && value.actions) {
        settings[key].enabled = Boolean(value.enabled);
        value.actions.forEach((stored, i) => {
          if (settings[key].actions?.[i]) {
            settings[key].actions[i].enabled = Boolean(stored.enabled);
            if ("auto" in stored)
              settings[key].actions[i].auto = Boolean(stored.auto);
          }
        });
      } else {
        settings[key].enabled = Boolean(value);
      }
    }
  });

  return settings;
}

function merge_hotkey_config(config, storage) {
  if (storage) {
    return { ...config, ...storage };
  }
  return config;
}
