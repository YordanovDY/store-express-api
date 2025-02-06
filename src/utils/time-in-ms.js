export const getDaysInMilliseconds = (days) => {
    days = Number(days);
    
    if(!days){
        return 1000 * 60 * 60 * 24 * 1;
    }

    return 1000 * 60 * 60 * 24 * days;
}