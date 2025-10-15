import React, { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const AnimatedScore = ({ score }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, latest => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, score, {
      duration: 1.5,
      ease: "easeOut",
      delay: 0.2
    });
    return controls.stop;
  }, [score]);

  return <motion.div className="overall-score__value">{rounded}</motion.div>;
};

export default AnimatedScore;