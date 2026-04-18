import React from 'react';

export const LexiscoHomepageWithLiquidGlassButtons: React.FC = () => {
  return (
    <>

{/* TopNavBar */}
<nav className="fixed top-0 w-full flex justify-between items-center px-8 py-5 mx-auto max-w-full z-50 bg-transparent">
<div className="flex items-center gap-2">
<span className="text-xl font-bold tracking-tight text-white font-headline">LexisCo</span>
</div>
<div className="hidden md:flex items-center gap-8 font-headline text-sm tracking-wide">
<a className="text-gray-400 hover:text-white transition-colors duration-300" href="#">Features</a>
<a className="text-gray-400 hover:text-white transition-colors duration-300" href="#">Pricing</a>
<a className="text-gray-400 hover:text-white transition-colors duration-300" href="#">About</a>
</div>
<div className="flex items-center gap-4">
<button className="hidden md:block font-headline text-sm tracking-wide text-white bg-white/5 border border-white/20 backdrop-blur-md shadow-[inset_0_0_15px_rgba(255,255,255,0.1)] px-5 py-2 rounded-full hover:bg-white/10 transition-all duration-300">Sign In</button>
<button className="font-headline font-medium text-sm text-white bg-white/5 border border-white/20 backdrop-blur-md shadow-[inset_0_0_15px_rgba(255,255,255,0.1)] px-6 py-2 rounded-full hover:bg-white/10 transition-all duration-300">Get Started</button>
<button className="font-headline font-medium text-sm text-white bg-white/10 border border-white/30 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(255,255,255,0.1),inset_0_0_15px_rgba(255,255,255,0.2)] px-6 py-2 rounded-full hover:bg-white/20 transition-all duration-500 relative overflow-hidden group">
<span className="relative z-10">Subscription</span>
<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
</button></div>
</nav>
{/* Main Content */}
<main className="space-y-32">
{/* Hero Section */}
<section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-24 pb-24 overflow-hidden bg-black">
{/* Wireframe Sphere Background Element */}
<div className="absolute inset-0 flex items-center justify-center -z-10 pointer-events-none">
<img alt="abstract sphere" className="w-[700px] h-[700px] object-cover mix-blend-screen opacity-30 grayscale rounded-full blur-[2px] mask-image: radial-gradient(circle, black 40%, transparent 70%)" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzqMw1h8mf5FU7FzBOnELV-_3ADSG1qA6vEwV7CZonwCTfJ6g7JFGA3xhfxZdGqww41wH9yzleyLcuXNKbQfIXZqRSVfWcWgmHEmOxsfrd9gPfyetiQMHvE_d0bKIpuLbVIcj1Cku3XvuteCQVLNj9zsMgKrIoqYX1O9B_6vTl3fZMaEMVLicLujdxpTyhl_RwGX-jnIbLD2cBk6nNBwyBv4cFNdE-IRtohtzWJZD6-P07EJfPNp88FB0yy5PKU3CGUwRINvweTS4" style={{"WebkitMaskImage": "radial-gradient(circle, black 30%, transparent 70%)", "maskImage": "radial-gradient(circle, black 30%, transparent 70%)"}}/>
</div>
<div className="text-center z-10 max-w-4xl px-8 flex flex-col items-center mt-32">
<div className="text-xs font-mono tracking-[0.15em] text-gray-400 mb-6 uppercase">Launch Sequence: Anomaly 12</div>
<h1 className="text-5xl md:text-7xl font-headline font-bold tracking-tight text-white mb-8 leading-[1.1]">
            Not Just Answers, <br/>But Action.
        </h1>
<p className="text-base md:text-lg text-gray-400 font-body max-w-xl mx-auto leading-relaxed">
            The AI mentor that guides you through India's legal system step-by-step. Complex legal jargon translated into clear, actionable strategy.
        </p>
</div>
</section>
{/* Process Section */}
<section className="max-w-7xl mx-auto px-8 lg:px-12">
<div className="mb-16 text-center">
<h2 className="text-3xl lg:text-4xl font-headline font-bold text-primary tracking-tight">The LexisCo Process</h2>
<p className="text-on-surface-variant mt-4 text-lg">From complex problem to concrete action.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
{/* Step 1 */}
<div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/15 hover:bg-surface-container-highest transition-colors duration-300 relative group">
<div className="absolute -top-4 -left-4 w-12 h-12 bg-surface text-secondary font-headline font-bold rounded-xl flex items-center justify-center border border-outline-variant/15 shadow-xl">01</div>
<span className="material-symbols-outlined text-4xl text-secondary mb-6 block font-light">mic</span>
<h3 className="font-headline font-bold text-xl text-primary mb-3">Explain Your Situation</h3>
<p className="text-sm text-on-surface-variant leading-relaxed">Speak or type your problem in simple language. We understand the context, not just the keywords.</p>
</div>
{/* Step 2 */}
<div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/15 hover:bg-surface-container-highest transition-colors duration-300 relative group">
<div className="absolute -top-4 -left-4 w-12 h-12 bg-surface text-secondary font-headline font-bold rounded-xl flex items-center justify-center border border-outline-variant/15 shadow-xl">02</div>
<span className="material-symbols-outlined text-4xl text-secondary mb-6 block font-light">account_balance</span>
<h3 className="font-headline font-bold text-xl text-primary mb-3">AI Analyzes Law</h3>
<p className="text-sm text-on-surface-variant leading-relaxed">Cross-referencing against IPC, BNS, Consumer Act, and the latest precedents instantly.</p>
</div>
{/* Step 3 */}
<div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/15 hover:bg-surface-container-highest transition-colors duration-300 relative group">
<div className="absolute -top-4 -left-4 w-12 h-12 bg-surface text-secondary font-headline font-bold rounded-xl flex items-center justify-center border border-outline-variant/15 shadow-xl">03</div>
<span className="material-symbols-outlined text-4xl text-secondary mb-6 block font-light">fact_check</span>
<h3 className="font-headline font-bold text-xl text-primary mb-3">Clear Breakdown</h3>
<p className="text-sm text-on-surface-variant leading-relaxed">Understand your rights exactly. No legalese, just a transparent strategic overview.</p>
</div>
{/* Step 4 */}
<div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/15 hover:bg-surface-container-highest transition-colors duration-300 relative group">
<div className="absolute -top-4 -left-4 w-12 h-12 bg-surface text-tertiary font-headline font-bold rounded-xl flex items-center justify-center border border-outline-variant/15 shadow-xl">04</div>
<span className="material-symbols-outlined text-4xl text-tertiary mb-6 block font-light">description</span>
<h3 className="font-headline font-bold text-xl text-primary mb-3">Generate Documents</h3>
<p className="text-sm text-on-surface-variant leading-relaxed">Auto-draft actionable FIRs, formal complaints, or legal notices ready for submission.</p>
</div>
</div>
</section>
{/* Feature Grid (Bento) */}
<section className="max-w-7xl mx-auto px-8 lg:px-12">
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[300px]">
{/* Feature 1: Large Span */}
<div className="lg:col-span-2 p-10 rounded-2xl bg-surface-container-lowest border border-outline-variant/15 relative overflow-hidden flex flex-col justify-end group">
<div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10"></div>
<div className="absolute top-0 right-0 w-full h-full opacity-30 mix-blend-luminosity" style={{"backgroundImage": "radial-gradient(circle at 80% 20%, var(--tw-colors-secondary-container) 0%, transparent 50%)"}}></div>
<div className="relative z-20 max-w-lg">
<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-container-highest mb-6 border border-outline-variant/20">
<span className="material-symbols-outlined text-secondary">edit_document</span>
</div>
<h3 className="text-2xl font-headline font-bold text-primary mb-3">Complaint/FIR Generator</h3>
<p className="text-on-surface-variant text-lg">Auto-generate ready-to-use legal drafts in minutes, perfectly formatted for Indian jurisdictions.</p>
</div>
</div>
{/* Feature 2 */}
<div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/15 flex flex-col group">
<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-container-highest mb-6 border border-outline-variant/20">
<span className="material-symbols-outlined text-tertiary">library_books</span>
</div>
<h3 className="text-xl font-headline font-bold text-primary mb-3">Verified Citations</h3>
<p className="text-sm text-on-surface-variant flex-grow">Direct links to exact legal sections for absolute trust and immediate verification.</p>
</div>
{/* Feature 3 */}
<div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/15 flex flex-col group">
<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-container-highest mb-6 border border-outline-variant/20">
<span className="material-symbols-outlined text-primary">translate</span>
</div>
<h3 className="text-xl font-headline font-bold text-primary mb-3">Bilingual Support</h3>
<p className="text-sm text-on-surface-variant flex-grow">Guidance in simple English and Hindi for everyone, ensuring justice is accessible.</p>
</div>
{/* Feature 4: Wide */}
<div className="lg:col-span-2 p-10 rounded-2xl bg-surface-container-low border border-outline-variant/15 flex items-center gap-10 group overflow-hidden relative">
<div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-surface-container-highest/50 to-transparent"></div>
<div className="relative z-10 max-w-md">
<div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-surface-container-highest mb-6 border border-outline-variant/20">
<span className="material-symbols-outlined text-secondary">record_voice_over</span>
</div>
<h3 className="text-2xl font-headline font-bold text-primary mb-3">Voice Input</h3>
<p className="text-on-surface-variant text-lg">Speak your problem; we'll handle the rest. Natural language processing tailored for Indian accents and context.</p>
</div>
</div>
</div>
</section>
{/* Testimonials Section */}
<section className="max-w-7xl mx-auto px-8 lg:px-12">
<div className="mb-16 text-center flex flex-col items-center">
<div className="inline-block px-5 py-2 rounded-full bg-surface-container-highest border border-outline-variant/20 text-sm font-label text-on-surface-variant mb-6 shadow-sm">
            Testimonials
        </div>
<h2 className="text-4xl md:text-5xl font-headline font-bold text-primary tracking-tight mb-4">What our users say</h2>
<p className="text-on-surface-variant text-lg max-w-2xl mx-auto">See what our customers have to say about us and how LexisCo has empowered them to take legal action.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
{/* Col 1 */}
<div className="flex flex-col gap-6">
<div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/15 hover:bg-surface-container-highest transition-colors duration-300">
<p className="text-on-surface-variant leading-relaxed mb-6">LexisCo's guidance on drafting an FIR was incredibly helpful. It translated the complex legal terms into plain English, ensuring I understood every step of the process.</p>
<div className="flex items-center gap-4">
<img alt="Saman Malik" className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzhfqwsi7nb4LIn0RZZOvS-oNQtPSAaX9tx5qNuj1kdQpUKVNntTrxgfvvNduqf20skopBABXfYgmzI6AiU3S_7NKhmc2IzjGtzxe8g27vfJL-WJMd4kTI2T4pUMuvzV7v3uzSlieGH0lerrmIFdKs_h57CBidHPvsPfqMEDNu8OvEi6YL-XYibFvIM8HUezmBrCN_uQdSzdJRihGgjr_FW7SPkogq-b3R7E7YrnwDaH31q-t0DdTuCgzvQ0HH9tUQxirI5kXW-jU"/>
<div>
<h4 className="font-headline font-bold text-primary">Saman Malik</h4>
<p className="text-sm text-on-surface-variant">Customer Support Lead</p>
</div>
</div>
</div>
<div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/15 hover:bg-surface-container-highest transition-colors duration-300">
<p className="text-on-surface-variant leading-relaxed mb-6">This platform revolutionized how we handle consumer complaints. The step-by-step breakdown and auto-generated notices saved us so much time and legal fees.</p>
<div className="flex items-center gap-4">
<img alt="Briana Patton" className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_rTuvFIGdLFny9dDqUPegBbEjNU9gT1aN1sSrSABQ4d-KUl0y4-Dw_8SB0KvwqtgGu-AJ4pHx9a5hRcHqQ0zN467ImGCH1IbX1uBZP98rfV4lIWYaRsVeOYuDiN2nSZjQoFw9CyzFEPy7HuVrSqco5TZSJBgH1RrsVVnpJ7Wpxngu4TLY4rnv4nFYY1pSV1lJPlDXEfroiAwDhrBw2mvgTFZvRRpJ1f9bBTHj7WEguRaTLq0eiJHw9xbSzxGZbhOvhKZXLUPP2uE"/>
<div>
<h4 className="font-headline font-bold text-primary">Briana Patton</h4>
<p className="text-sm text-on-surface-variant">Operations Manager</p>
</div>
</div>
</div>
<div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/15 hover:bg-surface-container-highest transition-colors duration-300">
<p className="text-on-surface-variant leading-relaxed mb-6">Implementing this AI mentor was smooth and quick. The customizable, user-friendly interface made understanding complex laws effortless.</p>
</div>
</div>
{/* Col 2 */}
<div className="flex flex-col gap-6 md:mt-12">
<div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/15 hover:bg-surface-container-highest transition-colors duration-300">
<p className="text-on-surface-variant leading-relaxed mb-6">The smooth implementation exceeded expectations. It streamlined our approach to legal processes, improving our overall response times.</p>
<div className="flex items-center gap-4">
<img alt="Aliza Khan" className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuATV_8ZGbRVy6mXS1YDt_3JnoRxdowHIWERkeRYObjroH2hBeRhMJUjGKCfsYbq4jcQ-1bwAw56_tce7Ik7_lLKTDdX37ySgL-cZl3rSn6JTMQC74_4ba0AbQoFk3MuBS6expiUgtlSMMhTDZw4Xy5DxvWA7xsH9Y96LBxhIESSXuVpE5whmemmarZTNOYzP7BLq5CSiaQ-Og5Oxo7IxpzFSKt3ZitBDW8I_mnmkSsTxn8O2IVx-YMEnmCACzCXlMSgn3YypQ6XaVg"/>
<div>
<h4 className="font-headline font-bold text-primary">Aliza Khan</h4>
<p className="text-sm text-on-surface-variant">Business Analyst</p>
</div>
</div>
</div>
<div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/15 hover:bg-surface-container-highest transition-colors duration-300">
<p className="text-on-surface-variant leading-relaxed mb-6">LexisCo's seamless integration enhanced our business operations and efficiency. Highly recommend for its intuitive interface.</p>
<div className="flex items-center gap-4">
<img alt="Omar Raza" className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5fn_nnpUYTPUnWM27eF8GzslVaSD71M3gBs9r85QJgjzHYpzU71eVeZYLvK2KmyH5JKw8KbEhVjhlRXxMYfFt7Mj05Q2k9EWabHEthBftqExekW64RQEwyh3usF8tFw2kWT2PPMK7IVpTmfcl2FunJZ__YLZWX3Fk-UM_xlIsPBwIY1eRmRBRxCdVgb-zmK0SBt_fYHFUqH-QHHSumyFxP2wYD80XlYLdH8qRrwdQJYnLkeJu7a2VNx8lJxS8GhW6A6BPRcJ5I2c"/>
<div>
<h4 className="font-headline font-bold text-primary">Omar Raza</h4>
<p className="text-sm text-on-surface-variant">CEO</p>
</div>
</div>
</div>
</div>
{/* Col 3 */}
<div className="flex flex-col gap-6 md:mt-24">
<div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/15 hover:bg-surface-container-highest transition-colors duration-300">
<p className="text-on-surface-variant leading-relaxed mb-6">Using this platform, our online presence and compliance significantly improved, boosting our business performance and reducing risks.</p>
<div className="flex items-center gap-4">
<img alt="Hassan Ali" className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV7Gdy9h2yEY3qE-lmDRd_cN9lLBvDVzJbGKAOX7kac5q-Y2Ze9GMPWiPX2vPgfit0ewwSQAio-yxItpC2NrNa5gsNLuXZdqHLljDnCgWi0v5j_wUYbxzi5e-gqqgpiQ_fRdCXSVeJceP8H5Zvi2h9S0U5PaMS546Fyoofiikm6wbFbLbU1h-FLkCOn00IHeWbztE4n2XyFJRzTBFZoDjnBIqyEOnWITyKl1U-g34a5-4UejKdLbrs-CMXitMXCiaIuXUlXwps-ko"/>
<div>
<h4 className="font-headline font-bold text-primary">Hassan Ali</h4>
<p className="text-sm text-on-surface-variant">E-commerce Manager</p>
</div>
</div>
</div>
<div className="p-8 rounded-2xl bg-surface-container-low border border-outline-variant/15 hover:bg-surface-container-highest transition-colors duration-300">
<p className="text-on-surface-variant leading-relaxed mb-6">Our understanding of our rights improved with a user-friendly design and positive user feedback. The verified citations built absolute trust.</p>
<div className="flex items-center gap-4">
<img alt="Farhan Siddiqui" className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKYSbbCbq_jiOaFnEqQJp4U83kgNGhuWKSJqPRf9uraELYOyoBE10kzL18z0JmGcQuNaFfNeJZ58ek7HoLdzFb6Fpa1pdiF9lEt6UZmL4F64lAd5oLAwq2eWxbzQT0d1Lzp1Xh-rQyJnMYmDPL_63GwNeA5ivs_W2ilpdgVJo42N1TmKc70HXmqiLXAZqiZySjRXtbXLARqaSLEl1AIStxPwce9zR6WkZR2Pq6zYW8Ta30q-ESQaMzoUrotSom0F17mCuPxxhNVpY"/>
<div>
<h4 className="font-headline font-bold text-primary">Farhan Siddiqui</h4>
<p className="text-sm text-on-surface-variant">Marketing Director</p>
</div>
</div>
</div>
</div>
</div>
</section>
{/* Trust & Safety */}
<section className="max-w-7xl mx-auto px-8 lg:px-12">
<div className="p-12 rounded-3xl bg-surface-container-lowest border border-outline-variant/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-center max-w-4xl mx-auto">
<span className="material-symbols-outlined text-5xl text-secondary mb-6 block font-light">shield_locked</span>
<h2 className="text-3xl font-headline font-bold text-primary mb-4 tracking-tight">Safe, Retrievable, and Grounded AI.</h2>
<p className="text-on-surface-variant text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                    Powered by advanced RAG (Retrieval-Augmented Generation) technology, every insight is anchored in established Indian law, ensuring absolute privacy and data sovereignty.
                </p>
<div className="inline-block px-6 py-3 rounded-full bg-surface-container-low border border-outline-variant/20 text-sm font-label text-on-surface-variant">
<span className="text-tertiary font-medium">Disclaimer:</span> LexisCo provides guidance, not professional legal advice.
                </div>
</div>
</section>
{/* Bottom CTA */}
<section className="text-center pb-12 px-8">
<h2 className="text-4xl font-headline font-extrabold text-primary mb-8 tracking-tight text-glow">Take the First Step Towards Justice.</h2>
<button className="font-headline font-bold text-lg text-white bg-white/5 border border-white/20 backdrop-blur-md shadow-[inset_0_0_15px_rgba(255,255,255,0.1)] px-10 py-4 rounded-full hover:bg-white/10 transition-all duration-300">
                Start Your Case Analysis
            </button>
</section>
</main>
{/* Footer */}
<footer className="w-full mx-auto px-12 py-16 border-t border-white/5 bg-black mt-12 relative overflow-hidden">
<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-white/5 rounded-full blur-[100px] pointer-events-none opacity-30"></div>
<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 relative z-10">
<div className="md:col-span-1 flex flex-col justify-start gap-6">
<div className="text-3xl text-white font-light leading-none">#</div>
<p className="text-[#8d9199] text-sm">© 2026 Asme. All rights reserved.</p>
</div>
<div className="flex flex-col gap-5">
<h4 className="text-white font-medium text-sm">Product</h4>
<div className="flex flex-col gap-3">
<a className="text-[#8d9199] hover:text-white transition-colors text-sm" href="#">Features</a>
<a className="text-[#8d9199] hover:text-white transition-colors text-sm" href="#">Pricing</a>
<a className="text-[#8d9199] hover:text-white transition-colors text-sm" href="#">Testimonials</a>
<a className="text-[#8d9199] hover:text-white transition-colors text-sm" href="#">Integration</a>
</div>
</div>
<div className="flex flex-col gap-5">
<h4 className="text-white font-medium text-sm">Company</h4>
<div className="flex flex-col gap-3">
<a className="text-[#8d9199] hover:text-white transition-colors text-sm" href="#">FAQs</a>
<a className="text-[#8d9199] hover:text-white transition-colors text-sm" href="#">About Us</a>
<a className="text-[#8d9199] hover:text-white transition-colors text-sm" href="#">Privacy Policy</a>
<a className="text-[#8d9199] hover:text-white transition-colors text-sm" href="#">Terms of Services</a>
</div>
</div>
<div className="flex flex-col gap-5">
<h4 className="text-white font-medium text-sm">Resources</h4>
<div className="flex flex-col gap-3">
<a className="text-[#8d9199] hover:text-white transition-colors text-sm" href="#">Blog</a>
<a className="text-[#8d9199] hover:text-white transition-colors text-sm" href="#">Changelog</a>
<a className="text-[#8d9199] hover:text-white transition-colors text-sm" href="#">Brand</a>
<a className="text-[#8d9199] hover:text-white transition-colors text-sm" href="#">Help</a>
</div>
</div>
<div className="flex flex-col gap-5">
<h4 className="text-white font-medium text-sm">Social Links</h4>
<div className="flex flex-col gap-3">
<a className="text-[#8d9199] hover:text-white transition-colors text-sm flex items-center gap-2" href="#"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>Facebook</a>
<a className="text-[#8d9199] hover:text-white transition-colors text-sm flex items-center gap-2" href="#"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><rect height="20" rx="5" ry="5" width="20" x="2" y="2"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>Instagram</a>
<a className="text-[#8d9199] hover:text-white transition-colors text-sm flex items-center gap-2" href="#"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>Youtube</a>
<a className="text-[#8d9199] hover:text-white transition-colors text-sm flex items-center gap-2" href="#"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect height="12" width="4" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>LinkedIn</a>
</div>
</div>
</div>
</footer>

    </>
  );
};
