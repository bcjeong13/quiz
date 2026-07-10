// 카톡/네이버/밴드/인스타 등 "인앱 브라우저"로 열면 음성(Web Speech)이 막혀
// 소리가 안 난다. 이 경우 크롬 등 진짜 브라우저로 열라고 안내한다.

function isInAppBrowser(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  const apps = [
    "kakaotalk",
    "naver",
    "line/",
    "band",
    "daumapps",
    "instagram",
    "fban",
    "fbav",
    "fb_iab",
    "micromessenger", // 위챗
    "everytimeapp",
  ];
  const inApp = apps.some((a) => ua.includes(a));
  const noSpeech = !("speechSynthesis" in window);
  return inApp || noSpeech;
}

export default function BrowserHint() {
  if (!isInAppBrowser()) return null;

  return (
    <div className="mx-auto max-w-sm rounded-2xl bg-white/95 px-5 py-3 text-center shadow-lg">
      <p className="text-base font-black text-rose-500">🔊 소리가 안 나와요?</p>
      <p className="mt-1 text-sm font-bold text-gray-600">
        지금 <b>카톡·앱 안의 미니 브라우저</b>로 열려 있어요.
        <br />
        오른쪽 위 <b>⋮ 메뉴 → "다른 브라우저로 열기"</b>
        <br />
        또는 <b>크롬(Chrome)</b>으로 열면 소리가 나와요!
      </p>
    </div>
  );
}
