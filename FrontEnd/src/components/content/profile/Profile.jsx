import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Typography, Button, Paper } from '@mui/material';
import { logout } from '../../../Redux/authenticationDetailsSlice';
import DeletePopup from './DeletePopup';

const Profile = () => {
    const authDetails = useSelector(state => state.authenticationDetails);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
    }

    return (
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center',}}>
            <DeletePopup open={open} setOpen={setOpen} />
            <Paper elevation={3} 
                sx={{p: 2, width: {xs: '90%', md: '70%', lg: '50%'}, mt: {xs: '1rem', md: '2rem'}  }}>
                <Typography variant='h4' sx={{mb: 1}}>Profile</Typography>
                <Box sx={{textAlign: 'left', ml: 2,}}>
                    <Typography variant='h6'>Name: {authDetails.name}</Typography>
                    <Typography variant='h6'>Email: {authDetails.email}</Typography>
                    <Typography variant='h6'>GSTIN: {authDetails.GSTIN}</Typography>
                </Box>
                <Button variant='contained' href='/change-password' color='secondary' sx={{mr: 2, mt: 2, '&:hover': {color: 'white'}}}>
                    Change Password
                </Button>
                <Button variant='contained' color='error' sx={{mr: 2, mt: 2 }} onClick={() => setOpen(true)} >Delete Account</Button>
                <Button variant='contained' color='primary' onClick={handleLogout} sx={{mt: 2}} >Logout</Button>
            </Paper>
        </Box>
    )
}

export default Profile;
