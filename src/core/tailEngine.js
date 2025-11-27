// The brain that decides when a symbol should unlock, based on events

import { TailSymbolIds } from './tailSymbols';
import {AppEventTypes} from './events';

/**
 * Example rule:
 * Unlock the CONSISTENCY symbol once the user has completed at least 3 focus sessions
 * 
 * This rule looks at ALL events passed in and checks how many of them are of type FOCUS_SESSION_COMPLETED
 */

function unlockConsistency(events){
    const focusEvents = events.filter(
        (e) => e.type === AppEventTypes.FOCUS_SESSION_COMPLETED,
    );

    // For now, simple threshold: 3 or more focus session = symbol earned
    return focusEvents.length >= 3;
}

/**
 * Unlock La Fortaleza
 * This symbol is awarded when the user completes 10 total focus sessions
 * The symbol represents resilience, discipline, and accumulated strength
 */
function unlockFortaleza(events){
    const focusEvents = events.filter(
        e => e.type === AppEventTypes.FOCUS_SESSION_COMPLETED
    );

    // Award on completion of 10 focus sessions
    return focusEvents.length >= 10;
}


/**
 * The main tail evaluation function
 * 
 * Inputs:
 *  - Events: Array of all AppEvent objects we've recorded
 *  - unlockedIds: Array of TailSymbolIds that are already unlocked
 * 
 * Output:
 *  - {newlyUnlocked: TailSymbolIds[]} - which symbols should be unlocked now,
 *      based on the current events and what is already unlocked
 * 
 * This function is 'pure': it doesn't touch localStrorage or React state directly
 * That makes it easier ti test and reuse
 */

export function evaluateTail(events, unlockedIds){
    const newlyUnlocked = [];

    // Example rule #1: CONSISTENCY
    if(
        !unlockedIds.includes(TailSymbolIds.CONSISTENCY) &&
        unlockConsistency(events)
    ){
        newlyUnlocked.push(TailSymbolIds.CONSISTENCY);
    }
    // Rule #2: FORTALEZA
    if(
        !unlockedIds.includes(TailSymbolIds.FORTALEZA) &&
        unlockFortaleza(events)
    ){
        newlyUnlocked.push(TailSymbolIds.FORTALEZA);
    }

    return {newlyUnlocked};
}