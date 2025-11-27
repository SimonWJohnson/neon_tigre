
import {useEffect, useState} from "react";
import { useTigre } from "../../context/TigreProvider";
import './FocusPage.css';
import FocusLockedToast from "../../components/FocusLockedToast/FocusLockedToast";
import HyperfocusTimer from "../../components/HyperfocusTimer/HyperfocusTimer";
/**
 * FocusPage:
 *  - Eventually this will hold the Hyperfocus Timer UI
 *  - For now, we simulate a comlpeted focus session when the user clicks a button
 *  - Each simulated completion logs a FOCUS_SESSION_COMPLETED event
 *  - After 3 of these, the tail engine will unlock the 📈 Consistency symbol
 * 
 * @returns 
 * 
 */

/**
 * 
 * @returns FocusPage - Hyperfocus Engine
 * 
 * Features:
 *  - Preset focus lengths (15 / 25 / 45 minutes)
 *  - Countdown timer with Start / Pause / Reset
 *  - On completion:
 *      - Logs a FOCUS_SESSION_COMPLETED event into the Tigre engine
 *      - Increments a "Sessions completed this run" counter
 *      - Lets the tail engine + roar + toast system do its thing
 * 
 */

export default function FocusPage(){
     // Use the focus toast here
    const { logEvent, AppEventTypes, triggerFocusToast } = useTigre();

    // Simple local stat: how many session completed in this app run
    const [sessionsCompleted, setSessionsCompleted] = useState(0);

    /**
     * Called by HyperfocusTimer when a session finishes
     * When a session is complete:
     *  - stop the timer
     *  - increment local session counter
     *  - log an event into the Tigre engine
     */

    function handleSessionComplete({durationSeconds}){
        //setIsRunning(false);
        setSessionsCompleted((count) => count + 1);

        logEvent(AppEventTypes.FOCUS_SESSION_COMPLETED, {
            source: "hyperfocus_timer",
            //durationMinutes: selectedMinutes,
            //durationSeconds: selectedMinutes * 60,
            durationSeconds,
            completedAt: new Date().toISOString(),
        });
    }

    function handlePresetLocked(){
        triggerFocusToast("Presets locked while the Tigre is hunting...")
    }

    return(
        <section className="focus-container">
            <h2>Hyperfocus Engine</h2>
            <p>
                Pick a focus block, start the hunt, and let the Tigre lock in.
                Every completed session feeds your tail...
            </p>
            <HyperfocusTimer
                presets={[15, 20, 45]}
                initialMinutes={15}
                onSessionComplete={handleSessionComplete}
                onPresetLocked={handlePresetLocked}
            />
            {/* Simple local stats */}
            <p className="focus-stats">
                Sessions completed this run: {" "}
                <strong>{sessionsCompleted}</strong>
            </p>
            <p>
                Each time the timer hits zero, the Tigre logs a{" "}
                <code>FOCUS_SESSION_COMPLETED</code> event
                Stack a few of these, then check your Tail page and listen for the roar...
            </p>
                {/*{isRunning && (<p>Presets locked while the Tigre is hunting...</p>)}*/}
                <FocusLockedToast/>
        </section>
    );
}