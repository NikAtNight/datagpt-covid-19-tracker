'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '~/lib/utils'

const navigation = [
	{ name: 'Dashboard', href: '/' },
	{ name: 'Comparison', href: '/pages/comparison' },
]

export default function Header() {
	const pathname = usePathname()

	return (
		<header className="border-b">
			<nav className="mx-auto flex items-center p-4">
				<div className="relative flex w-full items-center">
					<Link href="/" className="absolute left-0 flex items-center gap-2">
						<Image
							src="/logo.svg"
							alt="datagpt logo"
							width={150}
							height={32}
						/>
					</Link>
					<div className="flex w-full justify-center items-center gap-4">
						{navigation.map((item) => (
							<Link
								key={item.name}
								href={item.href}
								className={cn(
									'px-3 py-2 text-sm font-medium rounded-md transition-colors',
									pathname === item.href
										? ''
										: 'text-muted-foreground hover:text-foreground hover:bg-muted'
								)}
							>
								{item.name}
							</Link>
						))}
					</div>
				</div>
			</nav>
		</header>
	)
}
