'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useState } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Circle } from 'lucide-react'
import { countryCoordinates } from '~/lib/countryCoordinates'

// Fix for default marker icon
const createCustomIcon = (color: string) => {
	const iconHtml = renderToStaticMarkup(
		<Circle className="text-primary" fill={color} size={16} />
	)
	return L.divIcon({
		html: iconHtml,
		className: 'custom-icon',
		iconSize: [16, 16],
		iconAnchor: [8, 8],
	})
}

// Component to handle map zooming and centering
function MapViewHandler({ selectedCountry }: { selectedCountry: any }) {
	const map = useMap()

	useEffect(() => {
		if (selectedCountry) {
			const coordinates = countryCoordinates[selectedCountry.iso_code]
			if (!coordinates) return
			map.setView([coordinates.lat, coordinates.lng], 5, { animate: true })
		}
	}, [selectedCountry, map])

	return null
}

export default function Map({ countries, selectedCountry }: { countries: any, selectedCountry: any }) {
	const [map, setMap] = useState<L.Map | null>(null)
	const selectedCountryFull = selectedCountry
		? { ...selectedCountry, ...countryCoordinates[selectedCountry.iso_code] }
		: null


	useEffect(() => {
		return () => {
			if (map) {
				map.remove()
			}
		}
	}, [map])

	if (typeof window === 'undefined') return null

	return (
		<MapContainer
			className="w-full h-full"
			center={selectedCountryFull ? [selectedCountryFull.lat, selectedCountryFull.lng] : [20, 0]}
			zoom={selectedCountry ? 4 : 2}
			scrollWheelZoom={false}
			ref={(map) => setMap(map as L.Map)}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{countries.map((country: any) => {
				const coordinates = countryCoordinates[country.iso_code]
				if (!coordinates) return null
				return (
					<Marker
						key={country.iso_code}
						position={[coordinates.lat, coordinates.lng]}
						icon={createCustomIcon(country === selectedCountry ? '#ff0000' : '#0000ff')}
						eventHandlers={{
							mouseover: (event: any) => event.target.openPopup(),
							mouseout: (event: any) => event.target.closePopup(),
						}}
					>
						<Popup>
							<div className="text-center">
								<h3 className="font-bold">{country.location}</h3>
								<p>Cases: {Number(country.total_cases).toLocaleString()}</p>
								<p>Deaths: {Number(country.total_deaths).toLocaleString()}</p>
							</div>
						</Popup>
					</Marker>
				)
			})}
			<MapViewHandler selectedCountry={selectedCountry} />
		</MapContainer>
	)
}
