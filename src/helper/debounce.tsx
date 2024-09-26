import { useEffect, useState } from 'react'

function useDebounce(value: any, delay?: number): any {
  const [debouncedValue, setDebouncedValue] = useState<any>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
