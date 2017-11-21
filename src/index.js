import * as d3 from "d3";
import './index.css';

const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";

fetch(url)
	.then((response)=> response.json())
	.then((data)=>{
		graph(data);
	})
	.catch((error)=>{
		console.log(error);
	});

function graph(data) {
	const dataset=data,
	w=1000,
	h=500,
	padding=60,
	parseTime=d3.timeParse("%B-%Y"),
	parseMonth=d3.timeParse("%m"),
	parseYear=d3.timeParse("%Y");
	
	dataset.monthlyVariance.forEach((d)=>d.date=d.year+"-"+d.month);
	console.log(dataset);
	const div = d3.select("main").append("div")
		.attr("class","tooltip")
		.style("opacity", 0);

	const xScale = d3.scaleTime()
						.domain([d3.min(dataset.monthlyVariance,(d)=>parseYear(d.year)),d3.max(dataset.monthlyVariance, (d)=>parseYear(d.year))])
						.range([padding,w-padding]);

	const yScale = d3.scaleTime()
						//.domain([d3.min(dataset.monthlyVariance, (d=>parseMonth(d.month))), d3.max(dataset.monthlyVariance, (d)=>parseMonth(d.month))]).nice()
						.domain([parseMonth(0),parseMonth(12)])
						.range([h-padding, padding]);

	const svg = d3.select("main")
					.append("svg")
					.attr("width", w)
					.attr("height", h)
					.style("background", "#f35261");

	svg.selectAll("rect")
		.data(dataset.monthlyVariance)
		.enter()
		.append("rect")
		.attr("class", (d)=>{
			if (8.66+d.variance<2.7) {
				return "cool5";
			} else if (8.66+d.variance<=3.9) {
				return "cool4";
			} else if (8.66+d.variance<=5) {
				return "cool3";
			} else if (8.66+d.variance<=6.1) {
				return "cool2";
			} else if (8.66+d.variance<=7.2) {
				return "cool1";
			} else if (8.66+d.variance<=8.3) {
				return "neutral";
			} else if (8.66+d.variance<=9.4) {
				return "warm1";
			} else if (8.66+d.variance<=10.5) {
				return "warm2";
			} else if (8.66+d.variance<=11.6) {
				return "warm3";
			} else if (8.66+d.variance<=12.7) {
				return "warm4";
			} else {return "warm5";}
		})
		.attr("x", (d)=>xScale(parseYear(d.year)))
		.attr("y", (d)=>yScale(parseMonth(d.month)))
		.attr("width", (w-(2*padding))/263)
		.attr("height", (h-(2*padding))/12)
		.on("mouseover", (d)=> {
			let parseDate = d3.timeFormat("%m-%Y");
			let month = d3.timeFormat("%B");
			let year = d3.timeFormat("%Y")
			let info = month(parseMonth(d.month)) + " " + year(parseYear(d.year)) + "<br/>" + "Temp: " + (8.66+d.variance) + " &deg;C" + "<br/>" + "Temp Variance: " + d.variance + " &deg;C";
			div.transition()
				.duration(200)
				.style("opacity", .9);
			div.html(info)
				.style("left", (d3.event.pageX)+"px")
				.style("top", (d3.event.pageY-28)+"px");
		})
		.on("mouseout", (d)=> {
			div.transition()
				.duration(500)
				.style("opacity", 0);
		});

	//X Axis
	const xAxis = d3.axisBottom(xScale);
	svg.append("g")
		.attr("transform", "translate(0,"+(h-padding)+")")
		.call(xAxis);
	svg.append("text")
		.attr("transform", "translate("+(padding)+",0)")
		.attr("y", h-30)
		.attr("x", w/2)
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.text("Year");

	//Y Axis
	const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"));
	svg.append("g")
		.attr("transform", "translate("+(padding)+","+(380/24)+")")
		.call(yAxis);
	svg.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", padding/10)
		.attr("x", 0-(h/2))
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.text("Month");

	//Title
	svg.append("text")
		.attr("x", w/2)
		.attr("y", padding/2)
		.attr("text-anchor", "middle")
		.attr("class", "title")
		.text("Monthly Global Land-Surface Temperature");
	svg.append("text")
		.attr("x", w/2)
		.attr("y", 50)
		.attr("text-anchor", "middle")
		.attr("class", "subtitle")
		.text("1753 - 2015")
}
