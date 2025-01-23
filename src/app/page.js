import Link from "next/link";

export default function Home() {
  return (
    <div 
      className="h-full bg-brand_blue flex items-center justify-center min-h-screen gap-5 sm:p-20 font-[family-name:var(--font-geist-sans)] flex-col">
      <h1 className="text-xl text-white">Welcome to your managed project 
        <p className="text-xs text-right text-brand_green font-bold">
          powered by BD-Desk
        </p>
      </h1>
      <Link href={'/pages/login'}>
        <button className=" border rounded-lg p-2 border-white bg-brand_green hover:bg-opacity-50 text-white">
          Enter
        </button>
      </Link>
      
    </div>
  );
}
