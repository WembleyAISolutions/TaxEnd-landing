import { Calculator } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Calculator className="h-6 w-6" />
            <span className="font-bold text-lg">TaxEnd.AI</span>
          </div>
          <p className="text-gray-400">
            © 2025 TaxEnd.AI - Smart Tax Solutions for Australia
          </p>
        </div>
      </div>
    </footer>
  );
}
