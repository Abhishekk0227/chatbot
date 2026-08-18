import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import Chatbot from "@/components/Chatbot";

// Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Training from "@/pages/Training";
import Services from "@/pages/Services";
import Projects from "@/pages/Projects";
import Industries from "@/pages/Industries";
import Media from "@/pages/Media";
import Blog from "@/pages/Blog";
import InnovationLab from "@/pages/InnovationLab";
import Contact from "@/pages/Contact";
import Login from "@/pages/Login";
import Admin from "@/pages/Admin";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  const [location] = useLocation();
  const isAdminOrLogin = location === "/login" || location === "/admin";

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminOrLogin && <Navbar />}
      <div className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/training" component={Training} />
          <Route path="/services" component={Services} />
          <Route path="/projects" component={Projects} />
          <Route path="/industries" component={Industries} />
          <Route path="/media" component={Media} />
          <Route path="/blog" component={Blog} />
          <Route path="/innovation-lab" component={InnovationLab} />
          <Route path="/contact" component={Contact} />
          <Route path="/login" component={Login} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </div>
      {!isAdminOrLogin && <Chatbot />}
      {!isAdminOrLogin && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <ScrollToTop />
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
