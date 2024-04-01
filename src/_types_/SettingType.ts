// ----------------------------------------------------------------------

export type ThemeMode = "light" | "dark";
export type ThemeDirection = "rtl" | "ltr";
export type ThemeColor = "default" | "purple" | "cyan" | "blue" | "orange" | "red" | "matcha";
export type ThemeColorPresets = 'default' | 'purple' | 'cyan' | 'blue' | 'orange' | 'red' | "matcha";
export type ThemeLayout = 'vertical' | 'horizontal' | 'vertical_collapsed';
export type ThemeStretch = boolean;

export type SettingsContextProps = {
  isOpenModal: boolean;
  themeMode: ThemeMode;
  themeDirection: ThemeDirection;
  themeColor: ThemeColor;
  themeStretch: boolean;
  themeLayout: ThemeLayout;
  setColor: {
    name: string;
    lighter: string;
    light: string;
    main: string;
    dark: string;
    darker: string;
    contrastText: string;
  };
  colorOption: {
    name: string;
    value: string;
  }[];
  onResetSetting: VoidFunction;
  onChangeMode: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeDirection: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeColor: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeLayout: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleStretch: VoidFunction;
  onShowModal: (isOpen: boolean) => void;
  settings?: any;
  setSettings?: any;
};

export type SettingsValueProps = {
  themeMode: ThemeMode;
  themeDirection: ThemeDirection;
  themeColor: ThemeColorPresets;
  themeStretch: ThemeStretch;
  themeLayout: ThemeLayout;
};
