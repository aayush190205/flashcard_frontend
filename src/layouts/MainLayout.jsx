import Sidebar from "../components/common/Sidebar";
import { useTheme } from "../context/ThemeContext";

const MainLayout = ({ children }) => {
  const { isDark } = useTheme();

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${isDark ? "bg-[#020203]" : "bg-gray-50"}`}>
      {/* FIXED SIDEBAR */}
      <aside className="w-64 h-full flex-shrink-0 z-20">
        <Sidebar />
      </aside>

      {/* SCROLLABLE CONTENT */}
      <main className="flex-1 h-full overflow-y-auto relative scroll-smooth">
        <div className="p-8 max-w-7xl mx-auto min-h-full">
           {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;