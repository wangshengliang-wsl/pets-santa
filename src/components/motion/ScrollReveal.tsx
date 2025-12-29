"use client";

import { motion, useInView, Variants } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import { fadeIn } from './variants';

interface ScrollRevealProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
  once?: boolean;
  amount?: number;
}

/**
 * 滚动触发显示组件
 * 当元素进入视口时触发动画
 */
export function ScrollReveal({
  children,
  variants = fadeIn,
  className = "",
  delay = 0,
  once = true,
  amount = 0.2
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      className={className}
      custom={delay}
      style={delay > 0 ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </motion.div>
  );
}

/**
 * 带延迟的滚动触发显示
 */
export function ScrollRevealWithDelay({
  children,
  variants = fadeIn,
  className = "",
  delay = 0,
  once = true,
  amount = 0.2
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });

  const delayedVariants: Variants = {
    hidden: variants.hidden,
    visible: {
      ...variants.visible,
      transition: {
        ...(typeof variants.visible === 'object' && 'transition' in variants.visible
          ? variants.visible.transition
          : {}),
        delay
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={delayedVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default ScrollReveal;
