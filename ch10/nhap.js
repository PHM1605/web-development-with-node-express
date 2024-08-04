const products = [
  { id: 'hPc8YUbFuZM9edw4DaxwHk', name: 'Rock Climbing Expedition in Bend', price: 239.95, requiresWaiver: true },
  { id: 'eyryDtCCu9UUcqe9XgjbRk', name: 'Walking Tour of Portland', price: 89.95 },
  { id: '6oC1Akf6EbcxWZXHQYNFwx', name: 'Manzanita Surf Expedition', price: 159.95 },
  { id: 'w6wTWMx39zcBiTdpM9w5J7', name: 'Wine Tasting in the Willamette Valley', price: 229.95 },
]
const productsById = products.reduce((byId, p) => Object.assign(byId, { [p.id]: p }), {})
console.log(products)