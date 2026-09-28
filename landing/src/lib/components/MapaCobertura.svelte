<script lang="ts">
	/**
	 * Mapa de cobertura: los municipios donde se concentra el trabajo, pintados
	 * sobre su propio contorno.
	 *
	 * Sustituye a la cifra «41 municipios», que era falsa: salía de un
	 * `count(DISTINCT ciudad_desarrollo)` sobre el texto crudo, así que contaba
	 * formas de escribir y no municipios —«YOPAL», «Yopal», «yopal», «yopal
	 * casanare» y «Yopal, Casanare» iban como cinco— y entre los 41 estaban
	 * «CASANARE», que es el departamento, «Vereda carrizales» y «villavicenio».
	 *
	 * Y no la sustituye por el número corregido. Ninguna cifra de municipios
	 * ayuda aquí: decir «19» invita a compararla con el mapa nacional del
	 * competidor de turno, y el argumento de SEGISPRO no es extensión, es
	 * arraigo. El mapa enseña dónde se trabaja y calla cuánto.
	 *
	 * Los contornos son el Marco Geoestadístico Nacional del DANE, recortado a
	 * Casanare y simplificado por `scripts/extraer-casanare.py`: 9 KB.
	 */
	import { onMount } from 'svelte';
	import { CONTACT } from '$lib/seo/site';

	interface Zona {
		municipio: string;
		departamento: string;
		lat: number | null;
		lon: number | null;
	}

	/** Los municipios que se destacan. Llegan ya recortados a los de cabecera. */
	export let zonas: Zona[] = [];
	/** Alto del lienzo. El mapa necesita altura explícita o colapsa a cero. */
	export let alto = 'h-[26rem] sm:h-[32rem]';

	/** El emparejamiento con el contorno va por nombre sin tildes y en caja alta. */
	const clave = (nombre: string) =>
		nombre.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().trim();

	let lienzo: HTMLDivElement;
	let cargado = false;
	let fallo = false;

	async function montar() {
		try {
			const [L, { default: casanare }] = await Promise.all([
				import('leaflet'),
				import('$lib/data/casanare-municipios.json'),
				import('leaflet/dist/leaflet.css')
			]);

			const mapa = L.map(lienzo, {
				// Atrapar la rueda dentro del mapa secuestra el desplazamiento de la
				// página, que es lo que el visitante está haciendo en realidad.
				scrollWheelZoom: false,
				zoomControl: true,
				attributionControl: true
			});

			/*
				Teselas de OpenStreetMap. El estilo claro de CARTO encajaba mejor con
				la paleta, pero desde que exige clave de API devuelve un 200 con una
				imagen de 2 KB que solo dice «API KEY REQUIRED»: el mapa salía
				cubierto de marcas de agua sin que nada fallara. OSM no pide clave.

				El gris lo pone el CSS sobre el panel de teselas, así que el color
				queda reservado a los municipios y a la sede.
			*/
			L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
				attribution:
					'&copy; colaboradores de <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
				maxZoom: 14,
				minZoom: 6
			}).addTo(mapa);

			const destacados = new Set(zonas.map((z) => clave(z.municipio)));
			const coleccion = casanare as GeoJSON.FeatureCollection;

			/*
				Casanare entero, en dos capas. Primero el departamento como un trazo
				fino: sin él los seis municipios flotarían sueltos sobre la
				cartografía y no se vería que son parte de una misma plaza. Encima,
				los destacados con el campo de color.
			*/
			L.geoJSON(coleccion, {
				style: { color: '#9cb3ce', weight: 1, fill: true, fillColor: '#ffffff', fillOpacity: 0.6 },
				interactive: false
			}).addTo(mapa);

			const soloDestacados: GeoJSON.FeatureCollection = {
				type: 'FeatureCollection',
				features: coleccion.features.filter((f) =>
					destacados.has(String(f.properties?.clave ?? ''))
				)
			};

			L.geoJSON(soloDestacados, {
				// Opacidad alta a propósito: a 0,45 sobre la cartografía en gris el navy
				// se leía como otro gris y los seis municipios no se distinguían del
				// resto del departamento, que es lo único que el mapa tiene que decir.
				style: { color: '#16202e', weight: 1.5, fillColor: '#223a54', fillOpacity: 0.8 },
				onEachFeature: (rasgo, capa) => {
					// El rótulo es el nombre y nada más: sin conteo, sin porcentaje.
					capa.bindTooltip(String(rasgo.properties?.nombre ?? ''), {
						permanent: false,
						direction: 'top'
					});
				}
			}).addTo(mapa);

			/*
				Si algún municipio de cabecera no está en el recorte de Casanare
				—porque el trabajo se movió a otro departamento—, se marca con un
				punto en sus coordenadas. Sin esto desaparecería del mapa en
				silencio, que es la peor forma de equivocarse con un dato.
			*/
			const fuera = zonas.filter(
				(z) =>
					!coleccion.features.some((f) => String(f.properties?.clave ?? '') === clave(z.municipio))
			);
			for (const z of fuera) {
				if (z.lat === null || z.lon === null) continue;
				L.circleMarker([z.lat, z.lon], {
					radius: 9,
					color: '#223a54',
					weight: 2,
					fillColor: '#223a54',
					fillOpacity: 0.8
				})
					.addTo(mapa)
					.bindTooltip(z.municipio, { direction: 'top' });
			}

			// La sede, en las mismas coordenadas que el mapa de Google del bloque de
			// contacto: si se mueve la ficha, se mueve en los dos sitios.
			L.marker([CONTACT.latitud, CONTACT.longitud], {
				icon: L.divIcon({
					className: 'marca-sede',
					html: '<span class="marca-sede-punto"></span>',
					iconSize: [16, 16],
					iconAnchor: [8, 8]
				}),
				zIndexOffset: 1000
			})
				.addTo(mapa)
				.bindTooltip(`Sede ${CONTACT.ciudad}`, { direction: 'top' });

			/*
				El encuadre es Casanare entero, no la caja de los seis municipios.

				Con la caja de los destacados el mapa se abría tanto que entraban
				Medellín, Bogotá y Villavicencio, y el departamento quedaba como una
				mancha pequeña en el centro. El departamento como marco da la lectura
				correcta: estos seis, dentro de esta plaza.

				`maxBounds` impide que el arrastre se lleve el mapa a mar abierto, y
				el zoom mínimo se fija al encuadre inicial para que nadie pueda
				alejarse hasta perder Casanare de vista.
			*/
			const casanareEntero = L.geoJSON(coleccion).getBounds();
			mapa.fitBounds(casanareEntero.pad(0.04));
			mapa.setMaxBounds(casanareEntero.pad(0.6));
			mapa.setMinZoom(mapa.getZoom());

			cargado = true;
			return () => mapa.remove();
		} catch {
			// Si el mapa no carga, la lista de abajo sigue ahí y la sección no se
			// queda muda.
			fallo = true;
		}
	}

	onMount(() => {
		if (!zonas.length) return;

		let limpiar: (() => void) | void;
		// Leaflet más los contornos son ~160 KB que no deben entrar en el primer
		// render de una página cuyo trabajo es vender.
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

<!--
	`isolation: isolate` crea un contexto de apilamiento propio. Leaflet coloca
	sus paneles en z-index 400–700 y sus controles en 800–1000, muy por encima
	del encabezado fijo, que está en 50: al desplazar la página, el mapa pasaba
	por delante de la barra de navegación. Encerrados en este contexto, esos
	valores solo compiten entre ellos.
-->
<div
	class="relative isolate overflow-hidden rounded-suave border border-gray-200 bg-marca-50 {alto}"
>
	<div bind:this={lienzo} class="h-full w-full"></div>

	{#if !cargado}
		<!-- Lo que se ve mientras Leaflet llega, y lo que queda si no llega. -->
		<div class="pointer-events-none absolute inset-0 flex items-center justify-center">
			<p class="font-leyenda text-xs font-bold tracking-[0.08em] text-gray-600 uppercase">
				{fallo ? 'El mapa no pudo cargarse' : 'Cargando mapa…'}
			</p>
		</div>
	{/if}
</div>

<!--
	Los mismos municipios en texto, sin cifras. Es lo que leen el buscador, el
	lector de pantalla y quien tenga el mapa bloqueado.
-->
<ul class="mt-5 flex flex-wrap gap-x-6 gap-y-2">
	{#each zonas as zona (zona.municipio)}
		<li class="flex items-center gap-2">
			<span class="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-obliga" aria-hidden="true"></span>
			<span class="font-leyenda text-sm font-bold tracking-[0.05em] text-tinta uppercase">
				{zona.municipio}
			</span>
			<span class="text-xs text-gray-600">{zona.departamento}</span>
		</li>
	{/each}
</ul>

<style>
	/* La sede: cuadrado verde de condición segura, no el alfiler azul por
	   defecto de Leaflet, que pertenece a otro sistema visual. */
	:global(.marca-sede-punto) {
		display: block;
		width: 16px;
		height: 16px;
		border-radius: var(--radius-suave);
		background: var(--color-segura);
		box-shadow: 0 0 0 3px var(--color-placa);
	}

	/* Leaflet trae su propia tipografía y su propio azul; aquí manda el sistema. */
	:global(.leaflet-container) {
		font-family: inherit;
		background: var(--color-marca-50);
	}

	/* La cartografía, apagada: es el soporte, y los municipios son el dato. Va
	   sobre el panel de teselas y no sobre el contenedor, para no desaturar
	   también los polígonos ni los rótulos. */
	:global(.leaflet-tile-pane) {
		filter: grayscale(1) contrast(0.82) brightness(1.06);
	}

	:global(.leaflet-tooltip) {
		border: 0;
		border-radius: var(--radius-suave);
		background: var(--color-obliga);
		color: var(--color-obliga-tinta);
		font-family: var(--font-leyenda);
		font-size: 0.6875rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		box-shadow: none;
	}

	:global(.leaflet-tooltip-top::before) {
		border-top-color: var(--color-obliga);
	}

	/* Los controles traen el redondeo de Leaflet, que es más blando que el del
	   sistema; se alinean con el resto en vez de convivir dos radios. */
	:global(.leaflet-bar),
	:global(.leaflet-bar a:first-child),
	:global(.leaflet-bar a:last-child),
	:global(.leaflet-control-attribution) {
		border-radius: var(--radius-suave);
	}
</style>
