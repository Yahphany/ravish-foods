import React from "react";
import Layout from "../component/Layout";
import { Link } from "react-router-dom";
import { ArrowRight, Clock, Shield, Truck } from "lucide-react";

export default function Landing() {
  return (
    <Layout>
      <div className="min-h-screen w-full pt-20 pb-10 px-10 md:px-20 flex flex-col-reverse justify-end md:justify-center md:flex-row gap-10">
        {/* Text Content */}
        <div className="w-full md:w-[50%] flex flex-col justify-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-5">
            Delicious food delivered to your door
          </h1>
          <p className="text-xl mb-5">
            Order from the best restaurants in your area. Fresh, fast, and
            always delicious.
          </p>
          <div className="flex gap-3">
            <Link className="bg-orange-400 text-white p-2 rounded-lg">
              Order now
            </Link>
            <Link className="bg-orange-400 text-white p-2 rounded-lg flex w-30 items-center">
              View menu <ArrowRight />
            </Link>
          </div>
        </div>

        {/* Image Content */}
        <div className="w-full md:w-[50%] flex items-center">
          <img
            className="rounded-lg w-full h-auto object-cover"
            src="https://images.unsplash.com/photo-1644946763226-22c60fcb6635?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwZGVsaXZlcnklMjByZXN0YXVyYW50fGVufDF8fHx8MTc3MzY2NzI5N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="food"
          />
        </div>
      </div>

      <section className="py-10 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-xl md:text-3xl font-bold text-center mb-12">
            Why Choose FoodHub?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">
                Get your food delivered in 30 minutes or less
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">
                Fresh ingredients from trusted restaurants
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Live Tracking</h3>
              <p className="text-gray-600">Track your order in real-time</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-10 px-10 md:px-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-3xl font-bold mb-4">
              Popular Dishes
            </h2>
            <p className="text-gray-600">Check out our most loved items</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {[
              {
                name: "Classic Burger",
                image:
                  "https://images.unsplash.com/photo-1625331725309-83e4f3c1373b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZWxpY2lvdXMlMjBidXJnZXIlMjBmb29kfGVufDF8fHx8MTc3Mzc2MzM3N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
              },
              {
                name: "Margherita Pizza",
                image:
                  "https://images.unsplash.com/photo-1667422542005-eb6909ac24c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMHNsaWNlJTIwZm9vZHxlbnwxfHx8fDE3NzM3NjE0MDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
              },
              {
                name: "Fresh Sushi",
                image:
                  "https://images.unsplash.com/photo-1764183122524-974ccfb709fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXNoaSUyMHBsYXR0ZXIlMjBmb29kfGVufDF8fHx8MTc3Mzc0OTE0NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
              },
              {
                name: "Creamy Pasta",
                image:
                  "https://images.unsplash.com/photo-1676300184847-4ee4030409c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGRpc2glMjBmb29kfGVufDF8fHx8MTc3MzY5OTI3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-center">{item.name}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <Link
              to="/menu"
              className="bg-orange-600 hover:bg-orange-700 flex w-35 p-2 rounded-lg text-white text-sm"
            >
              View Full Menu
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
