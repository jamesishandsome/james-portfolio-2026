import Sidebar from "./Sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar />
      <main className="flex-1 bg-gradient-to-b from-surfaceHighlight to-background m-2 rounded-lg overflow-y-auto relative scrollbar-hide">
        <div className="p-8 pb-32">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
