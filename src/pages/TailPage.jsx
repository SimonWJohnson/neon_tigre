/**
 * TailPage:
 *  - Shows the 'A Tale for a Tail' area
 *  - Pulls unlockedSymbols from the global context
 *  - Passes the IDs into TailView to render the emojis
 *  Flow:
 *  - Button -> logEvent() -> events -> tailEngine -> unlockedSymbols -> TailView
 */

import { useTigre } from '../context/TigreProvider'
import TailView from '../components/TailView'

export default function TailPage(){
    const {unlockedSymbols} = useTigre();

    return(
        <section>
            <h2>A Tale for a Tail...</h2>
            <p>Watch your tail grow...</p>
            <TailView symbolIds={unlockedSymbols}/>
        </section>
    )
}