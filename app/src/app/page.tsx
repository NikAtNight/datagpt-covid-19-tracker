'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Input } from '~/components/ui/input'
import { Card, CardContent } from '~/components/ui/card'

// Dynamically import the Map component
const Map = dynamic(() => import('~/components/Map'), { ssr: false })

// Mock country data (replace with actual data fetching)
const countryData = [
	{ code: 'US', name: 'United States', lat: 37.0902, lng: -95.7129, cases: 1000000, deaths: 50000 },
	{ code: 'CA', name: 'Canada', lat: 56.1304, lng: -106.3468, cases: 500000, deaths: 25000 },
	{ code: 'IN', name: 'India', lat: 20.5937, lng: 78.9629, cases: 2000000, deaths: 100000 },
	{ code: 'BR', name: 'Brazil', lat: -14.2350, lng: -51.9253, cases: 1500000, deaths: 75000 },
	{ code: 'FR', name: 'France', lat: 46.2276, lng: 2.2137, cases: 750000, deaths: 37500 },
	{ code: 'DE', name: 'Germany', lat: 51.1657, lng: 10.4515, cases: 600000, deaths: 30000 },
]

export default function Home() {
	const [search, setSearch] = useState('')
	const [selectedCountry, setSelectedCountry] = useState(null)

	const filteredCountries = countryData.filter(country =>
		country.name.toLowerCase().includes(search.toLowerCase())
	)

	return (
		<div className="flex h-screen">
			{/* Sidebar */}
			<Card className="w-64 h-full overflow-hidden rounded-none border-r">
				<CardContent className="p-4 h-full flex flex-col">
					<Input
						type="text"
						placeholder="Search country..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="mb-4"
					/>
					<div className="overflow-auto flex-grow">
						<ul className="space-y-1">
							{filteredCountries.map(country => (
								<li
									key={country.code}
									className={`cursor-pointer p-2 rounded-md transition-colors ${selectedCountry === country ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
										}`}
									onClick={() => setSelectedCountry(country)}
								>
									{country.name}
								</li>
							))}
						</ul>
					</div>
				</CardContent>
			</Card>

			{/* Main content area with Map */}
			<main className="flex-1 p-6">
				<h1 className="text-2xl font-bold mb-4">COVID-19 Tracker</h1>
				<Card className="w-full h-[calc(100vh-8rem)]">
					<CardContent className="p-0 h-full">
						<Map countries={filteredCountries} selectedCountry={selectedCountry} />
					</CardContent>
				</Card>
			</main>
		</div>
	)
}
