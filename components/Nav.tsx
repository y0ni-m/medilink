import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">
        <img src="/medilink_color_vertical.svg" alt="MediLink" className="nav-logo-img" />
      </Link>
      <div className="nav-links">
        <Link href="/#audiences">For Clinics</Link>
        <Link href="/#audiences">For Firms</Link>
        <Link href="/#how-it-works">How it works</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/onboarding">Onboarding</Link>
      </div>
      <div className="nav-cta">
        <a className="btn btn-ghost-pill" href="https://app.medilink.vip/login">Sign in</a>
        <a
          className="btn btn-primary"
          href="https://app.medilink.vip/register"
          style={{ backgroundColor: 'rgb(13, 167, 202)' }}
        >
          Request demo
        </a>
      </div>
    </nav>
  );
}
