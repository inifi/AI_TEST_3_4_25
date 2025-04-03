import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/contexts/ThemeContext";
import NotFound from "@/pages/not-found";
import DashboardPage from "@/pages/DashboardPage";
import ContentCreationPage from "@/pages/ContentCreationPage";
import SchedulerPage from "@/pages/SchedulerPage";
import TrendAnalysisPage from "@/pages/TrendAnalysisPage";
import CommentManagementPage from "@/pages/CommentManagementPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import AdCampaignsPage from "@/pages/AdCampaignsPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={DashboardPage} />
      <Route path="/content-creation" component={ContentCreationPage} />
      <Route path="/scheduler" component={SchedulerPage} />
      <Route path="/trend-analysis" component={TrendAnalysisPage} />
      <Route path="/comment-management" component={CommentManagementPage} />
      <Route path="/analytics" component={AnalyticsPage} />
      <Route path="/ad-campaigns" component={AdCampaignsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <Router />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
