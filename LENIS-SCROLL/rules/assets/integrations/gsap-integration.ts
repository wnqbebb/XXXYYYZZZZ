import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initLenisWithGSAP(lenis: Lenis) {
  // Sincronizar Lenis con ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  // Añadir Lenis al ticker de GSAP
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  // Desactivar lag smoothing
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove((time) => {
      lenis.raf(time * 1000);
    });
  };
}

export function refreshScrollTrigger() {
  ScrollTrigger.refresh();
}

export function killAllScrollTriggers() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}
