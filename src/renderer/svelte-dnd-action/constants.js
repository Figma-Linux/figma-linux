import {DRAGGED_ENTERED_EVENT_NAME, DRAGGED_LEFT_EVENT_NAME, DRAGGED_OVER_INDEX_EVENT_NAME} from "./helpers/dispatcher";

export const TRIGGERS = {
    DRAG_STARTED: "dragStarted",
    DRAGGED_ENTERED: DRAGGED_ENTERED_EVENT_NAME,
    DRAGGED_ENTERED_ANOTHER: "dragEnteredAnother",
    DRAGGED_OVER_INDEX: DRAGGED_OVER_INDEX_EVENT_NAME,
    DRAGGED_LEFT: DRAGGED_LEFT_EVENT_NAME,
    DRAGGED_LEFT_ALL: "draggedLeftAll",
    DROPPED_INTO_ZONE: "droppedIntoZone",
    DROPPED_INTO_ANOTHER: "droppedIntoAnother",
    DROPPED_OUTSIDE_OF_ANY: "droppedOutsideOfAny",
    DRAG_STOPPED: "dragStopped"
};

export const SOURCES = {
    POINTER: "pointer",
    KEYBOARD: "keyboard"
};

export const SHADOW_ITEM_MARKER_PROPERTY_NAME = "isDndShadowItem";
export const SHADOW_ELEMENT_ATTRIBUTE_NAME = "data-is-dnd-shadow-item";
export const SHADOW_PLACEHOLDER_ITEM_ID = "id:dnd-shadow-placeholder-0000";
export const DRAGGED_ELEMENT_ID = "dnd-action-dragged-el";

export let ITEM_ID_KEY = "id";
let activeDndZoneCount = 0;
export function incrementActiveDropZoneCount() {
    activeDndZoneCount++;
}
export function decrementActiveDropZoneCount() {
    if (activeDndZoneCount === 0) {
        throw new Error("Bug! trying to decrement when there are no dropzones");
    }
    activeDndZoneCount--;
}

/**
 * Allows using another key instead of "id" in the items data. This is global and applies to all dndzones.
 * Has to be called when there are no rendered dndzones whatsoever.
 * @param {String} newKeyName
 * @throws {Error} if it was called when there are rendered dndzones or if it is given the wrong type (not a string)
 */
export function overrideItemIdKeyNameBeforeInitialisingDndZones(newKeyName) {
    if (activeDndZoneCount > 0) {
        throw new Error("can only override the id key before initialising any dndzone");
    }
    if (typeof newKeyName !== "string") {
        throw new Error("item id key has to be a string");
    }
    printDebug(() => ["overriding item id key name", newKeyName]);
    ITEM_ID_KEY = newKeyName;
}

export const isOnServer = typeof window === "undefined";

export let printDebug = () => {};

/**
 * Allows the user to show/hide console debug output
 * * @param {Boolean} isDebug
 */
export function setDebugMode(isDebug) {
    if (isDebug) {
        printDebug = (generateMessage, logFunction = console.debug) => {
            const message = generateMessage();
            if (Array.isArray(message)) {
                logFunction(...message);
            } else {
                logFunction(message);
            }
        };
    } else {
        printDebug = () => {};
    }
}
