import Image from "next/image";
import { Inter } from "next/font/google";
import { ComboBox } from "@/components/ComboBox";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className=" flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <ComboBox />
    </main>
  );
}
