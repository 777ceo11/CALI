"use client";

import { useState } from "react";

export default function Home() {
  const [link, setLink] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); // 숫자만 남기기
    
    let formatted = value;
    if (value.length > 3 && value.length <= 7) {
      formatted = `${value.slice(0, 3)}-${value.slice(3)}`;
    } else if (value.length > 7) {
      formatted = `${value.slice(0, 3)}-${value.slice(3, 7)}-${value.slice(7, 11)}`;
    }
    
    if (formatted.length <= 13) {
      setPhone(formatted);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 전화번호 형식 검증 (000-0000-0000)
    const phoneRegex = /^\d{3}-\d{3,4}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
      alert("전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)");
      return;
    }

    if (!link) {
      alert("매물 링크를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ link, phone }),
      });

      if (response.ok) {
        setMessage("접수가 완료되었습니다! 24시간 이내에 연락드릴게요.");
        setLink("");
        setPhone("");
      } else {
        setMessage("접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      }
    } catch (error) {
      console.error(error);
      setMessage("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-black">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 border-b border-white/5">
        <div className="text-2xl font-bold tracking-tighter text-primary">CLAI</div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#" className="hover:text-white transition-colors text-white">Home</a>
          <a href="#" className="hover:text-white transition-colors">My Analysis</a>
          <a href="#" className="hover:text-white transition-colors">Market Trends</a>
        </div>
        <div className="flex items-center gap-4 text-zinc-400">
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/5 cursor-pointer">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-24 pb-32">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            CLAI: <span className="text-primary">Car Link AI</span>
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto">
            Intelligent used car analysis at your fingertips. Get deep insights before you buy.
          </p>
        </div>

        {/* Form Section */}
        <div className="relative group max-w-2xl mx-auto mb-16">
          <div className="absolute -inset-1 bg-primary/20 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-8 md:p-12 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative glow-focus transition-all duration-300 rounded-2xl border border-white/5 bg-white/5 p-1">
                <div className="flex items-center px-4">
                  <svg className="w-5 h-5 text-zinc-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input
                    type="url"
                    placeholder="중고차 매물 링크를 붙여넣어 주세요"
                    className="w-full py-4 bg-transparent border-none focus:ring-0 text-white placeholder-zinc-500"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="relative glow-focus transition-all duration-300 rounded-2xl border border-white/5 bg-white/5 p-1">
                <div className="flex items-center px-4">
                  <svg className="w-5 h-5 text-zinc-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <input
                    type="tel"
                    placeholder="010-0000-0000"
                    className="w-full py-4 bg-transparent border-none focus:ring-0 text-white placeholder-zinc-500"
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={13}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-primary text-black font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
              >
                {isSubmitting ? "접수 중..." : "접수하기"}
              </button>
              
              {message && (
                <p className={`text-center text-sm ${message.includes('완료') ? 'text-primary' : 'text-red-400'}`}>
                  {message}
                </p>
              )}
            </form>

            <div className="mt-8 flex justify-center gap-8 text-[10px] uppercase tracking-widest text-zinc-600 font-bold">
              <span className="flex items-center gap-1"><span className="w-1 h-1 bg-primary rounded-full"></span> AI Powered</span>
              <span className="flex items-center gap-1"><span className="w-1 h-1 bg-primary rounded-full"></span> 24H Results</span>
              <span className="flex items-center gap-1"><span className="w-1 h-1 bg-primary rounded-full"></span> Expert Analysis</span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="text-center space-y-12 mb-32">
          <div className="p-8 border border-white/5 bg-white/[0.02] rounded-3xl">
            <h2 className="text-xl font-bold mb-4 text-primary">이용 방법</h2>
            <p className="text-zinc-400 text-lg">
              관심 있는 중고차 매물 링크 접수 <span className="mx-2 text-primary">→</span> 
              24시간 이내 분석된 리포트가 입력하신 전화번호로 전송 (카톡)
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">중고차 더이상 고민하지 마세요!</h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              관심 있는 중고차 매물 링크를 첨부해주시면 24시간 이내에 AI가 알기 쉽게 분석해드려요.
            </p>
          </div>
        </div>

        {/* Toggles / FAQ */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <h3 className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-6">Knowledge Base</h3>
          
          <details className="group bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/[0.05] transition-colors">
              <span className="font-bold">
                <span className="text-primary mr-3">01.</span> 우리가 누구인가?
              </span>
              <svg className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="p-6 pt-0 text-zinc-400 leading-relaxed border-t border-white/5">
              졸업 프로젝트를 하고 있는 인천대학교, 경희대학교 재학생 2인입니다!
            </div>
          </details>

          <details className="group bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/[0.05] transition-colors">
              <span className="font-bold">
                <span className="text-primary mr-3">02.</span> 이걸 왜 하나?
              </span>
              <svg className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="p-6 pt-0 text-zinc-400 leading-relaxed border-t border-white/5">
              졸업 프로젝트에 실제 이용자들의 데이터가 필요합니다.
            </div>
          </details>

          <details className="group bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/[0.05] transition-colors">
              <span className="font-bold">
                <span className="text-primary mr-3">03.</span> 비용?
              </span>
              <svg className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="p-6 pt-0 text-zinc-400 leading-relaxed border-t border-white/5">
              당연히 무료입니다!
            </div>
          </details>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
            © 2024 CLAI: CAR LINK AI. AUTOMOTIVE INTELLIGENCE.
          </p>
          <div className="flex gap-8 text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
            <a href="#" className="hover:text-primary transition-colors">Who we are</a>
            <a href="#" className="hover:text-primary transition-colors">Why we do this</a>
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
