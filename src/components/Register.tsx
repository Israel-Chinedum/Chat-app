import '../components_css/register.css';
import { useState, useEffect } from 'react';
import { useFetch } from '../customHooks/useFetch';
import { useNavigate } from 'react-router-dom';
import { display } from '../customHooks/useDisplay';

export const Register = () => {

    const navigate = useNavigate();

    const [firstName, setFirstName] =  useState('');
    const [lastName, setLastName] =  useState('');
    const [email, setEmail] =  useState('');
    const [mobile, setMobile] =  useState('');
    const [age, setAge] =  useState('');
    const [DOB, setDOB] =  useState('');
    const [username, setUsername] =  useState('');
    const [password, setPassword] =  useState('');


    type endPointObj = {
        url: string,
        count: number
    }
    const [endPoint, setEndPoint] = useState<endPointObj>({url: '', count: 0});

    const data = { firstName, lastName, email, mobile, age, DOB, username, password };

    const { response, error } = useFetch({
        method: 'post',
        endPoint,
        customData: data
    });


    const { onDisplay, setDisplay, showing, setShowing } = display(3000);

    useEffect(() => {
        error.message && setDisplay(true);
        response.message && setShowing(true);
    }, [error, response])

    
    return(
        <>

            <button className='exit-to-landing-page' onClick={() => navigate('/')}>X</button>

            { onDisplay && <p className='reg-msg' style={{borderColor: error && 'red', color: error && 'red'}}>
                {error.message}
            </p>}

            {!showing && <form action="" id="reg-form" onSubmit={(e) => {
                    e.preventDefault();
                    setEndPoint({
                        url: 'http://localhost:2400/createUser', 
                        count: endPoint.count + 1
                    });
                }}>
                <h1>Sign up</h1>
                <input type="text" placeholder="Enter First Name" required onChange={(e) => setFirstName(e.target.value)} />
                <input type="text" placeholder="Enter Last Name" required onChange={(e) => setLastName(e.target.value)} />
                <input type="email" placeholder="Enter Email Address" required onChange={(e) => setEmail(e.target.value)} />
                <input type="number" placeholder="Enter Mobile Number" required onChange={(e) => setMobile(e.target.value)} />
                <input type="number" placeholder="Enter Age" required onChange={(e) => setAge(e.target.value)} />
                <input type="date" placeholder="Enter Date of Birth" required onChange={(e) => setDOB(e.target.value)} />
                <input type="text" placeholder="Enter username" required onChange={(e) => setUsername(e.target.value)} />
                <input type="password" placeholder="Enter password" required onChange={(e) => setPassword(e.target.value)} />
                <button id="reg-btn">Submit</button>
            </form>}

            {showing && <div id="success-page-container">
                <h1>Registration Successfull</h1>
                <p>Please click on the button below in order to sign in.</p>
                <div className="buttons">
                    <button onClick={() => setShowing(false)}>Back</button>
                    <button onClick={() => navigate('/login')}>Sign in</button>
                </div>
            </div>}

        </>
    )
}