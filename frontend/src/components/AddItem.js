
import React, { useEffect, useState } from "react";
import FileBase64 from 'react-file-base64';
//import ReactDOM from 'react-dom';
//Import axios from the axios package we installed.This is needed to move the data from the frontend to the backend via an http request
import axios from "axios";
//const fs = require('fs');
import Button from 'react-bootstrap/Button';
import DOMPurify from 'dompurify';

export default function AddItem() {

    if(sessionStorage.getItem("sAyurCenRelles") === null){
        window.location.replace("/sellerlogin");
    }

    //Create 3 variables/states for name,age and gender
    const [ProductId,setItemCode] = useState("");
    const [Name, setItemName] = useState("");
    const [Description,setItemDescription] = useState("");
    const [Price,setItemPrice] = useState();
    const [Quantity, setItemQty] = useState();
    const [Image, setImage] = useState("");
    const [productIds, setProductIds] = useState([]);


    const SupplierId = sessionStorage.getItem("sellerEmail");

    const [block, setBlock] = useState(false);


    useEffect(() => {
        axios.get("http://localhost:8070/item/").then((res) => {
            console.log(res.data);
            setProductIds(res.data.ProductId);
           // setInventories(res.data);
            // console.log(inventories[1].ItemCode);
        }).catch((err) => {
            alert(err.message);
        })
    }, [])

  

//     function handleProductImageChange (event) {
//     const imageFile = event.target.files[0];
//     var reader = new FileReader();
//     reader.readAsDataURL(imageFile);
//     reader.onload = () => {
//         setImage(reader.result);
//         console.log(reader.result); //converts to base64.
//     };
//     reader.onerror = error => {
//         console.log("Error : ",error);
//     };
    
//   };

function handleProductImageChange(event) {
    const imageFile = event.target.files[0];

    // File type validation (only allow JPEG and PNG)
    const validImageTypes = ['image/jpeg', 'image/png'];
    if (!validImageTypes.includes(imageFile.type)) {
        alert("Please upload a valid image file (JPEG or PNG).");
        return;
    }

    // File size validation (set a max limit, e.g., 5MB)
    const maxFileSize = 5 * 1024 * 1024; // 5MB
    if (imageFile.size > maxFileSize) {
        alert("File size too large. Please upload an image smaller than 5MB.");
        return;
    }

    // FileReader to convert the image to base64
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);
    reader.onload = () => {
        setImage(reader.result); // Set the base64 string
        console.log(reader.result); // Log base64 string for debugging
    };
    reader.onerror = error => {
        console.log("Error reading file: ", error);
        alert("An error occurred while reading the file. Please try again.");
    };
}



    function sendData(e) {
        //The below code prevents the normal behaviour of the submit button.
        e.preventDefault();

        const cleanName = DOMPurify.sanitize(Name);
        const cleanDescription = DOMPurify.sanitize(Description);


        //Create a javascript object. That passes the 3 attributes.
        const newItem = {
            SupplierId,
            ProductId,
            Name : cleanName,
            Description: cleanDescription, 
            Price,
            Quantity, 
            Image
        }




        //We pass the data from the frontend to the backend using the post http request.
        //Then the backend server responds with another http request.
        //This http response coming from the backend is handled using a seperate npm package called "axios" --> this is imported at the top following the installation.
        //axios has a method called post that passes 3 arguments usually, if there is authentication(No authentication meaning --> only 2 parameters)
        //Pass the backend URL as the first parameter.
        //Pass the JS object next as the second parameter, that holds the 3 attributes passed through the form.


        //METHOD TO PREVENT DUPLICATE RECORDS ENTERED.
        /*
            const len = productIds.length;
            let i;
            let count;
            for(i = 0; i < len; i++){
                if(productIds[i] == newItem.ProductId){
                    alert("Existing Product ID cannot be entered");
                    count++;
                }
            }

          if(count == 0 ){ 
        */
        if (block === false){
            axios.post(`http://localhost:8070/item/add/`, newItem).then(() => {
                //After sending the data --> backend server responds --> if successfully added then an alert message is sent.
                alert(`Item Added`);
                window.location.replace("http://localhost:3000/sellerhome/item");


                //After submitting the details ---> the values should be taken off from the fields ---> to do this --> the setters are assigned with ("")
                setItemCode("");
                setItemName("");
                setItemDescription("");
                setItemPrice();
                setItemQty();
                setImage("");

                //Can move to the home page after deleting the data
                // window.location.replace("http://localhost:3000/item");

                //can move to the add student page after deleting the data.  
                //window.location.replace("http://localhost:3000/inventory/add");
            }).catch((err) => {
                //After sending the data --> backend server responds --> if it wasn't successfully added --> the error is handled as an exception.
                alert(err);
            })
            //Pass the js object that we created in the console.(This will display the name, age,gender that's passed).
            //console.log(newStudent);
        } else {
            alert("This Product ID is already existing!")
        }
    }

    function checkItemCode(itemCode){
        axios.get(`http://localhost:8070/item/getitem/${itemCode}`).then((res)=>{
            if (res.data.length !== 0){
                console.log(itemCode);
                setBlock(true);
            } else {
                setBlock(false);
            }
        })
        console.log(block)
    }

// --> closing bracket of "Duplicate Record methods"}

    return (
        <div className="container">
            <a href = "/sellerhome/item"><Button variant="dark">Back</Button></a> {'  '}
             <center><h1>Add Item</h1> </center>
            
            <form onSubmit={sendData}>
                <div className="form-group"  >
                    <div style={{ marginLeft: "0px", marginRight: "auto", width: "10%" }}>
                        <label for="name">Item Code</label>
                    </div>

                    <div class="col-sm-10">
                        <input type="text" className="form-control" required pattern ="[P][0-9]{3}" title="Has to be of 4 characters"  id="code" placeholder="Enter item code" onChange={(e) => {
                            setItemCode(e.target.value);
                            checkItemCode(e.target.value);
                        }} />
                        <div required/>
                    </div>
                </div>
                <div className="form-group">
                    <div style={{ marginLeft: "0px", marginRight: "auto", width: "10%" }}>
                        <label for="description">Item Name</label>
                    </div>

                    <div class="col-sm-10">
                        <input type="text" className="form-control" id="name" pattern="[a-zA-Z\s]+" required placeholder="Enter Name" onChange={(e) => {
                            setItemName(e.target.value);
                        }} />
                    </div>
                </div>
                <div className="form-group">
                    <div style={{ marginLeft: "0px", marginRight: "auto", width: "30%" }}>
                        <label for="description">Item Description</label>
                    </div>

                    <div class="col-sm-10">
                        <input type="text" className="form-control" pattern="[a-zA-Z\s]+" required id="description"  placeholder="Enter Description" onChange={(e) => {
                            setItemDescription(e.target.value);
                        }} />
                    </div>
                </div>

                <div className="form-group">
                    <div style={{ marginLeft: "0px", marginRight: "auto", width: "10%" }}>
                        <label for="quantity">Item Price</label>
                    </div>

                    <div class="col-sm-10">
                        <input type="number" className="form-control" required id="price" min="0" placeholder="Enter Price " onChange={(e) => {
                            setItemPrice(e.target.value);
                            
                        }} />
                    </div>
                </div>

                <div className="form-group">
                    <div style={{ marginLeft: "0px", marginRight: "auto", width: "10%" }}>
                        <label for="quantity">Quantity</label>
                    </div>

                    <div class="col-sm-10">
                        <input type="number" className="form-control" required id="quantity" min="0" placeholder="Enter Quantity " onChange={(e) => {
                            setItemQty(e.target.value);
                        }}/>
                    </div>
                </div>

                <div class="col-sm-10">
                    <label htmlFor="item_image">Image</label>
                        <input type="file" id="image" placeholder="Upload Image" required onChange={(e)=>{
                        handleProductImageChange(e);
            }}/>
            
            
            </div>
            <br></br>
                
            <button type="submit" class="btn btn-success" style={{float: 'right'}}>Submit</button>

                
            </form>
           
        </div>
    )
}

