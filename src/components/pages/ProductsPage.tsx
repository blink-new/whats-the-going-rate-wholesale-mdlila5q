import { useState } from 'react'
import { Search, Filter, SlidersHorizontal, Grid3X3, List, Heart, TrendingUp, TrendingDown, Package, Star, Eye, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Separator } from '../ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Slider } from '../ui/slider'
import { Checkbox } from '../ui/checkbox'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet'

// Extended mock product data
const mockProducts = [
  {
    id: '1',
    name: 'Apple iPhone 14 Pro Max',
    description: 'Latest flagship smartphone with advanced camera system and A16 Bionic chip',
    category: 'Electronics',
    brand: 'Apple',
    sku: 'IPH14PM-128-DPP',
    currentPrice: 899.99,
    wholesalePrice: 749.99,
    closeoutPrice: 649.99,
    minOrderQuantity: 10,
    supplierName: 'TechSource Wholesale',
    supplierContact: 'contact@techsource.com',
    availabilityStatus: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
    tags: ['smartphone', 'premium', 'latest'],
    priceChange: -5.2,
    rating: 4.8,
    reviewCount: 1247,
    stockQuantity: 150
  },
  {
    id: '2',
    name: 'Nike Air Max 270',
    description: 'Comfortable running shoes with air cushioning technology',
    category: 'Clothing & Apparel',
    brand: 'Nike',
    sku: 'NAM270-BLK-10',
    currentPrice: 89.99,
    wholesalePrice: 65.99,
    closeoutPrice: 45.99,
    minOrderQuantity: 24,
    supplierName: 'SportGear Direct',
    supplierContact: 'orders@sportgear.com',
    availabilityStatus: 'low_stock',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
    tags: ['shoes', 'running', 'athletic'],
    priceChange: 2.1,
    rating: 4.6,
    reviewCount: 892,
    stockQuantity: 25
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
    supplierContact: 'wholesale@homeessentials.com',
    availabilityStatus: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    tags: ['kitchen', 'appliance', 'baking'],
    priceChange: -1.8,
    rating: 4.9,
    reviewCount: 2156,
    stockQuantity: 80
  },
  {
    id: '4',
    name: 'Sony PlayStation 5',
    description: 'Next-generation gaming console with 4K gaming capabilities',
    category: 'Toys & Games',
    brand: 'Sony',
    sku: 'PS5-STD-825GB',
    currentPrice: 499.99,
    wholesalePrice: 429.99,
    closeoutPrice: 399.99,
    minOrderQuantity: 5,
    supplierName: 'GameHub Wholesale',
    supplierContact: 'sales@gamehub.com',
    availabilityStatus: 'out_of_stock',
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=400',
    tags: ['gaming', 'console', 'entertainment'],
    priceChange: 8.5,
    rating: 4.7,
    reviewCount: 3421,
    stockQuantity: 0
  },
  {
    id: '5',
    name: 'Dyson V15 Detect Vacuum',
    description: 'Cordless vacuum with laser dust detection technology',
    category: 'Home & Garden',
    brand: 'Dyson',
    sku: 'DYS-V15-DET-CRD',
    currentPrice: 649.99,
    wholesalePrice: 519.99,
    closeoutPrice: 449.99,
    minOrderQuantity: 4,
    supplierName: 'CleanTech Solutions',
    supplierContact: 'info@cleantech.com',
    availabilityStatus: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    tags: ['vacuum', 'cordless', 'cleaning'],
    priceChange: -3.2,
    rating: 4.5,
    reviewCount: 756,
    stockQuantity: 45
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
    supplierContact: 'orders@electromax.com',
    availabilityStatus: 'in_stock',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
    tags: ['tv', 'smart', '4k', 'entertainment'],
    priceChange: -12.5,
    rating: 4.4,
    reviewCount: 1089,
    stockQuantity: 12
  }
]

const categories = ['All Categories', 'Electronics', 'Clothing & Apparel', 'Home & Garden', 'Toys & Games', 'Health & Beauty', 'Automotive', 'Sports & Outdoors', 'Books & Media']
const brands = ['All Brands', 'Apple', 'Nike', 'KitchenAid', 'Sony', 'Dyson', 'Samsung']
const sortOptions = ['Price: Low to High', 'Price: High to Low', 'Name: A to Z', 'Name: Z to A', 'Newest First', 'Best Rating', 'Most Popular']

export function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedBrand, setSelectedBrand] = useState('All Brands')
  const [sortBy, setSortBy] = useState('Price: Low to High')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [showInStockOnly, setShowInStockOnly] = useState(false)
  const [showCloseoutOnly, setShowCloseoutOnly] = useState(false)

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory
    const matchesBrand = selectedBrand === 'All Brands' || product.brand === selectedBrand
    const matchesPrice = product.wholesalePrice >= priceRange[0] && product.wholesalePrice <= priceRange[1]
    const matchesStock = !showInStockOnly || product.availabilityStatus === 'in_stock'
    const matchesCloseout = !showCloseoutOnly || product.closeoutPrice < product.wholesalePrice * 0.8
    
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice && matchesStock && matchesCloseout
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
      case 'Most Popular':
        return b.reviewCount - a.reviewCount
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

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Category</h3>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>{category}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Brand</h3>
        <Select value={selectedBrand} onValueChange={setSelectedBrand}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {brands.map(brand => (
              <SelectItem key={brand} value={brand}>{brand}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Price Range</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={1000}
            min={0}
            step={10}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold">Filters</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={showInStockOnly}
            onCheckedChange={setShowInStockOnly}
          />
          <label htmlFor="in-stock" className="text-sm">In Stock Only</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="closeout"
            checked={showCloseoutOnly}
            onCheckedChange={setShowCloseoutOnly}
          />
          <label htmlFor="closeout" className="text-sm">Closeout Deals</label>
        </div>
      </div>
    </div>
  )

  const ProductCard = ({ product, isListView = false }: { product: any, isListView?: boolean }) => (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${isListView ? 'flex' : ''}`}>
      <CardHeader className={`p-0 ${isListView ? 'w-48 flex-shrink-0' : ''}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`object-cover group-hover:scale-105 transition-transform duration-300 ${
              isListView ? 'w-48 h-32' : 'w-full h-48'
            }`}
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
      <CardContent className={`p-4 ${isListView ? 'flex-1' : ''}`}>
        <div className={isListView ? 'flex justify-between' : ''}>
          <div className={isListView ? 'flex-1 pr-4' : ''}>
            <div className="mb-2">
              <Badge variant="outline" className="text-xs mb-2">
                {product.category}
              </Badge>
              <h3 className={`font-semibold mb-1 line-clamp-2 ${isListView ? 'text-base' : 'text-lg'}`}>
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">{product.brand} • {product.sku}</p>
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
          </div>

          <div className={isListView ? 'w-48' : ''}>
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
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Stock:</span>
                <span className="text-sm">{product.stockQuantity} units</span>
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
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>{product.name}</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                      <div className="flex gap-2">
                        <Button className="flex-1">
                          <Plus className="h-4 w-4 mr-2" />
                          Add to Quote
                        </Button>
                        <Button variant="outline">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
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
                          <div className="flex justify-between">
                            <span>Contact:</span>
                            <span>{product.supplierContact}</span>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">Pricing & Availability</h4>
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
                          <div className="flex justify-between">
                            <span>Available Stock:</span>
                            <span>{product.stockQuantity} units</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <Badge className={getAvailabilityColor(product.availabilityStatus)}>
                              {getAvailabilityText(product.availabilityStatus)}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-semibold mb-2">Description</h4>
                        <p className="text-sm text-muted-foreground">{product.description}</p>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button size="sm" className="flex-1">
                <Package className="h-4 w-4 mr-2" />
                Quote
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Product Catalog</h1>
          <p className="text-muted-foreground">
            Browse our extensive catalog of wholesale and closeout products
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <Card className="p-6 sticky top-4">
              <h2 className="font-semibold mb-4">Filters</h2>
              <FilterPanel />
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Controls */}
            <div className="mb-6 space-y-4">
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
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    Showing {sortedProducts.length} of {mockProducts.length} products
                  </span>
                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterPanel />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {sortedProducts.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {sortedProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    isListView={viewMode === 'list'} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters to find what you're looking for.
                </p>
              </div>
            )}

            {/* Load More Button */}
            {sortedProducts.length > 0 && (
              <div className="text-center mt-8">
                <Button variant="outline" size="lg">
                  Load More Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}