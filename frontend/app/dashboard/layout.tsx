/**
 * Opts the whole dashboard out of machine translation.
 *
 * Google Translate rewrites text nodes in place, which collides with React's
 * own DOM bookkeeping: any conditionally rendered element — a spinner inside a
 * button is enough — then throws insertBefore or removeChild and takes the
 * page down. Several screens hit this during testing.
 *
 * Doing it here rather than per screen is deliberate, for the same reason the
 * admin guard lives in a layout: a new page cannot forget it. The dashboards
 * show live records (names, references, statuses) that should not be machine
 * translated anyway — the public site is unaffected and still translates.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="notranslate" translate="no">
      {children}
    </div>
  );
}
