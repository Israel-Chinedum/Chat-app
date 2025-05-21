import '../components_css/login.css';
import { useState, useEffect } from 'react';
import { useFetch } from '../customHooks/useFetch';
import { useNavigate } from 'react-router-dom';
import { display } from '../customHooks/useDisplay';


export const Login = () => {

    const navigate = useNavigate();

    type endPointObj = {
        url: string,
        count: number
    }

    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [endPoint, setEndPoint] = useState<endPointObj>({url: '', count: 0});
    
    
    const { response, error } = useFetch({
        method: 'post',
        endPoint: endPoint,
        customData: {username, password},
    });        

    const { onDisplay, setDisplay } = display(3000);

    useEffect(() => {

        error.message && setDisplay(true);
        response.message && navigate('/home');

    }, [error, response])
   
            
    return(
        <> 

        <button className='exit-to-landing-page' onClick={() => navigate('/')}>X</button>

        { onDisplay && <p className='login-msg' style={{color: error && 'red', borderColor: error && 'red'}}>
            {error.message}
        </p> }

        <form action="" id='form' onSubmit={(e) => {
                e.preventDefault();
                setEndPoint({
                    url: 'http://localhost:2400/login',
                    count: endPoint.count + 1
                })
            }}>
            <h1>Sign in</h1>
            <input type="text" name="username" value={username} placeholder='Enter username' required onChange={(e) => setUserName(e.target.value)} />
            <input type="password" name="password" value={password} placeholder='Enter password' required onChange={(e) => setPassword(e.target.value)} />
            <button id='login-btn'>Login</button>
        </form>
        </>
    )
}