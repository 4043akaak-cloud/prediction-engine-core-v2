import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PredictionProvider } from "./contexts/PredictionContext";
import { DiaryProvider } from "./contexts/DiaryContext";
import { UIProvider } from "./contexts/UIContext";
import Home from "./pages/Home";
import PredictionInput from "./pages/PredictionInput";
import PredictionResult from "./pages/PredictionResult";
import PredictionDiary from "./pages/PredictionDiary";
import PredictionDetail from "./pages/PredictionDetail";
import NotFound from "@/pages/NotFound";
import RecipeList from "./pages/RecipeList";
import RecipeDetail from "./pages/RecipeDetail";
import Settings from "./pages/Settings";
import { SettingsProvider } from "./contexts/SettingsContext";
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";
import Tools from "./pages/Tools";
import Learn from "./pages/Learn";
import SignIn from "./pages/SignIn";
import GitHub from "./pages/GitHub";
import EngineLibrary from "./pages/EngineLibrary";
import EngineDetail from "./pages/EngineDetail";
import CategoryDetail from "./pages/CategoryDetail";
import AdminPanel from "./pages/AdminPanel";
import AdminUsers from "./pages/AdminUsers";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/predict"} component={PredictionInput} />
      <Route path={"/result"} component={PredictionResult} />
      <Route path={"/diary"} component={PredictionDiary} />
      <Route path={"/detail/:id"} component={PredictionDetail} />
      <Route path={"/recipes"} component={RecipeList} />
      <Route path={"/recipes/:id"} component={RecipeDetail} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/about"} component={About} />
      <Route path={"/privacy"} component={Privacy} />
      <Route path={"/terms"} component={Terms} />
      <Route path={"/contact"} component={Contact} />
      <Route path={"/tools"} component={Tools} />
      <Route path={"/learn"} component={Learn} />
      <Route path={"/signin"} component={SignIn} />
      <Route path={"/github"} component={GitHub} />
      <Route path={"/engines"} component={EngineLibrary} />
      <Route path={"/engines/:id"} component={EngineDetail} />
      <Route path={"/engines/category/:name"} component={CategoryDetail} />
      <Route path={"/admin"} component={AdminPanel} />
      <Route path={"/admin/users"} component={AdminUsers} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <UIProvider>
          <PredictionProvider>
            <DiaryProvider>
              <SettingsProvider>
                <TooltipProvider>
                  <Toaster />
                  <Router />
                </TooltipProvider>
              </SettingsProvider>
            </DiaryProvider>
          </PredictionProvider>
        </UIProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
