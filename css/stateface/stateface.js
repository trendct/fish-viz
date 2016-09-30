var TrendStateFace = function(options){
    this.mapping = {
	"AL": "B",
	"AK": "A",
	"AZ": "D",
	"AR": "C",
	"CA": "E",
	"CO": "F",
	"CT": "G",
	"DE": "H",
	"DC": "y",
	"FL": "I",
	"GA": "J",
	"HI": "K",
	"ID": "M",
	"IL": "N",
	"IN": "O",
	"IA": "L",
	"KS": "P",
	"KY": "Q",
	"LA": "R",
	"ME": "U",
	"MD": "T",
	"MA": "S",
	"MI": "V",
	"MN": "W",
	"MS": "Y",
	"MO": "X",
	"MT": "Z",
	"NE": "c",
	"NV": "g",
	"NH": "d",
	"NJ": "e",
	"NM": "f",
	"NY": "h",
	"NC": "a",
	"ND": "b",
	"OH": "i",
	"OK": "j",
	"OR": "k",
	"PA": "l",
	"RI": "m",
	"SC": "n",
	"SD": "o",
	"TN": "p",
	"TX": "q",
	"UT": "r",
	"VT": "t",
	"VA": "s",
	"WA": "u",
	"WV": "w",
	"WI": "v",
	"WY": "x",
	"US": "z"
    };
}

TrendStateFace.prototype.translate = function(abbr){
    console.log(this);
    return this.mapping[abbr.toUpperCase()];
}

TrendStateFace.prototype.replace_all = function (){
    var that = this;
    $(".stateface-replace").each(function(){
	var input = $(this).html();
	var output = that.translate(input);
	console.log(input, output);
	$(this).html(output);
    });
}

(function(){
    var tsf = new TrendStateFace({});
    tsf.replace_all();
})();

