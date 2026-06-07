const Brand = require("../models/Brand")
const fs = require("fs")

async function createRecord(req, res) {
    try {
        let data = new Brand(req.body) 
        if(req.file)
            data.pic = req.file.path
            await data.save()
            res.send({
                status: "Done",
                data: data
            })
    } catch (error) {
        if(req.file){
            fs.unlinkSync(req.file.path)
        }
        let errorMessage = {}
        if (error.keyValue)
            errorMessage = "Brand With This Name Is Already Exist"
        else
            errorMessage = Object.fromEntries(Object.keys(error.errors).map(key=> [key, error.errors[key].message]))
        res.status(500).send({
            status: "Fail",
            reason: Object.keys(errorMessage).length!==0?errorMessage:"Internal Server Error"
        })
    }
}

async function getRecord(req, res) {
    try {
        let data = await Brand.find().sort({ _id: -1 })
        res.send({
            status:"Done",
            data: data
        })
    } catch (error) {
        res.status(500).send({
            status:"Fail",
            reason: "Internal Server Error"
        })
    }
}

async function getSingleRecord(req, res) {
    try {
        let data = await Brand.findOne({ _id: req.params._id })
        if(data){
        res.send({
            status:"Done",
            data: data
        })
    }
    else{
        res.status(404).send({
            status:"Fail",
            reason: "Record Not Found"
        })
    }
    } catch (error) {
        res.status(500).send({
            status:"Fail",
            reason: "Internal Server Error"
        })
    }
}

async function updateRecord(req, res) {
    try {
        let data = await Brand.findOne({ _id: req.params._id })
        if(data){
            data.name = req.body.name ?? data.name
            data.status = req.body.status ?? data.status
            if (await data.save() && req.file) {
                try {
                    fs.unlinkSync(data.pic)
                } catch (error) { }
                data.pic = req.file.path
                await data.save()
            }
            res.send({
                status:"Done",
                data: data
            })
        }
        else {
            res.status(404).send({
                status:"Fail",
                reason: "Record Not Found"
        })
    }
    } catch (error) {
        if(req.file){
            fs.unlinkSync(req.file.path)
        }
        let errorMessage = { }
        if (error.keyValue)
            errorMessage = "Brand With This Name Is Already Exist"
        else
            errorMessage = Object.fromEntries(Object.keys(error.errors).map(key=> [key, error.errors[key].message]))
        res.status(500).send({
            status: "Fail",
            reason: Object.keys(errorMessage).length!==0?errorMessage:"Internal Server Error"
        })
    }
}

async function deleteRecord(req, res) {
    try {
        let data = await Brand.findOne({ _id: req.params._id })
        if(data) {
        try {
            fs.unlinkSync(data.pic)
        } catch (error) { }
        await data.deleteOne()
    }
    res.send({
        status: "Done"
    })
    } catch (error) {
        res.status(500).send({
            status:"Fail",
            reason: "Internal Server Error"
        })
    }
}


module.exports = {
    createRecord: createRecord,
    getRecord: getRecord,
    getSingleRecord: getSingleRecord,
    updateRecord: updateRecord,
    deleteRecord: deleteRecord,
}












// import React, { useEffect, useState } from "react";
// import FormValidator from "../../Validators/FormValidator";

// export default function UpdateProfile({ setOption }) {
//   const [data, setData] = useState({
//     name: "",
//     username: "",
//     email: "",
//     phone: "",
//   });

//   const [errorMessage, setErrorMessage] = useState({
//     name: "",
//     username: "",
//     email: "",
//     phone: "",
//   });

//   const [show, setShow] = useState(false);

//   function getInputData(e) {
//     const { name, value } = e.target;
//     setData({ ...data, [name]: value });
//     setErrorMessage({ ...errorMessage, [name]: FormValidator(e) });
//   }

//   useEffect(() => {
//     (async () => {
//       let response = await fetch(
//         `${import.meta.env.VITE_APP_BACKEND_SERVER}/user/${localStorage.getItem("userid")}`,
//         {
//           headers: {
//             "content-type": "application/json",
//             "authorization": localStorage.getItem("token")
//           }
//         })
//       response = await response.json();
//       setData({ ...data, ...response?.data});
//     })()
//   }, [])

//   async function postData(e) {
//     e.preventDefault();

//     const error = Object.values(errorMessage).find((x) => x !== "");
//     if (error) {
//       setShow(true);
//       return;
//     }

//     let response = await fetch(`${import.meta.env.VITE_APP_BACKEND_SERVER}/user`);
//     response = await response.json();

//     const currentUserId = localStorage.getItem("userid");
//     const duplicateUser = response.find(
//       (x) =>
//         x.id !== currentUserId &&
//         (x.username?.toLowerCase() === data.username?.toLowerCase() ||
//           x.email?.toLowerCase() === data.email?.toLowerCase())
//     );

//     setShow(true);

//     if (duplicateUser) {
//       setErrorMessage({
//         ...errorMessage,
//         username:
//           duplicateUser.username?.toLowerCase() === data.username?.toLowerCase()
//             ? "Username Already Taken"
//             : "",
//         email:
//           duplicateUser.email?.toLowerCase() === data.email?.toLowerCase()
//             ? "Email Address Already Taken"
//             : "",
//       });
//       return;
//     }

//     let updateResponse = await fetch(
//       `${import.meta.env.VITE_APP_BACKEND_SERVER}/user/${currentUserId}`,
//       {
//         method: "PUT",
//         headers: {
//           "content-type": "application/json",
//         },
//         body: JSON.stringify({ ...data }),
//       }
//     );

//     updateResponse = await updateResponse.json();

//     if (updateResponse) {
//       setOption("Profile");
//     } else {
//       alert("Something Went Wrong");
//     }
//   }

//   return (
//     <form onSubmit={postData}>
//       <div className="row">
//         <div className="col-lg-6 mb-3">
//           <label>Name*</label>
//           <input
//             type="text"
//             onChange={getInputData}
//             name="name"
//             value={data.name}
//             placeholder="Full Name"
//             className={`form-control ${show && errorMessage.name ? "border-danger" : "border-primary"}`}
//           />
//           {show && errorMessage.name ? <p className="text-danger">{errorMessage.name}</p> : null}
//         </div>

//         <div className="col-lg-6 mb-3">
//           <label>Phone*</label>
//           <input
//             type="text"
//             onChange={getInputData}
//             name="phone"
//             value={data.phone}
//             placeholder="Phone Number"
//             className={`form-control ${show && errorMessage.phone ? "border-danger" : "border-primary"}`}
//           />
//           {show && errorMessage.phone ? <p className="text-danger">{errorMessage.phone}</p> : null}
//         </div>

//         <div className="col-lg-6 mb-3">
//           <label>Username*</label>
//           <input
//             type="text"
//             onChange={getInputData}
//             name="username"
//             value={data.username}
//             placeholder="Enter the Username"
//             className={`form-control ${show && errorMessage.username ? "border-danger" : "border-primary"}`}
//           />
//           {show && errorMessage.username ? <p className="text-danger">{errorMessage.username}</p> : null}
//         </div>

//         <div className="col-lg-6 mb-3">
//           <label>Email*</label>
//           <input
//             type="email"
//             onChange={getInputData}
//             name="email"
//             value={data.email}
//             placeholder="Enter Your Email"
//             className={`form-control ${show && errorMessage.email ? "border-danger" : "border-primary"}`}
//           />
//           {show && errorMessage.email ? <p className="text-danger">{errorMessage.email}</p> : null}
//         </div>

//         <div className="col-12 mb-3">
//           <button type="submit" className="btn btn-primary w-100">
//             Update
//           </button>
//         </div>
//       </div>
//     </form>
//   )
// }