/**
 * IFrame Message Routing Utility.
 * Author: Julien Lecomte <jlecomte@yahoo-inc.com>
 * Copyright (c) 2007, Yahoo! Inc. All rights reserved.
 * Code licensed under the BSD License:
 *     http://developer.yahoo.net/yui/license.txt
 *
 * @requires yahoo, event
 * @namespace YAHOO.util
 * @title IFrame Message Routing Utility
 */

/**
 * The CrossFrame singleton allows iframes to safely communicate even
 * if they are on different domains. This utility requires a proxy HTML
 * file (proxy.html)
 *
 * @class CrossFrame
 */
YAHOO.util.CrossFrame = (function () {

    var r1 = /^(((top|parent|frames\[((['"][a-zA-Z\d-_]*['"])|\d+)\]))(\.|$))+/;
    var r2 = /top|parent|frames\[(?:(?:['"][a-zA-Z]*['"])|\d+)\]/;

    function parseQueryString(s) {

        var r, a, p;

        r = {};
        a = s.split('&');
        for (i = 0; i < a.length; i++) {
            p = a[i].split('=');
            if (p.length === 2 && p[0].length > 0) {
                r[p[0]] = unescape(p[1]);
            }
        }

        return r;
    }

    if (YAHOO.env.ua.opera) {

        // Opera does not allow reading any property (including parent, frames)
        // if the domain of the caller and the domain of the target window do
        // not match. We work around this by chaining calls, and using Opera's
        // postMessage function...
        document.addEventListener("message", function (evt) {
            var o = parseQueryString(evt.data);
            if (YAHOO.lang.hasOwnProperty(o, "target") &&
                    YAHOO.lang.hasOwnProperty(o, "message") &&
                    YAHOO.lang.hasOwnProperty(o, "domain") &&
                    YAHOO.lang.hasOwnProperty(o, "uri")) {
                if (o.target.length > 0) {
                    // Send the message to the next document in the chain.
                    YAHOO.util.CrossFrame.send(null, o.target, o.message, o.domain, o.uri);
                } else {
                    // Let the application know a message has been received.
                    YAHOO.util.CrossFrame.onMessageEvent.fire(o.message, o.domain, o.uri);
                }
            }
        }, false);

    }

    return {

        /**
         * Fired when a message is received.
         *
         * @event onMessageEvent
         */
        onMessageEvent: new YAHOO.util.CustomEvent("onMessage"),

        /**
         * Sends a message to an iframe, using the specified proxy.
         *
         * @method send
         * @param {string} proxy Complete path to the proxy file.
         * @param {string} target Target iframe e.g: parent.frames["foo"]
         * @param {string} message The message to send.
         */
        send: function (proxy, target, message) {

            var m, t, d, u, s, el;

            // Match things like parent.frames["aaa"].top.frames[0].frames['bbb']
            if (!r1.test(target)) {
                throw new Error("Invalid target: " + target);
            }

            if (YAHOO.env.ua.opera) {

                // Opera is the only A-grade browser that does not allow
                // reading properties like parent.frames when this document and
                // its parent are on separate domains. The solution is to use
                // the parent as a "hub" to route messages to the appropriate
                // IFrame, and use the Opera's postMessage function...

                m = r2.exec(target);
                // safe to eval...
                t = eval(m[0]).document;

                // Remove one element from the target chain.
                target = target.substr(m[0].length + 1);

                // Compose the message...
                d = arguments.length > 3 ? arguments[3] : document.domain;
                u = arguments.length > 4 ? arguments[4] : location.href;
                s = "target=" + escape(target) +
                    "&message=" + escape(message) +
                    "&domain=" + escape(d) +
                    "&uri=" + escape(u);

                // ...and send it!
                t.postMessage(s);

            } else {

                // Create a new hidden iframe.
                el = document.createElement("iframe");
                el.style.position = "absolute";
                el.style.visibility = "hidden";
                el.style.top = el.style.left = "0";
                el.style.width = el.style.height = "0";
                document.body.appendChild(el);

                // Listen for the onload event.
                YAHOO.util.Event.addListener(el, "load", function () {
                    // First, remove the event listener or the iframe
                    // we intend to discard will not be freed...
                    YAHOO.util.Event.removeListener(this, "load", arguments.callee);
                    // Discard the iframe...
                    setTimeout(function () {
                        document.body.removeChild(el);
                    }, 1000);
                });

                // Compose the message...
                s = "target=" + escape(target) +
                    "&message=" + escape(message) +
                    "&domain=" + escape(document.domain) +
                    "&uri=" + escape(location.href);

                // Set its src first...
                el.src = proxy + "#" + s;

                // ...and then append it to the body of the document.
                document.body.appendChild(el);
            }
        }
    };

})();