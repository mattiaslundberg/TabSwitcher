/*
	Needleman-Wunsch algorithm for fuzzy string matching.
*/

var d = 1;
var threshold = 25;

function distance(a, b) {
	if (a === undefined || b === undefined)
		return d;
	a = a.toLowerCase(); b = b.toLowerCase();
	if (a === b)
		return 0;
	
	return d;
}

function matching(A, B) {
	var i = A.length;
	var j = B.length;
	if (i <= 0 || j <= 0)
		return true;
	
	F = new Array(i);
	for (var k = 0; k <= i; k++) {
		F[k] = new Array(j);
		F[k][0] = d * j;
	};
	for (var k = 0; k < j; k++) {
		F[0][k] = d * j;
	};
	
	for (var k = 1; k < F.length; k++) {
		for (var l = 1; l < F[k].length; l++) {
			var match = F[k - 1][l - 1] + distance(A[k], B[l]);
			var del = F[k - 1][l] + d;
			var ins = 0;//F[k][l - 1] + d;
			F[k][l] = Math.max(match, del, ins);
		};
	};
	console.log("Matching of " + A + " " + B + " got value " + F[i - 1][j - 1]);
	return F[i - 1][j - 1] < threshold;
}


