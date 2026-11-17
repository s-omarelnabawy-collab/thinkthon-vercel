"use client";

import Image from "next/image";
import { useState, type ChangeEvent, type FormEvent } from "react";

import { registrationDeadline } from "./registration-deadline";

type TextFieldName =
  | "name"
  | "email"
  | "phone"
  | "studentId"
  | "batch"
  | "major"
  | "linkedin";

type TextField = {
  name: TextFieldName;
  label: string;
  maxLength: number;
  type?: string;
  autoComplete?: string;
  minLength?: number;
  placeholder?: string;
  optional?: boolean;
};

const contactFields: TextField[] = [
  { name: "name", label: "Full name", maxLength: 120, autoComplete: "name" },
  { name: "email", label: "Email address", maxLength: 254, type: "email", autoComplete: "email" },
  { name: "phone", label: "Phone number", maxLength: 30, minLength: 7, type: "tel", autoComplete: "tel" },
];

const studentFields: TextField[] = [
  { name: "studentId", label: "Student ID", maxLength: 60 },
  { name: "batch", label: "Batch", maxLength: 60 },
  { name: "major", label: "Major", maxLength: 120 },
  { name: "linkedin", label: "LinkedIn profile", maxLength: 500, type: "url", placeholder: "https://www.linkedin.com/in/...", optional: true },
];

const initialValues = {
  name: "",
  email: "",
  phone: "",
  studentId: "",
  batch: "",
  major: "",
  linkedin: "",
  consent: false,
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [values, setValues] = useState(initialValues);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  function updateText(event: ChangeEvent<HTMLInputElement>) {
    const name = event.currentTarget.name as TextFieldName;
    const value = event.currentTarget.value;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function changeStep(nextStep: 1 | 2) {
    setStep(nextStep);
    setError("");
    requestAnimationFrame(() => {
      document.getElementById("register")?.scrollIntoView({ block: "start" });
      document.getElementById("application-heading")?.focus({ preventScroll: true });
    });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step === 1) {
      changeStep(2);
      return;
    }

    setBusy(true);
    setError("");

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, consent: values.consent ? "on" : "" }),
      });
      const result = (await response.json()) as { error?: string; reference?: string };

      if (!response.ok || !result.reference) {
        throw new Error(result.error || "Please try again.");
      }

      setReference(result.reference);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Connection failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const visibleFields = step === 1 ? contactFields : studentFields;

  return (
    <>
      <header className="site-header">
        <div className="header-inner page-width">
          <div className="brand-cluster">
            <a className="brand-home" href="#top" onClick={() => setMenuOpen(false)} aria-label="THINKTHON home">
              <Image className="brand-wordmark" src="/thinkthon-wordmark.png" width={220} height={40} alt="THINKTHON" priority />
            </a>
            <span className="brand-divider" aria-hidden="true" />
            <Image className="header-organizer" src="/ieee-zewail-city-cutout.png" width={150} height={66} alt="IEEE Zewail City Student Branch" priority />
          </div>

          <button
            className="menu-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span /><span /><span />
          </button>

          <nav id="main-navigation" className={`main-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
            <a href="#competition" onClick={() => setMenuOpen(false)}>Competition</a>
            <a href="#schedule" onClick={() => setMenuOpen(false)}>Schedule</a>
            <a href="#prepare" onClick={() => setMenuOpen(false)}>Prepare</a>
            <a className="nav-apply" href="#register" onClick={() => setMenuOpen(false)}>Apply now</a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="hero-content">
              <p className="hero-kicker">THINKTHON 2026</p>
              <h1 id="hero-title"><span>Circuits</span><span>Edition</span></h1>
              <p className="hero-description">An individual circuit analysis competition at Zewail City, organized by IEEE Zewail City Student Branch.</p>
              <div className="hero-actions">
                <a className="button button-primary" href="#register">Apply for the qualifiers</a>
                <div className="hero-deadline"><span>Apply by</span><strong>{registrationDeadline.date}</strong></div>
              </div>
            </div>
          </div>
          <div className="hero-image">
            <Image
              src="/oscilloscope-workbench.png"
              alt="Analog oscilloscope and copper wire on an electronics workbench"
              fill
              priority
              sizes="(max-width: 760px) 100vw, 56vw"
            />
          </div>
        </section>

        <section className="quick-info" aria-label="Competition at a glance">
          <div className="quick-info-inner page-width">
            <article className="quick-round">
              <time dateTime="2026-11-23"><strong>23</strong><span>NOV</span></time>
              <div><h2>Qualifiers</h2><p>Monday · 12–2 PM</p></div>
            </article>
            <article className="quick-round">
              <time dateTime="2026-11-30"><strong>30</strong><span>NOV</span></time>
              <div><h2>Finals</h2><p>Monday · 12–4 PM</p></div>
            </article>
            <div className="quick-review">
              <h2>What to review</h2>
              <ul>
                <li>DC circuit theorems and techniques</li>
                <li>Transient response and impulse response of the capacitors and inductors</li>
                <li>Op amp and active circuits</li>
                <li>Diode electronics circuits</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="competition-section page-width" id="competition">
          <div className="section-intro">
            <p className="section-kicker">The competition</p>
            <h2>Two rounds.<br />One challenge.</h2>
            <p>At Zewail City campus. Room to be announced. All times are Cairo time.</p>
          </div>
          <div className="round-details" id="schedule">
            <article>
              <div className="round-heading"><span>01</span><h3>Qualifiers</h3></div>
              <p className="round-when">Monday, 23 November · 12–2 PM</p>
              <p>After a rules briefing, you’ll answer timed questions on circuit concepts and analysis.</p>
            </article>
            <article>
              <div className="round-heading"><span>02</span><h3>Finals</h3></div>
              <p className="round-when">Monday, 30 November · 12–4 PM</p>
              <p>If you qualify, you’ll return for advanced problems and a final challenge. Results and awards follow score verification.</p>
            </article>
          </div>
        </section>

        <section className="prizes-section" id="prizes" aria-labelledby="prizes-title">
          <div className="prizes-inner page-width">
            <div className="prizes-intro">
              <p className="section-kicker">The awards</p>
              <h2 id="prizes-title">Prize pool</h2>
              <p className="prize-total"><strong>7,000</strong><span>EGP</span></p>
            </div>
            <ol className="prize-list">
              <li><div><h3>First place</h3></div><strong>3,000 <span>EGP</span></strong></li>
              <li><div><h3>Second place</h3></div><strong>2,000 <span>EGP</span></strong></li>
              <li><div><h3>Third place</h3></div><strong>1,000 <span>EGP</span></strong></li>
              <li><div><h3>Junior prize</h3><p>For the first-year student who advances furthest in the competition.</p></div><strong>1,000 <span>EGP</span></strong></li>
            </ol>
          </div>
        </section>

        <section className="prepare-section" id="prepare">
          <div className="prepare-inner page-width">
            <div className="prepare-intro">
              <p className="section-kicker">Be ready for the challenge</p>
              <h2>What to review</h2>
              <p>Practice quick concept checks and problems that take several steps.</p>
            </div>
            <ol className="prepare-list">
              <li><span>01</span><div><h3>DC circuit theorems and techniques</h3></div></li>
              <li><span>02</span><div><h3>Transient response and impulse response of the capacitors and inductors</h3></div></li>
              <li><span>03</span><div><h3>Op amp and active circuits</h3></div></li>
              <li><span>04</span><div><h3>Diode electronics circuits</h3></div></li>
            </ol>
          </div>
        </section>

        <section className="registration-section" id="registration">
          <div className="registration-inner page-width">
            <div className="registration-intro">
              <p className="section-kicker">Your next move</p>
              <h2>Enter the<br />qualifiers.</h2>
              <p>Apply individually by the end of {registrationDeadline.weekday}, {registrationDeadline.date}, Cairo time.</p>
              <p>Save the reference number shown after you submit.</p>
              <div className="registration-date"><span>Applications close</span><strong>22 NOV</strong><span>2026 · Cairo time</span></div>
            </div>

            <div className="application-panel" id="register">
              {reference ? (
                <div className="application-success" role="status">
                  <p className="form-step-label">Registration complete</p>
                  <h3>Application received</h3>
                  <p>Save this reference number for your records.</p>
                  <code>{reference}</code>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <div className="form-topline"><span>Step {step} of 2</span><span>{step === 1 ? "Contact" : "Student details"}</span></div>
                  <div className="form-progress" role="progressbar" aria-label="Application progress" aria-valuemin={1} aria-valuemax={2} aria-valuenow={step}><span style={{ width: `${step * 50}%` }} /></div>
                  <h3 id="application-heading" tabIndex={-1}>Your application</h3>
                  <p className="form-note">{step === 1 ? "Contact details" : "Student details"}</p>

                  <div className="form-fields">
                    {visibleFields.map((field) => (
                      <label key={field.name} htmlFor={field.name}>
                        <span>{field.label}{field.optional && <small> (optional)</small>}</span>
                        <input
                          id={field.name}
                          name={field.name}
                          type={field.type || "text"}
                          autoComplete={field.autoComplete}
                          maxLength={field.maxLength}
                          minLength={field.minLength}
                          placeholder={field.placeholder}
                          value={values[field.name]}
                          onChange={updateText}
                          required={!field.optional}
                        />
                      </label>
                    ))}
                  </div>

                  {step === 2 && (
                    <label className="consent" htmlFor="consent">
                      <input
                        id="consent"
                        name="consent"
                        type="checkbox"
                        checked={values.consent}
                        onChange={(event) => {
                          const checked = event.currentTarget.checked;
                          setValues((current) => ({ ...current, consent: checked }));
                        }}
                        required
                      />
                      <span>I agree to share these details with the THINKTHON organizers for registration and event communication.</span>
                    </label>
                  )}

                  {error && <p className="form-error" role="alert">{error}</p>}
                  <div className="form-actions">
                    {step === 2 && <button className="back-button" type="button" onClick={() => changeStep(1)} disabled={busy}>Back</button>}
                    <button className="button button-primary form-submit" type="submit" disabled={busy}>{step === 1 ? "Continue" : busy ? "Submitting…" : "Submit application"}</button>
                  </div>
                  <p className="form-privacy">For registration and event communication only.</p>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="organizer">
        <div className="footer-inner page-width">
          <a href="#top" aria-label="Back to top"><Image src="/thinkthon-wordmark.png" width={200} height={36} alt="THINKTHON" /></a>
          <div className="footer-organizer"><p>Organized by</p><Image src="/ieee-zewail-city-cutout.png" width={200} height={88} alt="IEEE Zewail City Student Branch" /></div>
        </div>
      </footer>
    </>
  );
}
