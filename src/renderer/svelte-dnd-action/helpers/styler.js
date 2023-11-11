import {SHADOW_ELEMENT_ATTRIBUTE_NAME, DRAGGED_ELEMENT_ID} from "../constants";
import {findCenter} from "./intersection";
import {svelteNodeClone} from "./svelteNodeClone";

const TRANSITION_DURATION_SECONDS = 0.2;

/**
 * private helper function - creates a transition string for a property
 * @param {string} property
 * @return {string} - the transition string
 */
function trs(property) {
    return `${property} ${TRANSITION_DURATION_SECONDS}s ease`;
}
/**
 * clones the given element and applies proper styles and transitions to the dragged element
 * @param {HTMLElement} originalElement
 * @param {Point} [positionCenterOnXY]
 * @return {Node} - the cloned, styled element
 */
export function createDraggedElementFrom(originalElement, positionCenterOnXY, cursorStyle) {
    const rect = originalElement.getBoundingClientRect();
    const draggedEl = svelteNodeClone(originalElement);
    copyStylesFromTo(originalElement, draggedEl);
    draggedEl.id = DRAGGED_ELEMENT_ID;
    draggedEl.style.position = "fixed";
    let elTopPx = rect.top;
    let elLeftPx = rect.left;
    draggedEl.style.top = `${elTopPx}px`;
    draggedEl.style.left = `${elLeftPx}px`;
    if (positionCenterOnXY) {
        const center = findCenter(rect);
        elTopPx -= center.y - positionCenterOnXY.y;
        elLeftPx -= center.x - positionCenterOnXY.x;
        window.setTimeout(() => {
            draggedEl.style.top = `${elTopPx}px`;
            draggedEl.style.left = `${elLeftPx}px`;
        }, 0);
    }
    draggedEl.style.margin = "0";
    // we can't have relative or automatic height and width or it will break the illusion
    draggedEl.style.boxSizing = "border-box";
    draggedEl.style.height = `${rect.height}px`;
    draggedEl.style.width = `${rect.width}px`;
    draggedEl.style.transition = `${trs("top")}, ${trs("left")}, ${trs("background-color")}, ${trs("opacity")}, ${trs("color")} `;
    // this is a workaround for a strange browser bug that causes the right border to disappear when all the transitions are added at the same time
    window.setTimeout(() => (draggedEl.style.transition += `, ${trs("width")}, ${trs("height")}`), 0);
    draggedEl.style.zIndex = "9999";
    draggedEl.style.cursor = cursorStyle;

    return draggedEl;
}

/**
 * styles the dragged element to a 'dropped' state
 * @param {HTMLElement} draggedEl
 */
export function moveDraggedElementToWasDroppedState(draggedEl, cursorStyle) {
    draggedEl.style.cursor = cursorStyle;
}

/**
 * Morphs the dragged element style, maintains the mouse pointer within the element
 * @param {HTMLElement} draggedEl
 * @param {HTMLElement} copyFromEl - the element the dragged element should look like, typically the shadow element
 * @param {number} currentMouseX
 * @param {number} currentMouseY
 */
export function morphDraggedElementToBeLike(draggedEl, copyFromEl, currentMouseX, currentMouseY) {
    copyStylesFromTo(copyFromEl, draggedEl);
    const newRect = copyFromEl.getBoundingClientRect();
    const draggedElRect = draggedEl.getBoundingClientRect();
    const widthChange = newRect.width - draggedElRect.width;
    const heightChange = newRect.height - draggedElRect.height;
    if (widthChange || heightChange) {
        const relativeDistanceOfMousePointerFromDraggedSides = {
            left: (currentMouseX - draggedElRect.left) / draggedElRect.width,
            top: (currentMouseY - draggedElRect.top) / draggedElRect.height
        };
        draggedEl.style.height = `${newRect.height}px`;
        draggedEl.style.width = `${newRect.width}px`;
        draggedEl.style.left = `${parseFloat(draggedEl.style.left) - relativeDistanceOfMousePointerFromDraggedSides.left * widthChange}px`;
        draggedEl.style.top = `${parseFloat(draggedEl.style.top) - relativeDistanceOfMousePointerFromDraggedSides.top * heightChange}px`;
    }
}

/**
 * @param {HTMLElement} copyFromEl
 * @param {HTMLElement} copyToEl
 */
function copyStylesFromTo(copyFromEl, copyToEl) {
    const computedStyle = window.getComputedStyle(copyFromEl);
    Array.from(computedStyle)
        .filter(
            s =>
                s.startsWith("background") ||
                s.startsWith("padding") ||
                s.startsWith("font") ||
                s.startsWith("text") ||
                s.startsWith("align") ||
                s.startsWith("justify") ||
                s.startsWith("display") ||
                s.startsWith("flex") ||
                s.startsWith("border") ||
                s === "opacity" ||
                s === "color" ||
                s === "list-style-type"
        )
        .forEach(s => copyToEl.style.setProperty(s, computedStyle.getPropertyValue(s), computedStyle.getPropertyPriority(s)));
}

/**
 * makes the element compatible with being draggable
 * @param {HTMLElement} draggableEl
 * @param {boolean} dragDisabled
 */
export function styleDraggable(draggableEl, dragDisabled, cursorStyle) {
    draggableEl.draggable = false;
    draggableEl.ondragstart = () => false;
    if (!dragDisabled) {
        draggableEl.style.userSelect = "none";
        draggableEl.style.WebkitUserSelect = "none";
        draggableEl.style.cursor = cursorStyle;
    } else {
        draggableEl.style.userSelect = "";
        draggableEl.style.WebkitUserSelect = "";
        draggableEl.style.cursor = "";
    }
}

/**
 * Hides the provided element so that it can stay in the dom without interrupting
 * @param {HTMLElement} dragTarget
 */
export function hideElement(dragTarget) {
    dragTarget.style.display = "none";
    dragTarget.style.position = "fixed";
    dragTarget.style.zIndex = "-5";
}

/**
 * styles the shadow element
 * @param {HTMLElement} shadowEl
 */
export function decorateShadowEl(shadowEl) {
    shadowEl.style.visibility = "hidden";
    shadowEl.setAttribute(SHADOW_ELEMENT_ATTRIBUTE_NAME, "true");
}

/**
 * undo the styles the shadow element
 * @param {HTMLElement} shadowEl
 */
export function unDecorateShadowElement(shadowEl) {
    shadowEl.style.visibility = "";
    shadowEl.removeAttribute(SHADOW_ELEMENT_ATTRIBUTE_NAME);
}

/**
 * will mark the given dropzones as visually active
 * @param {Array<HTMLElement>} dropZones
 * @param {Function} getStyles - maps a dropzone to a styles object (so the styles can be removed)
 * @param {Function} getClasses - maps a dropzone to a classList
 */
export function styleActiveDropZones(dropZones, getStyles = () => {}, getClasses = () => []) {
    dropZones.forEach(dz => {
        const styles = getStyles(dz);
        Object.keys(styles).forEach(style => {
            dz.style[style] = styles[style];
        });
        getClasses(dz).forEach(c => dz.classList.add(c));
    });
}

/**
 * will remove the 'active' styling from given dropzones
 * @param {Array<HTMLElement>} dropZones
 * @param {Function} getStyles - maps a dropzone to a styles object
 * @param {Function} getClasses - maps a dropzone to a classList
 */
export function styleInactiveDropZones(dropZones, getStyles = () => {}, getClasses = () => []) {
    dropZones.forEach(dz => {
        const styles = getStyles(dz);
        Object.keys(styles).forEach(style => {
            dz.style[style] = "";
        });
        getClasses(dz).forEach(c => dz.classList.contains(c) && dz.classList.remove(c));
    });
}

/**
 * will prevent the provided element from shrinking by setting its minWidth and minHeight to the current width and height values
 * @param {HTMLElement} el
 * @return {function(): void} - run this function to undo the operation and restore the original values
 */
export function preventShrinking(el) {
    const originalMinHeight = el.style.minHeight;
    el.style.minHeight = window.getComputedStyle(el).getPropertyValue("height");
    const originalMinWidth = el.style.minWidth;
    el.style.minWidth = window.getComputedStyle(el).getPropertyValue("width");
    return function undo() {
        el.style.minHeight = originalMinHeight;
        el.style.minWidth = originalMinWidth;
    };
}
