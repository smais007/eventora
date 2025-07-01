import { Phone } from "lucide-react";

export default function EventSection() {
  return (
    <section className="bg-slate-900 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="relative px-6 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <p className="text-pink-500 font-semibold text-sm tracking-wider uppercase">
                  OUR EVENT DIRECTION
                </p>
                <h2 className="text-4xl font-bold text-white lg:text-5xl xl:text-6xl leading-tight">
                  Creating Memories
                  <br />
                  One Event Time
                </h2>
                <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                  Events bring people together for a shared experience and
                  celebration.
                  <br />
                  From weddings and birthdays to conferences.
                </p>
              </div>

              {/* Call to Action */}
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-500/20">
                  <Phone className="w-6 h-6 text-pink-500" />
                </div>
                <div>
                  <p className="text-white font-medium">Call Us</p>
                  <p className="text-white text-xl font-bold">(307) 555-0133</p>
                </div>
              </div>
            </div>

            {/* Right Stats Grid */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center">
                <div className="text-5xl font-bold text-white mb-2">100+</div>
                <div className="text-gray-400 text-sm">Our Event Artists</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center">
                <div className="text-5xl font-bold text-white mb-2">101+</div>
                <div className="text-gray-400 text-sm">Hours Of Music</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center">
                <div className="text-5xl font-bold text-white mb-2">10+</div>
                <div className="text-gray-400 text-sm">Event Stages</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center">
                <div className="text-5xl font-bold text-white mb-2">20+</div>
                <div className="text-gray-400 text-sm">Music Brands</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
