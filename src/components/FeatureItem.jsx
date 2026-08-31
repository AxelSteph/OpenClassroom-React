function FeatureItem({ image, title, text }) {
  return (
    <div className="feature-item">
      <img src={image} alt="" className="feature-icon" />
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

export default FeatureItem;