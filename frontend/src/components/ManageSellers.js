import axios from "axios";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";

export default function ManageSellers() {
  if (sessionStorage.getItem("sAyurCenNimda") === null) {
    window.location.replace("/adminlogin");
  }

  const [sellers, setSellers] = useState([]);
  const [csrfToken, setCsrfToken] = useState("");

  useEffect(()=>{
    axios.get('http://localhost:8070/csrf-token', {withCredentials:true})
    .then((res)=> setCsrfToken(res.data.csrfToken))
    .catch((err)=>console.error("Error fetching CSRF token"));
}, []);

  useEffect(() => {
    function getSellers() {
      axios
        .get("http://localhost:8070/sellerH/")
        .then((res) => {
          setSellers(res.data);
        })
        .catch((err) => {
          alert(err.message);
        });
    }
    getSellers();
  }, []);

  return (
    <div className="container">
      <a href="/adminhome">
        <Button variant="dark" style={{ marginLeft: "10px" }}>
          Back
        </Button>
      </a>
      <h1>
        <center>Manage Sellers</center>
      </h1>

      <a href="/adminhome/managesellers/add">
        <button className="btn btn-success" style={{ float: "right" }}>
          Add
        </button>
      </a>

      {sellers.length === 0 && <h1>No Records</h1>}

      {sellers.length !== 0 && (
        <table className="table table-borderless">
          <tr>
            <th>
              <center>Name</center>
            </th>
            <th>
              <center>Email</center>
            </th>
            <th></th>
            <th></th>
            <th></th>
          </tr>

          <tbody>
            {sellers.map((seller) => (
              <tr>
                <td>
                  <center>{seller.name}</center>
                </td>
                <td>
                  <center>{seller.email}</center>
                </td>
                <td>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => {
                      window.location.replace(
                        `http://localhost:3000/adminhome/managesellers/view/${seller.email}`
                      );
                    }}
                  >
                    View <i class="fa fa-pencil"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => {
                      window.location.replace(
                        `http://localhost:3000/adminhome/managesellers/update/${seller.email}`
                      );
                    }}
                  >
                    Update <i class="fa fa-pencil"></i>
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      var response = window.confirm(
                        "Are you sure you want to delete this user?"
                      );
                      if (response) {
                        axios
                          .delete(
                            `http://localhost:8070/sellerH/delete/email/${seller.email}`
                            , {
                              headers: {
                                "CSRF-Token": csrfToken,
                              },
                              withCredentials: true,
                            })
                          .then(() => {
                            alert("Seller Deleted");
                            window.location.replace(
                              "http://localhost:3000/adminhome/managesellers"
                            );
                          })
                          .catch((err) => {
                            alert(err);
                          });
                      }
                    }}
                  >
                    Delete <i class="fa fa-trash-o fa-lg"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
