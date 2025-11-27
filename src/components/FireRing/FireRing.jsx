
import React from "react";
import "./FireRing.css";

export default function FireRing({
    remainingSeconds,
    activeDurationSeconds,
    isRunning,
    isFinished,
    isActive,
    size = 260, // px, outer size of the ring
}){
    const radius = 54; // must match viewBox (0-120)
    const circumference = 2 * Math.PI * radius;

    const safeTotal = activeDurationSeconds > 0 ? activeDurationSeconds : 1;
    const clampedRemaining = Math.max(0, Math.min(remainingSeconds, safeTotal));

    //const progress = (remainingSeconds / safeTotal) * circumference;
    //const dashOffset = circumference - progress;

    const fraction = clampedRemaining / safeTotal;
    const dashOffset = circumference * (1 - fraction);

    // Hide the fireRing when completely idle
    // const showRing = isRunning || isFinished;
    // if (!showRing) return null;
    // DOn't show the ring when not active
    if (!isActive) return null;

    const ringClass = 
    "fire-ring" + 
    (isRunning ? "fire-ring--active" : "") + 
    (isFinished ? "fire-ring--finished" : "");

    return(
        <svg
            className={ringClass}
            viewBox="0 0 120 120"
            aria-hidden="true"
            style={{ width: size, height: size}}
        >
            <defs>
                <linearGradient
                    id="fireGradient"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                >
                    <stop offset="0%" stopColor="#ff4500"/>
                    <stop offset="50%" stopColor="#ff2e5f"/>
                    <stop offset="100%" stopColor="#ffdd00"/>
                </linearGradient>
            </defs>
            <circle
                className="fire-ring__progress"
                cx="60"
                cy="60"
                r={radius}
                stroke="url(#fireGradient)"
                strokeWidth="8"
                fill="none"
                style={{
                    strokeDashArray: circumference,
                    strokeDashoffset: dashOffset,
                }}
            />
        </svg>
    )

}
