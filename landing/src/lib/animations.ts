// Utilidades para animaciones personalizadas
import type { TransitionConfig } from 'svelte/transition';
import { cubicOut } from 'svelte/easing';

export function bounce(
	node: Element,
	{ delay = 0, duration = 600 }: { delay?: number; duration?: number } = {}
): TransitionConfig {
	return {
		delay,
		duration,
		css: (t) => {
			const eased = cubicOut(t);
			const bounceAmount = Math.sin(eased * Math.PI * 4) * (1 - eased) * 0.3;
			return `
				transform: scale(${eased}) translateY(${bounceAmount * 50}px);
				opacity: ${eased};
			`;
		}
	};
}

export function slideInLeft(
	node: Element,
	{ delay = 0, duration = 600 }: { delay?: number; duration?: number } = {}
): TransitionConfig {
	return {
		delay,
		duration,
		css: (t) => {
			const eased = cubicOut(t);
			return `
				transform: translateX(${(1 - eased) * -100}px);
				opacity: ${eased};
			`;
		}
	};
}

export function slideInRight(
	node: Element,
	{ delay = 0, duration = 600 }: { delay?: number; duration?: number } = {}
): TransitionConfig {
	return {
		delay,
		duration,
		css: (t) => {
			const eased = cubicOut(t);
			return `
				transform: translateX(${(1 - eased) * 100}px);
				opacity: ${eased};
			`;
		}
	};
}

export function fadeInUp(
	node: Element,
	{ delay = 0, duration = 600 }: { delay?: number; duration?: number } = {}
): TransitionConfig {
	return {
		delay,
		duration,
		css: (t) => {
			const eased = cubicOut(t);
			return `
				transform: translateY(${(1 - eased) * 30}px);
				opacity: ${eased};
			`;
		}
	};
}
