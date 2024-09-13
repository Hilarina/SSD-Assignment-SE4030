const router = require("express").Router();
let SellerH = require("../models/SellerH");

router.route("/add").post((req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;
  const delChrg = Number(req.body.delChrg);
  const hpw = req.body.hpw;

  const newSeller = new SellerH({
    name,
    email,
    phone,
    delChrg,
    hpw,
  });

  newSeller
    .save()
    .then(() => {
      res.json("Seller Added.");
    })
    .catch((err) => {
      console.log(err);
    });
});

router.route("/").get((req, res) => {
  SellerH.find()
    .then((seller) => {
      res.json(seller);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.route("/delete/:id").delete(async (req, res) => {
  let sellerId = req.params.id;

  await SellerH.findByIdAndDelete(sellerId)
    .then(() => {
      res.status(200).send({ status: "Seller Deleted" });
    })
    .catch((err) => {
      console.log(err.message);
      res
        .status(500)
        .send({ status: "Error with delete Seller", error: err.message });
    });
});

router.route("/get/:id").get(async (req, res) => {
  let sellerId = req.params.id;
  const seller = await SellerH.findById(sellerId)
    .then((seller) => {
      res.status(200).send({ status: "Seller fetched", seller });
    })
    .catch((err) => {
      console.log(err.message);
      res
        .status(500)
        .send({ status: "Error with get seller", error: err.message });
    });
});

router.route("/get/email/:email").get(async (req, res) => {
  let email = req.params.email;
  await SellerH.find({ email: `${email}` })
    .then((seller) => {
      res.json(seller);
    })
    .catch((err) => {
      console.log(err.message);
      res
        .status(500)
        .send({ status: "Error with get the seller", error: err.message });
    });
});

router.route("/update/:paramemail").put(async (req, res) => {
  let paramemail = req.params.paramemail;
  const { name, email, phone, hpw } = req.body;
  const delChrg = Number(req.body.delChrg);
  const updateSeller = {
    name,
    email,
    phone,
    delChrg,
    hpw,
  };

  await SellerH.findOneAndUpdate({ email: paramemail }, updateSeller)
    .then(() => {
      res.status(200).send({ status: "Seller Updated" });
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .send({ status: "Error with updating the seller", error: err.message });
    });
});

router.route("/delete/email/:paraemail").delete(async (req, res) => {
  let sellerEmail = req.params.paraemail;

  await SellerH.findOneAndDelete({ email: sellerEmail })
    .then(() => {
      res.status(200).send({ status: "Seller Deleted" });
    })
    .catch((err) => {
      console.log(err.message);
      res
        .status(500)
        .send({ status: "Error with delete Seller", error: err.message });
    });
});

module.exports = router;
