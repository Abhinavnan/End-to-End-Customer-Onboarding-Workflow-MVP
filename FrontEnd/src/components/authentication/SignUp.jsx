import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {FadeLoader} from 'react-spinners';
import { Typography, Box, Button, TextField, Link  } from '@mui/material';
import { useHttp } from '../../shared/hooks/httpHook';
import { updateAuthenticationDetails } from '../../Redux/authenticationDetailsSlice';
import Validation from '../../shared/Validation';
import ErrorBox from '../../shared/ErrorBox';

const SignUp = () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        GSTIN: '',
        password: '',
        confirmPassword: ''
    })
    const [touched, setTouched] = useState({ email: false, GSTIN: false, password: false, confirmPassword: false});
    const {inputError, empty, inputVerified} = Validation(formData, touched);
    const {error, isLoading, sendRequest, clearError} = useHttp();

    const handleBlur = (event) => {
        const { name } = event.target;
        setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));
        if(name === 'GSTIN' && value.length !== 15) setFormData((prevData) => ({ ...prevData, name: '' }));
    }

    const handleClick = async () => {
        const GSTIN = formData.GSTIN;
        const data = {GSTIN};
        const url = `${baseUrl}/user/gstin`;
        try {
           const response = await sendRequest('post', url, data);
           setFormData((prevData) => ({ ...prevData, name: response.tradeName }));
        // eslint-disable-next-line no-unused-vars
        }catch(error) {
            setFormData((prevData) => ({ ...prevData, name: '' }));
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = formData;
        const url = `${baseUrl}/auth/signup`;
        try {
            const response = await sendRequest('post', url, data);
            dispatch(updateAuthenticationDetails(response));
            navigate('/');
        } catch (error) {
            console.log(error);
        }       
    };
return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: {xs:'100%', md: '50%', lg: '30%'}, mx: 'auto' }}>
        <Typography variant="h4" gutterBottom>
            Sign Up
        </Typography>
        <Typography variant="body1" gutterBottom>
            Create a new account
        </Typography>
        <ErrorBox error={error} clearError={clearError} />
        <FadeLoader loading={isLoading} color="black" cssOverride={{zIndex: 2, top: '50%', left: '50%', position: 'absolute'}} size={50} />
        <Box component="form" noValidate onSubmit={handleSubmit}
            sx={{ mt: 1, display: 'flex', flexDirection: 'column', width: {xs:'95%', md:'100%'}, gap: 2, opacity: isLoading ? 0.5 : 1 }} >
            <TextField type="name" name="name" placeholder="Name" label="Name" required value={formData.name} disabled 
                onChange={handleChange} />
            <TextField type="email" name="email" placeholder="Email Address" label="Email Address" required value={formData.email} 
                onChange={handleChange} onBlur={handleBlur} error={inputError.email} 
                helperText={inputError.email ? 'Please enter a valid email address' : ''}
             />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <TextField type="text" name="GSTIN" placeholder="GSTIN" label="GSTIN" required value={formData.GSTIN} 
                    onChange={handleChange} onBlur={handleBlur} error={inputError.GSTIN} 
                    helperText={inputError.GSTIN ? 'Please enter a valid GSTIN' : ''} />
                <Link onClick={handleClick} variant="body2" 
                sx={{ display: inputError.GSTIN ? 'none' : 'block' , textAlign: 'right', "&:hover": {cursor: 'pointer'} }}>
                    Verify GSTIN
                </Link>
            </Box>
            <TextField type="password" name="password" placeholder="Password" label="Password" required value={formData.password} 
                onChange={handleChange} onBlur={handleBlur} error={inputError.password} 
                helperText={inputError.password ? 'Password should be at least 6 characters' : ''}/>
            <TextField type="password" name="confirmPassword" placeholder="Confirm Password" label="Confirm Password" required 
                value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur} error={inputError.confirmPassword} 
                helperText={inputError.confirmPassword ? 'Passwords do not match' : ''}/>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mt: 1 }}>
                <Button variant="contained" type="submit" color="primary" disabled={empty || !inputVerified}
                    sx={{ width: '40%', height: '2.7rem' }}>
                    Register
                </Button>
                <Button variant="outlined" href="/" color="primary" sx={{ width: '40%', height: '2.7rem' }}>
                    Back to SignIn
                </Button>
            </Box>
        </Box>
    </Box>
)
}

export default SignUp;
