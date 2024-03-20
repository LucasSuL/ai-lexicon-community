export default function Header() {
  return (
    <header>
      <div className="container d-flex align-items-center justify-content-between p-3 mt-2">
        <div className="d-flex align-items-center">
          <img src="./logo.png" className="ms-0 logo me-3" />
          <p className="fw-bold text-dark m-0 fs-4 text-uppercase">
          AI Lexicon Community 
          </p>
        </div>
      </div>
    </header>
  );
}
