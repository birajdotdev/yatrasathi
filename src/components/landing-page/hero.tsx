import { Search } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative">
      <div className="relative">
        <Image
          src="https://images.pexels.com/photos/1051075/pexels-photo-1051075.jpeg?auto=compress&cs=tinysrgb&dpr=1&height=600&width=1600"
          alt="Travel Destination"
          width={1600}
          height={600}
          className="h-[400px] w-full object-cover md:h-[600px]"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-sky-900/70 to-emerald-900/70">
          <div className="mx-auto max-w-3xl space-y-4 p-4 text-center text-white">
            <h1 className="text-3xl font-bold md:text-5xl lg:text-6xl">
              Your Next Adventure, Just a Click Away
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl">
              Plan personalized itineraries effortlessly with AI-driven insights
            </p>
            <div className="mx-auto flex max-w-md items-center overflow-hidden rounded-full bg-white">
              <Input
                className="flex-grow border-none px-4 focus:ring-0"
                type="text"
                placeholder="Where do you want to go?"
              />
              <Button className="rounded-r-full bg-emerald-600 text-white hover:bg-emerald-700">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
