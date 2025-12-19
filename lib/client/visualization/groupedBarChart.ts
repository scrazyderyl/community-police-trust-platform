import * as d3 from "d3";
import { pixelAlignedTicks } from "./util";

export interface BarData {
  group: string;
  category: string;
  value: number;
}

interface ChartOptions {
  selector: string;
  data: BarData[];
  width?: number;
  height?: number;
}

export function drawGroupedBarChart({
  selector,
  data,
  height = 400,
  groupWidth = 100,
}: ChartOptions & { groupWidth?: number }) {
  const margin = { top: 60, right: 30, bottom: 120, left: 60 };

  const groups = Array.from(new Set(data.map(d => d.group)));
  const subgroups = Array.from(new Set(data.map(d => d.category)));

  // Temporary SVG to measure legend width
  const tempSvg = d3.select("body").append("svg").style("visibility", "hidden");
  const legendGroup = tempSvg.append("g");
  let legendWidth = 0;
  subgroups.forEach((key, i) => {
    const xOffset = i * 100;
    legendGroup.append("rect").attr("x", xOffset).attr("width", 15);
    const text = legendGroup.append("text").attr("x", xOffset + 20).text(key);
    const bbox = text.node()!.getBBox();
    legendWidth = Math.max(legendWidth, bbox.x + bbox.width);
  });
  tempSvg.remove();

  // Compute SVG width to fit both groups and legend
  const minWidth = margin.left + legendWidth + margin.right;
  const chartWidth = Math.max(groups.length * groupWidth, minWidth - margin.left - margin.right);
  const svgWidth = chartWidth + margin.left + margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const svg = d3.select(selector)
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", height);

  const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

  const x0 = d3.scaleBand().domain(groups).range([0, chartWidth]).paddingInner(0.1);
  const x1 = d3.scaleBand().domain(subgroups).range([0, x0.bandwidth()]).padding(0.05);
  const y = d3.scaleLinear().domain([0, d3.max(data, d => d.value)!]).nice().range([chartHeight, 0]);
  const color = d3.scaleOrdinal<string>().domain(subgroups).range(["#f56565", "#ed8936", "#48bb78"]);

  g.append("g")
    .attr("transform", `translate(0,${chartHeight})`)
    .call(d3.axisBottom(x0))
    .selectAll("text")
    .attr("transform", "rotate(-45)")
    .style("text-anchor", "end")
    .attr("dx", "-0.8em")
    .attr("dy", "0.15em");

  g.append("g").call(d3.axisLeft(y).tickValues(pixelAlignedTicks(y, 20, chartHeight)).tickFormat(d3.format("d")));

  const tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("pointer-events", "none")
    .style("opacity", 0)
    .style("background", "rgba(0,0,0,0.7)")
    .style("color", "#fff")
    .style("padding", "6px 10px")
    .style("border-radius", "4px");

  g.selectAll("g.bar-group")
    .data(groups)
    .join("g")
    .attr("class", "bar-group")
    .attr("transform", d => `translate(${x0(d)},0)`)
    .selectAll("rect")
    .data(d => data.filter(item => item.group === d))
    .join("rect")
    .attr("x", d => x1(d.category)!)
    .attr("y", d => y(d.value))
    .attr("width", x1.bandwidth())
    .attr("height", d => y(0) - y(d.value))
    .attr("fill", d => color(d.category)!)
    .on("mouseover", function (event, d) {
      tooltip.style("opacity", 1).html(`<strong>${d.category}</strong><br/>Count: ${d.value}`);
    })
    .on("mousemove", function (event) {
      tooltip.style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 20) + "px");
    })
    .on("mouseout", function () {
      tooltip.style("opacity", 0);
    });

  // Legend
  const legend = svg.append("g").attr("transform", `translate(${margin.left}, 20)`);
  subgroups.forEach((key, i) => {
    const xOffset = i * 100;
    legend.append("rect").attr("x", xOffset).attr("y", 0).attr("width", 15).attr("height", 15).attr("fill", color(key));
    legend.append("text").attr("x", xOffset + 20).attr("y", 12).text(key).style("font-size", "12px").style("fill", "#000");
  });
}