const roles = [
  {
    marker: "Current",
    company: "OKX",
    href: "https://www.okx.com",
    summary: "Building global payments experiences to bridge consumers and web3",
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
    summary:
      "Designed universal search to unify all product verticals and entity types, allowing global orgs to manage their social accounts seamlessly",
  },
];

const socials = [
  {
    label: "Farcaster",
    href: "https://farcaster.xyz/jtb",
    shortLabel: "Fc",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/justinbleich",
    shortLabel: "in",
  },
  {
    label: "Email",
    href: "mailto:justin.bleich@gmail.com",
    shortLabel: "@",
  },
];

export default function App() {
  return (
    <main className="site-shell" aria-label="Justin Bleich portfolio">
      <section className="intro" aria-labelledby="page-title">
        <div className="identity">
          <h1 id="page-title">Justin Bleich</h1>
          <p>Senior Product Designer</p>
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

          <p className="other-work">
            Other:{" "}
            <a href="https://app.frax.finance" target="_blank" rel="noreferrer">
              FRAX
            </a>
            ,{" "}
            <a href="https://paste.so" target="_blank" rel="noreferrer">
              Paste
            </a>
          </p>
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
              {social.shortLabel}
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
          <span className="play-mark" aria-hidden="true" />
          <span>Braga Circuit - Le...</span>
        </a>
      </footer>
    </main>
  );
}
