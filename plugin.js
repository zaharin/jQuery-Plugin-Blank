(function($) {
    var pluginName = 'plugin';
    var defaults = {};

    function Plugin(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options) ;
        this._name = pluginName;
        this._init();
    }

    Plugin.prototype._init = function() {
    };

    function isMethod(method) {
        return typeof method === 'string' && method[0] !== '_';
    }

    function isMethodExists(instance, method) {
        return instance instanceof Plugin && typeof instance[method] === 'function';
    }

    function isOptions(options) {
        return typeof options === 'undefined' || typeof options === 'object';
    }

    function getInstance(elem) {
        return $.data(elem, 'plugin_' + pluginName);
    }

    function newInstance(elem, options) {
        return $.data(elem, 'plugin_' + pluginName, new Plugin(this, options));
    }

    function removeInstance(elem) {
        $.data(elem, 'plugin_' + pluginName, null);
    }

    $.fn[pluginName] = function(options) {
        if (isOptions(options)) {
            return this.each(function() {
                if (!getInstance(this)) newInstance(this, options);
            });
        } else if (isMethod(options)) {
            var results;
            this.each(function() {
                var instance = getInstance(this);

                if (isMethodExists(instance, options)) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    results = instance[options].apply(instance, args);
                }

                if (options === 'destroy') removeInstance(this);
            });

            return results !== undefined ? results : this;
        }
    };
})(jQuery);