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

    setSettings: function() {
        $('.uit-filter-set').each(function(i, el) {
            var settingName = $(el).data('set');
            var selected = $(el).find('.is-selected').text();

            

            settings[settingName] = selected;
        }.bind(this));

        console.log(settings);
    },

    filterBy: function(target) {
        var $target = $(target);
        $target.parent().find('.is-selected').removeClass('is-selected');
        $target.addClass('is-selected');

        this.setSettings();
    }
};
