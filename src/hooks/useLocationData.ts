import { useMemo } from 'react'
import locationData from '@/constants/locations.json'
import type { Province, City } from '@/types'

export function useLocationData() {
  const provinces = useMemo(() => locationData.provinces, [])

  const getProvinceOptions = useMemo(
    () =>
      provinces.map((province) => ({
        value: province.name,
        label: province.name,
      })),
    [provinces]
  )

  const getCitiesByProvince = (provinceName: string): City[] => {
    const province = provinces.find((p) => p.name === provinceName)
    return province?.cities || []
  }

  const getCityOptions = (provinceName: string) => {
    const cities = getCitiesByProvince(provinceName)
    return cities.map((city) => ({
      value: city.name,
      label: city.name,
    }))
  }

  const getDistrictsByCity = (
    provinceName: string,
    cityName: string
  ): string[] => {
    const cities = getCitiesByProvince(provinceName)
    const city = cities.find((c) => c.name === cityName)
    return city?.districts || []
  }

  const getDistrictOptions = (provinceName: string, cityName: string) => {
    const districts = getDistrictsByCity(provinceName, cityName)
    return districts.map((district) => ({
      value: district,
      label: district,
    }))
  }

  return {
    provinces,
    getProvinceOptions,
    getCitiesByProvince,
    getCityOptions,
    getDistrictsByCity,
    getDistrictOptions,
  }
}
