'use client'

import { Card, CardContent } from '~/components/ui/card'

export default function Comparison() {

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-2xl font-bold mb-6">Compare Countries</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Add your comparison UI here */}
				<Card>
					<CardContent className="p-6">
						<h2 className="text-xl font-semibold mb-4">Select Countries to Compare</h2>
						{/* Add country selection UI */}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
