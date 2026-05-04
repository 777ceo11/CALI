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
  const [stats, setStats] = useState({ visitors: 324, requests: 158 });

  useEffect(() => {
    // 2026년 5월 5일 00시를 기준으로 계산
    const baseDate = new Date("2026-05-05T00:00:00");
    
    const updateStats = () => {
      const now = new Date();
      const diffMs = now.getTime() - baseDate.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      
      setStats({
        visitors: 324 + Math.max(0, Math.floor(diffMinutes / 10) * 2),
        requests: 158 + Math.max(0, Math.floor(diffMinutes / 30) * 1)
      });
    };

    updateStats();
    const timer = setInterval(updateStats, 1000 * 60 * 5); // 5분마다 갱신
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
    <div className="min-h-screen bg-white text-zinc-900 selection:bg-primary/10 selection:text-primary">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 border-b border-zinc-100">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-bold tracking-tighter text-primary">Plate AI</div>
          <div className="flex items-center gap-8 text-sm font-medium text-zinc-500">
            <a href="#" className="hover:text-primary transition-colors text-zinc-900">Home</a>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 pt-16 md:pt-24 pb-32">
        {/* Hero Section */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-4 text-primary">
            Plate AI
          </h1>
          <p className="text-zinc-900 text-lg md:text-2xl font-bold mb-8">
            차알못도 전문가처럼, Plate AI가 알려주니까.
          </p>
          <p className="text-zinc-500 text-base md:text-xl max-w-2xl mx-auto leading-relaxed break-keep">
            중고차 더이상 고민하지 마세요!<br/>
            관심 있는 중고차 매물 링크를 첨부해주시면 24시간 이내에 AI가 알기 쉽게 분석해드려요.
          </p>

          {/* Stats Section */}
          <div className="mt-10 grid grid-cols-2 gap-4 max-w-sm mx-auto">
            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4">
              <div className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-1">방문자 수</div>
              <div className="text-xl md:text-2xl font-bold text-primary">
                <CountUp end={stats.visitors} />명
              </div>
            </div>
            <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-4">
              <div className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-1">분석 의뢰</div>
              <div className="text-xl md:text-2xl font-bold text-primary">
                <CountUp end={stats.requests} />건
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="relative group max-w-2xl mx-auto mb-16">
          <div className="absolute -inset-1 bg-primary/10 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white border border-zinc-200 rounded-[2rem] p-6 md:p-12 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative glow-focus transition-all duration-300 rounded-2xl border border-zinc-100 bg-zinc-50 p-1">
                <div className="flex items-center px-4">
                  <svg className="w-5 h-5 text-zinc-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                  <input
                    type="url"
                    placeholder="중고차 매물 링크를 붙여넣어 주세요"
                    className="w-full py-4 bg-transparent border-none focus:ring-0 text-zinc-900 placeholder-zinc-400 text-sm md:text-base"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="relative glow-focus transition-all duration-300 rounded-2xl border border-zinc-100 bg-zinc-50 p-1">
                <div className="flex items-center px-4">
                  <svg className="w-5 h-5 text-zinc-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                  <input
                    type="tel"
                    placeholder="010-0000-0000"
                    className="w-full py-4 bg-transparent border-none focus:ring-0 text-zinc-900 placeholder-zinc-400 text-sm md:text-base"
                    value={phone}
                    onChange={handlePhoneChange}
                    maxLength={13}
                    required
                  />
                </div>
              </div>

              <div className="relative glow-focus transition-all duration-300 rounded-2xl border border-zinc-100 bg-zinc-50 p-1">
                <div className="flex items-start px-4 py-2">
                  <svg className="w-5 h-5 text-zinc-400 mr-3 mt-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                  <textarea
                    placeholder="궁금한 점이나 문의사항을 적어주세요 (선택사항)"
                    className="w-full py-3 bg-transparent border-none focus:ring-0 text-zinc-900 placeholder-zinc-400 text-sm md:text-base min-h-[100px] resize-none"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 text-sm md:text-base shadow-lg shadow-primary/20"
              >
                {isSubmitting ? "접수 중..." : "접수하기"}
              </button>
              
              {message && (
                <p className={`text-center text-sm ${message.includes('완료') ? 'text-primary font-bold' : 'text-red-500'}`}>
                  {message}
                </p>
              )}
            </form>

            <div className="mt-8 flex flex-wrap justify-center gap-4 md:gap-8 text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
              <span className="flex items-center gap-1"><span className="w-1 h-1 bg-primary rounded-full"></span> AI Powered</span>
              <span className="flex items-center gap-1"><span className="w-1 h-1 bg-primary rounded-full"></span> 24H Results</span>
              <span className="flex items-center gap-1"><span className="w-1 h-1 bg-primary rounded-full"></span> Expert Analysis</span>
            </div>
          </div>
        </div>

        {/* Pricing Notice Section */}
        <div className="max-w-2xl mx-auto mb-16 p-6 md:p-8 bg-blue-50 border border-blue-100 rounded-3xl text-zinc-900">
          <h2 className="text-lg font-bold mb-4 text-blue-700 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            알려드립니다.
          </h2>
          <div className="space-y-4 text-sm md:text-base leading-relaxed">
            <p className="font-medium">
              본 서비스는 본래 무료였으나, 최근 분석 의뢰 급증으로 인한 토큰 비용 감당을 위해 요금제가 변경되었습니다.
            </p>
            <div className="bg-white/50 p-4 rounded-xl space-y-1 inline-block min-w-[200px]">
              <p>최초 1회: <span className="text-blue-600 font-bold">무료</span></p>
              <p>이후 1건 당: <span className="text-blue-600 font-bold">900원</span></p>
            </div>
            <p className="text-zinc-600 text-xs md:text-sm pt-2">
              *결제 방법은 접수하신 후 작성해주신 전화번호를 통해 안내드리겠습니다.<br/>
              감사합니다.
            </p>
          </div>
        </div>

        {/* Description Section */}
        <div className="text-center space-y-12 mb-24 md:mb-32">
          <div className="p-6 md:p-8 border border-zinc-100 bg-zinc-50 rounded-3xl">
            <h2 className="text-lg md:text-xl font-bold mb-4 text-primary">이용 방법</h2>
            <p className="text-zinc-600 text-base md:text-lg leading-relaxed break-keep mb-8">
              관심 있는 중고차 매물 링크 접수 <span className="mx-2 text-primary">→</span> 
              24시간 이내 분석된 리포트가 입력한 전화번호로 전송 (카톡)
            </p>
            
            <div className="space-y-2 text-left max-w-xl mx-auto border-t border-zinc-200 pt-6">
              <p className="text-zinc-400 text-[11px] md:text-xs leading-relaxed">
                *카카오톡을 통한 연락(리포트 전송)은 사람이 직접 순차적으로 진행하는 작업이므로 다소 시간이 소요될 수 있습니다.
              </p>
              <p className="text-zinc-400 text-[11px] md:text-xs leading-relaxed">
                *최대한 신속히 처리하고 있으나, 접수량 증가로 인해 24시간 이내에 연락이 어려울 수 있는 점 양해 부탁드립니다.
              </p>
              <p className="text-zinc-400 text-[11px] md:text-xs leading-relaxed">
                *늦어도 2일 이내에는 연락드릴 수 있도록 최선을 다하겠습니다. 감사합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="max-w-2xl mx-auto mb-12">
          <details className="group bg-blue-50/50 border border-blue-100 rounded-2xl overflow-hidden shadow-sm transition-all duration-300">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-blue-100/50 transition-colors">
              <span className="font-bold text-sm md:text-base text-blue-700 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                </div>
                이용 후기 보러가기
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-blue-400 group-open:hidden">펼쳐보기</span>
                <svg className="w-5 h-5 text-blue-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </summary>
            <div className="p-6 pt-2 text-zinc-600 text-sm md:text-base leading-relaxed border-t border-blue-100/50 break-keep space-y-6">
              <div className="bg-white/60 p-4 rounded-xl border border-blue-50">
                <p className="mb-2 italic">"택시 사용 이력의 경우, 실제 엔카에서 직접 확인한 내용과 더불어 개인 명의로 출고된 사실까지 명확하게 짚어주셔서 신뢰도가 높다고 느꼈습니다. 해당 내용이 리포트에도 잘 반영되어 있어 안심하고 참고할 수 있었습니다."</p>
                <p className="text-xs text-zinc-400 font-bold text-right">– ***7님</p>
              </div>

              <div className="bg-white/60 p-4 rounded-xl border border-blue-50">
                <p className="mb-2 italic">"차량 점수가 함께 제시되는 점이 좋았습니다. 단순 정보 나열이 아니라 구매 결정에 실질적으로 도움이 되는 기준이 되어주었습니다."</p>
                <p className="text-xs text-zinc-400 font-bold text-right">– ***2님</p>
              </div>

              <div className="bg-white/60 p-4 rounded-xl border border-blue-50">
                <p className="mb-2 italic">"재고 기간까지 분석해주신 부분이 인상적이었습니다. 보통은 잘 다루지 않는 요소인데, 매물의 상태나 시장 상황을 판단하는 데 유용했습니다."</p>
                <p className="text-xs text-zinc-400 font-bold text-right">– ***5님</p>
              </div>

              <div className="bg-white/60 p-4 rounded-xl border border-blue-50">
                <p className="mb-2 italic">"후보군에서 제외해야 할 경우에 대한 가이드도 있어 판단에 도움이 되었고, 매물 전체에 대한 총점을 매겨주어 ‘살 만한 매물인지’를 직관적으로 파악할 수 있는 점이 특히 좋았습니다."</p>
                <p className="text-xs text-zinc-400 font-bold text-right">– ***9님</p>
              </div>

              <div className="bg-white/60 p-4 rounded-xl border border-blue-50">
                <p className="mb-2 italic">"이 리포트는 단순 조회용이 아니라, 실제로 차량 구매를 고민하는 사람들에게 결정적인 도움을 주는 자료라고 느꼈습니다."</p>
                <p className="text-xs text-zinc-400 font-bold text-right">– ***1님</p>
              </div>

              <div className="bg-white/60 p-4 rounded-xl border border-blue-50">
                <p className="mb-2 italic">"보험 이력을 반영해 시세를 산정해주는 점도 현실적인 판단에 큰 도움이 되었습니다."</p>
                <p className="text-xs text-zinc-400 font-bold text-right">– ***4님</p>
              </div>

              <div className="bg-white/60 p-4 rounded-xl border border-blue-50">
                <p className="mb-2 italic">"명의 변경 횟수뿐만 아니라 마지막 변경 이후 경과 기간까지 확인해주는 부분도 매우 유용했습니다. 보통은 단순 횟수만 보고 넘어가는데, 이 부분까지 확인할 수 있어 차량 이력을 더 깊이 이해할 수 있었습니다."</p>
                <p className="text-xs text-zinc-400 font-bold text-right">– ***6님</p>
              </div>
            </div>
          </details>
        </div>

        {/* Toggles / FAQ */}
        <div className="space-y-4 max-w-2xl mx-auto">
          <h3 className="text-zinc-400 uppercase tracking-widest text-xs font-bold mb-6 italic">Knowledge Base</h3>
          
          <details className="group bg-zinc-50 border border-zinc-100 rounded-2xl overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-100 transition-colors">
              <span className="font-bold text-sm md:text-base text-zinc-900">
                <span className="text-primary mr-3">01.</span> 누가?
              </span>
              <svg className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="p-6 pt-0 text-zinc-600 text-sm md:text-base leading-relaxed border-t border-zinc-100 break-keep">
              졸업 프로젝트를 하고 있는 인천대학교 4학년, 경희대학교 4학년 재학생 입니다!
            </div>
          </details>

          <details className="group bg-zinc-50 border border-zinc-100 rounded-2xl overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-100 transition-colors">
              <span className="font-bold text-sm md:text-base text-zinc-900">
                <span className="text-primary mr-3">02.</span> 왜?
              </span>
              <svg className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="p-6 pt-0 text-zinc-600 text-sm md:text-base leading-relaxed border-t border-zinc-100 break-keep">
              어떤 중고차를 사야할지 모르겠는데, 딜러에 의존할 수 밖에 없는 구조를 바꾸고자 합니다! 이에 프로젝트에 대한 실제 이용자들의 데이터가 필요합니다.
            </div>
          </details>

          <details className="group bg-zinc-50 border border-zinc-100 rounded-2xl overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-100 transition-colors">
              <span className="font-bold text-sm md:text-base text-zinc-900">
                <span className="text-primary mr-3">03.</span> 비용?
              </span>
              <svg className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="p-6 pt-0 text-zinc-600 text-sm md:text-base leading-relaxed border-t border-zinc-100 break-keep space-y-4">
              <p>본 프로젝트는 본래 무료로 진행하던 서비스였으나, 최근 분석 의뢰 증가로 인해 사비로 진행하던 ai비용 감당이 어려워져 최초 1회만 무료로 분석이 가능함을 알려드립니다.<br/>
              최초 1회 무료 이후에는 1건당 최소한의 비용(900원)이 부과됩니다.</p>
              
              <p>최초 무료로 진행되는 리포트의 경우, 발송 전후로 요청드리는 사전·사후 설문지에 꼭 참여해 주시기를 간곡히 부탁드립니다.</p>
              
              <p>감사합니다.<br/><br/>
              <span className="text-xs text-zinc-400">본 정책은 2026년 5월 5일 00시부터 적용됩니다.</span></p>
            </div>
          </details>

          <details className="group bg-zinc-50 border border-zinc-100 rounded-2xl overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-100 transition-colors">
              <span className="font-bold text-sm md:text-base text-zinc-900">
                <span className="text-primary mr-3">04.</span> 문의사항
              </span>
              <svg className="w-5 h-5 text-zinc-400 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </summary>
            <div className="p-6 pt-0 text-zinc-600 text-sm md:text-base leading-relaxed border-t border-zinc-100 break-keep">
              <a href="mailto:click.studio.sw@gmail.com" className="hover:text-primary transition-colors">click.studio.sw@gmail.com</a> 로 언제든 연락 주세요!<br/><br/>
              혹은 연락 드리는 카톡으로 문의 부탁드립니다.
            </div>
          </details>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center text-center">
          <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold">
            © 2026 Plate AI. AUTOMOTIVE INTELLIGENCE.
          </p>
        </div>
      </footer>
    </div>
  );
}
