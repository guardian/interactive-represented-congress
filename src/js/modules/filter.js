var settings = {};

module.exports =  {
    init: function() {
        this.setSettings();
        this.bindings();
    },

    bindings: function() {
        $('.uit-filter').click(function(e) {
            this.filterBy(e.currentTarget);
        }.bind(this));
    },

    filterBy: function(target) {
        var $target = $(target);

        if ($target.hasClass('is-selected')) {
            $target.removeClass('is-selected');
        } else {
            $target.parent().find('.is-selected').removeClass('is-selected');
            $target.addClass('is-selected');
        }

        this.setSettings();
    },

    setSettings: function() {
        $('.uit-filter-set').each(function(i, el) {
            var settingName = $(el).data('set');
            var selected = $(el).find('.is-selected').text();

            settings[settingName] = selected;
        }.bind(this));

        this.filterStates();
    },

    filterStates: function() {
        $('.is-filtered').removeClass('is-filtered');
        $('.uit-map path').each(function(i, el) {

            for (var i in settings) {
                if ($(el) && $(el)[0].hasAttribute('data-' + i)) {
                    if (settings[i] !== "" && settings[i] !== $(el).data(i)) {
                        $(el).addClass('is-filtered');
                    }
                } else {
                    // this can be removed when data is complete
                    $(el).addClass('is-filtered');
                }
            }
        }.bind(this));

        this.updateCount();
    },

    updateCount: function() {
        var count = 537 - ($('.is-filtered').length + 1);

        $('.uit-count__count').text(count);
    }
};