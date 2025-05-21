import { useState } from 'react';


export const display = (timeout: number | null = null) => {
    
    const [onDisplay, setDisplay] = useState<boolean>(false);
    const [showing, setShowing] = useState<boolean>(false);
    
        if(onDisplay && timeout){
            setTimeout(() => {
                setDisplay(false);
            }, timeout);
        }


    return { onDisplay, setDisplay, showing, setShowing };
}
