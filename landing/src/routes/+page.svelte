<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { bounce, fadeInUp } from '$lib/animations';
	import CarouselInfinito from '$lib/components/CarouselInfinito.svelte';
	import CarouselClientes from '$lib/components/CarouselClientes.svelte';

	let mounted = false;
	let heroVisible = false;
	let servicesVisible = false;
	let characteristicsVisible = false;

	onMount(() => {
		mounted = true;
		
		// Observer para animaciones al hacer scroll
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						if (entry.target.id === 'hero') heroVisible = true;
						if (entry.target.id === 'services') servicesVisible = true;
						if (entry.target.id === 'characteristics') characteristicsVisible = true;
					}
				});
			},
			{ threshold: 0.1 }
		);

		// Observar secciones
		const sections = document.querySelectorAll('section[id]');
		sections.forEach((section) => observer.observe(section));

		// Animación inicial del héroe
		setTimeout(() => {
			heroVisible = true;
		}, 100);

		return () => observer.disconnect();
	});

	interface Service {
		title: string;
		description: string;
		icon: string;
	}

	const services: Service[] = [
		{
			title: 'CONSULTORÍA',
			description: 'Acompañamiento experto en sistemas de gestión, cumplimiento normativo y mejora continua para fortalecer la seguridad y el desempeño de tu organización.',
			icon: '🎯'
		},
		{
			title: 'AUDITORÍA',
			description: 'Auditorías precisas y confiables para garantizar el cumplimiento normativo y la excelencia operacional.',
			icon: '📊'
		},
		{
			title: 'INTERVENTORÍA',
			description: 'Supervisión técnica diseñada para asegurar la calidad y el éxito en proyectos y procesos estratégicos.',
			icon: '🔍'
		},
		{
			title: 'CAPACITACIÓN',
			description: 'Conocimiento especializado para potenciar habilidades y generar objetivos del progreso profesional y empresarial.',
			icon: '📚'
		}
	];

	interface Characteristic {
		icon: string;
		title: string;
		description: string;
	}

	const characteristics: Characteristic[] = [
		{ 
			icon: '✓', 
			title: 'Soluciones a la medida',
			description: 'Diseñamos estrategias personalizadas que se adaptan específicamente a las necesidades de tu organización.'
		},
		{ 
			icon: '⚡', 
			title: 'Soluciones prácticas',
			description: 'Implementamos acciones concretas y efectivas que generan resultados tangibles en el corto plazo.'
		},
		{ 
			icon: '🎯', 
			title: 'Experiencia comprobada',
			description: 'Más de 10 años respaldando empresas en el cumplimiento normativo y mejora continua.'
		},
		{ 
			icon: '💡', 
			title: 'Innovación constante',
			description: 'Utilizamos las últimas metodologías y tecnologías para optimizar tus procesos empresariales.'
		},
		{ 
			icon: '🛡️', 
			title: 'Seguridad garantizada',
			description: 'Protección total de la información y cumplimiento estricto de estándares internacionales.'
		},
		{ 
			icon: '🤝', 
			title: 'Compromiso total',
			description: 'Acompañamiento integral en cada etapa del proyecto hasta alcanzar tus objetivos.'
		},
		{ 
			icon: '📈', 
			title: 'Resultados medibles',
			description: 'KPIs claros y reportes detallados para evaluar el impacto de nuestras intervenciones.'
		},
		{ 
			icon: '🌟', 
			title: 'Excelencia operativa',
			description: 'Optimización de procesos para lograr la máxima eficiencia y calidad en tu operación.'
		}
	];

	const clients = ['Axon', 'Jetstar', 'Expedia', 'Qantas', 'Alitalia'];
</script>

<svelte:head>
	<title>SEGISPRO - Tu aliado estratégico</title>
</svelte:head>

<!-- Header/Navbar -->
<header class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
	{#if mounted}
		<nav class="container mx-auto px-6 py-4" in:fade={{ duration: 600 }}>
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-2">
                    <img src="/assets/logo.png" alt="SEGISPRO Logo" class="w-32 h-8">
				</div>
				<div class="hidden md:flex space-x-8">
					<a href="#inicio" class="text-gray-600 hover:text-blue-600 transition-colors">Inicio</a>
					<a href="#services" class="text-gray-600 hover:text-blue-600 transition-colors">Servicios</a>
					<a href="#nosotros" class="text-gray-600 hover:text-blue-600 transition-colors">Nosotros</a>
					<a href="#contacto" class="text-gray-600 hover:text-blue-600 transition-colors">Contacto</a>
				</div>
			</div>
		</nav>
	{/if}
</header>

<!-- Hero Section -->
<section id="hero" class="pt-32 pb-20 px-6 bg-gradient-to-b from-white to-gray-50">
	<div class="container mx-auto max-w-6xl">
		{#if heroVisible}
			<div in:fly={{ y: 50, duration: 800, easing: quintOut }}>
				<p class="text-sm text-gray-600 uppercase tracking-wide mb-4">
					Capacitaciones y auditorías para un trabajo más seguro
				</p>
				<h1 class="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
					<span class="text-blue-600">SEGISPRO</span><br />
					<span class="text-gray-800">tu aliado</span><br />
					<span class="text-gray-800">estratégico.</span>
				</h1>
			</div>

			<div in:fly={{ y: 30, duration: 800, delay: 200, easing: quintOut }}>
				<p class="text-lg text-gray-600 max-w-2xl mb-8 leading-relaxed">
					Capacitaciones personalizadas que fortalecen habilidades y cumplimiento. Muy pronto, cursos digitales para aprender con flexibilidad y apoyo experto en todo momento.
				</p>
			</div>
		{/if}
	</div>
</section>

<!-- Services Section -->
<section id="services" class="py-20 px-6 bg-white">
	<div class="container mx-auto max-w-6xl">
		{#if mounted}
			<div in:fly={{ y: 30, duration: 600 }}>
				<p class="text-sm text-gray-600 uppercase tracking-wide mb-3">
					Experiencia y compromiso
				</p>
				<h2 class="text-4xl md:text-5xl font-bold text-blue-600 mb-16">
					Nuestros servicios
				</h2>
			</div>
		{/if}

		<div class="grid md:grid-cols-2 gap-8">
			{#each services as service, i}
				{#if servicesVisible || mounted}
					<div
						in:scale={{ duration: 600, delay: i * 150, start: 0.8, easing: quintOut }}
						class="group relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
					>
						<!-- Background Pattern -->
						<div class="absolute inset-0 opacity-10 bg-gradient-to-br from-blue-500 to-transparent"></div>
						
						<div class="relative z-10">
							<div class="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
								{service.icon}
							</div>
							<h3 class="text-2xl font-bold text-gray-800 mb-4">
								{service.title}
							</h3>
							<p class="text-gray-700 mb-6 leading-relaxed">
								{service.description}
							</p>
							<button class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
								Ver más
							</button>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	</div>
</section>

<!-- Characteristics Section -->
<section id="characteristics" class="py-20 px-6 bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 text-white relative overflow-hidden">
	<!-- Background Pattern -->
	<div class="absolute inset-0 opacity-5">
		<div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 40px 40px;"></div>
	</div>

	<div class="container mx-auto max-w-6xl relative z-10">
		{#if characteristicsVisible || mounted}
			<div in:fly={{ x: -50, duration: 800 }}>
				<h2 class="text-4xl md:text-5xl font-bold mb-8">
					Características
				</h2>
			</div>

			<div in:fly={{ x: -50, duration: 800, delay: 200 }}>
				<div class="mb-12">
					<h3 class="text-2xl font-bold mb-4">
						01 / Ayudar a las entidades al mejoramiento continuo
					</h3>
					<p class="text-gray-300 leading-relaxed max-w-3xl">
						Nos dedicamos a guiar las entidades en su búsqueda de mejora continua, ofreciendo soluciones innovadoras, eficientes y sostenibles para impulsar su crecimiento y éxito a largo plazo.
					</p>
				</div>
			</div>

			<!-- Carrusel Infinito de Características -->
			<CarouselInfinito visible={characteristicsVisible || mounted} {characteristics} />
		{/if}
	</div>
</section>

<!-- Clients Section -->
<section class="py-16 px-6 bg-gray-50">
	<div class="container mx-auto max-w-6xl">
		<CarouselClientes visible={mounted} {clients} speed={35} />
	</div>
</section>



<!-- Footer -->
<footer class="bg-white border-t border-gray-200 py-12 px-6">
	<div class="container mx-auto max-w-6xl">
		{#if mounted}
			<div in:fade={{ duration: 600, delay: 200 }}>
				<div class="grid md:grid-cols-4 gap-8">
					<!-- Segispro Column -->
					<div>
						<h4 class="font-bold text-gray-800 mb-4">Segispro</h4>
						<p class="text-sm text-gray-600">
							Created by Visual Design
						</p>
					</div>

					<!-- Company Column -->
					<div>
						<h4 class="font-bold text-gray-800 mb-4">Company</h4>
						<ul class="space-y-2">
							<li><a href="#" class="text-sm text-gray-600 hover:text-blue-600 transition-colors">About</a></li>
							<li><a href="#" class="text-sm text-gray-600 hover:text-blue-600 transition-colors">Careers</a></li>
							<li><a href="#" class="text-sm text-gray-600 hover:text-blue-600 transition-colors">Mobile</a></li>
						</ul>
					</div>

					<!-- Contact Column -->
					<div>
						<h4 class="font-bold text-gray-800 mb-4">Contact</h4>
						<ul class="space-y-2">
							<li><a href="#" class="text-sm text-gray-600 hover:text-blue-600 transition-colors">Help</a></li>
							<li><a href="#" class="text-sm text-gray-600 hover:text-blue-600 transition-colors">Press</a></li>
							<li><a href="#" class="text-sm text-gray-600 hover:text-blue-600 transition-colors">Affiliates</a></li>
						</ul>
					</div>

					<!-- More Column -->
					<div>
						<h4 class="font-bold text-gray-800 mb-4">More</h4>
						<ul class="space-y-2">
							<li><a href="#" class="text-sm text-gray-600 hover:text-blue-600 transition-colors">Airline</a></li>
							<li><a href="#" class="text-sm text-gray-600 hover:text-blue-600 transition-colors">Low fare tips</a></li>
						</ul>
					</div>
				</div>

				<div class="mt-12 pt-8 border-t border-gray-200 text-center">
					<p class="text-sm text-gray-600">
						All rights www.segispro.co
					</p>
				</div>
			</div>
		{/if}
	</div>
</footer>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}

	:global(body) {
		overflow-x: hidden;
	}
</style>