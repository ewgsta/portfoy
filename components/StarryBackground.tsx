import React, { useEffect, useRef } from 'react';

const StarryBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    // Star properties
    const stars: { x: number; y: number; radius: number; alpha: number; twinkleSpeed: number }[] = [];
    const numStars = 600;

    // Meteors
    let meteors: { 
        x: number; 
        y: number; 
        length: number; 
        speed: number; 
        angle: number; 
        color: string; 
        width: number 
    }[] = [];

    const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.9,
          radius: Math.random() * 1.2,
          alpha: Math.random() * 0.8 + 0.2,
          twinkleSpeed: Math.random() * 0.02
        });
      }
    };

    const createMeteor = () => {
        const startX = Math.random() * width;
        const startY = Math.random() * (height / 3); 
        const angle = Math.PI / 4 + 0.1; 
        
        // Blue variations: Cyan, Sky Blue, or White-Blue
        const rand = Math.random();
        let color;
        if (rand > 0.6) color = 'rgba(56, 189, 248, '; // Sky Blue
        else if (rand > 0.3) color = 'rgba(34, 211, 238, '; // Cyan
        else color = 'rgba(186, 230, 253, '; // Light Blue
        
        meteors.push({
            x: startX,
            y: startY,
            length: 150 + Math.random() * 100,
            speed: 10 + Math.random() * 5,
            angle: angle,
            color: color,
            width: 1.5
        });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Deep Blue Space Gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#020617'); // Slate 950
      gradient.addColorStop(0.6, '#0f172a'); // Slate 900
      gradient.addColorStop(1, '#172554'); // Blue 950 at bottom
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 2. Stars
      stars.forEach((star) => {
        ctx.fillStyle = `rgba(224, 242, 254, ${star.alpha})`; // Very light blue tint
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        
        if (Math.random() > 0.95) {
            star.alpha += (Math.random() * 0.2 - 0.1);
            if (star.alpha < 0.1) star.alpha = 0.1;
            if (star.alpha > 1) star.alpha = 1;
        }
      });

      // 3. Meteors
      meteors.forEach((meteor, index) => {
          const tailX = meteor.x - Math.cos(meteor.angle) * meteor.length;
          const tailY = meteor.y - Math.sin(meteor.angle) * meteor.length;

          const meteorGradient = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
          meteorGradient.addColorStop(0, meteor.color + '1)'); 
          meteorGradient.addColorStop(0.4, meteor.color + '0.4)'); 
          meteorGradient.addColorStop(1, meteor.color + '0)');

          ctx.strokeStyle = meteorGradient;
          ctx.lineWidth = meteor.width;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(meteor.x, meteor.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();

          meteor.x += Math.cos(meteor.angle) * meteor.speed;
          meteor.y += Math.sin(meteor.angle) * meteor.speed;

          if (meteor.x > width + 200 || meteor.y > height + 200) {
              meteors.splice(index, 1);
          }
      });

      if (Math.random() < 0.02) {
          createMeteor();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    initStars();
    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initStars();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
        <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-20 pointer-events-none" />
        {/* Subtle Blue Glow at bottom */}
        <div className="fixed bottom-0 left-0 w-full h-64 bg-gradient-to-t from-blue-900/30 to-transparent -z-10 pointer-events-none" />
    </>
  );
};

export default StarryBackground;