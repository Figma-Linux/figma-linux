import {isCenterOfAInsideB, calcDistanceBetweenCenters, getAbsoluteRectNoTransforms, isPointInsideRect, findCenterOfElement} from "./intersection";
import {printDebug, SHADOW_ELEMENT_ATTRIBUTE_NAME} from "../constants";

let dzToShadowIndexToRect;

/**
 * Resets the cache that allows for smarter "would be index" resolution. Should be called after every drag operation
 */
export function resetIndexesCache() {
    printDebug(() => "resetting indexes cache");
    dzToShadowIndexToRect = new Map();
}
resetIndexesCache();

/**
 * Resets the cache that allows for smarter "would be index" resolution for a specific dropzone, should be called after the zone was scrolled
 * @param {HTMLElement} dz
 */
export function resetIndexesCacheForDz(dz) {
    printDebug(() => "resetting indexes cache for dz");
    dzToShadowIndexToRect.delete(dz);
}

/**
 * Caches the coordinates of the shadow element when it's in a certain index in a certain dropzone.
 * Helpful in order to determine "would be index" more effectively
 * @param {HTMLElement} dz
 * @return {number} - the shadow element index
 */
function cacheShadowRect(dz) {
    const shadowElIndex = Array.from(dz.children).findIndex(child => child.getAttribute(SHADOW_ELEMENT_ATTRIBUTE_NAME));
    if (shadowElIndex >= 0) {
        if (!dzToShadowIndexToRect.has(dz)) {
            dzToShadowIndexToRect.set(dz, new Map());
        }
        dzToShadowIndexToRect.get(dz).set(shadowElIndex, getAbsoluteRectNoTransforms(dz.children[shadowElIndex]));
        return shadowElIndex;
    }
    return undefined;
}

/**
 * @typedef {Object} Index
 * @property {number} index - the would be index
 * @property {boolean} isProximityBased - false if the element is actually over the index, true if it is not over it but this index is the closest
 */
/**
 * Find the index for the dragged element in the list it is dragged over
 * @param {HTMLElement} floatingAboveEl
 * @param {HTMLElement} collectionBelowEl
 * @returns {Index|null} -  if the element is over the container the Index object otherwise null
 */
export function findWouldBeIndex(floatingAboveEl, collectionBelowEl) {
    if (!isCenterOfAInsideB(floatingAboveEl, collectionBelowEl)) {
        return null;
    }
    const children = collectionBelowEl.children;
    // the container is empty, floating element should be the first
    if (children.length === 0) {
        return {index: 0, isProximityBased: true};
    }
    const shadowElIndex = cacheShadowRect(collectionBelowEl);

    // the search could be more efficient but keeping it simple for now
    // a possible improvement: pass in the lastIndex it was found in and check there first, then expand from there
    for (let i = 0; i < children.length; i++) {
        if (isCenterOfAInsideB(floatingAboveEl, children[i])) {
            const cachedShadowRect = dzToShadowIndexToRect.has(collectionBelowEl) && dzToShadowIndexToRect.get(collectionBelowEl).get(i);
            if (cachedShadowRect) {
                if (!isPointInsideRect(findCenterOfElement(floatingAboveEl), cachedShadowRect)) {
                    return {index: shadowElIndex, isProximityBased: false};
                }
            }
            return {index: i, isProximityBased: false};
        }
    }
    // this can happen if there is space around the children so the floating element has
    //entered the container but not any of the children, in this case we will find the nearest child
    let minDistanceSoFar = Number.MAX_VALUE;
    let indexOfMin = undefined;
    // we are checking all of them because we don't know whether we are dealing with a horizontal or vertical container and where the floating element entered from
    for (let i = 0; i < children.length; i++) {
        const distance = calcDistanceBetweenCenters(floatingAboveEl, children[i]);
        if (distance < minDistanceSoFar) {
            minDistanceSoFar = distance;
            indexOfMin = i;
        }
    }
    return {index: indexOfMin, isProximityBased: true};
}
