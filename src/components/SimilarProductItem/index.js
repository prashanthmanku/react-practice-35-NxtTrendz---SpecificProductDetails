// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarProduct} = props
  const {imageUrl, title, brand, price, rating} = similarProduct
  return (
    <li className="similar-product-item-container">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-img"
      />
      <h1 className="similar-title">{title}</h1>
      <p className="similar-brand">by {brand}</p>
      <div className="similar-price-rating-container">
        <p className="similar-price">Rs {price}/- </p>
        <div className="sm-rating-container">
          <p className="sm-rating">{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="sm-rating-img"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
