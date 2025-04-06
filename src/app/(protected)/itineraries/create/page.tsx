import CreateItineraryForm from "@/components/pages/itineraries/create-itinerary-form";

export default function CreateItineraryPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-[calc(100vh-9rem)]">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-3 tracking-tight">
          Create New <span className="text-primary">Itinerary</span>
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Plan your perfect trip step by step.
        </p>
      </div>
      <CreateItineraryForm />
    </div>
  );
}
