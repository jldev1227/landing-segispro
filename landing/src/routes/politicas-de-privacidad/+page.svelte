<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { resolveRoute } from '$app/paths';

	let mounted = false;

	onMount(() => {
		mounted = true;
	});
</script>

<svelte:head>
	<title>Política de Privacidad - SEGISPRO</title>
	<meta
		name="description"
		content="Conoce cómo SEGISPRO protege y gestiona tus datos personales. Política de privacidad completa."
	/>
	<meta name="robots" content="index, follow" />
</svelte:head>

<!-- Header Simple -->
<header class="fixed top-0 right-0 left-0 z-50 bg-white shadow-md">
	<nav class="container mx-auto px-4 py-4 sm:px-6">
		<div class="flex items-center justify-between">
			<a href={resolveRoute('/')} class="group flex items-center">
				<img
					src="/assets/logo.png"
					alt="SEGISPRO Logo"
					class="h-8 w-32 transition-transform duration-300 group-hover:scale-105 sm:h-9 sm:w-36"
				/>
			</a>
			<a
				href={resolveRoute('/')}
				class="flex items-center gap-2 text-sm font-medium text-gray-700 transition-colors hover:text-blue-600"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				Volver al inicio
			</a>
		</div>
	</nav>
</header>

<!-- Main Content -->
<main class="bg-linear-to-br from-white via-gray-50 to-blue-50 px-6 pt-32 pb-20">
	<div class="container mx-auto max-w-4xl">
		{#if mounted}
			<!-- Header -->
			<div in:fly={{ y: 30, duration: 600 }} class="mb-12 text-center">
				<div class="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2">
					<svg class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
						/>
					</svg>
					<span class="text-sm font-semibold text-blue-600">Legal</span>
				</div>
				<h1 class="mb-4 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
					Política de <span class="text-blue-600">Privacidad</span>
				</h1>
				<div
					class="mx-auto h-1.5 w-24 rounded-full bg-linear-to-r from-blue-600 to-orange-600"
				></div>
			</div>

			<!-- Content Card -->
			<div
				in:fly={{ y: 30, duration: 800, delay: 200 }}
				class="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl"
			>
				<div class="p-8 md:p-12">
					<!-- Quiénes somos -->
					<section class="mb-10">
						<h2 class="mb-4 text-2xl font-bold text-gray-900">Quiénes somos</h2>
						<p class="leading-relaxed text-gray-700">
							La dirección de nuestra web es: <a
								href="https://www.segispro.com"
								class="font-medium text-blue-600 transition-colors hover:text-blue-700"
								>https://www.segispro.com</a
							>
						</p>
					</section>

					<!-- Medios -->
					<section class="mb-10">
						<h2 class="mb-4 text-2xl font-bold text-gray-900">Medios</h2>
						<p class="leading-relaxed text-gray-700">
							Si subes imágenes a la web, deberías evitar subir imágenes con datos de ubicación (GPS
							EXIF) incluidos. Los visitantes de la web pueden descargar y extraer cualquier dato de
							ubicación de las imágenes de la web.
						</p>
					</section>

					<!-- Cookies -->
					<section class="mb-10">
						<h2 class="mb-4 text-2xl font-bold text-gray-900">Cookies</h2>
						<div class="space-y-4 text-gray-700">
							<p class="leading-relaxed">
								Si dejas un comentario en nuestro sitio puedes elegir guardar tu nombre, dirección
								de correo electrónico y web en cookies. Esto es para tu comodidad, para que no
								tengas que volver a rellenar tus datos cuando dejes otro comentario. Estas cookies
								tendrán una duración de un año.
							</p>
							<p class="leading-relaxed">
								Si tienes una cuenta y te conectas a este sitio, instalaremos una cookie temporal
								para determinar si tu navegador acepta cookies. Esta cookie no contiene datos
								personales y se elimina al cerrar el navegador.
							</p>
							<p class="leading-relaxed">
								Cuando accedas, también instalaremos varias cookies para guardar tu información de
								acceso y tus opciones de visualización de pantalla. Las cookies de acceso duran dos
								días, y las cookies de opciones de pantalla duran un año. Si seleccionas
								«Recuérdarme», tu acceso perdurará durante dos semanas. Si sales de tu cuenta, las
								cookies de acceso se eliminarán.
							</p>
							<p class="leading-relaxed">
								Si editas o publicas un artículo se guardará una cookie adicional en tu navegador.
								Esta cookie no incluye datos personales y simplemente indica el ID del artículo que
								acabas de editar. Caduca después de 1 día.
							</p>
						</div>
					</section>

					<!-- Contenido incrustado -->
					<section class="mb-10">
						<h2 class="mb-4 text-2xl font-bold text-gray-900">
							Contenido incrustado de otros sitios web
						</h2>
						<div class="space-y-4 text-gray-700">
							<p class="leading-relaxed">
								Los artículos de este sitio pueden incluir contenido incrustado (por ejemplo,
								vídeos, imágenes, artículos, etc.). El contenido incrustado de otras webs se
								comporta exactamente de la misma manera que si el visitante hubiera visitado la otra
								web.
							</p>
							<p class="leading-relaxed">
								Estas web pueden recopilar datos sobre ti, utilizar cookies, incrustar un
								seguimiento adicional de terceros, y supervisar tu interacción con ese contenido
								incrustado, incluido el seguimiento de tu interacción con el contenido incrustado si
								tienes una cuenta y estás conectado a esa web.
							</p>
						</div>
					</section>

					<!-- Con quién compartimos tus datos -->
					<section class="mb-10">
						<h2 class="mb-4 text-2xl font-bold text-gray-900">Con quién compartimos tus datos</h2>
						<p class="leading-relaxed text-gray-700">
							Si solicitas un restablecimiento de contraseña, tu dirección IP será incluida en el
							correo electrónico de restablecimiento.
						</p>
					</section>

					<!-- Cuánto tiempo conservamos tus datos -->
					<section class="mb-10">
						<h2 class="mb-4 text-2xl font-bold text-gray-900">
							Cuánto tiempo conservamos tus datos
						</h2>
						<div class="space-y-4 text-gray-700">
							<p class="leading-relaxed">
								Si dejas un comentario, el comentario y sus metadatos se conservan indefinidamente.
								Esto es para que podamos reconocer y aprobar comentarios sucesivos automáticamente,
								en lugar de mantenerlos en una cola de moderación.
							</p>
							<p class="leading-relaxed">
								De los usuarios que se registran en nuestra web (si los hay), también almacenamos la
								información personal que proporcionan en su perfil de usuario. Todos los usuarios
								pueden ver, editar o eliminar su información personal en cualquier momento (excepto
								que no pueden cambiar su nombre de usuario). Los administradores de la web también
								pueden ver y editar esa información.
							</p>
						</div>
					</section>

					<!-- Qué derechos tienes -->
					<section class="mb-10">
						<h2 class="mb-4 text-2xl font-bold text-gray-900">
							Qué derechos tienes sobre tus datos
						</h2>
						<p class="leading-relaxed text-gray-700">
							Si tienes una cuenta o has dejado comentarios en esta web, puedes solicitar recibir un
							archivo de exportación de los datos personales que tenemos sobre ti, incluyendo
							cualquier dato que nos hayas proporcionado. También puedes solicitar que eliminemos
							cualquier dato personal que tengamos sobre ti. Esto no incluye ningún dato que estemos
							obligados a conservar con fines administrativos, legales o de seguridad.
						</p>
					</section>

					<!-- Dónde se envían tus datos -->
					<section class="mb-0">
						<h2 class="mb-4 text-2xl font-bold text-gray-900">Dónde se envían tus datos</h2>
						<p class="leading-relaxed text-gray-700">
							Los comentarios de los visitantes puede que los revise un servicio de detección
							automática de spam.
						</p>
					</section>
				</div>

				<!-- Footer de la card -->
				<div class="border-t border-gray-200 bg-gray-50 p-8">
					<div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
						<p class="text-sm text-gray-600">
							Última actualización: <span class="font-semibold">1 de noviembre de 2025</span>
						</p>
						<a
							href="/#contacto"
							class="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-blue-700 hover:shadow-lg"
						>
							<span>¿Tienes preguntas?</span>
							<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</a>
					</div>
				</div>
			</div>

			<!-- Back to home button -->
			<div in:fade={{ duration: 600, delay: 400 }} class="mt-8 text-center">
				<a
					href={resolveRoute('/')}
					class="inline-flex items-center gap-2 text-gray-600 transition-colors hover:text-blue-600"
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
						/>
					</svg>
					<span class="font-medium">Volver al inicio</span>
				</a>
			</div>
		{/if}
	</div>
</main>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}

	:global(body) {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
</style>
