const express = require("express")
const router = express.Router()

const FeatureRequest = require("../models/FeatureRequest")

router.get("/:slug", async(req,res)=>{

 try{

   const request = await FeatureRequest.findOne({
     pageSlug:req.params.slug
   })

   if(!request){
     return res.status(404).send("Preview not found")
   }

   res.json({
     pageSlug:request.pageSlug,
     code:request.generatedCode
   })

 }catch(err){
   res.status(500).send("Server error")
 }

})

module.exports = router
