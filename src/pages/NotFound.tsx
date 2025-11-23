import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { FileQuestion, Home, ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-foreground">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Newspaper Header Style */}
        <div className="border-b-4 border-foreground pb-4 mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-xs font-bold tracking-[0.2em] uppercase">Breaking News</span>
            <span className="h-1 w-1 bg-foreground rounded-full"></span>
            <span className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-black tracking-tighter">
            404
          </h1>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <div className="bg-muted/30 p-6 rounded-lg border border-border">
            <FileQuestion className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-2xl font-bold font-serif mb-2">Page Not Found</h2>
            <p className="text-muted-foreground">
              We apologize, but the article or page you are looking for seems to have been moved, deleted, or never existed.
            </p>
            <div className="mt-4 p-2 bg-background border rounded text-xs font-mono text-muted-foreground break-all">
              Route: {location.pathname}
            </div>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild variant="default" size="lg" className="gap-2">
            <Link to="/">
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="#" onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Link>
          </Button>
        </div>

        {/* Footer */}
        <div className="pt-12 text-xs text-muted-foreground border-t mt-12">
          <p>Monochrome News Flash &copy; {new Date().getFullYear()}</p>
          <p className="mt-1">Journalism in Black & White</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
