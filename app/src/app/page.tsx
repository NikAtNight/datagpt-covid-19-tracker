'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Input } from '~/components/ui/input'
import { Card, CardContent } from '~/components/ui/card'
import { useGetCountriesStats } from '~/actions/countryHooks'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Globe2, TrendingUp, Users } from 'lucide-react'
import RegionCard from '~/components/Region'
import { LatestCovidByCountry } from '~covid/models/countries'

const Map = dynamic(() => import('~/components/Map'), {
	ssr: false,
	loading: () => (
		<div className="w-full h-full flex items-center justify-center bg-muted/10">
			<p className="text-muted-foreground">Loading map...</p>
		</div>
	),
})

export default function Home() {
	const [search, setSearch] = useState('')
	const [selectedCountry, setSelectedCountry] = useState<LatestCovidByCountry | null>(null)
	const [regions, setRegions] = useState<LatestCovidByCountry[]>([])
	const [allCountries, setAllCountries] = useState<LatestCovidByCountry[]>([])
	const { data: countries, isLoading } = useGetCountriesStats()

	useEffect(() => {
		if (!countries) return
		const with_owid = countries.filter((country) => country.iso_code.includes('OWID'))
		setRegions(with_owid)

		const without_owid = countries.filter((country) => !country.iso_code.includes('OWID'))
		setAllCountries(without_owid)
	}, [countries])

	if (isLoading || !countries) {
		return (
			<div className="flex h-screen items-center justify-center">
				<p className="text-muted-foreground">Loading...</p>
			</div>
		)
	}

	console.log(regions)

	const filteredCountries = allCountries?.filter((country) =>
		country.location.toLowerCase().includes(search.toLowerCase())
	)

	const continents = regions.filter((region) =>
		['OWID_AFR', 'OWID_ASI', 'OWID_EUR', 'OWID_NAM', 'OWID_OCE', 'OWID_SAM'].includes(region.iso_code)
	)

	const economicClassifications = regions.filter((region) =>
		['OWID_HIC', 'OWID_LMC', 'OWID_LIC', 'OWID_UMC'].includes(region.iso_code)
	)

	const otherRegions = regions.filter((region) =>
		['OWID_EUN', 'OWID_KOS', 'OWID_WRL'].includes(region.iso_code)
	)

	return (
		<div className="flex h-screen overflow-hidden">
			<Card className="w-80 flex-shrink-0 rounded-none border-r">
				<CardContent className="p-4 h-full flex flex-col gap-4">
					<Input
						type="text"
						placeholder="Search country..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<div className="overflow-y-auto flex-1 -mx-2">
						<ul className="space-y-1 px-2">
							{filteredCountries?.map((country) => (
								<li
									key={country.iso_code}
									className={`cursor-pointer p-2 rounded-md transition-colors ${selectedCountry === country
										? 'bg-primary text-primary-foreground'
										: 'hover:bg-muted'
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

			<div className="flex-1 flex flex-col min-w-0">
				<div className="flex-shrink-0 p-6 pb-2">
					<h1 className="text-2xl font-bold">COVID-19 Tracker</h1>
				</div>

				<div className="flex-1 px-6 min-h-[400px]">
					{countries && (
						<div className="w-full h-full rounded-lg border overflow-hidden">
							<Map countries={filteredCountries} selectedCountry={selectedCountry} />
						</div>
					)}
				</div>

				<div className="flex-shrink-0 p-6 pt-4">
					<Tabs defaultValue="continents" className="w-full">
						<TabsList className="grid w-full grid-cols-3">
							<TabsTrigger value="continents" className="flex items-center gap-2">
								<Globe2 className="h-4 w-4" />
								Continents
							</TabsTrigger>
							<TabsTrigger value="economic" className="flex items-center gap-2">
								<TrendingUp className="h-4 w-4" />
								Economic Classifications
							</TabsTrigger>
							<TabsTrigger value="other" className="flex items-center gap-2">
								<Users className="h-4 w-4" />
								Other Regions
							</TabsTrigger>
						</TabsList>
						<TabsContent value="continents" className="mt-4">
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
								{continents.map((region) => (
									<RegionCard key={region.iso_code} region={region} />
								))}
							</div>
						</TabsContent>
						<TabsContent value="economic" className="mt-4">
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
								{economicClassifications.map((region) => (
									<RegionCard key={region.iso_code} region={region} />
								))}
							</div>
						</TabsContent>
						<TabsContent value="other" className="mt-4">
							<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
								{otherRegions.map((region) => (
									<RegionCard key={region.iso_code} region={region} />
								))}
							</div>
						</TabsContent>
					</Tabs>
				</div>
			</div>
		</div>
	)
}
