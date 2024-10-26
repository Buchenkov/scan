import React from 'react';
import '../styles/Footer.css';
import logotip from '../../assets/logotip.svg';

const Footer = () => {
  return (
    <footer>
      <div className="footer">
                <img className="logotip" src={logotip} alt="logotip" />
                <div className="address">
                  <p>г. Москва, Цветной б-р, 40</p>
                  <p>+7 495 771 21 11</p>
                  <p>info@skan.ru</p>
                  <p style={{ marginTop: '40px' }}></p>
                  <p style={{ fontSize: '12px' }}>Copyright. 2022</p>
                </div>
            </div>
    </footer>
  )
}

export default Footer