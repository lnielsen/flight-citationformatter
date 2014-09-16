define(function(require) {
    'use strict';

    /**
     * Module dependencies
     */
    var defineComponent = require('flight/lib/component');

    /**
     * Module exports
     */
    return defineComponent(citationformatter);

    /**
     * Module function
     */
    function citationformatter() {
        this.attributes({
            stylesSelector: '.styles',
            citationSelector: '.citation',
            lang: 'en-US',
            apiUrl: '/citeproc/format'
        });

        /**
         * Internal methods
         */
        this.formatDoi = function(doi_val, style_val) {
            var component = this;

            $.ajax({
                type: 'GET',
                url: this.attr.apiUrl,
                dataType: "text",
                data: {
                    doi: doi_val,
                    style: style_val,
                    lang: this.attr.lang
                },
                success: function(data){
                    component.trigger("citationChanged", {citation: data});
                }
            });
        };

        /**
         * Event handler
         */
        this.onSelectStyle = function() {
            this.formatDoi(
                this.$node.data('doi'),
                this.select('stylesSelector').val()
            );
        }

        this.onCitationChanged = function(e, payload) {
            this.select('citationSelector').text(payload.citation);
        }

        /**
         * Initialize component
         */
        this.after('initialize', function() {
            this.on(
                this.attr.stylesSelector,
                'change',
                this.onSelectStyle
            );

            this.on(
                'citationChanged',
                this.onCitationChanged
            );
        });
    }
});
