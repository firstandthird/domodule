/* eslint no-new:0 */
document.addEventListener('DOMContentLoaded', () => {
  const foundModules = document.querySelectorAll('[data-module]');

  for (const module of foundModules) {
    const moduleName = module.dataset.module;

    if (moduleName && typeof window[moduleName] === 'function') {
      new window[moduleName](module);
    }
  }
}, false);
