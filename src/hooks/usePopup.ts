import { useContext } from 'react';
import { PopupContext, PopupContextProps } from 'contexts/PopupContext';

// ----------------------------------------------------------------------

const usePopup = <T>() => useContext<PopupContextProps<T>>(PopupContext);

export default usePopup;
