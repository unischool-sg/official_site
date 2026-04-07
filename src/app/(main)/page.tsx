import type { Metadata } from "next";
import { BlurFade } from "@/components/ui/blur-fade";
import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Members } from "@/components/members";
import { Achievements } from "@/components/achievements";
import { User } from "@/lib/service/user";
import { metadata } from "../layout";

export async function generateMetadata(): Promise<Metadata> {
    const users = await User.all(false);
    const names = users.map((user) => user.name);
    const keywords = new Array();
    
    keywords.push(...metadata.keywords!);
    keywords.push(...names);
    
    return {
        keywords
    }
}

export default function Home() {
    return (
        <div className="flex flex-col gap-y-20">
            <BlurFade delay={0.8} inView>
                <Hero />
            </BlurFade>
            <About />
            <BlurFade delay={0.3} inView>
                <Members />
            </BlurFade>
            <BlurFade delay={0.3} inView>
                <Achievements />
            </BlurFade>
        </div>
    );
}
