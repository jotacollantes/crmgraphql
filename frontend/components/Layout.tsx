import Head from "next/head";
import React from "react";
import Sidebar from "./Sidebar";
import { useRouter } from "next/router";
import Header from "./Header";

interface Props {
  children: JSX.Element | JSX.Element[];
}
const Layout = ({ children }: Props) => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Adminstracion de Clientes</title>
      </Head>

      {router.pathname==="/auth/login" || router.pathname==="/auth/register" ?
      (<div className="bg-gray-800 min-h-screen flex flex-col justify-center">
        <div>
          {children}
        </div>
            
          
      </div>)
      :
      (<div className="bg-gray-200 min-h-screen">
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="sm:w-2/3 xl:w-4/5 sm:min-h-screen p-5">
          <Header />
          {children}
        </main>
      </div>
    </div>)
      }

      
    </>
  );
};

export default Layout;
