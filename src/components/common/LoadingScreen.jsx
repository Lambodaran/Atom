"use client";

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 overflow-hidden">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #ea580c 2px, transparent 2px), radial-gradient(circle at 75% 75%, #f97316 1px, transparent 1px)`,
            backgroundSize: "60px 60px, 40px 40px",
          }}
        ></div>
      </div>

      {/* Subtle animated rings */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <div
            key={`ring-${i}`}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              animationDelay: `${i * 0.8}s`,
            }}
          >
            <div
              className={`border border-[#ea580c]/20 rounded-full animate-ping`}
              style={{
                width: `${80 + i * 40}px`,
                height: `${80 + i * 40}px`,
                animationDuration: `${3 + i * 0.5}s`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Floating theme-inspired elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={`element-${i}`}
            className="absolute animate-float"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          >
            <div className="w-2 h-2 bg-[#ea580c]/30 transform rotate-45 rounded-sm shadow-lg"></div>
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-8 max-w-md">
        {/* Brand name with matching typography */}
        <div
          className={`transform transition-all duration-1200 ease-out opacity-100 translate-y-0`}
        >
          <h1 className="font-['Inter',Helvetica] font-bold text-gray-800 text-5xl md:text-6xl mb-2 tracking-wide">
            <span className="inline-block animate-[fade-in_1s_ease-out]">
              Atom Lift
            </span>
          </h1>

          {/* Subtitle matching your theme */}
          <p className="font-['Inter',Helvetica] font-normal text-gray-700 text-lg md:text-xl mb-12 animate-[fade-in_1s_ease-out_0.4s_both]">
            Your Business, Elevated.
          </p>
        </div>

        {/* Elegant loading animation */}
        <div
          className={`transform transition-all duration-1000 delay-500 opacity-100 translate-y-0`}
        >
          {/* Theme-inspired loading icon */}
          <div className="relative mx-auto mb-8 w-20 h-20">
            {/* Outer rotating ring */}
            <div
              className="absolute inset-0 border-2 border-transparent border-t-[#ea580c] border-r-[#f97316] rounded-full animate-spin"
              style={{ animationDuration: "3s" }}
            ></div>

            {/* Middle ring */}
            <div
              className="absolute inset-2 border border-transparent border-b-[#ea580c]/60 border-l-[#f97316]/60 rounded-full animate-spin"
              style={{ animationDuration: "2s", animationDirection: "reverse" }}
            ></div>

            {/* Inner element */}
            <div className="absolute inset-6 bg-gradient-to-br from-[#ea580c] to-[#f97316] rounded-full animate-pulse shadow-lg">
              <div className="absolute inset-1 bg-gradient-to-tl from-white/20 to-transparent rounded-full"></div>
            </div>

            {/* Center sparkle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full animate-ping opacity-90"></div>
            </div>
          </div>

          {/* Professional loading text */}
          <p className="font-['Inter',Helvetica] text-sm text-gray-700 font-normal tracking-[0.1em] uppercase">
            Loading...
          </p>
        </div>

        {/* Decorative elements matching your design */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-gradient-to-r from-[#ea580c]/5 to-[#f97316]/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-32 -right-32 w-64 h-64 bg-gradient-to-r from-[#f97316]/5 to-[#ea580c]/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
