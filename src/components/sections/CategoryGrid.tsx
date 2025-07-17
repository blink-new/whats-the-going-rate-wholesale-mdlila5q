import { 
  Smartphone, 
  Shirt, 
  Home, 
  Gamepad2, 
  Heart, 
  Car, 
  Dumbbell, 
  Book,
  ArrowRight
} from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'

const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
    icon: Smartphone,
    count: '12,450',
    trend: '+5.2%',
    color: 'text-blue-600 bg-blue-50'
  },
  {
    id: 'clothing',
    name: 'Clothing & Apparel',
    icon: Shirt,
    count: '8,920',
    trend: '+3.1%',
    color: 'text-purple-600 bg-purple-50'
  },
  {
    id: 'home',
    name: 'Home & Garden',
    icon: Home,
    count: '15,680',
    trend: '+7.8%',
    color: 'text-green-600 bg-green-50'
  },
  {
    id: 'toys',
    name: 'Toys & Games',
    icon: Gamepad2,
    count: '6,340',
    trend: '+12.4%',
    color: 'text-orange-600 bg-orange-50'
  },
  {
    id: 'health',
    name: 'Health & Beauty',
    icon: Heart,
    count: '9,870',
    trend: '+4.6%',
    color: 'text-pink-600 bg-pink-50'
  },
  {
    id: 'automotive',
    name: 'Automotive',
    icon: Car,
    count: '4,520',
    trend: '+2.3%',
    color: 'text-red-600 bg-red-50'
  },
  {
    id: 'sports',
    name: 'Sports & Outdoors',
    icon: Dumbbell,
    count: '7,890',
    trend: '+6.7%',
    color: 'text-indigo-600 bg-indigo-50'
  },
  {
    id: 'books',
    name: 'Books & Media',
    icon: Book,
    count: '3,210',
    trend: '+1.9%',
    color: 'text-amber-600 bg-amber-50'
  }
]

export function CategoryGrid() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore wholesale pricing across different product categories. 
            Each category shows live product counts and market trends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <Card 
                key={category.id}
                className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/30"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${category.color}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Products</p>
                      <p className="font-semibold">{category.count}</p>
                    </div>
                  </div>
                  
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-600 font-medium">
                      {category.trend}
                    </span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Categories
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}