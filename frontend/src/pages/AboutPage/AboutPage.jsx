import { Link } from 'react-router-dom';
import libraryHero from '../../assets/images/library-hero.jpg';

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src={libraryHero}
            alt="Library interior with warm lighting and rows of books"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/70 mix-blend-multiply" />
        </div>

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-14 sm:pb-32 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">
              About Libra
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              Welcome to Libra, your personal library management system. This platform helps you organize, track, and discover books in your collection.
            </p>
            <p className="mt-4 text-lg leading-8 text-gray-300">
              Built with modern web technologies and designed with user experience in mind, Libra makes managing your personal library effortless and enjoyable.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/"
                className="rounded-md bg-white/10 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20 backdrop-blur-sm"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
