import {isOnServer} from "../constants";

const INSTRUCTION_IDs = {
    DND_ZONE_ACTIVE: "dnd-zone-active",
    DND_ZONE_DRAG_DISABLED: "dnd-zone-drag-disabled"
};
const ID_TO_INSTRUCTION = {
    [INSTRUCTION_IDs.DND_ZONE_ACTIVE]: "Tab to one the items and press space-bar or enter to start dragging it",
    [INSTRUCTION_IDs.DND_ZONE_DRAG_DISABLED]: "This is a disabled drag and drop list"
};

const ALERT_DIV_ID = "dnd-action-aria-alert";
let alertsDiv;

function initAriaOnBrowser() {
    if (alertsDiv) {
        // it is already initialized
        return;
    }
    // setting the dynamic alerts
    alertsDiv = document.createElement("div");
    (function initAlertsDiv() {
        alertsDiv.id = ALERT_DIV_ID;
        // tab index -1 makes the alert be read twice on chrome for some reason
        //alertsDiv.tabIndex = -1;
        alertsDiv.style.position = "fixed";
        alertsDiv.style.bottom = "0";
        alertsDiv.style.left = "0";
        alertsDiv.style.zIndex = "-5";
        alertsDiv.style.opacity = "0";
        alertsDiv.style.height = "0";
        alertsDiv.style.width = "0";
        alertsDiv.setAttribute("role", "alert");
    })();
    document.body.prepend(alertsDiv);

    // setting the instructions
    Object.entries(ID_TO_INSTRUCTION).forEach(([id, txt]) => document.body.prepend(instructionToHiddenDiv(id, txt)));
}

/**
 * Initializes the static aria instructions so they can be attached to zones
 * @return {{DND_ZONE_ACTIVE: string, DND_ZONE_DRAG_DISABLED: string} | null} - the IDs for static aria instruction (to be used via aria-describedby) or null on the server
 */
export function initAria() {
    if (isOnServer) return null;
    if (document.readyState === "complete") {
        initAriaOnBrowser();
    } else {
        window.addEventListener("DOMContentLoaded", initAriaOnBrowser);
    }
    return {...INSTRUCTION_IDs};
}

/**
 * Removes all the artifacts (dom elements) added by this module
 */
export function destroyAria() {
    if (isOnServer || !alertsDiv) return;
    Object.keys(ID_TO_INSTRUCTION).forEach(id => document.getElementById(id)?.remove());
    alertsDiv.remove();
    alertsDiv = undefined;
}

function instructionToHiddenDiv(id, txt) {
    const div = document.createElement("div");
    div.id = id;
    div.innerHTML = `<p>${txt}</p>`;
    div.style.display = "none";
    div.style.position = "fixed";
    div.style.zIndex = "-5";
    return div;
}

/**
 * Will make the screen reader alert the provided text to the user
 * @param {string} txt
 */
export function alertToScreenReader(txt) {
    if (isOnServer) return;
    if (!alertsDiv) {
        initAriaOnBrowser();
    }
    alertsDiv.innerHTML = "";
    const alertText = document.createTextNode(txt);
    alertsDiv.appendChild(alertText);
    // this is needed for Safari
    alertsDiv.style.display = "none";
    alertsDiv.style.display = "inline";
}
