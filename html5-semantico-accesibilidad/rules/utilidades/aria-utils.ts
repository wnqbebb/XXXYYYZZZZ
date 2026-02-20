/**
 * Utilidades para atributos ARIA
 * 
 * Helpers para trabajar con atributos ARIA de forma segura
 */

/**
 * Genera un ID único para elementos ARIA
 */
export const generateId = (prefix = 'a11y'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Crea una relación aria-describedby entre elementos
 */
export const linkDescription = (
  targetElement: HTMLElement,
  descriptionElement: HTMLElement
): void => {
  if (!descriptionElement.id) {
    descriptionElement.id = generateId('desc');
  }
  
  const currentDescribedBy = targetElement.getAttribute('aria-describedby') || '';
  const descriptions = currentDescribedBy.split(' ').filter(Boolean);
  
  if (!descriptions.includes(descriptionElement.id)) {
    descriptions.push(descriptionElement.id);
    targetElement.setAttribute('aria-describedby', descriptions.join(' '));
  }
};

/**
 * Crea una relación aria-labelledby entre elementos
 */
export const linkLabelledBy = (
  targetElement: HTMLElement,
  labelElement: HTMLElement
): void => {
  if (!labelElement.id) {
    labelElement.id = generateId('label');
  }
  
  const currentLabelledBy = targetElement.getAttribute('aria-labelledby') || '';
  const labels = currentLabelledBy.split(' ').filter(Boolean);
  
  if (!labels.includes(labelElement.id)) {
    labels.push(labelElement.id);
    targetElement.setAttribute('aria-labelledby', labels.join(' '));
  }
};

/**
 * Establece el estado expandido de un elemento
 */
export const setExpanded = (
  element: HTMLElement,
  expanded: boolean
): void => {
  element.setAttribute('aria-expanded', String(expanded));
};

/**
 * Establece el estado seleccionado de un elemento
 */
export const setSelected = (
  element: HTMLElement,
  selected: boolean
): void => {
  element.setAttribute('aria-selected', String(selected));
  // Actualizar tabindex para tabs
  if (element.getAttribute('role') === 'tab') {
    element.setAttribute('tabindex', selected ? '0' : '-1');
  }
};

/**
 * Establece el estado presionado (toggle buttons)
 */
export const setPressed = (
  element: HTMLElement,
  pressed: boolean
): void => {
  element.setAttribute('aria-pressed', String(pressed));
};

/**
 * Establece el estado de carga
 */
export const setBusy = (
  element: HTMLElement,
  busy: boolean
): void => {
  element.setAttribute('aria-busy', String(busy));
};

/**
 * Establece el estado inválido
 */
export const setInvalid = (
  element: HTMLElement,
  invalid: boolean,
  messageElement?: HTMLElement
): void => {
  element.setAttribute('aria-invalid', String(invalid));
  
  if (messageElement) {
    if (!messageElement.id) {
      messageElement.id = generateId('error');
    }
    element.setAttribute('aria-errormessage', messageElement.id);
  }
};

/**
 * Oculta un elemento del árbol de accesibilidad
 */
export const hideFromAT = (element: HTMLElement): void => {
  element.setAttribute('aria-hidden', 'true');
  // Asegurar que elementos hijos no sean focusables
  const focusableElements = element.querySelectorAll(
    'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  focusableElements.forEach((el) => {
    (el as HTMLElement).setAttribute('tabindex', '-1');
  });
};

/**
 * Muestra un elemento en el árbol de accesibilidad
 */
export const showToAT = (element: HTMLElement): void => {
  element.removeAttribute('aria-hidden');
  // Restaurar tabindex
  const focusableElements = element.querySelectorAll(
    '[tabindex="-1"]'
  );
  focusableElements.forEach((el) => {
    if (!el.hasAttribute('data-original-tabindex')) {
      el.removeAttribute('tabindex');
    }
  });
};

/**
 * Crea una región viva para anuncios
 */
export const createLiveRegion = (
  mode: 'polite' | 'assertive' = 'polite',
  atomic = true
): HTMLElement => {
  const region = document.createElement('div');
  region.setAttribute('aria-live', mode);
  region.setAttribute('aria-atomic', String(atomic));
  region.style.cssText = `
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  `;
  document.body.appendChild(region);
  return region;
};

/**
 * Anuncia un mensaje en una región viva
 */
export const announce = (
  message: string,
  mode: 'polite' | 'assertive' = 'polite',
  liveRegion?: HTMLElement
): void => {
  const region = liveRegion || createLiveRegion(mode);
  
  // Limpiar y establecer nuevo mensaje
  region.textContent = '';
  
  // Pequeño delay para asegurar que el screen reader detecta el cambio
  setTimeout(() => {
    region.textContent = message;
  }, 100);
  
  // Limpiar después de anunciar (si no es una región persistente)
  if (!liveRegion) {
    setTimeout(() => {
      region.remove();
    }, 1000);
  }
};

/**
 * Lista de roles ARIA por categoría
 */
export const ARIA_ROLES = {
  widget: [
    'button', 'checkbox', 'gridcell', 'link', 'menuitem', 'menuitemcheckbox',
    'menuitemradio', 'option', 'progressbar', 'radio', 'scrollbar', 'searchbox',
    'separator', 'slider', 'spinbutton', 'switch', 'tab', 'tabpanel', 'textbox',
    'treeitem'
  ],
  composite: [
    'combobox', 'grid', 'listbox', 'menu', 'menubar', 'radiogroup', 'tablist',
    'tree', 'treegrid'
  ],
  landmark: [
    'banner', 'complementary', 'contentinfo', 'form', 'main', 'navigation',
    'region', 'search'
  ],
  live: ['alert', 'log', 'marquee', 'status', 'timer'],
  window: ['alertdialog', 'dialog'],
  structure: [
    'article', 'cell', 'columnheader', 'definition', 'directory', 'document',
    'feed', 'figure', 'group', 'heading', 'img', 'list', 'listitem', 'math',
    'none', 'note', 'presentation', 'row', 'rowgroup', 'rowheader', 'separator',
    'table', 'term', 'toolbar', 'tooltip'
  ],
} as const;

/**
 * Verifica si un rol es válido
 */
export const isValidRole = (role: string): boolean => {
  return Object.values(ARIA_ROLES).flat().includes(role as any);
};

/**
 * Obtiene el nombre accesible de un elemento
 */
export const getAccessibleName = (element: HTMLElement): string => {
  // 1. aria-labelledby
  const labelledBy = element.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labels = labelledBy.split(' ')
      .map(id => document.getElementById(id)?.textContent)
      .filter(Boolean)
      .join(' ');
    if (labels) return labels;
  }
  
  // 2. aria-label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  
  // 3. Contenido de texto (para ciertos roles)
  const role = element.getAttribute('role');
  const contentRoles = ['button', 'link', 'heading', 'cell', 'columnheader', 'rowheader'];
  if (!role || contentRoles.includes(role)) {
    const textContent = element.textContent?.trim();
    if (textContent) return textContent;
  }
  
  // 4. Alt de imagen
  if (element.tagName === 'IMG') {
    return (element as HTMLImageElement).alt || '';
  }
  
  // 5. Label de formulario
  const id = element.id;
  if (id) {
    const label = document.querySelector(`label[for="${id}"]`);
    if (label) return label.textContent?.trim() || '';
  }
  
  return '';
};

export default {
  generateId,
  linkDescription,
  linkLabelledBy,
  setExpanded,
  setSelected,
  setPressed,
  setBusy,
  setInvalid,
  hideFromAT,
  showToAT,
  createLiveRegion,
  announce,
  ARIA_ROLES,
  isValidRole,
  getAccessibleName,
};
