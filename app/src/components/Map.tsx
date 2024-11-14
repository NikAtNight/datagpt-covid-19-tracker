'use client'

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { useEffect, useRef } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Circle } from 'lucide-react'

// Fix for default marker icon
const createCustomIcon = (color) => {
	const iconHtml = renderToStaticMarkup(
		<Circle className="text-primary" fill={color} size={24} />
	)
	return L.divIcon({
		html: iconHtml,
		className: 'custom-icon',
		iconSize: [24, 24],
		iconAnchor: [12, 12],
	})
}

// Component to handle map zooming and centering
function MapViewHandler({ selectedCountry }) {
	const map = useMap()

	useEffect(() => {
		if (selectedCountry) {
			map.setView([selectedCountry.lat, selectedCountry.lng], 5, { animate: true })
		}
	}, [selectedCountry, map])

	return null
}

export default function Map({ countries, selectedCountry }) {
	return (
		<MapContainer
			className="w-full h-full"
			center={selectedCountry ? [selectedCountry.lat, selectedCountry.lng] : [20, 0]}
			zoom={selectedCountry ? 4 : 2}
			scrollWheelZoom={false}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{countries.map((country) => (
				<Marker
					key={country.code}
					position={[country.lat, country.lng]}
					icon={createCustomIcon(country === selectedCountry ? '#ff0000' : '#0000ff')}
				>
					<Popup>
						<div className="text-center">
							<h3 className="font-bold">{country.name}</h3>
							<p>Cases: {country.cases.toLocaleString()}</p>
							<p>Deaths: {country.deaths.toLocaleString()}</p>
						</div>
					</Popup>
				</Marker>
			))}
			<MapViewHandler selectedCountry={selectedCountry} />
		</MapContainer>
	)
}
