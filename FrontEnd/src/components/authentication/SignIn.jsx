import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FadeLoader } from 'react-spinners';
import { Link, Alert, Button, useTheme, Paper} from '@mui/material';
import { AppProvider, SignInPage } from '@toolpad/core';
import { useHttp } from '../../shared/hooks/httpHook';
import { updateAuthenticationDetails, logout } from '../../Redux/authenticationDetailsSlice';
import ErrorBox from '../../shared/ErrorBox';


const providers = [{ id: 'credentials', name: 'Email and Password' }];

function CustomButton() {
  return (
    <Button
      type="submit"
      variant="contained"
      color="info"
      size="small"
      disableElevation
      fullWidth
      sx={{ my: 2 }}
    >
      Sign In
    </Button>
  );
}

function SignUpLink() {
  return (
    <Link href="/signup" variant="body2">
      Register User
    </Link>
  );
}


function Title() {
  return <h2 style={{ marginBottom: 8 }}>SignIn</h2>;
}

function SignIn() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const url = `${baseUrl}/auth/signin`;
  const {error, isLoading, sendRequest, clearError} = useHttp();
  const [inputError, setInputError] = useState(false);
  const [subtitle, setSubtitle] = useState('Signin to view customers');

  function Subtitle() {
    return (
      <Alert sx={{ mb: 2, px: 1, py: 0.25, width: '100%' }} severity={inputError ? 'error' : 'info'}>
        {subtitle}
      </Alert>
    );
  }
  
  const signIn = async (provider, formData) => {
    const email = formData.get('email');
    const password = formData.get('password');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validEmail = emailRegex.test(email);
    const validPassword = password.length >= 6;
    setInputError(!validEmail || !validPassword);
    if (!validEmail) setSubtitle('Please enter valid email');
    if (!validPassword) setSubtitle('Please enter valid password');
    if (!validEmail && !validPassword) setSubtitle('Please enter valid email and password');
    if (!validEmail || !validPassword) return;
    const data = {email, password};
    try{
      const response = await sendRequest('post', url, data);
      dispatch(updateAuthenticationDetails(response));
    }catch(error){
      dispatch(logout());
      setInputError(true);
      setSubtitle(error.response.data.message);
    }
  }
  return (
    <AppProvider theme={theme}>
      <ErrorBox error={error} clearError={clearError} />
      {isLoading && <Paper sx={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, opacity: 0.5}} />}
      <FadeLoader loading={isLoading} color="black" cssOverride={{zIndex: 2, top: '50%', left: '50%', position: 'absolute'}} size={50} />
      <SignInPage
        signIn={signIn}
        slots={{
          title: Title,
          subtitle: Subtitle,
          submitButton: CustomButton,
          signUpLink: SignUpLink,
        }}
        slotProps={{ form: { noValidate: true } }}
        providers={providers}
      />
    </AppProvider>
  );
}

export default SignIn;