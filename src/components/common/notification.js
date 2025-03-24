import React, { forwardRef } from "react";
import { 
  Snackbar, 
  Alert, 
  Typography,
  Box,
  IconButton,
  Slide,
  useTheme
} from "@mui/material";
import { 
  Close, 
  CheckCircleOutline, 
  ErrorOutline, 
  InfoOutlined, 
  WarningAmberOutlined 
} from "@mui/icons-material";

// Transition component for Snackbar entrance
const SlideTransition = (props) => {
  return <Slide {...props} direction="left" />;
};

// Custom Alert component with enhanced styling
const CustomAlert = forwardRef((props, ref) => {
  const { severity, onClose, sx, title, children, ...other } = props;
  const theme = useTheme();
  
  // Map severity to icon
  const getIcon = () => {
    switch (severity) {
      case 'success':
        return <CheckCircleOutline />;
      case 'error':
        return <ErrorOutline />;
      case 'warning':
        return <WarningAmberOutlined />;
      case 'info':
      default:
        return <InfoOutlined />;
    }
  };
  
  // Map severity to color
  const getColorPalette = () => {
    switch (severity) {
      case 'success':
        return {
          light: theme.palette.success.light,
          main: theme.palette.success.main,
          dark: theme.palette.success.dark,
          contrastText: theme.palette.success.contrastText || '#fff'
        };
      case 'error':
        return {
          light: theme.palette.error.light,
          main: theme.palette.error.main,
          dark: theme.palette.error.dark,
          contrastText: theme.palette.error.contrastText || '#fff'
        };
      case 'warning':
        return {
          light: theme.palette.warning.light,
          main: theme.palette.warning.main,
          dark: theme.palette.warning.dark,
          contrastText: theme.palette.warning.contrastText || '#fff'
        };
      case 'info':
      default:
        return {
          light: theme.palette.info.light,
          main: theme.palette.info.main,
          dark: theme.palette.info.dark,
          contrastText: theme.palette.info.contrastText || '#fff'
        };
    }
  };
  
  const colors = getColorPalette();

  return (
    <Alert
      ref={ref}
      variant="filled"
      icon={getIcon()}
      severity={severity}
      onClose={onClose}
      sx={{
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        width: '100%',
        '& .MuiAlert-icon': {
          alignItems: 'center',
          fontSize: '1.5rem',
          mr: 1
        },
        '& .MuiAlert-message': {
          padding: '8px 0',
        },
        ...sx
      }}
      {...other}
    >
      <Box>
        {title && (
          <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
            {title}
          </Typography>
        )}
        <Typography variant="body2">{children}</Typography>
      </Box>
    </Alert>
  );
});

/**
 * Enhanced Notification Component
 * 
 * @param {boolean} open - Controls if notification is visible
 * @param {string} message - Main notification message
 * @param {string} title - Optional title for the notification
 * @param {string} severity - 'success', 'error', 'warning', or 'info'
 * @param {function} handleClose - Function to handle notification close
 * @param {number} autoHideDuration - Time in ms before auto-closing (default: 5000, 0 to disable)
 * @param {object} position - Anchor position {vertical, horizontal}
 * @param {boolean} disableClickAway - If true, clicking away won't close the notification
 */
const Notification = ({ 
  open, 
  message, 
  title,
  severity = "info", 
  handleClose,
  autoHideDuration = 5000,
  position = { vertical: "top", horizontal: "right" },
  disableClickAway = false
}) => {
  const handleCloseEvent = (event, reason) => {
    if (reason === 'clickaway' && disableClickAway) {
      return;
    }
    
    if (handleClose) {
      handleClose(event, reason);
    }
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleCloseEvent}
      anchorOrigin={position}
      TransitionComponent={SlideTransition}
      sx={{
        maxWidth: { xs: '90%', sm: 400 }
      }}
    >
      <CustomAlert 
        severity={severity} 
        onClose={handleClose}
        title={title}
      >
        {message}
      </CustomAlert>
    </Snackbar>
  );
};

export default Notification;