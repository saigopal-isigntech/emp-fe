import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="p-12 text-center">
      <h1 className="text-3xl font-bold text-slate-800">404</h1>
      <p className="text-sm text-slate-500 mt-1">Page Not Found</p>
      <Link
        to="/"
        className="mt-4 inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}

export default PageNotFound;
