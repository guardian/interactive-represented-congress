module.exports =  {
    init: function() {
        this.bindings();
    },

    bindings: function() {
        $('.uit-map path').mouseover(function(e) {
            this.showToolTipFor(e.currentTarget);
        }.bind(this));
    },

    showToolTipFor: function(el) {
        var data = $(el).data();
        var coords = $(el)[0].getBoundingClientRect();

        console.log(coords);

        $('.uit-map__tooltip').css({
            top: coords.y,
            left: coords.x
        })


        $('.uit-map__tooltip').addClass('is-visible');;

        $(el).one('mouseout', function() {
            $('.uit-map__tooltip').removeClass('is-visible');
        });
    }
};
