import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, LucideIcon } from "lucide-react";

interface AdminFunctionCardProps {
     href: string;
     icon: LucideIcon;
     title: string;
     description: string;
     colorClass: string;
}

export function AdminFunctionCard({
     href,
     icon: Icon,
     title,
     description,
     colorClass,
}: AdminFunctionCardProps) {
     return (
          <Link href={href}>
               <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/50">
                    <CardContent className="p-6">
                         <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                   <div className={`p-3 ${colorClass} rounded-lg`}>
                                        <Icon className="w-6 h-6" />
                                   </div>
                                   <div>
                                        <h3 className="font-semibold text-lg">{title}</h3>
                                        <p className="text-sm text-muted-foreground">{description}</p>
                                   </div>
                              </div>
                              <ArrowRight className="w-5 h-5 text-muted-foreground" />
                         </div>
                    </CardContent>
               </Card>
          </Link>
     );
}
