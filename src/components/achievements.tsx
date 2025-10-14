import { Container } from "@/components/ui/container"
import { BlurFade } from "@/components/ui/blur-fade"

export default function VideoCard({ youtubeId, title, description }: { youtubeId: string; title: string; description: string }) {
    return (
        <div className="flex flex-col">
            <div className="aspect-video mb-3">
                <iframe
                    className="w-full h-full rounded"
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title={title}
                    allowFullScreen
                />
            </div>
            <h2 className="text-lg font-semibold mb-1">{title}</h2>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}

const videos = [
    {
        youtubeId: "dQw4w9WgXcQ",
        title: "動画タイトル1",
        description: "これは説明文1です。"
    },
    {
        youtubeId: "dQw4w9WgXcQ",
        title: "動画タイトル2",
        description: "これは説明文2です。"
    },
    {
        youtubeId: "dQw4w9WgXcQ",
        title: "動画タイトル3",
        description: "これは説明文3です。"
    },
];

export function Achievements() {
    return (
        <Container id="achievements">
            <div className="flex flex-col">
                <BlurFade delay={0.4} inView>
                    <h1 className="text-4xl font-semibold mb-4">Our <span className="text-green-900">Achievements</span></h1>
                    <p className="mb-8 text-neutral-500">これまでの活動実績の一部をご紹介します。</p>
                </BlurFade>
                <BlurFade delay={0.5} inView>
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                        {videos.map((v) => (
                            <VideoCard key={v.youtubeId} {...v} />
                        ))}
                    </div>
                </BlurFade>
            </div>
        </Container>
    )
}