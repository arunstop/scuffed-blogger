import { ReactNode } from "react";
import { useAuthCtx } from "../../../app/contexts/auth/AuthHook";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import ScrollTopButton from "../../components/main/ScrollTopButton";
import SearchModal from "../../components/main/SearchModal";
import Sidebar from "../../components/main/Sidebar";
import ToastContainer from "./ToastContainer";
import BottomBar from "./BottomBar";

function LayoutMainWrapper({ children }: { children: ReactNode }) {
  const {
    isLoggedIn,
    authStt: { user },
  } = useAuthCtx();
  return (
    <>
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
