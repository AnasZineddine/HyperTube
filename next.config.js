module.exports = {
  images: {
    domains: ["yts.mx", "image.tmdb.org"],
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: "/:path*",
          destination: `http://popcorn-ru.tk/:path*`,
        },
      ],
    };
  },
};
