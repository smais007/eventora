import { Calendar, MapPin, Users } from "lucide-react";

import { Card, CardContent } from "./ui/card";

const Features = () => {
  const features = [
    {
      icon: Calendar,
      title: "Create Events",
      description:
        "Easily create and manage your events with our intuitive interface.",
    },
    {
      icon: Users,
      title: "Join Community",
      description: "Connect with like-minded people and attend amazing events.",
    },
    {
      icon: MapPin,
      title: "Find Local Events",
      description:
        "Discover events happening near you with advanced search filters.",
    },
  ];
  return (
    <div>
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why should you join our event
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to create, manage, and attend events in one
              place.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow"
              >
                <CardContent className="pt-8">
                  <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
