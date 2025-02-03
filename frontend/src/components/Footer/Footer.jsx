import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faLocationDot, 
  faPhone, 
  faEnvelope,
  faChevronRight 
} from '@fortawesome/free-solid-svg-icons'
import { 
  faFacebookF, 
  faInstagram, 
  faTwitter, 
  faWhatsapp 
} from '@fortawesome/free-brands-svg-icons'
import './Footer.css'
import { Link } from 'react-router-dom'

const Footer = () => {
  const newestListings = [
    {
      id: 1,
      title: "Minimalist Style flat",
      price: "$ 1,800,000",
      image: "/images/property1.jpg"
    },
    {
      id: 2,
      title: "Minimalist Style flat",
      price: "$ 1,800,000",
      image: "/images/property2.jpg"
    },
    {
      id: 3,
      title: "Minimalist Style flat",
      price: "$ 1,800,000",
      image: "/images/property3.jpg"
    }
  ]

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Company Info */}
          <div className="company-info">
            <h2>Auole<span className="title-dot">.</span></h2>
            <p>LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT, SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE MAGNA ALIQUA.</p>
            <div className="contact-info">
              <div className="contact-item">
                <div className="icon-wrapper">
                  <FontAwesomeIcon icon={faLocationDot} />
                </div>
                <span>774 NE 84th St Miami, FL 12345</span>
              </div>
              <div className="contact-item">
                <div className="icon-wrapper">
                  <FontAwesomeIcon icon={faPhone} />
                </div>
                <span>+1 (234) 567 8900</span>
              </div>
              <div className="contact-item">
                <div className="icon-wrapper">
                  <FontAwesomeIcon icon={faEnvelope} />
                </div>
                <span>email@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div className="useful-links">
            <h3>Useful Link</h3>
            <ul className="links-list">
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/team">Our Team</Link></li>
              <li><Link to="/blog">Blog</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Newest Listings */}
          <div className="newest-listings">
            <h3>Newest Listings</h3>
            <div className="listings-list">
              {newestListings.map((listing) => (
                <div key={listing.id} className="listing-item">
                  <img 
                    src={listing.image} 
                    alt={listing.title} 
                    className="listing-image"
                  />
                  <div className="listing-info">
                    <h4>{listing.title}</h4>
                    <p className="listing-price">{listing.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>Copyright 2024, Auole</p>
          <div className="social-links">
            {[
              { icon: faFacebookF, href: '#' },
              { icon: faInstagram, href: '#' },
              { icon: faTwitter, href: '#' },
              { icon: faWhatsapp, href: '#' }
            ].map((social, index) => (
              <a 
                key={index}
                href={social.href}
                className="social-link"
              >
                <FontAwesomeIcon icon={social.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer