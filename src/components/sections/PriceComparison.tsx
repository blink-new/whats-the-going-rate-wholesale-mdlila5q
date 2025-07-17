import { Star, MapPin, Package, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

const comparisonData = {
  product: {
    name: 'Wireless Bluetooth Earbuds - Premium Quality',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop'
  },
  suppliers: [
    {
      id: 1,
      name: 'TechSource Wholesale',
      price: 12.50,
      minQuantity: 100,
      maxQuantity: 5000,
      rating: 4.8,
      location: 'California, USA',
      shippingTime: '3-5 days',
      inStock: true,
      isCloseout: false,
      lastUpdated: '2 hours ago'
    },
    {
      id: 2,
      name: 'Global Electronics Hub',
      price: 13.20,
      minQuantity: 50,
      maxQuantity: 10000,
      rating: 4.6,
      location: 'Shenzhen, China',
      shippingTime: '7-14 days',
      inStock: true,
      isCloseout: false,
      lastUpdated: '4 hours ago'
    },
    {
      id: 3,
      name: 'Closeout Express',
      price: 10.80,
      minQuantity: 500,
      maxQuantity: 2000,
      rating: 4.2,
      location: 'New York, USA',
      shippingTime: '2-4 days',
      inStock: true,
      isCloseout: true,
      lastUpdated: '1 hour ago'
    },
    {
      id: 4,
      name: 'Bulk Electronics Pro',
      price: 14.75,
      minQuantity: 25,
      maxQuantity: 1000,
      rating: 4.9,
      location: 'Texas, USA',
      shippingTime: '1-3 days',
      inStock: false,
      isCloseout: false,
      lastUpdated: '6 hours ago'
    }
  ]
}

export function PriceComparison() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Price Comparison</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compare prices from multiple verified suppliers to find the best wholesale deals
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Product Header */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex items-center space-x-6">
                <img 
                  src={comparisonData.product.image} 
                  alt={comparisonData.product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {comparisonData.product.category}
                  </Badge>
                  <h3 className="text-xl font-semibold mb-2">
                    {comparisonData.product.name}
                  </h3>
                  <p className="text-muted-foreground">
                    Comparing {comparisonData.suppliers.length} suppliers
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supplier Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comparisonData.suppliers.map((supplier, index) => (
              <Card 
                key={supplier.id} 
                className={`relative ${
                  index === 0 ? 'ring-2 ring-primary ring-offset-2' : ''
                } ${!supplier.inStock ? 'opacity-60' : ''}`}
              >
                {index === 0 && (
                  <Badge className="absolute -top-3 left-4 bg-primary">
                    Best Value
                  </Badge>
                )}
                {supplier.isCloseout && (
                  <Badge className="absolute -top-3 right-4 bg-accent">
                    Closeout Deal
                  </Badge>
                )}
                
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{supplier.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {/* Price */}
                    <div className="text-center py-4 bg-muted/50 rounded-lg">
                      <p className="text-3xl font-bold text-primary">
                        ${supplier.price}
                      </p>
                      <p className="text-sm text-muted-foreground">per unit</p>
                    </div>
                    
                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                          Min Quantity
                        </span>
                        <span className="font-medium">{supplier.minQuantity} units</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          Location
                        </span>
                        <span className="font-medium">{supplier.location}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          Shipping
                        </span>
                        <span className="font-medium">{supplier.shippingTime}</span>
                      </div>
                    </div>
                    
                    {/* Stock Status */}
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${
                        supplier.inStock ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {supplier.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Updated {supplier.lastUpdated}
                      </span>
                    </div>
                    
                    {/* Action Button */}
                    <Button 
                      className="w-full" 
                      disabled={!supplier.inStock}
                      variant={index === 0 ? 'default' : 'outline'}
                    >
                      {supplier.inStock ? 'Contact Supplier' : 'Notify When Available'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}