document.addEventListener('DOMContentLoaded', () => {
	if (window.lucide) lucide.createIcons();

	const header = document.querySelector('.site-header');
	const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 32);
	updateHeader();
	window.addEventListener('scroll', updateHeader, { passive: true });

	const menuToggle = document.querySelector('.menu-toggle');
	const mainNav = document.querySelector('.main-nav');
	const closeMenu = () => {
		header.classList.remove('menu-open');
		menuToggle.setAttribute('aria-expanded', 'false');
		menuToggle.setAttribute('aria-label', 'Open menu');
	};

	menuToggle.addEventListener('click', () => {
		const isOpen = header.classList.toggle('menu-open');
		menuToggle.setAttribute('aria-expanded', String(isOpen));
		menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
	});

	mainNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
	window.addEventListener('resize', () => {
		if (window.innerWidth > 800) closeMenu();
	});
	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') closeMenu();
	});

	const viewProjectsButton = document.querySelector('.view-projects-button');
	const additionalProjects = document.querySelector('.additional-projects');
	if (viewProjectsButton && additionalProjects) {
		const buttonLabel = viewProjectsButton.querySelector('span');
		viewProjectsButton.addEventListener('click', () => {
			const isExpanded = viewProjectsButton.getAttribute('aria-expanded') === 'true';
			additionalProjects.hidden = isExpanded;
			viewProjectsButton.setAttribute('aria-expanded', String(!isExpanded));
			buttonLabel.textContent = isExpanded ? 'View all projects' : 'Show fewer projects';
		});
	}

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
		const formData = new FormData(form);
		const name = formData.get('name');
		const email = formData.get('email');
		const service = formData.get('service');
		const message = formData.get('message');
		const emailBody = [
			`Name: ${name}`,
			`Email: ${email}`,
			`Service: ${service}`,
			'',
			'Project details:',
			message || 'Not provided',
		].join('\n');
		const gmailUrl = new URL('https://mail.google.com/mail/u/0/');
		gmailUrl.searchParams.set('view', 'cm');
		gmailUrl.searchParams.set('fs', '1');
		gmailUrl.searchParams.set('to', 'godfreysilingi08@gmail.com');
		gmailUrl.searchParams.set('su', `New quote request from ${name}`);
		gmailUrl.searchParams.set('body', emailBody);
		window.open(gmailUrl.toString(), '_blank', 'noopener,noreferrer');
		form.querySelector('.form-status').textContent = 'Your quote request is ready in Gmail. Review it and select Send.';
		form.reset();
	});
});
