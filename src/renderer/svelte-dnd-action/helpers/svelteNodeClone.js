/**
 * Fixes svelte issue when cloning node containing (or being) <select> which will loose it's value.
 * Since svelte manages select value internally.
 * @see https://github.com/sveltejs/svelte/issues/6717
 * @see https://github.com/isaacHagoel/svelte-dnd-action/issues/306
 * 
 * @param {HTMLElement} el 
 * @returns 
 */
export function svelteNodeClone(el) {
  const cloned = el.cloneNode(true);

  const values = [];
  const elIsSelect = el.tagName === "SELECT";
  const selects = elIsSelect ? [el] : [...el.querySelectorAll('select')];
  for (const select of selects) {
    values.push(select.value);
  }

  if (selects.length <= 0) {
    return cloned;
  }

  const clonedSelects = elIsSelect ? [cloned] : [...cloned.querySelectorAll('select')];
  for (let i = 0; i < clonedSelects.length; i++) {
    const select = clonedSelects[i];
    const value = values[i];
    const optionEl = select.querySelector(`option[value="${value}"`);
    if (optionEl) {
      optionEl.setAttribute('selected', true);
    }
  }

  return cloned;
}
