import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <main className="landing-page">
      <header className="landing-header">
        <div className="header-container">
          <Link to="/" className="header-logo">
            <div className="logo-icon">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <path d="M12 4v16" />
              </svg>
            </div>
            <span className="logo-text">Kanbox</span>
          </Link>

          <div className="header-actions">
            <Link to="/login" className="header-link">
              Log in
            </Link>
            <Link to="/board" className="header-btn">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <div className="landing-bg-elements">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        <div className="bg-blob bg-blob-3"></div>
        <div className="bg-grid-overlay"></div>
        <div className="bg-noise-overlay"></div>
      </div>

      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge animate-fade-in-up">
            <span className="hero-badge-ping">
              <span className="hero-badge-ping-dot"></span>
              <span className="hero-badge-ping-ring"></span>
            </span>
            <span>v1.0 is now live</span>
          </div>

          <h1 className="hero-title animate-fade-in-up">
            Organize Work. <br />
            <span className="hero-title-gradient">Visualize Progress.</span>
          </h1>

          <p className="hero-subtitle animate-fade-in-up">
            A modern Kanban board inspired by the best tools in the industry.
            Manage tasks, track progress, and collaborate with your team without
            the clutter.
          </p>

          <div className="hero-actions animate-fade-in-up">
            <Link to="/board" className="btn btn-primary btn-hero">
              Get Started
              <svg
                className="btn-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link to="/board" className="btn btn-secondary btn-hero">
              Demo Board
            </Link>
          </div>

          <div className="hero-mockup animate-fade-in-up">
            <div className="hero-mockup-inner group">
              <div className="hero-mockup-gradient"></div>
              <div className="hero-mockup-content">
                <video
                  src="/assets/videos/hero-mockup.mp4"
                  autoPlay
                  muted
                  loop
                ></video>
                <div className="hero-mockup-overlay">
                  <div className="play-button">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <p>Watch Preview</p>
                </div>
              </div>
              <div className="hero-mockup-grid"></div>
            </div>
          </div>
        </div>
      </section>
      <footer className="footer">
        <p>© {new Date().getFullYear()} Kanbox. All rights reserved.</p>
      </footer>
    </main>
  );
}
