import type { Metadata } from 'next';
import Footer from '@/components/Footer';
import Nav from '@/components/Nav';
import VientaBooking from '@/components/VientaBooking';

export const metadata: Metadata = {
  title: 'MediLink — Request a demo',
  description:
    'Pick a time and see MediLink live — referrals, LOPs and patient financial responsibility, and case tracking end to end.',
};

export default function DemoPage() {
  return (
    <div className="page">
      <Nav />
      <main className="book" id="book">
        <div className="book-inner">
          <header className="book-head">
            <span className="book-eyebrow">
              <span className="book-eyebrow-dot" />
              Request a demo
            </span>
            <h2 className="book-title">
              Pick a time that <em>works for you</em>.
            </h2>
            <p className="book-sub">
              A 30-minute walkthrough of MediLink live — referrals, LOPs and patient financial
              responsibility, and case tracking end to end.
            </p>
          </header>
          <ul className="book-points">
            <li>Signed agreement and verified attorney before the first visit</li>
            <li>You set the coverage area and the case volume</li>
            <li>Case file attached — no chasing records</li>
          </ul>
          <VientaBooking />
        </div>
      </main>
      <Footer />
    </div>
  );
}
