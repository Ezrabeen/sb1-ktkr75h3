import { ShieldCheck, Recycle, Leaf, Zap } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-primary-500" />,
      title: "Secure Transactions",
      description:
        "All transactions are secured by VeChain blockchain technology, ensuring transparency and immutability.",
    },
    {
      icon: <Recycle className="h-6 w-6 text-primary-500" />,
      title: "Sustainable Marketplace",
      description: "Our platform promotes sustainable and ethically sourced products, reducing environmental impact.",
    },
    {
      icon: <Leaf className="h-6 w-6 text-primary-500" />,
      title: "Eco-Friendly",
      description:
        "VeChain's proof-of-authority consensus mechanism is more energy-efficient than traditional blockchains.",
    },
    {
      icon: <Zap className="h-6 w-6 text-primary-500" />,
      title: "Fast & Efficient",
      description: "Experience quick transaction times and low fees on the VeChain Thor blockchain.",
    },
  ]

  return (
    <div className="bg-white dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            A better way to trade sustainable goods
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
            ReVive leverages blockchain technology to create a transparent and sustainable marketplace.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div key={index} className="relative">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary-100 dark:bg-primary-900 text-white">
                  {feature.icon}
                </div>
                <div className="mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="mt-2 text-base text-gray-500 dark:text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

