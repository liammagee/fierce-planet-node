require.paths.unshift('.')
var _jstat = require('public/javascripts/jstat-1.0.0/js/jstat-1.0.0'),
    jstat = _jstat.jstat,
    NormalDistribution = _jstat.NormalDistribution
;

var norm = new NormalDistribution(0,1) // normal distribution
var q = norm.getQuantile(0.95);        // the 0.95 quantile
console.log(q);
console.log(norm.getQuantile(0.84));
console.log(norm.getQuantile(0.16));
// Close to 3 sigma
console.log(norm.getQuantile(0.99865233));


// Calculate the cumulative density of a beta distribution
var cumulative = jstat.pbeta(0.5, 2.3, 4.1);
console.log(cumulative);  // output the result