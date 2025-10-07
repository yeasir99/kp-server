import UserLayout from "@/components/layout/UserLayout";
import { ReactNode } from "react";
const layout = ({ children }: { children: ReactNode }) => {
  return <UserLayout children={children} />;
};

export default layout;
