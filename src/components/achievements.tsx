import { Container } from "@/components/ui/container";
import { BlurFade } from "@/components/ui/blur-fade";

export default function VideoCard({
     title,
     description,
     driveId,
}: {
     title: string;
     description: string;
     driveId: string;
}) {
     return (
          <div className="flex flex-col">
               <div className="aspect-video mb-3">
                    <iframe
                         className="w-full h-full rounded"
                         src={`https://drive.google.com/file/d/${driveId}/preview`}
                         title={title}
                         allowFullScreen
                    />
               </div>
               <h2 className="text-lg font-semibold mb-1">{title}</h2>
               <p className="text-gray-600">{description}</p>
          </div>
     );
}

interface Video {
     driveId: string;
     title: string;
     description: string;
}

const videos: Video[] = [
     {
          driveId: "1I6UiYdQghoNLbf0Vs7GNLCsw7GQdOu-S",
          title: "三田学園中学校陸上部紹介",
          description: "三田学園中学校の陸上部を紹介しています。",
     },
     {
          // https://drive.google.com/file/d/1-hn-zpipT22EiQerrVAoKYcjxIhFXLDr/view?usp=drive_link
          driveId: "1-hn-zpipT22EiQerrVAoKYcjxIhFXLDr",
          title: "ラーニングコンパス紹介動画",
          description: "三田学園で行われている、教育の方向性を生徒や教員主体で考え、学びの幅を広げていく、ラーニングコンパスという活動の紹介動画です。",
     },
     {
          // https://drive.google.com/file/d/1S5T54uS6-FqfpfPgGdjg6ZTuRZ2_qHlP/view?usp=drive_link
          driveId: "1S5T54uS6-FqfpfPgGdjg6ZTuRZ2_qHlP",
          title: "三田学園Map紹介",
          description: "三田学園の校内施設を紹介しています。",
     },
];

export function Achievements() {
     return (
          <Container id="achievements">
               <div className="flex flex-col">
                    <BlurFade delay={0.4} inView>
                         <h1 className="text-4xl font-semibold mb-4">
                              Our{" "}
                              <span className="text-green-900">
                                   Achievements
                              </span>
                         </h1>
                         <p className="mb-8 text-neutral-500">
                              これまでの活動実績の一部をご紹介します。
                         </p>
                    </BlurFade>
                    <BlurFade delay={0.5} inView>
                         <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
                              {videos.map((v) => (
                                   <VideoCard key={v.driveId} {...v} />
                              ))}
                         </div>
                    </BlurFade>
               </div>
          </Container>
     );
}
