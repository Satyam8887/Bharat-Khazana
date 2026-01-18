

const validateMobile=(number)=>{
    const mob_regex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/;
    if(mob_regex.test(number)){
        return true;
     } else {
        return false;
     }

}

export default validateMobile