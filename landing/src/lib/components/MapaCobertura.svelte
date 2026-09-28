<script lang="ts">
	/**
	 * Mapa de cobertura: dónde se ha ejecutado trabajo, con el tamaño del
	 * marcador proporcional al volumen.
	 *
	 * Sustituye a la cifra «41 municipios», que era falsa. Ese número salía de
	 * `count(DISTINCT ciudad_desarrollo)` sobre el texto crudo, así que contaba
	 * formas de escribir y no municipios: «YOPAL», «Yopal», «yopal», «yopal
	 * casanare» y «Yopal, Casanare» iban como cinco, y entre los 41 estaban
	 * «CASANARE» —el departamento—, «Vereda carrizales» y «villavicenio».
	 * Normalizado son 19, y un mapa los muestra sin necesidad de contarlos.
	 *
	 * Leaflet se carga solo en el cliente y solo cuando el mapa se acerca a la
	 * pantalla: son ~150 KB entre script y estilos que no deben entrar en el
	 * primer render de una página cuyo trabajo es vender.
	 */
	import { onMount } from 'svelte';
	import { CONTACT } from '$lib/seo/site';

	interface Municipio {
		municipio: string;
		departamento: string;
		servicios: number;
		lat: number | null;
		lon: number | null;
	}

	export let municipios: Municipio[] = [];
	/** Alto del lienzo. El mapa necesita una altura explícita o colapsa a cero. */
	export let alto = 'h-[26rem] sm:h-[32rem]';

	/** Sin coordenadas no hay punto que pintar; se listan aparte, no se ocultan. */
	$: ubicados = municipios.filter(
		(m): m is Municipio & { lat: number; lon: number } => m.lat !== null && m.lon !== null
	);
	$: sinUbicar = municipios.filter((m) => m.lat === null || m.lon === null);
	$: mayor = Math.max(1, ...ubicados.map((m) => m.servicios));
	/**
	 * La lista publica la parte del total, no el conteo: el total de servicios
	 * se comunica como umbral («+1.000») y sería incoherente que el desplegable
	 * permitiera reconstruir la cifra exacta sumando municipios.
	 */
	$: totalUbicado = municipios.reduce((suma, m) => suma + m.servicios, 0) || 1;
	$: parte = (servicios: number) => {
		const pct = (servicios / totalUbicado) * 100;
		return pct >= 1 ? `${Math.round(pct)}%` : '<1%';
	};

	let lienzo: HTMLDivElement;
	let cargado = false;
	let fallo = false;

	/**
	 * Radio del círculo. La raíz, no el valor: el área del círculo crece con el
	 * cuadrado del radio, así que un radio proporcional al conteo haría que
	 * Yopal —574 frente a 1— se leyera 574 veces más grande de lo que es. Con la
	 * raíz, el **área** es la que guarda la proporción, que es lo que el ojo
	 * compara.
	 */
	const radio = (servicios: number) => 6 + Math.sqrt(servicios / mayor) * 22;

	async function montar() {
		try {
			const L = await import('leaflet');
			await import('leaflet/dist/leaflet.css');

			const mapa = L.map(lienzo, {
				scrollWheelZoom: false, // Atrapar la rueda secuestra el desplazamiento de la página.
				attributionControl: true
			});

			/*
				Teselas de OpenStreetMap. El estilo claro de CARTO encajaba mejor con
				la paleta, pero desde que exige clave de API devuelve un 200 con una
				imagen de 2 KB que solo dice «API KEY REQUIRED»: el mapa salía
				cubierto de marcas de agua sin que nada fallara. OSM no pide clave.

				El color lo pone el CSS —escala de grises sobre `.leaflet-tile-pane`—,
				así que el fondo queda en el sistema señalético y los puntos navy y el
				cuadrado verde son lo único con color de la pieza.
			*/
			L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; colaboradores de <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
				maxZoom: 18
			}).addTo(mapa);

			for (const m of ubicados) {
				L.circleMarker([m.lat, m.lon], {
					radius: radio(m.servicios),
					color: '#223a54',
					weight: 2,
					fillColor: '#223a54',
					fillOpacity: 0.25
				})
					.addTo(mapa)
					.bindTooltip(
						`<strong>${m.municipio}</strong><br>${m.departamento}<br>${parte(m.servicios)} del trabajo ejecutado`,
						{ direction: 'top' }
					);
			}

			// La sede, en las mismas coordenadas que el mapa de Google del bloque
			// de contacto: si se mueve la ficha, se mueve en los dos sitios.
			const sede = L.divIcon({
				className: 'marca-sede',
				html: '<span class="marca-sede-punto"></span>',
				iconSize: [18, 18],
				iconAnchor: [9, 9]
			});
			L.marker([CONTACT.latitud, CONTACT.longitud], { icon: sede, zIndexOffset: 1000 })
				.addTo(mapa)
				.bindTooltip(`<strong>Sede ${CONTACT.ciudad}</strong><br>${CONTACT.departamento}`, {
					direction: 'top'
				});

			// El encuadre lo decide el dato, no una constante: si mañana entra un
			// municipio nuevo, el mapa lo incluye sin tocar nada.
			const puntos: [number, number][] = [
				...ubicados.map((m): [number, number] => [m.lat, m.lon]),
				[CONTACT.latitud, CONTACT.longitud]
			];
			mapa.fitBounds(L.latLngBounds(puntos).pad(0.12));

			cargado = true;
			return () => mapa.remove();
		} catch {
			// Si el mapa no carga, la lista de municipios de abajo sigue ahí y la
			// sección no se queda muda.
			fallo = true;
		}
	}

	onMount(() => {
		if (!ubicados.length) return;

		let limpiar: (() => void) | void;
		const cerca = new IntersectionObserver(
			(entradas) => {
				if (!entradas.some((e) => e.isIntersecting)) return;
				cerca.disconnect();
				void montar().then((f) => (limpiar = f));
			},
			{ rootMargin: '300px' }
		);
		cerca.observe(lienzo);

		return () => {
			cerca.disconnect();
			limpiar?.();
		};
	});
</script>

<div class="relative border border-gray-200 bg-marca-50 {alto}">
	<div bind:this={lienzo} class="h-full w-full"></div>

	{#if !cargado}
		<!--
			Lo que se ve mientras Leaflet llega, y lo que se queda si no llega: el
			recuadro no debe ser un hueco gris sin explicación.
		-->
		<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
			<p class="font-leyenda text-xs font-bold tracking-[0.08em] text-gray-600 uppercase">
				{fallo ? 'El mapa no pudo cargarse' : 'Cargando mapa…'}
			</p>
		</div>
	{/if}
</div>

<!--
	La misma información en texto. El mapa es la lectura rápida; esto es lo que
	leen el buscador, el lector de pantalla y quien tenga el mapa bloqueado.
-->
<details class="mt-4 border-t border-gray-200 pt-4">
	<summary
		class="cursor-pointer font-leyenda text-xs font-bold tracking-[0.08em] text-obliga uppercase"
	>
		Ver los municipios en lista
	</summary>
	<!--
		El relleno de la derecha deja pasar el botón flotante de WhatsApp: está
		fijo contra el borde de la ventana y por debajo de ~1.200px coincide con
		el borde del contenedor, donde van alineadas las cifras. Sin esto tapaba
		el porcentaje de la última fila visible. A `xl` el contenedor ya se
		separa del borde y el relleno sobra.
	-->
	<ul class="mt-4 grid gap-x-8 gap-y-1.5 pr-16 sm:grid-cols-2 lg:grid-cols-3 xl:pr-0">
		{#each municipios as m (m.municipio)}
			<li class="flex justify-between gap-4 border-b border-gray-200 py-1.5 text-sm">
				<span class="text-tinta"
					>{m.municipio}<span class="text-gray-600">, {m.departamento}</span></span
				>
				<span class="shrink-0 font-bold text-tinta tabular-nums">{parte(m.servicios)}</span>
			</li>
		{/each}
	</ul>
	{#if sinUbicar.length}
		<p class="mt-3 text-xs text-gray-600">
			{sinUbicar.length} sin coordenadas en el callejero, así que no aparecen en el mapa: {sinUbicar
				.map((m) => m.municipio)
				.join(', ')}.
		</p>
	{/if}
</details>

<style>
	/* El punto de la sede: cuadrado verde de condición segura, no el alfiler
	   azul por defecto de Leaflet, que es de otro sistema visual. */
	:global(.marca-sede-punto) {
		display: block;
		width: 18px;
		height: 18px;
		background: var(--color-segura);
		box-shadow: 0 0 0 3px var(--color-placa);
	}

	/* Leaflet trae su propia tipografía y su propio azul; aquí manda el sistema. */
	:global(.leaflet-container) {
		font-family: inherit;
		background: var(--color-marca-50);
	}

	/* La cartografía, apagada: el mapa es el soporte y los puntos son el dato.
	   Va sobre el panel de teselas y no sobre el contenedor, para no desaturar
	   también los marcadores ni los rótulos. */
	:global(.leaflet-tile-pane) {
		filter: grayscale(1) contrast(0.82) brightness(1.06);
	}

	:global(.leaflet-tooltip) {
		border: 0;
		border-radius: 0;
		background: var(--color-obliga);
		color: var(--color-obliga-tinta);
		font-size: 0.75rem;
		line-height: 1.35;
		box-shadow: none;
	}

	:global(.leaflet-tooltip-top::before) {
		border-top-color: var(--color-obliga);
	}
</style>
