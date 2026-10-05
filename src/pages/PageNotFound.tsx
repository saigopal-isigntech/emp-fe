import { Link } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";

function PageNotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 text-center">
      <div className="max-w-md w-full rounded-3xl border border-slate-200/80 bg-white p-8 shadow-xs">
        <div className="h-14 w-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <Compass className="w-7 h-7" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">404</h1>
        <p className="text-sm font-semibold text-slate-700 mt-1">Page Not Found</p>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          The requested page could not be located or may have been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 shadow-2xs shadow-indigo-200 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
}

export default PageNotFound;
