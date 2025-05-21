import '../components_css/landingPage.css';
import { useNavigate } from 'react-router-dom';

export const LandingPage = () => {
    
    const navigate = useNavigate();

   return (
        <div id="landing-page-container">
            <h1>Welcome to the chat app</h1>
            <p>Please click on the sign up button to create an account or if you already have an account, click on the sign in button to login</p>
            <div className="buttons">
                <button onClick={() => navigate('/register')}>Sign up</button>
                <button onClick={() => navigate('/login')}>Sign in</button>
            </div>
        </div>
   ) 
}