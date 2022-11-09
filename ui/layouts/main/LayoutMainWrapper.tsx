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
import { useRouter } from "next/router";

function LayoutMainWrapper({ children }: { children: ReactNode }) {
  const {
    isLoggedIn,
    authStt: { user },
  } = useAuthCtx();
  const [history] = useAtom(routeHistoryAtom);
  const router = useRouter();
  return (
    <>
      <div className="fixed inset-0 bg-red-500/20 pointer-events-none z-[200]">
        {history[history.length - 1]}
        {<br/>}
        {router.asPath}
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
