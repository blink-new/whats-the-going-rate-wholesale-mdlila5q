import { useState } from 'react'
import { Search, TrendingUp, DollarSign, Package, Loader2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent } from '../ui/card'
import { blink } from '../../blink/client'

interface SearchResult {
  title: string
  link: string
  snippet: string
  price?: string
  source: string
}

interface HeroProps {
  onSearchResults?: (results: SearchResult[]) => void
}

export function Hero({ onSearchResults }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    
    // Dispatch search start event
    window.dispatchEvent(new CustomEvent('searchStart'))
    
    try {
      // Search for wholesale pricing information
      const wholesaleQuery = `${searchQuery} wholesale price bulk pricing supplier`
      const closeoutQuery = `${searchQuery} closeout liquidation discount price`
      
      // Perform multiple searches for comprehensive results
      const [wholesaleResults, closeoutResults, generalResults] = await Promise.all([
        blink.data.search(wholesaleQuery, { limit: 10 }),
        blink.data.search(closeoutQuery, { limit: 10 }),
        blink.data.search(`${searchQuery} price comparison shopping`, { 
          type: 'shopping',
          limit: 15 
        })
      ])

      // Combine and process results
      const combinedResults: SearchResult[] = []

      // Process wholesale results
      if (wholesaleResults.organic_results) {
        wholesaleResults.organic_results.forEach((result: any) => {
          combinedResults.push({
            title: result.title,
            link: result.link,
            snippet: result.snippet,
            source: 'Wholesale Search',
            price: extractPriceFromSnippet(result.snippet)
          })
        })
      }

      // Process closeout results
      if (closeoutResults.organic_results) {
        closeoutResults.organic_results.forEach((result: any) => {
          combinedResults.push({
            title: result.title,
            link: result.link,
            snippet: result.snippet,
            source: 'Closeout Search',
            price: extractPriceFromSnippet(result.snippet)
          })
        })
      }

      // Process shopping results
      if (generalResults.shopping_results) {
        generalResults.shopping_results.forEach((result: any) => {
          combinedResults.push({
            title: result.title,
            link: result.link,
            snippet: result.snippet || `${result.title} - ${result.price}`,
            source: result.source || 'Shopping',
            price: result.price
          })
        })
      }

      // Pass results to parent component
      if (onSearchResults) {
        onSearchResults(combinedResults)
      }

      // Dispatch custom event for other components to listen
      window.dispatchEvent(new CustomEvent('searchResults', { 
        detail: { 
          query: searchQuery, 
          results: combinedResults 
        } 
      }))

    } catch (error) {
      console.error('Search error:', error)
      // Show error to user
      window.dispatchEvent(new CustomEvent('searchError', { 
        detail: { 
          message: 'Failed to search for pricing information. Please try again.' 
        } 
      }))
    } finally {
      setIsSearching(false)
    }
  }

  const extractPriceFromSnippet = (snippet: string): string | undefined => {
    // Extract price patterns from text
    const pricePatterns = [
      /\$[\d,]+\.?\d*/g,
      /USD\s*[\d,]+\.?\d*/g,
      /[\d,]+\.?\d*\s*dollars?/gi,
      /price:?\s*\$?[\d,]+\.?\d*/gi
    ]

    for (const pattern of pricePatterns) {
      const matches = snippet.match(pattern)
      if (matches && matches.length > 0) {
        return matches[0]
      }
    }
    return undefined
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <section className="bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Discover Wholesale Prices
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Search the web for real-time wholesale and closeout pricing. 
            Enter any product name, brand, or UPC to find current market rates.
          </p>
          
          {/* Enhanced Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Enter product name, brand, or UPC code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-12 pr-4 h-14 text-lg border-2 border-primary/20 focus:border-primary"
                disabled={isSearching}
              />
              <Button 
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="absolute right-2 top-2 h-10"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Search Web'
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Try: "iPhone 14", "Nike Air Max", "UPC 123456789", or any product name
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">50,000+</h3>
              <p className="text-muted-foreground">Products Tracked</p>
            </CardContent>
          </Card>

          <Card className="border-accent/20 hover:border-accent/40 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-2">$2.5M+</h3>
              <p className="text-muted-foreground">Savings Identified</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">500+</h3>
              <p className="text-muted-foreground">Verified Suppliers</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}