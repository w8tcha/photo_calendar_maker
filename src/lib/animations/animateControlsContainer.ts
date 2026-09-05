import gsap from 'gsap';

export default function animateControlsContainer(
  controlsContainer: HTMLDivElement,
  direction: AnimationDirection,
) {
  const navButtons = controlsContainer.querySelectorAll('.nav-btn');

  const tl = gsap.timeline();

  if (direction === 'in') {
    tl.fromTo(controlsContainer, { bottom: '-4rem' }, { bottom: '2rem', ease: 'power1.in' });

    if (navButtons.length) {
      const arr = Array.from(navButtons);
      const prevBtn = arr.find((el) => el.id === 'prev-month') as HTMLElement;
      const nextBtn = arr.find((el) => el.id === 'next-month') as HTMLElement;

      tl.fromTo(prevBtn, { x: '-12rem' }, { x: '-8rem', ease: 'power1.in' }, '<');
      tl.fromTo(nextBtn, { x: '12rem' }, { x: '8rem', ease: 'power1.in' }, '<');
    }
  } else {
    tl.fromTo(controlsContainer, { bottom: '2rem' }, { bottom: '-4rem', ease: 'power1.out' });

    if (navButtons.length) {
      const arr = Array.from(navButtons);
      const prevBtn = arr.find((el) => el.id === 'prev-month') as HTMLElement;
      const nextBtn = arr.find((el) => el.id === 'next-month') as HTMLElement;

      tl.fromTo(prevBtn, { x: '-8rem' }, { x: '-12rem', ease: 'power1.out' }, '<');
      tl.fromTo(nextBtn, { x: '8rem' }, { x: '12rem', ease: 'power1.out' }, '<');
    }
  }
}
