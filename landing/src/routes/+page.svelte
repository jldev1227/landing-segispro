<script lang="ts">
	import Seo from '$lib/seo/Seo.svelte';
	import { absoluteUrl } from '$lib/seo/site';
	import {
		faqSchema,
		graph,
		organizationSchema,
		serviceListSchema,
		serviceSchema,
		webPageSchema,
		websiteSchema
	} from '$lib/seo/schema';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { resolve } from '$app/paths';
	import Icono from '$lib/components/Icono.svelte';
	import Placa from '$lib/components/Placa.svelte';
	import PageFooter from '$lib/components/PageFooter.svelte';
	import CarouselClientes from '$lib/components/CarouselClientes.svelte';
	import MuroServicios from '$lib/components/MuroServicios.svelte';
	import { serviciosData } from '$lib/data/servicios';
	import { CAMPUS_CURSOS, CONTACT, FACEBOOK_URL, REGIONES, WHATSAPP_URL } from '$lib/seo/site';
	import metricas from '$lib/data/metricas.json';

	// Variable de entorno para la app Segispro
	const SEGISPRO_APP_URL = import.meta.env.VITE_APP_SEGISPRO || 'http://localhost:5174';

	let mobileMenuOpen = false;
	let activeSection = 'inicio';

	const navItems = [
		{ id: 'inicio', label: 'Inicio' },
		{ id: 'services', label: 'Servicios' },
		{ id: 'nosotros', label: 'Nosotros' },
		{ id: 'experience', label: 'Experiencia' },
		{ id: 'cobertura', label: 'Cobertura' },
		{ id: 'contacto', label: 'Contacto' }
	];
	// Estos indicadores arrancan en `true` para que el HTML servido ya traiga el
	// contenido: con `false` el rastreador recibía un documento sin <h1> ni texto.
	// Los observers los siguen tocando, pero solo confirman lo que ya está visible.
	let mounted = true;

	/**
	 * Canales de contacto. Cada número aparece una sola vez con sus dos acciones
	 * al lado; antes el mismo teléfono salía como botón de WhatsApp en una
	 * tarjeta y como `tel:` en otra, y el comprador veía seis controles para
	 * tres destinos.
	 */
	const canalesContacto = [
		{
			icono: 'telefono',
			etiqueta: 'Dirección comercial',
			valor: CONTACT.telefonoVisible,
			acciones: [
				{ texto: 'Llamar', href: `tel:${CONTACT.telefono}`, externo: false },
				// El mismo destino que el botón flotante, con el mensaje ya redactado.
				{ texto: 'WhatsApp', href: WHATSAPP_URL, externo: true }
			]
		},
		{
			icono: 'telefono',
			etiqueta: 'Coordinación de servicios',
			valor: '+57 311 207 6203',
			acciones: [
				{ texto: 'Llamar', href: 'tel:+573112076203', externo: false },
				{ texto: 'WhatsApp', href: 'https://wa.me/573112076203', externo: true }
			]
		},
		{
			icono: 'correo',
			etiqueta: 'Correo',
			valor: CONTACT.email,
			acciones: [{ texto: 'Escribir', href: `mailto:${CONTACT.email}`, externo: false }]
		}
	];

	/** Separador de miles colombiano: 1.174, no 1174. */
	const cifra = (valor: number) => valor.toLocaleString('es-CO');

	/**
	 * Jornadas fotografiadas en sitio. Los pies describen lo que se ve, porque
	 * antes el `alt` decía «Imagen 1» y eso no sirve ni al lector de pantalla ni
	 * al buscador.
	 */
	const jornadas = [
		{
			src: '/slides/slide-2.webp',
			alt: 'Personal de operaciones reunido durante una jornada de capacitación en planta',
			pie: 'Capacitación en planta'
		},
		{
			src: '/slides/slide-3.webp',
			alt: 'Brigada y personal contratista en una campaña de seguridad vial en estación',
			pie: 'Campaña de seguridad vial'
		},
		{
			src: '/slides/slide-4.webp',
			alt: 'Asistentes en una sesión de formación en seguridad y salud en el trabajo',
			pie: 'Formación SST'
		},
		{
			src: '/slides/slide-5.webp',
			alt: 'Equipo operativo durante un simulacro de respuesta a emergencias',
			pie: 'Simulacro de emergencias'
		},
		{
			src: '/slides/slide-6.webp',
			alt: 'Jornada de acompañamiento con personal de un cliente en campo',
			pie: 'Acompañamiento en campo'
		},
		{
			src: '/slides/slide-1.webp',
			alt: 'Grupo de trabajadores al cierre de una jornada de capacitación',
			pie: 'Cierre de jornada'
		}
	];

	/**
	 * El portafolio como placas. La forma clasifica y no es intercambiable:
	 * círculo para lo que obliga la norma, triángulo para lo que mide riesgo,
	 * cuadrado para la capacidad que se entrega.
	 */
	const placasServicio = [
		{
			slug: 'consultoria-asesoria',
			tipo: 'obliga' as const,
			icono: 'consultoria',
			leyenda: 'Consultoría y auditoría',
			detalle: 'ISO 9001, 14001, 45001 y 39001; SG-SST Decreto 1072; auditoría a proveedores.'
		},
		{
			slug: 'interventoria',
			tipo: 'obliga' as const,
			icono: 'interventoria',
			leyenda: 'Interventoría',
			detalle: 'Supervisión técnica y administrativa de contratos, con informes conformes.'
		},
		{
			slug: 'campanas-estudios',
			tipo: 'advierte' as const,
			icono: 'estudios',
			leyenda: 'Estudios técnicos',
			detalle:
				'Luxometría, sonometría, factores psicosociales, análisis de puestos y estudios viales.'
		},
		{
			slug: 'formacion',
			tipo: 'segura' as const,
			icono: 'formacion',
			leyenda: 'Formación y campañas',
			detalle: 'Cursos especializados, campañas institucionales y simulacros en sitio.'
		},
		{
			slug: 'digitalizacion',
			tipo: 'segura' as const,
			icono: 'digitalizacion',
			leyenda: 'Digitalización',
			detalle: 'Formatos digitales, tableros de control e integración con plataformas.'
		},
		{
			slug: 'proyectos-especiales',
			tipo: 'segura' as const,
			icono: 'proyectos-especiales',
			leyenda: 'Proyectos especiales',
			detalle: 'Modelos de gestión, herramientas a medida y metodologías propias.'
		}
	].map((p) => ({ ...p, href: resolve(`/servicios/${p.slug}`) }));

	/**
	 * Las zonas más frecuentadas, tomadas del sistema de gestión: son los
	 * municipios donde más actividad se ha ejecutado, con su conteo y las
	 * empresas distintas atendidas allí.
	 *
	 * El denominador es `serviciosLocalizados`, no el total de servicios: de las
	 * actividades ejecutadas, solo una parte trae municipio registrado. Repartir
	 * sobre el total daría a entender que el resto no se hizo en ninguna parte.
	 *
	 * La barra es la proporción dentro de lo localizado. Yopal se lleva la
	 * mayoría, y eso es exactamente lo que la página debe decir: la sede es la
	 * plaza, no una casilla más de una lista de cinco departamentos.
	 */
	const zonas = metricas.zonas ?? [];
	const zonaMayor = Math.max(1, ...zonas.map((z) => z.servicios));
	const proporcionZona = (servicios: number) => Math.round((servicios / zonaMayor) * 100);
	/** Cuánto de lo localizado cae en estos seis municipios. */
	const zonasCubren = zonas.reduce((suma, z) => suma + z.servicios, 0);

	/**
	 * Lo que un profesional necesita saber antes de postularse: cuánta gente ya
	 * está en la red y cuánto volumen se reparte. La promesa vaga —«empresa
	 * líder», «proyectos innovadores»— no la puede comprobar nadie; esto sí.
	 */
	const pruebaRed = [
		{ valor: String(metricas.profesionales), etiqueta: 'profesionales activos' },
		{ valor: cifra(metricas.serviciosPrestados), etiqueta: 'servicios ejecutados' },
		{ valor: String(metricas.ciudadesAtendidas), etiqueta: 'municipios' }
	];

	/** Las tres cifras del hero. Mismo snapshot que la franja de más abajo. */
	const pruebaHero = [
		{ valor: cifra(metricas.serviciosPrestados), etiqueta: 'servicios ejecutados' },
		{ valor: cifra(metricas.clientesAtendidos), etiqueta: 'empresas atendidas' },
		{ valor: String(metricas.aniosOperacion), etiqueta: 'años de operación' }
	];

	onMount(() => {
		mounted = true;

		/**
		 * Scroll-spy. `activeSection` solo se asignaba en los manejadores de clic,
		 * así que a quien llegaba y bajaba con la rueda —el caso normal— la
		 * navegación le decía «Inicio» durante toda la visita.
		 *
		 * El margen superior descuenta los 80px del encabezado fijo; el inferior
		 * deja activa la sección cuyo encabezado acaba de pasar bajo la placa.
		 */
		const seccionesNav = navItems
			.map((i) => document.getElementById(i.id))
			.filter((el): el is HTMLElement => el !== null);

		/**
		 * El observador solo entrega las entradas que **cambiaron**, no todas las
		 * observadas. Decidir la sección activa mirando únicamente ese lote fallaba
		 * en el caso más común: al salir la sección de arriba llegaba un lote sin
		 * ninguna entrada intersecando, no se actualizaba nada, y la navegación se
		 * quedaba marcando la sección anterior durante toda la siguiente. Por eso
		 * el estado de cada sección se mantiene aparte y la más alta se elige sobre
		 * el conjunto completo.
		 */
		const dentro = new Map<string, number>();

		const spy = new IntersectionObserver(
			(entries) => {
				for (const entrada of entries) {
					const id = entrada.target.id;
					if (entrada.isIntersecting) dentro.set(id, entrada.boundingClientRect.top);
					else dentro.delete(id);
				}
				const masAlta = [...dentro.entries()].sort((a, b) => a[1] - b[1])[0];
				if (masAlta) activeSection = masAlta[0];
			},
			{ rootMargin: '-80px 0px -65% 0px', threshold: 0 }
		);
		seccionesNav.forEach((el) => spy.observe(el));

		// Observer general para animaciones al hacer scroll
		const generalObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting && !mapLoaded) {
						mapLoaded = true;
					}
				});
			},
			{ threshold: 0.1 }
		);

		// Observar secciones con el observer general
		const sections = document.querySelectorAll('section[id]');
		sections.forEach((section) => {
			generalObserver.observe(section);
		});

		if (mapContainer) {
			generalObserver.observe(mapContainer);
		}

		return () => {
			spy.disconnect();
			generalObserver.disconnect();
		};
	});

	interface Characteristic {
		icon: string;
		title: string;
		description: string;
	}

	const characteristics: Characteristic[] = [
		{
			icon: 'excelencia',
			title: 'Excelencia Operativa',
			description:
				'Expertos éticos, con trayectoria y resultados medibles. Cada servicio se ejecuta con planes claros, seguimiento riguroso e informes conformes que impulsan decisiones efectivas.'
		},
		{
			icon: 'rapidez',
			title: 'Agilidad y Tecnología',
			description:
				'Simplificamos procesos, optimizamos tiempos y conectamos equipos mediante herramientas digitales, automatización y plataformas modernas.'
		},
		{
			icon: 'innovacion',
			title: 'Innovación Continua',
			description:
				'Nos actualizamos permanentemente para dinamizar sistemas de gestión, adaptándonos a normativas, tendencias y contextos cambiantes.'
		},
		{
			icon: 'vision-global',
			title: 'Visión Global',
			description:
				'Acción Local: Entendemos la diversidad del mercado y actuamos con flexibilidad estratégica en empresas públicas y privadas de múltiples sectores.'
		},
		{
			icon: 'confidencialidad',
			title: 'Confidencialidad y Proyección',
			description:
				'Protegemos la información con protocolos éticos, proyectándola con claridad, impacto y propósito.'
		}
	];

	const clientes = [
		{ name: 'SURA', logo: '/clientes/sura.png' },
		{ name: 'Colmena Seguros', logo: '/clientes/colmena.png' },
		{ name: 'Positiva Compañía de Seguros', logo: '/clientes/positiva.png' },
		{ name: 'AXA Colpatria', logo: '/clientes/axa.png' },
		{ name: 'Equidad Seguros', logo: '/clientes/equidad.png' },
		{ name: 'Mapfre Seguros', logo: '/clientes/equidad.png' },
		{ name: 'Bolívar', logo: '/clientes/bolivar.png' },
		{ name: 'La Previsora Seguros', logo: '/clientes/previsora.png' },
		{ name: 'QBE Seguros', logo: '/clientes/qbe.webp' }
	];

	let mapLoaded = false;
	let mapContainer: HTMLElement;

	// Datos estructurados: un único `@graph` con organización, sitio, página,
	// migas y el listado de servicios del portafolio.
	const servicios = Object.values(serviciosData);

	const seoTitle =
		'SEGISPRO | Consultoría, auditorías y capacitaciones SST en Casanare, Meta, Boyacá y Bogotá';
	const seoDescription =
		'Desde 2009 implementamos sistemas de gestión en seguridad y salud en el trabajo, medio ambiente y calidad: consultoría, auditoría, interventoría, formación, simulacros, campañas y estudios. Yopal, Villavicencio, Tunja, Bogotá y Cundinamarca.';

	const preguntasFrecuentes = [
		{
			pregunta: '¿Qué servicios presta SEGISPRO Ingeniería?',
			respuesta:
				'Consultoría y auditoría de sistemas de gestión (ISO 9001, ISO 14001, ISO 45001), interventoría, formación y capacitación, simulacros, campañas institucionales, estudios ambientales y de salud laboral, y digitalización de procesos HSEQ.'
		},
		{
			pregunta: '¿En qué ciudades y departamentos opera SEGISPRO?',
			respuesta:
				'La sede está en Yopal, Casanare, y atendemos de forma permanente Casanare, Meta, Boyacá, Bogotá D.C. y Cundinamarca, incluyendo Villavicencio, Puerto Gaitán, Tunja, Duitama, Sogamoso y la Sabana de Bogotá.'
		},
		{
			pregunta: '¿SEGISPRO certifica en ISO 45001 o ISO 9001?',
			respuesta:
				'SEGISPRO no es organismo certificador: acompaña el diseño, la implementación y la auditoría interna del sistema de gestión para que la organización llegue preparada a la auditoría de certificación con el ente acreditado que elija.'
		},
		{
			pregunta: '¿Cómo valido un certificado emitido por SEGISPRO?',
			respuesta:
				'Cada certificado tiene un código UUID único que se consulta en la página de validación de certificados del sitio, que confirma titular, curso y fecha de emisión.'
		},
		{
			pregunta: '¿Dónde se inscriben las capacitaciones?',
			respuesta:
				'El catálogo de formación vive en Formar Pro, el campus institucional de SEGISPRO, en formarpro.segispro.com. Hay cursos virtuales, presenciales e híbridos; los simulacros y las campañas institucionales se ejecutan siempre de forma presencial en la sede del cliente.'
		}
	];

	const schemaData = graph([
		organizationSchema(),
		websiteSchema(),
		webPageSchema({ url: absoluteUrl('/'), title: seoTitle, description: seoDescription }),
		serviceListSchema(
			servicios.map((servicio) => ({ name: servicio.title, path: `/servicios/${servicio.slug}` }))
		),
		...servicios.map((servicio) =>
			serviceSchema({
				name: servicio.title,
				description: servicio.tagline,
				path: `/servicios/${servicio.slug}`
			})
		),
		faqSchema(preguntasFrecuentes)
	]);
</script>

<Seo title={seoTitle} description={seoDescription} path="/" schema={schemaData} />

<!--
	Navegación en el mundo señalético.

	El encabezado es una placa fija de obligación: campo navy opaco siempre, no
	condicionado al scroll. Antes era transparente hasta pasar 50px, así que
	sobre las secciones oscuras el logotipo navy quedaba encima de una foto.

	La sección activa se marca con un filete verde bajo la leyenda, y ahora sí
	sigue al scroll: antes `activeSection` solo se movía al hacer clic, de modo
	que a quien llegaba y bajaba con la rueda le decía «Inicio» toda la visita.
-->
<header class="fixed top-0 right-0 left-0 z-50 bg-obliga">
	<nav class="container mx-auto max-w-7xl px-6 sm:px-8">
		<div class="flex h-20 items-center justify-between gap-6">
			<a
				href="#inicio"
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
				{#each navItems as item (item.id)}
					<a
						href="#{item.id}"
						aria-current={activeSection === item.id ? 'true' : undefined}
						class="border-b-2 pb-1 font-leyenda text-sm font-bold tracking-[0.07em] uppercase transition-colors duration-150 {activeSection ===
						item.id
							? 'border-segura text-white'
							: 'border-transparent text-marca-200 hover:text-white'}"
						on:click={() => (activeSection = item.id)}
					>
						{item.label}
					</a>
				{/each}
			</div>

			<div class="hidden shrink-0 items-center gap-3 lg:flex">
				<a
					href={CAMPUS_CURSOS}
					target="_blank"
					rel="noopener"
					class="border-2 border-marca-400 px-4 py-2.5 font-leyenda text-xs font-bold tracking-[0.07em] text-white uppercase transition-colors duration-150 hover:border-white"
				>
					Formación
				</a>
				<a
					href={SEGISPRO_APP_URL}
					class="bg-segura px-4 py-2.5 font-leyenda text-xs font-bold tracking-[0.07em] text-segura-tinta uppercase transition-transform duration-150 hover:-translate-y-0.5"
				>
					Ingreso
				</a>
			</div>

			<button
				type="button"
				class="flex h-11 w-11 items-center justify-center text-white lg:hidden"
				aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
				aria-expanded={mobileMenuOpen}
				on:click={() => (mobileMenuOpen = !mobileMenuOpen)}
			>
				{#if mobileMenuOpen}
					<Icono nombre="cerrar" class="h-6 w-6" />
				{:else}
					<Icono nombre="menu" class="h-6 w-6" />
				{/if}
			</button>
		</div>
	</nav>
</header>

<!--
	Cajón móvil. Misma placa de obligación que el encabezado, sin desenfoques ni
	degradados: el panel es opaco y la sección activa lleva el mismo filete verde
	que en escritorio, para que sea el mismo sistema y no dos lenguajes.
-->
{#if mobileMenuOpen}
	<div class="fixed inset-0 z-40 lg:hidden">
		<button
			type="button"
			class="absolute inset-0 bg-marca-950/70"
			aria-label="Cerrar menú"
			on:click={() => (mobileMenuOpen = false)}
		></button>

		<div
			class="absolute top-20 right-0 left-0 max-h-[calc(100dvh-5rem)] overflow-y-auto bg-obliga"
			transition:fly={{ y: -12, duration: 180 }}
		>
			<nav class="container mx-auto max-w-7xl px-6 py-6">
				<ul class="divide-y divide-marca-700">
					{#each navItems as item (item.id)}
						<li>
							<a
								href="#{item.id}"
								aria-current={activeSection === item.id ? 'true' : undefined}
								class="flex items-center gap-3 py-4 font-leyenda text-sm font-bold tracking-[0.07em] uppercase transition-colors {activeSection ===
								item.id
									? 'text-white'
									: 'text-marca-200'}"
								on:click={() => {
									activeSection = item.id;
									mobileMenuOpen = false;
								}}
							>
								<span
									class="h-4 w-1 shrink-0 {activeSection === item.id
										? 'bg-segura'
										: 'bg-transparent'}"
								></span>
								{item.label}
							</a>
						</li>
					{/each}
				</ul>

				<div class="mt-6 grid gap-3">
					<a
						href="#contacto"
						class="bg-segura px-5 py-4 text-center font-leyenda text-sm font-bold tracking-[0.08em] text-segura-tinta uppercase"
						on:click={() => (mobileMenuOpen = false)}
					>
						Solicitar cotización
					</a>
					<a
						href={CAMPUS_CURSOS}
						target="_blank"
						rel="noopener"
						class="border-2 border-marca-400 px-5 py-4 text-center font-leyenda text-sm font-bold tracking-[0.08em] text-white uppercase"
					>
						Formación
					</a>
					<a
						href={resolve('/validar-certificado')}
						class="border-2 border-marca-400 px-5 py-4 text-center font-leyenda text-sm font-bold tracking-[0.08em] text-white uppercase"
						on:click={() => (mobileMenuOpen = false)}
					>
						Validar certificado
					</a>
					<a
						href={SEGISPRO_APP_URL}
						class="py-3 text-center font-leyenda text-sm font-bold tracking-[0.07em] text-marca-200 uppercase"
					>
						Ingreso al portal
					</a>
				</div>
			</nav>
		</div>
	</div>
{/if}

<!--
	Primer pliegue en el mundo señalético.

	No es un hero a dos columnas con foto de archivo. Es una banda de leyenda
	sobre campo navy —la placa de obligación— con la acción principal dentro de
	la misma banda como placa verde, porque en una señal real la instrucción no
	flota encima del cartel: es parte del cartel.

	Debajo, el portafolio como muro de placas. La forma clasifica: círculo para
	lo normativo, triángulo para lo que mide riesgo, cuadrado para lo que se
	entrega. Y contra el borde, la tira de conteo estampada, que es la prueba.
-->
<section id="inicio" class="bg-placa pt-20">
	<!-- Banda de leyenda -->
	<div class="bg-obliga">
		<div class="container mx-auto max-w-7xl px-6 py-10 sm:px-8 sm:py-14">
			<div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
				<div class="max-w-3xl">
					<h1
						class="font-leyenda text-3xl leading-[1.08] font-bold tracking-[0.02em] text-balance text-obliga-tinta uppercase sm:text-4xl lg:text-5xl"
					>
						Auditorías, formación y estudios técnicos en seguridad y salud en el trabajo
					</h1>
					<p class="mt-5 max-w-[58ch] text-base leading-relaxed text-marca-100 sm:text-lg">
						Acompañamos operaciones de hidrocarburos, entidades públicas y transporte en Casanare,
						Meta, Boyacá, Bogotá y Cundinamarca. Cada servicio se pacta con su alcance, sus fechas y
						su tarifa.
					</p>
				</div>

				<!-- La acción es otra placa del mismo sistema, no un botón flotando. -->
				<div class="flex shrink-0 flex-wrap items-center gap-3">
					<a
						href="#contacto"
						class="bg-segura px-7 py-4 font-leyenda text-sm font-bold tracking-[0.08em] text-segura-tinta uppercase transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-base"
					>
						Solicitar cotización
					</a>
					<a
						href="#services"
						class="border-2 border-marca-400 px-7 py-4 font-leyenda text-sm font-bold tracking-[0.08em] text-obliga-tinta uppercase transition-colors duration-150 hover:border-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-base"
					>
						Ver servicios
					</a>
				</div>
			</div>
		</div>
	</div>

	<!-- Muro de placas: el portafolio clasificado por forma -->
	<div class="container mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16">
		<div class="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
			{#each placasServicio as placa (placa.slug)}
				<Placa
					tipo={placa.tipo}
					icono={placa.icono}
					leyenda={placa.leyenda}
					detalle={placa.detalle}
					href={placa.href}
				/>
			{/each}
		</div>
	</div>

	<!--
		La tira de conteo. Es la prueba del posicionamiento, así que va estampada
		contra el borde: cifras tabulares, un solo tono, sin tarjetas.
	-->
	<div class="border-t-2 border-tinta">
		<div class="container mx-auto max-w-7xl px-6 sm:px-8">
			<dl class="flex flex-wrap items-baseline gap-x-12 gap-y-5 py-7">
				{#each pruebaHero as dato (dato.etiqueta)}
					<div class="flex items-baseline gap-3">
						<dd class="text-3xl font-bold tracking-tight text-tinta tabular-nums sm:text-4xl">
							{dato.valor}
						</dd>
						<dt
							class="font-leyenda text-xs font-bold tracking-[0.08em] text-gray-600 uppercase sm:text-sm"
						>
							{dato.etiqueta}
						</dt>
					</div>
				{/each}
			</dl>
		</div>
	</div>
</section>

<!--
	Servicios en detalle. El muro de placas del primer pliegue clasifica; aquí se
	despliega el alcance de cada grupo.

	Se van dos cosas de aquí. La tira «Nuestra Trayectoria» repetía las mismas
	cifras que ya van estampadas en el primer pliegue, con el agravante de que
	las animaba desde cero y a veces se leían en 0. Y la banda «¿Listo para
	comenzar?» repetía con palabras más flojas la acción que el hero ya ofrece.
-->
<section id="services" class="border-t border-gray-200 bg-marca-50">
	<div class="container mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-20">
		<div class="max-w-3xl">
			<h2
				class="font-leyenda text-2xl leading-tight font-bold tracking-[0.03em] text-balance text-tinta uppercase sm:text-3xl"
			>
				Qué incluye cada servicio
			</h2>
			<p class="mt-3 max-w-[62ch] text-base leading-relaxed text-gray-600">
				Consultoría, formación y estudios especializados, con el alcance de cada grupo abierto para
				que lo compare antes de pedir cotización.
			</p>
		</div>

		<div class="mt-12">
			<MuroServicios />
		</div>
	</div>
</section>

<!--
	Nosotros. Antes era una tarjeta destacada con gradiente en hover más un
	carrusel infinito de cinco tarjetas iguales, de las que solo se veían tres.
	Ahora las cinco se leen a la vez como placas de condición segura: son
	capacidades que la empresa afirma tener, que es exactamente lo que el
	cuadrado significa en el sistema.
-->
<section id="nosotros" class="border-t border-gray-200 bg-marca-50">
	<div class="container mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-20">
		<div class="max-w-3xl">
			<h2
				class="font-leyenda text-2xl leading-tight font-bold tracking-[0.03em] text-balance text-tinta uppercase sm:text-3xl"
			>
				Ayudamos a las entidades al mejoramiento continuo
			</h2>
			<p class="mt-4 max-w-[66ch] text-base leading-relaxed text-gray-600">
				Acompañamos a las organizaciones en su búsqueda de mejora continua, optimizando sus procesos
				con agilidad, garantizando la protección de su información y avanzando con innovación y
				sostenibilidad.
			</p>
		</div>

		<ul class="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
			{#each characteristics as c (c.title)}
				<li>
					<Placa tipo="segura" icono={c.icon} leyenda={c.title} detalle={c.description} />
				</li>
			{/each}
		</ul>
	</div>
</section>

<!-- Muro de clientes. -->
<section class="border-t border-gray-200 bg-marca-50">
	<div class="container mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-20">
		<CarouselClientes visible={mounted} {clientes} speed={35} />
	</div>
</section>

<!-- Footer -->

<!-- Facebook -->
<!--
	Novedades. Antes era un iframe de la página de Facebook: no se puede maquetar,
	mete su propia tipografía en medio de la página, no lo indexa el buscador y
	obliga a cargar el rastreador de Meta en el primer render. Ahora es fotografía
	propia con su pie, y el enlace a Facebook queda fuera del marco, donde sí
	cuenta como enlace.
-->
<section id="experience" class="border-t border-gray-200 bg-placa">
	<div class="container mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-20">
		<div class="flex flex-wrap items-end justify-between gap-6">
			<div class="max-w-2xl">
				<h2
					class="font-leyenda text-2xl leading-tight font-bold tracking-[0.03em] text-balance text-tinta uppercase sm:text-3xl"
				>
					Proyectos que transforman
				</h2>
				<p class="mt-3 max-w-[62ch] text-base leading-relaxed text-gray-600">
					Campañas institucionales, simulacros, capacitaciones en campo y jornadas con nuestros
					clientes. Esto es trabajo ejecutado, fotografiado donde ocurrió.
				</p>
			</div>
			<a
				href={FACEBOOK_URL}
				target="_blank"
				rel="noopener"
				class="border-b-2 border-obliga pb-1 font-leyenda text-sm font-bold tracking-[0.08em] text-obliga uppercase transition-colors hover:border-segura hover:text-segura"
			>
				Más en Facebook
			</a>
		</div>

		<ul class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each jornadas as j (j.src)}
				<li>
					<figure>
						<img
							src={j.src}
							alt={j.alt}
							width="1280"
							height="960"
							loading="lazy"
							decoding="async"
							class="aspect-4/3 w-full object-cover"
						/>
						<figcaption
							class="mt-3 font-leyenda text-xs font-bold tracking-[0.07em] text-tinta uppercase"
						>
							{j.pie}
						</figcaption>
					</figure>
				</li>
			{/each}
		</ul>
	</div>
</section>

<!-- Cobertura geográfica -->
<!--
	Cobertura. Cada región es una placa de condición segura: donde operamos es
	precisamente lo que podemos garantizar. Sin tarjetas con sombra ni borde
	punteado; la rejilla es un tablero de placas y el último renglón es el enlace
	al índice completo.
-->
<section id="cobertura" class="border-t border-gray-200 bg-placa">
	<div class="container mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-20">
		<div class="flex flex-wrap items-end justify-between gap-6">
			<div class="max-w-2xl">
				<h2
					class="font-leyenda text-2xl leading-tight font-bold tracking-[0.03em] text-balance text-tinta uppercase sm:text-3xl"
				>
					Dónde se ejecuta el trabajo
				</h2>
				<p class="mt-3 max-w-[62ch] text-base leading-relaxed text-gray-600">
					Desde la sede en Yopal acompañamos operaciones del corredor llanero y del eje
					Bogotá–Boyacá, con desplazamiento a locación. Estas son las zonas donde más se ha
					ejecutado, no una lista de intenciones.
				</p>
			</div>
			<a
				href={resolve('/cobertura')}
				class="border-b-2 border-obliga pb-1 font-leyenda text-sm font-bold tracking-[0.08em] text-obliga uppercase transition-colors hover:border-segura hover:text-segura"
			>
				Toda la cobertura
			</a>
		</div>

		<!--
			Tablero de zonas. No es una ilustración: son los municipios con más
			actividad ejecutada según el sistema de gestión, con el conteo y las
			empresas distintas atendidas en cada uno. La barra mide contra el
			municipio mayor, y la cifra va siempre escrita al lado, para que el dato
			no dependa del largo de una barra.
		-->
		{#if zonas.length}
			<div class="mt-12 border-t-2 border-tinta pt-6">
				<h3 class="font-leyenda text-sm font-bold tracking-[0.09em] text-tinta uppercase">
					Zonas más frecuentadas
				</h3>
				<p class="mt-2 max-w-[68ch] text-sm leading-relaxed text-gray-600">
					{cifra(zonasCubren)} de los {cifra(metricas.serviciosLocalizados)} servicios con municipio
					registrado se ejecutaron en estos seis. Cifras del sistema de gestión de SEGISPRO, actualizadas
					al {new Date(metricas.calculadoEn).toLocaleDateString('es-CO', {
						day: 'numeric',
						month: 'long',
						year: 'numeric'
					})}.
				</p>

				<ol class="mt-7 space-y-4">
					{#each zonas as zona (zona.municipio)}
						<li class="grid gap-x-6 gap-y-1.5 sm:grid-cols-[minmax(0,13rem)_1fr]">
							<p class="flex items-baseline gap-2">
								<span class="font-leyenda text-sm font-bold tracking-[0.05em] text-tinta uppercase">
									{zona.municipio}
								</span>
								{#if zona.municipio === CONTACT.ciudad}
									<span
										class="bg-segura px-1.5 py-0.5 font-leyenda text-[0.625rem] font-bold tracking-[0.09em] text-segura-tinta uppercase"
									>
										Sede
									</span>
								{/if}
							</p>

							<div class="flex items-center gap-4">
								<!-- La barra es decorativa: el dato va escrito a su derecha. -->
								<span class="h-3 flex-1 bg-marca-100" aria-hidden="true">
									<span
										class="block h-full bg-obliga"
										style="width: {Math.max(proporcionZona(zona.servicios), 2)}%"
									></span>
								</span>
								<span class="shrink-0 text-sm text-gray-600">
									<span class="font-bold text-tinta tabular-nums">{cifra(zona.servicios)}</span>
									servicios ·
									<span class="font-bold text-tinta tabular-nums">{zona.empresas}</span> empresas
								</span>
							</div>
						</li>
					{/each}
				</ol>
			</div>
		{/if}

		<h3 class="mt-14 font-leyenda text-sm font-bold tracking-[0.09em] text-tinta uppercase">
			Regiones donde operamos
		</h3>

		<!--
			Los filetes van en cada celda y no como `gap-px` sobre un fondo gris:
			son cinco regiones en una rejilla de tres, y el hueco de la última fila
			se pintaba como una celda gris que parecía una región sin nombre.
		-->
		<ul class="mt-6 grid border-t border-l border-gray-200 sm:grid-cols-2 lg:grid-cols-3">
			{#each REGIONES as region (region.slug)}
				<li class="border-r border-b border-gray-200 bg-placa">
					<a
						href={resolve('/cobertura/[region]', { region: region.slug })}
						class="group flex h-full flex-col p-6 transition-colors hover:bg-marca-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-obliga"
					>
						<span class="h-1.5 w-12 bg-segura"></span>
						<h4
							class="mt-4 font-leyenda text-base font-bold tracking-[0.05em] text-tinta uppercase"
						>
							{region.nombre}
						</h4>
						<p class="mt-2 flex-1 text-sm leading-relaxed text-gray-600">{region.enfoque}</p>
						<p class="mt-4 text-xs text-gray-600">
							{region.ciudades.slice(0, 5).join(' · ')}
						</p>
					</a>
				</li>
			{/each}
		</ul>
	</div>
</section>

<!-- Preguntas frecuentes -->
<!--
	Preguntas frecuentes. Sin tarjetas: una lista de definición con filete, que es
	lo que es. La respuesta del «no somos organismo certificador» es la frase más
	útil comercialmente de la página, y aquí se lee sin tener que abrir nada.
-->
<section id="faq" class="border-t border-gray-200 bg-placa">
	<div class="container mx-auto max-w-4xl px-6 py-14 sm:px-8 sm:py-20">
		<h2
			class="font-leyenda text-2xl leading-tight font-bold tracking-[0.03em] text-balance text-tinta uppercase sm:text-3xl"
		>
			Preguntas frecuentes
		</h2>

		<dl class="mt-10 divide-y divide-gray-200 border-y border-gray-200">
			{#each preguntasFrecuentes as item (item.pregunta)}
				<div class="grid gap-2 py-6 sm:grid-cols-[minmax(0,18rem)_1fr] sm:gap-8">
					<!--
						La versal estrecha es para etiquetas cortas, no para frases: estas
						preguntas tienen 42–48 caracteres y en versales se leen peor. Se
						conserva la cara condensada y el peso; se suelta la caja alta.
					-->
					<dt class="font-leyenda text-sm font-bold tracking-[0.01em] text-tinta">
						{item.pregunta}
					</dt>
					<dd class="max-w-[68ch] text-sm leading-relaxed text-gray-600">{item.respuesta}</dd>
				</div>
			{/each}
		</dl>
	</div>
</section>

<!--
	Trabaja con nosotros. Era el último bloque del mundo anterior: degradado
	azul, dos orbes con `blur-3xl`, tarjetas de vidrio esmerilado y un botón que
	crecía al apuntarlo. Nada de eso existe en el resto de la página.

	Ahora es una placa de obligación —campo navy a todo el ancho— con la red de
	profesionales contada con la cifra real del sistema de gestión, que es el
	argumento: no «únete a una empresa líder», sino cuánta gente ya trabaja así y
	cuánto volumen hay que repartir.
-->
<section class="bg-obliga">
	<div class="container mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-16">
		<div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
			<div class="max-w-3xl">
				<p class="font-leyenda text-xs font-bold tracking-[0.12em] text-segura uppercase">
					Red de profesionales
				</p>
				<h2
					class="mt-3 font-leyenda text-2xl leading-tight font-bold tracking-[0.03em] text-balance text-obliga-tinta uppercase sm:text-3xl"
				>
					Ejecuta servicios con nosotros
				</h2>
				<p class="mt-4 max-w-[64ch] text-base leading-relaxed text-marca-100">
					Auditores, capacitadores, consultores HSEQ y especialistas en estudios técnicos. La
					contratación es por actividad: cada servicio se pacta con su alcance, sus fechas y su
					tarifa.
				</p>

				<dl class="mt-8 flex flex-wrap items-baseline gap-x-10 gap-y-4">
					{#each pruebaRed as dato (dato.etiqueta)}
						<div class="flex items-baseline gap-2.5">
							<dd class="text-2xl font-bold text-obliga-tinta tabular-nums sm:text-3xl">
								{dato.valor}
							</dd>
							<dt class="font-leyenda text-xs font-bold tracking-[0.08em] text-marca-200 uppercase">
								{dato.etiqueta}
							</dt>
						</div>
					{/each}
				</dl>
			</div>

			<div class="flex shrink-0 flex-col items-start gap-3">
				<a
					href={resolve('/trabaja-con-nosotros')}
					class="bg-segura px-7 py-4 font-leyenda text-sm font-bold tracking-[0.08em] text-segura-tinta uppercase transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:text-base"
				>
					Enviar mi hoja de vida
				</a>
				<p class="font-leyenda text-xs tracking-[0.06em] text-marca-200 uppercase">
					PDF, DOC o DOCX · hasta 8 MB
				</p>
			</div>
		</div>
	</div>
</section>

<!--
	Contacto.

	Antes eran tres tarjetas con seis botones para tres destinos: los dos
	teléfonos aparecían una vez como WhatsApp y otra como `tel:`, así que el
	comprador tenía que elegir entre seis controles que resolvían a tres sitios.
	Y el que decía «Cotízanos» abría un `mailto:` con el cuerpo «me gustaría
	obtener más información sobre…», es decir, le pasaba al comprador la tarea
	de redactar su propio pliego.

	Ahora cada canal aparece una sola vez, con sus acciones al lado. Sigue sin
	haber formulario de cotización: eso necesita endpoint y es trabajo aparte,
	anotado en el brief de la superficie.
-->
<section id="contacto" class="border-t border-gray-200 bg-marca-50">
	<div class="container mx-auto max-w-7xl px-6 py-14 sm:px-8 sm:py-20">
		<div class="max-w-3xl">
			<h2
				class="font-leyenda text-2xl leading-tight font-bold tracking-[0.03em] text-balance text-tinta uppercase sm:text-3xl"
			>
				Hablemos de su operación
			</h2>
			<p class="mt-3 max-w-[62ch] text-base leading-relaxed text-gray-600">
				Cuéntenos qué necesita auditar, formar o medir, y en qué sede. Le respondemos con alcance,
				fechas y tarifa.
			</p>
		</div>

		<div class="mt-10 grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:gap-14">
			<!-- Filetes por elemento: `space-y-px` sobre fondo gris pintaba una banda
					sobrante bajo el último canal. -->
			<ul class="divide-y divide-gray-200 border border-gray-200 bg-placa">
				{#each canalesContacto as canal (canal.valor)}
					<li class="p-6">
						<div class="flex items-start gap-4">
							<span
								class="flex h-12 w-12 shrink-0 items-center justify-center bg-obliga text-obliga-tinta"
							>
								<Icono nombre={canal.icono} class="h-6 w-6" />
							</span>
							<div class="min-w-0 flex-1">
								<p class="font-leyenda text-xs font-bold tracking-[0.08em] text-gray-600 uppercase">
									{canal.etiqueta}
								</p>
								<p class="mt-1 text-base font-semibold break-all text-tinta">{canal.valor}</p>
								<div class="mt-3 flex flex-wrap gap-2">
									{#each canal.acciones as accion (accion.href)}
										<a
											href={accion.href}
											target={accion.externo ? '_blank' : undefined}
											rel={accion.externo ? 'noopener' : undefined}
											class="border-2 border-obliga px-4 py-2 font-leyenda text-xs font-bold tracking-[0.07em] text-obliga uppercase transition-colors hover:bg-obliga hover:text-obliga-tinta"
										>
											{accion.texto}
										</a>
									{/each}
								</div>
							</div>
						</div>
					</li>
				{/each}
			</ul>

			<div>
				<!--
					El mapa se monta solo cuando la sección entra en pantalla: es un
					tercero y no tiene por qué participar del primer render.
				-->
				<div bind:this={mapContainer} class="aspect-4/3 w-full border border-gray-200 bg-placa">
					{#if mapLoaded}
						<iframe
							title="Ubicación de SEGISPRO Ingeniería en Yopal, Casanare"
							src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d496.56547935508956!2d-72.3859526!3d5.336689!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e6b0db85693c5c9%3A0xeb12db3e6737fdbd!2sSEGISPRO%20INGENIERIA%20SAS!5e0!3m2!1ses-419!2sco!4v1761797696930!5m2!1ses-419!2sco"
							loading="lazy"
							referrerpolicy="no-referrer-when-downgrade"
							class="h-full w-full border-0"
						></iframe>
					{:else}
						<div class="flex h-full flex-col items-center justify-center gap-2 text-center">
							<Icono nombre="ubicacion" class="h-8 w-8 text-gray-600" />
							<p class="font-leyenda text-sm font-bold tracking-[0.05em] text-tinta uppercase">
								{CONTACT.ciudad}, {CONTACT.departamento}
							</p>
							<p class="text-sm text-gray-600">Cargando mapa…</p>
						</div>
					{/if}
				</div>

				<div class="mt-4 flex flex-wrap items-center justify-between gap-3">
					<p class="text-sm text-gray-600">
						Sede en {CONTACT.ciudad}, {CONTACT.departamento}. Desplazamiento a locación.
					</p>
					<a
						href="https://www.google.com/maps/dir/?api=1&destination={CONTACT.latitud},{CONTACT.longitud}"
						target="_blank"
						rel="noopener"
						class="border-b-2 border-obliga pb-0.5 font-leyenda text-xs font-bold tracking-[0.08em] text-obliga uppercase transition-colors hover:border-segura hover:text-segura"
					>
						Cómo llegar
					</a>
				</div>
			</div>
		</div>
	</div>
</section>

<!--
	El home tenía su propio pie en línea mientras `PageFooter` se usaba en todas
	las demás rutas. Eran dos pies distintos, y el propio comentario de
	`PageFooter` dice que existe para distribuir autoridad hacia servicios y
	cobertura — justo lo que la página más enlazada no estaba haciendo.

	Con el cambio se van también dos controles muertos que vivían aquí: un
	<form> de boletín sin `on:submit` ni `action`, que al enviarlo recargaba la
	página, y un <button> de dirección sin manejador, enfocable e inerte.
-->
<PageFooter />

<!-- Modal de Hoja de Vida - Animado con Dropzone -->

<style>
	@keyframes floatIcon {
		0% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-4px);
		}
		100% {
			transform: translateY(0);
		}
	}

	/* ===== GLOBAL STYLES ===== */
	:global(html) {
		scroll-behavior: smooth;
	}

	/* Smooth font rendering */
	:global(body) {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
</style>
