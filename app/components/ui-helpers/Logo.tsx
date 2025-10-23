"use client";
import Image from "next/image";
import { useTheme } from "next-themes";
function Logo({page}:{page?:string}) {
  const { theme } = useTheme();
  return (
    <>
      {
        page ? (
          <>
            {theme === "dark" ? (
            <Image
              src="/assets/bookwisedark-nobg.png"
              alt="Logo"
              width={125}
              height={50}
            />
            ) : (
              <Image
                src="/assets/bookwise1-nobg.png"
                alt="Logo"
                width={125}
                height={50}
              />
            )}
          </>
        ) : (
          <>
          {theme === "dark" ? (
            <Image
              src="/assets/bookwisedark-nobg.png"
              alt="Logo"
              width={175}
              height={50}
            />
            ) : (
              <Image
                src="/assets/bookwise1-nobg.png"
                alt="Logo"
                width={175}
                height={50}
              />
            )}
          </>
        )
      }
    </>
  );
}

export default Logo;
