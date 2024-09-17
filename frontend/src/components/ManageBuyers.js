import axios from "axios";
import { useEffect, useState } from "react";
import Button from 'react-bootstrap/Button';

export default function ManageBuyers() {

    // Check if the user is authenticated
    if (sessionStorage.getItem("sAyurCenNimda") === null) {
        window.location.replace("/adminlogin");
    }

    const [buyers, setBuyers] = useState([]);

    useEffect(() => {
        // Fetch buyers data from backend API
        const getBuyers = async () => {
            try {
                const res = await axios.get("http://localhost:8070/buyer/");
                setBuyers(res.data);
            } catch (err) {
                alert(err.message);
            }
        };
        getBuyers();
    }, []);

    // Handle delete functionality with confirmation
    const handleDelete = async (buyer) => {
        let response = window.confirm("Are you sure you want to delete this user?");
        if (response) {
            try {
                await axios.delete(`http://localhost:8070/buyer/delete/email/${buyer.email}`);
                try {
                    await axios.post(`http://localhost:8072/email/delete/${buyer.name}/${buyer.email}`);
                } catch {
                    alert("Email Service is not available.");
                }
                alert("Buyer Deleted");
                window.location.replace("http://localhost:3000/adminhome/managebuyers");
            } catch (err) {
                alert(err);
            }
        }
    };

    // Handle View and Update actions
    const handleView = (email) => {
        window.location.replace(`http://localhost:3000/adminhome/managebuyers/view/${email}`);
    };

    const handleUpdate = (email) => {
        window.location.replace(`http://localhost:3000/adminhome/managebuyers/update/${email}`);
    };

    return (
        <div className="container">
            <a href="/adminhome"><Button variant="dark">Back</Button></a>

            <center><h1>Manage Buyers</h1><br /></center>

            {buyers.length === 0 ? <h1>No Records</h1> : (
                <table className="table table-borderless">
                    <thead>
                        <tr>
                            <th><center>Name</center></th>
                            <th><center>Email</center></th>
                            <th></th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>

                    <tbody>
                        {buyers.map((buyer) => (
                            <tr key={buyer.email}>
                                <td><center>{buyer.name}</center></td>
                                <td><center>{buyer.email}</center></td>
                                <td>
                                    <button className="btn btn-success btn-sm" onClick={() => handleView(buyer.email)}>
                                        View <i className="fa fa-pencil"></i>
                                    </button>
                                </td>
                                <td>
                                    <button className="btn btn-warning btn-sm" onClick={() => handleUpdate(buyer.email)}>
                                        Update <i className="fa fa-pencil"></i>
                                    </button>
                                </td>
                                <td>
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(buyer)}>
                                        Delete <i className="fa fa-trash-o fa-lg"></i>
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
