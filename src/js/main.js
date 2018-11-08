// Javascript that is inline. Should be used for anything that needs to be immediate
window.$ = require('./vendor/jquery.js');

var share = require('./modules/share.js');
var filter = require('./modules/filter.js');
var hover = require('./modules/hover.js');

share.init();
filter.init();
hover.init();
