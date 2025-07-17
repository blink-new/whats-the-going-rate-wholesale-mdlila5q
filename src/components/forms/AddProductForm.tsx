import { useState } from 'react'
import { Plus, Upload, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Separator } from '../ui/separator'

const categories = ['Electronics', 'Clothing & Apparel', 'Home & Garden', 'Toys & Games', 'Health & Beauty', 'Automotive', 'Sports & Outdoors', 'Books & Media']
const availabilityOptions = ['in_stock', 'low_stock', 'out_of_stock']

interface ProductFormData {
  name: string
  description: string
  category: string
  brand: string
  sku: string
  currentPrice: string
  wholesalePrice: string
  closeoutPrice: string
  minOrderQuantity: string
  supplierName: string
  supplierContact: string
  availabilityStatus: string
  imageUrl: string
  tags: string[]
}

export function AddProductForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category: '',
    brand: '',
    sku: '',
    currentPrice: '',
    wholesalePrice: '',
    closeoutPrice: '',
    minOrderQuantity: '1',
    supplierName: '',
    supplierContact: '',
    availabilityStatus: 'in_stock',
    imageUrl: '',
    tags: []
  })
  const [newTag, setNewTag] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { blink } = await import('../../blink/client')
      const user = await blink.auth.me()
      
      // Prepare product data for database
      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        brand: formData.brand,
        sku: formData.sku,
        currentPrice: parseFloat(formData.currentPrice) || 0,
        wholesalePrice: parseFloat(formData.wholesalePrice),
        closeoutPrice: parseFloat(formData.closeoutPrice) || 0,
        minOrderQuantity: parseInt(formData.minOrderQuantity) || 1,
        supplierName: formData.supplierName,
        supplierContact: formData.supplierContact,
        availabilityStatus: formData.availabilityStatus,
        imageUrl: formData.imageUrl,
        tags: formData.tags.join(','), // Store as comma-separated string
        userId: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      // Save to database
      await blink.db.products.create(productData)
      
      // Reset form and close dialog
      setFormData({
        name: '',
        description: '',
        category: '',
        brand: '',
        sku: '',
        currentPrice: '',
        wholesalePrice: '',
        closeoutPrice: '',
        minOrderQuantity: '1',
        supplierName: '',
        supplierContact: '',
        availabilityStatus: 'in_stock',
        imageUrl: '',
        tags: []
      })
      setIsOpen(false)
      
      // Show success message (you could use a toast here)
      alert('Product added successfully!')
      
      // Trigger a refresh of the products list
      window.dispatchEvent(new CustomEvent('productAdded'))
      
    } catch (error) {
      console.error('Error adding product:', error)
      alert('Error adding product. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = formData.name && formData.category && formData.brand && 
                     formData.sku && formData.wholesalePrice && formData.supplierName

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    placeholder="Enter brand name"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="sku">SKU *</Label>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    placeholder="Enter SKU"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter product description"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                    placeholder="Enter image URL or upload image"
                  />
                  <Button type="button" variant="outline">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Pricing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="currentPrice">Retail Price ($)</Label>
                  <Input
                    id="currentPrice"
                    type="number"
                    step="0.01"
                    value={formData.currentPrice}
                    onChange={(e) => handleInputChange('currentPrice', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <Label htmlFor="wholesalePrice">Wholesale Price ($) *</Label>
                  <Input
                    id="wholesalePrice"
                    type="number"
                    step="0.01"
                    value={formData.wholesalePrice}
                    onChange={(e) => handleInputChange('wholesalePrice', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="closeoutPrice">Closeout Price ($)</Label>
                  <Input
                    id="closeoutPrice"
                    type="number"
                    step="0.01"
                    value={formData.closeoutPrice}
                    onChange={(e) => handleInputChange('closeoutPrice', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="minOrderQuantity">Minimum Order Quantity</Label>
                <Input
                  id="minOrderQuantity"
                  type="number"
                  value={formData.minOrderQuantity}
                  onChange={(e) => handleInputChange('minOrderQuantity', e.target.value)}
                  placeholder="1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Supplier Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Supplier Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supplierName">Supplier Name *</Label>
                  <Input
                    id="supplierName"
                    value={formData.supplierName}
                    onChange={(e) => handleInputChange('supplierName', e.target.value)}
                    placeholder="Enter supplier name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="supplierContact">Supplier Contact</Label>
                  <Input
                    id="supplierContact"
                    value={formData.supplierContact}
                    onChange={(e) => handleInputChange('supplierContact', e.target.value)}
                    placeholder="Email or phone"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="availabilityStatus">Availability Status</Label>
                <Select value={formData.availabilityStatus} onValueChange={(value) => handleInputChange('availabilityStatus', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline">
                  Add
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Separator />

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid || isSubmitting}>
              {isSubmitting ? 'Adding Product...' : 'Add Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}