document.addEventListener('DOMContentLoaded', () => {
  const foundModules = document.querySelectorAll('[data-module]');

  window.domoduleref = {};

  let idx = 0;

  for (const module of foundModules) {
    const moduleName = module.dataset.module;

    if (moduleName && typeof window[moduleName] === 'function') {
      window.domoduleref[idx] = new window[moduleName](module);
      module.dataset.domodule = idx;
      idx++;
    }
  }
}, false);
