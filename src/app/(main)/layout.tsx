import { BlurFade } from "@/components/ui/blur-fade";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { User } from "@/lib/service/user";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await User.current();

  return (
    <div className="pt-3 mx-auto flex font-sans flex-col">
      <BlurFade delay={0.4} inView>
        <Header user={user} />
      </BlurFade>
      <main>{children}</main>
      <BlurFade delay={0.4} inView>
        <Footer user={user} />
      </BlurFade>
    </div>
  );
}
