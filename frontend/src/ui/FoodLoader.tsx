import { useEffect, useState } from "react";

const messages = [
  "Finding your favorites...",
  "Checking restaurant availability...",
  "Almost ready to order...",
  "Preparing your experience...",
];

const STEAM_COUNT = 6;

export default function FoodLoader() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setMsgIndex((i) => (i + 1) % messages.length);
        setVisible(true);
      }, 300);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Playfair+Display:wght@700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .loader-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #050d1a;
          font-family: 'DM Sans', sans-serif;
        }

        .loader-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 28px 36px;
          background: #0a1628;
          border-radius: 18px;
          border: 1px solid #1a2d4a;
          box-shadow: 0 16px 48px rgba(0,0,0,0.5);
          position: relative;
          overflow: hidden;
        }

        .loader-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(56,139,255,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Bowl SVG wrapper */
        .bowl-scene {
          position: relative;
          width: 80px;
          height: 80px;
        }

        /* Steam lines */
        .steams {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 5px;
          align-items: flex-end;
        }

        .steam {
          width: 2px;
          border-radius: 4px;
          background: linear-gradient(to top, rgba(99,179,255,0.7), transparent);
          animation: steamRise 1.8s ease-in-out infinite;
          transform-origin: bottom center;
        }

        .steam:nth-child(1) { height: 12px; animation-delay: 0s;    animation-duration: 1.9s; }
        .steam:nth-child(2) { height: 18px; animation-delay: 0.3s;   animation-duration: 1.6s; }
        .steam:nth-child(3) { height: 14px; animation-delay: 0.15s;  animation-duration: 2.0s; }
        .steam:nth-child(4) { height: 20px; animation-delay: 0.45s;  animation-duration: 1.7s; }
        .steam:nth-child(5) { height: 13px; animation-delay: 0.6s;   animation-duration: 1.85s; }
        .steam:nth-child(6) { height: 10px; animation-delay: 0.1s;   animation-duration: 2.1s; }

        @keyframes steamRise {
          0%   { opacity: 0;   transform: translateY(0px) scaleX(1); }
          30%  { opacity: 0.9; }
          70%  { opacity: 0.5; }
          100% { opacity: 0;   transform: translateY(-22px) scaleX(1.5); }
        }

        /* Bowl bob */
        .bowl-svg {
          animation: bowlBob 2.4s ease-in-out infinite;
        }

        @keyframes bowlBob {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }

        /* Spoon swing */
        .spoon-group {
          transform-origin: 62px 28px;
          animation: spoonSwing 2.4s ease-in-out infinite;
        }

        @keyframes spoonSwing {
          0%, 100% { transform: rotate(-8deg); }
          50%       { transform: rotate(8deg); }
        }

        /* Noodle wiggle */
        .noodle {
          animation: noodleWave 1.4s ease-in-out infinite alternate;
        }
        .noodle:nth-child(2) { animation-delay: 0.2s; }
        .noodle:nth-child(3) { animation-delay: 0.4s; }

        @keyframes noodleWave {
          0%   { d: path("M30 62 Q45 55 60 62 Q75 69 90 62"); }
          100% { d: path("M30 62 Q45 69 60 62 Q75 55 90 62"); }
        }

        /* Progress track */
        .progress-track {
          width: 160px;
          height: 2px;
          background: #1a2d4a;
          border-radius: 99px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #1e6fff, #63b3ff);
          animation: progressPulse 2.4s ease-in-out infinite;
          box-shadow: 0 0 8px rgba(99,179,255,0.5);
        }

        @keyframes progressPulse {
          0%   { width: 15%; }
          50%  { width: 80%; }
          100% { width: 15%; }
        }

        /* Dot row */
        .dots {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #3b8fff;
          animation: dotBounce 1.4s ease-in-out infinite;
        }

        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.18s; }
        .dot:nth-child(3) { animation-delay: 0.36s; }

        @keyframes dotBounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40%            { transform: scale(1.2); opacity: 1; }
        }

        /* Message */
        .msg-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          min-height: 40px;
        }

        .brand {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          color: #fff;
          letter-spacing: -0.3px;
        }

        .brand span {
          color: #3b8fff;
        }

        .status-msg {
          font-size: 11px;
          color: #4a6a9a;
          letter-spacing: 0.5px;
          transition: opacity 0.3s ease, transform 0.3s ease;
          text-align: center;
        }

        .status-msg.fade-out {
          opacity: 0;
          transform: translateY(-4px);
        }

        .status-msg.fade-in {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <div className="loader-root">
        <div className="loader-card">
          {/* Bowl scene */}
          <div className="bowl-scene">
            <div className="steams">
              {Array.from({ length: STEAM_COUNT }).map((_, i) => (
                <div key={i} className="steam" />
              ))}
            </div>

            <svg
              className="bowl-svg"
              width="80"
              height="68"
              viewBox="0 0 120 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Bowl shadow */}
              <ellipse cx="60" cy="96" rx="42" ry="5" fill="rgba(0,0,0,0.35)" />

              {/* Bowl body */}
              <path
                d="M18 52 Q20 88 60 90 Q100 88 102 52 Z"
                fill="#0d1f3c"
                stroke="#1a3560"
                strokeWidth="1.5"
              />

              {/* Broth surface */}
              <ellipse cx="60" cy="52" rx="42" ry="10" fill="#0a1628" />
              <ellipse cx="60" cy="52" rx="38" ry="8" fill="#0f2040" />

              {/* Noodle squiggles (CSS animates `d` in supporting browsers) */}
              <path
                className="noodle"
                d="M30 58 Q45 51 60 58 Q75 65 90 58"
                stroke="#3b8fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                fill="none"
              />
              <path
                className="noodle"
                d="M34 62 Q49 55 64 62 Q79 69 94 62"
                stroke="#1e6fff"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <path
                className="noodle"
                d="M26 55 Q41 62 56 55 Q71 48 86 55"
                stroke="#63b3ff"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
              />

              {/* Toppings */}
              <circle cx="48" cy="50" r="5" fill="#1a4fd6" opacity="0.9" />
              <circle cx="72" cy="53" r="4" fill="#2563eb" opacity="0.8" />
              <ellipse
                cx="60"
                cy="48"
                rx="6"
                ry="3"
                fill="#93c5fd"
                opacity="0.5"
              />

              {/* Bowl rim */}
              <ellipse
                cx="60"
                cy="52"
                rx="42"
                ry="10"
                fill="none"
                stroke="#1a3560"
                strokeWidth="2"
              />

              {/* Spoon */}
              <g className="spoon-group">
                <line
                  x1="62"
                  y1="28"
                  x2="68"
                  y2="72"
                  stroke="#8B7355"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <ellipse
                  cx="70"
                  cy="75"
                  rx="5"
                  ry="7"
                  fill="#A08060"
                  stroke="#8B7355"
                  strokeWidth="1"
                />
              </g>
            </svg>
          </div>

          {/* Brand + message */}
          <div className="msg-wrap">
            <div className="brand">
              bites<span>.</span>
            </div>
            <div className={`status-msg ${visible ? "fade-in" : "fade-out"}`}>
              {messages[msgIndex]}
            </div>
          </div>

          {/* Progress */}
          <div className="progress-track">
            <div className="progress-fill" />
          </div>

          {/* Dots */}
          <div className="dots">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>
        </div>
      </div>
    </>
  );
}
