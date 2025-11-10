import { useEffect } from 'react'
import { Select } from './Select'
import { useLocationData } from '@/hooks/useLocationData'

interface LocationSelectorProps {
  province: string
  city: string
  district: string
  onProvinceChange: (value: string) => void
  onCityChange: (value: string) => void
  onDistrictChange: (value: string) => void
  errors?: {
    province?: string
    city?: string
    district?: string
  }
}

export function LocationSelector({
  province,
  city,
  district,
  onProvinceChange,
  onCityChange,
  onDistrictChange,
  errors,
}: LocationSelectorProps) {
  const {
    getProvinceOptions,
    getCityOptions,
    getDistrictOptions,
  } = useLocationData()

  const provinceOptions = getProvinceOptions
  const cityOptions = province ? getCityOptions(province) : []
  const districtOptions =
    province && city ? getDistrictOptions(province, city) : []

  // Reset city when province changes
  useEffect(() => {
    if (province && city) {
      const validCities = getCityOptions(province)
      if (!validCities.find((c) => c.value === city)) {
        onCityChange('')
        onDistrictChange('')
      }
    }
  }, [province, city, getCityOptions, onCityChange, onDistrictChange])

  // Reset district when city changes
  useEffect(() => {
    if (province && city && district) {
      const validDistricts = getDistrictOptions(province, city)
      if (!validDistricts.find((d) => d.value === district)) {
        onDistrictChange('')
      }
    }
  }, [province, city, district, getDistrictOptions, onDistrictChange])

  return (
    <div className="flex flex-col gap-4">
      <Select
        label="도/시"
        placeholder="선택하세요"
        value={province}
        onChange={(e) => {
          onProvinceChange(e.target.value)
          onCityChange('')
          onDistrictChange('')
        }}
        options={provinceOptions}
        error={errors?.province}
      />

      <Select
        label="시/군/구"
        placeholder={province ? '선택하세요' : '먼저 도/시를 선택하세요'}
        value={city}
        onChange={(e) => {
          onCityChange(e.target.value)
          onDistrictChange('')
        }}
        options={cityOptions}
        disabled={!province}
        error={errors?.city}
      />

      <Select
        label="구/동"
        placeholder={city ? '선택하세요' : '먼저 시/군/구를 선택하세요'}
        value={district}
        onChange={(e) => onDistrictChange(e.target.value)}
        options={districtOptions}
        disabled={!province || !city}
        error={errors?.district}
      />
    </div>
  )
}
