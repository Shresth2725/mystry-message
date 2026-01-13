"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default function Home() {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            Mystery Message – Where your identity remains a secret.
          </p>
        </section>

        <Carousel
          className="w-full max-w-lg md:max-w-xl"
          plugins={[Autoplay({ delay: 2000 })]}
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card className="bg-white text-black">
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-start space-x-4">
                    <Mail className="mt-1 shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </main>

      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2023 Mystery Message. All rights reserved.
      </footer>
    </>
  );
}
