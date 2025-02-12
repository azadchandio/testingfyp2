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
import { FaAngleDoubleRight } from "react-icons/fa"; // Import double arrow icon
import './Footer.css'
import { Link } from 'react-router-dom'

const Footer = () => {
  const newestListings = [
    {
      id: 1,
      title: "Minimalist Style flat",
      price: "$ 1,800,000",
      image: "../../assets/car.png"
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
            <p>Auole is your go-to online marketplace, making buying and selling easy, secure, and efficient. Whether you're looking for great deals or want to sell your items quickly, we connect buyers and sellers across Pakistan. Join us today and experience hassle-free trading!</p>
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
                <span>auole@auole.com</span>
              </div>
            </div>
          </div>

          {/* Useful Links */}
          <div className="useful-links">
            <h3>Useful Link</h3>
            <ul className="links-list">
            <li>
              <FaAngleDoubleRight className="arrow-icon-footer" />
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <FaAngleDoubleRight className="arrow-icon-footer" />
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <FaAngleDoubleRight className="arrow-icon-footer" />
              <Link to="/team">Our Team</Link>
            </li>
            <li>
              <FaAngleDoubleRight className="arrow-icon-footer" />
              <Link to="/blog">Blog</Link>
            </li>
            <li>
              <FaAngleDoubleRight className="arrow-icon-footer" />
              <Link to="/privacy">Privacy Policy</Link>
            </li>
          </ul>

          </div>

          {/* Newest Listings */}
          <div className="newest-listings-footer">
            <h3>Newest Listings</h3>
            <div className="listings-list-footer">
              {newestListings.map((listing) => (
                <div key={listing.id} className="listing-item-footer">
                  <img 
                    src={listing.image} 
                    alt={listing.title} 
                    className="listing-image-footer"
                  />
                  <div className="listing-info-footer">
                    <h4>{listing.title}</h4>
                    <p className="listing-price-footer">{listing.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
              {/* Bottom Bar */}
              <div className="footer-bottom">
          <p>Copyright 2025, Auole</p>
          <div className="social-links">
            {[
              { icon: faFacebookF, href: 'www.facebook.com' },
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
    </footer>
  )
}

export default Footer