<script lang="ts">
	/**
	 * El alcance del portafolio, abierto.
	 *
	 * Sustituye a `ServicesCarousel`, que tenía tres problemas de fondo y no uno
	 * de estilo:
	 *
	 * 1. En escritorio mostraba **un** grupo de cinco y lo rotaba solo cada 5 s;
	 *    en móvil los mostraba los cinco. El comprador con pantalla grande —el
	 *    que está preseleccionando proveedores— veía menos portafolio que el que
	 *    llegaba desde el teléfono, y para ver el resto tenía que esperar.
	 * 2. Enganchaba `keydown` en `window`: las flechas arriba/abajo cambiaban de
	 *    grupo desde cualquier punto de la página, incluso con el foco dentro de
	 *    un campo de texto a miles de píxeles de distancia.
	 * 3. Los grupos llevaban `headerColor` y `accentColor` que ningún nodo leía.
	 *
	 * Aquí están los cinco a la vez, sin temporizador y sin estado. La forma de
	 * la placa clasifica igual que en el primer pliegue: círculo para lo que
	 * obliga la norma, triángulo para lo que mide riesgo, cuadrado para la
	 * capacidad que se entrega.
	 */
	import { resolve } from '$app/paths';
	import { serviciosData } from '$lib/data/servicios';
	import Placa from './Placa.svelte';
	import Icono from './Icono.svelte';

	interface Bloque {
		titulo: string;
		icono: string;
		items: string[];
	}

	interface Grupo {
		titulo: string;
		icono: string;
		tipo: 'obliga' | 'advierte' | 'segura';
		bloques: Bloque[];
		/** Slug de la ficha del servicio. */
		slug: string;
	}

	/**
	 * Resumen del portafolio, no `serviciosData` completo: aquí va lo que el
	 * comprador necesita para comparar antes de pedir cotización. El detalle
	 * está en la ficha de cada servicio, que es a donde lleva cada enlace.
	 */
	const grupos: Grupo[] = [
		{
			titulo: 'Consultoría y auditoría',
			icono: 'consultoria',
			tipo: 'obliga',
			slug: 'consultoria-asesoria',
			bloques: [
				{
					titulo: 'Normas ISO',
					icono: 'normas-iso',
					items: [
						'ISO 9001 · Calidad',
						'ISO 14001 · Ambiental',
						'ISO 45001 · SST',
						'ISO 39001 · Seguridad vial'
					]
				},
				{
					titulo: 'Certificaciones',
					icono: 'certificaciones',
					items: ['BASC', 'RUC y RUC Transporte', 'NORSOK S-006']
				},
				{
					titulo: 'Normativa colombiana',
					icono: 'normativa',
					items: [
						'SG-SST Decreto 1072',
						'PESV Resolución 40595',
						'SARLAFT Resolución 2328',
						'TRAST'
					]
				}
			]
		},
		{
			titulo: 'Interventoría',
			icono: 'interventoria',
			tipo: 'obliga',
			slug: 'interventoria',
			bloques: [
				{
					titulo: 'Tipos',
					icono: 'auditoria',
					items: ['Obras civiles', 'Seguridad vial', 'Sistemas de gestión', 'Proyectos especiales']
				},
				{
					titulo: 'Metodología',
					icono: 'medicion',
					items: [
						'Matrices de seguimiento',
						'Informes trazables',
						'Herramientas digitales',
						'Supervisión en campo'
					]
				}
			]
		},
		{
			titulo: 'Estudios técnicos',
			icono: 'estudios',
			tipo: 'advierte',
			slug: 'campanas-estudios',
			bloques: [
				{
					titulo: 'Higiene ambiental',
					icono: 'estudios-ambientales',
					items: ['Luxometría', 'Sonometría', 'Evaluaciones ambientales']
				},
				{
					titulo: 'Salud laboral',
					icono: 'salud-laboral',
					items: [
						'Factores psicosociales',
						'Tamizajes de salud',
						'Análisis de puestos',
						'Clima organizacional'
					]
				},
				{
					titulo: 'Seguridad vial',
					icono: 'estudios-viales',
					items: ['Medición con radar', 'Evaluación de respuesta', 'Inspecciones viales']
				}
			]
		},
		{
			titulo: 'Formación y campañas',
			icono: 'formacion',
			tipo: 'segura',
			slug: 'formacion',
			bloques: [
				{
					titulo: 'Cursos especializados',
					icono: 'cursos',
					items: [
						'Manejo defensivo',
						'Mercancías peligrosas',
						'Comando de incidentes',
						'Auditoría interna'
					]
				},
				{
					titulo: 'Campañas institucionales',
					icono: 'campanas',
					items: ['Seguridad vial', 'Vida saludable', 'Identificación de peligros', 'Cultura ética']
				},
				{
					titulo: 'Simulacros',
					icono: 'simulacros',
					items: [
						'Respuesta a emergencias',
						'Simulacros ambientales',
						'Primeros auxilios',
						'Capacitaciones SST'
					]
				}
			]
		},
		{
			titulo: 'Digitalización y proyectos especiales',
			icono: 'sistemas',
			tipo: 'segura',
			slug: 'digitalizacion',
			bloques: [
				{
					titulo: 'Digitalización',
					icono: 'digitalizacion',
					items: [
						'Formatos digitales',
						'Tableros de control',
						'Integración con plataformas',
						'Aplicaciones a medida'
					]
				},
				{
					titulo: 'Proyectos especiales',
					icono: 'proyectos-especiales',
					items: [
						'Modelos de gestión',
						'Herramientas a medida',
						'Metodologías propias',
						'Laboratorios de innovación'
					]
				},
				{
					titulo: 'Proyecto integral vial',
					icono: 'seguridad-vial',
					items: [
						'Plan PESV ISO 39001',
						'Auditoría vial',
						'Capacitaciones',
						'Inspecciones y control'
					]
				}
			]
		}
	];
</script>

<div class="space-y-12">
	{#each grupos as grupo (grupo.titulo)}
		<article class="border-t-2 border-tinta pt-6">
			<div class="flex flex-wrap items-start justify-between gap-x-10 gap-y-4">
				<!--
					El apoyo sale de `serviciosData`: es el mismo tagline que encabeza la
					ficha del servicio, así que la promesa del riel y la de la página de
					destino no se pueden desincronizar.
				-->
				<div class="max-w-2xl min-w-0 flex-1">
					<Placa
						tipo={grupo.tipo}
						icono={grupo.icono}
						leyenda={grupo.titulo}
						detalle={serviciosData[grupo.slug]?.tagline ?? ''}
						leyendaComo="h3"
					/>
				</div>
				<a
					href={resolve('/servicios/[slug]', { slug: grupo.slug })}
					class="mt-1 shrink-0 border-b-2 border-obliga pb-1 font-leyenda text-sm font-bold tracking-[0.08em] text-obliga uppercase transition-colors hover:border-segura hover:text-segura focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-obliga"
				>
					Ver alcance completo
				</a>
			</div>

			<!--
				Los filetes van en cada columna, no como `gap-px` sobre fondo gris:
				un último renglón incompleto pintaba celdas fantasma.
			-->
			<div class="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
				{#each grupo.bloques as bloque (bloque.titulo)}
					<section class="border-t border-gray-200 pt-4">
						<h4
							class="flex items-center gap-2 font-leyenda text-xs font-bold tracking-[0.09em] text-tinta uppercase"
						>
							<Icono nombre={bloque.icono} class="h-4 w-4 shrink-0 text-marca-500" />
							{bloque.titulo}
						</h4>
						<ul class="mt-3 space-y-1.5">
							{#each bloque.items as item (item)}
								<li class="flex gap-2.5 text-sm leading-relaxed text-gray-700">
									<span class="mt-[0.55em] h-1 w-2.5 shrink-0 bg-segura"></span>
									<span>{item}</span>
								</li>
							{/each}
						</ul>
					</section>
				{/each}
			</div>
		</article>
	{/each}
</div>
