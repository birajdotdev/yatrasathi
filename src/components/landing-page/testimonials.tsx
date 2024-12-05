import { Card, CardContent } from "../ui/card";
import Image from "next/image";

export default function Testimonials() {
  return (
    <section className="bg-gradient-to-b from-sky-100 to-emerald-100 py-16">
      <div className="container mx-auto px-4">
        <h2 className="mb-12 text-center text-3xl font-bold text-sky-800">
          What Our Travelers Say
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className="border-sky-200 bg-white transition-all hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-center">
                  <Image
                    src={`/placeholder.svg?text=User${i}`}
                    alt={`User ${i}`}
                    width={50}
                    height={50}
                    className="mr-4 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-sky-700">
                      Happy Traveler {i}
                    </h3>
                    <div className="flex text-yellow-400">
                      {[...Array<unknown>(5)].map((_, index) => (
                        <svg
                          key={index}
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-4 w-4"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-sky-600">
                  &quot;YatraSathi made planning my trip so easy! The
                  AI-generated itinerary was spot-on, and I discovered amazing
                  places I wouldn&apos;t have found otherwise.&quot;
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
