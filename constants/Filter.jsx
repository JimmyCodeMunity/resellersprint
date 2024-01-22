// Apply filters function
export const applyFilters = () => {
    // Filter by price
    const priceFiltered = priceFilter
      ? products.filter((product) => {
          const price = isDollar
            ? product.discountPrice / product.shop.exchangeRate
            : product.discountPrice;
          return price >= priceFilter * 0.9 && price <= priceFilter * 1.1;
        })
      : products;
  
    // Filter by name
    const nameFiltered = categoryFilter
      ? priceFiltered.filter((product) =>
          product.name && product.name.toLowerCase().includes(categoryFilter.toLowerCase())
        )
      : priceFiltered;
  
    // Filter by brand
    const brandFiltered = brandFilter
      ? nameFiltered.filter((product) =>
          product.brand && product.brand.toLowerCase().includes(brandFilter.toLowerCase())
        )
      : nameFiltered;
  
    setFilteredProducts(brandFiltered);
  };