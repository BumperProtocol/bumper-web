import ctx from "../events";

export const checkOpValid = (num) => {
    if(!ctx.data.chainAccount){
        alert('please connect the wallet')
        return false;
    }else if(num<=0){
        alert('num must more than 0')
        return false;
    }
    return true
};
