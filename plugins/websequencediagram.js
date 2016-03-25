/**
 * @module jsdoc-plugin/websequencediagram
 * @author Grant G
 */
'use strict';

var TAG = "{sequence}";
var wsd = null;

/**
 * JsDoc Handler implementation
 *
 * {sequence}
 * JSDoc -> Plugin: parse description
 * Plugin -> websequencediagram.com: request
 * websequencediagram.com -> Plugin: PNG Image
 * Plugin -> JSDoc: base64 img-tag in description
 * {sequence}
 *
 * @type {Object}
 */
exports.handlers = {
  newDoclet: function(e) {
      var idx, endIdx, descBody, seqBody;
      if (e.doclet.description &&
          (idx = e.doclet.description.indexOf(TAG)) >= 0)  {
          descBody = e.doclet.description;
          endIdx = descBody.indexOf("{sequence}", idx + TAG.length);
          if (endIdx < 0) endIdx = descBody.length;
          seqBody = descBody.substring(idx + TAG.length, endIdx);
          if (!wsd) wsd = require('websequencediagrams');
          var diagDone;
          wsd.diagram(seqBody, "modern-blue", "png", function(err, buf, typ) {
              if (err) {
                  console.error(err);
              } else {
                  e.doclet.description = descBody.substring(0, idx) +
                    '<img src="data:' + typ + ';base64,' +
                    buf.toString("base64") +
                    '"/>' +
                    descBody.substring(endIdx, descBody.length);
              }
              diagDone = true;
          });
          // TODO: Is there a better way to to synchronize in JSdoc plugins?
          while (diagDone === undefined) {
            require('deasync').sleep(100);
          }
      }
  }
};
