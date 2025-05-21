import { useState, useEffect, useContext } from 'react';
import { LoadAnimationContext } from '../components/MyContext';

type fetchObj = {
    method: 'POST' | 'post' | 'GET' | 'get',
    endPoint: {url: string, count: number}, 
    customData?: object,
    loadAnimation?: boolean
}

export const useFetch = ({method, endPoint, customData, loadAnimation = true}: fetchObj) => {

    const {setLoading} = useContext(LoadAnimationContext);

    type errObj = {
        message: string,
        count: number
    }

    type resObj = {
        message: any,
        count: number
    }

    const [response, setResponse] = useState<resObj>({ message: '', count: 0 });
    const [error,  setError] = useState<errObj>({message: '', count: 0});


    // HANDLE ERROR IF RESPONSE IS NOT OK
    const handleError = async (res: any) => {

        if(!res.status){
            setError({
                message: 'Unable to connect to server!',
                count: error.count + 1
            });
            setLoading(false);
            return true;
        }

        if(res.status == 401 || res.status == 403){
            return false
        } else {

            const errMsg = await res.json();
          
            setError({ message: errMsg, count: error.count + 1});
            setLoading(false);
            
            return true;

        } 
    }

    // HANLDLE RESPONSE WHEN IT IS OK
    const handleResponse = async (res: any) => {
        const data = await res.json();
        setResponse({
            message: data,
            count: response.count + 1
        });
        setLoading(false);
        return true;
    }

    // MAKE POST REQUESTS
    const post = async (url: string) => {

        const res = await fetch(url, {
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            method: 'post',
            body: JSON.stringify(customData)
        }).catch(error => error);

        return !res.ok ? await handleError(res) : await handleResponse(res);

    }

    // MAKE GET REQUESTS
    const get = async (url: string) => {

        const res = await fetch(url, { credentials: 'include' }).catch(error => error);
        return !res.ok ? await handleError(res) : await handleResponse(res);

    }

    const handleRequests = async (url: string) => {

        loadAnimation && setLoading(true);
            
        //POST REQUESTS
        if(method == 'post' || method == 'POST'){
          const valid = await post(url);
          console.log(valid)
          if(!valid){
            console.log('posting')
            const validate = await post('http://localhost:2400/token');
            !validate ? console.log('User needs to login!') : post(url);
            validate && console.log('got a new token!');
          } 
        }

        //GET REQUESTS
        if(method == 'get' || method == 'GET'){
          const valid = await get(url);
          console.log(valid)
          if(!valid){
            console.log('getting')
            const validate = await post('http://localhost:2400/token');
            !validate ? console.log('User needs to login!') : get(url);
            validate && console.log('got a new token!');
          } 
        }

    }


    const url = endPoint?.url;

    useEffect(() => {

        const abortController = new AbortController();
        url && handleRequests(url);     

        return () => {
            abortController.abort();     
        };
       
    }, [endPoint])
   
    return { response, error };

}

