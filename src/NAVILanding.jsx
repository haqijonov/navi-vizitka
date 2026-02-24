import { useRef, useState } from "react";

const containerBase = "mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8";

const Container = ({ className = "", children }) => (
  <div className={`${containerBase} ${className}`.trim()}>{children}</div>
);

const navItems = ["Uy", "Haqimizda", "Dastur", "FAQ"];
const NAVI_WEBSITE_URL = "https://www.naviglobal.uz/";
const NAVI_PHONE_HREF = "tel:+998901280990";
const NAVI_PHONE_LABEL = "90 128-09-90";
const NAVI_INSTAGRAM_URL = "https://www.instagram.com/navi_global";
const NAVI_TELEGRAM_URL = "https://t.me/navi_edu";

const footerLinks = ["Bosh sahifa", "Haqimizda", "Dastur", "FAQ"];
const appleButtonBase =
  "rounded-full border border-white/70 bg-white/55 text-zinc-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.76),0_10px_24px_rgba(15,23,42,0.12)] backdrop-blur-xl transition";
const applePrimaryButton =
  "rounded-full border border-[#2f63ff] bg-[linear-gradient(180deg,#5a84ff_0%,#2f63ff_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_14px_26px_rgba(25,56,167,0.35)] transition hover:brightness-105";
const floatingInputBase =
  "peer w-full rounded-full border border-white/70 bg-white/60 px-5 pb-2.5 pt-6 text-base font-medium text-zinc-800 shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_10px_24px_rgba(15,23,42,0.08)] backdrop-blur-xl outline-none transition-all duration-200 placeholder-transparent focus:border-[#7ea4ff] focus:bg-white/78 focus:ring-2 focus:ring-[#8eb0ff]/45 sm:px-6 sm:text-[17px]";
const floatingLabelBase =
  "pointer-events-none absolute left-5 top-3 text-xs font-medium text-zinc-500 transition-all duration-200 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-sm peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-zinc-600 sm:left-6";
const floatingSelectLabelBase =
  "pointer-events-none absolute left-5 text-zinc-500 transition-all duration-200 sm:left-6";
const subtleFieldError = "px-2 pt-1 text-xs font-medium text-rose-500";
const appleIconButton =
  "flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/58 text-zinc-600 shadow-[inset_0_1px_0_rgba(255,255,255,0.76),0_8px_22px_rgba(15,23,42,0.12)] backdrop-blur-xl transition hover:bg-white/78 hover:text-zinc-800";
const headerGlassMobileOnly =
  "rounded-full border border-white/70 bg-white/46 shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_16px_32px_rgba(16,24,40,0.14)] backdrop-blur-2xl md:rounded-none md:border-0 md:bg-transparent md:shadow-none md:backdrop-blur-none";
const navListGlassDesktop =
  "hidden items-center gap-1 rounded-full border border-white/45 bg-white/28 p-1.5 shadow-[0_8px_28px_rgba(15,23,42,0.12)] backdrop-blur-xl md:flex";
const mobileMenuPanelGlass =
  "fixed left-4 right-4 top-[84px] z-[140] rounded-3xl border border-white/55 bg-white p-4 shadow-[0_30px_72px_rgba(24,27,36,0.32)] backdrop-blur-[200px] md:hidden";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(
  /\/$/,
  "",
);
const LEAD_API_URL = API_BASE_URL
  ? `${API_BASE_URL}/api/amo/lead`
  : "/api/amo/lead";
const initialFormData = {
  name: "",
  age: "",
  computer: "",
  phone: "",
};

export default function NAVILanding() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const phoneInputRef = useRef(null);
  const formSectionRef = useRef(null);
  const [formData, setFormData] = useState(initialFormData);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState({
    type: "idle",
    message: "",
  });

  const clearSubmitState = () => {
    setSubmitState((prev) => {
      if (prev.type === "idle") {
        return prev;
      }
      return { type: "idle", message: "" };
    });
  };

  const clearFieldError = (fieldName) => {
    setFieldErrors((prev) => {
      if (!prev[fieldName]) {
        return prev;
      }
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearFieldError(name);
    clearSubmitState();
  };

  const handlePhoneChange = (e) => {
    const localDigits = e.target.value.replace(/\D/g, "").slice(0, 9);
    setFormData((prev) => ({ ...prev, phone: localDigits }));
    clearFieldError("phone");
    clearSubmitState();
  };

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const mapServerErrorsToFields = (errors = {}) => {
    const mappedErrors = {};

    if (errors.name) {
      mappedErrors.name = "Ism kamida 2 ta harfdan iborat bo'lishi kerak";
    }
    if (errors.age) {
      mappedErrors.age = "Yosh 10-17 oralig'ida bo'lishi kerak";
    }
    if (errors.hasComputer) {
      mappedErrors.computer = "Kompyuter bor yoki yo'qligini tanlang";
    }
    if (errors.phone) {
      mappedErrors.phone = "Telefon raqam formati noto'g'ri";
    }

    return mappedErrors;
  };

  const getUtmParams = () => {
    const params = new URLSearchParams(window.location.search);
    const utmFields = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
    ];

    return utmFields.reduce((acc, key) => {
      const value = params.get(key);
      if (value) {
        acc[key] = value;
      }
      return acc;
    }, {});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Ismingizni kiriting";
    }
    if (!formData.age.trim()) {
      nextErrors.age = "Yoshni kiriting";
    }
    if (!formData.computer.trim()) {
      nextErrors.computer = "Javobni kiriting";
    }
    if (!formData.phone) {
      nextErrors.phone = "Telefon raqamingizni kiriting";
    } else if (formData.phone.length !== 9) {
      nextErrors.phone = "Raqam to'liq emas";
    }

    if (Object.keys(nextErrors).length > 0) {
      setFieldErrors(nextErrors);
      setSubmitState({
        type: "error",
        message: "Ma'lumotlarni tekshirib, qayta yuboring",
      });
      return;
    }

    setFieldErrors({});
    clearSubmitState();
    setIsSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      age: Number(formData.age),
      hasComputer: formData.computer === "ha",
      phone: `+998${formData.phone}`,
      pageUrl: window.location.href,
      utm: getUtmParams(),
    };

    try {
      const response = await fetch(LEAD_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let result = null;
      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok) {
        const backendFieldErrors = mapServerErrorsToFields(result?.errors);
        if (Object.keys(backendFieldErrors).length > 0) {
          setFieldErrors(backendFieldErrors);
        }

        setSubmitState({
          type: "error",
          message:
            result?.message ||
            "Yuborishda xatolik yuz berdi. Qayta urinib ko'ring",
        });
        return;
      }

      setFormData(initialFormData);
      setSubmitState({
        type: "success",
        message: "Arizangiz muvaffaqiyatli yuborildi",
      });
    } catch {
      setSubmitState({
        type: "error",
        message:
          "Server bilan bog'lanib bo'lmadi. Backend ishga tushganini tekshiring",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-clip font-['Inter','Segoe_UI',sans-serif] text-zinc-900">
      <main>
        <div className="relative overflow-hidden bg-[url('/hero-bg-gradient.png')] bg-cover bg-no-repeat [background-position:center_28px] sm:[background-position:center_2px] lg:[background-position:center_-128px] xl:[background-position:center_-160px]">
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
                  src="/Logo.svg"
                  alt="NAVI logo"
                  className="h-4 w-auto sm:h-9"
                />

                <div className={navListGlassDesktop}>
                  {navItems.map((item, i) => (
                    <a
                      key={item}
                      href={NAVI_WEBSITE_URL}
                      className={`${appleButtonBase} px-7 py-2.5 text-sm ${
                        i === 0
                          ? "bg-white/84 font-semibold text-zinc-900"
                          : "bg-white/38 font-normal text-zinc-600 hover:bg-white/75 hover:text-zinc-900"
                      }`}
                    >
                      {item}
                    </a>
                  ))}
                </div>

                <div className="hidden items-center gap-3 sm:gap-4 md:flex lg:gap-5">
                  <a
                    href={NAVI_PHONE_HREF}
                    className="text-sm font-semibold text-zinc-400 transition hover:text-zinc-600 lg:text-[15px]"
                  >
                    {NAVI_PHONE_LABEL}
                  </a>
                  <a
                    href={NAVI_PHONE_HREF}
                    className={`${applePrimaryButton} px-4 py-2.5 text-sm font-semibold sm:px-6 lg:px-7`}
                  >
                    Bog&apos;lanish
                  </a>
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
                            href={NAVI_WEBSITE_URL}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="block rounded-full px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-white/75 hover:text-zinc-950"
                          >
                            {item}
                          </a>
                        ))}
                      </div>
                      <div className="mt-3 border-t border-white/60 pt-3">
                        <a
                          href={NAVI_PHONE_HREF}
                          className="text-sm font-medium text-zinc-500 transition hover:text-zinc-700"
                        >
                          {NAVI_PHONE_LABEL}
                        </a>
                        <a
                          href={NAVI_PHONE_HREF}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`${applePrimaryButton} mt-3 block w-full px-4 py-2.5 text-center text-sm font-semibold`}
                        >
                          Bog&apos;lanish
                        </a>
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
                <h1 className="text-balance text-[34px] font-black leading-[1.2] mb-12 pt-[50px] md:pt-0 tracking-[-0.03em] text-zinc-950 sm:text-[50px] md:text-[62px] lg:text-[72px] xl:text-[82px]">
                  Telefon farzandingiz kelajagini boshqarmasin!
                </h1>

                <div className="mt-8 flex justify-center sm:mt-10 lg:mt-12">
                  <button
                    type="button"
                    onClick={scrollToForm}
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
          <section
            ref={formSectionRef}
            className="relative w-full overflow-hidden  pt-10 pb-14 sm:pt-[400px] sm:pb-16 lg:pt-16 lg:pb-20"
          >
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
                  Birinchi qadam — bepul dars
                  <span className="text-sm font-medium text-zinc-500 sm:text-lg">
                    Joylar soni chegaralanga!
                  </span>
                </h2>

                <form
                  className="space-y-4 sm:space-y-5 lg:space-y-6"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className="space-y-1.5">
                    <div className="relative">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder=" "
                        value={formData.name}
                        onChange={handleChange}
                        required
                        aria-invalid={Boolean(fieldErrors.name)}
                        aria-describedby={
                          fieldErrors.name ? "name-error" : undefined
                        }
                        className={`${floatingInputBase} ${
                          fieldErrors.name
                            ? "border-rose-300/80 focus:border-rose-400 focus:ring-rose-300/40"
                            : ""
                        }`}
                      />
                      <label
                        htmlFor="name"
                        className={`${floatingLabelBase} ${
                          fieldErrors.name
                            ? "text-rose-500 peer-focus:text-rose-500"
                            : ""
                        }`}
                      >
                        Ismingiz
                      </label>
                    </div>
                    {fieldErrors.name ? (
                      <p id="name-error" className={subtleFieldError}>
                        {fieldErrors.name}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-1.5">
                    <div className="relative">
                      <select
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        aria-invalid={Boolean(fieldErrors.age)}
                        aria-describedby={
                          fieldErrors.age ? "age-error" : undefined
                        }
                        className={`${floatingInputBase} appearance-none pr-12 ${
                          !formData.age ? "text-zinc-500" : "text-zinc-800"
                        } ${
                          fieldErrors.age
                            ? "border-rose-300/80 focus:border-rose-400 focus:ring-rose-300/40"
                            : ""
                        }`}
                      >
                        <option value=""> </option>
                        {Array.from({ length: 8 }, (_, index) => {
                          const ageOption = String(index + 10);
                          return (
                            <option
                              key={ageOption}
                              value={ageOption}
                              className="text-zinc-800"
                            >
                              {ageOption}
                            </option>
                          );
                        })}
                      </select>
                      <label
                        htmlFor="age"
                        className={`${floatingSelectLabelBase} ${
                          formData.age
                            ? "top-3 translate-y-0 text-xs"
                            : "top-1/2 -translate-y-1/2 text-sm"
                        } peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-zinc-600 ${
                          fieldErrors.age
                            ? "text-rose-500 peer-focus:text-rose-500"
                            : ""
                        }`}
                      >
                        Farzandingiz necha yoshda?
                      </label>
                      <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 sm:right-6">
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
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </span>
                    </div>
                    {fieldErrors.age ? (
                      <p id="age-error" className={subtleFieldError}>
                        {fieldErrors.age}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-1.5">
                    <div className="relative">
                      <select
                        id="computer"
                        name="computer"
                        value={formData.computer}
                        onChange={handleChange}
                        required
                        aria-invalid={Boolean(fieldErrors.computer)}
                        aria-describedby={
                          fieldErrors.computer ? "computer-error" : undefined
                        }
                        className={`${floatingInputBase} appearance-none pr-12 ${
                          !formData.computer ? "text-zinc-500" : "text-zinc-800"
                        } ${
                          fieldErrors.computer
                            ? "border-rose-300/80 focus:border-rose-400 focus:ring-rose-300/40"
                            : ""
                        }`}
                      >
                        <option value=""> </option>
                        <option value="ha" className="text-zinc-800">
                          Ha
                        </option>
                        <option value="yoq" className="text-zinc-800">
                          Yo&apos;q
                        </option>
                      </select>
                      <label
                        htmlFor="computer"
                        className={`${floatingSelectLabelBase} ${
                          formData.computer
                            ? "top-3 translate-y-0 text-xs"
                            : "top-1/2 -translate-y-1/2 text-sm"
                        } peer-focus:top-3 peer-focus:translate-y-0 peer-focus:text-xs peer-focus:text-zinc-600 ${
                          fieldErrors.computer
                            ? "text-rose-500 peer-focus:text-rose-500"
                            : ""
                        }`}
                      >
                        Kompyuteri bormi
                      </label>
                      <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 sm:right-6">
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
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </span>
                    </div>
                    {fieldErrors.computer ? (
                      <p id="computer-error" className={subtleFieldError}>
                        {fieldErrors.computer}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-1.5">
                    <div
                      className="relative"
                      onClick={() => phoneInputRef.current?.focus()}
                    >
                      <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 z-100 text-base font-semibold text-think-700 sm:left-6 sm:text-[17px]">
                        +998
                      </span>
                      <input
                        id="phone"
                        ref={phoneInputRef}
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        pattern="[0-9]{9}"
                        maxLength={9}
                        placeholder=" "
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        required
                        aria-invalid={Boolean(fieldErrors.phone)}
                        aria-describedby={
                          fieldErrors.phone ? "phone-error" : undefined
                        }
                        className={`${floatingInputBase} pl-[84px] sm:pl-[92px] ${
                          fieldErrors.phone
                            ? "border-rose-300/80 focus:border-rose-400 focus:ring-rose-300/40"
                            : ""
                        }`}
                      />
                      <label
                        htmlFor="phone"
                        className={`${floatingLabelBase} left-[84px] sm:left-[92px] ${
                          fieldErrors.phone
                            ? "text-rose-500 peer-focus:text-rose-500"
                            : ""
                        }`}
                      >
                        Telefon raqamingiz
                      </label>
                    </div>
                    {fieldErrors.phone ? (
                      <p id="phone-error" className={subtleFieldError}>
                        {fieldErrors.phone}
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`${applePrimaryButton} mt-2 w-full px-6 py-3.5 text-base font-bold sm:py-4 lg:py-[18px] ${isSubmitting ? "cursor-not-allowed opacity-75" : ""}`}
                  >
                    {isSubmitting ? "Yuborilmoqda..." : "Yuborish"}
                  </button>
                  {submitState.type !== "idle" ? (
                    <p
                      role="status"
                      className={`px-2 pt-2 text-center text-sm font-medium ${
                        submitState.type === "success"
                          ? "text-emerald-600"
                          : "text-rose-500"
                      }`}
                    >
                      {submitState.message}
                    </p>
                  ) : null}
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
                          href={NAVI_WEBSITE_URL}
                          className="text-sm text-zinc-600 transition hover:text-zinc-800"
                        >
                          {link}
                        </a>
                      ))}
                    </div>

                    <div className="flex gap-2 lg:mt-6">
                      <a
                        href={NAVI_INSTAGRAM_URL}
                        target="_blank"
                        rel="noreferrer"
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
                      </a>

                      <a
                        href={NAVI_TELEGRAM_URL}
                        target="_blank"
                        rel="noreferrer"
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
                      </a>
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
