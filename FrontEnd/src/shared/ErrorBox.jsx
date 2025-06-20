import React from 'react';
import { Box, Typography,Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

const ErrorBox = ({clearError, error}) => {
  return (
    <Dialog
      open={error}
      onClose={clearError}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ '& .MuiDialog-paper': { width: '90%', maxWidth: '32rem', borderRadius: 1 } } }
    >
      <DialogTitle id="alert-dialog-title" sx={{ backgroundColor: '#670187', color: 'white', textAlign: 'center', py: '0.5rem' }}>
        {"An Error Occurred!"}
      </DialogTitle>
      <DialogContent sx={{ p:0 }}>
        <Typography variant="body1" sx={{ textAlign: 'center', p: '1rem' }}>
          {error}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={clearError} sx={{backgroundColor: '#be0000', color: 'white', px: '1rem'}}  >Close</Button>
      </DialogActions>
    </Dialog>
  )
}

export default ErrorBox;
