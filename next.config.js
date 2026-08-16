/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Local images in /public are always allowed. Keep supabase for any
    // future remote product photos that may come from the storage bucket.
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" }
    ]
  }
};

module.exports = nextConfig;
