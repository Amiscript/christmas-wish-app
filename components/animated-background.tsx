// components/animated-background.tsx
import { useEffect, useRef } from 'react';

interface AnimatedBackgroundProps {
  darkMode?: boolean;
}

export function AnimatedBackground({ darkMode = false }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  class Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;
    opacity: number;
    wiggle: number;
    wiggleSpeed: number;
    wiggleOffset: number;
    shape: 'circle' | 'star' | 'triangle';
    
    constructor(width: number, height: number, darkMode: boolean) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * (darkMode ? 5 : 3) + 1;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.opacity = Math.random() * 0.6 + 0.2;
      this.wiggle = Math.random() * 2;
      this.wiggleSpeed = Math.random() * 0.02 + 0.01;
      this.wiggleOffset = Math.random() * Math.PI * 2;
      
      const shapes: ('circle' | 'star' | 'triangle')[] = ['circle', 'star', 'triangle'];
      this.shape = shapes[Math.floor(Math.random() * shapes.length)];
      
      // Christmas-themed colors
      const colors = darkMode 
        ? [
            'rgba(255, 50, 50, 0.6)',    // Red
            'rgba(50, 255, 50, 0.6)',    // Green
            'rgba(255, 255, 255, 0.5)',  // White
            'rgba(255, 255, 100, 0.6)',  // Gold
            'rgba(100, 200, 255, 0.6)',  // Blue
          ]
        : [
            'rgba(255, 100, 100, 0.4)',  // Light red
            'rgba(100, 255, 100, 0.4)',  // Light green
            'rgba(255, 255, 255, 0.3)',  // White
            'rgba(255, 255, 150, 0.4)',  // Light gold
            'rgba(150, 200, 255, 0.4)',  // Light blue
          ];
      
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    
    update(width: number, height: number) {
      this.x += this.speedX + Math.sin(Date.now() * this.wiggleSpeed + this.wiggleOffset) * this.wiggle * 0.1;
      this.y += this.speedY + Math.cos(Date.now() * this.wiggleSpeed + this.wiggleOffset) * this.wiggle * 0.1;
      
      // Bounce off edges
      if (this.x > width) {
        this.x = 0;
      } else if (this.x < 0) {
        this.x = width;
      }
      
      if (this.y > height) {
        this.y = 0;
      } else if (this.y < 0) {
        this.y = height;
      }
    }
    
    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 15;
      ctx.shadowColor = this.color;
      
      switch (this.shape) {
        case 'circle':
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fill();
          break;
          
        case 'star':
          this.drawStar(ctx, this.x, this.y, this.size * 0.8, this.size * 1.5, 5);
          ctx.fill();
          break;
          
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(this.x, this.y - this.size);
          ctx.lineTo(this.x - this.size, this.y + this.size);
          ctx.lineTo(this.x + this.size, this.y + this.size);
          ctx.closePath();
          ctx.fill();
          break;
      }
      
      ctx.restore();
    }
    
    drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius1: number, radius2: number, numPoints: number) {
      ctx.beginPath();
      for (let i = 0; i < numPoints * 2; i++) {
        const angle = (i * Math.PI) / numPoints;
        const radius = i % 2 === 0 ? radius2 : radius1;
        const x = cx + Math.cos(angle) * radius;
        const y = cy + Math.sin(angle) * radius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    particlesRef.current = [];
    const particleCount = darkMode ? 80 : 50; // More particles in dark mode
    
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(new Particle(canvas.width, canvas.height, darkMode));
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      if (darkMode) {
        gradient.addColorStop(0, 'rgba(15, 23, 42, 0.1)'); // Dark blue
        gradient.addColorStop(0.5, 'rgba(30, 41, 59, 0.1)'); // Dark slate
        gradient.addColorStop(1, 'rgba(15, 23, 42, 0.1)');
      } else {
        gradient.addColorStop(0, 'rgba(219, 234, 254, 0.3)'); // Light blue
        gradient.addColorStop(0.5, 'rgba(254, 226, 226, 0.3)'); // Light red
        gradient.addColorStop(1, 'rgba(220, 252, 231, 0.3)'); // Light green
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw connections between particles
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x;
          const dy = particlesRef.current[i].y - particlesRef.current[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = darkMode 
              ? `rgba(255, 255, 255, ${0.1 * (1 - distance/100)})`
              : `rgba(100, 100, 100, ${0.05 * (1 - distance/100)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y);
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y);
            ctx.stroke();
          }
        }
      }
      
      // Update and draw particles
      particlesRef.current.forEach(particle => {
        particle.update(canvas.width, canvas.height);
        particle.draw(ctx);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [darkMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        opacity: darkMode ? 0.3 : 0.2,
        transition: 'opacity 0.5s ease-in-out'
      }}
    />
  );
}