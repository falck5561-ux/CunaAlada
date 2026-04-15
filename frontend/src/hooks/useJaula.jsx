import { useState, useRef, useEffect } from 'react';
import { useAnimation } from 'framer-motion';

export const PHYSICS = {
  GRAVEDAD: 0.6,
  FRICCION_AIRE: 0.95,
  FRICCION_SUELO: 0.80,
  REBOTE: -0.4,
  SUELO_Y: 92
};

export const ZONAS = {
  COMEDERO: { x: 14, y: 84 }, 
  BAÑERA: { x: 88, y: 88 }, 
  COLUMPIO: { x: 50, y: 25.5 }, 
  PERCHAS_Y: [35, 55, 75]
};

export const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

// --- HOOK DEL MUNDO (LA JAULA) ---
export const useJaula = () => {
  const [aveSeleccionada, setAveSeleccionada] = useState(null);
  const jaulaRef = useRef(null);
  const [world, setWorld] = useState({ food: 0, ball: null });
  const [isGlobalDragging, setGlobalDragging] = useState(false); 

  useEffect(() => {
      let rafId;
      const physicsLoop = () => {
          setWorld(prev => {
              if (!prev.ball) return prev; 
              let { pos, vel, rot } = prev.ball;
              let vx = vel.x * PHYSICS.FRICCION_AIRE;
              let vy = vel.y + PHYSICS.GRAVEDAD;
              let x = pos.x + vx;
              let y = pos.y + vy;
              let r = rot + (vx * 15);

              if (x < 2 || x > 98) { vx *= -0.6; x = clamp(x, 2, 98); }
              if (y > PHYSICS.SUELO_Y) {
                  y = PHYSICS.SUELO_Y;
                  vy *= PHYSICS.REBOTE; 
                  vx *= PHYSICS.FRICCION_SUELO;
                  if (Math.abs(vy) < 0.2) vy = 0;
                  if (Math.abs(vx) < 0.01) vx = 0;
              }
              return { ...prev, ball: { pos: {x, y}, vel: {x: vx, y: vy}, rot: r } };
          });
          rafId = requestAnimationFrame(physicsLoop);
      };

      if (world.ball) physicsLoop();
      return () => cancelAnimationFrame(rafId);
  }, [world.ball]);

  const spawnBall = () => {
      setWorld(p => ({
          ...p,
          ball: { pos: { x: 50, y: 10 }, vel: { x: (Math.random()-0.5)*2, y: 0 }, rot: 0 }
      }));
      setTimeout(() => { setWorld(p => ({ ...p, ball: null })); }, 6000);
  };

  const updateWorld = (action) => {
      if (action.type === 'EAT') setWorld(p => ({ ...p, food: Math.max(0, p.food - 5) }));
      if (action.type === 'KICK') {
          setWorld(p => p.ball ? {
              ...p,
              ball: { ...p.ball, vel: { x: p.ball.vel.x + action.force.x, y: p.ball.vel.y + action.force.y } }
          } : p);
      }
  };

  const fillFood = () => setWorld(p => ({ ...p, food: 100 }));

  return {
      aveSeleccionada, setAveSeleccionada,
      jaulaRef, world, isGlobalDragging, setGlobalDragging,
      spawnBall, updateWorld, fillFood
  };
};

// --- HOOK DEL CEREBRO (EL AVE) ---
export const usePajarito = (ave, worldState, updateWorld, onSacar, setGlobalDragging) => {
  const controls = useAnimation();
  const [isDragging, setIsDragging] = useState(false);
  
  const worldRef = useRef(worldState);
  useEffect(() => { worldRef.current = worldState; }, [worldState]);

  const [mood, setMood] = useState({ energy: 80, hunger: 20, fun: 50 });
  const [emoji, setEmoji] = useState(null);
  
  const pos = useRef({ x: Math.random() * 80 + 10, y: ZONAS.PERCHAS_Y[1] });
  const facingRight = useRef(Math.random() > 0.5); 
  
  const imgUrl = (ave.mutacion + ave.especie).toLowerCase().match(/azul|turquesa|violeta/) 
                  ? "/pixel-azul.png" : "/pixel-verde.png";
  
  const [isFlying, setIsFlying] = useState(false);
  const currentImg = isFlying
      ? (imgUrl.includes('azul') ? "/azulv.png" : "/verdev.png")
      : imgUrl;

  const irALugar = async (tx, ty, mode) => {
      const safeX = clamp(tx, 5, 95);
      const safeY = clamp(ty, 5, 95);
      facingRight.current = safeX > pos.current.x;
      pos.current = { x: safeX, y: safeY };
      
      let duration = mode === 'fly' ? 2.5 : 1.5; 
      let ease = mode === 'fly' ? "easeInOut" : "linear";

      if (mode === 'fly') setIsFlying(true);
      
      await controls.start({ 
          left: `${safeX}%`, 
          top: `${safeY}%`, 
          x: 0, 
          y: 0, 
          transition: { duration, ease } 
      });
      
      if (mode === 'fly') setIsFlying(false);
  };

  const decidirAccion = async () => {
      const currentWorld = worldRef.current;
      if (isDragging) return;

      if (currentWorld.food > 0 && mood.hunger > 40) {
          await irALugar(ZONAS.COMEDERO.x, ZONAS.COMEDERO.y, 'fly');
          setEmoji('🌾');
          
          const peckAngle = facingRight.current ? 65 : -65;
          const forwardLean = facingRight.current ? 5 : -5;

          for(let i=0; i<4; i++){
              await controls.start({ rotate: peckAngle, y: "22%", x: forwardLean, transition: { duration: 0.5 } }); 
              await new Promise(r => setTimeout(r, 500)); 
              await controls.start({ rotate: 0, y: 0, x: 0, transition: { duration: 0.5 } });
              await new Promise(r => setTimeout(r, 500)); 
          }
          
          updateWorld({ type: 'EAT' }); 
          setMood(m => ({ ...m, hunger: 0 })); 
          setEmoji(null);
          return;
      }

      if (currentWorld.ball && mood.fun < 80) {
          const offsetX = (Math.random() * 10) - 5; 
          const ballX = currentWorld.ball.pos.x;
          await irALugar(ballX + offsetX, PHYSICS.SUELO_Y - 5, 'run');
          
          const kickDir = ballX > pos.current.x ? 1 : -1;
          facingRight.current = kickDir === 1;
          
          setEmoji('😈');
          await new Promise(r => setTimeout(r, 400));
          await controls.start({ x: kickDir * 10, transition: { duration: 0.2, type: "spring" } });
          updateWorld({ type: 'KICK', force: { x: kickDir * (1 + Math.random()), y: -2 } });
          await controls.start({ x: 0, transition: { duration: 0.3 } });
          
          setMood(m => ({ ...m, fun: 100, energy: m.energy - 5 }));
          setEmoji(null);
          return;
      }

      const rnd = Math.random();
      if (rnd < 0.25) {
          await irALugar(ZONAS.COLUMPIO.x, ZONAS.COLUMPIO.y, 'fly');
          setEmoji('🎵');
          await controls.start({ 
              rotate: [0, 3, -3, 0], 
              originY: 1, 
              transition: { duration: 4, ease: "easeInOut", repeat: 1 } 
          });
          setEmoji(null);
      } else if (rnd < 0.5) {
          await irALugar(ZONAS.BAÑERA.x, ZONAS.BAÑERA.y, 'hop');
          setEmoji('🚿');
          for(let i=0; i<3; i++) {
              await controls.start({ y: "15%", rotate: [-10, 10, 0], transition: { duration: 0.5 } });
              await new Promise(r => setTimeout(r, 500));
          }
          setEmoji(null);
      } else {
          const nextY = ZONAS.PERCHAS_Y[Math.floor(Math.random() * ZONAS.PERCHAS_Y.length)];
          await new Promise(r => setTimeout(r, 1000));
          await irALugar(Math.random() * 80 + 10, nextY, 'fly');
      }
  };

  useEffect(() => {
    if (isDragging) return;
    const brainLoop = setInterval(() => {
        setMood(m => ({ 
            hunger: Math.min(100, m.hunger + 3), 
            energy: Math.max(0, m.energy - 1), 
            fun: Math.max(0, m.fun - 2) 
        }));
        decidirAccion();
    }, 2000); 
    return () => clearInterval(brainLoop);
  }, [isDragging]);

  const handleDragStart = () => {
      setIsDragging(true);
      setGlobalDragging(true); 
      controls.stop(); 
      setEmoji('😲'); 
  };

  const handleDragEnd = async (e, i) => {
      setGlobalDragging(false);
      setEmoji(null);
      
      const dist = Math.sqrt(i.offset.x**2 + i.offset.y**2);
      if (dist > 150) {
          setIsDragging(false);
          onSacar(ave);
      } else {
          await irALugar(pos.current.x, pos.current.y, 'fly');
          setIsDragging(false); 
      }
  };

  return {
      controls, mood, emoji, pos, facingRight, currentImg,
      handleDragStart, handleDragEnd
  };
};