import React from 'react';
import './MarketCompes.css';
import Images from '../../utils/Images/Images';

const markets = [
  { title: 'SALUD PÚBLICA', image: Images.marketCompes.health},
  { title: 'INDUSTRIAL', image: Images.marketCompes.industrial},
  { title: 'PECUARIO', image: Images.marketCompes.livestock},
  { title: 'AGRÍCOLA', image: Images.marketCompes.agricultural}
];

const MarketCompes = () => {
  return (
    <div className="marketcompes-container">
      <div className='market-title__container'>
        <h2 className='market-title'>Mercados que protegemos con nuestros productos</h2>
      </div>
      <div className="market-grid">
        {markets.map((market, index) => (
          <div key={index} className="market-item" style={{ backgroundImage: `url(${market.image})` }}>
            <a href={market.link} className="market-link">
              <div className="overlay"></div>
              <h3 className='market-subtitles'>{market.title}</h3>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketCompes;
