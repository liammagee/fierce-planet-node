var FiercePlanet = FiercePlanet || {};


/**
 * @namespace Contains graph functions
 */
FiercePlanet.Slider = FiercePlanet.Slider || {};

(function() {

    /**
     * Sets up an augmented slider
     */
    this.createSlider = function (valueComponent, min, max, step, value) {
        var uiComponent = valueComponent + 'Slider';
        if (! $('#' + uiComponent)[0]) {
            $('#' + valueComponent).before('<div class="slider-container"><div id="' + uiComponent + '" class="param-slider"></div></div>');
            $('#' + uiComponent).slider({
                value: value, min: min, max: max, step: step,
                slide: function( event, ui ) {
                    $('#' + valueComponent).val( ui.value );
                    $('#' + uiComponent + " .ui-slider-handle").text(ui.value);
                }
            });
            $('#' + uiComponent + " .ui-slider-handle").css("text-decoration", "none").css("text-align", "center").css("width", "2.4em").text(value);
            $('#' + uiComponent).before('<span class="min-slider">' + min + '</span>')
            $('#' + uiComponent).after('<span class="max-slider">' + max + '</span>')
        }
    };

}).apply(FiercePlanet.Slider);
