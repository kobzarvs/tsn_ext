//
//
// JavaScript Utils
//
//

function newClass(c) {
    tmp = {};
    tmp.__proto__ = c.init();
    return tmp;
}

function Thread(proc) {
	setTimeout(function() {
		proc();
	}.bind(this), 0);
}