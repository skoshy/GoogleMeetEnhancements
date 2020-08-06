// ==UserScript==
// @name         Google Meet Enhancements
// @namespace    https://skoshy.com
// @version      0.1.1
// @description  Makes self view larger on Google Meet
// @author       Stefan K.
// @match        https://meet.google.com/*
// @updateURL    https://github.com/skoshy/GoogleMeetEnhancements/raw/master/userscript.user.js
// @grant        none
// ==/UserScript==

(function() {
  "use strict";

  const scriptId = "meet-larger-self-display";


  const selfViewSelector = `[aria-label="Chat with everyone"] ~ div[jsmodel]`;

  function log(...toLog) {
    console.log(`[${scriptId}]:`, ...toLog);
  }

  function setAndGetNodeId(node) {
    const nodeIdString = `${scriptId}-id`;

    let nodeId = node.getAttribute(nodeIdString);
    let hadNodeIdSet = true;

    log("new node found", { nodeId, hadNodeIdSet, node });

    if (!nodeId) {
      hadNodeIdSet = false;
      nodeId = Math.random().toString();
      node.setAttribute(nodeIdString, nodeId);
    }

    return { nodeId, hadNodeIdSet };
  }

  function addedNodeHandler(node) {
    if (!node.matches || !node.matches(selfViewSelector)) {
      return;
    }

    const { nodeId, hadNodeIdSet } = setAndGetNodeId(node);

    if (!hadNodeIdSet) {
      // this is a new element

      node.style.zoom = 2.5;
      node.style.fontSize = '8px';
    }
  }

  const bodyObserver = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(addedNode => {
        addedNodeHandler(addedNode);

        // it might be text node or comment node which don't have querySelectorAll
        addedNode.querySelectorAll &&
          addedNode.querySelectorAll(selfViewSelector).forEach(addedNodeHandler);
      });
    });
  });

  bodyObserver.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true
  });
})();
