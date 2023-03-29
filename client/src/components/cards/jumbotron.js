import { React } from "react";
import Typewriter from 'typewriter-effect';

const Jumbotron =({text})=>(
    <Typewriter options={{
        strings:text,  //aray of text
        autoStart:true, //keep going continously
        loop:true       //loop continously
    }}/>
);

export default Jumbotron;