import { useState, useEffect, useRef } from 'react'
import { FaSearch } from 'react-icons/fa'
import useDebounce from '@/hooks/useDebounce'
import useClickAway from '@/hooks/useClickAway'
import SearchResults from './SearchResults'

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const ref = useRef(null)

  useClickAway(ref, () => {
    setSearchTerm('')
  })

  useDebounce(
    () => {
      setDebouncedSearchTerm(searchTerm)
    },
    400,
    [searchTerm]
  )

  useEffect(() => {
    const getResults = async () => {
      if (searchTerm === '') {
        setSearchResults([])
      }
      if (debouncedSearchTerm !== '' && searchTerm == debouncedSearchTerm) {
        const res = await fetch(`/api/search?q=${debouncedSearchTerm}`)
        const { results } = await res.json()
        setSearchResults(results)
      }
    }

    getResults()
  }, [searchTerm, debouncedSearchTerm])

  return (
    <div className="relative bg-gray-600 p-4" ref={ref}>
      <div className="container mx-auto flex items-center justify-center md:justify-end">
        <div className="relative text-gray-600 w-72">
          <form>
            <input
              type="search"
              name="search"
              id="search"
              className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none w-72"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Posts..."
            />

            <FaSearch className="absolute top-0 right-0 text-black mt-3 mr-4" />
          </form>
        </div>
      </div>

      <SearchResults results={searchResults} />
    </div>
  )
}
