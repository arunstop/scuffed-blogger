import NextNProgress from "nextjs-progressbar";
import { ReactNode } from "react";
import { AuthProvider } from "../../utils/contexts/auth/AuthProvider";
import { UiProvider } from "../../utils/contexts/ui/UiProvider";
import { UserModel } from "../../utils/data/models/UserModel";
import LayoutMainWrapper from "./LayoutMainWrapper";

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
        <NextNProgress
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
