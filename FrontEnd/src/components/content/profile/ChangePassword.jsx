import React,{useState} from 'react';
import { FadeLoader } from 'react-spinners';
import { Box, Typography, Button, TextField } from '@mui/material';
import { useHttp } from '../../../shared/hooks/httpHook';
import ErrorBox from '../../../shared/ErrorBox';

const ChangePassword = () => {
    const {error, isLoading, sendRequest, clearError} = useHttp();
    const baseUrl = import.meta.env.VITE_BASE_URL;
    const [formData, setFormData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
    const [inputError, setInputError] = useState({ oldPassword: false, newPassword: false, confirmPassword: false });
    const disabled = !formData.oldPassword || !formData.newPassword || !formData.confirmPassword ||
                       inputError.oldPassword || inputError.newPassword || inputError.confirmPassword;
    const [passwordChanged, setPasswordChanged] = useState(false);

    const samePassword = formData.newPassword === formData.oldPassword;
    const newPasswordHelperText = samePassword ? 'Password same as old password' : 'Password should be at least 6 characters long';

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setInputError((prevError) => ({ ...prevError, [name]: value.length < 6}));
        if(name === 'confirmPassword') 
            setInputError((prevError) => ({ ...prevError, confirmPassword: value !== formData.newPassword}));
        if(name === 'newPassword') 
            setInputError((prevError) => ({ ...prevError,  newPassword: value === formData.oldPassword}));
    };

    const handleClick = async () => {
        const data = {oldPassword: formData.oldPassword, newPassword: formData.newPassword, confirmPassword: formData.confirmPassword}
        const url = `${baseUrl}/user/change-password`;
        try {
            await sendRequest('patch', url, data);
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setPasswordChanged(true);
        // eslint-disable-next-line no-unused-vars
        }catch(error) {
            setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            setPasswordChanged(false);
        }
    };

    return (
        <Box sx={{p: 2, opacity: isLoading ? 0.5 : 1}} >
        <Typography variant="h4" sx={{mb: 1}}>Change Password</Typography>
        <ErrorBox error={error} clearError={clearError} />
        <FadeLoader loading={isLoading} color="black" cssOverride={{zIndex: 2, top: '30%', left: '50%', position: 'absolute'}} size={50} />
        {passwordChanged && <Typography variant="h6" sx={{color: 'green', m: 'auto', mb: 1, }}>Password changed successfully</Typography>}
        <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, width: {xs: '98%', md: '70%', lg: '50%'}, m: 'auto'}}>
            <TextField label="Old Password" variant="outlined"  type="password" name="oldPassword" value={formData.oldPassword}
                onChange={handleChange} error={inputError.oldPassword} 
                helperText={inputError.oldPassword ? 'Invalid password' : ''}  />
            <TextField label="New Password" variant="outlined"  type="password" name="newPassword" value={formData.newPassword}
                onChange={handleChange} error={inputError.newPassword} 
                helperText={inputError.newPassword ? newPasswordHelperText : ''}  />
            <TextField label="Confirm Password" variant="outlined"  type="password" name="confirmPassword" value={formData.confirmPassword}
                onChange={handleChange} error={inputError.confirmPassword} 
                helperText={inputError.confirmPassword ? 'Password does not match' : ''}  />
        </Box>
        <Button variant="contained" type='submit' onClick={handleClick} disabled={disabled} sx={{mt: 2}}>Change Password</Button>
        </Box>
    )
}

export default ChangePassword;
