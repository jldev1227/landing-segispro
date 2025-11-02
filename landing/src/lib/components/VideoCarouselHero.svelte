<script lang="ts">
	import { onMount } from 'svelte';
	import { scale, fly } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	export let visible = false;

	interface MediaItem {
		type: 'video' | 'image';
		src: string;
	}

	const mediaItems: MediaItem[] = [
		{
			type: 'video',
			src: '/videos/hero-video.mp4'
		},
		{
			type: 'image',
			src: '/slides/slide-1.jpg'
		},
		{
			type: 'image',
			src: '/slides/slide-2.jpg'
		},
		{
			type: 'image',
			src: '/slides/slide-3.jpg'
		}
	];

	let currentIndex = 0;
	let previousIndex = 0;
	let isTransitioning = false;
	let autoScrollInterval: ReturnType<typeof setInterval>;

	const AUTO_SCROLL_INTERVAL = 4000; // 4 segundos para mejor visualización

	function goToNext() {
		if (isTransitioning) return;

		isTransitioning = true;
		previousIndex = currentIndex;
		currentIndex = (currentIndex + 1) % mediaItems.length;

		setTimeout(() => {
			isTransitioning = false;
		}, 800); // Duración de la transición
	}

	function startAutoScroll() {
		autoScrollInterval = setInterval(() => {
			goToNext();
		}, AUTO_SCROLL_INTERVAL);
	}

	onMount(() => {
		startAutoScroll();

		return () => {
			clearInterval(autoScrollInterval);
		};
	});
</script>

{#if visible}
	<div class="relative w-full" in:scale={{ duration: 1000, delay: 400, start: 0.8 }}>
		<!-- Contenedor del carousel con perspectiva 3D -->
		<div
			class="carousel-container relative h-52 overflow-hidden rounded-2xl xl:h-64"
			style="perspective: 1500px;"
		>
			<!-- Gradiente de fondo -->
			<div
				class="absolute inset-0 bg-linear-to-br from-blue-600/10 via-blue-500/5 to-orange-500/10"
			></div>

			<!-- Stack de cartas/banners -->
			<div class="relative h-full w-full">
				{#each mediaItems as media, i (i)}
					{#if i === currentIndex}
						<!-- Carta actual entrando -->
						<div
							class="card-slide absolute inset-0"
							in:fly={{
								x: 300,
								y: -50,
								duration: 700,
								easing: quintOut,
								opacity: 0
							}}
							style="transform-origin: center center;"
						>
							<div class="relative h-full w-full">
								{#if media.type === 'video'}
									<video
										autoplay
										muted
										loop
										playsinline
										preload="auto"
										class="h-full w-full rounded-2xl object-cover"
									>
										<source src={media.src} type="video/mp4" />
									</video>
								{:else}
									<img
										src={media.src}
										alt="Slide de SEGISPRO"
										class="h-full w-full rounded-2xl object-cover"
										loading="eager"
									/>
								{/if}

								<!-- Overlay gradient sutil -->
								<div
									class="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-t from-black/20 via-transparent to-transparent"
								></div>
							</div>
						</div>
					{:else if i === previousIndex && isTransitioning}
						<!-- Carta anterior saliendo -->
						<div
							class="card-slide absolute inset-0"
							out:fly={{
								x: -300,
								y: 50,
								duration: 700,
								easing: quintOut,
								opacity: 0
							}}
							style="transform-origin: center center;"
						>
							<div class="relative h-full w-full">
								{#if media.type === 'video'}
									<video
										autoplay
										muted
										loop
										playsinline
										preload="auto"
										class="h-full w-full rounded-2xl object-cover"
									>
										<source src={media.src} type="video/mp4" />
									</video>
								{:else}
									<img
										src={media.src}
										alt="Slide de SEGISPRO"
										class="h-full w-full rounded-2xl object-cover"
										loading="eager"
									/>
								{/if}

								<!-- Overlay gradient sutil -->
								<div
									class="pointer-events-none absolute inset-0 rounded-2xl bg-linear-to-t from-black/20 via-transparent to-transparent"
								></div>
							</div>
						</div>
					{/if}
				{/each}
			</div>

			<!-- Borde brillante animado -->
			<div class="border-glow pointer-events-none absolute inset-0 rounded-2xl"></div>
		</div>

		<!-- Indicadores de slide -->
		<div class="mt-4 flex items-center justify-center gap-2">
			{#each mediaItems as _, i}
				<button
					on:click={() => {
						if (!isTransitioning && i !== currentIndex) {
							isTransitioning = true;
							previousIndex = currentIndex;
							currentIndex = i;
							setTimeout(() => {
								isTransitioning = false;
							}, 800);
						}
					}}
					class="h-2 rounded-full transition-all duration-300 {i === currentIndex
						? 'w-8 bg-blue-500'
						: 'w-2 bg-gray-300 hover:bg-gray-400'}"
					aria-label={`Ir al slide ${i + 1}`}
				></button>
			{/each}
		</div>

		<!-- Elementos decorativos flotantes -->
		<div
			class="absolute -top-4 -right-4 h-12 w-12 animate-pulse rounded-full bg-blue-500/20 blur-2xl"
		></div>
		<div
			class="absolute -bottom-4 -left-4 h-16 w-16 animate-pulse rounded-full bg-orange-500/20 blur-3xl"
			style="animation-delay: 1s;"
		></div>
	</div>
{/if}

<style>
	.carousel-container {
		transform-style: preserve-3d;
	}

	.card-slide {
		backface-visibility: hidden;
		-webkit-backface-visibility: hidden;
		transform-style: preserve-3d;
		will-change: transform, opacity;
	}

	/* Borde brillante animado */
	.border-glow {
		background: linear-gradient(
			90deg,
			transparent,
			rgba(59, 130, 246, 0.3),
			rgba(249, 115, 22, 0.3),
			transparent
		);
		background-size: 200% 100%;
		animation: glow-slide 3s ease-in-out infinite;
		opacity: 0.6;
		border-radius: 1rem;
		pointer-events: none;
	}

	@keyframes glow-slide {
		0%,
		100% {
			background-position: 0% 0%;
		}
		50% {
			background-position: 100% 0%;
		}
	}

	/* Asegurar que las imágenes/videos ocupen el full size */
	.card-slide img,
	.card-slide video {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	/* Mejora del rendimiento en dispositivos móviles */
	@media (hover: none) {
		.card-slide {
			-webkit-transform: translateZ(0);
			transform: translateZ(0);
		}
	}

	/* Animación personalizada para efecto blackjack */
	@keyframes card-deal {
		0% {
			transform: translateX(100%) translateY(-30%) rotateY(25deg) rotateZ(5deg);
			opacity: 0;
		}
		100% {
			transform: translateX(0) translateY(0) rotateY(0) rotateZ(0);
			opacity: 1;
		}
	}

	@keyframes card-discard {
		0% {
			transform: translateX(0) translateY(0) rotateY(0) rotateZ(0);
			opacity: 1;
		}
		100% {
			transform: translateX(-100%) translateY(30%) rotateY(-25deg) rotateZ(-5deg);
			opacity: 0;
		}
	}
</style>
