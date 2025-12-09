import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LampDarkModeToggle from './HeroHanger';

interface LampProduct {
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;
  attribution: string;
  photographerUrl: string;
}

interface Category {
  id: number;
  name: string;
  icon: string;
  description: string;
}

const LampCard: React.FC<{ lamp: LampProduct }> = ({ lamp }) => {
  const [isLit, setIsLit] = useState(false);

  return (
    <motion.div
      className={`relative rounded-xl overflow-hidden shadow-lg transition-all duration-500 cursor-pointer group ${
        isLit ? 'bg-gray-900' : 'bg-white'
      }`}
      whileHover={{ y: -8 }}
      onClick={() => setIsLit(!isLit)}
    >
      {/* Glow effect when lit */}
      <AnimatePresence>
        {isLit && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-yellow-400/20 to-transparent pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Image container */}
      <div className="relative h-64 overflow-hidden">
        <motion.img
          src={lamp.image}
          alt={`${lamp.name} - ${lamp.attribution}`}
          className="w-full h-full object-cover"
          animate={{
            filter: isLit
              ? 'brightness(1.3) saturate(1.2)'
              : 'brightness(1)',
          }}
          transition={{ duration: 0.5 }}
        />
        
        {/* Light indicator */}
        <motion.div
          className={`absolute top-4 right-4 w-3 h-3 rounded-full ${
            isLit ? 'bg-yellow-400' : 'bg-gray-400'
          }`}
          animate={{
            boxShadow: isLit
              ? '0 0 20px rgba(251,191,36,0.8)'
              : '0 0 0px rgba(0,0,0,0)',
          }}
        />

        {/* Click to toggle hint */}
        <div
          className={`absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            isLit ? 'bg-black/30' : 'bg-black/50'
          }`}
        >
          <span
            className={`text-sm font-medium px-4 py-2 rounded-full ${
              isLit ? 'bg-gray-900 text-yellow-400' : 'bg-white text-gray-900'
            }`}
          >
            {isLit ? '💡 Click to turn off' : '🌙 Click to light up'}
          </span>
        </div>
      </div>

      {/* Product info */}
      <div className={`p-6 ${isLit ? 'text-white' : 'text-gray-900'}`}>
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold">{lamp.name}</h3>
          <span
            className={`text-lg font-semibold ${
              isLit ? 'text-yellow-400' : 'text-gray-900'
            }`}
          >
            {lamp.price}
          </span>
        </div>
        <p
          className={`text-sm mb-3 ${
            isLit ? 'text-gray-400' : 'text-gray-600'
          }`}
        >
          {lamp.category}
        </p>
        <motion.button
          className={`w-full py-2 rounded-lg font-medium transition-colors ${
            isLit
              ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
              : 'bg-gray-900 text-white hover:bg-gray-800'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
};

const CategoryCard: React.FC<{ category: Category }> = ({ category }) => {
  return (
    <motion.div
      className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
      whileHover={{ y: -5 }}
    >
      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
        {category.icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">
        {category.name}
      </h3>
      <p className="text-gray-600">{category.description}</p>
    </motion.div>
  );
};

const LampStore: React.FC = () => {
  const categories: Category[] = [
    {
      id: 1,
      name: 'Desk Lamps',
      icon: '🖥️',
      description: 'Perfect lighting for your workspace',
    },
    {
      id: 2,
      name: 'Floor Lamps',
      icon: '🏠',
      description: 'Elegant standing lamps for any room',
    },
    {
      id: 3,
      name: 'Pendant Lights',
      icon: '💫',
      description: 'Stunning ceiling fixtures',
    },
    {
      id: 4,
      name: 'Smart Lamps',
      icon: '🤖',
      description: 'Technology meets illumination',
    },
  ];

  const products: LampProduct[] = [
    {
      id: 1,
      name: 'Modern Desk Pro',
      price: '$89.99',
      category: 'Desk Lamp',
      image: 'https://images.unsplash.com/photo-1549382534-df7ac84bf5bd?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw3fHxNb2Rlcm4lMjBkZXNrJTIwbGFtcCUyMHdpdGglMjBhZGp1c3RhYmxlJTIwYXJtJTIwb24lMjB3aGl0ZSUyMGJhY2tncm91bmQlMkMlMjBtaW5pbWFsaXN0JTIwZGVzaWduJTJDJTIwcHJvZHVjdCUyMHBob3RvZ3JhcGh5JTIwbGFtcCUyMGRlc2slMjBtb2Rlcm4lMjB3aGl0ZSUyMGJhY2tncm91bmR8ZW58MHwwfHx8MTc2NTI3Njc5MHww&ixlib=rb-4.1.0&q=85',
      attribution: 'CHUTTERSNAP on Unsplash',
      photographerUrl: 'https://unsplash.com/@chuttersnap',
    },
    {
      id: 2,
      name: 'Elegant Floor Stand',
      price: '$149.99',
      category: 'Floor Lamp',
      image: 'https://images.unsplash.com/photo-1552021883-9027221e7fee?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxMnx8RWxlZ2FudCUyMGZsb29yJTIwbGFtcCUyMHN0YW5kaW5nJTIwbGFtcCUyMHdpdGglMjB3YXJtJTIwbGlnaHQlMkMlMjBtb2Rlcm4lMjBpbnRlcmlvciUyMGRlc2lnbiUyQyUyMHByb2R1Y3QlMjBzaG90JTIwbGFtcCUyMGZsb29yJTIwc3RhbmRpbmclMjBtb2Rlcm58ZW58MHwwfHx8MTc2NTI3Njc5MHww&ixlib=rb-4.1.0&q=85',
      attribution: 'Regular Man on Unsplash',
      photographerUrl: 'https://unsplash.com/@regularman',
    },
    {
      id: 3,
      name: 'Sphere Pendant',
      price: '$129.99',
      category: 'Pendant Light',
      image: 'https://images.pexels.com/photos/15029042/pexels-photo-15029042.jpeg',
      attribution: 'Marta Dzedyshko on Pexels',
      photographerUrl: 'https://www.pexels.com/@marta-dzedyshko-1042863',
    },
    {
      id: 4,
      name: 'Vintage Classic',
      price: '$79.99',
      category: 'Table Lamp',
      image: 'https://images.pexels.com/photos/1846258/pexels-photo-1846258.jpeg',
      attribution: 'Brett Sayles on Pexels',
      photographerUrl: 'https://www.pexels.com/@brett-sayles',
    },
    {
      id: 5,
      name: 'Smart LED Pro',
      price: '$199.99',
      category: 'Smart Lamp',
      image: 'https://images.pexels.com/photos/28940484/pexels-photo-28940484.jpeg',
      attribution: 'Jakub Zerdzicki on Pexels',
      photographerUrl: 'https://www.pexels.com/@jakubzerdzicki',
    },
    {
      id: 6,
      name: 'Industrial Cage',
      price: '$109.99',
      category: 'Pendant Light',
      image: 'https://images.pexels.com/photos/1529897/pexels-photo-1529897.jpeg',
      attribution: 'Brett Sayles on Pexels',
      photographerUrl: 'https://www.pexels.com/@brett-sayles',
    },
    {
      id: 7,
      name: 'Minimalist Desk',
      price: '$69.99',
      category: 'Desk Lamp',
      image: 'https://images.unsplash.com/photo-1570974802254-4b0ad1a755f5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxOHx8TW9kZXJuJTIwZGVzayUyMGxhbXAlMjB3aXRoJTIwYWRqdXN0YWJsZSUyMGFybSUyMG9uJTIwd2hpdGUlMjBiYWNrZ3JvdW5kJTJDJTIwbWluaW1hbGlzdCUyMGRlc2lnbiUyQyUyMHByb2R1Y3QlMjBwaG90b2dyYXBoeSUyMGxhbXAlMjBkZXNrJTIwbW9kZXJuJTIwd2hpdGUlMjBiYWNrZ3JvdW5kfGVufDB8MHx8fDE3NjUyNzY3OTB8MA&ixlib=rb-4.1.0&q=85',
      attribution: 'Brina Blum on Unsplash',
      photographerUrl: 'https://unsplash.com/@brina_blum',
    },
    {
      id: 8,
      name: 'Geometric Pendant',
      price: '$139.99',
      category: 'Pendant Light',
      image: 'https://images.pexels.com/photos/973505/pexels-photo-973505.jpeg',
      attribution: 'Victor Freitas on Pexels',
      photographerUrl: 'https://www.pexels.com/@victorfreitas',
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section with Interactive Lamp */}
      <LampDarkModeToggle />

      {/* Categories Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-sky-50 to-white">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">
              Find the perfect lighting solution for every space
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <CategoryCard category={category} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Featured Lamps
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Click any lamp to see it light up! ✨
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full">
              <span className="text-2xl">💡</span>
              <span className="font-medium">
                Interactive lighting - Try clicking the lamps!
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((lamp, index) => (
              <motion.div
                key={lamp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <LampCard lamp={lamp} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600">
              Quality lighting solutions with exceptional service
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🚚',
                title: 'Free Shipping',
                description: 'On orders over $100',
              },
              {
                icon: '🔒',
                title: 'Secure Payment',
                description: '100% secure transactions',
              },
              {
                icon: '↩️',
                title: '30-Day Returns',
                description: 'Easy return policy',
              },
              {
                icon: '⭐',
                title: 'Premium Quality',
                description: 'Handpicked selection',
              },
              {
                icon: '💬',
                title: '24/7 Support',
                description: 'Always here to help',
              },
              {
                icon: '🌍',
                title: 'Eco-Friendly',
                description: 'Sustainable materials',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl p-8 shadow-lg text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4 text-yellow-400">
                LampStore
              </h3>
              <p className="text-gray-400">
                Illuminating your world with quality lighting solutions.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Shop</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">Desk Lamps</li>
                <li className="hover:text-white cursor-pointer">Floor Lamps</li>
                <li className="hover:text-white cursor-pointer">
                  Pendant Lights
                </li>
                <li className="hover:text-white cursor-pointer">Smart Lamps</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li className="hover:text-white cursor-pointer">Contact Us</li>
                <li className="hover:text-white cursor-pointer">
                  Shipping Info
                </li>
                <li className="hover:text-white cursor-pointer">Returns</li>
                <li className="hover:text-white cursor-pointer">FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Newsletter</h4>
              <p className="text-gray-400 mb-4">
                Subscribe for exclusive offers
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-yellow-400"
                />
                <button className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg font-medium hover:bg-yellow-400 transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 LampStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LampStore;