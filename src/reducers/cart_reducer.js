import {
  ADD_TO_CART,
  CLEAR_CART,
  COUNT_CART_TOTALS,
  REMOVE_CART_ITEM,
  TOGGLE_CART_ITEM_AMOUNT,
} from '../actions'

const cart_reducer = (state, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const { id, color, amount, product } = action.payload
      const tmpItem = state.cart.find((item) => {
        return item.id === id + '_' + color
      })

      if (tmpItem) {
        const tmpCart = state.cart.map((item) => {
          if (item.id === id + '_' + color) {
            let newAmount = item.amount + amount

            if (newAmount > item.max) {
              newAmount = item.max
            }

            return { ...item, amount: newAmount }
          } else {
            return item
          }
        })

        return { ...state, cart: tmpCart }
      } else {
        const newItem = {
          id: id + '_' + color,
          name: product.name,
          color: color,
          amount: amount,
          image: product.images[0].url,
          price: product.price,
          max: product.stock,
        }
        return { ...state, cart: [...state.cart, newItem] }
      }

    case CLEAR_CART:
      return { ...state, cart: [] }

    case REMOVE_CART_ITEM:
      const tmpCart = state.cart.filter((item) => {
        return item.id !== action.payload
      })
      return { ...state, cart: tmpCart }

    case TOGGLE_CART_ITEM_AMOUNT:
      const { id: itemId, value } = action.payload
      const tempCart = state.cart.map((item) => {
        if (item.id === itemId) {
          let newAmount = item.amount

          if (value === 'inc') {
            newAmount = newAmount + 1
            if (newAmount > item.max) {
              newAmount = item.max
            }
          } else {
            newAmount = newAmount - 1
            if (newAmount < 1) {
              newAmount = 1
            }
          }
          return { ...item, amount: newAmount }
        } else {
          return item
        }
      })

      return { ...state, cart: tempCart }

    case COUNT_CART_TOTALS:
      const { total_items, total_amount } = state.cart.reduce(
        (total, item) => {
          const { price, amount } = item
          total.total_items += amount
          total.total_amount += amount * price

          return total
        },
        {
          total_items: 0,
          total_amount: 0,
        }
      )
      return { ...state, total_items, total_amount }

    default:
      throw new Error(`No Matching "${action.type}" - action type`)
  }
}

export default cart_reducer
