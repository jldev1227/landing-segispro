<script lang="ts">
	/**
	 * Cabecera de las páginas interiores, en el mismo sistema señalético del home:
	 * placa de obligación opaca, logotipo blanco y enlaces en versales estrechas.
	 *
	 * Antes era una barra blanca con un botón azul de la paleta anterior, y todos
	 * los enlaces salvo dos iban ocultos con `sm:block`: en un teléfono la única
	 * forma de llegar a Servicios o a Cobertura desde una ficha era el pie. Ahora
	 * hay cajón móvil, con los mismos destinos.
	 */
	import { resolve } from '$app/paths';
	import { CAMPUS_CURSOS, CAMPUS_VERIFICAR } from '$lib/seo/site';
	import { serviciosData } from '$lib/data/servicios';
	import Icono from './Icono.svelte';

	/** Sección que la página actual ocupa, para marcarla con el filete verde. */
	export let activa: 'servicios' | 'cobertura' | 'trabaja' | 'certificado' | '' = '';

	const SEGISPRO_APP_URL = import.meta.env.VITE_APP_SEGISPRO || 'http://localhost:5174';
	const servicios = Object.values(serviciosData);

	let abierto = false;

	const enlaces = [
		{
			clave: 'servicios' as const,
			texto: 'Servicios',
			href: `${resolve('/')}#services`,
			externo: false
		},
		{
			clave: 'cobertura' as const,
			texto: 'Cobertura',
			href: resolve('/cobertura'),
			externo: false
		},
		{
			clave: 'trabaja' as const,
			texto: 'Trabaja con nosotros',
			href: resolve('/trabaja-con-nosotros'),
			externo: false
		},
		{
			clave: 'certificado' as const,
			texto: 'Validar certificado',
			href: CAMPUS_VERIFICAR,
			externo: true
		}
	];
</script>

<header class="fixed top-0 right-0 left-0 z-50 bg-obliga">
	<nav class="container mx-auto max-w-7xl px-6 sm:px-8" aria-label="Principal">
		<div class="flex h-20 items-center justify-between gap-6">
			<a
				href={resolve('/')}
				class="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
			>
				<img
					src="/assets/logo-white.png"
					alt="SEGISPRO Ingeniería"
					width="144"
					height="36"
					class="h-8 w-auto sm:h-9"
				/>
			</a>

			<div class="hidden items-center gap-7 lg:flex">
				{#each enlaces as enlace (enlace.clave)}
					<a
						href={enlace.href}
						target={enlace.externo ? '_blank' : undefined}
						rel={enlace.externo ? 'noopener' : undefined}
						aria-current={activa === enlace.clave ? 'page' : undefined}
						class="relative py-2 font-leyenda text-xs font-bold tracking-[0.07em] uppercase transition-colors {activa ===
						enlace.clave
							? 'text-white'
							: 'text-marca-200 hover:text-white'}"
					>
						{enlace.texto}
						{#if activa === enlace.clave}
							<span class="absolute inset-x-0 -bottom-0.5 h-0.5 bg-segura"></span>
						{/if}
					</a>
				{/each}
				<a
					href={CAMPUS_CURSOS}
					target="_blank"
					rel="noopener"
					class="py-2 font-leyenda text-xs font-bold tracking-[0.07em] text-marca-200 uppercase transition-colors hover:text-white"
				>
					Formación
				</a>
				<a
					href={SEGISPRO_APP_URL}
					class="rounded-suave bg-segura px-4 py-2.5 font-leyenda text-xs font-bold tracking-[0.07em] text-segura-tinta uppercase transition-transform duration-150 hover:-translate-y-0.5"
				>
					Ingreso
				</a>
			</div>

			<button
				type="button"
				class="flex h-11 w-11 items-center justify-center text-white lg:hidden"
				aria-label={abierto ? 'Cerrar menú' : 'Abrir menú'}
				aria-expanded={abierto}
				on:click={() => (abierto = !abierto)}
			>
				<Icono nombre={abierto ? 'cerrar' : 'menu'} class="h-6 w-6" />
			</button>
		</div>
	</nav>
</header>

{#if abierto}
	<div class="fixed inset-0 z-40 lg:hidden">
		<button
			type="button"
			class="absolute inset-0 bg-marca-950/70"
			aria-label="Cerrar menú"
			on:click={() => (abierto = false)}
		></button>

		<div class="absolute top-20 right-0 left-0 max-h-[calc(100dvh-5rem)] overflow-y-auto bg-obliga">
			<nav class="container mx-auto max-w-7xl px-6 py-6" aria-label="Menú">
				<ul class="divide-y divide-marca-700">
					{#each enlaces as enlace (enlace.clave)}
						<li>
							<a
								href={enlace.href}
								target={enlace.externo ? '_blank' : undefined}
								rel={enlace.externo ? 'noopener' : undefined}
								aria-current={activa === enlace.clave ? 'page' : undefined}
								class="flex items-center gap-3 py-4 font-leyenda text-sm font-bold tracking-[0.07em] uppercase {activa ===
								enlace.clave
									? 'text-white'
									: 'text-marca-200'}"
								on:click={() => (abierto = false)}
							>
								<span
									class="h-4 w-1 shrink-0 {activa === enlace.clave
										? 'bg-segura'
										: 'bg-transparent'}"
								></span>
								{enlace.texto}
							</a>
						</li>
					{/each}
				</ul>

				<!--
					El portafolio completo, porque desde una ficha de servicio el visitante
					suele querer la ficha de al lado y no la portada.
				-->
				<p class="mt-6 font-leyenda text-xs font-bold tracking-[0.1em] text-marca-400 uppercase">
					Portafolio
				</p>
				<ul class="mt-3 divide-y divide-marca-800">
					{#each servicios as servicio (servicio.slug)}
						<li>
							<a
								href={resolve('/servicios/[slug]', { slug: servicio.slug })}
								class="block py-3 text-sm text-marca-200"
								on:click={() => (abierto = false)}
							>
								{servicio.title}
							</a>
						</li>
					{/each}
				</ul>

				<div class="mt-6 grid gap-3">
					<a
						href="{resolve('/')}#contacto"
						class="rounded-suave bg-segura px-5 py-4 text-center font-leyenda text-sm font-bold tracking-[0.08em] text-segura-tinta uppercase"
						on:click={() => (abierto = false)}
					>
						Solicitar cotización
					</a>
					<a
						href={CAMPUS_CURSOS}
						target="_blank"
						rel="noopener"
						class="rounded-suave border-2 border-marca-400 px-5 py-4 text-center font-leyenda text-sm font-bold tracking-[0.08em] text-white uppercase"
					>
						Formación
					</a>
				</div>
			</nav>
		</div>
	</div>
{/if}
