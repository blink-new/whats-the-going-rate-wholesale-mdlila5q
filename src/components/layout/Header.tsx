import { Search, Bell, User, TrendingUp } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { blink } from '../../blink/client'
import { AddProductForm } from '../forms/AddProductForm'

interface HeaderProps {
  user: any
  onClearSearch?: () => void
}

export function Header({ user, onClearSearch }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-8 w-8 text-primary" />
          <button onClick={onClearSearch} className="text-left hover:opacity-80 transition-opacity">
            <h1 className="text-xl font-bold">What's the Going Rate</h1>
            <p className="text-xs text-muted-foreground">Wholesale & Closeout Tracker</p>
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products, categories, or suppliers..."
              className="pl-10 pr-4"
            />
          </div>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          <AddProductForm />
          
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{user?.email}</p>
              <button 
                onClick={() => blink.auth.logout()}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}