import dynamic from "next/dist/shared/lib/dynamic";
import { ReactNode } from "react";
import { AuthProvider } from "../../../app/contexts/auth/AuthProvider";
import { UiProvider } from "../../../app/contexts/ui/UiProvider";
import { UserModel } from "../../../base/data/models/UserModel";
import LayoutMainWrapper from "./LayoutMainWrapper";

const LazyNextNProgress = dynamic(() => import("nextjs-progressbar"), {
  ssr: false,
});

function LayoutAppWrapper({
  user,
  children,
}: {
  user?: UserModel;
  children: ReactNode;
}) {
  return (
    <AuthProvider initUser={user}>
      <UiProvider>
        <LazyNextNProgress
          color="hsl(var(--pc))"
          startPosition={0.4}
          stopDelayMs={200}
          height={6}
          showOnShallow={false}
        />
        <LayoutMainWrapper>{children}</LayoutMainWrapper>
      </UiProvider>
    </AuthProvider>
  );
}

export default LayoutAppWrapper;
