"use client";

import { useRef, useEffect, useCallback } from "react";

/** Light-theme canvas: neutral strokes + accent teal for activity */
const FG = "10, 10, 10";
const ACCENT = "0, 168, 136";

interface AudioVisualizerProps {
  isActive: boolean;
  isSpeaking: boolean;
  getInputFrequency?: () => Uint8Array | undefined;
  getOutputFrequency?: () => Uint8Array | undefined;
}

export function AudioVisualizer({
  isActive,
  isSpeaking,
  getInputFrequency,
  getOutputFrequency,
}: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const phaseRef = useRef(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const displayWidth = canvas.clientWidth;
    const displayHeight = canvas.clientHeight;

    if (
      canvas.width !== displayWidth * dpr ||
      canvas.height !== displayHeight * dpr
    ) {
      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, displayWidth, displayHeight);

    const centerX = displayWidth / 2;
    const centerY = displayHeight / 2;
    const baseRadius = Math.min(centerX, centerY) * 0.45;

    let frequencyData: Uint8Array | undefined;
    if (isActive) {
      frequencyData = isSpeaking
        ? getOutputFrequency?.()
        : getInputFrequency?.();
    }

    let avgAmplitude = 0;
    if (frequencyData && frequencyData.length > 0) {
      avgAmplitude =
        frequencyData.reduce((sum, val) => sum + Math.abs(val), 0) /
        frequencyData.length /
        255;
    }

    phaseRef.current += 0.015;
    const phase = phaseRef.current;

    ctx.beginPath();
    ctx.arc(centerX, centerY, baseRadius, 0, Math.PI * 2);
    ctx.strokeStyle = isActive
      ? `rgba(${ACCENT}, ${0.12 + avgAmplitude * 0.35})`
      : `rgba(${FG}, 0.08)`;
    ctx.lineWidth = 1;
    ctx.stroke();

    if (!isActive) {
      const breathe = Math.sin(phase) * 0.03 + 1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * breathe, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${FG}, 0.06)`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 0.6, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${FG}, 0.05)`;
      ctx.lineWidth = 0.5;
      ctx.stroke();

      animationRef.current = requestAnimationFrame(draw);
      return;
    }

    const rings = [
      { radiusMult: 0.6, opacity: 0.08, ampMult: 0.3 },
      { radiusMult: 0.8, opacity: 0.1, ampMult: 0.5 },
      { radiusMult: 1.0, opacity: 0.14, ampMult: 0.8 },
      { radiusMult: 1.2, opacity: 0.08, ampMult: 1.0 },
    ];

    for (const ring of rings) {
      const radius =
        baseRadius * ring.radiusMult + avgAmplitude * 30 * ring.ampMult;
      const opacity = ring.opacity + avgAmplitude * 0.25;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${ACCENT}, ${Math.min(opacity, 0.45)})`;
      ctx.lineWidth = 1 + avgAmplitude * 2;
      ctx.stroke();
    }

    const numBars = 64;
    const barData = frequencyData || new Float32Array(numBars);
    const step = Math.max(1, Math.floor(barData.length / numBars));

    for (let i = 0; i < numBars; i++) {
      const dataIndex = i * step;
      const value =
        dataIndex < barData.length ? Math.abs(barData[dataIndex]) / 255 : 0;

      const angle = (i / numBars) * Math.PI * 2 - Math.PI / 2;
      const innerRadius = baseRadius * 1.05;
      const barLength = value * baseRadius * 0.5 + 2;

      const x1 = centerX + Math.cos(angle) * innerRadius;
      const y1 = centerY + Math.sin(angle) * innerRadius;
      const x2 = centerX + Math.cos(angle) * (innerRadius + barLength);
      const y2 = centerY + Math.sin(angle) * (innerRadius + barLength);

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(${ACCENT}, ${0.15 + value * 0.55})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    if (isSpeaking && avgAmplitude > 0.05) {
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        baseRadius * 0.4,
      );
      gradient.addColorStop(
        0,
        `rgba(${ACCENT}, ${avgAmplitude * 0.18})`,
      );
      gradient.addColorStop(1, `rgba(${ACCENT}, 0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, displayWidth, displayHeight);
    }

    animationRef.current = requestAnimationFrame(draw);
  }, [isActive, isSpeaking, getInputFrequency, getOutputFrequency]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationRef.current);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="h-[250px] w-[250px] md:h-[300px] md:w-[300px]"
    />
  );
}
