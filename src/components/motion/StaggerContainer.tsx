"use client";

import { motion, useInView, Variants } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import { staggerItem } from './variants';

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  once?: boolean;
  /**
   * 子元素动画开始前的延迟
   */
  delayChildren?: number;
  /**
   * 子元素之间的错开间隔
   */
  staggerDelay?: number;
  /**
   * 进入视口多少比例时触发
   */
  amount?: number;
}

/**
 * 错开动画容器
 * 子元素会依次进入，产生错开效果
 */
export function StaggerContainer({
  children,
  className = "",
  once = true,
  delayChildren = 0.1,
  staggerDelay = 0.1,
  amount = 0.1
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}

/**
 * 错开动画子项
 * 配合 StaggerContainer 使用
 */
export function StaggerItem({
  children,
  className = "",
  variants = staggerItem
}: StaggerItemProps) {
  return (
    <motion.div variants={variants} className={className}>
      {children}
    </motion.div>
  );
}

interface StaggerGridProps {
  children: ReactNode;
  className?: string;
  once?: boolean;
  delayChildren?: number;
  staggerDelay?: number;
  amount?: number;
  /**
   * 网格列数，用于计算更自然的错开顺序
   */
  columns?: number;
}

/**
 * 错开动画网格容器
 * 专为网格布局优化的错开动画
 */
export function StaggerGrid({
  children,
  className = "",
  once = true,
  delayChildren = 0.1,
  staggerDelay = 0.08,
  amount = 0.1
}: StaggerGridProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once, amount });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren
      }
    }
  };

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.95
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
      className={className}
    >
      {Array.isArray(children)
        ? children.map((child, index) => (
            <motion.div key={index} variants={itemVariants}>
              {child}
            </motion.div>
          ))
        : children
      }
    </motion.div>
  );
}

export default StaggerContainer;
