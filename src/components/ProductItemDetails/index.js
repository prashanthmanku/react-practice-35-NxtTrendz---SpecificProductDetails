import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsDashSquare, BsPlusSquare} from 'react-icons/bs'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productData: {},
    similarProductsData: [],
    ActiveQuantityCount: 1,
  }

  componentDidMount() {
    this.getItemData()
  }

  onDecrementQuantity = () => {
    const {ActiveQuantityCount} = this.state
    if (ActiveQuantityCount > 1) {
      this.setState({ActiveQuantityCount: ActiveQuantityCount - 1})
    }
  }

  onIncrementQuntity = () => {
    const {ActiveQuantityCount} = this.state
    this.setState({ActiveQuantityCount: ActiveQuantityCount + 1})
  }

  onClickContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  getCamelCaseData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getItemData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)

    const data = await response.json()

    if (response.ok === true) {
      const updatedProduct = this.getCamelCaseData(data)
      const similarProductsData = data.similar_products.map(each =>
        this.getCamelCaseData(each),
      )
      this.setState({
        productData: updatedProduct,
        similarProductsData,
        apiStatus: apiStatusConstants.success,
      })
    } else if (data.status_code === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderProductDetailsView = () => {
    const {productData, similarProductsData, ActiveQuantityCount} = this.state

    const {
      availability,
      brand,
      description,

      imageUrl,
      price,
      rating,
      title,
      totalReviews,
    } = productData

    return (
      <>
        <div className="single-product-container">
          <img src={imageUrl} alt="product" className="product-view-img" />

          <div className="single-product-content-container">
            <h1 className="s-product-title">{title}</h1>
            <p className="s-product-price">Rs {price}/-</p>
            <div className="s-product-review-rating-container">
              <div className="s-product-rating-container">
                <p className="s-product-rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="s-product-star-img"
                />
              </div>
              <p className="s-product-reviews">{totalReviews} Reviews</p>
            </div>
            <p className="s-product-description">{description}</p>
            <p className="Available-line">
              <span>Available</span>: {availability}
            </p>
            <p className="Available-line">
              <span>Brand</span>: {brand}
            </p>
            <div className="quantity-container">
              <button
                type="button"
                className="quantity-button"
                data-testid="minus"
                onClick={this.onDecrementQuantity}
              >
                <BsDashSquare className="minus-icon" />
              </button>
              <p className="quantity-count">{ActiveQuantityCount}</p>
              <button
                type="button"
                className="quantity-button"
                data-testid="plus"
                onClick={this.onIncrementQuntity}
              >
                <BsPlusSquare className="minus-icon" />
              </button>
            </div>
            <button className="add-cart-btn" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="Similar-Products-heading">Similar Products</h1>
        <ul className="similar-products-list-container">
          {similarProductsData.map(eachproduct => (
            <SimilarProductItem
              similarProduct={eachproduct}
              key={eachproduct.id}
            />
          ))}
        </ul>
      </>
    )
  }

  renderNoProductsView = () => (
    <div className="loader-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="no-products-view-img"
      />
      <h1 className="no-products-heading">Product Not Found</h1>
      <button
        type="button"
        className="no-products-btn"
        onClick={this.onClickContinueShopping}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderLodingView = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderResultView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLodingView()
      case apiStatusConstants.success:
        return this.renderProductDetailsView()
      case apiStatusConstants.failure:
        return this.renderNoProductsView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-details-container">
          {this.renderResultView()}
        </div>
      </>
    )
  }
}

export default ProductItemDetails
