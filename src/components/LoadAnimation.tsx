import '../components_css/loadAnimation.css';
import { useContext } from 'react';
import { LoadAnimationContext } from './MyContext';

export const LoadAnimation = () => {

    const {loading} = useContext(LoadAnimationContext);

    return (
        <>
            { 
                loading && <div id="load-container">
                    <div id="spinner" style={{animationPlayState: 'running'}}></div>
                </div> 
            }
        </>
    )
}

export const MiniLoadAnimation = (
    { loading, width, height } : { loading: boolean, width: string, height: string }
) => {
    return (
        <>
            {
                loading && <div id='mini-load-container' style={{width: width, height: height}}>
                    <div id='spin-div' style={{animationPlayState: 'running'}}></div>
                </div>
            }
        </>
    )
}