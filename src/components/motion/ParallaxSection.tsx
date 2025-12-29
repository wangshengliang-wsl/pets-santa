"use client";

import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';
import { useRef, ReactNode } from 'react';

type ScrollOffset = ["start end", "end start"] | ["start start", "end start"];

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  /**
   * 视差速度：-1 到 1
   * 负数：向上移动（比滚动慢）
   * 正数：向下移动（比滚动慢）
   * 0：无视差效果
   */
  speed?: number;
  /**
   * 滚动范围配置
   * 默认：["start end", "end start"]
   */
  offset?: ScrollOffset;
}

/**
 * 视差滚动区块组件
 * 创建滚动时的视差深度效果
 */
export function ParallaxSection({
  children,
  className = "",
  speed = 0.3,
  offset = ["start end", "end start"]
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * -100, speed * 100]);

  return (
    <motion.div
      ref={ref}
      style={{ y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  speed?: number;
  containerClassName?: string;
}

/**
 * 视差图片组件
 * 图片在容器内产生视差效果
 */
export function ParallaxImage({
  src,
  alt,
  className = "",
  speed = 0.2,
  containerClassName = ""
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [speed * -50, speed * 50]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);

  return (
    <div ref={ref} className={`overflow-hidden ${containerClassName}`}>
      <motion.img
        src={src}
        alt={alt}
        style={{ y, scale }}
        className={`w-full h-full object-cover ${className}`}
      />
    </div>
  );
}

interface ParallaxBackgroundProps {
  children?: ReactNode;
  className?: string;
  speed?: number;
}

/**
 * 视差背景组件
 * 用于创建背景层的视差效果
 */
export function ParallaxBackground({
  children,
  className = "",
  speed = -0.2
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 200]);

  return (
    <div ref={ref} className="relative">
      <motion.div
        style={{ y }}
        className={`absolute inset-0 ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}

export default ParallaxSection;
