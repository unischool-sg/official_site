import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { BlurFade } from "@/components/ui/blur-fade";
import { User } from "@/lib/service/user";

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

interface MemberData {
     name: string;
     role: string;
     image: string;
}

interface MembersData {
     EDIT: MemberData[];
     DEVELOP: MemberData[];
     VIDEO: MemberData[];
}

export async function Members() {
     const users = await User.all(true);
     const publicUsers = users.filter((user) => user.profile?.isPublic);
     console.log("[Members] Total users fetched:", users.length);
     console.log("[Members] Public profiles found:", publicUsers.length);
     // VIDEO: 'VIDEO',
     // EDIT: 'EDIT',
     // DEVELOP: 'DEVELOP'
     const membersData: MembersData = { EDIT: [], DEVELOP: [], VIDEO: [] };

     publicUsers.forEach((user) => {
          console.log("[Members] Public user found:", {
               id: user.id,
               name: user.name,
               profile: user.profile,
               team: user.team,
          });

          if (["EDIT", "DEVELOP", "VIDEO"].includes(user.team) && user.profile && user.profile.isPublic) {
               console.log("[Members] Adding user to team:", user);
               membersData[user.team as keyof MembersData].push({
                    name: user.name,
                    role: user.role,
                    image: user.profile.avatarUrl || "/assets/logo.png",
               });
          }
     });

     console.log("[Members] Compiled members data:", membersData);

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
                                        <MemberGrid
                                             title="編集者"
                                             members={membersData.EDIT}
                                        />
                                   </BlurFade>
                                   <BlurFade delay={0.5} inView>
                                        <MemberGrid
                                             title="撮影者"
                                             members={membersData.VIDEO}
                                        />
                                   </BlurFade>
                              </div>

                              <BlurFade delay={0.6} inView>
                                   <MemberGrid
                                        title="プログラマー"
                                        members={membersData.DEVELOP}
                                   />
                              </BlurFade>
                         </div>
                    </div>
               </Container>
          </div>
     );

}