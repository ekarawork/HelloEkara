"use client";

import { motion } from "framer-motion";

export default function LoginBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Base Background */}
      <div className="absolute inset-0 bg-slate-50" />

      {/* Soft Blue Ambient Light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,rgba(30,64,175,0.08),transparent_42%),radial-gradient(circle_at_100%_100%,rgba(30,64,175,0.08),transparent_42%)]" />

      {/* Left Top Dark Blue Glow */}
      <motion.div
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.58, 0.72, 0.58],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-[280px] -left-[280px] h-[600px] w-[600px] rounded-full bg-blue-900/30 blur-[120px] sm:-top-[300px] sm:-left-[300px] sm:h-[680px] sm:w-[680px] lg:-top-[340px] lg:-left-[340px] lg:h-[760px] lg:w-[760px] lg:bg-blue-950/35"
      />

      {/* Left Top Inner Soft Blue Light */}
      <motion.div
        animate={{
          opacity: [0.25, 0.38, 0.25],
          scale: [1, 1.04, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute -top-[160px] -left-[160px] h-[380px] w-[380px] rounded-full bg-blue-700/20 blur-[90px] sm:h-[440px] sm:w-[440px] lg:h-[500px] lg:w-[500px]"
      />

      {/* Right Bottom Dark Blue Glow */}
      <motion.div
        animate={{
          scale: [1, 1.06, 1],
          opacity: [0.58, 0.72, 0.58],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute -bottom-[280px] -right-[280px] h-[600px] w-[600px] rounded-full bg-blue-900/30 blur-[120px] sm:-bottom-[300px] sm:-right-[300px] sm:h-[680px] sm:w-[680px] lg:-bottom-[340px] lg:-right-[340px] lg:h-[760px] lg:w-[760px] lg:bg-blue-950/35"
      />

      {/* Right Bottom Inner Soft Blue Light */}
      <motion.div
        animate={{
          opacity: [0.25, 0.38, 0.25],
          scale: [1, 1.04, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute -bottom-[160px] -right-[160px] h-[380px] w-[380px] rounded-full bg-blue-700/20 blur-[90px] sm:h-[440px] sm:w-[440px] lg:h-[500px] lg:w-[500px]"
      />

      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage: `
            linear-gradient(
              rgba(71,85,105,0.10) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(71,85,105,0.10) 1px,
              transparent 1px
            )
          `,
          backgroundSize: "48px 48px",
          maskImage:
            "linear-gradient(to bottom, transparent 10%, black 25%, black 75%, transparent 90%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 10%, black 25%, black 75%, transparent 90%)",
        }}
      />
    </div>
  );
}