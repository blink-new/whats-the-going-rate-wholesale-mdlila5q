import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import { Header } from './components/layout/Header'
import { Hero } from './components/sections/Hero'
import { SearchResults } from './components/sections/SearchResults'
import { CategoryGrid } from './components/sections/CategoryGrid'
import { ProductsGrid } from './components/sections/ProductsGrid'
import { TrendingItems } from './components/sections/TrendingItems'
import { PriceComparison } from './components/sections/PriceComparison'
import { MarketInsights } from './components/sections/MarketInsights'

interface SearchResult {
  title: string
  link: string
  snippet: string
  price?: string
  source: string
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [showDefaultSections, setShowDefaultSections] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  // Listen for search events
  useEffect(() => {
    const handleSearchResults = (event: CustomEvent) => {
      const { query, results } = event.detail
      setSearchQuery(query)
      setSearchResults(results)
      setSearchError('')
      setShowDefaultSections(false)
      setIsSearching(false)
    }

    const handleSearchError = (event: CustomEvent) => {
      const { message } = event.detail
      setSearchError(message)
      setIsSearching(false)
    }

    const handleSearchStart = () => {
      setIsSearching(true)
      setSearchError('')
    }

    window.addEventListener('searchResults', handleSearchResults as EventListener)
    window.addEventListener('searchError', handleSearchError as EventListener)
    window.addEventListener('searchStart', handleSearchStart)

    return () => {
      window.removeEventListener('searchResults', handleSearchResults as EventListener)
      window.removeEventListener('searchError', handleSearchError as EventListener)
      window.removeEventListener('searchStart', handleSearchStart)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">Welcome to What's the Going Rate</h1>
          <p className="text-muted-foreground mb-6">Please sign in to access wholesale pricing data</p>
          <button 
            onClick={() => blink.auth.login()}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  const handleClearSearch = () => {
    setSearchResults([])
    setSearchQuery('')
    setSearchError('')
    setShowDefaultSections(true)
    setIsSearching(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onClearSearch={handleClearSearch} />
      <main>
        <Hero />
        
        {/* Search Results Section */}
        {(searchResults.length > 0 || isSearching || searchError) && (
          <SearchResults
            results={searchResults}
            query={searchQuery}
            isLoading={isSearching}
            error={searchError}
          />
        )}
        
        {/* Default Sections - Show when no search results */}
        {showDefaultSections && (
          <>
            <CategoryGrid />
            <ProductsGrid />
            <TrendingItems />
            <PriceComparison />
            <MarketInsights />
          </>
        )}
      </main>
    </div>
  )
}

export default App