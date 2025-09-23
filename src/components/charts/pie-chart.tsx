import * as React from "react"
import * as d3 from "d3"
import { cn } from "@/lib/utils"

type PieData = {
  name: string
  value: number
  color?: string
}

interface PieChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: PieData[]
  width?: number
  height?: number
  margin?: { top: number; right: number; bottom: number; left: number }
  innerRadius?: number
  labelRadius?: number
}

export function PieChart({
  data,
  width = 400,
  height = 400,
  margin = { top: 20, right: 20, bottom: 20, left: 20 },
  innerRadius = 0,
  labelRadius = 0.7,
  className,
  ...props
}: PieChartProps) {
  const svgRef = React.useRef<SVGSVGElement>(null)
  const tooltipRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!svgRef.current || !tooltipRef.current) return

    const svg = d3.select(svgRef.current)
    const tooltip = d3.select(tooltipRef.current)

    // Clear previous content
    svg.selectAll("*").remove()

    // Set the dimensions of the chart area
    const radius = Math.min(width, height) / 2 - Math.max(margin.top, margin.right, margin.bottom, margin.left)
    const outerRadius = radius

    // Create a group element for the chart
    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`)

    // Create the pie layout
    const pie = d3
      .pie<PieData>()
      .sort(null)
      .value((d) => d.value)

    // Create the arc generator
    const arc = d3
      .arc<d3.PieArcDatum<PieData>>()
      .innerRadius(innerRadius * radius)
      .outerRadius(outerRadius)

    // Create the label arc generator
    const labelArc = d3
      .arc<d3.PieArcDatum<PieData>>()
      .innerRadius(radius * labelRadius)
      .outerRadius(radius * labelRadius)

    // Generate the arcs
    const arcs = g
      .selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc")

    // Add the path for each slice
    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => d.data.color || d3.schemeCategory10[i % 10])
      .attr("stroke", "var(--background)")
      .style("stroke-width", "2px")
      .style("opacity", 0.8)
      .on("mouseover", function (_, d) {
        d3.select(this).style("opacity", 1)
        tooltip
          .style("opacity", 1)
          .html(
            `
            <div class="bg-background border rounded p-2 text-sm">
              <div class="font-semibold">${d.data.name}</div>
              <div>${d.data.value.toLocaleString()}</div>
              <div>${((d.endAngle - d.startAngle) / (2 * Math.PI) * 100).toFixed(1)}%</div>
            </div>
          `
          )
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`)
      })
      .on("mouseout", function () {
        d3.select(this).style("opacity", 0.8)
        tooltip.style("opacity", 0)
      })

    // Add labels
    arcs
      .append("text")
      .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "var(--foreground)")
      .text((d) => d.data.name)

    // Add animation
    arcs
      .selectAll("path")
      .transition()
      .duration(1000)
      .attrTween("d", function (d) {
        // Ensure d is an object for d3.interpolate
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d as object)
        return function (t) {
          // arc() expects a PieArcDatum<PieData>, so we cast
          return arc(interpolate(t) as d3.PieArcDatum<PieData>) || ""
        }
      })

    // Clean up
    return () => {
      svg.selectAll("*").remove()
    }
  }, [data, height, innerRadius, labelRadius, margin.bottom, margin.left, margin.right, margin.top, width])

  return (
    <div className={cn("relative", className)} {...props}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
      />
      <div
        ref={tooltipRef}
        className="absolute pointer-events-none opacity-0 transition-opacity duration-200 z-10"
      />
    </div>
  )
}
