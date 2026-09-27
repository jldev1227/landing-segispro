<script lang="ts">
	/** Cabecera compacta para las páginas interiores, con el mismo lenguaje visual del home. */
	import { resolve } from '$app/paths';
	import { CAMPUS_CURSOS } from '$lib/seo/site';
</script>

<header class="fixed top-0 right-0 left-0 z-50 bg-white shadow-md">
	<nav class="container mx-auto px-4 py-4 sm:px-6">
		<div class="flex items-center justify-between">
			<a href={resolve('/')} class="group flex items-center">
				<img
					src="/assets/logo.png"
					alt="SEGISPRO Ingeniería"
					width="144"
					height="36"
					class="h-8 w-32 transition-transform duration-300 group-hover:scale-105 sm:h-9 sm:w-36"
				/>
			</a>
			<div class="flex items-center gap-4 sm:gap-6">
				<a
					href={CAMPUS_CURSOS}
					target="_blank"
					rel="noopener"
					class="hidden text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 sm:block"
				>
					Formación
				</a>
				<a
					href={resolve('/cobertura')}
					class="hidden text-sm font-medium text-gray-700 transition-colors hover:text-blue-600 sm:block"
				>
					Cobertura
				</a>
				<a
					href={resolve('/validar-certificado')}
					class="text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
				>
					Validar certificado
				</a>
				<a
					href={resolve('/')}
					class="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
				>
					Inicio
				</a>
			</div>
		</div>
	</nav>
</header>
