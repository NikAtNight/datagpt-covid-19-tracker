'use client'

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { LatestCovidByCountry } from "~covid/models/countries"

const formatNumber = (num: string | null) => {
	if (!num) return 'N/A'
	return parseInt(num).toLocaleString()
}

const RegionCard = ({ region }: { region: LatestCovidByCountry }) => {
	const casesPerMillion = (parseInt(region.total_cases ?? '0') / parseInt(region.population ?? '1') * 1000000).toFixed(2)
	const deathsPerMillion = (parseInt(region.total_deaths ?? '0') / parseInt(region.population ?? '1') * 1000000).toFixed(2)
	return (
		<Card className="h-full">
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>{region.location}</span>
					<span className="text-sm font-normal text-muted-foreground">{region.iso_code}</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 gap-4">
					<div className="flex flex-col">
						<span className="text-sm font-medium text-muted-foreground">Total Cases</span>
						<span className="text-xl font-bold">{formatNumber(region.total_cases)}</span>
						<span className="text-sm text-muted-foreground">{casesPerMillion} per million</span>
					</div>
					<div className="flex flex-col">
						<span className="text-sm font-medium text-muted-foreground">Total Deaths</span>
						<span className="text-xl font-bold">{formatNumber(region.total_deaths)}</span>
						<span className="text-sm text-muted-foreground">{deathsPerMillion} per million</span>
					</div>
					<div className="flex flex-col">
						<span className="text-sm font-medium text-muted-foreground">Vaccinations</span>
						<span className="text-xl font-bold">{formatNumber(region.total_vaccinations)}</span>
					</div>
					<div className="flex flex-col">
						<span className="text-sm font-medium text-muted-foreground">Population</span>
						<span className="text-xl font-bold">{formatNumber(region.population)}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

export default RegionCard
