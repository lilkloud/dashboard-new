import * as React from "react"
import * as d3 from "d3"
import { cn } from "@/lib/utils"

type DataPoint = {
  month: string
  value: number
}

interface LineChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: DataPoint[]
  width?: number
  height?: number
  margin?: { top: number; right: number; bottom: number; left: number }
}

export function LineChart({
  data,
  width = 800,
  height = 400,
  margin = { top: 20, right: 30, bottom: 40, left: 50 },
  className,
  ...props
}: LineChartProps) {
  const svgRef = React.useRef<SVGSVGElement>(null)
  const tooltipRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (!svgRef.current || !tooltipRef.current) return

    const svg = d3.select(svgRef.current)
    const tooltip = d3.select(tooltipRef.current)

    // Clear previous content
    svg.selectAll("*").remove()

    // Set the dimensions of the chart area
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    // Create scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.month))
      .range([0, innerWidth])
      .padding(0.1)

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0] as [number, number])
      .nice()
      .range([innerHeight, 0])

    // Create line generator
    const line = d3
      .line<DataPoint>()
      .x((d) => (x(d.month) || 0) + x.bandwidth() / 2)
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX)

    // Create a group element for the chart
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)

    // Add x-axis
    g.append("g")
      .attr("class", "text-muted-foreground text-xs")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .selectAll("text")
      .attr("fill", "currentColor")
      .style("font-size", "12px")

    // Add y-axis
    g.append("g")
      .attr("class", "text-muted-foreground text-xs")
      .call(d3.axisLeft(y).ticks(5).tickSize(-innerWidth).tickFormat(d3.format(",d")))
      .call((g) => g.select(".domain").remove())
      .selectAll(".tick line")
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.1)

    // Add the line
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "hsl(var(--primary))")
      .attr("stroke-width", 2)
      .attr("d", line)

    // Add dots
    const dots = g
      .selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => (x(d.month) || 0) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d.value))
      .attr("r", 0)
      .attr("fill", "hsl(var(--primary))")
      .on("mouseover", (_, d) => {
        tooltip.style("opacity", 1).html(`
          <div class="bg-background border rounded p-2 text-sm">
            <div class="font-semibold">${d.month}</div>
            <div>${d.value.toLocaleString()}</div>
          </div>
        `)
      })
      .on("mousemove", (event) => {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`)
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0)
      })

    // Animate dots
    dots.transition().duration(500).attr("r", 5)

    // Clean up
    return () => {
      svg.selectAll("*").remove()
    }
  }, [data, height, margin.bottom, margin.left, margin.right, margin.top, width])

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
        className="absolute pointer-events-none opacity-0 transition-opacity duration-200"
      />
    </div>
  )
}
