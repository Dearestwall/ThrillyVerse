// src/components/animations/AnimatedSection.tsx
'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { fadeIn, slideUp } from '@/lib/animations/variants';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fadeIn' | 'slideUp';
  delay?: number;
}

export function AnimatedSection({ 
  children, 
  className = '',
  animation = 'fadeIn',
  delay = 0 
}: AnimatedSectionProps) {
  const variants = animation === 'fadeIn' ? fadeIn : slideUp;

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={variants as unknown as import('framer-motion').Variants}
      
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Card with Hover Animation
export function AnimatedCard({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string 
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -8 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Button with Animation
export function AnimatedButton({ 
  children, 
  className = '',
  onClick,
}: { 
  children: ReactNode; 
  className?: string;
  onClick?: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}