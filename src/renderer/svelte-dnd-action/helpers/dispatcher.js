// external events
const FINALIZE_EVENT_NAME = "finalize";
const CONSIDER_EVENT_NAME = "consider";

/**
 * @typedef {Object} Info
 * @property {string} trigger
 * @property {string} id
 * @property {string} source
 * @param {Node} el
 * @param {Array} items
 * @param {Info} info
 */
export function dispatchFinalizeEvent(el, items, info) {
    el.dispatchEvent(
        new CustomEvent(FINALIZE_EVENT_NAME, {
            detail: {items, info}
        })
    );
}

/**
 * Dispatches a consider event
 * @param {Node} el
 * @param {Array} items
 * @param {Info} info
 */
export function dispatchConsiderEvent(el, items, info) {
    el.dispatchEvent(
        new CustomEvent(CONSIDER_EVENT_NAME, {
            detail: {items, info}
        })
    );
}

// internal events
export const DRAGGED_ENTERED_EVENT_NAME = "draggedEntered";
export const DRAGGED_LEFT_EVENT_NAME = "draggedLeft";
export const DRAGGED_OVER_INDEX_EVENT_NAME = "draggedOverIndex";
export const DRAGGED_LEFT_DOCUMENT_EVENT_NAME = "draggedLeftDocument";

export const DRAGGED_LEFT_TYPES = {
    LEFT_FOR_ANOTHER: "leftForAnother",
    OUTSIDE_OF_ANY: "outsideOfAny"
};

export function dispatchDraggedElementEnteredContainer(containerEl, indexObj, draggedEl) {
    containerEl.dispatchEvent(
        new CustomEvent(DRAGGED_ENTERED_EVENT_NAME, {
            detail: {indexObj, draggedEl}
        })
    );
}

/**
 * @param containerEl - the dropzone the element left
 * @param draggedEl - the dragged element
 * @param theOtherDz - the new dropzone the element entered
 */
export function dispatchDraggedElementLeftContainerForAnother(containerEl, draggedEl, theOtherDz) {
    containerEl.dispatchEvent(
        new CustomEvent(DRAGGED_LEFT_EVENT_NAME, {
            detail: {draggedEl, type: DRAGGED_LEFT_TYPES.LEFT_FOR_ANOTHER, theOtherDz}
        })
    );
}

export function dispatchDraggedElementLeftContainerForNone(containerEl, draggedEl) {
    containerEl.dispatchEvent(
        new CustomEvent(DRAGGED_LEFT_EVENT_NAME, {
            detail: {draggedEl, type: DRAGGED_LEFT_TYPES.OUTSIDE_OF_ANY}
        })
    );
}
export function dispatchDraggedElementIsOverIndex(containerEl, indexObj, draggedEl) {
    containerEl.dispatchEvent(
        new CustomEvent(DRAGGED_OVER_INDEX_EVENT_NAME, {
            detail: {indexObj, draggedEl}
        })
    );
}
export function dispatchDraggedLeftDocument(draggedEl) {
    window.dispatchEvent(
        new CustomEvent(DRAGGED_LEFT_DOCUMENT_EVENT_NAME, {
            detail: {draggedEl}
        })
    );
}
