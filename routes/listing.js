const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const {listingSchema} = require('../schema.js');
const Listing = require('../models/listing.js');

const validateListing =(req,res,next)=>{
    let {error} = listingSchema.validate(req.body)
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(',');
        throw new ExpressError(400,error)
    }else{
        next();
    }
}

//Index Route
router.get('/', wrapAsync(async(req,res)=>{
    const allListings = await Listing.find({});
    res.render('listings/index.ejs',{allListings})
}))
 
//New Route
router.get('/new', wrapAsync((req,res)=>{
     res.render('listings/new.ejs')
}))
 
//Create Route
router.post('/', validateListing, wrapAsync(async (req, res, next) => {
     const newListing = new Listing(req.body.listing);
     await newListing.save();
     req.flash('success', 'New Listing Created!');
     res.redirect('/listings');
}));
 
//Show Route
router.get('/:id', wrapAsync(async(req, res) => {
     let {id} = req.params;
     const listing = await Listing.findById(id).populate('reviews');
     if (!listing) {
         req.flash('error', 'Listing you requested for does not exist!');
         return res.redirect('/listings');
     }
     res.render('listings/show.ejs', { listing });
 }));
 
 
//Edit Route
router.get('/:id/edit',wrapAsync(async(req,res)=>{
     let {id}= req.params;
     const listing = await Listing.findById(id);
     if(!listing){
          req.flash('error','Listing you requested for does not exist!');
          res.redirect('/listings')
     }
     res.render('listings/edit.ejs',{listing});
}))
 
//Update Route
router.put('/:id',validateListing, wrapAsync(async(req,res)=>{
     let {id} = req.params;
     await Listing.findByIdAndUpdate(id,{...req.body.listing});
     req.flash('success', 'Listing Updated!');
     res.redirect('/listings');
}))
 
//Delete Route
router.delete('/:id',wrapAsync(async(req,res)=>{
     let {id}= req.params;
     console.log(id);
     const res1 = await Listing.findByIdAndDelete(id);
     console.log(res1);
     req.flash('success', 'Listing Deleted');
     res.redirect('/listings');
}));

module.exports = router;