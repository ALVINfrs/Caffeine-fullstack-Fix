"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { useProductContext } from "@/context/product-context"

interface SearchFormProps {
  isOpen: boolean
}

export default function SearchForm({ isOpen }: SearchFormProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const { searchProducts } = useProductContext()

  useEffect(() => {
    if (searchTerm) {
      searchProducts(searchTerm)
    }
  }, [searchTerm, searchProducts])

  return (
    <div
      className={`search-form absolute top-full right-0 w-full md:w-1/2 lg:w-1/3 bg-black bg-opacity-90 p-4 rounded-b-lg transition-all duration-300 transform ${
        isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
      }`}
    >
      <div className="relative">
        <input
          type="search"
          id="search-box"
          placeholder="cari disini..."
          className="w-full p-2 pl-10 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <label htmlFor="search-box" className="absolute left-3 top-2.5 text-gray-400">
          <Search size={18} />
        </label>
      </div>
    </div>
  )
}
