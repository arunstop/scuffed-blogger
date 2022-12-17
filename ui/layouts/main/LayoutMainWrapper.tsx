import dynamic from "next/dynamic";
import { ReactNode } from "react";
const LazyFooter = dynamic(() => import("../../components/Footer"), {
  ssr: false,
});
const LazyHeader = dynamic(() => import("../../components/Header"), {
  ssr: false,
});
const LazyScrollTopButton = dynamic(
  () => import("../../components/main/ScrollTopButton"),
  { ssr: false },
);
const LazySearchModal = dynamic(
  () => import("../../components/main/SearchModal"),
  { ssr: false },
);
const LazySidebar = dynamic(() => import("../../components/main/Sidebar"), {
  ssr: false,
});
const LazyBottomBar = dynamic(() => import("./BottomBar"), { ssr: false });
const LazyToastContainer = dynamic(() => import("./ToastContainer"), {
  ssr: false,
});

function LayoutMainWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      {/* <div className="fixed inset-0 bg-red-500/20 pointer-events-none z-[200]">
        {history[history.length - 1]}
        {<br/>}
        {router.asPath}
      </div> */}
      {/* Header for desktop */}
      <LazyHeader />
      {/* Children */}
      {children}
      {/* BottomBar for mobile */}
      <LazyBottomBar />
      {/* Modal/Sidebar Containers */}
      <>
        <LazySidebar />
        <LazySearchModal />
      </>
      {/* Footer */}
      <LazyFooter />
      <LazyScrollTopButton />
      <LazyToastContainer />
    </>
  );
}

export default LayoutMainWrapper;
