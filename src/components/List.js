// display clients
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import axios from "axios";
import Utils from "./Utils";

class List extends Component {
  // id = căn cước công dân
  state = {
    list: [],
  };
  componentDidMount = async () => {
    await axios.get("http://localhost:8686/api/v1/users").then((res) => {
      let data = res.data.data;
      this.setState({
        list: data,
      });
    });
  };

  render() {
    let clients = this.state.list.map((item) => {
      return (
        <tbody key={item.id}>
          <tr>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.phone}</td>
            <td>{Utils.formatCurrency(item.balance)}</td>
            <td>
              <Button variant="contained"><Link to={"user/" + item.id}>Xem Chi Tiết</Link></Button>
            </td>
          </tr>
        </tbody>
      );
    });
    return (
      <div className="List">
        <div className="Content">
          <h2>Danh sách khách hàng</h2>
          <br />
          <table>
            <tbody>
              <tr>
                <th>CCCD</th>
                <th>Họ tên</th>
                <th>Sđt</th>
                <th>Số dư</th>
                <th>Chi tiết</th>
              </tr>
            </tbody>
            {clients}
          </table>
        </div>
      </div>
    );
  }
}

export default List;
