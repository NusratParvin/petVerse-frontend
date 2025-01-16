import Footer from "@/src/components/shared/footer";
import { Navbar } from "@/src/components/shared/navbar";
import Login from "../login/page";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="aqua  relative flex flex-col h-screen">
      {/* <Navbar /> */}
      <main>{children}</main>
      {/* <Footer /> */}
      {/* <Login /> */}
    </div>
  );
}
