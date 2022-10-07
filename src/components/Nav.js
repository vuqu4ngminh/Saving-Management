import React, { Component } from "react";
import { Link } from "react-router-dom";

class Nav extends Component {
  render() {
    return (
      <ul className="Nav">
        <li>
          <Link to={'/'}>Danh Sách</Link>
        </li>
        <li>
          <Link to={'/user'}>Khách Hàng</Link>
        </li>
        <li>
          <Link to={'/terms'}>Quản Lý Lãi Suất</Link>
        </li>
      </ul>
    );
  }
}

export default Nav;
