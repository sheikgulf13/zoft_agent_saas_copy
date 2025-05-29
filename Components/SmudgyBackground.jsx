'use client';
import { useEffect, useRef, useCallback } from 'react';

function hexToRGB(hex) {
  const res = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return res
    ? {
        r: parseInt(res[1], 16),
        g: parseInt(res[2], 16),
        b: parseInt(res[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function RGBToHex(r, g, b) {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

function generateColorVariations(baseColor) {
  const { r, g, b } = baseColor;
  
  // Generate darker variations for depth
  const darker1 = {
    r: Math.max(0, r - 60),
    g: Math.max(0, g - 60),
    b: Math.max(0, b - 60)
  };

  const darker2 = {
    r: Math.max(0, r - 40),
    g: Math.max(0, g - 40),
    b: Math.max(0, b - 40)
  };

  const darker3 = {
    r: Math.max(0, r - 20),
    g: Math.max(0, g - 20),
    b: Math.max(0, b - 20)
  };

  // Generate lighter variations for highlights
  const lighter1 = {
    r: Math.min(255, r + 30),
    g: Math.min(255, g + 30),
    b: Math.min(255, b + 30)
  };

  const lighter2 = {
    r: Math.min(255, r + 15),
    g: Math.min(255, g + 15),
    b: Math.min(255, b + 15)
  };

  return [baseColor, darker1, darker2, darker3, lighter1, lighter2];
}

function createSmudgyBlob(ctx, x, y, size) {
  const numPoints = 20 + Math.floor(Math.random() * 10);
  const points = [];
  
  // Create a more organic, fluid path
  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * Math.PI * 2;
    const radius = size * (0.7 + Math.random() * 0.6);
    const jitter = size * 0.2;
    
    points.push({
      x: x + Math.cos(angle) * radius + (Math.random() - 0.5) * jitter,
      y: y + Math.sin(angle) * radius + (Math.random() - 0.5) * jitter
    });
  }

  // Create a smooth, fluid path
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length];
    const prev = points[(i - 1 + points.length) % points.length];
    
    // Calculate control points for smooth curves
    const cp1x = current.x + (next.x - prev.x) * 0.25;
    const cp1y = current.y + (next.y - prev.y) * 0.25;
    const cp2x = next.x - (next.x - current.x) * 0.25;
    const cp2y = next.y - (next.y - current.y) * 0.25;
    
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, next.x, next.y);
  }

  ctx.closePath();
}

function createFogLayer(ctx, width, height, opacity = 0.3) {
  // Create multiple fog layers with different opacities and positions
  const fogLayers = 3;
  
  for (let i = 0; i < fogLayers; i++) {
    const gradient = ctx.createRadialGradient(
      width * (0.3 + Math.random() * 0.4),
      height * (0.3 + Math.random() * 0.4),
      0,
      width * (0.3 + Math.random() * 0.4),
      height * (0.3 + Math.random() * 0.4),
      Math.max(width, height) * (0.4 + Math.random() * 0.3)
    );

    // Add white with varying opacity for fog effect
    gradient.addColorStop(0, `rgba(255, 255, 255, ${opacity * (0.3 + i * 0.2)})`);
    gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity * 0.1})`);
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(
      width * (0.3 + Math.random() * 0.4),
      height * (0.3 + Math.random() * 0.4),
      Math.max(width, height) * (0.4 + Math.random() * 0.3),
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}

export default function SmudgyBackground({
  colorHex = '#ff0080',
  className = '',
  noiseDensity = 40,
  layerCount = 8,
  baseOpacity = 0.2,
  opacityStep = 0.03,
  fogOpacity = 0.3,
  zIndex = 0,
}) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const randomPositionsRef = useRef([]);

  const generateRandomPositions = useCallback((width, height) => {
    const positions = [];
    for (let i = 0; i < layerCount + 4; i++) {
      positions.push({
        x: width * Math.random(),
        y: height * Math.random(),
        size: Math.max(width, height) * (0.2 + Math.random() * 0.4),
        type: Math.random() > 0.5 ? 'radial' : 'linear',
        angle: Math.random() * Math.PI * 2
      });
    }
    return positions;
  }, [layerCount]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    if (width === 0 || height === 0) {
      animationFrameRef.current = requestAnimationFrame(draw);
      return;
    }

    canvas.width = width;
    canvas.height = height;

    // Enable blur for more smudgy effect
    ctx.filter = 'blur(8px)';
    
    randomPositionsRef.current = generateRandomPositions(width, height);

    ctx.clearRect(0, 0, width, height);
    const baseColor = hexToRGB(colorHex);
    const colorVariations = generateColorVariations(baseColor);

    const createDepthGradient = (color, alpha, position) => {
      let gradient;
      
      if (position.type === 'radial') {
        gradient = ctx.createRadialGradient(
          position.x, position.y, position.size * 0.1,
          position.x, position.y, position.size
        );
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.5})`);
        gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);
      } else {
        const startX = position.x - Math.cos(position.angle) * position.size;
        const startY = position.y - Math.sin(position.angle) * position.size;
        const endX = position.x + Math.cos(position.angle) * position.size;
        const endY = position.y + Math.sin(position.angle) * position.size;
        
        gradient = ctx.createLinearGradient(startX, startY, endX, endY);
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha * 0.5})`);
        gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);
      }
      
      ctx.fillStyle = gradient;
      createSmudgyBlob(ctx, position.x, position.y, position.size);
      ctx.fill();
    };

    const addNoise = (density) => {
      try {
        const imageData = ctx.getImageData(0, 0, width, height);
        const buffer = imageData.data;
        for (let i = 0; i < buffer.length; i += 4) {
          const noise = Math.random() * density;
          buffer[i] = Math.min(255, buffer[i] + noise);
          buffer[i + 1] = Math.min(255, buffer[i + 1] + noise);
          buffer[i + 2] = Math.min(255, buffer[i + 2] + noise);
        }
        ctx.putImageData(imageData, 0, 0);
      } catch (err) {
        console.warn('Skipping noise due to canvas issue:', err);
      }
    };

    // Create main depth layers
    for (let i = 0; i < layerCount; i++) {
      const colorIndex = i % colorVariations.length;
      const color = colorVariations[colorIndex];
      const position = randomPositionsRef.current[i];
      
      createDepthGradient(
        color,
        baseOpacity + i * opacityStep,
        position
      );
    }

    // Add smaller accent layers
    for (let i = 0; i < 4; i++) {
      const colorIndex = Math.floor(Math.random() * colorVariations.length);
      const color = colorVariations[colorIndex];
      const position = randomPositionsRef.current[layerCount + i];
      
      createDepthGradient(
        color,
        baseOpacity * 0.7,
        position
      );
    }

    // Reset filter before adding fog and noise
    ctx.filter = 'none';

    // Add foggy effect
    createFogLayer(ctx, width, height, fogOpacity);

    // Add noise for texture
    addNoise(noiseDensity);
  }, [colorHex, noiseDensity, layerCount, baseOpacity, opacityStep, fogOpacity, generateRandomPositions]);

  useEffect(() => {
    draw();
    window.addEventListener('resize', draw);
    
    return () => {
      window.removeEventListener('resize', draw);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ zIndex }}
    />
  );
}
