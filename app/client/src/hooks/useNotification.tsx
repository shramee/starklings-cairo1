import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import { useSnackbar, VariantType } from 'notistack'
import { useCallback } from 'react'

export const useNotification = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const defaultNotifier = useCallback(
    (
      message?: string,
      variant?: VariantType,
      preventDuplicate = false,
      autoHideDuration = 5000
    ) => {
      enqueueSnackbar(message, {
        variant,
        preventDuplicate,
        autoHideDuration,
        action: (key) => (
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => closeSnackbar(key)}
          >
            <CloseIcon />
          </IconButton>
        ),
      });
    },
    [enqueueSnackbar, closeSnackbar]
  );

  const showError = (message?: string) => {
    defaultNotifier(message ?? 'Something went wrong!', "error");
  };

  return { notify: defaultNotifier, showError };
};
