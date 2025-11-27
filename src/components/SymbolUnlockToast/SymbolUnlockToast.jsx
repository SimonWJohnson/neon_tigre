
/**
 * Listen to toastSymbolId from context
 * Looks up the full symbol metadata
 * Shows a nice overlay with emoji, name, meaning
 * Auto dismisses after 5 seconds
 * 'View details' jumps to /tail/SYMBOL_ID
 * 'Dismiss X' closes toast immediately
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTigre } from '../../context/TigreProvider';
import { getTailSymbolById } from '../../core/tailSymbols';
import './SymbolUnlockToast.css';
import TigerRoar from '../../assets/sounds/TigerRoar.mp3';

export default function SymbolUnlockToast(){
    const {toastSymbolId, clearToastSymbol} = useTigre();

    // Create a persistent audio object outside the component
    const roar = new Audio(TigerRoar);
    roar.preload = 'auto';
    roar.volume = 1; // adjust as needed

    // Grab the symbol
    const symbol = toastSymbolId ? getTailSymbolById(toastSymbolId) : null;
    //if (!symbol) return null;

    // Auto-hide after a few seconds
    useEffect(() => {
        // Render nothing if no symbol to show
        if(!toastSymbolId) return;

        // Play the TigerRoar.mp3 on toast event
        roar.currentTime = 0; // rewind
        roar.play().catch(() => {});

        const timer = setTimeout(() => {
            clearToastSymbol();
        }, 5000); // 5 seconds

        return () => clearTimeout(timer);
    }, [toastSymbolId, clearToastSymbol]);

    // If no symbol / toast, render nothing
    if(!toastSymbolId || !symbol) return null;

    return(
        <div className="toast-container">
            <div className="toast-emoji">
                {symbol.emoji}
            </div>
            <div className="toast-title">
                {symbol.name} unlocked!
            </div>
            <div className="toast-description">
                {symbol.description}
            </div>
            <div className="toast-links">
                <Link
                to={`/tail/${symbol.id}`}
                className="toast-details-link"
                onClick={clearToastSymbol}
                >
                    View Details</Link>
                <button
                className="toast-dismiss-button"
                onClick={clearToastSymbol}
                >
                    Dismiss X
                </button>
            </div>
        </div>
    );
}