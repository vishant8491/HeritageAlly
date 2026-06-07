require("mongoose")
.connect(process.env.DB_KEY)
.then(()=> {
    console.log(`DataBase is Connected`)
})
.catch((error)=> {
    console.log(error)
})