import {useTigre} from "../../context/TigreProvider";
import './FocusLockedToast.css'

export default function FocusLockedToast(){
    const {focusToast} = useTigre();

    // If no toast message -> show nothing
    if (!focusToast) return null;

    return(
        <div className="focus-locked-toast">
            {focusToast}
        </div>
    );
}