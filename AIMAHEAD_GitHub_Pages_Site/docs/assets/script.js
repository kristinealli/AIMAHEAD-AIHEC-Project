"use strict";

// Small, dependency-free enhancements: navigation, chart inspection, threshold exploration.
const menuButton = document.getElementById("menu-toggle");
const mobileNav = document.getElementById("mobile-nav");
function closeMenu() {
	if (!menuButton || !mobileNav) return;
	menuButton.setAttribute("aria-expanded", "false");
	menuButton.setAttribute("aria-label", "Open menu");
	mobileNav.hidden = true;
}
if (menuButton && mobileNav) {
	menuButton.addEventListener("click", () => {
		const open = menuButton.getAttribute("aria-expanded") !== "true";
		menuButton.setAttribute("aria-expanded", String(open));
		menuButton.setAttribute(
			"aria-label",
			open ? "Close menu" : "Open menu",
		);
		mobileNav.hidden = !open;
	});
	mobileNav
		.querySelectorAll("a")
		.forEach((link) => link.addEventListener("click", closeMenu));
	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") closeMenu();
	});
}

const progressBar = document.getElementById("reading-progress-bar");
let progressPending = false;
function updateProgress() {
	const max = document.documentElement.scrollHeight - window.innerHeight;
	progressBar.style.width =
		(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0).toFixed(1) +
		"%";
	progressPending = false;
}
if (progressBar) {
	updateProgress();
	window.addEventListener(
		"scroll",
		() => {
			if (!progressPending) {
				window.requestAnimationFrame(updateProgress);
				progressPending = true;
			}
		},
		{ passive: true },
	);
	window.addEventListener("resize", updateProgress, { passive: true });
}

const thresholds = {
	0.16: {
		combined: 0.432,
		aian: 0.443,
		other: 0.43,
		description:
			"At a 0.16 cutoff, the reported F1 score was 0.432 for the combined comparison sample.",
	},
	"0.20": {
		combined: 0.441,
		aian: 0.458,
		other: 0.438,
		description:
			"At a 0.20 cutoff, the combined F1 score rises slightly to 0.441; the AI/AN F1 is 0.458.",
	},
	"0.50": {
		combined: 0.254,
		aian: 0.303,
		other: 0.251,
		description:
			"At the conventional 0.50 cutoff, the combined F1 score falls to 0.254. National sensitivity was only 17.4% at this cutoff.",
	},
};
function selectThreshold(key) {
	const data = thresholds[key];
	if (!data) return;
	document.querySelectorAll(".threshold-option").forEach((button) => {
		const active = button.dataset.threshold === key;
		button.classList.toggle("active", active);
		button.setAttribute("aria-pressed", String(active));
	});
	const descriptions = document.getElementById("threshold-description");
	if (descriptions) descriptions.textContent = data.description;
	[
		["combined", "f1-combined"],
		["aian", "f1-aian"],
		["other", "f1-other"],
	].forEach(([name, id]) => {
		const fill = document.getElementById(id);
		const label = document.getElementById(id + "-value");
		if (fill)
			fill.style.width = ((data[name] / 0.5) * 100).toFixed(1) + "%";
		if (label) label.textContent = data[name].toFixed(3);
	});
}
document
	.querySelectorAll(".threshold-option")
	.forEach((button) =>
		button.addEventListener("click", () =>
			selectThreshold(button.dataset.threshold),
		),
	);

const figureDialog = document.getElementById("figure-dialog");
const dialogImage = document.getElementById("dialog-image");
const dialogCaption = document.getElementById("dialog-caption");
const dialogClose = document.getElementById("dialog-close");
if (figureDialog && dialogImage) {
	document.querySelectorAll(".figure-enlarge").forEach((button) => {
		button.addEventListener("click", () => {
			if (typeof figureDialog.showModal !== "function") {
				window.open(button.dataset.image, "_blank", "noopener");
				return;
			}
			dialogImage.src = button.dataset.image;
			dialogImage.alt =
				button.querySelector("img")?.alt || "Research figure";
			if (dialogCaption)
				dialogCaption.textContent = button.dataset.caption || "";
			figureDialog.showModal();
			dialogClose?.focus();
		});
	});
	dialogClose?.addEventListener("click", () => figureDialog.close());
	figureDialog.addEventListener("click", (event) => {
		if (event.target === figureDialog) figureDialog.close();
	});
	figureDialog.addEventListener("close", () => {
		dialogImage.removeAttribute("src");
	});
}

// Highlight the current major navigation section on wider displays.
if ("IntersectionObserver" in window) {
	const links = [...document.querySelectorAll(".desktop-nav a")];
	const sectionObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				links.forEach((link) =>
					link.classList.toggle(
						"current",
						link.getAttribute("href") === "#" + entry.target.id,
					),
				);
			});
		},
		{ rootMargin: "-25% 0px -65% 0px", threshold: 0 },
	);
	document
		.querySelectorAll("section[id]")
		.forEach((section) => sectionObserver.observe(section));
}
