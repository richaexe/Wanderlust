const Listing = require('../models/listing.js');
const mbxGeocding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapTocken = process.env.MAP_TOCKEN;
const geocodingClient = mbxGeocding({ accessToken: mapTocken });

module.exports.index = async(req,res)=>{
    const allListings = await Listing.find({});
    res.render('listings/index.ejs',{allListings})
}

module.exports.renderNewForm = (req,res)=>{
    res.render('listings/new.ejs')
}
module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()
    let url = req.file.path;
    let filname = req.file.filname;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image ={url,filname};
    newListing.geometry = response.body.features[0].geometry;
    let saved = await newListing.save();
    req.flash('success', 'New Listing Created!');
    res.redirect('/listings');
}

module.exports.showListing = async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path:'reviews',populate :{path:'author'}}).populate('owner');
    if (!listing) {
        req.flash('error', 'Listing you requested for does not exist!');
        return res.redirect('/listings');
    }
    res.render('listings/show.ejs', { listing });
}

module.exports.editListing = async(req,res)=>{
    let {id}= req.params;
    const listing = await Listing.findById(id);
    if(!listing){
         req.flash('error','Listing you requested for does not exist!');
         res.redirect('/listings')
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl =originalImageUrl.replace('/upload','/upload/h_300,w_250')
    res.render('listings/edit.ejs',{listing,originalImageUrl});
}

module.exports.updateListing = async(req,res)=>{
    let {id} = req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if( typeof req.file!=='undefined'){
    let url = req.file.path;
    let filname = req.file.filname;
    listing.image ={url,filname};
    await listing.save()
    }
    req.flash('success', 'Listing Updated!');
    res.redirect(`/listings/${id}`);
}
module.exports.deleteListing = async(req,res)=>{
    let {id}= req.params;
    console.log(id);
    const res1 = await Listing.findByIdAndDelete(id);
    console.log(res1);
    req.flash('success', 'Listing Deleted');
    res.redirect('/listings');
}