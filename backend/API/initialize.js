
const  axios  = require('axios');
const express = require('express');
const transaction_schema = require("../Models/transiton_model");
const initialize = async(req,res) =>{
            
    try{
                     const response = await axios.get(`https://s3.amazonaws.com/roxiler.com/product_transaction.json`)
                    for(const item of response.data){
                        await transaction_schema.create(item);
                    }
                     return res.status(200).send({
                        status:200,
                        message:"successfully",
                        data:response.data
                     })
    }
    catch(err){
           return res.status(400).send({
            status:400,
            message:"Failed to fetch",
            data:err
           })
    }

}


module.exports = initialize;