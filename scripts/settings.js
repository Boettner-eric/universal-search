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
  gmail: {
    url: "www.youtube.com",
    queries: ['input[aria-label*="search" i]', 'input[name*="search_query" i]'],
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
};

let hotkeyConfig = {
  key: "K",
  ctrl: false,
  alt: false,
  shift: false,
  meta: true,
};

function merge_settings(settings, storage) {
  Object.entries(storage).forEach(([key, enabled]) => {
    if (key in settings) {
      settings[key].enabled = Boolean(enabled);
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
