import { ReactNode } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import ScrollTopButton from "../../components/main/ScrollTopButton";
import SearchModal from "../../components/main/SearchModal";
import Sidebar from "../../components/main/Sidebar";
import BottomBar from "./BottomBar";
import ToastContainer from "./ToastContainer";

function LayoutMainWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      {/* <div className="fixed inset-0 bg-red-500/20 pointer-events-none z-[200]">
        {history[history.length - 1]}
        {<br/>}
        {router.asPath}
      </div> */}
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
