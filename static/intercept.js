var s = document.createElement("script");
s.src = chrome.runtime.getURL("override.js");
(document.head || document.documentElement).appendChild(s);