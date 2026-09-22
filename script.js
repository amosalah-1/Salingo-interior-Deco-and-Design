document.addEventListener('DOMContentLoaded', () => {
	if (window.lucide) lucide.createIcons();

	const header = document.querySelector('.site-header');
	const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 32);
	updateHeader();
	window.addEventListener('scroll', updateHeader, { passive: true });

	const revealObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible');
				revealObserver.unobserve(entry.target);
			}
		});
	}, { threshold: 0.14 });
	document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

	const counterObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) return;
			const counter = entry.target;
			const target = Number(counter.dataset.counter);
			let current = 0;
			const increment = Math.max(1, Math.ceil(target / 36));
			const tick = () => {
				current = Math.min(current + increment, target);
				counter.textContent = String(current).padStart(2, '0');
				if (current < target) requestAnimationFrame(tick);
			};
			tick();
			observer.unobserve(counter);
		});
	}, { threshold: 0.8 });
	document.querySelectorAll('[data-counter]').forEach((counter) => counterObserver.observe(counter));

	const form = document.querySelector('.quote-form');
	form.addEventListener('submit', (event) => {
		event.preventDefault();
		form.querySelector('.form-status').textContent = 'Thank you. We will be in touch shortly.';
		form.reset();
	});
});
