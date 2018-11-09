module.exports =  {
    init: function() {
        this.setMapDelay();
    },

    setMapDelay: function() {
        var width = $('.uit-map').width();

        $('.uit-map path').each(function(i, el) {
            var y = $(el)[0].getBBox().x;

            $(el).css({
                transitionDelay: ((y / 626).toFixed(2) / 2) + 's'
            })

        }.bind(this));
    }
};
