var mapPosition;

module.exports =  {
    init: function() {
        this.setMapPosition();
        this.bindings();
    },

    setMapPosition: function() {
        mapPosition = $('.uit-map').offset();
    },

    bindings: function() {
        $('.uit-map path').mouseover(function(e) {
            this.showToolTipFor(e.currentTarget);
        }.bind(this));
    },

    showToolTipFor: function(el) {
        var data = $(el).data();
        var pointPosition = $(el).offset();

        $('.uit-map__tooltip').css({
            top: pointPosition.top - mapPosition.top,
            left: pointPosition.left - mapPosition.left
        });

        $('.uit-map__tooltip').addClass('is-visible');;

        $(el).one('mouseout', function() {
            $('.uit-map__tooltip').removeClass('is-visible');
        });
    }
};
