import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ChevronRight } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-sm">PQ</span>
            </div>
            <span className="font-semibold">PlotIQ</span>
          </Link>
        </div>
      </nav>

      {/* 404 Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div className="text-center">
          <div className="mb-8">
            <div className="inline-block">
              <div className="text-6xl sm:text-8xl font-bold gradient-text">404</div>
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Page Not Found</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            We couldn't find the page you're looking for. It might have been moved or deleted.
          </p>

          <div className="flex gap-4 justify-center flex-col sm:flex-row">
            <Link to="/">
              <Button className="gap-2 w-full sm:w-auto">
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
            <Link to="/analyzer">
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                Go to Analyzer
                <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
