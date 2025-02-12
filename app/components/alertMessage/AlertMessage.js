import * as React from 'react';
import { Snackbar, Alert, AlertTitle, Button, Box } from '@mui/material';
import { createPortal } from 'react-dom';

const AlertMessage = ({ 
  open, 
  setAlert, 
  severity, 
  message, 
  actions,
  autoHideDuration = 3000,
  position = { vertical: 'top', horizontal: 'right' }
}) => {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlert({
      open: false,
      severity: '',
      message: '',
    });
  };

  const getBackgroundColor = (severity) => {
    switch (severity) {
      case 'success':
        return '#009F0C';
      case 'error':
        return '#d32f2f';
      case 'warning':
        return '#ed6c02';
      case 'info':
        return '#0288d1';
      default:
        return '';
    }
  };

  const alertContent = (
    <Snackbar
      open={open}
      anchorOrigin={position}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      sx={{
        position: 'fixed',
        zIndex: 99999999,
      }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{
          width: '330px',
          color: 'white',
          backgroundColor: getBackgroundColor(severity),
          boxShadow: '0px 5px 15px rgba(0,0,0,0.3)',
        }}
      >
        <AlertTitle>{message}</AlertTitle>
        {actions && (
          <Box 
            sx={{ 
              mt: 1,
              display: 'flex',
              gap: 1,
              justifyContent: 'flex-end'
            }}
          >
            {actions.map((action, index) => (
              <Button
                key={index}
                color="inherit"
                size="small"
                onClick={() => {
                  action.onClick();
                  if (action.closeOnClick) {
                    handleClose();
                  }
                }}
                sx={{
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  }
                }}
              >
                {action.label}
              </Button>
            ))}
          </Box>
        )}
      </Alert>
    </Snackbar>
  );

  return createPortal(alertContent, document.body);
};

export default AlertMessage;