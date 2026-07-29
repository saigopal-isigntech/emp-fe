import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "100px",
      }}
    >
      <h1>404</h1>

      <h2>Page Not Found</h2>

      <p>
        The page you are looking for doesn't exist.
      </p>

      <br />

      <Link to="/">
        Go to Dashboard
      </Link>
    </div>
  );
}

export default PageNotFound;