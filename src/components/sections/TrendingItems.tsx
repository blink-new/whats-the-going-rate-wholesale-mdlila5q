import { TrendingUp, TrendingDown, Eye, Heart } from 'lucide-react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

const trendingProducts = [
  {
    id: 1,
    name: 'Wireless Bluetooth Earbuds',
    category: 'Electronics',
    currentPrice: 12.50,
    previousPrice: 15.20,
    change: -17.8,
    minQuantity: 100,
    supplier: 'TechSource Wholesale',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=200&fit=crop',
    isCloseout: false,
    views: 1240
  },
  {
    id: 2,
    name: 'Premium Cotton T-Shirts',
    category: 'Clothing',
    currentPrice: 4.25,
    previousPrice: 3.80,
    change: 11.8,
    minQuantity: 500,
    supplier: 'Fashion Direct',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop',
    isCloseout: true,
    views: 890
  },
  {
    id: 3,
    name: 'LED Smart Bulb Set',
    category: 'Home & Garden',
    currentPrice: 8.90,
    previousPrice: 11.40,
    change: -21.9,
    minQuantity: 200,
    supplier: 'HomeLight Pro',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
    isCloseout: false,
    views: 2100
  },
  {
    id: 4,
    name: 'Fitness Resistance Bands',
    category: 'Sports',
    currentPrice: 6.75,
    previousPrice: 5.90,
    change: 14.4,
    minQuantity: 300,
    supplier: 'SportGear Plus',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop',
    isCloseout: true,
    views: 650
  }
]

export function TrendingItems() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-4">Trending Products</h2>
            <p className="text-muted-foreground">
              Most viewed and fastest-changing wholesale prices this week
            </p>
          </div>
          <Button variant="outline">
            View All Trends
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {trendingProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                {product.isCloseout && (
                  <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground">
                    Closeout
                  </Badge>
                )}
                <div className="absolute top-3 right-3 flex space-x-2">
                  <div className="bg-background/90 backdrop-blur-sm rounded-full p-2">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="bg-background/90 backdrop-blur-sm rounded-full p-2">
                    <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500 cursor-pointer" />
                  </div>
                </div>
              </div>
              
              <CardContent className="p-4">
                <div className="mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {product.category}
                  </Badge>
                </div>
                
                <h3 className="font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      ${product.currentPrice}
                    </p>
                    <p className="text-sm text-muted-foreground line-through">
                      ${product.previousPrice}
                    </p>
                  </div>
                  
                  <div className={`flex items-center space-x-1 ${
                    product.change > 0 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {product.change > 0 ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">
                      {Math.abs(product.change)}%
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1 text-sm text-muted-foreground mb-4">
                  <p>Min Qty: {product.minQuantity} units</p>
                  <p>Supplier: {product.supplier}</p>
                  <p className="flex items-center">
                    <Eye className="h-3 w-3 mr-1" />
                    {product.views} views
                  </p>
                </div>
                
                <Button className="w-full" size="sm">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}