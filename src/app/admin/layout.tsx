import AdminLayout from "@/components/layout/AdminLayout";
import { ReactNode } from "react";
const layout = ({ children }: { children: ReactNode }) => {
  return <AdminLayout children={children} />;
};

export default layout;
