"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSelectedDashboard } from "../hooks/SelectedDashboardContext";

const styles = `
  @keyframes pop {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  .animate-pop {
    /* This is a trick: we set the animation to run, but pause it.
      We'll use JavaScript to 'play' it by resetting the animation.
    */
    animation: pop 0.3s ease-out;
    animation-play-state: running; 
  }
`;

export default function Counter() {
    const [count, setCount] = useState(0);
    const [isPopping, setIsPopping] = useState(false);
    const [maxValue, setMaxValue] = useState(0);
    const [cycleCount, setCycleCount] = useState(0);
    const maxInputRef = useRef<HTMLInputElement>(null);

    const { selectDashboard } = useSelectedDashboard();
    selectDashboard("Counter");

    const handleClick = useCallback(() => {
        // 1. Increment the count
        const inputVal = maxInputRef.current?.value;
        const parsed = parseInt(inputVal || "", 10);
        const effectiveMax = !isNaN(parsed) && parsed > 0 ? parsed : 1;
    
        if (count + 1 >= effectiveMax) {
            setCount(0);
            setCycleCount((prevCount) => prevCount + 1);
            if (typeof window !== "undefined" && "vibrate" in navigator) {
                navigator.vibrate(200); // vibrate for 200ms
            }
        } else {
            setCount(prevCount => prevCount + 1);
        }
        // 2. Trigger the animation
        setIsPopping(true);
    }, [count]);

    const handleKeyPress = useCallback((event: { key: string; }) => {
        // Check for the desired key or key combination (e.g., 'Enter' key)
        if (event.key === 'Enter') {
            handleClick();
        }
        // For combinations, you might check event.ctrlKey, event.altKey, event.shiftKey
        // Example for Ctrl+S: if (event.ctrlKey && event.key === 's') { handleSave(); }
    }, [handleClick]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    const handleAnimationEnd = () => {
        // 3. Reset the animation state so it can play again next time
        setIsPopping(false);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        if (value === "") {
            setMaxValue(NaN);
            return;
        }

        // Remove leading zeros
        value = value.replace(/^0+/, "");

        const parsed = parseInt(value, 10);
        if (!isNaN(parsed) && parsed > 0 && parsed <= 9999) {
            setMaxValue(parsed);
            setCycleCount(0);
        }
    };

    return (
        <>
            {/* Inject the keyframes animation styles into the page */}
            <style>{styles}</style>
            <div className="h-[calc(100vh-4rem)] pt-1 w-full flex flex-col items-center justify-center font-sans select-none overflow-hidden">
                <div className="flex flex-col items-center">
                    <button
                        className={`w-64 h-64 bg-blue-600 rounded-full text-white text-8xl font-black shadow-2xl cursor-pointer transition-all duration-150 ease-out
                        active:scale-95 active:shadow-lg
                        ${isPopping ? 'animate-pop' : ''}`}
                        onClick={handleClick}
                        onAnimationEnd={handleAnimationEnd}
                        accessKey="enter"
                        aria-keyshortcuts="Enter"
                    >
                        {count}
                    </button>

                    {/* Secondary Counter */}
                    <div className="absolute bottom-4 text-sm opacity-80">
                        <p className="flex flex-row items-center justify-center mb-2">Cycles Completed: {cycleCount}</p>

                        {/* Max Value Input */}
                        <div className="flex flex-row items-center">
                            <label className="">Set Max Value</label>
                            <input
                                ref={maxInputRef}
                                title="Max"
                                type="number"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                value={isNaN(maxValue) ? "" : maxValue}
                                min={1}
                                placeholder="Max"
                                onChange={handleMaxChange}
                                onBlur={() => {
                                    // When user leaves the field, reset to 1 if empty
                                    if (isNaN(maxValue) || maxValue <= 0) setMaxValue(1);
                                }}
                                className="ml-2 w-24 text-center px-2 py-1 rounded-md outline-1 focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}