import {
  Calculator,
  Package,
  Receipt,
  BarChart2,
  RefreshCw,
  CheckSquare,
  AlertTriangle,
  Clock,
  Star,
  UserPlus,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Box,
  MoonStar,
  Newspaper,
  Building2Icon,
} from "lucide-react";
import DailySalesCard from "./DailySalesCard";
import { useUserStore } from "../../store/userStore";
import { User } from "../../constants/index.type";

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuickCard {
  label: string;
  icon: React.ReactNode;
}

interface CheckItem {
  icon: React.ReactNode;
  text: string;
  count: number;
  warn?: boolean;
}

interface StatCard {
  label: string;
  icon: React.ReactNode;
  value: string | number;
}

interface NewsItem {
  title: string;
  date: string;
  teaser: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

interface DashboardData {
  greeting: string;
  orgName: string;
  orgEmail: string;
  quickCards: QuickCard[];
  checks: CheckItem[];
  stats: StatCard[];
  news: NewsItem[];
}

// ─── Presentational sub-components ────────────────────────────────────────────

const QuickAccessCard = ({ card }: { card: QuickCard }) => (
  <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 cursor-pointer hover:border-gray-200 transition-colors">
    <span className="text-blue-600">{card.icon}</span>
    <span className="text-[13.5px] font-medium text-gray-800">
      {card.label}
    </span>
  </div>
);

const QuickAccess = ({ cards }: { cards: QuickCard[] }) => (
  <section className="mb-5">
    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-3">
      Quick access
    </p>
    <div className="grid grid-cols-3 gap-2.5 mb-2.5">
      {cards.slice(0, 3).map((c) => (
        <QuickAccessCard key={c.label} card={c} />
      ))}
    </div>
    <div className="grid grid-cols-2 gap-2.5">
      {cards.slice(3).map((c) => (
        <QuickAccessCard key={c.label} card={c} />
      ))}
    </div>
  </section>
);

const CheckRow = ({ item }: { item: CheckItem }) => (
  <div className="flex items-center gap-2.5 py-1.5 text-[13px] text-gray-500 border-b border-gray-50 last:border-0">
    <span className="text-gray-400 flex-shrink-0">{item.icon}</span>
    You have{" "}
    <span
      className={`font-semibold mx-0.5 ${
        item.warn ? "text-amber-500" : "text-green-600"
      }`}
    >
      {item.count}
    </span>{" "}
    {item.text}
  </div>
);

const ChecksCard = ({ checks }: { checks: CheckItem[] }) => (
  <div className="bg-white border border-gray-100 rounded-xl p-4 mb-5">
    <div className="flex items-center justify-between mb-3">
      <span className="text-[13.5px] font-medium text-gray-800">Checks</span>
      <button className="flex items-center gap-1 text-[12px] text-blue-600 hover:text-blue-700 transition-colors">
        <RefreshCw size={13} />
        Refresh
      </button>
    </div>
    {checks.map((item, i) => (
      <CheckRow key={i} item={item} />
    ))}
  </div>
);

const HighlightCard = ({ stat }: { stat: StatCard }) => (
  <div className="bg-gray-50 rounded-lg p-3.5">
    <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mb-1.5">
      <span>{stat.icon}</span>
      {stat.label}
    </div>
    <div
      className={`font-medium ${
        typeof stat.value === "number"
          ? "text-[22px] text-gray-800"
          : "text-[15px] text-gray-400"
      }`}
    >
      {stat.value}
    </div>
  </div>
);

const HighlightsCard = ({ stats }: { stats: StatCard[] }) => (
  <div className="bg-white border border-gray-100 rounded-xl p-4">
    <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
        Highlights
      </p>
      <div className="flex gap-2">
        <select className="text-[12px] px-2 py-1 border border-gray-100 rounded-md bg-white text-gray-600 cursor-pointer">
          <option>Today</option>
          <option>This week</option>
          <option>This month</option>
        </select>
        <select className="text-[12px] px-2 py-1 border border-gray-100 rounded-md bg-white text-gray-600 cursor-pointer">
          <option>All branches</option>
        </select>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-2.5">
      {stats.map((s, i) => (
        <HighlightCard key={i} stat={s} />
      ))}
    </div>
  </div>
);

const NewsCard = ({ item }: { item: NewsItem }) => (
  <div className="flex gap-3 py-2.5 border-b border-gray-50 last:border-0">
    <div
      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${item.iconBg}`}
    >
      <span className={item.iconColor}>{item.icon}</span>
    </div>
    <div>
      <p className="text-[13px] font-medium text-gray-800 leading-snug mb-0.5">
        {item.title}
      </p>
      <p className="text-[11px] text-gray-400">{item.date}</p>
      <p className="text-[12px] text-gray-400 mt-1">{item.teaser}</p>
      <div className="flex gap-2.5 mt-1.5">
        {[ThumbsUp, ThumbsDown, MessageCircle].map((Icon, i) => (
          <Icon
            key={i}
            size={13}
            className="text-gray-300 hover:text-gray-500 cursor-pointer transition-colors"
          />
        ))}
      </div>
    </div>
  </div>
);

const NewsPanel = ({ news }: { news: NewsItem[] }) => (
  <section>
    <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-3">
      News &amp; updates
    </p>
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      {news.map((item, i) => (
        <NewsCard key={i} item={item} />
      ))}
    </div>
  </section>
);

// ─── Root dashboard component ──────────────────────────────────────────────────

const HomeDashboard = ({
  data,
  userInfo,
}: {
  data: DashboardData;
  userInfo: User;
}) => (
  <div className="flex min-h-screen bg-gray-50">
    <main className="flex-1 px-7 py-6 overflow-auto">
      <h1 className="text-xl font-medium text-gray-800 mb-6">
        {`Hello ${userInfo?.name!}`}
      </h1>
      <div className="grid grid-cols-[1fr_300px] gap-5">
        <div>
          <QuickAccess cards={data.quickCards} />
          <ChecksCard checks={data.checks} />
          <HighlightsCard stats={data.stats} />
          <DailySalesCard />
        </div>
        <NewsPanel news={data.news} />
      </div>
    </main>
  </div>
);

// ─── Data ──────────────────────────────────────────────────────────────────────

const dashboardData: DashboardData = {
  greeting: "Hello, Gbagada@scoopd.ng!",
  orgName: "Cravings Now",
  orgEmail: "scooppd@qfafrica.com",

  quickCards: [
    { label: "Branches", icon: <Building2Icon size={20} /> },
    { label: "Orders", icon: <Receipt size={20} /> },
    { label: "Reports", icon: <BarChart2 size={20} /> },
    { label: "Products", icon: <Package size={20} /> },
    { label: "POS", icon: <Calculator size={20} /> },
  ],
  checks: [
    { icon: <CheckSquare size={14} />, text: "major issues", count: 0 },
    {
      icon: <AlertTriangle size={14} />,
      text: "warnings",
      count: 1,
      warn: true,
    },
    { icon: <Clock size={14} />, text: "pending orders", count: 0 },
    { icon: <Building2Icon size={14} />, text: "busy branches", count: 0 },
  ],
  stats: [
    { label: "Orders", icon: <Receipt size={13} />, value: 0 },
    { label: "Avg rating", icon: <Star size={13} />, value: "—" },
    { label: "New customers", icon: <UserPlus size={13} />, value: 0 },
  ],
  news: [
    {
      title: "June product updates",
      date: "2026-06-21",
      teaser: "New updates to your ordable/ service for June.",
      icon: <Box size={20} />,
      iconBg: "bg-green-50",
      iconColor: "text-green-700",
    },
    {
      title: "Eid Al Adha Mubarak",
      date: "2026-05-25",
      teaser: "Happy Eid from your ordable/ family.",
      icon: <MoonStar size={20} />,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-700",
    },
    {
      title: "March updates",
      date: "2026-03-31",
      teaser: "Platform updates from the ordable/ team.",
      icon: <Newspaper size={20} />,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-700",
    },
  ],
};

// ─── Entry point ───────────────────────────────────────────────────────────────

export default function Home() {
  const { user } = useUserStore();
  return <HomeDashboard data={dashboardData} userInfo={user?.user!} />;
}
