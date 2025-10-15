import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { BlurFade } from "@/components/ui/blur-fade";

export function Header() {
  return (
    <Container className="bg-white max-w-6xl w-full mx-auto">
      <div className="flex justify-between items-center h-16 pt-3">
        <div className="flex-shrink-0">
          <Image src={"/assets/logo.png"} alt="Logo" width={120} height={40} />
        </div>

        <nav className="flex justify-center items-center space-x-4">
          <BlurFade delay={0.5} inView>
            <Link
              href="#about"
              className="text-neutral-950 hover:text-green-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              About
            </Link>
          </BlurFade>
          <BlurFade delay={0.6} inView>
            <Link
              href="#members"
              className="text-neutral-950 hover:text-green-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Members
            </Link>
          </BlurFade>
          <BlurFade delay={0.7} inView>
            <Link
              href="#achievements"
              className="text-neutral-950 hover:text-green-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              History
            </Link>
          </BlurFade>
          <BlurFade delay={0.7} inView>
            <Link
              href="/blogs"
              className="text-neutral-950 hover:text-green-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Blogs
            </Link>
          </BlurFade>

          <Link href="/">
            <BlurFade delay={0.8} inView>
              <Link href={`/login`}>
                <Button className="bg-neutral-950 hover:bg-neutral-900 text-white cursor-pointer px-5 py-2 rounded-sm text-sm font-medium transition-colors">
                  Login
                </Button>
              </Link>
            </BlurFade>
          </Link>
        </nav>
      </div>
    </Container>
  );
}
