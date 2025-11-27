
import {useParams, Link} from 'react-router-dom';
import { getTailSymbolById } from '../core/tailSymbols';

/**
 * This function uses the symbolId from the URL
 * Finds the symbol
 * Shows the emoji
 * Shows the name
 * Shows the meaning
 * @returns 
 */
export default function TailSymbolPage(){
    // grab ":symbolId" from the URL, e.g. /tail/FORTALEZA
    const {symbolId} = useParams();

    // Look up full symbol details
    const symbol = getTailSymbolById(symbolId);

    // If someone hits an invalid URL
    if(!symbol){
        return(
            <section>
                <h2>Unknown Tail Symbol</h2>
                <p>Hmmm... that symbol doesn't exist in this jungle</p>
                <p>
                    <Link to="/tail">Back to the Tigre's Tail...</Link>
                </p>
            </section>
        );
    }
    return(
        <section>
            <h2>{symbol.name}</h2>
            <div style={{fontSize: '4rem', marginBottom: '1rem'}}>
                {symbol.emoji}
            </div>
            <p style={{maxWidth: '40rem'}}>{symbol.description}</p>
            <p style={{marginTop: '2rem'}}>
                <Link to="/tail">Back to the Tigre's Tail...</Link>
            </p>
        </section>
    );
}