Ratchet = function (){
    this.__vals = [];
}

Ratchet.prototype.vals = function (){
    return this.__vals;
}

Ratchet.prototype.f = function(f) {
    return f.apply(null, this.__vals);
}

Ratchet.prototype.max = function() {
    return this.f(Math.max);
}

Ratchet.prototype.min = function() {
    return this.f(Math.min);
}

Ratchet.prototype.add = function (val) {
    this.__vals.push(val);
    return this;
}


// TRENDFISH

var TRENDFISH = TRENDFISH || {}

TRENDFISH.init = function (options){

    this.copy = {
	top_level: {
	    "title":"Climate vulnerability of Northeast marine species",
	    // "explainer":"All of the species were classified as either being highly or very highly exposed to climate change. No species was classified as facing moderate or low exposure. Each species is marked with a colored circle indicating its biological sensitivity:"
	    "explainer": "All 82 species studied were at very high or high risk for exposure to climate change. Each species is marked with a colored circle indicating its biological sensitivity. That range runs from low to very high. The study plotted climate exposure against sensitivity to determine overall climate vulnerability. It showed the 82 species to be split fairly evenly among the four rankings – very high, high, moderate and low.",
	    sourceline: "Source: NOAA Northeast Fisheries Science Center",
	    byline: "Jake Kara / CTMirror.org"
	},
	exposure_group: {
	    "Low":{
		"heading":"Low exposure to climate change",
		"explainer":"There are no species in this category."
	    },
	    "Moderate":{
		"heading":"Moderate exposure to climate change",
		"explainer":"There are no species in this category."
	    },
	    "High":{
		"heading":"High exposure to climate change",
		"explainer":""
	    },
	    "Very High":{
		"heading":"Very high exposure to climate change",
		"explainer":""
	    }
	}
    };

    var options = options || {};
    this.div = options.div || "fish_tank";
    
    var img_url = function(file_name){
	// var base_url = "http://projects.ctmirror.org/content/2016/8/fish/imgs/";
	var base_url = "./img/"
	return base_url + file_name;
    }
    
    var that = this;
    d3.csv("js/climate_vuln.csv",
           function(d) {
	       // console.log(d);
	       that.climate_exposure = {};
	       that.d = d.map(function(r){
		   r.url = img_url(r.File);
	       });
	       var ret = {};
	       for (k in that.d){
		   var fish = d[k];
		   // console.log(fish);
		   that.climate_exposure[fish["Climate_Exposure"]] =
		       that.climate_exposure[fish["Climate_Exposure"]] || {
			   "level" : fish["Climate_Exposure"]
		       };
		   that.climate_exposure
		   [fish["Climate_Exposure"]]
		   [fish["Fish"]] = fish;
	       };
	       that.go();
	   });

    // this.climate_expsosure["Low"] =
    // 	this.climate_expsosure["Low"] || { level:"Low"};
    // this.climate_expsosure["Moderate"] =
    // 	this.climate_expsosure["Moderate"] || { level: "Moderate"};
    // this.climate_expsosure["High"] = this.climate_expsosure["High"] || {};
    // this.climate_expsosure["Very High"] = this.climate_expsosure["Very High"] || {};

}

TRENDFISH.go = function (){
    
    this.climate_exposure["Low"] =
	this.climate_exposure["Low"] || { level:"Low"};
    this.climate_exposure["Moderate"] =
	this.climate_exposure["Moderate"] || { level: "Moderate"};
    this.climate_exposure["High"] = this.climate_exposure["High"] || {};
    this.climate_exposure["Very High"] = this.climate_exposure["Very High"] || {};

    // console.log("Going fishing");

    var top_copy = d3.select("#" + this.div)
	.append("div")
	.classed("top_copy", true);

    top_copy
	.append("h3")
	.text(this.copy.top_level.title);
    var explainer = top_copy.append("p")
    	.classed("explainer", true)
    	.text(this.copy.top_level.explainer);

    var legend = // d3.select("#" + this.div)
	explainer
	.append("div")
	.classed("legend", true)

    var legend_title = legend.append("div")
	.classed("legend_item", true);
    legend_title.append("div")
	.classed("legend_label", true)
	.text("Biological sensitivity: ");

    function  add_legend_item(level){
	var legend_item = legend
	    .append("div")
	    .classed("legend_item", true);

	legend_item
	    .append("div")
	    .classed("bio-sensitivity-box", true)
	    .attr("data-bio-sensitivity-level", level);

	legend_item.append("div")
	    .classed("legend_label", true)
	    .text(level);
	
    }


    var legend_order = ["Very High","High","Moderate","Low"];
    for (i in legend_order){
	add_legend_item(legend_order[i]);
    }
    // add_legend_item ("Moderate");
    // add_legend_item ("Low");
    // add_legend_item ("High");
    // add_legend_item ("Very High");
    legend.append("div")
	.classed("clear_float", true);
    
    var that = this;
    // console.log([this.climate_exposure["Low"],
    // this.climate_exposure["Moderate"],
    // this.climate_exposure["High"],
    // this.climate_exposure["Very High"]]);
    // Build the four tanks
    // console.log(this.climate_exposure);
    d3.select("#" + this.div)
	.selectAll("div.climate_exposure_group")
	.data(
	    [this.climate_exposure["Very High"],
	     this.climate_exposure["High"],
	     this.climate_exposure["Moderate"],
	     this.climate_exposure["Low"]]
	    
	)
	.enter()
	.append("div")
	.classed("climate_exposure_group", true)
	.attr("data-exposure-level", function(d) {
	    // console.log("data-exposure-level", d);
	    return d["level"];
	})
	.each(function(a, b, c, d){
	    // console.log("Explanation area", a, b, c, d);
	    var exp_area = d3.select(this).append("div")
		.classed("explanation_area", true);
	    // console.log(a);
	    var exp_headline = exp_area
		.append("h3")
	    exp_headline.append("span")
		.classed("expander_button", true);
	    exp_headline.append("span")
		.classed("explanation_headline", true)
		.text(that.copy.exposure_group[a.level].heading);
	    exp_area
	    	.append("p")
	    	.text(that.copy.exposure_group[a.level].explainer);
	});

    // Fill the tanks
    var that = this;
    function fill_tank(level){
	var selector = "#" + that.div + " "
	    + ".climate_exposure_group[data-exposure-level='" + level + "']";

	var data = []; // that.climate_exposure[level];

	for (k in that.climate_exposure[level]){
	    if (k != "level") {
		data.push(that.climate_exposure[level][k]);
	    }
	}

	var sort_fish = function(a, b){
	    var level_num = function(level){
		console.log("level_num", level);
		var levels = {
		    "Low": 1,
		    "Moderate": 2,
		    "High": 3,
		    "Very High": 4
		};

		if (levels.hasOwnProperty(level)){
		    console.log(level + "=>" + levels[level]);
		    return levels[level];
		}
		else {
		    return false;
		}
	    }

	    console.log("Comparing", a, b);

	    // Illogical naming here. Last minute hack to reverse
	    // the sort order so the highest sensitivity came first
	    // per reorter request.
	    var level_b = level_num(a.Biological_Sensitivity);
	    var level_a = level_num(b.Biological_Sensitivity);

	    if (level_a != level_b) {
		return level_a - level_b;
	    }
	    else {
		console.log(a.Fish, b.Fish, a.Fish < b.Fish);
		if (a.Fish < b.Fish) return -1;
		else if (a.Fish > b.Fish) return 1;
		else return 0;
		// return a.Fish - b.Fish;
	    }
	}

	data = data.sort(sort_fish);
	
	d3.select(selector)
	    .selectAll("div.fish_box")
	    .data(data)
	    .enter()
	    .append("div")
	    .classed("fish_box", true)
	    .attr("data-fish-name", function(d){
		// console.log("Adding ", d.Fish);
		return d.Fish;
	    })
	    .attr("data-bio-sensitivity-level", function(d){
		return d.Biological_Sensitivity;
	    })
	    .each(function(d, i, a){
		d3.select(this)
		    .append("div")
		    .classed("bio-sensitivity-box", true);

		d3.select(this)
		    .append("img")
		    .attr("src", d.url);

		d3.select(this)
		    .append("div")
		    .classed("fish_name", true)
		    .html("<strong>" + d.Fish + "</strong>");

		d3.select(this)
		    .append("div")
		    .classed("bio-sensitivity-text", true)
		    .text(function(a, b, c) {
			return "Biological sensitivity: "
			    + a.Biological_Sensitivity 
		    });
	    });

	d3.select(selector).append("div").classed("clear_float", true);
    }

    fill_tank("Very High");
    fill_tank("High");
    fill_tank("Moderate");
    fill_tank("Low");

    // d3.select(window).on("resize", function(){
    // 	size();
    // });

    // Add source and byline
    d3.select("#" + this.div)
	.append("div")
	.classed("sourceline", true)
	.text(this.copy.top_level.sourceline)

    d3.select("#" + this.div)
	.append("div")
	.classed("clear_float", true);
    d3.select("#" + this.div)
	.append("div")
	.classed("byline", true)
	.text(this.copy.top_level.byline)
    d3.select("#" + this.div)
	.append("div")
	.classed("clear_float", true);
    
    function size(){
	console.log("sizing");

	d3.selectAll(".fish_box").classed("hovering", false);
	var h = TRENDFISH.same_height(".fish_box");
	
	d3.selectAll(".fish_box").on("click", function(){
	    var set_to = !d3.select(this).classed("hovering");
	    d3.selectAll(".fish_box").classed("hovering", false);
	    
	    d3.select(this).classed("hovering", set_to);
	    
	    // d3.selectAll(".fish_box")
	    //     .style("min-height", h + "px");
	    // d3.selectAll(".fish_box.hovering")
	    //     .style("max-height", false);
	});
    }


    // Make the fish_tanks expandable
    var make_expandable = function (){
	// Add expander buttons

	// d3.selectAll(".explanation_area .explanation_headline")
	//     .insert("span")
	//     .classed("expander_button", true)

	d3.selectAll(".climate_exposure_group")
	    .classed("expanded", true);
	
	var expander_handler = function(){
	    var par = d3.select(this).node().parentNode
	    var expanded = d3.select(par).classed("expanded")
	    d3.select(par)
		.classed("expanded", !expanded);
	    d3.select(par)
		.classed("collapsed", expanded);
	    console.log("set expanded from " + expanded + " to " +  !expanded);
	    update_expanders();
	    size();
	}
	
	// Add event listener
	d3.selectAll(".explanation_area")
	    .on("click", expander_handler);
    }

    var collapse = function(climate_level) {
	d3.select("div.climate_exposure_group[data-exposure-level='"
		  + climate_level + "']")
	    .classed("expanded", false)
	    .classed("collapsed", true);
	update_expanders();
    }

    // Update the expander buttons
    var update_expanders = function () {
	d3.selectAll(".expander_button")
	    .each(function(){
		var par = d3.select(this).node().parentNode.parentNode.parentNode;
		var expanded = d3.select(par).classed("expanded");

		if (expanded){
		    console.log("expanded");
		    d3.select(this)
			.html(' <i class="fa fa-minus-circle" aria-hidden="true"></i>');
		} else {
		    console.log("not expanded");
		    d3.select(this)
			.html(' <i class="fa fa-plus-circle" aria-hidden="true"></i>');
		}
	    });
    }

    make_expandable();
    update_expanders();
    collapse("High");
    collapse("Moderate");
    collapse("Low");
    setTimeout(size, 500);
    setTimeout(size, 5000);
}

// Make all elements of a certain selector the same height
// as the tallest one
TRENDFISH.same_height = function(selector){
    r = new Ratchet();
    d3.selectAll(selector)
	.each(function(){
	    r.add(d3.select(this).node().getBoundingClientRect().height);
	});
    
    d3.selectAll(selector)
	.style("min-height", r.max() + "px");

    console.log("min-height", r.max());
    return r.max();
}

TRENDFISH.init();

