import { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import Loader from "../components/shared/Loader";
import { useAdminLoginMutation } from "../api/userMutation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
  // onForgotPassword: () => void;
  isLoading?: boolean;
}

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
  // onForgotPassword: () => void;
  isLoading?: boolean;
}

// ─── Illustration ─────────────────────────────────────────────────────────────

const WorkingPersonIllustration = () => (
  <svg
    viewBox="0 0 240 240"
    width="200"
    height="200"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Person working at a computer"
    role="img"
  >
    <circle cx="120" cy="120" r="110" fill="#dbeafe" />
    <ellipse cx="120" cy="210" rx="70" ry="18" fill="#93c5fd" opacity=".4" />
    <rect x="65" y="130" width="110" height="70" rx="6" fill="#1e3a5f" />
    <rect x="72" y="136" width="96" height="55" rx="4" fill="#60a5fa" />
    <rect x="95" y="200" width="30" height="8" rx="2" fill="#1e3a5f" />
    <rect x="88" y="208" width="44" height="5" rx="2" fill="#334155" />
    <rect x="130" y="155" width="28" height="32" rx="4" fill="#f97316" />
    <rect x="133" y="158" width="8" height="26" rx="2" fill="#fed7aa" />
    <rect x="143" y="162" width="6" height="18" rx="2" fill="#fde68a" />
    <rect x="150" y="166" width="5" height="14" rx="2" fill="#fed7aa" />
    <ellipse cx="96" cy="110" rx="18" ry="20" fill="#fcd5b0" />
    <ellipse cx="90" cy="104" rx="5" ry="6" fill="#1e3a5f" />
    <circle cx="88" cy="104" r="2" fill="#fff" opacity=".4" />
    <path
      d="M80 108 Q78 118 82 124 Q88 132 96 130 Q104 128 106 120 Q108 112 104 108"
      fill="#fbbf7e"
    />
    <circle cx="82" cy="108" r="5" fill="#fbbf7e" />
    <circle cx="110" cy="108" r="5" fill="#fbbf7e" />
    <ellipse cx="96" cy="88" rx="22" ry="16" fill="#1e3a5f" />
    <path d="M75 96 Q80 80 96 78 Q112 76 118 90" fill="#1e3a5f" />
    <rect x="81" y="126" width="30" height="50" rx="6" fill="#f87171" />
    <path d="M81 148 Q72 152 68 165 L75 168 Q80 158 88 156" fill="#fcd5b0" />
    <path
      d="M111 148 Q120 152 122 168 L115 170 Q111 158 103 156"
      fill="#fcd5b0"
    />
    <circle cx="75" cy="168" r="6" fill="#fcd5b0" />
    <circle cx="122" cy="170" r="6" fill="#fcd5b0" />
    <rect x="77" y="174" width="38" height="30" rx="4" fill="#1e3a5f" />
    <circle cx="96" cy="204" r="10" fill="#f1f5f9" />
    <rect
      x="108"
      y="100"
      width="28"
      height="36"
      rx="4"
      fill="#fff"
      opacity=".9"
    />
    <rect x="111" y="104" width="22" height="4" rx="1" fill="#f87171" />
    <rect x="111" y="110" width="22" height="4" rx="1" fill="#f87171" />
    <rect x="111" y="116" width="16" height="4" rx="1" fill="#f87171" />
    <rect x="111" y="122" width="22" height="4" rx="1" fill="#60a5fa" />
    <circle
      cx="130"
      cy="95"
      r="14"
      fill="#bfdbfe"
      stroke="#60a5fa"
      strokeWidth="1.5"
    />
    <line
      x1="130"
      y1="84"
      x2="130"
      y2="95"
      stroke="#1e3a5f"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line
      x1="130"
      y1="95"
      x2="136"
      y2="99"
      stroke="#1e3a5f"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="56" cy="88" r="7" fill="#fbbf24" opacity=".7" />
    <rect
      x="148"
      y="78"
      width="12"
      height="12"
      rx="2"
      fill="#f87171"
      opacity=".6"
      transform="rotate(20 154 84)"
    />
    <polygon points="165,95 170,85 175,95" fill="#60a5fa" opacity=".7" />
  </svg>
);

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FieldProps {
  icon: React.ReactNode;
  children: React.ReactNode;
}

const Field = ({ icon, children }: FieldProps) => (
  <div className="flex items-center gap-2.5 border border-gray-200 rounded-lg px-3 h-11 bg-sky-50 focus-within:border-sky-400 focus-within:bg-white transition-colors mb-3.5">
    <span className="text-gray-400 flex-shrink-0">{icon}</span>
    {children}
  </div>
);

// ─── Login form ───────────────────────────────────────────────────────────────

const LoginForm = ({
  onSubmit,
  // onForgotPassword,
  isLoading,
}: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (email && password) onSubmit(email, password);
    } catch (error) {}
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <h1 className="text-[24px] font-semibold text-gray-900 text-center mb-8">
        Welcome back
      </h1>

      <Field icon={<User size={16} />}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          autoComplete="email"
          className="flex-1 border-none outline-none bg-transparent text-[13px] text-gray-700 placeholder:text-gray-400 min-w-0"
        />
      </Field>

      <Field icon={<Lock size={16} />}>
        <input
          type={showPass ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          className="flex-1 border-none outline-none bg-transparent text-[13px] text-gray-700 placeholder:text-gray-400 min-w-0"
        />
        <button
          type="button"
          aria-label={showPass ? "Hide password" : "Show password"}
          onClick={() => setShowPass(!showPass)}
          className="text-gray-400 hover:text-gray-600 bg-transparent border-none cursor-pointer p-0 flex items-center transition-colors"
        >
          {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </Field>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white text-[14px] font-semibold rounded-lg border-none cursor-pointer transition-colors mb-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? <Loader /> : "Log in"}
      </button>
      {/* <button
        type="button"
        onClick={onForgotPassword}
        className="text-[12px] text-gray-400 hover:text-sky-500 bg-transparent border-none cursor-pointer transition-colors text-center"
      >
        Forgot your password?
      </button> */}
    </form>
  );
};

// ─── Root page component ───────────────────────────────────────────────────────

export const LoginPage = ({
  onLogin,
  // onForgotPassword,
  isLoading,
}: LoginPageProps) => (
  <div className="min-h-screen bg-sky-400 flex items-center justify-center p-6">
    <div className="bg-white rounded-2xl w-full max-w-2xl grid grid-cols-2 overflow-hidden min-h-[380px]">
      {/* Left — illustration */}
      <div className="flex items-center justify-center p-10 bg-white">
        <WorkingPersonIllustration />
      </div>

      {/* Right — form */}
      <div className="flex flex-col justify-center px-10 py-12">
        <LoginForm
          onSubmit={onLogin}
          // onForgotPassword={onForgotPassword}
          isLoading={isLoading}
        />
      </div>
    </div>
  </div>
);

// ─── Entry point ───────────────────────────────────────────────────────────────

export default function AdminLogin() {
  const adminLoginMutate = useAdminLoginMutation();
  const { isPending, failureReason } = adminLoginMutate;
  return (
    <LoginPage
      onLogin={(email, password) => {
        adminLoginMutate.mutateAsync({ email, password });
      }}
      // onForgotPassword={() => {
      //   console.log("forgot password");
      // }}
      isLoading={isPending}
    />
  );
}
