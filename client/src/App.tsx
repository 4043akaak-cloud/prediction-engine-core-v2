import { Switch, Route } from "wouter";
import { PredictionProvider } from "@/contexts/PredictionContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import LayoutWrapper from "@/components/LayoutWrapper";
import Home from "@/pages/Home";
import HowToUse from "@/pages/HowToUse";
import PredictionDiary from "@/pages/PredictionDiary";
import RecipesList from "@/pages/RecipesList";
import RecipeBuilder from "@/pages/RecipeBuilder";
import RecipeDetail from "@/pages/RecipeDetail";
import PredictionResult from "@/pages/PredictionResult";
import NotFound from "@/pages/NotFound";
import Account from "@/pages/Account";
import Labs from "@/pages/Labs";
import About from "@/pages/About";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Contact from "@/pages/Contact";
import Roadmap from "@/pages/Roadmap";
import ChooseYourApproach from "@/pages/ChooseYourApproach";
import RecipeLibrary from "@/pages/RecipeLibrary";
import EngineGarage from "@/pages/EngineGarage";
import EngineGarageDetail from "@/pages/EngineGarageDetail";

export default function App() {
  return (
    <PredictionProvider>
      <ScrollToTop />
      <LayoutWrapper>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/how-to-use" component={HowToUse} />
          <Route path="/diary" component={PredictionDiary} />
          <Route path="/recipes" component={RecipesList} />
          <Route path="/recipe-builder" component={RecipeBuilder} />
          <Route path="/recipes/:id" component={RecipeDetail} />
          <Route path="/result" component={PredictionResult} />
          <Route path="/account" component={Account} />
          <Route path="/labs" component={Labs} />
          <Route path="/about" component={About} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/terms" component={Terms} />
          <Route path="/contact" component={Contact} />
          <Route path="/roadmap" component={Roadmap} />
          <Route path="/choose-approach" component={ChooseYourApproach} />
          <Route path="/recipe-library" component={RecipeLibrary} />
          <Route path="/engine-garage" component={EngineGarage} />
          <Route path="/engines/:id" component={EngineGarageDetail} />
          <Route component={NotFound} />
        </Switch>
      </LayoutWrapper>
    </PredictionProvider>
  );
}
