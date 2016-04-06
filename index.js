document.addEventListener('DOMContentLoaded', () => {
  const foundModules = document.querySelectorAll('[data-module]');
  for (const module of foundModules) {
    const moduleName = module.dataset.module;

    if (moduleName && typeof window[moduleName] === 'function') {
      module.dataset.domodule = new window[moduleName](module);
    }
  }
}, false);
