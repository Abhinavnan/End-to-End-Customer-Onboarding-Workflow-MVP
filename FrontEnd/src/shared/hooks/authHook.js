import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateAuthenticationDetails, logout } from '../../Redux/authenticationDetailsSlice';

export const useAuth = () => {
    const dispatch = useDispatch();
    const authDetails = useSelector(state => state.authenticationDetails);
    const token = authDetails.token;
    const tockenExpiry = authDetails.tockenExpiry;
    const login = token ? true : false;
    const currentTime = new Date().getTime();
    useEffect(() => {
        if(!token) return;
        if(!tockenExpiry) {
        const isoString = new Date(currentTime + 3600000*4).toISOString();
        dispatch(updateAuthenticationDetails({tockenExpiry: isoString }));
        }else{
            if(currentTime > new Date(tockenExpiry).getTime()){
                dispatch(logout());
            } 
            const remainingTime = new Date(tockenExpiry).getTime() - currentTime;
            setTimeout(() => {
                dispatch(logout());
            }, remainingTime);
        }        
    }, [tockenExpiry, token, currentTime, dispatch]);

    return {login};
}
