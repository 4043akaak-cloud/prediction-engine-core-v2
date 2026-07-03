import { Toaster } from "@/components/ui/sonner";
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
              <TooltipProvider>
                <Toaster />
                <Router />
              </TooltipProvider>
            </DiaryProvider>
          </PredictionProvider>
        </UIProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
