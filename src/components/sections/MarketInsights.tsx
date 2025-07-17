import { TrendingUp, TrendingDown, BarChart3, PieChart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const priceHistoryData = [
  { month: 'Jan', price: 15.20 },
  { month: 'Feb', price: 14.80 },
  { month: 'Mar', price: 13.90 },
  { month: 'Apr', price: 13.20 },
  { month: 'May', price: 12.80 },
  { month: 'Jun', price: 12.50 }
]

const categoryTrendsData = [
  { category: 'Electronics', growth: 12.5, volume: 45000 },
  { category: 'Clothing', growth: 8.3, volume: 32000 },
  { category: 'Home & Garden', growth: 15.7, volume: 28000 },
  { category: 'Toys', growth: 22.1, volume: 18000 },
  { category: 'Health & Beauty', growth: 6.9, volume: 25000 }
]

const marketInsights = [
  {
    title: 'Electronics Prices Dropping',
    description: 'Consumer electronics showing 18% average price decrease this quarter',
    trend: 'down',
    percentage: '18%',
    category: 'Electronics'
  },
  {
    title: 'Seasonal Toy Demand',
    description: 'Toy category experiencing 22% price increase ahead of holiday season',
    trend: 'up',
    percentage: '22%',
    category: 'Toys'
  },
  {
    title: 'Home Goods Surge',
    description: 'Home & Garden products showing strong wholesale demand growth',
    trend: 'up',
    percentage: '16%',
    category: 'Home & Garden'
  }
]

export function MarketInsights() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Market Insights</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time market analysis and pricing trends to help you make informed purchasing decisions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Price History Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Price History Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`$${value}`, 'Average Price']}
                      labelStyle={{ color: '#000' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="price" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Average wholesale prices across all categories over the last 6 months
              </p>
            </CardContent>
          </Card>

          {/* Market Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {marketInsights.map((insight, index) => (
                <div key={index} className="p-4 bg-background rounded-lg border">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{insight.category}</Badge>
                    <div className={`flex items-center space-x-1 ${
                      insight.trend === 'up' ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {insight.trend === 'up' ? (
                        <TrendingUp className="h-4 w-4" />
                      ) : (
                        <TrendingDown className="h-4 w-4" />
                      )}
                      <span className="text-sm font-medium">{insight.percentage}</span>
                    </div>
                  </div>
                  <h4 className="font-semibold mb-1">{insight.title}</h4>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Category Performance */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Category Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'growth' ? `${value}%` : value.toLocaleString(),
                      name === 'growth' ? 'Growth Rate' : 'Volume'
                    ]}
                    labelStyle={{ color: '#000' }}
                  />
                  <Bar dataKey="growth" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
              {categoryTrendsData.map((category, index) => (
                <div key={index} className="text-center">
                  <p className="font-semibold text-sm">{category.category}</p>
                  <p className="text-xs text-muted-foreground">
                    {category.volume.toLocaleString()} products
                  </p>
                  <p className={`text-sm font-medium ${
                    category.growth > 10 ? 'text-green-600' : 'text-blue-600'
                  }`}>
                    +{category.growth}%
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}