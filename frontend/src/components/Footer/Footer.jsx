import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white/95 backdrop-blur-sm sticky bottom-0 z-50">
      <div className="mx-auto max-w-7xl px-6 py-12 flex flex-col items-center">
        <div className="mb-8">
          <Link to="/" className="flex items-center justify-center">
            <span className="text-2xl font-bold text-black">Libra</span>
          </Link>
        </div>
        
        <div className="flex justify-center gap-8 mb-8">
          <Link to="/about" className="text-gray-600 hover:text-black transition-colors">
            About
          </Link>
          <a
            href="https://github.com/cburr0921/libra"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-black transition-colors"
          >
            GitHub
          </a>
        </div>

        <div className="text-center">
          <p className="text-sm leading-5 text-gray-600">
            &copy; {new Date().getFullYear()} Libra. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
