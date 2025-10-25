"use client";

import { useState } from "react";

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
    const [maxValue, setMaxValue] = useState<number>(5);
    const [cycleCount, setCycleCount] = useState(0);

    const handleClick = () => {
        // 1. Increment the count
        if (count + 1 >= maxValue) {
            setCount(0);
            setCycleCount((prevCount) => prevCount + 1);
        } else {
            setCount(prevCount => prevCount + 1);
        }
        // 2. Trigger the animation
        setIsPopping(true);
    };

    const handleAnimationEnd = () => {
        // 3. Reset the animation state so it can play again next time
        setIsPopping(false);
    };

    const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value > 0) setMaxValue(value);
    };

    return (
        <>
            {/* Inject the keyframes animation styles into the page */}
            <style>{styles}</style>

            {/* Main container:
          - h-screen: Full height
          - bg-slate-900: Dark background
          - flex, items-center, justify-center: Center the content
          - text-white: White text
          - font-sans: Clean font
          - select-none: Prevent text selection on rapid clicks
        */}
            <div className="h-screen w-full flex items-center justify-center  font-sans select-none overflow-hidden">
                <div className="flex flex-col items-center">
                    <h1 className="text-center text-4xl font-bold text-slate-900 mb-8">
                        Counter
                    </h1>

                    {/* The Counter Button:
              - w-64 h-64: Large square shape
              - bg-blue-600: Blue color
              - rounded-full: Make it a circle
              - flex, items-center, justify-center: Center the number
              - text-8xl font-black: Huge, bold number
              - shadow-2xl: Strong shadow for depth
              - cursor-pointer: Show it's clickable
              - transition-all duration-150: Smooth transitions for transform and shadow
              - active:scale-95 active:shadow-lg: Shrink and reduce shadow when pressed
            */}
                    <div
                        className={`
                            text-center
                            text-white
                            w-64 h-64 
                            bg-blue-600 
                            rounded-full 
                            flex items-center justify-center 
                            text-8xl font-black 
                            shadow-2xl 
                            cursor-pointer 
                            transition-all duration-150 ease-out
                            active:scale-95 active:shadow-lg
                            ${isPopping ? 'animate-pop' : ''}
                        `}
                        onClick={handleClick}
                        onAnimationEnd={handleAnimationEnd} // Listen for when the animation finishes
                    >
                        {count}
                    </div>

                    <p className="text-center text-lg text-slate-500 mt-8">
                        Tap the circle to increase the count.
                    </p>

                    {/* Secondary Counter */}
                    <div className="flex flex-row items-center text-sm opacity-80">
                        <span className="">Cycles Completed: {cycleCount}</span>{" "}

                        {/* Max Value Input */}
                        <label className="ml-4">Set Max Value</label>
                        <input
                            title="Max"
                            type="number"
                            value={maxValue}
                            min={1}
                            onChange={handleMaxChange}
                            className="ml-2 w-24 text-center px-2 py-1 rounded-md outline-1 focus:ring-2 focus:ring-indigo-400"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}