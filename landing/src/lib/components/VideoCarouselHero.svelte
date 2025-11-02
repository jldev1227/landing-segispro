<script lang="ts">
	import { onMount } from 'svelte';
	import { scale } from 'svelte/transition';

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
	let carouselTrack: HTMLElement;
	let isDragging = false;
	let startX = 0;
	let currentTranslate = 0;
	let prevTranslate = 0;
	let animationID: number;
	let isAutoScrolling = true;
	let lastInteractionTime = Date.now();
	let autoScrollInterval: ReturnType<typeof setInterval>;

	const INTERACTION_TIMEOUT = 5000;
	const AUTO_SCROLL_INTERVAL = 3000; // 3 segundos

	// Crear array extendido para scroll infinito
	$: extendedMedia = [...mediaItems, ...mediaItems, ...mediaItems];

	function getPositionX(event: MouseEvent | TouchEvent): number {
		return 'touches' in event ? event.touches[0].clientX : event.clientX;
	}

	function animation() {
		setSliderPosition();
		if (isDragging) requestAnimationFrame(animation);
	}

	function setSliderPosition() {
		if (!carouselTrack) return;
		carouselTrack.style.transform = `translateX(${currentTranslate}px)`;
	}

	function handleDragStart(event: MouseEvent | TouchEvent) {
		return; // Deshabilitado
	}

	function handleDragMove(event: MouseEvent | TouchEvent) {
		return; // Deshabilitado
	}

	function handleDragEnd() {
		return; // Deshabilitado
	}

	function goToNext() {
		currentIndex++;

		if (currentIndex >= extendedMedia.length - mediaItems.length) {
			currentIndex = mediaItems.length;
			currentTranslate = -currentIndex * 100;
			prevTranslate = currentTranslate;
			setSliderPosition();

			setTimeout(() => {
				currentIndex++;
				updatePosition();
			}, 50);
		} else {
			updatePosition();
		}

		resetAutoScroll();
	}

	function goToPrev() {
		return; // Deshabilitado - solo avance automático
	}

	function goToIndex(index: number) {
		return; // Deshabilitado
	}

	function updatePosition() {
		currentTranslate = -currentIndex * 100;
		prevTranslate = currentTranslate;
		setSliderPosition();
	}

	function resetAutoScroll() {
		// No se pausa - siempre activo
		return;
	}

	function startAutoScroll() {
		autoScrollInterval = setInterval(() => {
			goToNext();
		}, AUTO_SCROLL_INTERVAL);
	}

	onMount(() => {
		currentIndex = mediaItems.length;
		updatePosition();
		startAutoScroll();

		return () => {
			clearInterval(autoScrollInterval);
			cancelAnimationFrame(animationID);
		};
	});
</script>

{#if visible}
	<div class="relative w-full" in:scale={{ duration: 1000, delay: 400, start: 0.8 }}>
		<!-- Contenedor del carousel -->
		<div class="video-carousel-container relative overflow-hidden rounded-2xl h-72 xl:h-80">
			<!-- Gradiente de fondo similar al banner -->
			<div
				class="absolute inset-0 bg-linear-to-br from-blue-600/10 via-blue-500/5 to-orange-500/10"
			></div>

			<!-- Track del carousel -->
			<div
				bind:this={carouselTrack}
				class="carousel-track flex h-full"
				role="region"
				aria-label="Carousel de medios"
			>
				{#each extendedMedia as media, i}
					<div class="media-slide shrink-0 h-full" style="width: 100%;">
						<div class="relative h-full w-full">
							{#if media.type === 'video'}
								<!-- Video -->
								<video
									autoplay
									muted
									loop
									playsinline
									preload="auto"
									class="h-full w-full object-cover"
								>
									<source src={media.src} type="video/mp4" />
								</video>
							{:else}
								<!-- Imagen -->
								<img
									src={media.src}
									alt="Slide de SEGISPRO"
									class="h-full w-full object-cover"
									loading="lazy"
								/>
							{/if}

							<!-- Overlay gradient sutil -->
							<div
								class="pointer-events-none absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent"
							></div>
						</div>
					</div>
				{/each}
			</div>

			<!-- Borde brillante animado -->
			<div class="border-glow pointer-events-none absolute inset-0 rounded-2xl"></div>
		</div>

		<!-- Elementos decorativos flotantes -->
		<div
			class="absolute -right-4 -top-4 h-12 w-12 animate-pulse rounded-full bg-blue-500/20 blur-2xl"
		></div>
		<div
			class="absolute -bottom-4 -left-4 h-16 w-16 animate-pulse rounded-full bg-orange-500/20 blur-3xl"
			style="animation-delay: 1s;"
		></div>
	</div>
{/if}

<style>
	.carousel-track {
		transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		user-select: none;
		-webkit-user-select: none;
	}

	.media-slide {
		flex-shrink: 0;
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

	/* Mejora del scroll en móviles */
	@media (hover: none) {
		.carousel-track {
			cursor: default;
		}
	}
</style>
