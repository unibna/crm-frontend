import { ReactNode, createContext, useEffect } from "react";
// hooks
import useLocalStorage from "hooks/useLocalStorage";
// theme
import palette from "theme/palette";
// @type
import {
  ThemeMode,
  ThemeDirection,
  ThemeColor,
  SettingsContextProps,
  ThemeLayout,
} from "_types_/SettingType";
import { defaultSettings } from "constants/index";
// ----------------------------------------------------------------------

const PRIMARY_COLOR = [
  // DEFAULT
  {
    name: "default",
    ...palette.light.primary,
  },
  // PURPLE
  {
    name: "purple",
    lighter: "#EBD6FD",
    light: "#B985F4",
    main: "#7635dc",
    dark: "#431A9E",
    darker: "#200A69",
    contrastText: "#fff",
  },
  // CYAN
  {
    name: "cyan",
    lighter: "#D1FFFC",
    light: "#76F2FF",
    main: "#1CCAFF",
    dark: "#0E77B7",
    darker: "#053D7A",
    contrastText: palette.light.grey[800],
  },
  // BLUE
  {
    name: "blue",
    lighter: "#CCDFFF",
    light: "#6697FF",
    main: "#0045FF",
    dark: "#0027B7",
    darker: "#00137A",
    contrastText: "#fff",
  },
  // ORANGE
  {
    name: "orange",
    lighter: "#FEF4D4",
    light: "#FED680",
    main: "#fda92d",
    dark: "#B66816",
    darker: "#793908",
    contrastText: palette.light.grey[800],
  },
  // RED
  {
    name: "red",
    lighter: "#FFE3D5",
    light: "#FFC1AC",
    main: "#FF3030",
    dark: "#B71833",
    darker: "#7A0930",
    contrastText: "#fff",
  },
  // MATCHA
  {
    name: "matcha",
    lighter: "#7ed1d7",
    light: "#6bcad1",
    main: "#46bdc6",
    dark: "#3faab2",
    darker: "#38979e",
    contrastText: "#fff",
  },
];

function SetColor(themeColor: ThemeColor) {
  let color;
  const DEFAULT = PRIMARY_COLOR[0];
  const PURPLE = PRIMARY_COLOR[1];
  const CYAN = PRIMARY_COLOR[2];
  const BLUE = PRIMARY_COLOR[3];
  const ORANGE = PRIMARY_COLOR[4];
  const RED = PRIMARY_COLOR[5];
  const MATCHA = PRIMARY_COLOR[6];

  switch (themeColor) {
    case "purple":
      color = PURPLE;
      break;
    case "cyan":
      color = CYAN;
      break;
    case "blue":
      color = BLUE;
      break;
    case "orange":
      color = ORANGE;
      break;
    case "red":
      color = RED;
      break;
    case "matcha":
      color = MATCHA;
      break;
    default:
      color = DEFAULT;
  }
  return color;
}

const initialState: SettingsContextProps = {
  ...defaultSettings,
  isOpenModal: false,
  onChangeMode: () => {},
  onChangeDirection: () => {},
  onChangeColor: () => {},
  onToggleStretch: () => {},
  onChangeLayout: () => {},
  onShowModal: () => {},
  onResetSetting: () => {},
  setColor: PRIMARY_COLOR[5],
  colorOption: [],
};

const SettingsContext = createContext(initialState);

type SettingsProviderProps = {
  children: ReactNode;
};

function SettingsProvider({ children }: SettingsProviderProps) {
  const [settings, setSettings] = useLocalStorage("settings", {
    themeMode: initialState.themeMode,
    themeDirection: initialState.themeDirection,
    themeColor: initialState.themeColor,
    themeStretch: initialState.themeStretch,
    themeLayout: initialState.themeLayout,
    isOpenModal: false,
  });

  const onShowModal = (isOpen: boolean) => {
    setSettings({
      ...settings,
      isOpenModal: isOpen,
    });
  };

  const onChangeMode = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeMode: (event.target as HTMLInputElement).value as ThemeMode,
    });
  };

  const onChangeDirection = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeDirection: (event.target as HTMLInputElement).value as ThemeDirection,
    });
  };

  const onChangeColor = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeColor: (event.target as HTMLInputElement).value as ThemeColor,
    });
  };

  const onToggleStretch = () => {
    setSettings({
      ...settings,
      themeStretch: !settings.themeStretch,
    });
  };

  const onChangeLayout = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      themeLayout: (event.target as HTMLInputElement).value as ThemeLayout,
    });
  };

  const onResetSetting = () => {
    setSettings({
      themeMode: initialState.themeMode,
      themeLayout: initialState.themeLayout,
      themeStretch: initialState.themeStretch,
      themeDirection: initialState.themeDirection,
      themeColor: initialState.themeColor,
    });
  };

  return (
    <SettingsContext.Provider
      value={{
        ...settings,
        // Mode
        onChangeMode,
        // Direction
        onChangeDirection,
        // Color
        onChangeColor,
        setColor: SetColor(settings.themeColor),
        colorOption: PRIMARY_COLOR.map((color) => ({
          name: color.name,
          value: color.main,
        })),
        // Stretch
        onToggleStretch,
        // Navbar Horizontal
        onChangeLayout,
        //action setting modal
        onShowModal,
        onResetSetting,
        settings,
        setSettings,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export { SettingsProvider, SettingsContext };
