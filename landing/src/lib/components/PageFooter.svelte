<script lang="ts">
	/**
	 * Pie con enlazado interno completo. Además de servir al visitante, distribuye
	 * autoridad hacia servicios y cobertura, que son las páginas que deben posicionar.
	 *
	 * En el mundo señalético el pie es la placa de obligación que cierra la
	 * página: campo navy, encabezados de columna como bandas de leyenda en
	 * versales estrechas, y un filete verde que marca la columna al recorrerla
	 * con el teclado. Ningún degradado, ninguna sombra difusa.
	 */
	import { resolve } from '$app/paths';
	import { serviciosData } from '$lib/data/servicios';
	import { CONTACT, REGIONES, FACEBOOK_URL } from '$lib/seo/site';
	import Icono from './Icono.svelte';

	const servicios = Object.values(serviciosData);
</script>

<footer class="bg-obliga text-marca-200">
	<div class="container mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-16">
		<div class="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
			<div>
				<img
					src="/assets/logo-white.png"
					alt="SEGISPRO Ingeniería"
					width="144"
					height="36"
					class="h-9 w-auto"
				/>
				<p class="mt-4 max-w-[34ch] text-sm leading-relaxed">
					Sistemas de gestión en seguridad, salud laboral, medio ambiente y calidad desde 2009.
				</p>
				<a
					href={resolve('/trabaja-con-nosotros')}
					class="mt-6 inline-block border-b-2 border-segura pb-1 font-leyenda text-xs font-bold tracking-[0.08em] text-white uppercase transition-colors hover:border-white"
				>
					Trabaja con nosotros
				</a>
			</div>

			<nav aria-labelledby="pie-servicios">
				<h2
					id="pie-servicios"
					class="border-b border-marca-700 pb-2 font-leyenda text-xs font-bold tracking-[0.09em] text-white uppercase"
				>
					Servicios
				</h2>
				<ul class="mt-4 space-y-2.5 text-sm">
					{#each servicios as servicio (servicio.slug)}
						<li>
							<a
								href={resolve('/servicios/[slug]', { slug: servicio.slug })}
								class="transition-colors hover:text-white">{servicio.title}</a
							>
						</li>
					{/each}
				</ul>
			</nav>

			<nav aria-labelledby="pie-cobertura">
				<h2
					id="pie-cobertura"
					class="border-b border-marca-700 pb-2 font-leyenda text-xs font-bold tracking-[0.09em] text-white uppercase"
				>
					Cobertura
				</h2>
				<ul class="mt-4 space-y-2.5 text-sm">
					{#each REGIONES as region (region.slug)}
						<li>
							<a
								href={resolve('/cobertura/[region]', { region: region.slug })}
								class="transition-colors hover:text-white">{region.nombre}</a
							>
						</li>
					{/each}
				</ul>
			</nav>

			<div>
				<h2
					class="border-b border-marca-700 pb-2 font-leyenda text-xs font-bold tracking-[0.09em] text-white uppercase"
				>
					Contacto
				</h2>
				<ul class="mt-4 space-y-3 text-sm">
					<li class="flex items-start gap-2.5">
						<Icono nombre="telefono" class="mt-0.5 h-4 w-4 shrink-0 text-segura" />
						<a href="tel:{CONTACT.telefono}" class="transition-colors hover:text-white"
							>{CONTACT.telefonoVisible}</a
						>
					</li>
					<li class="flex items-start gap-2.5">
						<Icono nombre="correo" class="mt-0.5 h-4 w-4 shrink-0 text-segura" />
						<a href="mailto:{CONTACT.email}" class="break-all transition-colors hover:text-white"
							>{CONTACT.email}</a
						>
					</li>
					<li class="flex items-start gap-2.5">
						<Icono nombre="ubicacion" class="mt-0.5 h-4 w-4 shrink-0 text-segura" />
						<span>{CONTACT.ciudad}, {CONTACT.departamento}, Colombia</span>
					</li>
				</ul>
				<a
					href={FACEBOOK_URL}
					target="_blank"
					rel="noopener"
					class="mt-5 inline-block font-leyenda text-xs font-bold tracking-[0.08em] uppercase transition-colors hover:text-white"
				>
					Facebook
				</a>
			</div>
		</div>

		<!--
			`gray-500` sobre navy daba 3,66:1 y a 12px WCAG AA exige 4,5:1. El paso
			`marca-200` sobre `marca-800` lo sube muy por encima sin engordar la línea.
			El enlace de marca apuntaba a `segispro.co`, un host que redirige y por
			tanto descarta la señal; ahora usa `SITE_URL`, que es el apex canónico.
		-->
		<div
			class="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-marca-700 pt-6 text-xs"
		>
			<p>
				© {new Date().getFullYear()} SEGISPRO Ingeniería S.A.S. Todos los derechos reservados.
			</p>
			<a href={resolve('/politicas-de-privacidad')} class="transition-colors hover:text-white"
				>Política de privacidad</a
			>
		</div>
	</div>
</footer>
