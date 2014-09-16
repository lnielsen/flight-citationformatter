'use strict';

describeComponent('lib/citationformatter', function() {

    // Initialize the component and attach it to the DOM
    beforeEach(function() {
        jasmine.Ajax.install();
        setupComponent(
            '<div id="citationformatter" data-doi="10.1234/foo.bar">' +
            '<span class="citation"></span>' +
            '<select class="styles">' +
            '<option value="apa">apa</option>' +
            '<option value="nature">nature</option>' +
            '</select></div>');
    });

    afterEach(function() {
        jasmine.Ajax.uninstall();
    });

    it('should be defined', function() {
        expect(this.component).toBeDefined();
        expect(this.component.$node).toHaveId('citationformatter');
        expect(this.component.$node.data('doi')).toEqual('10.1234/foo.bar');
        expect(this.component.$node.find('.citation')).toBeDefined();
        expect(this.component.$node.find('.styles')).toBeDefined();
    });

    it('should set attr.stylesSelector', function() {
        this.setupComponent({
            stylesSelector: '.citation-styles-selector'
        });
        expect(this.component.attr.stylesSelector).toEqual(
            '.citation-styles-selector');
    });

    it('should update .citation on citationChanged', function() {
        this.component.trigger('citationChanged', {
            citation: 'this is a citation'
        });

        expect(this.component.select('citationSelector').html()).toEqual(
            'this is a citation');
    });

    it('should make ajax request using data-doi and style', function() {
        var $styles = this.component.select('stylesSelector'),
            $citation = this.component.select('citationSelector');

        $styles.trigger('change');

        var request = jasmine.Ajax.requests.mostRecent();
        expect(request.url).toBe('/citeproc/format?doi=10.1234%2Ffoo.bar&style=apa&lang=en-US');
        expect(request.method).toBe('GET');

        // Fake response
        request.response({
            status: 200,
            responseText: 'mycitation'
        })
        expect($citation.html()).toEqual("mycitation");
    });
});
