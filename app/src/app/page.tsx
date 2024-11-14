'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { Input } from '~/components/ui/input'
import { Card, CardContent } from '~/components/ui/card'
import { useGetCountries } from '~/actions/mainHooks'

const Map = dynamic(() => import('~/components/Map'), { ssr: false })

export default function Home() {
	const [search, setSearch] = useState('')
	const [selectedCountry, setSelectedCountry] = useState(null)

	const { data: countries, isLoading } = useGetCountries()

	if (isLoading) return <div>Loading...</div>

	const filteredCountries = countries?.filter((country: any) =>
		country.location.toLowerCase().includes(search.toLowerCase())
	)

	console.log(countries)

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
							{filteredCountries?.map((country: any) => (
								<li
									key={country.iso_code}
									className={`cursor-pointer p-2 rounded-md transition-colors ${selectedCountry === country ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
										}`}
									onClick={() => setSelectedCountry(country)}
								>
									{country.location}
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
