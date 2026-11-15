import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { fx, asset } from './fx'
import { affiliations, classroom, loop, now, profile, stack, stats, teaches, work } from './data'

const Stage = lazy(() => import('./gl/Stage'))

gsap.registerPlugin(ScrollTrigger)

const pad = (n: number) => String(n).padStart(2, '0')
const clock = (m: number) => `${pad(Math.floor(m / 60) % 24)}:${pad(Math.floor(m % 60))}`

export default function App() {
  const [glActive, setGlActive] = useState(true)
  const [ready, setReady] = useState(false)
  const clockEl = useRef<HTMLSpanElement>(null)
  const labelEl = useRef<HTMLSpanElement>(null)

  // boot: wait for the 3D stage, with a ceiling so the page never stays locked
  useEffect(() => {
    const t0 = performance.now()
    const done = () => setTimeout(() => setReady(true), Math.max(0, 900 - (performance.now() - t0)))
    window.addEventListener('stage-ready', done, { once: true })
    const cap = setTimeout(() => setReady(true), 7000)
    return () => {
      window.removeEventListener('stage-ready', done)
      clearTimeout(cap)
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('is-ready', ready)
  }, [ready])

  useEffect(() => {
    let lenis: Lenis | undefined
    let raf: ((t: number) => void) | undefined
    if (!fx.reduced) {
      lenis = new Lenis({ lerp: 0.09 })
      lenis.on('scroll', ScrollTrigger.update)
      raf = (t: number) => lenis!.raf(t * 1000)
      gsap.ticker.add(raf)
      gsap.ticker.lagSmoothing(0)
    }

    const onMove = (e: PointerEvent) => {
      fx.mx = (e.clientX / innerWidth) * 2 - 1
      fx.my = (e.clientY / innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const onNav = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]')
      if (!a) return
      const target = document.querySelector<HTMLElement>(a.getAttribute('href')!)
      if (!target) return
      e.preventDefault()
      if (lenis) lenis.scrollTo(target, { duration: 1.6 })
      else target.scrollIntoView()
      target.focus({ preventScroll: true })
    }
    document.addEventListener('click', onNav)

    const ctx = gsap.context(() => {
      const act = { hero: true, globe: false }
      const sync = () => setGlActive(act.hero || act.globe)

      // ── hero: the android turns, then tears apart into the statement
      ScrollTrigger.create({
        trigger: '#hero',
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (s) => ((act.hero = s.isActive), sync()),
      })
      gsap
        .timeline({
          scrollTrigger: {
            trigger: '#hero',
            start: 'top top',
            end: 'bottom bottom',
            scrub: true,
            onUpdate: (s) => (fx.hero = s.progress),
          },
        })
        .to('.hero-name', { '--w': 50, ease: 'none', duration: 0.34 }, 0)
        .to('.hero-a', { autoAlpha: 0, yPercent: -10, ease: 'power1.in', duration: 0.26 }, 0.08)
        .fromTo(
          '.hero-b .ln',
          { autoAlpha: 0, yPercent: 60, '--w': 150 },
          { autoAlpha: 1, yPercent: 0, '--w': 62, ease: 'power2.out', duration: 0.22, stagger: 0.1 },
          0.5,
        )
        .set({}, {}, 1)

      // ── about: the paragraph lights up word by word
      gsap.fromTo(
        '.about-text .w',
        { opacity: 0.14 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: { trigger: '.about-text', start: 'top 82%', end: 'bottom 48%', scrub: true },
        },
      )
      gsap.utils.toArray<HTMLElement>('.stat b').forEach((el) => {
        const end = Number(el.dataset.n)
        if (el.dataset.plain || fx.reduced) return void (el.textContent = String(end))
        const o = { v: 0 }
        gsap.to(o, {
          v: end,
          duration: 1.6,
          ease: 'power3.out',
          onUpdate: () => (el.textContent = String(Math.round(o.v))),
          scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        })
      })

      // ── morning: the illustration drifts against the text
      gsap.fromTo(
        '.morning-art img',
        { yPercent: 8, scale: 1.08 },
        {
          yPercent: -8,
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: '.morning-art', start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )

      // ── the loop: vertical scroll becomes a sideways walk through the cycle
      const mm = gsap.matchMedia()
      mm.add('(min-width: 900px)', () => {
        const track = document.querySelector<HTMLElement>('.loop-track')!
        const dist = () => track.scrollWidth - innerWidth
        gsap.to(track, {
          x: () => -dist(),
          ease: 'none',
          scrollTrigger: {
            trigger: '#loop',
            pin: true,
            scrub: true,
            end: () => '+=' + dist(),
            invalidateOnRefresh: true,
            onUpdate: (s) => gsap.set('.loop-meter i', { scaleX: s.progress }),
          },
        })
      })

      // ── stack: rows slide against each other with the scroll
      gsap.utils.toArray<HTMLElement>('.stack-row .run').forEach((row, i) => {
        gsap.fromTo(
          row,
          { xPercent: i % 2 ? -28 : 0 },
          {
            xPercent: i % 2 ? 0 : -28,
            ease: 'none',
            scrollTrigger: { trigger: '#stack', start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })

      // ── closing scene: the globe rises and turns to Colombo
      ScrollTrigger.create({
        trigger: '#contact',
        start: 'top bottom',
        end: 'bottom bottom',
        onUpdate: (s) => (fx.globe = s.progress),
        onToggle: (s) => ((act.globe = s.isActive || s.progress === 1), sync()),
      })
      gsap.from('.contact-body > *', {
        autoAlpha: 0,
        y: 40,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: { trigger: '#contact', start: 'top 35%', end: '55% bottom', scrub: true },
      })

      // ── the clock: scrolling the page moves through one working day
      const marks = gsap.utils.toArray<HTMLElement>('[data-t]').map((el) => ({
        st: ScrollTrigger.create({ trigger: el, start: 'top 55%' }),
        m: Number(el.dataset.t),
        label: el.dataset.label || '',
      }))
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate: (s) => {
          const y = s.scroll()
          let i = 0
          while (i < marks.length - 1 && y >= marks[i + 1].st.start) i++
          const a = marks[i]
          const b = marks[i + 1]
          const end = b ? b.st.start : ScrollTrigger.maxScroll(window)
          const endM = b ? b.m : 24 * 60
          const k = Math.min(1, Math.max(0, (y - a.st.start) / Math.max(1, end - a.st.start)))
          if (clockEl.current) clockEl.current.textContent = clock(a.m + (endM - a.m) * k)
          if (labelEl.current && labelEl.current.textContent !== a.label) labelEl.current.textContent = a.label
        },
      })
    })

    return () => {
      ctx.revert()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('click', onNav)
      if (raf) gsap.ticker.remove(raf)
      lenis?.destroy()
    }
  }, [])

  return (
    <>
      <Suspense fallback={null}>
        <Stage active={glActive} />
      </Suspense>

      <div className={`boot${ready ? ' is-done' : ''}`} aria-hidden={ready}>
        <span className="boot-ring" />
        <p>
          <span>05:00</span> waking the machine
        </p>
      </div>

      <header className="hud">
        <a className="hud-mark" href="#hero" aria-label="Uditha Landekumbura, back to top">
          UL<i>/</i>26
        </a>
        <nav aria-label="Sections">
          <a href="#about">About</a>
          <a href="#morning">Classroom</a>
          <a href="#loop">Loop</a>
          <a href="#work">Work</a>
          <a href="#contact">Contact</a>
        </nav>
        <p className="hud-clock" aria-hidden="true">
          <span ref={labelEl}>Before the bell</span>
          <span ref={clockEl} className="t">
            05:00
          </span>
          <span>LKT</span>
        </p>
      </header>
      <div className="progress" aria-hidden="true" />

      <main>
        {/* ───────── 05:00 hero ───────── */}
        <section id="hero" className="hero" data-t="300" data-label="Before the bell" tabIndex={-1}>
          <div className="hero-pin">
            <div className="hero-a">
              <p className="eyebrow">
                Uditha2026 <i /> {profile.location} <i /> {profile.coords}
              </p>
              <h1 className="hero-name">
                <span>Uditha</span>
                <span>Landekumbura</span>
              </h1>
              <div className="hero-foot">
                <ul className="roles">
                  {profile.roles.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
                <a className="cue" href="#about">
                  Scroll through the day <span aria-hidden="true">↓</span>
                </a>
              </div>
            </div>
            <p className="hero-b" aria-label="I teach it in the morning. I ship it at night.">
              <span className="ln" aria-hidden="true">
                I teach it in the morning.
              </span>
              <span className="ln amber" aria-hidden="true">
                I ship it at night.
              </span>
            </p>
          </div>
        </section>

        {/* ───────── 06:30 about ───────── */}
        <section id="about" className="about" data-t="390" data-label="First light" tabIndex={-1}>
          <div className="wrap">
            <p className="kicker">
              <b>01</b> Both sides of the desk
            </p>
            <p className="about-text">
              {profile.about.split(' ').map((w, i) => (
                <span className="w" key={i}>
                  {w}{' '}
                </span>
              ))}
            </p>
            <ul className="stats">
              {stats.map((s) => (
                <li className="stat rv" key={s.label}>
                  <b data-n={s.n} data-plain={s.plain ? '1' : undefined}>
                    {s.plain ? s.n : 0}
                  </b>
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
            <dl className="aff">
              {affiliations.map((a) => (
                <div className="rv" key={a.k}>
                  <dt>{a.k}</dt>
                  <dd>{a.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ───────── 08:30 classroom ───────── */}
        <section id="morning" className="morning" data-t="510" data-label="In the classroom" tabIndex={-1}>
          <div className="wrap">
            <header className="sec-head">
              <p className="kicker">
                <b>02</b> 08:30, the morning shift
              </p>
              <h2 className="display">
                The <em>classroom</em>
              </h2>
            </header>

            <div className="morning-grid">
              <figure className="morning-art">
                <img src={asset('img/workshop.webp')} alt="Illustration of a young builder repairing a robot in a workshop, with rockets and the Earth behind them" width={1672} height={941} loading="lazy" />
              </figure>
              <div className="teaches">
                <p className="label">Teaches</p>
                <ul>
                  {teaches.map((t) => (
                    <li className="rv" key={t}>
                      {t}
                    </li>
                  ))}
                </ul>
                <p className="note">
                  Plus robotics and IoT workshops for school students, and AI tool training for teachers.
                </p>
              </div>
            </div>

            <div className="classroom">
              <p className="label">Built for the classroom. The code behind the lectures, kept public.</p>
              <ul>
                {classroom.map((c, i) => (
                  <li className="rv" key={c.topic}>
                    <span className="idx">{pad(i + 1)}</span>
                    <span className="topic">{c.topic}</span>
                    <span className="repos">
                      {c.repos.map((r) => (
                        <a key={r.name} href={r.url} target="_blank" rel="noreferrer">
                          {r.name}
                        </a>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <blockquote className="quote rv">
              <p>“{profile.quote}”</p>
            </blockquote>
          </div>
        </section>

        {/* ───────── 14:00 the loop ───────── */}
        <section id="loop" className="loop" data-t="840" data-label="The loop" tabIndex={-1}>
          <div className="loop-track">
            <div className="panel panel-intro">
              <p className="kicker">
                <b>03</b> 14:00, afternoon
              </p>
              <h2 className="display">
                How the
                <br />
                work <em>loops</em>
              </h2>
              <p className="lede">
                The teaching and the engineering feed each other. This is the shape that takes, every year.
              </p>
            </div>
            {loop.map((s) => (
              <article className="panel step" key={s.n}>
                <span className="num">{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.tag} <span aria-hidden="true">↗</span>
                </a>
              </article>
            ))}
            <div className="panel panel-now">
              <p className="label">Right now</p>
              <dl>
                {now.map((n) => (
                  <div key={n.k}>
                    <dt>{n.k}</dt>
                    <dd>{n.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="loop-meter" aria-hidden="true">
            <i />
          </div>
        </section>

        {/* ───────── 21:00 work ───────── */}
        <section id="work" className="work" data-t="1260" data-label="Shipping" tabIndex={-1}>
          <div className="wrap">
            <header className="sec-head">
              <p className="kicker">
                <b>04</b> 21:00, the night shift
              </p>
              <h2 className="display">
                Selected <em>work</em>
              </h2>
            </header>
            <ol className="work-list">
              {work.map((w, i) => (
                <li className="rv" key={w.title}>
                  <a href={w.url} target="_blank" rel="noreferrer">
                    <span className="idx">{pad(i + 1)}</span>
                    <h3 lang={w.lang}>{w.title}</h3>
                    <p>{w.what}</p>
                    <span className="tags">
                      {w.stack.map((s) => (
                        <i key={s}>{s}</i>
                      ))}
                    </span>
                    <span className="go" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ───────── 23:00 stack ───────── */}
        <section id="stack" className="stack" data-t="1380" data-label="Tools down" tabIndex={-1}>
          <div className="wrap">
            <p className="kicker">
              <b>05</b> Tech I actually ship with
            </p>
          </div>
          {stack.map((row) => (
            <div className="stack-row" key={row.label}>
              <p className="label wrap">{row.label}</p>
              <ul className="run" aria-label={row.label}>
                {[0, 1, 2].flatMap((k) =>
                  row.items.map((it) => (
                    <li key={it + k} aria-hidden={k > 0}>
                      {it}
                    </li>
                  )),
                )}
              </ul>
            </div>
          ))}
        </section>

        {/* ───────── 24:00 contact ───────── */}
        <section id="contact" className="contact" data-t="1425" data-label="Signal out" tabIndex={-1}>
          <div className="contact-pin">
            <div className="contact-body wrap">
              <p className="kicker">
                <b>06</b> Midnight, signal out
              </p>
              <h2 className="display">
                Colombo
                <br />
                <em>to anywhere</em>
              </h2>
              <p className="lede">{profile.contact}</p>
              <a className="mail" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
              <ul className="links">
                <li>
                  <a href={profile.linkedin} target="_blank" rel="noreferrer">
                    LinkedIn <span aria-hidden="true">↗</span>
                  </a>
                </li>
                <li>
                  <a href={profile.github} target="_blank" rel="noreferrer">
                    GitHub <span aria-hidden="true">↗</span>
                  </a>
                </li>
                <li>
                  <a href={profile.blog} target="_blank" rel="noreferrer">
                    fullstackcraft.dev <span aria-hidden="true">↗</span>
                  </a>
                </li>
              </ul>
            </div>
            <footer className="foot wrap">
              <span>© 2026 {profile.name}</span>
              <span>React · Three.js · GSAP · WebGL shaders</span>
              <span>Tomorrow, 08:30, it starts again.</span>
            </footer>
          </div>
        </section>
      </main>
    </>
  )
}
