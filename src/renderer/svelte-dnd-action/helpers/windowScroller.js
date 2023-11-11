import {makeScroller} from "./scroller";
import {printDebug} from "../constants";
import {resetIndexesCache} from "./listUtil";

const INTERVAL_MS = 300;
let mousePosition;

/**
 * Do not use this! it is visible for testing only until we get over the issue Cypress not triggering the mousemove listeners
 * // TODO - make private (remove export)
 * @param {{clientX: number, clientY: number}} e
 */
export function updateMousePosition(e) {
    const c = e.touches ? e.touches[0] : e;
    mousePosition = {x: c.clientX, y: c.clientY};
}
const {scrollIfNeeded, resetScrolling} = makeScroller();
let next;

function loop() {
    if (mousePosition) {
        const scrolled = scrollIfNeeded(mousePosition, document.documentElement);
        if (scrolled) resetIndexesCache();
    }
    next = window.setTimeout(loop, INTERVAL_MS);
}

/**
 * will start watching the mouse pointer and scroll the window if it goes next to the edges
 */
export function armWindowScroller() {
    printDebug(() => "arming window scroller");
    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("touchmove", updateMousePosition);
    loop();
}

/**
 * will stop watching the mouse pointer and won't scroll the window anymore
 */
export function disarmWindowScroller() {
    printDebug(() => "disarming window scroller");
    window.removeEventListener("mousemove", updateMousePosition);
    window.removeEventListener("touchmove", updateMousePosition);
    mousePosition = undefined;
    window.clearTimeout(next);
    resetScrolling();
}
