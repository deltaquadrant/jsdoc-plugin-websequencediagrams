# JSDoc3 plugin for websequencediagrams


Comment format:

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
     */


Test command:

    jsdoc -c test/jsdoc-config.json plugins/websequencediagram.js
