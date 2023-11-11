// This is based off https://stackoverflow.com/questions/27745438/how-to-compute-getboundingclientrect-without-considering-transforms/57876601#57876601
// It removes the transforms that are potentially applied by the flip animations
/**
 * Gets the bounding rect but removes transforms (ex: flip animation)
 * @param {HTMLElement} el
 * @return {{top: number, left: number, bottom: number, right: number}}
 */
export function getBoundingRectNoTransforms(el) {
    let ta;
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    const tx = style.transform;

    if (tx) {
        let sx, sy, dx, dy;
        if (tx.startsWith("matrix3d(")) {
            ta = tx.slice(9, -1).split(/, /);
            sx = +ta[0];
            sy = +ta[5];
            dx = +ta[12];
            dy = +ta[13];
        } else if (tx.startsWith("matrix(")) {
            ta = tx.slice(7, -1).split(/, /);
            sx = +ta[0];
            sy = +ta[3];
            dx = +ta[4];
            dy = +ta[5];
        } else {
            return rect;
        }

        const to = style.transformOrigin;
        const x = rect.x - dx - (1 - sx) * parseFloat(to);
        const y = rect.y - dy - (1 - sy) * parseFloat(to.slice(to.indexOf(" ") + 1));
        const w = sx ? rect.width / sx : el.offsetWidth;
        const h = sy ? rect.height / sy : el.offsetHeight;
        return {
            x: x,
            y: y,
            width: w,
            height: h,
            top: y,
            right: x + w,
            bottom: y + h,
            left: x
        };
    } else {
        return rect;
    }
}

/**
 * Gets the absolute bounding rect (accounts for the window's scroll position and removes transforms)
 * @param {HTMLElement} el
 * @return {{top: number, left: number, bottom: number, right: number}}
 */
export function getAbsoluteRectNoTransforms(el) {
    const rect = getBoundingRectNoTransforms(el);
    return {
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        right: rect.right + window.scrollX
    };
}

/**
 * Gets the absolute bounding rect (accounts for the window's scroll position)
 * @param {HTMLElement} el
 * @return {{top: number, left: number, bottom: number, right: number}}
 */
export function getAbsoluteRect(el) {
    const rect = el.getBoundingClientRect();
    return {
        top: rect.top + window.scrollY,
        bottom: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        right: rect.right + window.scrollX
    };
}

/**
 * finds the center :)
 * @typedef {Object} Rect
 * @property {number} top
 * @property {number} bottom
 * @property {number} left
 * @property {number} right
 * @param {Rect} rect
 * @return {{x: number, y: number}}
 */
export function findCenter(rect) {
    return {
        x: (rect.left + rect.right) / 2,
        y: (rect.top + rect.bottom) / 2
    };
}

/**
 * @typedef {Object} Point
 * @property {number} x
 * @property {number} y
 * @param {Point} pointA
 * @param {Point} pointB
 * @return {number}
 */
function calcDistance(pointA, pointB) {
    return Math.sqrt(Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2));
}

/**
 * @param {Point} point
 * @param {Rect} rect
 * @return {boolean|boolean}
 */
export function isPointInsideRect(point, rect) {
    return point.y <= rect.bottom && point.y >= rect.top && point.x >= rect.left && point.x <= rect.right;
}

/**
 * find the absolute coordinates of the center of a dom element
 * @param el {HTMLElement}
 * @returns {{x: number, y: number}}
 */
export function findCenterOfElement(el) {
    return findCenter(getAbsoluteRect(el));
}

/**
 * @param {HTMLElement} elA
 * @param {HTMLElement} elB
 * @return {boolean}
 */
export function isCenterOfAInsideB(elA, elB) {
    const centerOfA = findCenterOfElement(elA);
    const rectOfB = getAbsoluteRectNoTransforms(elB);
    return isPointInsideRect(centerOfA, rectOfB);
}

/**
 * @param {HTMLElement|ChildNode} elA
 * @param {HTMLElement|ChildNode} elB
 * @return {number}
 */
export function calcDistanceBetweenCenters(elA, elB) {
    const centerOfA = findCenterOfElement(elA);
    const centerOfB = findCenterOfElement(elB);
    return calcDistance(centerOfA, centerOfB);
}

/**
 * @param {HTMLElement} el - the element to check
 * @returns {boolean} - true if the element in its entirety is off screen including the scrollable area (the normal dom events look at the mouse rather than the element)
 */
export function isElementOffDocument(el) {
    const rect = getAbsoluteRect(el);
    return rect.right < 0 || rect.left > document.documentElement.scrollWidth || rect.bottom < 0 || rect.top > document.documentElement.scrollHeight;
}

/**
 * If the point is inside the element returns its distances from the sides, otherwise returns null
 * @param {Point} point
 * @param {HTMLElement} el
 * @return {null|{top: number, left: number, bottom: number, right: number}}
 */
export function calcInnerDistancesBetweenPointAndSidesOfElement(point, el) {
    const rect = getAbsoluteRect(el);
    if (!isPointInsideRect(point, rect)) {
        return null;
    }
    return {
        top: point.y - rect.top,
        bottom: rect.bottom - point.y,
        left: point.x - rect.left,
        // TODO - figure out what is so special about right (why the rect is too big)
        right: Math.min(rect.right, document.documentElement.clientWidth) - point.x
    };
}
