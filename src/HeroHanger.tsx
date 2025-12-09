'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import Matter from 'matter-js';
import { motion, AnimatePresence } from 'framer-motion';

interface Firefly {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const Firefly: React.FC<{ firefly: Firefly }> = ({ firefly }) => {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${firefly.x}%`,
        top: `${firefly.y}%`,
        width: firefly.size,
        height: firefly.size,
        background: 'radial-gradient(circle, rgba(251,191,36,1) 0%, rgba(251,191,36,0.6) 40%, transparent 70%)',
        boxShadow: '0 0 10px rgba(251,191,36,0.8), 0 0 20px rgba(251,191,36,0.4)',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 1, 0.8, 1, 0],
        scale: [0, 1, 1.2, 1, 0],
        x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
        y: [0, Math.random() * 100 - 50, Math.random() * 100 - 50, 0],
      }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{
        duration: firefly.duration,
        delay: firefly.delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

const LampDarkModeToggle: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const pullCordRef = useRef<Matter.Body | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [pullCount, setPullCount] = useState(0);
  const lastPullTimeRef = useRef(0);

  // Generate fireflies with random properties
  const fireflies = useMemo<Firefly[]>(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 3, // 3-7px
      duration: Math.random() * 8 + 6, // 6-14 seconds
      delay: Math.random() * 3, // 0-3 seconds delay
    }));
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    const engine = Matter.Engine.create();
    engineRef.current = engine;
    const world = engine.world;
    world.gravity.y = 0.8;

    const render = Matter.Render.create({
      element: sceneRef.current,
      engine,
      options: {
        width: sceneRef.current.clientWidth,
        height: sceneRef.current.clientHeight,
        wireframes: false,
        background: 'transparent',
      },
    });
    renderRef.current = render;

    const pixelRatio = window.devicePixelRatio || 1;
    render.canvas.width = render.options.width! * pixelRatio;
    render.canvas.height = render.options.height! * pixelRatio;
    render.context.scale(pixelRatio, pixelRatio);

    // Ceiling (static)
    const ceiling = Matter.Bodies.rectangle(
      render.options.width! / 2,
      -50,
      render.options.width!,
      100,
      { isStatic: true, render: { visible: false } }
    );

    // Build rope segments
    const segmentCount = 5;
    const segmentLength = 10;
    const ropeSegments: Matter.Body[] = [];

    for (let i = 0; i < segmentCount; i++) {
      const segment = Matter.Bodies.circle(
        render.options.width! / 2,
        30 + i * segmentLength,
        3,
        {
          collisionFilter: { group: -1 },
          render: {
            fillStyle: isDark ? '#fcd34d' : '#4b4933',
          },
        }
      );
      ropeSegments.push(segment);
    }

    // Connect rope segments
    const ropeConstraints: Matter.Constraint[] = ropeSegments.map((seg, i) => {
      if (i === 0) {
        // Attach to ceiling
        return Matter.Constraint.create({
          pointA: { x: render.options.width! / 2, y: 10 },
          bodyB: seg,
          stiffness: 0.9,
          length: 0,
        });
      } else {
        // Connect each segment to the previous one
        return Matter.Constraint.create({
          bodyA: ropeSegments[i - 1],
          bodyB: seg,
          stiffness: 0.9,
          length: segmentLength,
        });
      }
    });

    // Pull handle at end of rope
    const pullCord = Matter.Bodies.circle(
      render.options.width! / 2,
      30 + segmentCount * segmentLength + 20,
      10,
      {
        render: {
          fillStyle: isDark ? '#fbbf24' : '#64748b',
          strokeStyle: isDark ? '#f59e0b' : '#475569',
          lineWidth: 3,
        },
        label: 'pullCord',
        restitution: 0.3,
      }
    );
    pullCordRef.current = pullCord;

    // Attach last segment to handle
    const handleConstraint = Matter.Constraint.create({
      bodyA: ropeSegments[ropeSegments.length - 1],
      bodyB: pullCord,
      length: 8,
      stiffness: 0.9,
    });

    // Add everything
    Matter.World.add(world, [
      ceiling,
      ...ropeSegments,
      ...ropeConstraints,
      pullCord,
      handleConstraint,
    ]);

    // Mouse control
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.05, render: { visible: false } },
    });
    Matter.World.add(world, mouseConstraint);
    render.mouse = mouse;

    // Detect pull toggle
    Matter.Events.on(mouseConstraint, 'enddrag', (event: any) => {
      if (event.body === pullCord) {
        const currentTime = Date.now();
        const velocity = Matter.Body.getVelocity(pullCord);
        const speed = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
        if (speed > 2 && currentTime - lastPullTimeRef.current > 500) {
          setIsDark((prev) => !prev);
          setPullCount((c) => c + 1);
          lastPullTimeRef.current = currentTime;
        }
      }
    });

    // Custom rope rendering
    Matter.Events.on(render, 'afterRender', () => {
      const ctx = render.context;
      ctx.beginPath();
      ctx.strokeStyle = isDark ? '#fcd34d' : '#4b4933';
      ctx.lineWidth = 3;
      for (let i = 0; i < ropeSegments.length - 1; i++) {
        const p1 = ropeSegments[i].position;
        const p2 = ropeSegments[i + 1].position;
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
      }
      const last = ropeSegments[ropeSegments.length - 1].position;
      const cord = pullCord.position;
      ctx.lineTo(last.x, last.y);
      ctx.lineTo(cord.x, cord.y);
      ctx.stroke();
    });

    // Run engine
    const runner = Matter.Runner.create();
    Matter.Runner.run(runner, engine);
    Matter.Render.run(render);

    // Handle resize
    const handleResize = () => {
      if (!render.canvas || !sceneRef.current) return;
      const width = sceneRef.current.clientWidth;
      const height = sceneRef.current.clientHeight;
      render.canvas.width = width * pixelRatio;
      render.canvas.height = height * pixelRatio;
      render.context.scale(pixelRatio, pixelRatio);
      render.options.width = width;
      render.options.height = height;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, [isDark]);

  useEffect(() => {
    if (pullCordRef.current) {
      pullCordRef.current.render.fillStyle = isDark ? '#fbbf24' : '#64748b';
      pullCordRef.current.render.strokeStyle = isDark ? '#f59e0b' : '#475569';
    }
  }, [isDark]);

  return (
    <div
      className={`min-h-screen transition-colors duration-700 relative overflow-hidden ${
        isDark ? 'bg-gray-900' : 'bg-sky-50'
      }`}
    >
      {/* Fireflies */}
      <AnimatePresence>
        {isDark && (
          <div className="absolute inset-0 pointer-events-none">
            {fireflies.map((firefly) => (
              <Firefly key={firefly.id} firefly={firefly} />
            ))}
          </div>
        )}
      </AnimatePresence>
      <div className="container mx-auto px-6 py-12 grid md:grid-cols-2 gap-12 items-center min-h-screen">
        {/* LEFT SIDE - Lamp Section */}
        <motion.div
          className="relative flex flex-col items-center justify-center"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Lamp with Rope */}
          <div className="relative">
            {/* Real Lamp Image */}
            <motion.img
              src="./lamp.png"
              alt="Lamp"
              className="w-64 h-auto mx-auto drop-shadow-xl"
              animate={{
                filter: isDark
                  ? 'brightness(1.5) drop-shadow(0 0 80px rgba(251,191,36,0.8))'
                  : 'brightness(0.8)',
              }}
              transition={{ duration: 0.6 }}
            />

            {/* Light Glow */}
            <AnimatePresence>
              {isDark && (
                <motion.div
                  className="absolute top-full left-1/2 -translate-x-1/2 w-64 h-64 bg-yellow-300 rounded-full blur-3xl opacity-40"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 0.3, scale: 1.2 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </AnimatePresence>

            {/* Rope Simulation */}
            <div
              ref={sceneRef}
              className="absolute top-[40%] left-[60%] -translate-x-1/2 w-48 h-72 pointer-events-auto cursor-grab active:cursor-grabbing"
            />
          </div>

          {/* Instructions */}
          <motion.div
            className={`mt-8 text-center ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm font-medium flex items-center justify-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Pull the cord to toggle
            </p>
            <p className="text-xs mt-2 opacity-70">Pulls: {pullCount}</p>
          </motion.div>
        </motion.div>

        {/* RIGHT SIDE - Info Text */}
        <motion.div
          className={`space-y-6 ${isDark ? 'text-white' : 'text-gray-800'}`}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            className="text-5xl md:text-6xl font-bold"
            animate={{ color: isDark ? '#fbbf24' : '#1e293b' }}
            transition={{ duration: 0.5 }}
          >
            Pull to Illuminate
          </motion.h1>

          <p
            className={`text-lg md:text-xl ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            Experience dark mode like never before — with a real rope-style pull cord that moves and stretches naturally!
          </p>

          <div className="space-y-4">
            <div
              className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}
            >
              <h3 className="font-semibold text-xl mb-2 flex items-center gap-2">
                <span className="text-2xl">🪢</span>
                Stretchable Rope
              </h3>
              <p
                className={isDark ? 'text-gray-400' : 'text-gray-600'}
              >
                The cord now flexes and bends realistically — built from chained physics bodies for smooth, natural motion.
              </p>
            </div>

            <div
              className={`p-4 rounded-lg ${
                isDark ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}
            >
              <h3 className="font-semibold text-xl mb-2 flex items-center gap-2">
                <span className="text-2xl">✨</span>
                Realistic Feel
              </h3>
              <p
                className={isDark ? 'text-gray-400' : 'text-gray-600'}
              >
                Powered by Matter.js — pull, release, and watch the rope sway and stretch with physics-driven realism.
              </p>
            </div>
          </div>

          <motion.div
            className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${
              isDark
                ? 'bg-yellow-500/20 text-yellow-300'
                : 'bg-gray-200 text-gray-700'
            }`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5 }}
            key={isDark ? 'dark' : 'light'}
          >
            <span className="text-2xl">{isDark ? '💡' : '🌙'}</span>
            <span className="font-semibold">
              {isDark ? 'Light Mode Active' : 'Dark Mode Ready'}
            </span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LampDarkModeToggle;
