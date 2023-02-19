const router = require("express").Router();
let Seller = require("../models/Seller");

router.route("/add").post((req, res)=>{
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const password = req.body.password;


    const newSeller = new Seller({
        name,
        email,
        phone,
        password
    })

    newSeller.save().then(()=>{
        res.json("Seller Added.");
    }).catch((err)=>{
        console.log(err);
    })
})

router.route("/").get((req, res)=>{
    Seller.find().then((seller)=>{
        res.json(seller);
    }).catch((err)=>{
        console.log(err);
    })
})

router.route("/delete/:id").delete(async(req, res)=>{
    let sellerId = req.params.id;

    await Seller.findByIdAndDelete(sellerId).then(()=>{
        res.status(200).send({status: "Seller Deleted"});
    }).catch((err)=>{
        console.log(err.message);
        res.status(500).send({status: "Error with delete Seller", error: err.message});
    })
})

router.route("/get/:id").get(async(req, res)=>{
    let sellerId = req.params.id;
    const seller = await Seller.findById(sellerId).then((seller)=>{
        res.status(200).send({status: "Seller fetched", seller})
    }).catch((err)=>{
        console.log(err.message);
        res.status(500).send({status: "Error with get seller", error: err.message});
    })
})

router.route("/get/email/:email").get(async(req, res)=>{
    let email = req.params.email;
    await Seller.find({"email": `${email}`}).then((seller)=>{
        res.json(seller);
    }).catch((err)=>{
        console.log(err.message);
        res.status(500).send({status: "Error with get the seller", error: err.message});
    })
})

module.exports = router;