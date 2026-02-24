import { useState } from "react";

const containerBase = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

const Container = ({ className = "", children }) => (
  <div className={`${containerBase} ${className}`.trim()}>{children}</div>
);

const navItems = ["Uy", "Xaqimizda", "Dastur", "FAQ"];

const footerLinks = ["Bosh sahifa", "Haqimizda", "Dastur", "FAQ"];
const appleButtonBase =
  "rounded-full border border-white/70 bg-white/55 text-zinc-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.76),0_10px_24px_rgba(15,23,42,0.12)] backdrop-blur-xl transition";
const applePrimaryButton =
  "rounded-full border border-[#2f63ff] bg-[linear-gradient(180deg,#5a84ff_0%,#2f63ff_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_14px_26px_rgba(25,56,167,0.35)] transition hover:brightness-105";
const appleInput =
  "w-full rounded-full border border-white/70 bg-white/60 px-5 py-3.5 text-base font-medium text-zinc-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl outline-none transition placeholder:text-zinc-500 focus:border-[#7ea4ff] focus:bg-white/78 focus:ring-2 focus:ring-[#8eb0ff]/45 sm:px-6 sm:py-4 sm:text-[17px]";
const appleIconButton =
  "flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/58 text-zinc-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.76),0_8px_22px_rgba(15,23,42,0.12)] backdrop-blur-xl transition hover:bg-white/78 hover:text-zinc-800";
const headerGlassMobileOnly =
  "rounded-full border border-white/70 bg-white/46 shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_16px_32px_rgba(16,24,40,0.14)] backdrop-blur-2xl md:rounded-none md:border-0 md:bg-transparent md:shadow-none md:backdrop-blur-none";
const navListGlassDesktop =
  "hidden items-center gap-1 rounded-full border border-white/45 bg-white/28 p-1.5 shadow-[0_8px_28px_rgba(15,23,42,0.12)] backdrop-blur-xl md:flex";
const mobileMenuPanelGlass =
  "fixed left-4 right-4 top-[84px] z-[140] rounded-3xl border border-white/55 bg-white p-4 shadow-[0_30px_72px_rgba(24,27,36,0.32)] backdrop-blur-[200px] md:hidden";

export default function NAVILanding() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    computer: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen w-full overflow-x-clip font-['Inter','Segoe_UI',sans-serif] text-zinc-900">
      <main>
        <div className="relative overflow-hidden bg-[url('/hero-bg-gradient.png')] bg-cover bg-no-repeat [background-position:center_28px] sm:[background-position:center_2px] lg:[background-position:center_-28px] xl:[background-position:center_-122px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(245,247,255,0.08)_0%,rgba(245,246,251,0.28)_58%,rgba(245,245,247,0.74)_100%)] md:bg-none"
          />

          <header className="fixed inset-x-0 top-3 z-[120] w-full border-b border-white/15   md:top-0 md:border-0 md:bg-transparent md:backdrop-blur-0">
            <Container>
              <nav
                className={`relative flex h-[62px] items-center justify-between gap-3 px-3 sm:h-[66px] sm:px-4 md:h-[74px] md:px-0 lg:h-20 xl:h-24 ${headerGlassMobileOnly}`}
              >
                <img
                  src="/logo-svg.svg"
                  alt="NAVI logo"
                  className="h-4 w-auto sm:h-9"
                />

                <div className={navListGlassDesktop}>
                  {navItems.map((item, i) => (
                    <button
                      key={item}
                      type="button"
                      className={`${appleButtonBase} px-7 py-2.5 text-sm ${
                        i === 0
                          ? "bg-white/84 font-semibold text-zinc-900"
                          : "bg-white/38 font-normal text-zinc-600 hover:bg-white/75 hover:text-zinc-900"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                <div className="hidden items-center gap-3 sm:gap-4 md:flex lg:gap-5">
                  <span className="text-sm font-semibold text-zinc-400 lg:text-[15px]">
                    90 128-09-90
                  </span>
                  <button
                    type="button"
                    className={`${applePrimaryButton} px-4 py-2.5 text-sm font-semibold sm:px-6 lg:px-7`}
                  >
                    Bog&apos;lanish
                  </button>
                </div>

                <button
                  type="button"
                  aria-label="Menu"
                  aria-expanded={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                  className={`${appleIconButton} md:hidden`}
                >
                  <span className="relative h-4 w-5">
                    <span
                      className={`absolute left-0 top-0 h-[2px] w-5 rounded bg-current transition ${
                        isMobileMenuOpen ? "translate-y-[7px] rotate-45" : ""
                      }`}
                    />
                    <span
                      className={`absolute left-0 top-[7px] h-[2px] w-5 rounded bg-current transition ${
                        isMobileMenuOpen ? "opacity-0" : "opacity-100"
                      }`}
                    />
                    <span
                      className={`absolute left-0 top-[14px] h-[2px] w-5 rounded bg-current transition ${
                        isMobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""
                      }`}
                    />
                  </span>
                </button>

                {isMobileMenuOpen ? (
                  <>
                    <button
                      type="button"
                      aria-label="Close menu overlay"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="fixed inset-0 z-[110]  md:hidden"
                    />
                    <div className={mobileMenuPanelGlass}>
                      <div className="space-y-1">
                        {navItems.map((item) => (
                          <a
                            key={item}
                            href="#"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block rounded-full px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-white/75 hover:text-zinc-950"
                          >
                            {item}
                          </a>
                        ))}
                      </div>
                      <div className="mt-3 border-t border-white/60 pt-3">
                        <p className="text-sm font-medium text-zinc-500">
                          90 128-09-90
                        </p>
                        <button
                          type="button"
                          className={`${applePrimaryButton} mt-3 w-full px-4 py-2.5 text-sm font-semibold`}
                        >
                          Bog&apos;lanish
                        </button>
                      </div>
                    </div>
                  </>
                ) : null}
              </nav>
            </Container>
          </header>

          <section className="relative z-10 w-full overflow-hidden pb-10 pt-24 sm:pb-16 sm:pt-24 md:pb-20 md:pt-32 lg:min-h-[58vh] lg:pb-24 lg:pt-36 xl:pt-[250px]">
            <Container className="relative z-10">
              <div className="mx-auto max-w-5xl text-center">
                <h1 className="text-balance text-[34px] font-black leading-[1.2] mb-12 tracking-[-0.03em] text-zinc-950 sm:text-[50px] md:text-[62px] lg:text-[72px] xl:text-[82px]">
                  Farzandingiz kelajagi
                  <br />
                  o&apos;z qo&apos;lingizda!
                </h1>

                <div className="mt-8 flex justify-center sm:mt-10 lg:mt-12">
                  <button
                    type="button"
                    className={`${applePrimaryButton} w-full max-w-[320px] px-8 py-3.5 text-[15px] font-bold sm:w-auto sm:px-12 sm:py-[18px] md:text-[17px] lg:px-16 lg:py-5`}
                  >
                    Bepul darsga yozilish
                  </button>
                </div>
              </div>
            </Container>
          </section>
        </div>

        <div className="relative w-full overflow-hidden bg-[url('/footer-bg-gradient.png')] bg-cover bg-no-repeat [background-position:center_top]">
          <section className="relative w-full overflow-hidden  pt-10 pb-14 sm:pt-[400px] sm:pb-16 lg:pt-16 lg:pb-20">
            <img
              src="/shape.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute -right-3 top-12 w-24 rotate-[-16deg] opacity-55 sm:-right-12 sm:top-4 sm:w-36 md:w-48 lg:-right-10 lg:top-12 lg:w-60"
            />
            <img
              src="/startsvg.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute  bottom-12 w-40 opacity-60 sm:-left-8 sm:bottom-6 sm:w-28 md:w-36 lg:-left-2 lg:bottom-10 lg:w-52"
            />

            <Container className="relative z-10">
              <div className="mx-auto w-full max-w-[660px]">
                <h2 className="mb-7 flex flex-col items-center justify-center gap-2 text-center text-[28px] font-semibold leading-[1.15] text-zinc-800 sm:mb-9 sm:text-[38px] lg:mb-10 lg:text-[42px]">
                  Birimchi qadam BEPUL dars{" "}
                  <span className="text-sm font-medium text-zinc-500 sm:text-lg">
                    Joylar soni chegaralanga!
                  </span>
                </h2>

                <form
                  className="space-y-4 sm:space-y-5 lg:space-y-6"
                  action="#"
                  method="post"
                >
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-800 sm:text-base">
                      Ismingiz
                    </label>
                    <input
                      name="name"
                      placeholder="Ahmad"
                      value={formData.name}
                      onChange={handleChange}
                      className={appleInput}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-800 sm:text-base">
                      Farzandingiz necha yoshda?
                    </label>
                    <input
                      name="age"
                      placeholder="12"
                      value={formData.age}
                      onChange={handleChange}
                      className={appleInput}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-800 sm:text-base">
                      Kompyuteri bormi
                    </label>
                    <input
                      name="computer"
                      placeholder="bor/yo'q"
                      value={formData.computer}
                      onChange={handleChange}
                      className={appleInput}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-800 sm:text-base">
                      Telefon raqamingiz
                    </label>
                    <input
                      name="phone"
                      placeholder="93-232-88-58"
                      value={formData.phone}
                      onChange={handleChange}
                      className={appleInput}
                    />
                  </div>

                  <button
                    type="submit"
                    className={`${applePrimaryButton} mt-2 w-full px-6 py-3.5 text-base font-bold sm:py-4 lg:py-[18px]`}
                  >
                    Yuborish
                  </button>
                </form>
              </div>
            </Container>
          </section>

          <section className="w-full pb-14 pt-6 sm:pb-20 sm:pt-10 lg:pb-24">
            <Container>
              <div className="rounded-[30px]  bg-white/36 px-5 py-8 shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_20px_45px_rgba(19,26,41,0.14)] backdrop-blur-2xl sm:rounded-[36px] md:backdrop-blur-none sm:px-8 sm:py-10 lg:px-12 lg:py-12 xl:px-14 xl:py-14">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-14">
                  <div className="mx-auto max-w-md text-center lg:mx-0 lg:max-w-sm lg:text-left">
                    <img
                      src="/logo-svg.svg"
                      alt="NAVI logo"
                      className="mx-auto h-8 w-auto lg:mx-0"
                    />
                    <p className="mt-4 text-sm leading-6 text-zinc-600 lg:mt-5">
                      Farzandingizning kelajagini bugundan shakllantiring. Bepul
                      diagnostika darsiga yoziing va bolangiz qaysi
                      yo&apos;nalishga mosligini aniqlang.
                    </p>
                    <p className="mt-6 flex items-center justify-center gap-1 text-xs text-zinc-600 lg:mt-8 lg:justify-start">
                      <span>♡</span> NAVI - kelajak kasblariga tayyorlov tizimi.
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-6 lg:items-end lg:gap-10">
                    <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 lg:justify-end lg:gap-x-8">
                      {footerLinks.map((link) => (
                        <a
                          key={link}
                          href="#"
                          className="text-sm text-zinc-600 transition hover:text-zinc-800"
                        >
                          {link}
                        </a>
                      ))}
                    </div>

                    <div className="flex gap-2 lg:mt-6">
                      <button
                        type="button"
                        className={appleIconButton}
                        aria-label="Instagram"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="2"
                            y="2"
                            width="20"
                            height="20"
                            rx="5"
                            ry="5"
                          />
                          <circle cx="12" cy="12" r="4" />
                          <circle
                            cx="17.5"
                            cy="6.5"
                            r="1"
                            fill="currentColor"
                            stroke="none"
                          />
                        </svg>
                      </button>

                      <button
                        type="button"
                        className={appleIconButton}
                        aria-label="Telegram"
                      >
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="22" y1="2" x2="11" y2="13" />
                          <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        </div>
      </main>
    </div>
  );
}
