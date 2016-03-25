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
var sequenceInflight = 0;

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
          sequenceInflight++;
          // TODO: cache sequences already processed
          wsd.diagram(seqBody, "modern-blue", "png", function(err, buf, typ) {
              if (err) {
                  console.log(seqBody);
                  console.error(err);
              } else {
                  e.doclet.description = descBody.substring(0, idx) +
                    '<img src="data:' + typ + ';base64,' +
                    buf.toString("base64") +
                    '"/>' +
                    descBody.substring(endIdx + TAG.length, descBody.length);
              }
              sequenceInflight--;
          });
      }
  },

  processingComplete : function(e) {
    if (sequenceInflight > 0) {
      // TODO: Is there a better way to to synchronize in JSdoc plugins?
      require('deasync').loopWhile(function(){ return sequenceInflight > 0; });
    }
  }
};
