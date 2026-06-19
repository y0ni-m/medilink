import type { CSSProperties } from 'react';
import type { Audience } from '@/lib/audiences';

type Props = {
  ticket: Audience['ticket'];
  accent: string;
  fileRef: string;
};

/**
 * The signature hero object: a "live referral slip" styled like a clinical
 * requisition / legal docket entry. All motion is CSS (see solutions.css):
 * status pulse, staggered row reveal, and a pulse travelling the mini timeline.
 */
export default function ReferralTicket({ ticket, accent, fileRef }: Props) {
  const style = { '--accent': accent } as CSSProperties;

  return (
    <div className="slip" style={style} aria-hidden="true">
      <div className="slip-perforation" />
      <div className="slip-head">
        <span className="slip-ref">{ticket.ref}</span>
        <span className="slip-status">
          <span className="slip-status-dot" />
          {ticket.status}
        </span>
      </div>

      <div className="slip-meta">{fileRef} · MEDILINK</div>

      <div className="slip-rows">
        {ticket.rows.map((r, i) => (
          <div className="slip-row" style={{ '--i': i } as CSSProperties} key={r.k}>
            <span className="slip-k">{r.k}</span>
            <span className="slip-dots" />
            <span className={`slip-v ${r.check ? 'is-check' : ''}`}>
              {r.check && (
                <svg viewBox="0 0 12 12" fill="none">
                  <path d="M3 6.5l2 2 4-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {r.v}
            </span>
          </div>
        ))}
      </div>

      <div className="slip-timeline">
        <div className="slip-track">
          <div
            className="slip-track-fill"
            style={{ width: `${(ticket.activeStage / (ticket.stages.length - 1)) * 100}%` }}
          />
          <span
            className="slip-pulse"
            style={{ left: `${(ticket.activeStage / (ticket.stages.length - 1)) * 100}%` }}
          />
        </div>
        <div className="slip-stages">
          {ticket.stages.map((s, i) => (
            <span
              key={s}
              className={`slip-stage ${i <= ticket.activeStage ? 'is-done' : ''} ${i === ticket.activeStage ? 'is-active' : ''}`}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="slip-foot">
        <span className="slip-live">
          <span className="slip-live-dot" />
          Updated just now
        </span>
        <span className="slip-barcode" />
      </div>
    </div>
  );
}
