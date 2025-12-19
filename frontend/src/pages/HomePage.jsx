import { Link } from "react-router-dom";

export function HomePage() {
  return (
    <main className="landing-page">
      <section className="hero">
        <div className="hero-background-elements">
          <div className="hero-blur-circle hero-blur-circle-1"></div>
          <div className="hero-blur-circle hero-blur-circle-2"></div>
        </div>

        <div className="hero-content">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            <span>v1.0 is now live</span>
          </div>

          <h1 className="hero-title">
            Organize Work. <br />
            <span className="hero-title-gradient">Visualize Progress.</span>
          </h1>

          <p className="hero-subtitle">
            A modern Kanban board inspired by the best tools in the industry.
            Manage tasks, track progress, and collaborate with your team without
            the clutter.
          </p>

          <div className="hero-actions">
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

          <div className="hero-mockup">
            <div className="hero-mockup-inner">
              <div className="hero-mockup-image">
                <div className="hero-mockup-overlay">
                  <div className="hero-mockup-content">
                    <video
                      src="/assets/videos/hero-mockup.mp4"
                      autoPlay
                      muted
                      loop
                    ></video>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <section className="social-proof"></section> */}

      <section className="features">
        <div className="features-header">
          <span className="features-label">Features</span>
          <h2 className="section-title">
            Everything you need to stay productive
          </h2>
          <p className="features-description">
            We've stripped away the complexity and kept the power. Focus on what
            matters most: shipping work.
          </p>
        </div>

        <div className="features-grid">
          <FeatureCard
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            }
            title="Kanban Boards"
            description="Create flexible boards with lists and cards to model your workflow exactly how you envision it."
          />
          <FeatureCard
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="5 9 2 12 5 15" />
                <polyline points="9 5 12 2 15 5" />
                <polyline points="15 19 12 22 9 19" />
                <polyline points="19 9 22 12 19 15" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="12" y1="2" x2="12" y2="22" />
              </svg>
            }
            title="Drag & Drop"
            description="Move cards smoothly between lists to reflect real progress. It feels natural and responsive."
          />
          <FeatureCard
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
              </svg>
            }
            title="Attachments"
            description="Upload images, PDF specs, and manage attachments directly on the card. Keep context in one place."
          />
          <FeatureCard
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 2H2v10h10V2z" />
                <path d="M22 2h-10v10h10V2z" />
                <path d="M12 12H2v10h10V12z" />
                <path d="M22 12h-10v10h10V12z" />
              </svg>
            }
            title="Labels & Metadata"
            description="Use custom colors, labels, and due dates to organize work visually and never miss a deadline."
          />
          <FeatureCard
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
            }
            title="Lightning Fast"
            description="Optimized for speed with a clean, distraction-free UI. No loading spinners, just instant action."
          />
          <FeatureCard
            icon={
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
            title="Built for Teams"
            description="Designed to scale from personal tasks to team collaboration. Invite members and assign tasks."
          />
        </div>
      </section>

      <section className="benefits">
        <div className="benefits-container">
          <div className="benefits-content">
            <h3 className="benefits-title">Why teams choose Kanbox</h3>
            <div className="benefits-list">
              {[
                "Real-time updates across all devices",
                "99.9% uptime guarantee",
                "Bank-level security and encryption",
                "Export data to CSV/JSON anytime",
              ].map((item, index) => (
                <div key={index} className="benefits-item">
                  <svg
                    className="benefits-check"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <p>{item}</p>
                </div>
              ))}
            </div>
            <Link to="/about" className="benefits-link">
              Learn more about our mission
              <svg
                className="benefits-link-icon"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          </div>
          <div className="benefits-card">
            <div className="benefits-card-glow"></div>
            <div className="benefits-card-content">
              <div className="activity-item">
                <div className="activity-avatar activity-avatar-blue">JD</div>
                <div className="activity-text">
                  <p className="activity-main">
                    John Doe moved{" "}
                    <span className="activity-highlight">
                      "API Integration"
                    </span>{" "}
                    to Done
                  </p>
                  <p className="activity-time">2 minutes ago</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-avatar activity-avatar-purple">AS</div>
                <div className="activity-text">
                  <p className="activity-main">Alice Smith added a comment</p>
                  <p className="activity-time">15 minutes ago</p>
                </div>
              </div>
              <div className="activity-item activity-item-faded">
                <div className="activity-avatar activity-avatar-green">MK</div>
                <div className="activity-text">
                  <p className="activity-main">
                    Mike K. attached "design_v2.fig"
                  </p>
                  <p className="activity-time">1 hour ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <div className="testimonials-background"></div>
        <div className="testimonials-content">
          <h2 className="testimonials-title">Loved by thousands of creators</h2>
          <div className="testimonials-grid">
            {[
              {
                text: "This tool completely changed how our remote team operates. The visual clarity is unmatched.",
                author: "Sarah J.",
                role: "Product Manager",
              },
              {
                text: "Finally, a project management tool that doesn't feel like a chore. Fast, beautiful, and effective.",
                author: "David L.",
                role: "Lead Developer",
              },
              {
                text: "The drag and drop feels incredibly smooth. It's the little details that make this app stand out.",
                author: "Jessica M.",
                role: "Designer",
              },
            ].map((testimonial, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-stars">
                  {[...Array(5)].map((_, j) => (
                    <svg
                      key={j}
                      className="testimonial-star"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="testimonial-text">"{testimonial.text}"</p>
                <div className="testimonial-author">
                  <p className="testimonial-author-name">
                    {testimonial.author}
                  </p>
                  <p className="testimonial-author-role">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta-pattern"></div>
        <div className="cta-content">
          <h2 className="cta-title">Start organizing your work today</h2>
          <p className="cta-description">
            No setup friction. Sign up and create your first board in less than
            2 minutes. Free for individuals.
          </p>
          <div className="cta-actions">
            <Link to="/board" className="btn btn-primary btn-large btn-cta">
              Create Free Account
            </Link>
          </div>
          <p className="cta-note">No credit card required for the free plan.</p>
        </div>
      </section>

      <footer className="footer">
        <p>© {new Date().getFullYear()} Kanbox. All rights reserved.</p>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
}
