<script lang="ts">
	/**
	 * Pie con enlazado interno completo. Además de servir al usuario, distribuye
	 * autoridad hacia servicios y cobertura, que son las páginas que deben posicionar.
	 */
	import { resolve } from '$app/paths';
	import { serviciosData } from '$lib/data/servicios';
	import { CONTACT, REGIONES } from '$lib/seo/site';

	const servicios = Object.values(serviciosData);
</script>

<footer class="bg-gray-900 px-4 py-14 text-gray-300 sm:px-6">
	<div class="container mx-auto grid max-w-6xl gap-10 md:grid-cols-4">
		<div class="md:col-span-1">
			<img
				src="/assets/logo-white.png"
				alt="SEGISPRO Ingeniería"
				width="144"
				height="36"
				class="mb-4 h-9 w-36"
			/>
			<p class="text-sm leading-relaxed text-gray-400">
				Sistemas de gestión en seguridad, salud laboral, medio ambiente y calidad desde 2009.
			</p>
		</div>

		<div>
			<h2 class="mb-3 text-sm font-semibold tracking-wide text-white uppercase">Servicios</h2>
			<ul class="space-y-2 text-sm">
				{#each servicios as servicio (servicio.slug)}
					<li>
						<a
							href={resolve('/servicios/[slug]', { slug: servicio.slug })}
							class="transition-colors hover:text-blue-400">{servicio.title}</a
						>
					</li>
				{/each}
			</ul>
		</div>

		<div>
			<h2 class="mb-3 text-sm font-semibold tracking-wide text-white uppercase">Cobertura</h2>
			<ul class="space-y-2 text-sm">
				{#each REGIONES as region (region.slug)}
					<li>
						<a
							href={resolve('/cobertura/[region]', { region: region.slug })}
							class="transition-colors hover:text-blue-400">{region.nombre}</a
						>
					</li>
				{/each}
			</ul>
		</div>

		<div>
			<h2 class="mb-3 text-sm font-semibold tracking-wide text-white uppercase">Contacto</h2>
			<ul class="space-y-2 text-sm">
				<li>
					<a href="tel:{CONTACT.telefono}" class="hover:text-blue-400">{CONTACT.telefonoVisible}</a>
				</li>
				<li><a href="mailto:{CONTACT.email}" class="hover:text-blue-400">{CONTACT.email}</a></li>
				<li>{CONTACT.ciudad}, {CONTACT.departamento}, Colombia</li>
				<li>
					<a href={resolve('/trabaja-con-nosotros')} class="hover:text-blue-400"
						>Trabaja con nosotros</a
					>
				</li>
				<li>
					<a href={resolve('/politicas-de-privacidad')} class="hover:text-blue-400"
						>Política de privacidad</a
					>
				</li>
			</ul>
		</div>
	</div>

	<!--
		`gray-500` sobre `gray-900` da 3,66:1 y a 12px WCAG AA exige 4,5:1.
		`gray-400` lo sube a 6,8:1 sin cambiar el peso visual de la línea.
	-->
	<div
		class="container mx-auto mt-10 max-w-6xl border-t border-gray-800 pt-6 text-xs text-gray-400"
	>
		© {new Date().getFullYear()} SEGISPRO Ingeniería S.A.S. Todos los derechos reservados.
	</div>
</footer>
