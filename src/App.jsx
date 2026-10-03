import {
  EnvelopeSimpleIcon,
  LinkedinLogoIcon,
  PauseIcon,
  PlayIcon,
} from "@phosphor-icons/react";

const roles = [
  {
    marker: "Current",
    company: "OnePay",
    href: "https://www.onepay.com",
    summary: "Leading OnePay Crypto design",
  },
  {
    marker: "2024-2026",
    company: "OKX",
    href: "https://www.okx.com",
    summary: "Built global payments experiences to bridge consumers and web3",
  },
  {
    marker: "2021-2024",
    company: "NFTX",
    href: "https://v2.nftx.io",
    summary:
      "The first NFT liquidity protocol in web3, creating tradable pools for collections",
  },
  {
    marker: "Previously",
    company: "Sprinklr",
    href: "https://www.sprinklr.com",
    summary: "Designed universal search and a new self-serve dashboard experience",
  },
];

const socials = [
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/justinbleich",
    Icon: LinkedinLogoIcon,
  },
  {
    label: "Email",
    href: "mailto:justin.bleich@gmail.com",
    Icon: EnvelopeSimpleIcon,
  },
];

export default function App() {
  return (
    <main className="site-shell" aria-label="Justin Bleich portfolio">
      <a className="world-link" href="/worlds" aria-label="Play the game worlds">
        <svg
          className="pixel-guy"
          viewBox="0 0 10 14"
          shapeRendering="crispEdges"
          aria-hidden="true"
          focusable="false"
        >
          <rect className="px-hair" x="1" y="0" width="8" height="2" />
          <rect className="px-ink" x="1" y="2" width="8" height="4" />
          <rect className="px-eye" x="3" y="3" width="1" height="2" />
          <rect className="px-body" x="1" y="6" width="8" height="5" />
          <rect className="px-ink" x="1" y="7" width="2" height="2" />
          <g className="px-ink px-step-a">
            <rect x="2" y="11" width="2" height="3" />
            <rect x="6" y="11" width="2" height="2" />
          </g>
          <g className="px-ink px-step-b">
            <rect x="2" y="11" width="2" height="2" />
            <rect x="6" y="11" width="2" height="3" />
          </g>
        </svg>
        <span className="world-link-label">Play</span>
      </a>

      <section className="intro" aria-labelledby="page-title">
        <div className="identity">
          <h1 id="page-title">Justin Bleich</h1>
          <p>Product Designer</p>
        </div>

        <div className="work-list" aria-label="Selected work history">
          {roles.map((role) => (
            <article className="work-item" key={role.company}>
              <p className="work-heading">
                <span>{role.marker} → </span>
                <a href={role.href} target="_blank" rel="noreferrer">
                  {role.company}
                </a>
              </p>
              <p className="work-summary">{role.summary}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer" aria-label="Links">
        <nav className="social-links" aria-label="Social links">
          {socials.map((social) => (
            <a
              className="social-link"
              href={social.href}
              key={social.label}
              target={social.href.startsWith("mailto:") ? undefined : "_blank"}
              rel={social.href.startsWith("mailto:") ? undefined : "noreferrer"}
              aria-label={social.label}
              title={social.label}
            >
              <social.Icon size={24} weight="regular" aria-hidden="true" />
            </a>
          ))}
        </nav>

        <a
          className="music-link"
          href="https://open.spotify.com/track/0x8Xe63DSUn8p58vx04bFD?si=e3982ce349454249"
          target="_blank"
          rel="noreferrer"
          aria-label="Listen to Braga Circuit by Le..."
        >
          <span className="player-icons" aria-hidden="true">
            <PlayIcon size={22} weight="regular" />
            <PauseIcon size={22} weight="regular" />
          </span>
          <span>Braga Circuit - Le...</span>
        </a>
      </footer>
    </main>
  );
}
