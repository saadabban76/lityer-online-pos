import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const Sidenav = () => {
  return (
    <aside className="sidebar">
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
          <NavLink to="/" className="nav-link">
            <i className="bi bi-grid"></i>
            <span>Home</span>
          </NavLink>
        </li>

        <li className="nav-item">
          <Link
            to="/"
            className="nav-link collapsed"
            data-target="#Orders-nav"
            data-toggle="collapse"
          >
            <i className="bi bi-cart3"></i>
            <span>Orders</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </Link>
          <ul id="Orders-nav" className="nav-content collapse" data-parent="#sidebar-nav">
            <li>
              <NavLink to="/draft">
                <i className="bi bi-circle"></i>
                <span>Draft</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/abandoned-checkout">
                <i className="bi bi-circle"></i>
                <span>Abandoned Checkout</span>
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="nav-item">
          <Link
            to="/"
            className="nav-link collapsed"
            data-target="#Products-nav"
            data-toggle="collapse"
          >
            <i className="bi bi-box"></i>
            <span>Products</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </Link>
          <ul id="Products-nav" className="nav-content collapse" data-parent="#sidebar-nav">
            <li>
              <NavLink to="/addproducts">
                <i className="bi bi-circle"></i>
                <span>Add product</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/collections">
                <i className="bi bi-circle"></i>
                <span>Collections</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/inventory">
                <i className="bi bi-circle"></i>
                <span>Inventory</span>
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="nav-item">
          <Link
            to="/"
            className="nav-link collapsed"
            data-target="#Customers-nav"
            data-toggle="collapse"
          >
            <i className="bi bi-person"></i>
            <span>Customers</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </Link>
          <ul id="Customers-nav" className="nav-content collapse" data-parent="#sidebar-nav">
            <li>
              <NavLink to="/segment">
                <i className="bi bi-circle"></i>
                <span>Segment</span>
              </NavLink>
            </li>
          </ul>
        </li>

        <li className="nav-heading">Pages</li>

        <li className="nav-item">
          <NavLink to="/contact" className="nav-link collapsed">
            <i className="bi bi-envelope"></i>
            <span>Contact</span>
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidenav;
