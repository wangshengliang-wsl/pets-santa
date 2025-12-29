"use client";

import { Variants } from 'framer-motion';

// 基础淡入（从下方）
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// 淡入（无位移）
export const fadeInOnly: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// 从左侧滑入
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -60
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// 从右侧滑入
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 60
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// 从上方滑入
export const slideInTop: Variants = {
  hidden: {
    opacity: 0,
    y: -40
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// 缩放入场
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.85
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// 弹性缩放（更有活力）
export const popIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.5
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

// 弹跳效果
export const bounceIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.3,
    y: 50
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15
    }
  }
};

// 子元素错开容器
export const staggerContainer: Variants = {
  hidden: {
    opacity: 0
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

// 子元素错开项
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// 卡片错开项（带缩放）
export const staggerCard: Variants = {
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

// 悬浮动画（用于装饰元素）
export const float: Variants = {
  initial: {
    y: 0
  },
  animate: {
    y: [-8, 8, -8],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// 悬浮 + 轻微旋转
export const floatRotate: Variants = {
  initial: {
    y: 0,
    rotate: 0
  },
  animate: {
    y: [-10, 10, -10],
    rotate: [-2, 2, -2],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// 脉动效果（用于 CTA 按钮背景）
export const pulse: Variants = {
  initial: {
    scale: 1,
    opacity: 0.2
  },
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.2, 0.3, 0.2],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// 按钮脉动圈效果
export const buttonPulse: Variants = {
  initial: {
    boxShadow: "0 0 0 0 rgba(220, 38, 38, 0.4)"
  },
  animate: {
    boxShadow: [
      "0 0 0 0 rgba(220, 38, 38, 0.4)",
      "0 0 0 15px rgba(220, 38, 38, 0)",
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity
    }
  }
};

// 文字发光效果
export const textGlow: Variants = {
  initial: {
    textShadow: "0 0 0px rgba(255,255,255,0)"
  },
  animate: {
    textShadow: [
      "0 0 0px rgba(255,255,255,0)",
      "0 0 20px rgba(255,255,255,0.3)",
      "0 0 0px rgba(255,255,255,0)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity
    }
  }
};

// 手风琴展开
export const accordionContent: Variants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.3 },
      opacity: { duration: 0.2 }
    }
  },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.3 },
      opacity: { duration: 0.2, delay: 0.1 }
    }
  }
};

// 箭头旋转
export const arrowRotate: Variants = {
  collapsed: {
    rotate: 0,
    transition: { duration: 0.3 }
  },
  expanded: {
    rotate: 180,
    transition: { duration: 0.3 }
  }
};

// Hover 效果配置
export const hoverScale = {
  scale: 1.05,
  transition: { type: "spring", stiffness: 400, damping: 17 }
};

export const hoverLift = {
  y: -8,
  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
  transition: { type: "spring", stiffness: 300, damping: 20 }
};

export const tapScale = {
  scale: 0.95
};

// 页面过渡
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3
    }
  }
};
