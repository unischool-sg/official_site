import { UsersRound, BicepsFlexed, School, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { BlurFade } from "@/components/ui/blur-fade";

function GridCard({
    icon: Icon,
    title,
    children,
}: {
    icon: React.ElementType;
    title: React.ReactNode;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col bg-neutral-100 border border-neutral-200 rounded-xl p-6 sm:p-10 h-full">
            <Icon className="text-green-900 mb-2" size={30} />
            <h1 className="text-2xl lg:text-3xl font-semibold mb-4">{title}</h1>
            <p className="flex-grow">{children}</p>
        </div>
    );
}

export function About() {
    return (
        <Container id="about" className="mt-25">
            <BlurFade delay={0.7} inView>
                <div className="flex flex-col md:flex-row bg-neutral-100 border border-neutral-200 w-full rounded-xl mx-auto p-6 sm:p-10 gap-6 md:gap-10">
                    <div className="flex flex-col shrink-0">
                        <UsersRound className="text-green-900 mb-2" size={30} />
                        <h1 className="text-3xl sm:text-4xl font-semibold mb-4">
                            What are <span className="text-green-900">We</span>?
                        </h1>
                    </div>
                    <div className="flex-1">
                        <p>
                            私たちは中・高校生が立ち上げた「UniSchool」という学生の学びと学校を支える事業グループです。<br />

                            学生向けの勉強サポートツールの開発をはじめ、学校・教育機関向けの広報動画やPR映像の制作など、教育をさまざまな形で支援しています。<br />

                            「学生だからできない」ではなく、「学生だからこそできる」発想と行動力で、新しい価値を生み出すことを目指しています。<br />

                            教育とクリエイティブを通して、すべての学生が挑戦しやすい未来を目指しています。<br />
                        </p>
                    </div>
                </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full mx-auto pt-4">
                <BlurFade delay={0.8} inView>
                    <GridCard
                        icon={BicepsFlexed}
                        title={
                            <>
                                チーム
                                <span className="text-green-900">ワーク</span>
                            </>
                        }
                    >
                        一人じゃできないことも、みんなで動けば形になる。お互いの「ここもう少しこうした方がいいよ」って意見も言い合える関係です。
                    </GridCard>
                </BlurFade>

                <BlurFade delay={0.9} inView>
                    <GridCard
                        icon={School}
                        title={
                            <>
                                学生だからこそ出せる
                                <span className="text-green-900">アイデア</span>
                            </>
                        }
                    >
                        プロのような技術や予算はないけど、発想は自由。変に制限されないから、思いついたことをどんどん形にしています。
                    </GridCard>
                </BlurFade>

                <BlurFade delay={1} inView>
                    <GridCard
                        icon={Sparkles}
                        title={
                            <>
                                成長し続ける
                                <span className="text-green-900">気持ち</span>
                            </>
                        }
                    >
                        毎回「前より良くしたい」と思って挑戦しているので、同じような動画でも少しずつ工夫が増えてます。
                    </GridCard>
                </BlurFade>
            </div>
        </Container>
    );
}
