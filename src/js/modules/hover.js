var mapPosition;
var codeToNameDict = {"AL":"Alabama","AK":"Alaska","AZ":"Arizona","AR":"Arkansas","CA":"California","CO":"Colorado","CT":"Connecticut","DE":"Delaware","FL":"Florida","GA":"Georgia","HI":"Hawaii","ID":"Idaho","IL":"Illinois","IN":"Indiana","IA":"Iowa","KS":"Kansas","KY":"Kentucky","LA":"Louisiana","ME":"Maine","MD":"Maryland","MA":"Massachusetts","MI":"Michigan","MN":"Minnesota","MS":"Mississippi","MO":"Missouri","MT":"Montana","NE":"Nebraska","NV":"Nevada","NH":"New Hampshire","NJ":"New Jersey","NM":"New Mexico","NY":"New York","NC":"North Carolina","ND":"North Dakota","OH":"Ohio","OK":"Oklahoma","OR":"Oregon","PA":"Pennsylvania","RI":"Rhode Island","SC":"South Carolina","SD":"South Dakota","TN":"Tennessee","TX":"Texas","UT":"Utah","VT":"Vermont","VA":"Virginia","WA":"Washington","WV":"West Virginia","WI":"Wisconsin","WY":"Wyoming"}

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

        $('.uit-map path').click(function(e) {
            if (!$(e.currentTarget).hasClass('is-filtered')) {
                this.showToolTipFor(e.currentTarget);
            }
        }.bind(this));

        $('.uit-map__tooltip').click(function(e) {
            $('.uit-map__tooltip').removeClass('is-visible');
        }.bind(this));

        $(window).resize(function() {
            this.setMapPosition();
        }.bind(this));
    },

    showToolTipFor: function(el) {
        var data = $(el).data();
        var declared = $(el).hasClass('is-declared');

        if (declared) {
            $('.uit-map__tooltip-name').text(data.name);
            $('.uit-map__tooltip-party').addClass('is-' + data.party);
            $('.uit-map__tooltip-party').text('(' + data.party + ')');
            $('.uit-map__tooltip-seat').text(this.formatSeat($(el).attr('id')));
        } else {
            $('.uit-map__tooltip-name').text('Race undeclared');
            $('.uit-map__tooltip-party').text('');
        }

        var oldPointPosition = $(el).offset();
        var pointPosition = el.getBoundingClientRect();
        var tooltipLeft;

        if ($(window).width < 480) {
            if (pointPosition.left - mapPosition.left < 100) {
                tooltipLeft = (pointPosition.left - mapPosition.left) + 100;
            }
            else if(pointPosition.left - mapPosition.left > 285) {
                tooltipLeft = (pointPosition.left - mapPosition.left) - 100;
            }
            else {
                tooltipLeft = (pointPosition.left - mapPosition.left);
            }
        } else {
            tooltipLeft = (pointPosition.left - mapPosition.left);
        }

        $('.uit-map__tooltip').css({
            top: pointPosition.top - (mapPosition.top - $(window).scrollTop()),
            left: tooltipLeft
        });

        $('.uit-map__tooltip').addClass('is-visible');

        $(el).one('mouseout', function() {
            $('.uit-map__tooltip-party').removeClass().addClass('uit-map__tooltip-party');
            $('.uit-map__tooltip').removeClass('is-visible');
        });
    },

    hideToolTipFor: function(el) {
        $('.uit-map__tooltip').removeClass('is-visible');
    },

    formatSeat: function(id) {
        if (id.includes('SN_')) {
            var isSenate = true;
            id = id.replace('SN_', '');
        }

        var state = codeToNameDict[id.substring(0, 2)];

        if (isSenate) {
            return 'Senate ' + state;
        } else {
            var number = parseInt(id.substring(2));
                number = this.suffixise(number);

            return 'House ' + state + ' ' + number;
        }
    },

    suffixise: function(i) {
        if (i == 0) {
            return 'at-large'
        }

        var j = i % 10,
        k = i % 100;
        if (j == 1 && k != 11) {
            return i + "st";
        }
        if (j == 2 && k != 12) {
            return i + "nd";
        }
        if (j == 3 && k != 13) {
            return i + "rd";
        }
        return i + "th";
    }
};
