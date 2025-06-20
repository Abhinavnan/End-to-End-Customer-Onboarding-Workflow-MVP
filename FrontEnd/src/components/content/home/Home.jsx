import React from 'react';
import { FadeLoader } from 'react-spinners';
import {Box, Typography, Button} from '@mui/material';
import { useHttp } from '../../../shared/hooks/httpHook.js';
import CustomsDetails from './customsDetails.jsx';
import ErrorBox from '../../../shared/ErrorBox.jsx';
import { useEffect } from 'react';
import { useState } from 'react';

const Home = () => {
  const {error, isLoading, sendRequest, clearError} = useHttp();
  const [customsTable, setCustomsTable] = useState([]);
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const getCustomsDetails = async () => {
    const url = `${baseUrl}/user/customs/`;
    try {
      const response = await sendRequest('get', url);
      setCustomsTable(response.customsTable);
    // eslint-disable-next-line no-unused-vars
    }catch (error) {
      setCustomsTable([]); 
    }
  }

  useEffect(() => {
    getCustomsDetails();
  }, []);
  
  return (
    <Box sx={{p: 2}}>
      <Typography variant="h4" sx={{mb: 2}}>Customs Details</Typography>
      <ErrorBox error={error} clearError={clearError} />
      <FadeLoader loading={isLoading} color="black" cssOverride={{zIndex: 2, top: '50%', left: '50%', position: 'absolute'}} size={50} />
      {customsTable.length > 0 && <CustomsDetails rows={customsTable} />}
    </Box>
  )
}

export default Home;
