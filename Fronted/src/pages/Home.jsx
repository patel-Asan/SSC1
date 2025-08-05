import React from "react";
import Hero from "../componet/Hero";
import Latestcollection from "../componet/latestcollection"
import Bestseller from "../componet/bsetseller";
import Ourpolicy from "../componet/ourpolicy";
import Newletterbox from "../componet/newletterbox";

const Home=() =>{
    return(
        <div>
            <Hero />
            <Latestcollection />
            <Bestseller />
            <Ourpolicy />
            <Newletterbox />
        </div>
    )
    }
    export default Home