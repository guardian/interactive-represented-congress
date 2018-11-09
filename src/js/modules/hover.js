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
            if (!$(e.currentTarget).hasClass('is-filtered')) {
                this.showToolTipFor(e.currentTarget);
            }
        }.bind(this));
    },

    showToolTipFor: function(el) {
        var data = $(el).data();

        $('.uit-map__tooltip-name').text(data.name);
        $('.uit-map__tooltip-party').addClass('is-' + data.party);
        $('.uit-map__tooltip-party').text('(' + data.party + ')');
        $('.uit-map__tooltip-seat').text($(el).attr('id'));

        var pointPosition = $(el).offset();

        $('.uit-map__tooltip').css({
            top: pointPosition.top - mapPosition.top,
            left: pointPosition.left - mapPosition.left
        });

        $('.uit-map__tooltip').addClass('is-visible');

        $(el).one('mouseout', function() {
            $('.uit-map__tooltip-party').removeClass().addClass('uit-map__tooltip-party');
            $('.uit-map__tooltip').removeClass('is-visible');
        });
    }
};
