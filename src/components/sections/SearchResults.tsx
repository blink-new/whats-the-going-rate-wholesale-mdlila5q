import { useState, useEffect } from 'react'
import { ExternalLink, DollarSign, Package, AlertCircle, Loader2, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Alert, AlertDescription } from '../ui/alert'

interface SearchResult {
  title: string
  link: string
  snippet: string
  price?: string
  source: string
}

interface SearchResultsProps {
  results: SearchResult[]
  query: string
  isLoading?: boolean
  error?: string
}

export function SearchResults({ results, query, isLoading, error }: SearchResultsProps) {
  const [displayResults, setDisplayResults] = useState<SearchResult[]>([])

  useEffect(() => {
    setDisplayResults(results)
  }, [results])

  const getSourceColor = (source: string) => {
    switch (source.toLowerCase()) {
      case 'wholesale search':
        return 'bg-blue-100 text-blue-800'
      case 'closeout search':
        return 'bg-orange-100 text-orange-800'
      case 'shopping':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatPrice = (price: string | undefined) => {
    if (!price) return null
    
    // Clean up price string
    const cleanPrice = price.replace(/[^\d.,]/g, '')
    if (!cleanPrice) return price
    
    try {
      const numPrice = parseFloat(cleanPrice.replace(/,/g, ''))
      if (isNaN(numPrice)) return price
      return `$${numPrice.toLocaleString()}`
    } catch {
      return price
    }
  }

  const groupResultsBySource = (results: SearchResult[]) => {
    const grouped = results.reduce((acc, result) => {
      const source = result.source
      if (!acc[source]) {
        acc[source] = []
      }
      acc[source].push(result)
      return acc
    }, {} as Record<string, SearchResult[]>)
    
    return grouped
  }

  if (isLoading) {
    return (
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <h3 className="text-lg font-semibold mb-2">Searching the web...</h3>
            <p className="text-muted-foreground">
              Finding wholesale and closeout prices for "{query}"
            </p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          <Alert className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </section>
    )
  }

  if (!results || results.length === 0) {
    return null
  }

  const groupedResults = groupResultsBySource(displayResults)

  return (
    <section className="py-8 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Search Results for "{query}"
              </h2>
              <p className="text-muted-foreground">
                Found {results.length} pricing results from across the web
              </p>
            </div>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Search
            </Button>
          </div>
        </div>

        {/* Results by Source */}
        <div className="space-y-8">
          {Object.entries(groupedResults).map(([source, sourceResults]) => (
            <div key={source}>
              <div className="flex items-center gap-3 mb-4">
                <Badge className={getSourceColor(source)} variant="secondary">
                  {source}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {sourceResults.length} results
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sourceResults.map((result, index) => (
                  <Card key={`${source}-${index}`} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm font-medium line-clamp-2 flex-1">
                          {result.title}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 flex-shrink-0"
                          onClick={() => window.open(result.link, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {result.price && (
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-green-600">
                              {formatPrice(result.price)}
                            </span>
                          </div>
                        )}
                        
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {result.snippet}
                        </p>
                        
                        <div className="flex items-center justify-between pt-2">
                          <Badge variant="outline" className="text-xs">
                            {new URL(result.link).hostname}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(result.link, '_blank')}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Price Summary */}
        {results.some(r => r.price) && (
          <div className="mt-8 p-6 bg-background rounded-lg border">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Price Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(() => {
                const prices = results
                  .map(r => r.price)
                  .filter(Boolean)
                  .map(p => {
                    const clean = p!.replace(/[^\d.,]/g, '')
                    const num = parseFloat(clean.replace(/,/g, ''))
                    return isNaN(num) ? null : num
                  })
                  .filter(Boolean) as number[]

                if (prices.length === 0) return null

                const minPrice = Math.min(...prices)
                const maxPrice = Math.max(...prices)
                const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length

                return (
                  <>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Lowest Price</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${minPrice.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Average Price</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ${avgPrice.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Highest Price</p>
                      <p className="text-2xl font-bold text-orange-600">
                        ${maxPrice.toLocaleString()}
                      </p>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        )}

        {/* Search Tips */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">💡 Search Tips</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Include brand names for more specific results (e.g., "Apple iPhone 14")</li>
            <li>• Try UPC codes for exact product matches</li>
            <li>• Add terms like "wholesale", "bulk", or "closeout" for better pricing</li>
            <li>• Search for model numbers or SKUs for precise results</li>
          </ul>
        </div>
      </div>
    </section>
  )
}