"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { float, floatRotate } from './variants';

interface FloatingElementProps {
  children: ReactNode;
  className?: string;
  /**
   * 是否包含旋转动画
   */
  withRotation?: boolean;
  /**
   * 动画持续时间（秒）
   */
  duration?: number;
}

/**
 * 悬浮动画元素
 * 创建上下悬浮的装饰效果
 */
export function FloatingElement({
  children,
  className = "",
  withRotation = false,
  duration = 4
}: FloatingElementProps) {
  const variants = withRotation ? floatRotate : float;

  const customVariants = {
    initial: variants.initial,
    animate: {
      ...variants.animate,
      transition: {
        ...(typeof variants.animate === 'object' && 'transition' in variants.animate
          ? variants.animate.transition
          : {}),
        duration
      }
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={customVariants}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedCounterProps {
  value: number;
  className?: string;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

/**
 * 数字滚动动画
 * 数值从 0 增长到目标值
 */
export function AnimatedCounter({
  value,
  className = "",
  duration = 1.5,
  prefix = "",
  suffix = ""
}: AnimatedCounterProps) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {prefix}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {value}
      </motion.span>
      {suffix}
    </motion.span>
  );
}

interface FadePresenceProps {
  children: ReactNode;
  show: boolean;
  className?: string;
}

/**
 * 淡入淡出切换
 * 用于条件渲染的平滑过渡
 */
export function FadePresence({
  children,
  show,
  className = ""
}: FadePresenceProps) {
  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default FloatingElement;
