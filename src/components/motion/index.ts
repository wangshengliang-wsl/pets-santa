// 动画组件导出
export { ScrollReveal, ScrollRevealWithDelay } from './ScrollReveal';
export { ParallaxSection, ParallaxImage, ParallaxBackground } from './ParallaxSection';
export { StaggerContainer, StaggerItem, StaggerGrid } from './StaggerContainer';
export { FloatingElement, AnimatedCounter, FadePresence } from './FloatingElement';

// 动画变体导出
export {
  // 入场动画
  fadeIn,
  fadeInOnly,
  slideInLeft,
  slideInRight,
  slideInTop,
  scaleIn,
  popIn,
  bounceIn,

  // 错开动画
  staggerContainer,
  staggerItem,
  staggerCard,

  // 循环动画
  float,
  floatRotate,
  pulse,
  buttonPulse,
  textGlow,

  // 手风琴动画
  accordionContent,
  arrowRotate,

  // Hover 效果
  hoverScale,
  hoverLift,
  tapScale,

  // 页面过渡
  pageTransition
} from './variants';
