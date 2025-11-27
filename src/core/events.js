
// Types of events the app can record
export const AppEventTypes = {
    // key-value pair inside an object literal
    // A property inside a JS object
    FOCUS_SESSION_COMPLETED : 'FOCUS_SESSION_COMPLETED',
    TOS_OVERRIDE_SUCCESS : 'TOS_OVERRIDE_SUCCESS',
    SEED_WATERED : 'SEED_WATERED',
    REFLECTION_SUBMITTED : 'REFLECTION_SUBMITTED',
    DAY_CLOSED : 'DAY_CLOSED',
};

const EVENTS_KEY = 'neon_tigre_events';

// Load app events
export function loadEvents(){
    const raw = localStorage.getItem(EVENTS_KEY);
    if(!raw) return [];
    try{
        return JSON.parse(raw);
    }
    catch{
        console.error('Failed to parse events from local storage');
        // return an empty list
        return [];
    }
}

// Save app events
export function saveEvents(events){
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

// Create an app event
export function createEvent(type, meta = {}){
    return{
        type,
        timestamp: Date.now(),
        meta,
    };
}
