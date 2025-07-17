import { useState, useEffect } from 'react'
import { Search, Filter, Heart, TrendingUp, TrendingDown, Package, Star, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Separator } from '../ui/separator'
import { blink } from '../../blink/client'

// Mock product data
const mockProducts = [
  {
    id: '1',
    name: 'Apple iPhone 14 Pro Max',
    description: 'Latest flagship smartphone with advanced camera system',
    category: 'Electronics',
    brand: 'Apple',
    sku: 'IPH14PM-128-DPP',
    currentPrice: 899.99,
    wholesalePrice: 749.99,
    closeoutPrice: 649.99,
    minOrderQuantity: 10,
    supplierName: 'TechSource Wholesale',
    availabilityStatus: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    tags: ['smartphone', 'premium', 'latest'],
    priceChange: -5.2,
    rating: 4.8,
    reviewCount: 1247
  },
  {
    id: '2',
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with air cushioning',
    category: 'Clothing & Apparel',
    brand: 'Nike',
    sku: 'NAM270-BLK-10',
    currentPrice: 89.99,
    wholesalePrice: 65.99,
    closeoutPrice: 45.99,
    minOrderQuantity: 24,
    supplierName: 'SportGear Direct',
    availabilityStatus: 'low_stock',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    tags: ['shoes', 'running', 'athletic'],
    priceChange: 2.1,
    rating: 4.6,
    reviewCount: 892
  },
  {
    id: '3',
    name: 'KitchenAid Stand Mixer',
    description: 'Professional-grade stand mixer for baking enthusiasts',
    category: 'Home & Garden',
    brand: 'KitchenAid',
    sku: 'KA-SM-RED-5QT',
    currentPrice: 299.99,
    wholesalePrice: 219.99,
    closeoutPrice: 179.99,
    minOrderQuantity: 6,
    supplierName: 'Home Essentials Plus',
    availabilityStatus: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    tags: ['kitchen', 'appliance', 'baking'],
    priceChange: -1.8,
    rating: 4.9,
    reviewCount: 2156
  },
  {
    id: '4',
    name: 'Sony PlayStation 5',
    description: 'Next-generation gaming console with 4K gaming',
    category: 'Toys & Games',
    brand: 'Sony',
    sku: 'PS5-STD-825GB',
    currentPrice: 499.99,
    wholesalePrice: 429.99,
    closeoutPrice: 399.99,
    minOrderQuantity: 5,
    supplierName: 'GameHub Wholesale',
    availabilityStatus: 'out_of_stock',
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400',
    tags: ['gaming', 'console', 'entertainment'],
    priceChange: 8.5,
    rating: 4.7,
    reviewCount: 3421
  },
  {
    id: '5',
    name: 'Dyson V15 Detect Vacuum',
    description: 'Cordless vacuum with laser dust detection',
    category: 'Home & Garden',
    brand: 'Dyson',
    sku: 'DYS-V15-DET-CRD',
    currentPrice: 649.99,
    wholesalePrice: 519.99,
    closeoutPrice: 449.99,
    minOrderQuantity: 4,
    supplierName: 'CleanTech Solutions',
    availabilityStatus: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    tags: ['vacuum', 'cordless', 'cleaning'],
    priceChange: -3.2,
    rating: 4.5,
    reviewCount: 756
  },
  {
    id: '6',
    name: 'Samsung 65" QLED TV',
    description: '4K QLED Smart TV with HDR and gaming features',
    category: 'Electronics',
    brand: 'Samsung',
    sku: 'SAM-Q70A-65-4K',
    currentPrice: 1199.99,
    wholesalePrice: 899.99,
    closeoutPrice: 749.99,
    minOrderQuantity: 2,
    supplierName: 'ElectroMax Wholesale',
    availabilityStatus: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
    tags: ['tv', 'smart', '4k', 'entertainment'],
    priceChange: -12.5,
    rating: 4.4,
    reviewCount: 1089
  }
]

const categories = ['All Categories', 'Electronics', 'Clothing & Apparel', 'Home & Garden', 'Toys & Games', 'Health & Beauty', 'Automotive', 'Sports & Outdoors', 'Books & Media']
const sortOptions = ['Price: Low to High', 'Price: High to Low', 'Name: A to Z', 'Name: Z to A', 'Newest First', 'Best Rating']

export function ProductsGrid() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [sortBy, setSortBy] = useState('Price: Low to High')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [dbProducts, setDbProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Load products from database
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const user = await blink.auth.me()
        const products = await blink.db.products.list({
          where: { userId: user.id },
          orderBy: { createdAt: 'desc' }
        })
        
        // Transform database products to match expected format
        const transformedProducts = products.map(product => ({
          ...product,
          tags: product.tags ? product.tags.split(',') : [],
          priceChange: 0, // Default value for new products
          rating: 4.5, // Default rating
          reviewCount: 0 // Default review count
        }))
        
        setDbProducts(transformedProducts)
      } catch (error) {
        console.error('Error loading products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadProducts()

    // Listen for new products
    const handleProductAdded = () => {
      loadProducts()
    }

    window.addEventListener('productAdded', handleProductAdded)
    return () => window.removeEventListener('productAdded', handleProductAdded)
  }, [])

  // Combine mock products with database products
  const allProducts = [...mockProducts, ...dbProducts]

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'Price: Low to High':
        return a.wholesalePrice - b.wholesalePrice
      case 'Price: High to Low':
        return b.wholesalePrice - a.wholesalePrice
      case 'Name: A to Z':
        return a.name.localeCompare(b.name)
      case 'Name: Z to A':
        return b.name.localeCompare(a.name)
      case 'Best Rating':
        return b.rating - a.rating
      default:
        return 0
    }
  })

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'in_stock': return 'bg-green-100 text-green-800'
      case 'low_stock': return 'bg-yellow-100 text-yellow-800'
      case 'out_of_stock': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAvailabilityText = (status: string) => {
    switch (status) {
      case 'in_stock': return 'In Stock'
      case 'low_stock': return 'Low Stock'
      case 'out_of_stock': return 'Out of Stock'
      default: return 'Unknown'
    }
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Product Catalog</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse our extensive catalog of wholesale and closeout products. 
            Compare prices, track trends, and find the best deals for your business.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products, brands, or SKUs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {sortedProducts.length} products</span>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={getAvailabilityColor(product.availabilityStatus)}>
                        {getAvailabilityText(product.availabilityStatus)}
                      </Badge>
                    </div>
                    <div className="absolute top-3 right-3">
                      <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    {product.priceChange !== 0 && (
                      <div className="absolute bottom-3 left-3">
                        <Badge variant={product.priceChange > 0 ? "destructive" : "default"} className="text-xs">
                          {product.priceChange > 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {Math.abs(product.priceChange)}%
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <Badge variant="outline" className="text-xs mb-2">
                      {product.category}
                    </Badge>
                    <h3 className="font-semibold text-lg mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                    <div className="flex items-center gap-1 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < Math.floor(product.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {product.rating} ({product.reviewCount})
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Wholesale:</span>
                      <span className="font-bold text-primary">${product.wholesalePrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Closeout:</span>
                      <span className="font-bold text-accent">${product.closeoutPrice}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Min Order:</span>
                      <span className="text-sm">{product.minOrderQuantity} units</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{product.name}</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-64 object-cover rounded-lg"
                            />
                          </div>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-semibold mb-2">Product Details</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Brand:</span>
                                  <span>{product.brand}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>SKU:</span>
                                  <span>{product.sku}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Category:</span>
                                  <span>{product.category}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Supplier:</span>
                                  <span>{product.supplierName}</span>
                                </div>
                              </div>
                            </div>
                            <Separator />
                            <div>
                              <h4 className="font-semibold mb-2">Pricing</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Retail Price:</span>
                                  <span className="line-through text-muted-foreground">${product.currentPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Wholesale Price:</span>
                                  <span className="font-bold text-primary">${product.wholesalePrice}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Closeout Price:</span>
                                  <span className="font-bold text-accent">${product.closeoutPrice}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Min Order Qty:</span>
                                  <span>{product.minOrderQuantity} units</span>
                                </div>
                              </div>
                            </div>
                            <Separator />
                            <div>
                              <p className="text-sm text-muted-foreground">{product.description}</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button size="sm" className="flex-1">
                      <Package className="h-4 w-4 mr-2" />
                      Add to Quote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && sortedProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        )}

        {/* Load More Button */}
        {!loading && sortedProducts.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </section>
  )
}