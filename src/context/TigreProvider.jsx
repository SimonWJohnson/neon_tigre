
/**
 * Global store for Neon Tigre
 * It holds all events and unlocked symbols, and exposes helper functions to the rest of the app
 * One global place for all events and tail symbols
 * one global function to log events
 * accessible from ANY screen (page) in the app
 *  - Using this provider means tyou don't have to pass props down manually through 20 components
 */

import { createContext, useContext, useEffect, useState } from "react";
import{AppEventTypes, createEvent, loadEvents, saveEvents} from '../core/events';
import {evaluateTail} from '../core/tailEngine';

// Key in localStorage where we persist unlocked tail symbols
const UNLOCKED_KEY = 'neon_tigre_unlocked_symbols';


/**
 * Load the list of unlocked symbol IDs from local storage
 * Returns [] if nothing stored yet or if parsing fails
 */

function loadUnlockedSymbols(){
    const raw = localStorage.getItem(UNLOCKED_KEY);

    if(!raw) return [];
    try{
        return JSON.parse(raw)
    }
    catch(error){
        console.error('Failed to parse unlocked symbols from local storage', error);
        return [];
    }
}

/**
 * Save the array of unlocked symbol IDs to localStorage
 */

function saveUnlockedSymbols(list){
    localStorage.setItem(UNLOCKED_KEY, JSON.stringify(list));
}

/**
 * Create a React Context to share Neon Tigre state throughout the app
 * We start with null; the provider will fill in the actual value
 * 
 */
const TigreContext = createContext(null);

/**
 * TigreProvider wraps the entire app
 * It:
 *  - keeps track of events (array of AppEvent objects)
 *  - keeps track of unlocked tail symbols (array of TailSymbolIds)
 *  - provides a logEvent90 function for children (child React components) to record new events
 *  - automatically evaluated tail unlock rules whenever events change
 */
export function TigreProvider({ children }){
    // Initialise state from localStorage via our helper functions
    const [events, setEvents] = useState(() => loadEvents());
    const [unlockedSymbols, setUnlockedSymbols] = useState(() => loadUnlockedSymbols());
    
    // Hook run only INSIDE the body of a react function component or custom hook
    /**
     * If a useState() is called at the top level:
     * React has no dispatcher
     * No fiber
     * no rendering context
     * so the hook throws, entire app fails, Vite shows a blank page
     */
    // Toast state for popup notifications re: unlocked symbols
    const [toastSymbolId, setToastSymbolId] = useState(null);

    // FocusPage specific toast message
    const [focusToast, setFocusToast] = useState(null);


        /**
     * Whenever the 'events; array changes:
     *  - save events to localStorage
     *  - run the tail engine to see if any new symbols should unlock
     *  - if so, update 'unlockedSymbols' and persist that too
     */
    useEffect(() => {
        // Persist latest events
        saveEvents(events);

        // Ask the tail engine which symbols should unlock
        const {newlyUnlocked} = evaluateTail(events, unlockedSymbols);

        if(newlyUnlocked.length > 0){
            const updated = [...unlockedSymbols, ...newlyUnlocked];
            setUnlockedSymbols(updated);
            saveUnlockedSymbols(updated);

            // Trigger a toast/animation here:
            // e.g. show "You unlocked 📈 Consistency!"
            // Display for the LAST newly unlocked symbol
            const lastUnlockedId = newlyUnlocked[newlyUnlocked.length - 1];
            setToastSymbolId(lastUnlockedId);
        }
        // Include both dependencies:
        // - events: re-run when new events are logged
        // - unlockedSymbols: if symbols change, we avoid re-unlocking the same ones
    }, [events, unlockedSymbols]);

    /**
     * Toast notifications
     */

    // Toast helper function
    function clearToastSymbol(){
        setToastSymbolId(null);
    }

    // Focus toast trigger
    function triggerFocusToast(message){
        setFocusToast(message);
    }

    // Auto clear focus toast after 5 seconds
    useEffect(() => {
        if (!focusToast) return;
        let isCancelled = false;

        const id = setTimeout(() => {
            if (!isCancelled){
                setFocusToast(null);
            }
        }, 5000);
        return () => {
            isCancelled = true;
            clearTimeout(id);
        }
    }, [focusToast]);


    /**
     * logEvent(type, meta)
     * 
     * This is the public function children will use to record a new app event
     *  - 'type' should be one of AppEventTypes (enum-like object)
     *  - 'meta' is optional extra info (e.g. task name, tags, etc.)
     * 
     * It creates an event object, then appends it to the 'events' array
     */

    function logEvent(type, meta = {}){
        const evt = createEvent(type, meta);
        setEvents((prev) => [...prev, evt]);
    }

    // Everything we want to expose to the rest of the app lives in this object
    const value = {
        events,
        unlockedSymbols,
        logEvent,
        AppEventTypes,
        toastSymbolId,
        clearToastSymbol,
        focusToast,
        triggerFocusToast,
    };

    return (
        <TigreContext.Provider value={value}>
            {children}
        </TigreContext.Provider>
    ); 
}

/**
 * Custom hook for consuming the Neon Tigre context easily
 * 
 * instead of: 
 *  - const ctx = useContext(TigreContext)
 * 
 * we call:
 *  - const{ logEvent, unlockedSymbols } = useTigre()
 * 
 * It also throws a helpful error if you try to use it outside of TigreProvider
 */
export function useTigre(){
    const ctx = useContext(TigreContext);
    if(!ctx){
        throw new Error('useTigre must be used inside TigreProvider');
    }
    return ctx;
}


