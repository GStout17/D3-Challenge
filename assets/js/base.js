// Const to data.csv
const dataUrl = "assets/data/data.csv";

// SVG Setup
let svgWidth = 690;
let svgHeight = 500;
let margin = {
    top: 20,
    bottom: 60,
    left: 60,
    right: 40
};
let width = svgWidth - margin.left - margin.right;
let height = svgHeight - margin.top - margin.bottom;

// SVG wrapper
let svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append the group
let chartGroup = svg.append("g")
    .attr("transform",`translate(${margin.left},${margin.top})`);

// Selecting the correct data from csv file (check spelling)
d3.csv(dataUrl).then(healthdata => {
    healthdata.forEach(data => {
        data.id = +data.id;
        data.age = +data.age;
        data.ageMoe = +data.ageMoe;
        data.healthcare = +data.healthcare;
        data.healthcareHigh = +data.healthcareHigh;
        data.healthcareLow = +data.healthcareLow;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.obesity = +data.obesity;
        data.obesityHigh = +data.obesityHigh;
        data.obesityLow = +data.obesityLow;
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.smokes = +data.smokes;
        data.smokesHigh = +data.smokesHigh;
        data.smokesLow = +data.smokesLow;
    });
    console.log("healthdata",healthdata);

    // Function needs to be scaled or it won't look right
    let xLinearScale = d3.scaleLinear()
        .domain([
            d3.min(healthdata, data => data.poverty) * 0.8,
            d3.max(healthdata, data => data.poverty) * 1.2
        ])
        .range([0,width]);
    let yLinearScale = d3.scaleLinear()
        .domain([
            d3.min(healthdata, data => data.healthcareLow) * 0.8,
            d3.max(healthdata, data => data.healthcareLow) * 1.2
        ])
        .range([height,0]);

    // Axis
    // https://www.tutorialsteacher.com/d3js/axes-in-d3
    let bottomAxis = d3.axisBottom(xLinearScale);
    let leftAxis = d3.axisLeft(yLinearScale);

    // append axis to the chart
    // X axis
    chartGroup.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(bottomAxis);
    // Y axis
    chartGroup.append("g")
        .call(leftAxis);

    // Circle creation
    let circlesGroup = chartGroup.selectAll("circle")
        .data(healthdata)
        .enter()
        .append("g")
    let circling = circlesGroup.append("circle")
        .attr("cx", data => xLinearScale(data.poverty))
        .attr("cy", data => yLinearScale(data.healthcareLow))
        .attr("r", 10)
        .attr("fill","lightblue")
        .attr("opacity","0.75");
    let texting = circlesGroup.append("text")
        .text(data => data.abbr)
        .attr("x", data => xLinearScale(data.poverty))
        .attr("y", data => yLinearScale(data.healthcareLow)+4)
        .attr("fill","white")
        .attr("font-size", "11px")
        .attr("text-anchor", "middle")

    // create tool tips for circles
    let toolTip = d3.tip()
        .attr("class","d3-tip") //from d3Style.css
        .offset([80,-50])
        .html(data => `${data.state}<br>Poverty: ${data.poverty}%<br>Healthcare: ${data.healthcareLow}`);
    circlesGroup.call(toolTip);
    // mouseover on and out
    
    circlesGroup.on("mouseover", function(data) {
            return toolTip.show(data,this);
        })
    circlesGroup.on("mouseout", function(data, index) {
            return toolTip.hide(data,this);
        })

    // Y-axis + attributes + Text
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .style("text-anchor", "middle")
        .text("Lacks Healthcare (%)")

    // X-Axis + attributes & Text
    chartGroup.append("text")
        .attr("transform", `translate(${width/2}, ${height + margin.top + 20})`)
        .attr("class", "axisText")
        .style("text-anchor", "middle")
        .text("In Poverty (%)");

});