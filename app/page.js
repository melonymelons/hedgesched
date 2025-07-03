import {Button} from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent} from "@/components/ui/card";
import { ArrowRight, Calendar, Clock, LinkIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    icon: Calendar,
    title: "创建活动",
    description: "轻松设置和自定义您的活动类型",
  },
  {
    icon: Clock,
    title: "管理可用性",
    description: "定义您的可预约时间，让日程安排更高效",
  },
  {
    icon: LinkIcon,
    title: "自定义链接",
    description: "分享您的专属预约链接",
  },
];

const howItWorks = [
  { step: "Sign Up", description: "Create your free Schedulrr account" },
  {
    step: "Set Availability",
    description: "Define when you're available for meetings",
  },
  {
    step: "Share Your Link",
    description: "Send your scheduling link to clients or colleagues",
  },
  {
    step: "Get Booked",
    description: "Receive confirmations for new appointments automatically",
  },
];

export default function Home() {
  return (
    <main className = "container mx-auto px-4 py-16">
      <div className = "flex flex-col lg:flex-row items-center justify-between gap-12 mb-24">
        <div className = "lg:w-1/2">
            <h1 className = "text-7xl font-extrabold pb-6 gradient-title text-white"> HEDGE 课程排课</h1>
            <p className = "text-xl text-gray-800 mb-6">用于与教师预定活动、查看教室可用性以及加入会议</p>
            <Link href='/dashboard'> <Button size="lg" className="text-lg">Get Started <ArrowRight className="ml-2 h-5 w-5"/></Button></Link>
          </div>

          <div className = "lg:w-1/2 flex justify-center">
            <div className ="relative w-full max-w-md aspect-square">
            <Image src='/hedgeposter (1).png'
              alt = "HEDGE Illustration"
             layout="fill"
             objectFit="contain"
             />
            </div>
        </div>
      </div>
      <div className="mb-24">
        <h2 className="text 3xl font-bold text-center mb-12 text-black">主要特点</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">{features.map((feature,index)=>{
        return (
          <Card key = {index}>
          <CardHeader>
            <feature.icon className="w-12 h-12 text-black mb-4 mx-auto"/>
            <CardTitle className = "text-center text-black"> {feature.title} </CardTitle>
          </CardHeader>
          <CardContent>
            <p className = "text-center text-gray-600">{feature.description}</p>
          </CardContent>
        </Card>
        );
        })}</div>
      </div>
    </main>
  );
}
