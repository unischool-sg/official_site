import Link from "next/link";
import Image from "next/image";
import { MoveUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { BlurFade } from "@/components/ui/blur-fade";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 pt-8 pb-25 mt-30">
      <Container>
        <div className="flex items-top justify-between">
          <BlurFade delay={0.5} inView>
            <div className="flex flex-col">
              <Image
                src="/assets/logo-edit.png"
                alt="Logo"
                width={100}
                height={141}
                className="w-36  h-auto grayscale"
              />
              <p className="text-xs text-neutral-400 mt-4">
                © 2025 Uni School. All rights reserved.
              </p>
              <p className="text-xs text-neutral-400 flex justify-center">
                当チームは
                <Link
                  href="https://www.sandagakuen.ed.jp/"
                  target="_blank"
                  className="underline flex items-center"
                >
                  三田学園中学校
                  <MoveUpRight size={10} />
                </Link>
                に属するチームです。
              </p>
            </div>
          </BlurFade>

          <nav className="flex space-x-6">
            <BlurFade delay={0.6} inView>
              <Link
                href="#about"
                className="text-neutral-950 hover:text-green-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                About
              </Link>
            </BlurFade>
            <BlurFade delay={0.7} inView>
              <Link
                href="#members"
                className="text-neutral-950 hover:text-green-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Members
              </Link>
            </BlurFade>
            <BlurFade delay={0.8} inView>
              <Link
                href="#achievements"
                className="text-neutral-950 hover:text-green-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                History
              </Link>
            </BlurFade>
            <BlurFade delay={0.9} inView>
              <Link
                href="/"
                className="text-neutral-950 hover:text-green-800 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Login
              </Link>
            </BlurFade>
          </nav>
        </div>
      </Container>
    </footer>
  );
}
