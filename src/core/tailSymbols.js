

// An 'enum like' object listing all possible tail symbol IDs
// Using a central list like this prevents typos elsewhere in the app
export const TailSymbolIds = {
    FORTALEZA: 'FORTALEZA',
    SEED_OF_COURAGE: 'SEED_OF_COURAGE',
    LOOP_BREAKER: 'LOOP_BREAKER',
    CONSISTENCY: 'CONSISTENCY',
    // Later: add more like "RELEASE", "BOUNDARY_HOLDER", etc.
};

/**
 * The full set of symbol definitions the app knows about
 * Each symbol has:
 *  - a stable id (links to TailSymbolIds above)
 *  - an emoji (visual representation in the tail)
 *  - a name (title)
 *  - a description (short lore / meaning for the user)
 */
export const tailSymbols = [
    {
        id: TailSymbolIds.FORTALEZA,
        emoji: '🧱',
        name: 'La Fortaleza',
        description: 'Resilience. Discipline. You held your ground, responding with calm strength instead of collapse',
    },
    {
        id: TailSymbolIds.SEED_OF_COURAGE,
        emoji: '🌱',
        name: 'Seed of Courage',
        description: 'You moved toward your fear, instead of letting your fear decide',
    },
        {
        id: TailSymbolIds.LOOP_BREAKER,
        emoji: '🪬',
        name: 'Loop Breaker',
        description: 'You interrupted an old mental loop and chose a new response',
    },
        {
        id: TailSymbolIds.CONSISTENCY,
        emoji: '📈',
        name: 'Consistency',
        description: 'You showed up for yourself again, even when it was tough',
    },
];

/**
 * Helper function
 * given an ID, return the full symbol of the object (or undefined if not found)
 * This is useful in TailView when we only have the IDs stored
 * @param {id} 
 * @returns tailSymbol
 */

export function getTailSymbolById(id){
    return tailSymbols.find((s) => s.id === id);
}