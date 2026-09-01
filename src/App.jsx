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
      <div className="floating-friend" aria-hidden="true">
        <svg
          className="friend-svg"
          viewBox="0 0 96 112"
          role="img"
          focusable="false"
        >
          <ellipse className="friend-shadow" cx="48" cy="104" rx="19" ry="5" />

          <g className="friend-body">
            <path
              className="friend-shape"
              d="M12 48 27 17 57 8 83 24 88 55 72 83 42 94 18 76Z"
            />
            <path className="friend-facet friend-facet-top" d="M28 18 47 34 57 8" />
            <path className="friend-facet friend-facet-side" d="M73 27 59 52 88 55" />
            <path className="friend-edge friend-edge-left" d="M25 24 14 48 20 72" />
            <path className="friend-edge friend-edge-right" d="M63 16 80 30 83 53" />
            <g className="friend-face">
              <path className="friend-eye friend-eye-left" d="M34 43 43 40 47 48 38 51Z" />
              <path className="friend-eye friend-eye-right" d="M57 38 66 41 63 50 54 47Z" />
              <path className="friend-mouth" d="M42 64 59 59 56 68" />
            </g>
          </g>
        </svg>
      </div>

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
