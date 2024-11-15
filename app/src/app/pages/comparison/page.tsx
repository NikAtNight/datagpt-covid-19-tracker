'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart"
import { useGetCountriesList } from "~/actions/countryHooks"
const mockData = [
	{ date: '2023-01-01', baseline: 100, comparison: 120 },
	{ date: '2023-02-01', baseline: 150, comparison: 180 },
	{ date: '2023-03-01', baseline: 200, comparison: 220 },
	{ date: '2023-04-01', baseline: 180, comparison: 200 },
	{ date: '2023-05-01', baseline: 220, comparison: 250 },
]

const pieData = [
	{ name: 'Baseline', value: 400 },
	{ name: 'Comparison', value: 300 },
]

const metrics = ['Total Cases', 'New Cases', 'Total Deaths', 'New Deaths', 'Vaccinations']
const chartTypes = ['Line', 'Bar', 'Scatter', 'Pie', 'Stacked Bar']

const COLORS = ['var(--color-baseline)', 'var(--color-comparison)']

export default function CovidTracker() {
	const [baselineCountry, setBaselineCountry] = useState('')
	const [comparisonCountry, setComparisonCountry] = useState('')
	const [metric, setMetric] = useState('')
	const [data, setData] = useState<any[]>([])
	const [chartType, setChartType] = useState('Line')

	const { data: countries, isLoading: countriesLoading } = useGetCountriesList()

	if (countriesLoading || !countries) return (
		<div className="flex flex-col justify-center items-center h-screen">
			Loading...
		</div>
	)

	const handleCompare = () => {
		console.log(`Comparing ${baselineCountry} with ${comparisonCountry} for ${metric}`)
		setData(mockData)
	}

	const renderChart = () => {
		const commonProps = {
			data: data,
		}

		switch (chartType) {
			case 'Bar':
				return (
					<BarChart {...commonProps}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="date" />
						<YAxis />
						<ChartTooltip content={<ChartTooltipContent />} />
						<Legend />
						<Bar dataKey="baseline" fill="var(--color-baseline)" name="Baseline" />
						<Bar dataKey="comparison" fill="var(--color-comparison)" name="Comparison" />
					</BarChart>
				)
			case 'Scatter':
				return (
					<ScatterChart {...commonProps}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="date" />
						<YAxis />
						<ChartTooltip content={<ChartTooltipContent />} />
						<Legend />
						<Scatter dataKey="baseline" fill="var(--color-baseline)" name="Baseline" />
						<Scatter dataKey="comparison" fill="var(--color-comparison)" name="Comparison" />
					</ScatterChart>
				)
			case 'Pie':
				return (
					<PieChart>
						<Pie
							data={pieData}
							cx="50%"
							cy="50%"
							labelLine={false}
							outerRadius={80}
							fill="#8884d8"
							dataKey="value"
						>
							{pieData.map((entry, index) => (
								<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
							))}
						</Pie>
						<ChartTooltip content={<ChartTooltipContent />} />
						<Legend />
					</PieChart>
				)
			case 'Stacked Bar':
				return (
					<BarChart {...commonProps}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="date" />
						<YAxis />
						<ChartTooltip content={<ChartTooltipContent />} />
						<Legend />
						<Bar dataKey="baseline" stackId="a" fill="var(--color-baseline)" name="Baseline" />
						<Bar dataKey="comparison" stackId="a" fill="var(--color-comparison)" name="Comparison" />
					</BarChart>
				)
			default:
				return (
					<LineChart {...commonProps}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="date" />
						<YAxis />
						<ChartTooltip content={<ChartTooltipContent />} />
						<Legend />
						<Line type="monotone" dataKey="baseline" stroke="var(--color-baseline)" name="Baseline" />
						<Line type="monotone" dataKey="comparison" stroke="var(--color-comparison)" name="Comparison" />
					</LineChart>
				)
		}
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-4">COVID-19 Comparison</h1>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Baseline Input</CardTitle>
						<CardDescription>Select the baseline country for comparison</CardDescription>
					</CardHeader>
					<CardContent>
						<Select onValueChange={setBaselineCountry}>
							<SelectTrigger>
								<SelectValue placeholder="Select country" />
							</SelectTrigger>
							<SelectContent>
								{countries.map((country) => (
									<SelectItem key={country} value={country}>{country}</SelectItem>
								))}
							</SelectContent>
						</Select>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Comparison Input</CardTitle>
						<CardDescription>Select the country to compare with (optional)</CardDescription>
					</CardHeader>
					<CardContent>
						<Select onValueChange={setComparisonCountry}>
							<SelectTrigger>
								<SelectValue placeholder="Select country" />
							</SelectTrigger>
							<SelectContent>
								{countries.map((country) => (
									<SelectItem key={country} value={country}>{country}</SelectItem>
								))}
							</SelectContent>
						</Select>
					</CardContent>
				</Card>
			</div>

			<Card className="mb-4">
				<CardHeader>
					<CardTitle>Metric Selection</CardTitle>
					<CardDescription>Choose the metric to compare</CardDescription>
				</CardHeader>
				<CardContent>
					<Select onValueChange={(value) => {
						setMetric(value);
						handleCompare();
					}}>
						<SelectTrigger>
							<SelectValue placeholder="Select metric" />
						</SelectTrigger>
						<SelectContent>
							{metrics.map((m) => (
								<SelectItem key={m} value={m}>{m}</SelectItem>
							))}
						</SelectContent>
					</Select>
				</CardContent>
			</Card>

			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle>COVID-19 Data Comparison</CardTitle>
					<Select value={chartType} onValueChange={setChartType}>
						<SelectTrigger className="w-[180px]">
							<SelectValue placeholder="Select chart type" />
						</SelectTrigger>
						<SelectContent>
							{chartTypes.map((type) => (
								<SelectItem key={type} value={type}>{type} Chart</SelectItem>
							))}
						</SelectContent>
					</Select>
				</CardHeader>
				<CardDescription className="px-6">
					{baselineCountry && `Baseline: ${baselineCountry}`}
					{comparisonCountry && ` | Comparison: ${comparisonCountry}`}
					{metric && ` | Metric: ${metric}`}
				</CardDescription>
				<CardContent>
					<ChartContainer
						config={{
							baseline: {
								label: "Baseline",
								color: "hsl(var(--chart-1))",
							},
							comparison: {
								label: "Comparison",
								color: "hsl(var(--chart-2))",
							},
						}}
					>
						<ResponsiveContainer width="100%" height={400}>
							{renderChart()}
						</ResponsiveContainer>
					</ChartContainer>
				</CardContent>
			</Card>
		</div>
	)
}
