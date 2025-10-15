import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { BlurFade } from "@/components/ui/blur-fade";

interface Member {
  name: string;
  href?: string;
  role: string;
  image: string;
}

function MemberCard({ member }: { member: Member }) {
  return (
    <Link
      href={member.href ?? "#members"}
      target={member.href ? "_blank" : undefined}
      className="flex flex-col items-center text-center hover:scale-105 transition-transform"
    >
      <div className="max-h-70 max-w-59 w-full h-full rounded-lg">
        <Image
          src={member.image}
          alt={member.name}
          width={400}
          height={400}
          className="w-full h-auto rounded-md mb-4"
        />
        <h2 className="text-lg font-medium">{member.name}</h2>
        <p className="text-sm text-neutral-600">{member.role}</p>
      </div>
    </Link>
  );
}

function MemberGrid({
  title,
  members,
  className,
}: {
  title: string;
  members: Member[];
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs text-neutral-400">{title}</p>
      <div className={`flex py-3 gap-5 mt-3`}>
        {members.map((member, index) => (
          <MemberCard key={index} member={member} />
        ))}
      </div>
    </div>
  );
}

export function Members() {
  const membersData = {
    editors: [
      {
        name: "宮口 逞",
        role: "Owner & Chief Editor",
        image:
          "https://pbs.twimg.com/profile_images/1953082540832833536/JcdkMWMG_400x400.jpg",
      },
    ],
    photographers: [
      {
        name: "永田 耕平",
        role: "Chief Photographer",
        image:
          "https://pbs.twimg.com/profile_images/1953082540832833536/JcdkMWMG_400x400.jpg",
      },
      {
        name: "松野下 晃矢",
        role: "Photographer",
        image:
          "https://pbs.twimg.com/profile_images/1953082540832833536/JcdkMWMG_400x400.jpg",
      },
    ],
    programmers: [
      {
        name: "田中 博悠",
        href: "https://twitter.com/tanahiro2010",
        role: "Chief Programmer",
        image:
          "https://pbs.twimg.com/profile_images/1945969669770280960/yNmM0voi_400x400.jpg",
      },
      {
        name: "吉岡 和也",
        role: "Programmer",
        image:
          "https://pbs.twimg.com/profile_images/1953082540832833536/JcdkMWMG_400x400.jpg",
      },
      {
        name: "中塚 祐惺",
        role: "Programmer",
        image:
          "https://pbs.twimg.com/profile_images/1953082540832833536/JcdkMWMG_400x400.jpg",
      },
    ],
  };

  return (
    <div
      id="members"
      className="mt-10 w-full border-y border-neutral-200 bg-neutral-100"
    >
      <Container className="py-20">
        <h1 className="text-4xl font-semibold mb-1">
          Our <span className="text-green-900">Members</span>
        </h1>
        <p className="mb-8 text-neutral-500">
          それぞれ得意なことは違うけど、役割を分けてやるからチームとして成り立っています。
        </p>

        <div className="flex flex-col py-5 h-full">
          <div className="flex flex-col gap-y-20">
            <div className="flex gap-x-20 items-stretch">
              <BlurFade delay={0.4} inView>
                <MemberGrid title="編集者" members={membersData.editors} />
              </BlurFade>
              <BlurFade delay={0.5} inView>
                <MemberGrid
                  title="撮影者"
                  members={membersData.photographers}
                />
              </BlurFade>
            </div>

            <BlurFade delay={0.6} inView>
              <MemberGrid
                title="プログラマー"
                members={membersData.programmers}
              />
            </BlurFade>
          </div>
        </div>
      </Container>
    </div>
  );
}
