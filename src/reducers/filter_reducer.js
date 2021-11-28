import {
  LOAD_PRODUCTS,
  SET_LISTVIEW,
  SET_GRIDVIEW,
  UPDATE_SORT,
  SORT_PRODUCTS,
  UPDATE_FILTERS,
  FILTER_PRODUCTS,
  CLEAR_FILTERS,
} from '../actions'

const filter_reducer = (state, action) => {
  switch (action.type) {
    case LOAD_PRODUCTS:
      let maxPrice = action.payload.map((p) => p.price)
      maxPrice = Math.max(...maxPrice)

      return {
        ...state,
        all_products: [...action.payload],
        filtered_products: [...action.payload],
        filters: {
          ...state.filters,
          max_price: maxPrice,
          price: maxPrice,
        },
      }

    case SET_GRIDVIEW:
      return { ...state, grid_view: true }

    case SET_LISTVIEW:
      return { ...state, grid_view: false }

    case UPDATE_SORT:
      return { ...state, sort: action.payload }

    case SORT_PRODUCTS:
      const { sort, filtered_products } = state
      let tempProducts = [...filtered_products]

      switch (sort) {
        case 'price-lowest':
          // Way #1
          tempProducts = tempProducts.sort((a, b) => a.price - b.price)
          break
        case 'price-highest':
          // Way #2
          tempProducts = tempProducts.sort((a, b) => {
            if (a.price > b.price) return -1
            else if (a.price < b.price) return +1
            else return 0
          })
          break
        case 'name-a':
          tempProducts = tempProducts.sort((a, b) =>
            a.name.localeCompare(b.name)
          )
          break
        case 'name-z':
          tempProducts = tempProducts.sort((a, b) =>
            b.name.localeCompare(a.name)
          )
          break

        default:
          tempProducts = [...filtered_products]
      }
      return { ...state, filtered_products: tempProducts }
    case UPDATE_FILTERS:
      const { name, value } = action.payload
      return {
        ...state,
        filters: { ...state.filters, [name]: value },
      }

    case FILTER_PRODUCTS:
      const { all_products } = state
      const { text, category, company, color, price, shipping } = state.filters

      let tmpProducts = [...all_products]

      // filtering

      // name
      if (text) {
        tmpProducts = tmpProducts.filter((product) => {
          return product.name.toLowerCase().startsWith(text.toLowerCase())
        })
      }

      // category
      if (category !== 'all') {
        tmpProducts = tmpProducts.filter((product) => {
          return product.category.toLowerCase() === category.toLowerCase()
        })
      }

      // company
      if (company !== 'all') {
        tmpProducts = tmpProducts.filter((product) => {
          return product.company.toLowerCase() === company.toLowerCase()
        })
      }

      // colors
      if (color !== 'all') {
        tmpProducts = tmpProducts.filter((product) => {
          return product.colors.find((item) => {
            return item === color
          })
        })
      }

      // price
      tmpProducts = tmpProducts.filter((product) => {
        return product.price <= price
      })

      // shipping
      if (shipping) {
        tmpProducts = tmpProducts.filter((product) => {
          return product.shipping === true
        })
      }

      return { ...state, filtered_products: tmpProducts }

    case CLEAR_FILTERS:
      let newProducts = [...state.all_products]
      console.log(newProducts)

      return {
        ...state,
        filters: {
          ...state.filters,
          text: '',
          company: 'all',
          category: 'all',
          color: 'all',
          price: state.filters.max_price,
          shipping: false,
        },
      }

    default:
      throw new Error(`No Matching "${action.type}" - action type`)
  }
}

export default filter_reducer
