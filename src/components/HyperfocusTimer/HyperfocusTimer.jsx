
import {useEffect, useState} from "react";
import "./HyperfocusTimer.css";
import FireRing from "../FireRing/FireRing";

/**
 * HyperfocusTimer
 * 
 * Owns:
 *  - selected preset
 *  - remainingSeconds
 *  - activeDurationSeconds 9for logging)
 *  - isRunning
 *  - start / pause / reset
 *  - dev 10s test
 *  - breathing aura + claw slash + display
 * 
 * Props:
 *  - presets: array of minutes (e.g. [15, 20, 45])
 *  - initiateMinutes: default starting preset
 *  - onSessionComplete({ durationSeconds }) - called when the timer hits 0
 *  - onPresetLocked() - called when the user clicks preset while running
 * 
 * NOTE: This component owns ALL timer logic - FocusPage stays clean
 */

export default function HyperfocusTimer({
    presets = [15, 20, 45],
    initialMinutes = 15,
    onSessionComplete,
    onPresetLocked,
}){
    /**
     * Local State
     */
    
    // Which preset the user selected
    const [selectedMinutes, setSelectedMinutes] = useState(initialMinutes);

    // Live countdown value in seconds
    const [remainingSeconds, setRemainingSeconds] = useState(
        initialMinutes * 60
    );

    // The *original* session length when the user pressed 'Start'
    // This is important because the user can hit Dev:10s Test, or resume from 00
    const [activeDurationSeconds, setActiveDurationSeconds] = useState(
        initialMinutes * 60
    );

    // Whether the timer is actively ticking
    const [isRunning, setIsRunning] = useState(false);

    // Explicit finished state for clean visuals + splash timing
    const [isFinished, setIsFinished] = useState(false);

    // Explicit state / state flag to 'help' isActive
    const [hasStarted, setHasStarted] = useState(false); 

    // Derived state for isActive
    //const isActive = isRunning || isFinished;
    const isActive = hasStarted || isFinished;

    // Debug
    // console.log("remainingSeconds:", remainingSeconds, 
    //         "isRunning:", isRunning, 
    //         "isFinished:", !isRunning && remainingSeconds === 0);

    /**
     * TICKING EFFECT (runs once per second only when running)
     * 
     * IMPORTANT
     *  - This effect MUST have NO side effects except ticking
     *  - It must NOT log events or trigger anything outside itself
     *  - React expects updater functions (setState(prev => ...)) to be PURE
     */

    useEffect(() => {
        if (!isRunning) return; // don't start ticking if paused or finished

        const intervalId = setInterval(() => {
            setRemainingSeconds((prev) => {
                // If we drop to 0, the completion effect handles the side effects
                if(prev <= 1) return 0;
                return prev - 1;
            });
        }, 1000);
        
        // Cleanup when paused, finished, or unmounted
        return () => clearInterval(intervalId);
    }, [isRunning]);

    /**
     * COMPLETION EFFECT
     * 
     * When remainingSeconds hits 0 *while running*, the session is finished
     * 
     * we trigger:
     *  - Stop the timer
     *  - Notify parent (FocusPage) -> FocusPage logs event + increments counter
     */

    useEffect(() => {
        if (!isRunning) return; // Only care if timer is actively ticking
        if (remainingSeconds !== 0) return; // only trigger on exact zero

        // Mark as finished so the UI can show the slash + pulse
        setIsFinished(true);

        // Stop the timer
        setIsRunning(false);

        // Notify parent so FocusPage can log event + count session
        if(typeof onSessionComplete === "function"){ 
            onSessionComplete({
                durationSeconds: activeDurationSeconds,
            });
        }
    }, [remainingSeconds, isRunning, activeDurationSeconds, onSessionComplete]);

    /**
     * KEEP TIMER SYNCED WITH PRESET (only when NOT running)
     * 
     * If the user switches preset while NOT running, update remainingSeconds
     * But if running -> blocked and triggers toast
     * 
     */

    useEffect(() => {
        // optional guard
        // if(!isRunning && !isFInished)
        if (!isRunning){
            // only respond when the user picks a new preset
            const secs = selectedMinutes * 60;
            setRemainingSeconds(secs);
            setActiveDurationSeconds(secs);
            setIsFinished(false); // clear any previous state
        }
    }, [selectedMinutes]); // isRunning, isFinished

    /**
     * Derived flag - tell the UI when the session finished
     */
    //const isFinished = !isRunning && remainingSeconds === 0;

    /**
     * BUTTON HANDLERS
     */

    // Start
    function handleStart(){
        if (isRunning) return;

        // If timer was at 00:00, reset to selected preset on Start
        if(remainingSeconds <= 0){
            const secs = selectedMinutes * 60;
            setRemainingSeconds(secs);
            setActiveDurationSeconds(secs);
        }
        // Edge-case: if activeDuration somehow 0 -> assume remainingSeconds
        else if(activeDurationSeconds === 0){
            setActiveDurationSeconds(remainingSeconds);
        }
        setIsFinished(false);
        setIsRunning(true);
        setHasStarted(true);
    }
    // Pause
    function handlePause(){
        setIsRunning(false);
    }
    // Reset
    function handleReset(){
        setIsRunning(false);
        const secs = selectedMinutes * 60;
        setRemainingSeconds(secs);
        setActiveDurationSeconds(secs);
        setIsFinished(false);
        setHasStarted(false); // back to compact view
    }

    // Preset Buttons
    function handlePresetClick(min){
        // If running, presets are LOCKED -> call focusPage toast callback
        if(isRunning){
            if(typeof onPresetLocked === "function"){
                onPresetLocked();
            }
            return;
        }
        setSelectedMinutes(min);
    }

    // DEV helper - forces immediate 5sec countdown for testing animations & events
    function handleDevTenSecondTest(){
        if (isRunning) return;
        setRemainingSeconds(5);
        setActiveDurationSeconds(5);
        setIsFinished(false);
        setHasStarted(false);
    }

    /**
     * Simple Formatter
     *  "mm:ss"
     */
    function formatTime(totalSeconds){
        const clamped = Math.max(0, Math.floor(totalSeconds));
        const m = Math.floor(clamped / 60);
        const s = clamped % 60;
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }

    /**
     * Dynamically select CSS classes for:
     *  - Breathing effect (active)
     *  - Claw slash (on finish)
     */
    const shellClass = 
        "hyperfocus-shell" +
        (isRunning ? " hyperfocus-shell--running" : "") +
        (isActive ? " hyperfocus-shell--breathing" : "") +
        (isFinished ? " hyperfocus-shell--claw" : "") + 
        (isActive ? " hyperfocus-shell--expanded" : "");

    /**
     * RENDER
     */
    return(
        <div className="hyperfocus-timer">
            {/* PRESET BUTTONS */}
            <div className="focus-presets">
                <p>Choose your hunt length...</p>
                <div className="focus-preset-buttons">
                    {presets.map((min) => (
                        <button
                            key={min}
                            type="button"
                            onClick={() => handlePresetClick(min)}
                            className={
                                "focus-preset-button" + 
                                (selectedMinutes === min ? " selected" : "")
                            }
                        >
                            {min} minutes
                        </button>
                    ))}
                </div>
            </div>
            {/* TIMER DISPLAY & AURA & CLAW */}
            <div className={shellClass}>
                {/* 🔥 Fire Ring wrapped around the timer */}
                <FireRing
                    remainingSeconds={remainingSeconds}
                    activeDurationSeconds={activeDurationSeconds}
                    isRunning={isRunning}
                    isFinished={isFinished}
                    isActive={isActive}
                    size={320}
                />
                    <div 
                        className={"focus-timer-display" + 
                        (isFinished ? " focus-timer-finished" : "")
                        }
                    >
                    {formatTime(remainingSeconds)}
                </div>
                {/* DOM-based Tigre claw slash – only rendered when finished */}
                {isFinished && <div className="tigre-claw-bar"/>}
            </div>
            {/* CONTROLS */}
            <div className="focus-controls">
                {!isRunning && (
                    <button type="button" onClick={handleStart} className="focus-btn">
                        Start
                    </button>
                )}
                {isRunning && (
                    <button type="button" onClick={handlePause} className="focus-btn">
                        Pause
                    </button>
                )}
                <button type="button" onClick={handleReset} className="focus-btn">
                    Reset
                </button>
                <button type="button" onClick={handleDevTenSecondTest} className="focus-btn">
                    Dev: 5s Test
                </button>
            </div>
        </div>
    );



}

