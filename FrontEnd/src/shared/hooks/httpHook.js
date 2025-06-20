import React,{useState, useCallback, useEffect, useRef} from 'react'
import { useSelector } from 'react-redux';
import axios from 'axios';

export const useHttp = () => {
    const authDetails = useSelector(state => state.authenticationDetails);
    const token = authDetails.token;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const activeHttpRequests = useRef([]);
    
    const sendRequest = useCallback(async (method,url, data) => {
        setIsLoading(true);
        setError(null);
        const abortCtrl = new AbortController();
        activeHttpRequests.current.push(abortCtrl);
        const signal = abortCtrl.signal;
        const headers = { 'Authorization': `Bearer ${token}` }
        try {
            const response = await axios({url, method, data, headers, signal});
            activeHttpRequests.current = activeHttpRequests.current.filter(reqCtrl => reqCtrl !== abortCtrl);
            return response.data;
        } catch (error) {
            setError(error.response.data.message);
            throw error;
        }finally {
            setIsLoading(false);
        }
        
    }, []);

  useEffect(() => {return () => {activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort())}}, []);
  const clearError = () => setError(null);

  return {error, isLoading, sendRequest, clearError};
}

