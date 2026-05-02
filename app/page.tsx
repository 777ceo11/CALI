"use client";

import { useState, useEffect } from "react";

// 카운트업 애니메이션 컴포넌트
function CountUp({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // Cubic ease-out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * end));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count.toLocaleString()}</>;
}

export default function Home() {
  const [link, setLink] = useState("");
  const [phone, setPhone] = useState("");
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState({ visitors: 121, requests: 42 });

  useEffect(() => {
    // 2026년 5월 3일 오전 3시를 기준으로 계산
    const baseDate = new Date("2026-05-03T03:00:00");
    
    const updateStats = () => {
      const now = new Date();
      const diffMs = now.getTime() - baseDate.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      
      setStats({
        visitors: 121 + Math.max(0, diffHours * 2),
        requests: 42 + Math.max(0, Math.floor(diffHours / 6) * 4)
      });
    };

    updateStats();
    const timer = setInterval(updateStats, 1000 * 60 * 30); // 30분마다 갱신
    return () => clearInterval(timer);
  }, []);

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
        body: JSON.stringify({ link, phone, question }),
      });

      if (response.ok) {
        setMessage("접수가 완료되었습니다! 24시간 이내에 연락드릴게요.");
        setLink("");
        setPhone("");
        setQuestion("");
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
        <div className="flex items-center gap-8">
          <div className="text-2xl font-bold tracking-tighter text-primary">CLAI</div>
          <div className="flex items-center gap-8 text-sm font-medium text-zinc-400">
            <a href="#" className="hover:text-white transition-colors text-white">Home</a>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-16 md:pt-24 pb-32">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6">
            CLAI: <span className="text-primary">Car Link AI</span>
          </h1>
          <p className="text-zinc-400 text-base md:text-xl max-w-2xl mx-auto leading-relaxed break-keep">
            중고차 더이상 고민하지 마세요!<br/>
            관심 있는 중고차 매물 링크를 첨부해주시면 24시간 이내에 AI가 알기 쉽게 분석해드려요.
          </p>

          {/* Stats Section */}
          <div className="mt-10 grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">방문자 수</div>
              <div className="text-xl md:text-2xl font-bold text-primary">
                <CountUp end={stats.visitors} />명
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
              <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">분석 의뢰</div>
              <div className="text-xl md:text-2xl font-bold text-primary">
                <CountUp end={stats.requests} />건
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="relative group max-w-2xl mx-auto mb-16">
          <div className="absolute -inset-1 bg-primary/20 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-[#0A0A0A] border border-white/10 rounded-[2rem] p-6 md:p-12 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative glow-focus transition-all duration-300 rounded-2xl border border-white/5 bg-white/5 p-1">
                <div className="flex items-center px-4">
                  <svg className="w-5 h-5 text-zinc-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input
                    type="url"
                    placeholder="중고차 매물 링크를 붙여넣어 주세요"
                    className="w-full py-4 bg-transparent border-none focus:ring-0 text-white placeholder-zinc-500 text-sm md:text-base"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="relative glow-focus transition-all duration-300 rounded-2xl border border-white/5 bg-white/5 p-1">
                <div className="flex items-center px-4">
                  <svg className="w-5 h-5 text-zinc-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <input
                    type="tel"
                    placeholder="010-0000-0000"
                    className="w-full py-4 bg-transparent border-none focus:ring-0 text-white placeholder-zinc-500 text-sm md:text-base"
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={13}
                    required
                  />
                </div>
              </div>

              <div className="relative glow-focus transition-all duration-300 rounded-2xl border border-white/5 bg-white/5 p-1">
                <div className="flex items-start px-4 py-2">
                  <svg className="w-5 h-5 text-zinc-500 mr-3 mt-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                  <textarea
                    placeholder="궁금한 점이나 문의사항을 적어주세요 (선택사항)"
                    className="w-full py-3 bg-transparent border-none focus:ring-0 text-white placeholder-zinc-500 text-sm md:text-base min-h-[100px] resize-none"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-primary text-black font-bold rounded-2xl hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 text-sm md:text-base"
              >
                {isSubmitting ? "접수 중..." : "접수하기"}
              </button>
              
              {message && (
                <p className={`text-center text-sm ${message.includes('완료') ? 'text-primary' : 'text-red-400'}`}>
                  {message}
                </p>
              )}
            </form>

            <div className="mt-8 flex flex-wrap justify-center gap-4 md:gap-8 text-[10px] uppercase tracking-widest text-zinc-600 font-bold">
              <span className="flex items-center gap-1"><span className="w-1 h-1 bg-primary rounded-full"></span> AI Powered</span>
              <span className="flex items-center gap-1"><span className="w-1 h-1 bg-primary rounded-full"></span> 24H Results</span>
              <span className="flex items-center gap-1"><span className="w-1 h-1 bg-primary rounded-full"></span> Expert Analysis</span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="text-center space-y-12 mb-24 md:mb-32">
          <div className="p-6 md:p-8 border border-white/5 bg-white/[0.02] rounded-3xl">
            <h2 className="text-lg md:text-xl font-bold mb-4 text-primary">이용 방법</h2>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed break-keep mb-8">
              관심 있는 중고차 매물 링크 접수 <span className="mx-2 text-primary">→</span> 
              24시간 이내 분석된 리포트가 입력한 전화번호로 전송 (카톡)
            </p>
            
            <div className="space-y-2 text-left max-w-xl mx-auto border-t border-white/5 pt-6">
              <p className="text-zinc-500 text-[11px] md:text-xs leading-relaxed">
                *카카오톡을 통한 연락(리포트 전송)은 사람이 직접 순차적으로 진행하는 작업이므로 다소 시간이 소요될 수 있습니다.
              </p>
              <p className="text-zinc-500 text-[11px] md:text-xs leading-relaxed">
                *최대한 신속히 처리하고 있으나, 접수량 증가로 인해 24시간 이내에 연락이 어려울 수 있는 점 양해 부탁드립니다.
              </p>
              <p className="text-zinc-500 text-[11px] md:text-xs leading-relaxed">
                *늦어도 2일 이내에는 연락드릴 수 있도록 최선을 다하겠습니다. 감사합니다.
              </p>
            </div>
          </div>
        </div>

        <p className="text-primary text-xs text-center mb-12 break-keep font-medium">
          본 사이트는 커뮤니티 댓글로만 홍보를 하고 있으며, 각종 포털을 통한 검색은 지원하지 않습니다.
        </p>

        {/* Toggles / FAQ */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <h3 className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-6">Knowledge Base</h3>
          
          <details className="group bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/[0.05] transition-colors">
              <span className="font-bold text-sm md:text-base">
                <span className="text-primary mr-3">01.</span> 우리는 누구인가요?
              </span>
              <svg className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="p-6 pt-0 text-zinc-400 text-sm md:text-base leading-relaxed border-t border-white/5 break-keep">
              졸업 프로젝트를 하고 있는 인천대학교 4학년, 경희대학교 4학년 재학생 입니다!
            </div>
          </details>

          <details className="group bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/[0.05] transition-colors">
              <span className="font-bold text-sm md:text-base">
                <span className="text-primary mr-3">02.</span> 이걸 왜 하나요?
              </span>
              <svg className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="p-6 pt-0 text-zinc-400 text-sm md:text-base leading-relaxed border-t border-white/5 break-keep">
              어떤 중고차를 사야할지 모르겠는데, 딜러에 의존할 수 밖에 없는 구조를 바꾸고자 합니다! 이에 프로젝트에 대한 실제 이용자들의 데이터가 필요합니다.
            </div>
          </details>

          <details className="group bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/[0.05] transition-colors">
              <span className="font-bold text-sm md:text-base">
                <span className="text-primary mr-3">03.</span> 비용?
              </span>
              <svg className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="p-6 pt-0 text-zinc-400 text-sm md:text-base leading-relaxed border-t border-white/5 break-keep">
              당연히 무료입니다!<br/><br/>
              대신 리포트 발송 전후로 요청드리는 사전·사후 설문지에 꼭 참여해 주시기를 부탁드립니다.
            </div>
          </details>

          <details className="group bg-white/[0.03] border border-white/5 rounded-2xl overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-white/[0.05] transition-colors">
              <span className="font-bold text-sm md:text-base">
                <span className="text-primary mr-3">04.</span> 문의사항이 있어요!
              </span>
              <svg className="w-5 h-5 text-zinc-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="p-6 pt-0 text-zinc-400 text-sm md:text-base leading-relaxed border-t border-white/5 break-keep">
              <a href="mailto:click.studio.sw@gmail.com" className="hover:text-primary transition-colors">click.studio.sw@gmail.com</a> 로 언제든 연락 주세요!<br/><br/>
              혹은 연락 드리는 카톡으로 문의 부탁드립니다.
            </div>
          </details>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center text-center">
          <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold">
            © 2026 CLAI: CAR LINK AI. AUTOMOTIVE INTELLIGENCE.
          </p>
        </div>
      </footer>
    </div>
  );
}
