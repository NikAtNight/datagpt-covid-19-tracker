'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { LineChart, Line, BarChart, Bar, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "~/components/ui/chart"
import { useGetCountriesList } from "~/actions/countryHooks"
import { metrics, dataSets, endpoints, DataSetLabel } from "~/lib/helper"
import axios from "axios"
import { DatePickerWithRange } from '~/components/DatePickerRange'
import { DateRange } from 'react-day-picker'
import { format } from 'date-fns'
import { Inbox } from 'lucide-react'


const chartTypes = ['Line', 'Bar', 'Scatter', 'Stacked Bar']

export default function Home() {
	const [baselineCountry, setBaselineCountry] = useState<string>('Canada')
	const [comparisonCountry, setComparisonCountry] = useState<string>('')
	const [dataSet, setDataSet] = useState<{ label: DataSetLabel; value: string }>({
		label: "Case Deaths",
		value: "covid_cases_deaths",
	})
	const [metric, setMetric] = useState<{ label: string; value: string } | null>(null)
	const [data, setData] = useState<any[]>([])
	const [dateRange, setDateRange] = useState<DateRange>({
		from: undefined,
		to: undefined,
	})
	const [chartType, setChartType] = useState<string>('Line')

	const { data: countries, isLoading: countriesLoading } = useGetCountriesList()

	useEffect(() => {
		if (metric && baselineCountry) {
			handleCompare()
		}
	}, [baselineCountry, comparisonCountry, dateRange, metric])

	if (countriesLoading || !countries) return (
		<div className="flex flex-col justify-center items-center h-screen">
			Loading...
		</div>
	)

	const handleCompare = () => {
		if (!metric || !baselineCountry || !dateRange?.from || !dateRange?.to) return

		const endpoint = endpoints[dataSet.label]

		axios.get(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
			params: {
				baseline_country: baselineCountry,
				comparison_country: comparisonCountry,
				metric: metric.value,
				date_from: format(dateRange.from, 'yyyy-MM-dd'),
				date_to: format(dateRange.to, 'yyyy-MM-dd'),
			},
		}).then((res) => {
			console.log(res.data)
			setData(res.data)
		})
	}

	const renderChart = () => {
		if (!data || data.length === 0) {
			return (
				<div className="flex flex-col items-center justify-center h-[100%] gap-6">
					<div className="flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full dark:bg-gray-800">
						<Inbox className="w-10 h-10 text-gray-500 dark:text-gray-400" />
					</div>
					<div className="space-y-2 text-center">
						<h2 className="text-2xl font-bold tracking-tight">No data to display</h2>
						<p className="text-gray-500 dark:text-gray-400">
							It looks like there's no data available for this date range.
						</p>
					</div>
				</div>
			);
		}

		const commonProps = {
			data: data,
		}

		const hasComparison = data.length > 0 && 'comparison' in data[0]

		switch (chartType) {
			case 'Bar':
				return (
					<BarChart {...commonProps}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="date" />
						<YAxis />
						<ChartTooltip content={<ChartTooltipContent />} />
						<Legend />
						<Bar dataKey="baseline" fill="var(--color-baseline)" name={baselineCountry} />
						{hasComparison &&
							<Bar dataKey="comparison" fill="var(--color-comparison)" name={comparisonCountry} />
						}
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
						<Scatter dataKey="baseline" fill="var(--color-baseline)" name={baselineCountry} />
						{hasComparison &&
							<Scatter dataKey="comparison" fill="var(--color-comparison)" name={comparisonCountry} />
						}
					</ScatterChart>
				)
			case 'Stacked Bar':
				return (
					<BarChart {...commonProps}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="date" />
						<YAxis />
						<ChartTooltip content={<ChartTooltipContent />} />
						<Legend />
						<Bar dataKey="baseline" stackId="a" fill="var(--color-baseline)" name={baselineCountry} />
						{hasComparison &&
							<Bar dataKey="comparison" stackId="a" fill="var(--color-comparison)" name={comparisonCountry} />
						}
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
						<Line type="monotone" dataKey="baseline" stroke="var(--color-baseline)" name={baselineCountry} />
						{hasComparison &&
							<Line type="monotone" dataKey="comparison" stroke="var(--color-comparison)" name={comparisonCountry} />
						}
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
						<Select onValueChange={setBaselineCountry} required defaultValue='Canada'>
							<SelectTrigger className="required:border-red-500">
								<SelectValue placeholder="Select country (required)" />
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
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
				<Card>
					<CardHeader>
						<CardTitle>Data Set</CardTitle>
						<CardDescription>Select the data set to compare</CardDescription>
					</CardHeader>
					<CardContent>
						<Select
							onValueChange={(value) => {
								setDataSet(JSON.parse(value));
								setMetric(null);
							}}
							defaultValue={JSON.stringify({
								label: "Case Deaths",
								value: "covid_cases_deaths",
							})}
							required
						>
							<SelectTrigger className="required:border-red-500">
								<SelectValue placeholder="Select data set (required)" />
							</SelectTrigger>
							<SelectContent>
								{dataSets.map((ds) => (
									<SelectItem
										key={ds.value}
										value={JSON.stringify(ds)}
									>
										{ds.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<CardTitle>Date Range</CardTitle>
						<CardDescription>Choose the date range to compare</CardDescription>
					</CardHeader>
					<CardContent>
						<DatePickerWithRange
							date={dateRange}
							setDate={(date) => setDateRange(date ?? {
								from: undefined,
								to: undefined,
							})}
						/>
					</CardContent>
				</Card>
			</div>

			<Card className="mb-4">
				<CardHeader>
					<CardTitle>Metric Selection</CardTitle>
					<CardDescription>Choose the metric to compare</CardDescription>
				</CardHeader>
				<CardContent>
					<Select
						onValueChange={(value) => {
							setMetric(value ? JSON.parse(value) : null);
							handleCompare();
						}}
						value={metric ? JSON.stringify(metric) : undefined}
						required
					>
						<SelectTrigger className="required:border-red-500">
							<SelectValue placeholder="Select metric (required)" />
						</SelectTrigger>
						<SelectContent>
							{metrics[dataSet?.label]?.map((m) => (
								<SelectItem
									key={m.value}
									value={JSON.stringify(m)}
								>
									{m.label}
								</SelectItem>
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
					{dataSet && ` | Data Set: ${dataSet.label}`}
					{dateRange?.from && dateRange?.to &&
						` | Date Range: ${format(dateRange.from, 'LLL dd, y')} - ${format(dateRange.to, 'LLL dd, y')}`}
					{metric && ` | Metric: ${metric.label}`}
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
