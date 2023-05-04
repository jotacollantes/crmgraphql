import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
      
        {/* Cargamos Normalize, elimina margenes */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" integrity="sha512-NhSC1YmyruXifcj/KFRWoC561YpHpc5Jtzgvbuzx5VozKpWvQ+4nXhPdFgmx8xqexRcpAglTj9sIBWINXa8x5w==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
        {/* Cargamos Tailwind via cdn */}
        <link
      href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css"
      rel="stylesheet"
    />
      
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}