"use client";

import { useState, type FormEvent } from "react";

import { registrationDeadline } from "./registration-deadline";

const fields = [
  { name: "name", label: "Full name", autoComplete: "name", maxLength: 120 },
  { name: "email", label: "Email address", type: "email", autoComplete: "email", maxLength: 254 },
  { name: "phone", label: "Phone number", type: "tel", autoComplete: "tel", minLength: 7, maxLength: 30 },
  { name: "studentId", label: "Student ID", maxLength: 60 },
  { name: "batch", label: "Batch", maxLength: 60 },
  { name: "major", label: "Major", maxLength: 120 },
  { name: "linkedin", label: "LinkedIn", type: "url", maxLength: 500, optional: true, placeholder: "https://www.linkedin.com/in/..." },
];

export default function Home() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))),
      });
      const result = await response.json() as { error?: string; reference: string };
      if (!response.ok) throw new Error(result.error || "Please try again.");
      setReference(result.reference);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Connection failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <header className="masthead">
        <div className="wrap masthead-inner">
          <a href="#top"><img className="wordmark" src="/thinkthon-wordmark.png" width="190" height="34" alt="THINKTHON" /></a>
          <nav aria-label="Main navigation">
            <a className="format-link" href="#competition">Competition</a>
            <a href="#register">Apply</a>
          </nav>
        </div>
      </header>
      <main id="top">
        <section className="hero" aria-labelledby="headline">
          <img className="outline" src="/thinkthon-on-outline.png" alt="" />
          <div className="wrap hero-inner">
            <p className="meta">THINKTHON 2026</p>
            <h1 id="headline">Circuits Edition</h1>
            <p className="hero-copy">An individual circuit analysis competition at Zewail City, organized by IEEE Zewail City Student Branch.</p>
            <div className="hero-actions">
              <a className="button" href="#register">Apply for the qualifiers</a>
              <span>Apply by {registrationDeadline.date}</span>
            </div>
          </div>
        </section>

        <section className="wrap competition" id="competition">
          <div className="competition-heading">
            <h2>Schedule and format</h2>
            <p>Zewail City campus · Room to be announced · Cairo time</p>
          </div>
          <div className="rounds">
            <article>
              <p className="round-date"><time dateTime="2026-11-23">Monday, 23 November</time><br />12–2 PM</p>
              <div>
                <h3>Qualifiers</h3>
                <p>After a rules briefing, you’ll answer timed questions on circuit concepts and analysis.</p>
              </div>
            </article>
            <article>
              <p className="round-date"><time dateTime="2026-11-30">Monday, 30 November</time><br />12–2 PM · May extend to 4 PM</p>
              <div>
                <h3>Finals</h3>
                <p>If you qualify, you’ll return for advanced problems and a final challenge. Results and awards follow score verification.</p>
              </div>
            </article>
          </div>
          <div className="preparation">
            <div><h3>What to review</h3><p>Practice quick concept checks and problems that take several steps.</p></div>
            <ul>
              <li><strong>Ohm’s law and Kirchhoff’s laws</strong><span>Relate voltage, current, and resistance. Apply the junction and loop rules.</span></li>
              <li><strong>Resistor networks and circuit simplification</strong><span>Recognize series and parallel combinations and find equivalent resistance.</span></li>
              <li><strong>Basic nodal and mesh analysis</strong><span>Choose a reference node or mesh currents and set up the equations.</span></li>
            </ul>
          </div>
        </section>

        <section className="registration" id="register">
          <div className="wrap register-grid">
            <div>
              <h2>Register for the qualifying round</h2>
              <p>Apply individually by the end of {registrationDeadline.weekday}, {registrationDeadline.date}, Cairo time.</p>
              <p>Save the reference number shown after you submit.</p>
            </div>
            <div className="form-card">
              {reference ? (
                <div role="status">
                  <h3>Application received</h3>
                  <p>Your reference number</p>
                  <code>{reference}</code>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <h3>Your application</h3>
                  <p className="form-note">All fields are required except LinkedIn.</p>
                  {[
                    { title: "Contact details", entries: fields.slice(0, 3) },
                    { title: "Student details", entries: fields.slice(3, 6) },
                    { title: "Profile", entries: fields.slice(6) },
                  ].map(({ title, entries }) => (
                    <fieldset key={title} className="fields">
                      <legend>{title}</legend>
                      {entries.map(({ label, optional, ...input }) => (
                        <label key={input.name} htmlFor={input.name} className={optional ? "wide" : undefined}>
                          {label}{optional && <span> (optional)</span>}
                          <input {...input} id={input.name} required={!optional} />
                        </label>
                      ))}
                    </fieldset>
                  ))}
                  <label className="consent">
                    <input type="checkbox" name="consent" required />
                    <span>I agree to share these details with the THINKTHON organizers for registration and event communication.</span>
                  </label>
                  {error && <p role="alert" className="error">{error}</p>}
                  <button type="submit" className="button" disabled={busy}>
                    {busy ? "Submitting…" : "Submit application"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <footer><div className="wrap footer-inner">
        <a href="#top"><img className="wordmark" src="/thinkthon-wordmark.png" width="190" height="34" alt="THINKTHON" /></a>
        <div className="organizer">
          <img src="/ieee-zewail-city.png" width="88" height="88" alt="" loading="lazy" />
          <p>Organized by <strong>IEEE Zewail City Student Branch</strong></p>
        </div>
      </div></footer>
    </>
  );
}
