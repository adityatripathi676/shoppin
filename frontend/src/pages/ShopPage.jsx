import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import SectionTitle from '../components/SectionTitle'
import Loader from '../components/Loader'
import { useShop } from '../context/ShopContext'

const categories = ['All', 'Fashion', 'Electronics', 'Home']

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { products, addToCart, isLoadingProducts, cartItems } = useShop()
  const [searchText, setSearchText] = useState('')
  const activeCategory = searchParams.get('category') || 'All'

  const filtered = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase()

    return products.filter((product) => {
      const categoryMatches = activeCategory === 'All' || product.category === activeCategory
      if (!categoryMatches) {
        return false
      }

      if (!normalizedSearch) {
        return true
      }

      const searchable = `${product.name} ${product.category} ${product.description}`.toLowerCase()
      return searchable.includes(normalizedSearch)
    })
  }, [products, activeCategory, searchText])

  const onCategoryChange = (value) => {
    if (value === 'All') {
      setSearchParams({})
      return
    }
    setSearchParams({ category: value })
  }

  const quantityByProductId = useMemo(
    () =>
      cartItems.reduce((accumulator, item) => {
        accumulator[item.productId] = item.quantity
        return accumulator
      }, {}),
    [cartItems],
  )

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <SectionTitle
        eyebrow="Shop"
        title="All products"
        subtitle="Filter by category and add items to cart with one click."
      />

      <div className="mb-6 rounded-xl bg-white p-4 soft-shadow">
        <label htmlFor="shop-search" className="mb-2 block text-sm font-medium text-slate-700">
          Search section
        </label>
        <input
          id="shop-search"
          type="text"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search by product name, category, or description"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none ring-sky-200 focus:border-sky-400 focus:ring"
        />
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onCategoryChange(item)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
              activeCategory === item
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {isLoadingProducts ? <Loader label="Loading products..." /> : null}

      {!isLoadingProducts && filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          No products found for this filter/search.
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={addToCart}
            inCartQuantity={quantityByProductId[product.id] || 0}
          />
        ))}
      </div>
    </section>
  )
}

export default ShopPage
