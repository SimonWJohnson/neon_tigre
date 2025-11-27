/**
 * Displays the user's tail based on unlocked symbols
 *  - Receives an array of symbol IDs (TailSymbolIds) via props
 *  - Looks up each symbol's details (emoji, name, description)
 *  - Renders the emojis in a row to represent the Tigre's tail
 */

import {Link} from 'react-router-dom';
import { getTailSymbolById } from "../core/tailSymbols";

export default function TailView({ symbolIds }){
    // If the user hasn't unlocked anything yet, show a friendly message 
    if(!symbolIds || symbolIds.length === 0){
        return <p>Your tail is waiting for its first symbol...🐅</p>;
    }

    return(
        <div>
            <h3>The Tigre's Tail</h3>
            <div
            style={{
                fontSize: '2rem',
                marginTop: '0.5rem',
                }}
            >
                {symbolIds.map((id) => {
                    const symbol = getTailSymbolById(id);
                    if(!symbol) return null; // if somehow unknown id, skip
                    return(
                        // Each symbol is now wrapped in a <Link> to /tail/SYMBOL_ID
                        <Link
                        key={id}
                        to={`/tail/${symbol.id}`} // e.g. /tail/CONSISTENCY, /tail/FORTALEZA
                        style={{
                            marginRight: '0.5rem',
                            textDecoration: 'none'
                        }}
                        >
                        <span
                        title={symbol.name}
                        style={{cursor: 'pointer'}}
                        >
                         {symbol.emoji}   
                        </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    )
}