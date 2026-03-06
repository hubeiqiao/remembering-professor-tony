const revealTargets = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion) {
  revealTargets.forEach((target) => target.classList.add('is-visible'));
} else {
  // Reveal animations
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.12,
    },
  );

  revealTargets.forEach((target) => revealObserver.observe(target));

  // Timeline node interactions
  const storyBands = document.querySelectorAll('.story-band');
  const timelineObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // Toggle the is-active class to light up the timeline node
        if (entry.isIntersecting) {
          entry.target.classList.add('is-active');
        } else {
          // Optional: remove if you want them to turn off when scrolling past
          // entry.target.classList.remove('is-active'); 
        }
      });
    },
    {
      // Trigger when the section reaches the middle of the viewport
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0,
    }
  );

  storyBands.forEach((band) => timelineObserver.observe(band));
}
