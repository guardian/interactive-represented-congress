var us = {
    'gender': {
        'Male': 49.2,
        'Female': 50.8,
        'Transgender M/F': 0.6
    },
    'orientation': {
        'Straight': 95.5,
        'LGB': 4.5
    },
    'age': {
        'Under 35': 20.14,
        '35-49': 31.28,
        '50-64': 28.83,
        'Over 65': 19.75
    },

    'ethnicity': {
        'Hispanic': 16.3,
        'Black': 12.6,
        'Asian': 4.8,
        'White': 72.4,
        'Native American': 0.9
    },

    'religion': {
        'Christian': 69,
        'Jewish': 1.9,
        'Hindu': 0.7,
        'Muslim': 0.9,
        'Mormon': 1.6,
        'Buddhist': 0.7,
        'Non-religious': 7.1
    }
}

module.exports =  {
    init: function() {
        this.bindings();
        this.refreshFilters();
    },

    bindings: function() {
        $('.uit-comparison__filter').click(function(e) {
            this.changeFilter(e.currentTarget);
        }.bind(this));
    },

    changeFilter: function(el) {
        $(el).parent().find('.is-selected').removeClass('is-selected');
        $(el).addClass('is-selected');
        this.refreshFilter($(el).parent().parent());
    },

    refreshFilters: function() {
        $('.uit-comparison__group').each(function(i, el) {
            this.refreshFilter($(el));
        }.bind(this));
    },

    refreshFilter: function(el) {
        var filterBy = $(el).find('.is-selected').text();
        var groupName = $(el).data('set');

        this.updateChart(el, 'us', us[groupName][filterBy]);
        this.updateChart(el, 'congress', this.getCongressCount(groupName, filterBy));
        this.updateChart(el, 'D', this.getCongressCount(groupName, filterBy, 'D'));
        this.updateChart(el, 'R', this.getCongressCount(groupName, filterBy, 'R'));
    },

    updateChart: function(el, chart, percentage) {
        var $chart = $(el).find('.uit-comparison__chart--' + chart);

        $chart.find('.uit-comparison__percentage').text(percentage + '%');
        $chart.find('.uit-comparison__match-area').css({ transform: 'scale(' + percentage / 100 + ')' });
    },

    getCongressCount: function(group, filter, party = null) {
        var total = $('.uit-map path').length;
        var count = 0;

        if (party) {
            total = $('.uit-map path[data-party=' + party + ']').length;
        }

        $('.uit-map path').each(function(i, el) {
            if ($(el).data(group) === filter) {
                if (!party || party && $(el).data('party') === party) {
                    count++;
                }
            }
        }.bind(this));

        return ((count / total) * 100).toFixed(1);
    }
};
