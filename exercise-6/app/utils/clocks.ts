import type { IClock } from '~/types'

const BASE_URL = 'https://d2pn8kiwq2w21t.cloudfront.net/images'

export const CLOCKS: IClock[] = [
  { name: 'Consistency', imageUrl: `${BASE_URL}/Consistency.width-1024.jpg` },
  { name: 'Coverage', imageUrl: `${BASE_URL}/Coverage.width-1024.jpg` },
  { name: 'Emergency', imageUrl: `${BASE_URL}/Emergency.width-1024.jpg` },
  { name: 'Collapse', imageUrl: `${BASE_URL}/Collapse.width-1024.jpg` },
  { name: 'Rising Water', imageUrl: `${BASE_URL}/RisingWater.width-1024.jpg` },
  { name: 'Agriculture', imageUrl: `${BASE_URL}/Agriculture.width-1024.jpg` },
  { name: 'Deforestation', imageUrl: `${BASE_URL}/Deforestation.width-1024.jpg` },
  { name: 'Earthquake', imageUrl: `${BASE_URL}/Earthquake.width-1024.jpg` },
  { name: 'Air Quality', imageUrl: `${BASE_URL}/AirQuality.width-1024.jpg` },
  { name: 'Illusion', imageUrl: `${BASE_URL}/Illusion.width-1024.jpg` },
  { name: 'Pollution', imageUrl: `${BASE_URL}/Pollution.width-1024.jpg` },
  { name: 'Precision', imageUrl: `${BASE_URL}/Precision.width-1024.jpg` },
]
