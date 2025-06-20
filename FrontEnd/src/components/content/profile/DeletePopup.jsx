import  React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FadeLoader } from 'react-spinners';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Box, Typography, TextField } from '@mui/material';
import { useHttp } from '../../../shared/hooks/httpHook';
import { logout } from '../../../Redux/authenticationDetailsSlice';
import ErrorBox from '../../../shared/ErrorBox';

 function DeletePopup({open, setOpen}) {
  const dispatch = useDispatch();
  const [password, setPassword] = useState('');
  const {error, isLoading, sendRequest, clearError} = useHttp();
  const [inputError, setInputError] = useState(false);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    try {
      const url = `${baseUrl}/user/delete-account`;
      const data = {password};
      await sendRequest('post', url, data);
      dispatch(logout());
      setOpen(false);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      setInputError(true);
    }
  }



  return (
    <Dialog open={open} onClose={handleClose}>
      <ErrorBox error={error} clearError={clearError} />
      <FadeLoader loading={isLoading} color="black" cssOverride={{zIndex: 2, top: '30%', left: '50%', position: 'absolute'}} size={50} />
      <DialogTitle sx={{ backgroundColor: '#670187', color: 'white', textAlign: 'center', py: '0.5rem' }}>Delete Account</DialogTitle>
      <DialogContent sx={{ pb: 0, display: 'flex', flexDirection: 'column', gap: 2}}>
        <Typography variant='h6'>Type your password to delete account</Typography>
        <TextField name='password' label="Password" variant="outlined"  type="password" value={password} error={inputError}
          onChange={(e) => {setPassword(e.target.value); setInputError(e.target.value.length < 6);}}
          helperText={inputError ? 'Invalid password' : ''} />
      </DialogContent>
      <DialogActions sx={{ py: 2, pr: 3}}>
        <Button variant='contained' onClick={handleClose} color='success'>Cancel</Button>
        <Button variant='contained' disabled={password.length < 6} onClick={handleDelete} color='error'>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeletePopup;