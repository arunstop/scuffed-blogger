import { ReactNode } from "react";
import { useAuthCtx } from "../../../app/contexts/auth/AuthHook";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import ScrollTopButton from "../../components/main/ScrollTopButton";
import SearchModal from "../../components/main/SearchModal";
import Sidebar from "../../components/main/Sidebar";
import ToastContainer from "./ToastContainer";
import BottomBar from "./BottomBar";
import { useAtom } from "jotai";
import { routeHistoryAtom } from "../../../app/hooks/RouteChangeHook";

function LayoutMainWrapper({ children }: { children: ReactNode }) {
  const {
    isLoggedIn,
    authStt: { user },
  } = useAuthCtx();
  const [history] = useAtom(routeHistoryAtom);
  return (
    <>
    <div className="fixed inset-0 bg-red-500/20 pointer-events-none z-[200]">
    {JSON.stringify(history)}
    </div>
      {/* Header for desktop */}
      <Header />
      {/* Children */}
      {children}
      {/* BottomBar for mobile */}
      <BottomBar />
      {/* Modal/Sidebar Containers */}
      <>
        <Sidebar />
        <SearchModal />
      </>
      {/* Footer */}
      <Footer />
      <ScrollTopButton />
      <ToastContainer />
    </>
  );
}

export default LayoutMainWrapper;
