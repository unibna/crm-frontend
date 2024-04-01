import RtlLayout from "layouts/RtlLayout";
import { AuthProvider } from "contexts/JWTContext";
import ThemePrimaryColor from "contexts/ThemePrimaryColor";
import ToastProvider from "contexts/ToastContext";
import map from "lodash/map";
import { Provider as ReduxProvider } from "react-redux";
import Router from "routes";
import { store } from "store";
import ThemeConfig from "theme";

const App = () => {
  const listEle = document.querySelectorAll("body > div");
  // fix error cursor col-resize in devexpress
  if (listEle) {
    map(listEle, (item: HTMLElement) => {
      const styleEle = getComputedStyle(item);
      if (
        styleEle.position === "fixed" &&
        styleEle.pointerEvents === "all" &&
        (styleEle.cursor === "col-resize" || styleEle.cursor === "move")
      ) {
        item.style.position = "unset";
      }
    });
  }

  return (
    <>
      <ReduxProvider store={store}>
        <ThemeConfig>
          <ThemePrimaryColor>
            <RtlLayout>
              <AuthProvider>
                <ToastProvider>
                  <Router />
                </ToastProvider>
              </AuthProvider>
            </RtlLayout>
          </ThemePrimaryColor>
        </ThemeConfig>
      </ReduxProvider>
    </>
  );
};

export default App;
