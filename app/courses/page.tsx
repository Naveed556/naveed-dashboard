import Header from "@/components/header";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardAction,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Premium_Courses = [
  {
    image: "/PPMC.webp",
    title: "Premium Pinterest Marketing Course",
    desc: "This course is specialy designed to understand deep insights of pinterest platform to get as much benefits as we can. Complete the full course to transform your self into a Pinterest Marketing Expert.",
    actualPrice: 299,
    discountedPrice: 100,
    tags: [
      "Multiple Account Strategy",
      "Pinterest Pins Seo",
      "Pinterest Pins Boost",
      "Guidelines for Website",
      "Paid VPN & Lifetime Support Chat",
    ],
  },
];

export default function CoursesPage() {
  return (
    <>
      <Header />
      <section className="relative md:min-h-svh flex flex-col items-center px-6 md:px-10 pb-14 md:pb-20 pt-28 bg-background overflow-hidden gap-4">
        {/* Lime glow in corner */}
        <div
          className="absolute -top-40 -right-40 w-140 h-140 rounded-full opacity-[0.2] pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, var(--lime) 0%, transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="text-center animate-fade-up delay-150">
          <h1 className="font-serif-display text-7xl leading-[0.95] tracking-tight text-foreground">
            <em className="text-primary not-italic">Premium</em> Courses
          </h1>
          <p className="text-muted-foreground">
            Explore Our Comprehensive Premium Courses
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-up delay-150">
          {Premium_Courses.map((course, index) => (
            <Card key={index}>
              <Image
                src={course.image}
                alt="Thumbnail"
                width={1920}
                height={1080}
              />
              <CardHeader>
                <CardTitle>
                  <h1 className="font-bold text-xl">{course.title}</h1>
                </CardTitle>
                <CardDescription>{course.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                {course.tags.map((tag, index) => (
                  <span key={index} className="flex items-center">
                    <Dot className="text-primary size-7" />{" "}
                    <Badge variant={"outline"}>{tag}</Badge>
                  </span>
                ))}
              </CardContent>
              <CardFooter className="mt-auto">
                <p className="mr-auto font-bold text-xl">
                  ${course.discountedPrice}
                  <del className="text-muted-foreground ml-2 text-xs">
                    ${course.actualPrice}
                  </del>
                </p>
                <CardAction>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant={"outline"}
                        className="hover:-translate-y-1"
                      >
                        View Reviews
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Pinterest Marketing Course Student Reviews
                        </DialogTitle>
                      </DialogHeader>
                      <div className="flex items-center justify-center max-w-[70vw] w-auto justify-self-center">
                        <Carousel className="w-full max-w-full">
                          <CarouselContent>
                            {Array.from({ length: 7 }).map((_, index) => (
                              <CarouselItem key={index}>
                                <Card>
                                  <CardContent className="flex items-center justify-center relative aspect-square">
                                    <Image
                                      src={`/ppmc-reviews/ss${index + 1}.jpeg`}
                                      alt="Thumbnail"
                                      fill
                                      objectFit="contain"
                                    />
                                  </CardContent>
                                </Card>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious />
                          <CarouselNext />
                        </Carousel>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Close</Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Link
                    href={`https://api.whatsapp.com/send?phone=923064358389&text=Hello!%20I%20want%20to%20Purchase%20${course.title}%2C%20Please%20Provide%20Payment%20Details.`}
                  >
                    <Button
                      variant={"default"}
                      className="hover:-translate-y-1"
                    >
                      Enroll Now
                    </Button>
                  </Link>
                </CardAction>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
