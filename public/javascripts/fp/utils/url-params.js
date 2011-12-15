/**
 * Created by IntelliJ IDEA.
 * User: Liam
 * Date: 15/12/11
 * Time: 9:24 PM
 * To change this template use File | Settings | File Templates.
 */
var urlParams = {};
(function () {
    var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&=]+)=?([^&]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = window.location.search.substring(1);

    while (e = r.exec(q))
        urlParams[d(e[1])] = d(e[2]);
})();