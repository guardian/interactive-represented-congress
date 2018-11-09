// Javascript that is inline. Should be used for anything that needs to be immediate
window.$ = require('./vendor/jquery.js');

var share = require('./modules/share.js');
var map = require('./modules/map.js');
var filter = require('./modules/filter.js');
var hover = require('./modules/hover.js');
var comparison = require('./modules/comparison.js');

share.init();
map.init();
filter.init();
hover.init();
comparison.init();
